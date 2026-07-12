import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VerificationForm from "../../components/Audit/VerificationForm";
import AuditStatusBadge from "../../components/Audit/AuditStatusBadge";
import { useAuth } from "../../auth/hooks/useAuth";
import { getAssets } from "../../services/assetService";
import { getAuditCycleDetails, verifyAsset } from "../../services/auditService";
import "./audit.css";

export default function AuditVerification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [details, setDetails] = useState(null);
  const [assets, setAssets] = useState([]);
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      const [detailData, assetData] = await Promise.all([getAuditCycleDetails(id), getAssets({ limit: 100 })]);
      setDetails(detailData);
      setAssets(Array.isArray(assetData) ? assetData : assetData?.assets || []);
    } catch {
      setNotice("Unable to load audit verification details.");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isAssigned = (details?.assignments || []).some(
    (assignment) => (assignment.auditor?._id || assignment.auditor?.id) === user?.id,
  );

  const verifiedAssetIds = useMemo(
    () => new Set((details?.results || []).map((result) => result.asset?._id || result.asset?.id)),
    [details],
  );

  const pendingAssets = useMemo(
    () =>
      assets.filter((asset) => {
        const assetId = asset._id || asset.id;
        if (verifiedAssetIds.has(assetId)) return false;
        if (details?.cycle?.department && asset.department !== details.cycle.department) return false;
        return true;
      }),
    [assets, verifiedAssetIds, details],
  );

  const handleVerify = async (values) => {
    try {
      await verifyAsset(id, values);
      setNotice("Verification recorded.");
      await load();
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to record verification.");
    }
  };

  const readOnly = details?.cycle?.status === "Completed" || details?.cycle?.status === "Cancelled";

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Asset Audit</p>
          <h1>Verify Assets</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <div className="booking-workspace">
        <section className="booking-history-card" style={{ padding: "18px" }}>
          <h2>{details?.cycle?.title || "Audit Cycle"}</h2>
          <p>{pendingAssets.length} asset(s) awaiting verification.</p>
          {details?.results?.length ? (
            <ul>
              {details.results.map((result) => (
                <li key={result._id || result.id}>
                  {result.asset?.name} ({result.asset?.assetTag}) —{" "}
                  <AuditStatusBadge status={result.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="audit-empty">No assets verified yet.</p>
          )}
          <button type="button" onClick={() => navigate("/audits")}>
            Back to audit cycles
          </button>
        </section>
        <aside className="booking-form-card">
          <h2>Verification Form</h2>
          {readOnly ? (
            <p className="audit-empty">This audit cycle is closed and read-only.</p>
          ) : !isAssigned ? (
            <p className="audit-empty">You are not assigned as an auditor for this cycle.</p>
          ) : pendingAssets.length ? (
            <VerificationForm assets={pendingAssets} onSubmit={handleVerify} />
          ) : (
            <p className="audit-empty">All in-scope assets have been verified.</p>
          )}
        </aside>
      </div>
    </main>
  );
}
