export default function ResourceSelector({ value, onChange }) {
  return (
    <label>
      Resource
      <input
        name="resource"
        value={value}
        onChange={onChange}
        placeholder="Enter a resource ID"
        required
      />
    </label>
  );
}
