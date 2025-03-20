"use client";

import { InfoIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HarmonizationInfoProps {
  variant?: "tooltip" | "modal";
}

export default function HarmonizationInfo({
  variant = "tooltip",
}: HarmonizationInfoProps) {
  const infoContent = (
    <>
      <p className="font-semibold mb-2">What is Harmonization?</p>
      <p className="mb-2">
        Harmonization ensures that all color steps across different scales have
        consistent perceived lightness.
      </p>
      <p className="mb-0">
        For example, step 800 of one color will appear visually as dark as step
        800 of another color, creating better balance in your color system.
      </p>
    </>
  );

  const infoContentExtended = (
    <>
      {infoContent}
      <p className="font-semibold mt-4 mb-2">How does it work?</p>
      <p className="mb-2">
        Our algorithm converts colors to a perceptually uniform color space
        (Oklab), calculates the average lightness for each step across all
        colors, and then adjusts each color to match this average lightness
        while preserving its hue.
      </p>
      <p>
        This creates a visually balanced palette where all colors at the same
        step level appear to have the same visual weight, making your design
        system more cohesive.
      </p>
    </>
  );

  if (variant === "tooltip") {
    return (
      <div className="flex items-center h-6 justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="inline-flex items-center justify-center">
              <InfoIcon className="h-5 w-5 text-slate-500 hover:text-slate-700" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="w-80 p-4 text-sm bg-gray-800 text-white z-50">
            {infoContent}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex items-center h-6 justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <button className="inline-flex items-center justify-center">
            <InfoIcon className="h-5 w-5 text-slate-500 hover:text-slate-700" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Harmonizing Color Scales</DialogTitle>
            <DialogDescription>{infoContentExtended}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
