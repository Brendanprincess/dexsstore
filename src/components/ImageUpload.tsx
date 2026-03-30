import { useState, useRef } from "react";

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
}

const ImageUpload = ({ onFileSelect, accept = "image/png,image/jpeg,image/webp,image/gif", label = "Upload image" }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4.5 * 1024 * 1024) {
      alert("File size must be less than 4.5MB");
      return;
    }
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelect(file);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      {preview ? (
        <div className="flex items-center gap-3">
          <img src={preview} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-border" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground truncate">{fileName}</p>
            <button
              type="button"
              onClick={handleClick}
              className="text-xs text-primary hover:underline mt-1"
            >
              Change image
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="bg-secondary border border-border text-foreground rounded-lg px-6 py-3 w-full max-w-xs hover:bg-muted transition-colors"
        >
          {label}
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
