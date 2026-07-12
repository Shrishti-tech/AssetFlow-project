import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAssets } from '../services/assetService'
import AssetForm from '../components/AssetForm/AssetForm'
import Loader from '../components/Common/Loader'
import '../styles/asset.css'
export default function EditAsset() {
  const { id } = useParams(); const { get, update } = useAssets(); const navigate = useNavigate(); const [error, setError] = useState('')
  const asset = get(id); if (!asset) return <main className="asset-page"><Loader /></main>
  const save = async (data) => {
    try { await update(id, data); navigate(`/assets/${id}`) }
    catch (err) { setError(err.response?.data?.message || 'Unable to save changes to this asset.') }
  }
  return <main className="asset-page">{error && <p className="asset-error">{error}</p>}<AssetForm initialAsset={asset} onSave={save} saveLabel="Save changes" /></main>
}
