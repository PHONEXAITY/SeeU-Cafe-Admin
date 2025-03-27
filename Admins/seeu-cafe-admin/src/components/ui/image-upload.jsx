import React, { useRef, useState } from 'react';

const ImageUpload = ({ value, onChange, className = "" }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div 
        className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <p className="text-gray-500">Click to upload image</p>
            <p className="text-sm text-gray-400">PNG, JPG up to 5MB</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
      {preview && (
        <button
          type="button"
          className="text-sm text-red-500 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            setPreview(null);
            onChange(null);
          }}
        >
          Remove image
        </button>
      )}
    </div>
  );
};

export { ImageUpload };