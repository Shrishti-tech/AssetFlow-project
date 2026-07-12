import { Link, useParams } from 'react-router-dom'
import { useAssets } from '../services/assetService'
import Timeline from '../components/History/Timeline'
import AllocationHistory from '../components/History/AllocationHistory'
import MaintenanceHistory from '../components/History/MaintenanceHistory'
import Loader from '../components/Common/Loader'
import '../styles/asset.css'
export default function AssetHistory() { const { id } = useParams(); const { get } = useAssets(); const asset = get(id); if (!asset) return <main className="asset-page"><Loader /></main>; return <main className="asset-page"><Link to={`/assets/${id}`}>Back to asset</Link><h1>{asset.name} history</h1><Timeline events={asset.history} /><div className="asset-history-grid"><AllocationHistory asset={asset} /><MaintenanceHistory asset={asset} /></div></main> }
