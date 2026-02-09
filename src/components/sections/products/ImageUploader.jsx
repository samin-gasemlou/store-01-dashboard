import { useState, useRef } from "react";

export default function ImageUploader({ value, onChange }) {
  const [preview, setPreview] = useState(value ? URL.createObjectURL(value) : null);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2 w-full sm:w-77">
     <label className="text-xs sm:text-sm md:text-[14px] font-medium text-right py-2">
:انتخاب عکس</label>

      <div
        className="h-32 sm:h-39 w-full sm:w-76.75 rounded-[10px] border border-[#3d5395] bg-[#F0F4FF] flex flex-col items-center justify-center text-[#5776D4] gap-2 relative"
        onClick={() => fileInputRef.current.click()}
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
              تصویر را بکشید و رها کنید یا کلیک کنید
            </span>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e.target.files[0])}
          className="hidden"
        />
      </div>
    </div>
  );
}
