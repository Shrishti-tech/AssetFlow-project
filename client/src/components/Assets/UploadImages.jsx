import { useState } from "react";

export default function UploadImages({ onFilesSelected }) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (selectedFiles) => {
    const list = Array.from(selectedFiles || []);
    setFiles(list);
    onFilesSelected?.(list);
  };

  return (
    <div
      className={`asset-upload-card ${dragActive ? "asset-upload-card--active" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragActive(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <h3>Upload Files</h3>
      <p>Drag and drop images or PDFs, or choose files from your device.</p>
      <label className="asset-upload-picker">
        <input
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <span>Select files</span>
      </label>

      {files.length > 0 ? (
        <ul className="asset-upload-list">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`}>{file.name}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
