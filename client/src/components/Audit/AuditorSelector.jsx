export default function AuditorSelector({ employees = [], value, onChange }) {
  return (
    <label>
      Auditor
      <select name="auditor" value={value} onChange={onChange} required>
        <option value="">Select an employee to assign</option>
        {employees.map((employee) => (
          <option key={employee._id || employee.id} value={employee._id || employee.id}>
            {employee.fullName} — {employee.department || "General"}
          </option>
        ))}
      </select>
    </label>
  );
}
