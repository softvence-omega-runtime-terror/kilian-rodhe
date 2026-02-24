export const COLOR_MAP: Record<string, string> = {
    black: "#000000",
    white: "#FFFFFF",
    navy: "#000080",
    grey: "#808080",
    red: "#FF0000",
    blue: "#0000FF",
    green: "#008000",
    brown: "#A52A2A",
    pink: "#FFC0CB",
    yellow: "#FFFF00",
    purple: "#800080",
    orange: "#FFA500",
};

/**
 * Returns the hex value for a given color name or hex string.
 * If the input is a hex string (starts with #), it returns it as-is.
 * Otherwise, it looks up the color name in COLOR_MAP.
 * If not found, it returns the input string (which might be a valid CSS color name).
 */
export const getColorValue = (color: string): string => {
    if (!color) return "transparent";
    const normalized = color.toLowerCase().trim();
    if (normalized.startsWith("#")) return normalized;
    return COLOR_MAP[normalized] || normalized;
};

/**
 * Checks if a color is "light" (specifically white or light grey) to determine if a border is needed.
 */
export const isLightColor = (color: string): boolean => {
    const value = getColorValue(color).toLowerCase();
    return value === "#ffffff" || value === "white" || value === "#fafafa" || value === "ghostwhite";
};
