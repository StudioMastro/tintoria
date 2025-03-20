"use client";

import { useState, useEffect } from "react";

interface ColorInputProps {
  id: string;
  name: string;
  color: string;
  onColorChange: (id: string, color: string) => void;
  onNameChange: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}

export default function ColorInput({
  id,
  name,
  color,
  onColorChange,
  onNameChange,
  onRemove,
}: ColorInputProps) {
  const [inputColor, setInputColor] = useState(color);
  const [inputName, setInputName] = useState(name);

  // Update local state when props change
  useEffect(() => {
    setInputColor(color);
    setInputName(name);
  }, [color, name]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value);
    onColorChange(id, e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
    onNameChange(id, e.target.value);
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 bg-white">
      <div className="flex-shrink-0 relative">
        <input
          type="color"
          value={inputColor}
          onChange={handleColorChange}
          className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
          aria-label={`Choose color for ${name}`}
        />
        <div
          className="w-10 h-10 rounded-md border border-gray-200"
          style={{ backgroundColor: inputColor }}
        />
      </div>

      <div className="flex-grow">
        <input
          type="text"
          value={inputName}
          onChange={handleNameChange}
          placeholder="Color name"
          className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex-shrink-0">
        <input
          type="text"
          value={inputColor}
          onChange={handleColorChange}
          placeholder="#RRGGBB"
          className="w-20 px-2 py-1.5 text-xs font-mono border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="button"
        onClick={() => onRemove(id)}
        className="flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        aria-label="Remove color"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
