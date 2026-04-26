export default function ImageUpload({ label, name, onChange }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input type="file" name={name} accept="image/png,image/jpeg,image/webp" onChange={onChange} />
    </label>
  );
}
