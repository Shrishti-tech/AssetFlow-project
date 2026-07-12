import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../../auth/services/authService'
import { useAuth } from '../../auth/hooks/useAuth'

const AssetContext = createContext(null)
const capitalize = (value = '') => value ? value.charAt(0).toUpperCase() + value.slice(1) : value

const normalize = (asset) => {
  const history = []
  if (asset.updatedAt && asset.updatedAt !== asset.createdAt) history.push({ title: 'Asset updated', date: new Date(asset.updatedAt).toLocaleDateString(), detail: 'Asset details were updated.' })
  if (asset.createdAt) history.push({ title: 'Asset registered', date: new Date(asset.createdAt).toLocaleDateString(), detail: `Added to the ${asset.department || 'asset'} inventory.` })
  return { ...asset, id: asset._id, status: capitalize(asset.status), history }
}

const sanitize = (data) => {
  const payload = { ...data }
  delete payload.id; delete payload._id; delete payload.assetTag; delete payload.history; delete payload.createdBy; delete payload.createdAt; delete payload.updatedAt
  if (!payload.serialNumber) delete payload.serialNumber
  if (!payload.acquisitionDate) delete payload.acquisitionDate
  payload.acquisitionCost = payload.acquisitionCost === '' || payload.acquisitionCost === undefined ? undefined : Number(payload.acquisitionCost)
  if (payload.acquisitionCost === undefined) delete payload.acquisitionCost
  if (payload.status) payload.status = payload.status.toLowerCase()
  return payload
}

export function AssetProvider({ children }) {
  const { user } = useAuth()
  const [assets, setAssets] = useState([])
  const [nextTag] = useState(() => `AF-${String(Date.now()).slice(-6)}`)

  const load = async () => {
    try { const { data } = await api.get('/assets', { params: { limit: 100 } }); setAssets(data.assets.map(normalize)) }
    catch { setAssets([]) }
  }
  useEffect(() => { if (user) load(); else setAssets([]) }, [user])

  const value = useMemo(() => ({
    assets,
    nextTag,
    create: async (data) => { const { data: res } = await api.post('/assets', sanitize(data)); await load(); return normalize(res.asset) },
    update: async (id, data) => { const { data: res } = await api.put(`/assets/${id}`, sanitize(data)); await load(); return normalize(res.asset) },
    remove: async (id) => { await api.delete(`/assets/${id}`); await load() },
    get: (id) => assets.find((asset) => asset.id === id),
  }), [assets, nextTag])
  return createElement(AssetContext.Provider, { value }, children)
}
export const useAssets = () => useContext(AssetContext)
