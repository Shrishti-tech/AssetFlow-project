import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react'

const AssetContext = createContext(null)
const storageKey = 'assetflow-assets'
const seed = [{ id: 'asset-1001', name: 'Dell Latitude 7420', category: 'Laptop', assetTag: 'AF-1001', serialNumber: 'DL7420-9X', acquisitionDate: '2025-08-12', acquisitionCost: '98000', condition: 'Good', location: 'Floor 3, Room 301', department: 'IT', shared: false, status: 'Allocated', documents: [], history: [{ title: 'Asset registered', date: '12 Aug 2025', detail: 'Added to IT inventory.' }] }]

const readAssets = () => { try { return JSON.parse(localStorage.getItem(storageKey)) || seed } catch { return seed } }
const tagFor = () => `AF-${String(Date.now()).slice(-6)}`

export function AssetProvider({ children }) {
  const [assets, setAssets] = useState(readAssets)
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(assets)), [assets])
  const value = useMemo(() => ({
    assets,
    create: (data) => { const asset = { ...data, id: crypto.randomUUID(), assetTag: tagFor(), status: data.shared ? 'Available' : 'Unassigned', history: [{ title: 'Asset registered', date: new Date().toLocaleDateString(), detail: 'Added to the asset directory.' }] }; setAssets((items) => [asset, ...items]); return asset },
    update: (id, data) => setAssets((items) => items.map((asset) => asset.id === id ? { ...asset, ...data, history: [{ title: 'Asset updated', date: new Date().toLocaleDateString(), detail: 'Asset details were updated.' }, ...(asset.history || [])] } : asset)),
    remove: (id) => setAssets((items) => items.filter((asset) => asset.id !== id)),
    get: (id) => assets.find((asset) => asset.id === id),
    nextTag: tagFor(),
  }), [assets])
  return createElement(AssetContext.Provider, { value }, children)
}
export const useAssets = () => useContext(AssetContext)
