export function formatPriceINR(amount: number): string {
  if (amount >= 1_00_00_000) {
    const crores = amount / 1_00_00_000;
    const formatted =
      crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(2).replace(/\.?0+$/, "");
    return `₹${formatted} Cr`;
  }
  if (amount >= 1_00_000) {
    const lakhs = amount / 1_00_000;
    const formatted =
      lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2).replace(/\.?0+$/, "");
    return `₹${formatted} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
