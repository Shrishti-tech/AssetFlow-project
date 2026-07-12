import { useState } from "react";
import AllocationForm from "../components/AllocationForm";
import { createAllocation } from "../services/allocationService";

export default function AllocateAsset() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (values) => {
    try {
      await createAllocation(values);
      setMessage("Allocation created successfully.");
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Failed to create allocation.",
      );
    }
  };

  return (
    <div className="allocation-page">
      <h2>Allocate Asset</h2>
      {message ? <p className="allocation-message">{message}</p> : null}
      <AllocationForm onSubmit={handleSubmit} />
    </div>
  );
}
