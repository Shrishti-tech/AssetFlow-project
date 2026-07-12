import { useEffect, useState } from "react";
import { getAllocations } from "../services/allocationService";
import AllocationTable from "../components/AllocationTable";

export default function AllocationList() {
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllocations();
        setAllocations(data);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  return (
    <div className="allocation-page">
      <h2>Allocations</h2>
      <AllocationTable allocations={allocations} />
    </div>
  );
}
