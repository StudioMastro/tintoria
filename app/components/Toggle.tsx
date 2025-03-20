"use client";

import { useState, useEffect } from "react";

interface ToggleProps {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
  id: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function Toggle({
  isEnabled,
  onChange,
  id,
  label,
  size = "md",
}: ToggleProps) {
  const [enabled, setEnabled] = useState(isEnabled);

  // Keep internal state in sync with props
  useEffect(() => {
    setEnabled(isEnabled);
  }, [isEnabled]);

  const handleChange = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    onChange(newValue);
  };

  // Size variants
  const sizeClasses = {
    sm: {
      toggle: "w-8 h-4",
      circle: "w-3 h-3",
      translateX: "translate-x-4",
    },
    md: {
      toggle: "w-11 h-6",
      circle: "w-4 h-4",
      translateX: "translate-x-5",
    },
    lg: {
      toggle: "w-14 h-7",
      circle: "w-5 h-5",
      translateX: "translate-x-7",
    },
  };

  const { toggle, circle, translateX } = sizeClasses[size];

  return (
    <div className="flex items-center h-6">
      {label && (
        <label
          htmlFor={id}
          className="mr-2 text-sm text-gray-700 cursor-pointer"
        >
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={handleChange}
        className={`
          ${toggle}
          ${enabled ? "bg-indigo-600" : "bg-gray-200"} 
          relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
          focus:ring-indigo-500 focus:ring-offset-2
        `}
        role="switch"
        aria-checked={enabled}
      >
        <span className="sr-only">{label || "Toggle"}</span>
        <span
          className={`
            ${circle} 
            ${enabled ? translateX : "translate-x-0"}
            pointer-events-none inline-block transform rounded-full 
            bg-white shadow ring-0 transition duration-200 ease-in-out
          `}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
