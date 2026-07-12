export default function AssetStatusBadge({ status }) { return <span className={`asset-status ${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span> }
