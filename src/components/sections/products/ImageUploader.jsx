// dashboard/src/components/sections/products/ImageUploader.jsx
import { useEffect, useRef, useState } from "react";

export default function ImageUploader({ value, onChange }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (typeof value === "string") {
      setPreview(value);
      return;
    }

    try {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } catch {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (file) => {
    if (!file) return;
    if (onChange) onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2 w-full min-w-0">
      <label className="text-xs sm:text-sm md:text-[14px] font-medium text-right py-2">
        :وێنە هەڵبژێرە
      </label>

      <div
        className="h-32 sm:h-39 w-full rounded-[10px] border border-[#3d5395] bg-[#F0F4FF] flex flex-col items-center justify-center text-[#5776D4] gap-2 relative"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="h-full w-full object-contain rounded-[10px]"
          />
        ) : (
          <>
            <img src="/export.svg" alt="" />
            <span className="text-xs sm:text-sm md:text-[14px] text-center">
              وێنەکە ڕابکێشە و دابنێ یان کلیک بکە
            </span>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e.target.files?.[0])}
          className="hidden"
        />
      </div>
    </div>
  );
}
