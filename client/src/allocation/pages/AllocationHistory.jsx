import { useEffect, useState } from "react";
import { getAllocationHistory } from "../services/allocationService";

export default function AllocationHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllocationHistory();
        setHistory(data);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  return (
    <div className="allocation-page">
      <h2>Allocation History</h2>
      <div className="allocation-history-list">
        {history.length === 0 ? (
          <p>No history available.</p>
        ) : (
          history.map((item, index) => (
            <div key={item._id || index} className="allocation-history-item">
              <strong>{item.action || "Event"}</strong>
              <p>{item.details || item.notes || "No details"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
