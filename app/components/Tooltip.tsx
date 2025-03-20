"use client";

import { useState } from "react";

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  width?: string;
}

export default function Tooltip({
  content,
  children,
  position = "top",
  width = "w-64",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center cursor-help"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} ${width} bg-gray-800 text-white text-sm rounded-md shadow-lg p-3`}
          role="tooltip"
        >
          <div className="relative">
            {content}
            <div
              className={`
              absolute w-3 h-3 bg-gray-800 transform rotate-45 
              ${
                position === "top"
                  ? "top-full left-1/2 -translate-x-1/2 -mt-1.5"
                  : ""
              }
              ${
                position === "bottom"
                  ? "bottom-full left-1/2 -translate-x-1/2 -mb-1.5"
                  : ""
              }
              ${
                position === "left"
                  ? "left-full top-1/2 -translate-y-1/2 -ml-1.5"
                  : ""
              }
              ${
                position === "right"
                  ? "right-full top-1/2 -translate-y-1/2 -mr-1.5"
                  : ""
              }
            `}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
