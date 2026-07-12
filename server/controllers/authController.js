import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { User } from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

const publicUser = (user) => ({ id: user._id, fullName: user.fullName, email: user.email, role: user.role, status: user.status })
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function signup(req, res, next) {
  try {
    const { fullName, email, password, confirmPassword } = req.body
    if (!fullName?.trim() || !emailPattern.test(email || '') || !password) return res.status(400).json({ message: 'Enter a valid name, email, and password.' })
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' })
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match.' })
    if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with this email already exists.' })
    const user = await User.create({ fullName, email, password: await bcrypt.hash(password, 12), role: 'Employee', status: 'Active' })
    res.status(201).json({ message: 'Account created. Please sign in.', user: publicUser(user) })
  } catch (error) { next(error) }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email?.toLowerCase() }).select('+password')
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password.' })
    if (user.status !== 'Active') return res.status(403).json({ message: 'This account is inactive. Contact an administrator.' })
    const token = generateToken(user._id.toString())
    res.cookie('access_token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 60 * 60 * 1000 })
    res.json({ user: publicUser(user) })
  } catch (error) { next(error) }
}

export async function currentUser(req, res) { res.json({ user: publicUser(req.user) }) }
export async function logout(_req, res) { res.clearCookie('access_token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }); res.status(204).end() }

export async function forgotPassword(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() }).select('+passwordResetToken +passwordResetExpires')
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex')
      user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
      user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000)
      await user.save()
      // Send this URL with your transactional mail provider in production.
      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`
      if (process.env.NODE_ENV !== 'production') return res.json({ message: 'Reset link generated.', resetUrl })
    }
    res.json({ message: 'If an account exists, a password reset link has been sent.' })
  } catch (error) { next(error) }
}

export async function resetPassword(req, res, next) {
  try {
    const { token } = req.params
    const { password, confirmPassword } = req.body
    if (!password || password.length < 8 || password !== confirmPassword) return res.status(400).json({ message: 'Use matching passwords of at least 8 characters.' })
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: new Date() } }).select('+passwordResetToken +passwordResetExpires')
    if (!user) return res.status(400).json({ message: 'This reset link is invalid or has expired.' })
    user.password = await bcrypt.hash(password, 12)
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.json({ message: 'Password reset successfully. Please sign in.' })
  } catch (error) { next(error) }
}
