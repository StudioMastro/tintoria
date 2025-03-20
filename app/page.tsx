"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  generateColorScale,
  harmonizeColorScales,
  ColorScale,
} from "./utils/colorUtils";
import ColorInput from "./components/ColorInput";
import ColorScaleComponent from "./components/ColorScale";
import HarmonizationInfo from "./components/HarmonizationInfo";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Plus, Github } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Example presets
const PRESETS = {
  "Material Design": [
    { id: "primary", name: "Primary", color: "#6200ee" },
    { id: "secondary", name: "Secondary", color: "#03dac6" },
    { id: "error", name: "Error", color: "#b00020" },
  ],
  Nord: [
    { id: "polar-night", name: "Polar Night", color: "#2e3440" },
    { id: "snow-storm", name: "Snow Storm", color: "#eceff4" },
    { id: "frost", name: "Frost", color: "#5e81ac" },
    { id: "aurora", name: "Aurora", color: "#bf616a" },
  ],
  "Brand Example": [
    { id: "brand1", name: "Brand Primary", color: "#6831F2" },
    { id: "brand2", name: "Product A", color: "#2385F6" },
    { id: "brand3", name: "Product B", color: "#A227B0" },
  ],
};

type ColorInput = {
  id: string;
  name: string;
  color: string;
};

export default function Home() {
  const [colorInputs, setColorInputs] = useState<ColorInput[]>([
    { id: uuidv4(), name: "Primary", color: "#6831F2" },
  ]);

  const [scales, setScales] = useState<Record<string, ColorScale>>({});
  const [harmonizedScales, setHarmonizedScales] = useState<
    Record<string, ColorScale>
  >({});
  const [isHarmonized, setIsHarmonized] = useState(true);

  // Generate scales whenever inputs change
  useEffect(() => {
    try {
      // Generate individual scales
      const newScales: Record<string, ColorScale> = {};

      colorInputs.forEach((input) => {
        // Validate hex color format
        if (/^#[0-9A-F]{6}$/i.test(input.color)) {
          newScales[input.id] = generateColorScale(input.color);
        }
      });

      setScales(newScales);

      // Generate harmonized scales if there are multiple colors
      if (Object.keys(newScales).length > 1) {
        const newHarmonizedScales = harmonizeColorScales(newScales);
        setHarmonizedScales(newHarmonizedScales);
      } else {
        setHarmonizedScales(newScales);
      }
    } catch (error) {
      console.error("Error generating color scales:", error);
    }
  }, [colorInputs]);

  const handleAddColor = () => {
    setColorInputs((prev) => [
      ...prev,
      { id: uuidv4(), name: `Color ${prev.length + 1}`, color: "#808080" },
    ]);
  };

  const handleColorChange = (id: string, color: string) => {
    setColorInputs((prev) =>
      prev.map((input) => (input.id === id ? { ...input, color } : input))
    );
  };

  const handleNameChange = (id: string, name: string) => {
    setColorInputs((prev) =>
      prev.map((input) => (input.id === id ? { ...input, name } : input))
    );
  };

  const handleRemoveColor = (id: string) => {
    setColorInputs((prev) => prev.filter((input) => input.id !== id));
  };

  const handlePresetSelect = (presetName: string) => {
    const preset = PRESETS[presetName as keyof typeof PRESETS];
    if (preset) {
      // Generate new IDs for the preset colors
      const presetWithIds = preset.map((item) => ({
        ...item,
        id: uuidv4(),
      }));

      setColorInputs(presetWithIds);
    }
  };

  const handleExportCSS = () => {
    const currentScales = isHarmonized ? harmonizedScales : scales;
    let css = ":root {\n";

    Object.entries(currentScales).forEach(([id, scale]) => {
      const colorName =
        colorInputs
          .find((input) => input.id === id)
          ?.name.toLowerCase()
          .replace(/\s+/g, "-") || id;

      Object.entries(scale).forEach(([step, color]) => {
        css += `  --${colorName}-${step}: ${color};\n`;
      });
      css += "\n";
    });

    css += "}\n";

    // Create a download link
    const element = document.createElement("a");
    const file = new Blob([css], { type: "text/css" });
    element.href = URL.createObjectURL(file);
    element.download = "tintoria-palette.css";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tintoria</h1>
              <p className="text-xs text-gray-600">
                Generate harmonious color scales for your design system
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <a
              href="https://github.com/alemastro97/tintoria"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-8 px-4 max-w-6xl">
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Input Colors</CardTitle>
                <CardDescription>
                  Add and customize your base colors
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select onValueChange={handlePresetSelect}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Load Preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Color Presets</SelectLabel>
                      {Object.keys(PRESETS).map((preset) => (
                        <SelectItem key={preset} value={preset}>
                          {preset}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button onClick={handleAddColor} size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Color</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {colorInputs.map((input) => (
                  <ColorInput
                    key={input.id}
                    id={input.id}
                    name={input.name}
                    color={input.color}
                    onColorChange={handleColorChange}
                    onNameChange={handleNameChange}
                    onRemove={handleRemoveColor}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Color Scales</CardTitle>
                <CardDescription>
                  Generated color scales based on your input colors
                </CardDescription>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <HarmonizationInfo variant="tooltip" />
                    <Label
                      htmlFor="harmonize-switch"
                      className="text-sm cursor-pointer ml-1"
                    >
                      Harmonize scales
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      id="harmonize-switch"
                      checked={isHarmonized}
                      onCheckedChange={setIsHarmonized}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleExportCSS}
                  variant="default"
                  size="sm"
                  className="gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSS Variables</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {colorInputs.map((input) => {
                  const currentScales = isHarmonized
                    ? harmonizedScales
                    : scales;
                  const scale = currentScales[input.id];

                  if (!scale) {
                    return null;
                  }

                  return (
                    <ColorScaleComponent
                      key={input.id}
                      name={input.name}
                      scale={scale}
                      baseColor={input.color}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} Tintoria. Built with Next.js and
            shadcn/ui.
          </p>
        </div>
      </footer>
    </div>
  );
}
