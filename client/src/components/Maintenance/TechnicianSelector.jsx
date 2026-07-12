export default function TechnicianSelector({ technicians = [], value, onChange }) {
  return (
    <label>
      Technician
      <select name="technician" value={value} onChange={onChange} required>
        <option value="">Select an available technician</option>
        {technicians.map((technician) => (
          <option key={technician._id || technician.id} value={technician._id || technician.id}>
            {technician.name} — {technician.specialization || "General"}
          </option>
        ))}
      </select>
    </label>
  );
}
