export default function ResourceSelector({ value, onChange }) {
  return (
    <label>
      Resource
      <input
        name="resource"
        value={value}
        onChange={onChange}
        placeholder="Meeting Room A or resource ID"
        required
      />
    </label>
  );
}
