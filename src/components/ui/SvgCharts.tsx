import React, { useState } from 'react';

export interface SeriesPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface ChartProps {
  data: SeriesPoint[];
  valueFormatter?: (v: number) => string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

export function SimpleBarChart({
  data,
  valueFormatter = (v) => String(v),
  primaryColor = '#0D7A72',
}: ChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVal = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="relative flex h-56 flex-col justify-end pt-6">
      <div className="flex h-44 items-end gap-2 sm:gap-3">
        {data.map((point, idx) => {
          const pct = Math.max(4, Math.round((point.value / maxVal) * 100));
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={point.label}
              className="relative flex h-full flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {isHovered && (
                <div className="absolute -top-6 z-10 rounded border border-[#0A4E4C] bg-[#053332] px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm whitespace-nowrap tabular-nums">
                  {valueFormatter(point.value)}
                </div>
              )}
              <div className="flex w-full max-w-[38px] flex-1 items-end">
                <div
                  className="w-full rounded-t-md transition-all duration-150"
                  style={{
                    height: `${pct}%`,
                    backgroundColor: isHovered ? '#DF4416' : primaryColor,
                  }}
                />
              </div>
              <span className="mt-2 text-[11px] font-bold text-[#000000] tabular-nums truncate max-w-full">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SmoothAreaChart({
  data,
  valueFormatter = (v) => String(v),
  primaryColor = '#053332',
}: ChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const width = 520;
  const height = 180;
  const padX = 24;
  const padY = 20;
  const maxVal = Math.max(1, ...data.map((d) => d.value));

  const coords = data.map((d, i) => {
    const x =
      data.length === 1
        ? width / 2
        : padX + (i / (data.length - 1)) * (width - padX * 2);
    const y = height - padY - (d.value / maxVal) * (height - padY * 2);
    return { x, y, ...d };
  });

  const linePath = coords
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${height - padY} L ${coords[0].x.toFixed(1)} ${height - padY} Z`
      : '';

  return (
    <div className="relative w-full" dir="ltr">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full overflow-visible">
        <defs>
          <linearGradient id="ibondaAreaGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#15803D" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#DF4416" stopOpacity="0.10" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((step) => {
          const y = height - padY - step * (height - padY * 2);
          return (
            <line
              key={step}
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="#D5E2E1"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
          );
        })}

        {areaPath && <path d={areaPath} fill="url(#ibondaAreaGrad)" />}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={primaryColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {coords.map((pt, idx) => (
          <g
            key={pt.label}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="cursor-pointer"
          >
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIdx === idx ? 5.5 : 3.5}
              fill="#FFFFFF"
              stroke={hoveredIdx === idx ? '#DF4416' : '#15803D'}
              strokeWidth="2.2"
            />
            {hoveredIdx === idx && (
              <g transform={`translate(${Math.min(Math.max(pt.x, 55), width - 55)}, ${Math.max(pt.y - 26, 12)})`}>
                <rect x="-48" y="-12" width="96" height="22" rx="4" fill="#053332" />
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="600"
                >
                  {valueFormatter(pt.value)}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
      <div className="mt-1 flex items-center justify-between px-4 text-[11px] font-bold text-[#000000] tabular-nums" dir="ltr">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

export function GroupedComparisonChart({
  data,
  primaryColor = '#0D7A72',
  secondaryColor = '#DF4416',
  primaryLabel = 'A',
  secondaryLabel = 'B',
}: ChartProps) {
  const maxVal = Math.max(1, ...data.flatMap((d) => [d.value, d.secondaryValue || 0]));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-5 text-xs font-extrabold text-[#000000]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: primaryColor }} />
          {primaryLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: secondaryColor }} />
          {secondaryLabel}
        </span>
      </div>
      <div className="flex h-44 items-end gap-3 pt-4">
        {data.map((d) => {
          const h1 = Math.max(4, Math.round((d.value / maxVal) * 100));
          const h2 = Math.max(4, Math.round(((d.secondaryValue || 0) / maxVal) * 100));
          return (
            <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end">
              <div className="flex h-full w-full items-end justify-center gap-1.5">
                <div
                  className="w-3.5 rounded-t transition-all"
                  style={{ height: `${h1}%`, backgroundColor: primaryColor }}
                  title={`${primaryLabel}: ${d.value}`}
                />
                <div
                  className="w-3.5 rounded-t transition-all"
                  style={{ height: `${h2}%`, backgroundColor: secondaryColor }}
                  title={`${secondaryLabel}: ${d.secondaryValue || 0}`}
                />
              </div>
              <span className="mt-2 text-[11px] font-bold text-[#000000] tabular-nums">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface SegmentItem {
  label: string;
  value: number;
  color: string;
}

export function HorizontalDistributionList({ items }: { items: SegmentItem[] }) {
  const total = Math.max(1, items.reduce((acc, item) => acc + item.value, 0));

  return (
    <div className="space-y-3">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#EAF1EF]">
        {items.map((item) =>
          item.value > 0 ? (
            <div
              key={item.label}
              style={{
                width: `${(item.value / total) * 100}%`,
                backgroundColor: item.color,
              }}
              title={`${item.label}: ${item.value}`}
            />
          ) : null
        )}
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <div key={item.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-[#000000]">
                <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-2 tabular-nums">
                <span className="font-black text-[#000000]">{item.value}</span>
                <span className="font-bold text-[#053332]">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
