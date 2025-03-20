"use client";

import { ColorScale as ColorScaleType } from "../utils/colorUtils";

interface ColorScaleProps {
  name: string;
  scale: ColorScaleType;
  baseColor: string;
}

export default function ColorScale({
  name,
  scale,
  baseColor,
}: ColorScaleProps) {
  // Define the steps to display in order
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800] as const;

  // Function to determine text color for contrast
  const getTextColor = (bgColor: string) => {
    // Convert hex to RGB
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Calculate perceived brightness (YIQ formula)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return black for bright colors and white for dark colors
    return brightness > 128 ? "#000000" : "#ffffff";
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-800 flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: baseColor }}
          />
          {name}
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row">
        {steps.map((step) => (
          <div
            key={step}
            className="flex-1 p-4 flex flex-col items-center justify-between"
            style={{
              backgroundColor: scale[step],
              color: getTextColor(scale[step]),
              minHeight: "100px",
            }}
          >
            <div className="text-xs font-medium opacity-80">{step}</div>
            <div className="text-xs font-mono mt-2">{scale[step]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
