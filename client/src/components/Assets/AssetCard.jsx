import AssetStatusBadge from "./AssetStatusBadge";

export default function AssetCard({ asset, onView }) {
  return (
    <div className="asset-card">
      <div className="asset-card-image">
        {asset.imageUrl ? (
          <img src={asset.imageUrl} alt={asset.name} />
        ) : (
          <span>{asset.name?.slice(0, 1) || "A"}</span>
        )}
      </div>

      <div className="asset-card-body">
        <div className="asset-card-top">
          <div>
            <h4>{asset.name}</h4>
            <p>{asset.assetTag}</p>
          </div>
          <AssetStatusBadge status={asset.status} />
        </div>

        <div className="asset-card-meta">
          <span>{asset.category}</span>
          <span>{asset.department}</span>
          <span>{asset.location}</span>
        </div>

        {onView ? (
          <button
            type="button"
            className="asset-primary-btn asset-primary-btn--small"
            onClick={() => onView(asset)}
          >
            View Details
          </button>
        ) : null}
      </div>
    </div>
  );
}
