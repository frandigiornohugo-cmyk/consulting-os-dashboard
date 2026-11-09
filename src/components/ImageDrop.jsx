import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { fileToDataUrl } from '../lib/image.js';

export function ImageDrop({ value, onChange, label = 'Subir imagen', hint, aspect = 'aspect-video' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file) {
    if (!file) return;
    setError('');
    try {
      onChange(await fileToDataUrl(file));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={[
          'relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors',
          aspect,
          dragging ? 'border-neutral-400 bg-white/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20',
        ].join(' ')}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="absolute right-2 top-2 rounded-md bg-black/70 p-1 text-neutral-300 hover:text-white"
              aria-label="Quitar imagen"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center text-neutral-500">
            <ImagePlus size={20} />
            <span className="text-sm">{label}</span>
            {hint && <span className="text-xs text-neutral-600">{hint}</span>}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
