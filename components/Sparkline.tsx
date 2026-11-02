"use client";
// Tiny dependency-free SVG sparkline / 7-day chart.
export default function Sparkline({ values, width = 320, height = 80, color = "#eab308" }: { values: number[]; width?: number; height?: number; color?: string }) {
  if (!values.length) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * width},${height - 6 - ((v - min) / range) * (height - 16)}`).join(" ");
  const area = `0,${height} ${pts} ${width},${height}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="7-day trend">
      <polygon points={area} fill={color} opacity={0.15} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
