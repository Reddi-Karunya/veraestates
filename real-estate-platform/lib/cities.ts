import { properties as mockProperties } from "@/lib/mock-properties";

export function getCities(): string[] {
  return [...new Set(mockProperties.map((p) => p.city))].sort();
}
