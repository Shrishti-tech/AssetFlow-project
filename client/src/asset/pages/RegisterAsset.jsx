import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssets } from '../services/assetService'
import AssetForm from '../components/AssetForm/AssetForm'
import '../styles/asset.css'
export default function RegisterAsset() {
  const { create, nextTag } = useAssets(); const navigate = useNavigate(); const [error, setError] = useState('')
  const save = async (data) => {
    try { const asset = await create(data); navigate(`/assets/${asset.id}`) }
    catch (err) { setError(err.response?.data?.message || 'Unable to register this asset.') }
  }
  return <main className="asset-page">{error && <p className="asset-error">{error}</p>}<AssetForm assetTag={nextTag} onSave={save} saveLabel="Save asset" /></main>
}
