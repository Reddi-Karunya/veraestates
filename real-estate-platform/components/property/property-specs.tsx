import type { Property } from "@/lib/mock-properties";

type PropertySpecsProps = {
  property: Property;
};

function formatArea(sqft?: number, sqyd?: number, acres?: number): string | null {
  if (sqft) return `${sqft.toLocaleString("en-IN")} sq ft`;
  if (sqyd) return `${sqyd.toLocaleString("en-IN")} sq yd`;
  if (acres) return `${acres} acres`;
  return null;
}

export function PropertySpecs({ property }: PropertySpecsProps) {
  const { specs, propertyType } = property;
  const rows: { label: string; value: string }[] = [];

  if (specs.bhk) rows.push({ label: "Configuration", value: `${specs.bhk} BHK` });
  if (specs.bathrooms) rows.push({ label: "Bathrooms", value: String(specs.bathrooms) });

  const area = formatArea(
    specs.builtUpAreaSqft,
    specs.plotAreaSqyd,
    specs.plotAreaAcres
  );
  if (area) {
    rows.push({
      label: propertyType === "land" ? "Plot area" : "Built-up area",
      value: area,
    });
  }

  if (specs.carpetAreaSqft) {
    rows.push({
      label: "Carpet area",
      value: `${specs.carpetAreaSqft.toLocaleString("en-IN")} sq ft`,
    });
  }

  if (specs.floor != null && specs.totalFloors) {
    rows.push({
      label: "Floor",
      value: `${specs.floor} of ${specs.totalFloors}`,
    });
  }

  if (specs.facing) rows.push({ label: "Facing", value: specs.facing });
  if (specs.furnishing) rows.push({ label: "Furnishing", value: specs.furnishing });
  if (specs.parking) rows.push({ label: "Parking", value: `${specs.parking} slots` });
  if (specs.ageYears != null) rows.push({ label: "Property age", value: `${specs.ageYears} years` });
  if (specs.societyName) rows.push({ label: "Society", value: specs.societyName });
  if (specs.reraId) rows.push({ label: "RERA ID", value: specs.reraId });

  if (rows.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/60 bg-card">
      <div className="border-b border-border/60 px-6 py-4">
        <h2 className="font-display text-xl text-navy">Specifications</h2>
      </div>
      <dl className="divide-y divide-border/60">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between gap-4 px-6 py-3.5 text-sm"
          >
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-medium text-navy">{row.value}</dd>
          </div>
        ))}
      </dl>
      {specs.amenities && specs.amenities.length > 0 && (
        <div className="border-t border-border/60 px-6 py-4">
          <p className="text-sm text-muted-foreground">Amenities</p>
          <p className="mt-2 text-sm font-medium text-navy">
            {specs.amenities.join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}
