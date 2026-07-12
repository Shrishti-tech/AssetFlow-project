import AssetStatusBadge from "./AssetStatusBadge";

export default function AssetTable({
  assets = [],
  onView,
  onEdit,
  onDelete,
  emptyMessage = "No assets found.",
}) {
  return (
    <div className="asset-table-card">
      <div className="asset-table-head">
        <h3>Asset Inventory</h3>
        <span>{assets.length} assets</span>
      </div>

      {assets.length === 0 ? (
        <div className="asset-table-empty">{emptyMessage}</div>
      ) : (
        <div className="asset-table-wrap">
          <table className="asset-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Asset Tag</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Department</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id || asset.assetTag}>
                  <td>
                    <div className="asset-table-image">
                      {asset.imageUrl ? (
                        <img src={asset.imageUrl} alt={asset.name} />
                      ) : (
                        <span>{asset.name?.slice(0, 1) || "A"}</span>
                      )}
                    </div>
                  </td>
                  <td>{asset.assetTag}</td>
                  <td>
                    <div className="asset-table-name">
                      <strong>{asset.name}</strong>
                      {asset.serialNumber ? (
                        <small>{asset.serialNumber}</small>
                      ) : null}
                    </div>
                  </td>
                  <td>{asset.category}</td>
                  <td>
                    <AssetStatusBadge status={asset.status} />
                  </td>
                  <td>{asset.department}</td>
                  <td>{asset.location}</td>
                  <td>
                    <div className="asset-table-actions">
                      {onView ? (
                        <button
                          type="button"
                          className="asset-action-btn"
                          onClick={() => onView(asset)}
                        >
                          View
                        </button>
                      ) : null}
                      {onEdit ? (
                        <button
                          type="button"
                          className="asset-action-btn asset-action-btn--ghost"
                          onClick={() => onEdit(asset)}
                        >
                          Edit
                        </button>
                      ) : null}
                      {onDelete ? (
                        <button
                          type="button"
                          className="asset-action-btn asset-action-btn--danger"
                          onClick={() => onDelete(asset)}
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
