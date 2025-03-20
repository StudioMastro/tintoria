import * as culori from "culori";

// Define type for numeric keys
export type ColorStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800;

export type ColorScale = {
  [key in ColorStep]: string;
};

// Generate a color scale from a base color (using the perceptually uniform Oklab color space)
export function generateColorScale(baseColor: string): ColorScale {
  // Parse the base color
  const parsed = culori.parse(baseColor);
  if (!parsed) {
    throw new Error(`Invalid color: ${baseColor}`);
  }

  // Convert to Oklab color space
  const oklabColor = culori.oklch(parsed);

  // The base color is set as the 500 step
  const scale = {} as ColorScale;

  // Generate lighter shades (50-400)
  const lighterSteps = [
    {
      step: 50 as ColorStep,
      lightness: oklabColor.l + 0.35,
      chromaFactor: 0.3,
    },
    {
      step: 100 as ColorStep,
      lightness: oklabColor.l + 0.3,
      chromaFactor: 0.4,
    },
    {
      step: 200 as ColorStep,
      lightness: oklabColor.l + 0.22,
      chromaFactor: 0.6,
    },
    {
      step: 300 as ColorStep,
      lightness: oklabColor.l + 0.15,
      chromaFactor: 0.8,
    },
    {
      step: 400 as ColorStep,
      lightness: oklabColor.l + 0.07,
      chromaFactor: 0.9,
    },
  ];

  // Generate darker shades (600-800)
  const darkerSteps = [
    {
      step: 600 as ColorStep,
      lightness: oklabColor.l - 0.07,
      chromaFactor: 0.95,
    },
    {
      step: 700 as ColorStep,
      lightness: oklabColor.l - 0.15,
      chromaFactor: 0.85,
    },
    {
      step: 800 as ColorStep,
      lightness: oklabColor.l - 0.22,
      chromaFactor: 0.7,
    },
  ];

  // Set the base color
  scale[500] = baseColor;

  // Create lighter shades
  for (const { step, lightness, chromaFactor } of lighterSteps) {
    const newColor = { ...oklabColor };
    newColor.l = Math.min(Math.max(lightness, 0), 1); // Clamp lightness between 0-1
    newColor.c *= chromaFactor; // Reduce chroma for lighter colors
    scale[step] = culori.formatHex(culori.rgb(newColor));
  }

  // Create darker shades
  for (const { step, lightness, chromaFactor } of darkerSteps) {
    const newColor = { ...oklabColor };
    newColor.l = Math.min(Math.max(lightness, 0), 1); // Clamp lightness between 0-1
    newColor.c *= chromaFactor; // Reduce chroma for darker colors
    scale[step] = culori.formatHex(culori.rgb(newColor));
  }

  return scale;
}

// Function to harmonize multiple color scales to make them perceptually balanced
export function harmonizeColorScales(
  colorScales: Record<string, ColorScale>
): Record<string, ColorScale> {
  const harmonized: Record<string, ColorScale> = {};

  // Calculate the average lightness for each step across all scales
  const stepLightness: Record<ColorStep, number[]> = {
    50: [],
    100: [],
    200: [],
    300: [],
    400: [],
    500: [],
    600: [],
    700: [],
    800: [],
  };

  // Collect lightness values for each step
  Object.entries(colorScales).forEach(([name, scale]) => {
    (Object.keys(scale) as unknown as ColorStep[]).forEach((step) => {
      const color = scale[step];
      const oklab = culori.oklch(culori.parse(color));
      stepLightness[step].push(oklab.l);
    });
  });

  // Calculate average lightness for each step
  const avgLightness: Record<ColorStep, number> = {} as Record<
    ColorStep,
    number
  >;
  (Object.keys(stepLightness) as unknown as ColorStep[]).forEach((step) => {
    const values = stepLightness[step];
    avgLightness[step] = values.reduce((a, b) => a + b, 0) / values.length;
  });

  // Adjust each color scale to match the average lightness
  Object.entries(colorScales).forEach(([name, scale]) => {
    harmonized[name] = {} as ColorScale;

    (Object.keys(scale) as unknown as ColorStep[]).forEach((step) => {
      const color = scale[step];
      const oklab = culori.oklch(culori.parse(color));

      // Adjust lightness to match the average for this step
      oklab.l = avgLightness[step];

      harmonized[name][step] = culori.formatHex(culori.rgb(oklab));
    });
  });

  return harmonized;
}
