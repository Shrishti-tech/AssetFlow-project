import { useNavigate } from 'react-router-dom'
import { useAssets } from '../services/assetService'
import AssetForm from '../components/AssetForm/AssetForm'
import '../styles/asset.css'
export default function RegisterAsset() { const { create, nextTag } = useAssets(); const navigate = useNavigate(); return <main className="asset-page"><AssetForm assetTag={nextTag} onSave={(data) => navigate(`/assets/${create(data).id}`)} saveLabel="Save asset" /></main> }
