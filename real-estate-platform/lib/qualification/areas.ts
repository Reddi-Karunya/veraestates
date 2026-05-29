import { properties as mockProperties } from "@/lib/mock-properties";

export type PreferredAreaOption = {
  value: string;
  label: string;
  city: string;
};

function buildAreaOptions(): PreferredAreaOption[] {
  const seen = new Set<string>();
  const options: PreferredAreaOption[] = [];

  for (const p of mockProperties) {
    const value = `${p.locality}, ${p.city}`;
    if (seen.has(value)) continue;
    seen.add(value);
    options.push({ value, label: value, city: p.city });
  }

  return options.sort((a, b) => a.label.localeCompare(b.label));
}

export const preferredAreaOptions = buildAreaOptions();

export function getPreferredAreaOptions(): PreferredAreaOption[] {
  return preferredAreaOptions;
}
