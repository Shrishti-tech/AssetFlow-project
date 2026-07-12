import { useNavigate, useParams } from 'react-router-dom'
import { useAssets } from '../services/assetService'
import AssetForm from '../components/AssetForm/AssetForm'
import Loader from '../components/Common/Loader'
import '../styles/asset.css'
export default function EditAsset() { const { id } = useParams(); const { get, update } = useAssets(); const navigate = useNavigate(); const asset = get(id); if (!asset) return <main className="asset-page"><Loader /></main>; return <main className="asset-page"><AssetForm initialAsset={asset} onSave={(data) => { update(id, data); navigate(`/assets/${id}`) }} saveLabel="Save changes" /></main> }
