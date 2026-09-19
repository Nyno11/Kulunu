import { useRef, useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

export default function ImageUpload({ initialUrl = '', onFileSelect, label = 'Event Banner' }) {
  const [preview, setPreview] = useState(initialUrl || null);
  const [objectUrl, setObjectUrl] = useState(null);
  const inputRef = useRef(null);

  // Revoke any local blob URL we created once it's no longer shown.
  useEffect(() => () => { if (objectUrl) URL.revokeObjectURL(objectUrl); }, [objectUrl]);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    setPreview(url);
    onFileSelect(file);
    e.target.value = '';
  }

  function handleRemove() {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(null);
    setPreview(null);
    onFileSelect(null);
  }

  return (
    <div>
      <label className="text-xs font-bold text-gray-500 mb-1 block">{label}</label>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <img src={preview} alt="Event banner" className="w-full h-40 object-cover"/>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-lg hover:bg-black/80"
          >
            <X size={14}/>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-40 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-brand hover:text-brand transition-colors"
        >
          <Upload size={20}/>
          <span className="text-xs font-medium">Click to choose an image</span>
          <span className="text-[10px] text-gray-300">JPG or PNG, up to 5MB · uploaded when you save</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden"/>
    </div>
  );
}
