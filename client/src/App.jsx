import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/context/AuthContext'
import { AuthLayout } from './auth/components/AuthLayout'
import Login from './auth/pages/Login'
import Signup from './auth/pages/Signup'
import ForgotPassword from './auth/pages/ForgotPassword'
import ResetPassword from './auth/pages/ResetPassword'
import ProtectedRoute from './auth/routes/ProtectedRoute'
import Dashboard from './dashboard/Dashboard'
import './styles.css'

export default function App() {
  return <BrowserRouter><AuthProvider><Routes>
    <Route element={<AuthLayout />}>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Route>
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes></AuthProvider></BrowserRouter>
}
