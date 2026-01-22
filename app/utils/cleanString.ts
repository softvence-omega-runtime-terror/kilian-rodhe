// utils/cleanString.ts

/**
 * Removes extra quotes from a string if it is surrounded by them
 */
export function cleanString(str?: string): string {
  if (!str) return "";
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1); // remove starting and ending quotes
  }
  return str;
}

/**
 * Safely parses a stringified JSON object
 */
export function parseJSON<T>(value: string | T): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }
  return value;
}
