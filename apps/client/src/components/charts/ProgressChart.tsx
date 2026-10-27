import { useState, useId } from 'react';

interface ProgressChartProps {
  points: number[];
  labels?: string[];
  initialActiveIndex?: number;
}

export function ProgressChart({
  points,
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  initialActiveIndex = 3, // Thursday
}: ProgressChartProps) {
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);
  const gradientId = useId();

  const width = 560;
  const height = 230;
  const padLeft = 46;
  const padRight = 24;
  const padTop = 44;
  const padBottom = 32;

  const usableWidth = width - padLeft - padRight;
  const usableHeight = height - padTop - padBottom;
  const zeroY = height - padBottom;

  const count = points.length;
  const step = count > 1 ? usableWidth / (count - 1) : 0;

  // Calculate coordinates for each data point
  const coords = points.map((val, idx) => {
    const clamped = Math.max(0, Math.min(100, val));
    const x = padLeft + idx * step;
    const y = padTop + usableHeight * (1 - clamped / 100);
    return { x, y, value: clamped, label: labels[idx] ?? '' };
  });

  // Build smooth bezier spline
  function createBezierPath(pointsArr: { x: number; y: number }[]): string {
    if (pointsArr.length === 0) return '';
    const first = pointsArr[0];
    if (!first) return '';
    if (pointsArr.length === 1) return `M ${first.x} ${first.y}`;

    let path = `M ${first.x} ${first.y}`;

    for (let i = 0; i < pointsArr.length - 1; i++) {
      const p0 = pointsArr[i === 0 ? 0 : i - 1] ?? first;
      const p1 = pointsArr[i] ?? first;
      const p2 = pointsArr[i + 1] ?? p1;
      const p3 = pointsArr[i + 2 >= pointsArr.length ? pointsArr.length - 1 : i + 2] ?? p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    return path;
  }

  const linePath = createBezierPath(coords);
  const firstPt = coords[0];
  const lastPt = coords[coords.length - 1];
  const areaPath =
    linePath && firstPt && lastPt
      ? `${linePath} L ${lastPt.x} ${zeroY} L ${firstPt.x} ${zeroY} Z`
      : '';

  const activeCoord = coords[activeIndex] ?? coords[0];
  const activeDateSubtitle =
    activeIndex === 3
      ? 'Thu, May 28'
      : activeCoord
      ? `${activeCoord.label}, May ${25 + activeIndex}`
      : '';

  const yAxisTicks = [
    { value: 100, label: '100%' },
    { value: 75, label: '75%' },
    { value: 50, label: '50%' },
    { value: 25, label: '25%' },
    { value: 0, label: '0%' },
  ];

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        aria-label="Weekly Progress Line Chart"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2161F5" stopOpacity="0.18" />
            <stop offset="60%" stopColor="#2161F5" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#2161F5" stopOpacity="0.00" />
          </linearGradient>

          <filter id="tooltipGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#15213D" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Horizontal Grid Lines & Y-axis labels */}
        {yAxisTicks.map((tick) => {
          const y = padTop + usableHeight * (1 - tick.value / 100);
          return (
            <g key={tick.value} className="text-slate-300">
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray={tick.value === 0 ? undefined : '2 3'}
                opacity={tick.value === 0 ? 0.6 : 0.45}
              />
              <text
                x={padLeft - 10}
                y={y + 3.5}
                textAnchor="end"
                className="fill-slate-400 text-[10.5px] font-medium"
              >
                {tick.label}
              </text>
            </g>
          );
        })}

        {/* Area Gradient Fill */}
        {areaPath && (
          <path d={areaPath} fill={`url(#${gradientId})`} />
        )}

        {/* Vertical Highlight Guide Line for Active Point */}
        {activeCoord && (
          <line
            x1={activeCoord.x}
            y1={activeCoord.y}
            x2={activeCoord.x}
            y2={zeroY}
            stroke="#2161F5"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.45"
          />
        )}

        {/* Main Line Stroke */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#2161F5"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Interactive Data Points */}
        {coords.map((pt, idx) => {
          const isActive = idx === activeIndex;
          return (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => setActiveIndex(idx)}
            >
              {/* Invisible larger hover hitbox */}
              <circle cx={pt.x} cy={pt.y} r={16} fill="transparent" />

              {/* Outer halo when active */}
              {isActive && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={8.5}
                  fill="#2161F5"
                  opacity={0.22}
                  className="transition-all duration-200"
                />
              )}

              {/* Data point circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isActive ? 4.5 : 3.25}
                fill={isActive ? '#2161F5' : '#FFFFFF'}
                stroke="#2161F5"
                strokeWidth={isActive ? 2.5 : 2}
                className="transition-all duration-200"
              />
            </g>
          );
        })}

        {/* Active Node Tooltip Badge */}
        {activeCoord && (
          <g
            transform={`translate(${activeCoord.x}, ${Math.max(22, activeCoord.y - 12)})`}
            className="pointer-events-none transition-all duration-200"
            filter="url(#tooltipGlow)"
          >
            {/* Tooltip Background Card */}
            <rect
              x="-42"
              y="-32"
              width="84"
              height="30"
              rx="9"
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="1"
            />
            {/* Tooltip Arrow Pointer */}
            <polygon
              points="-4,-2 4,-2 0,2"
              fill="#FFFFFF"
            />

            {/* Percentage Value */}
            <text
              x="0"
              y="-17"
              textAnchor="middle"
              className="fill-slate-900 text-[11.5px] font-bold"
            >
              {activeCoord.value}%
            </text>

            {/* Date / Day Label */}
            <text
              x="0"
              y="-6"
              textAnchor="middle"
              className="fill-slate-500 text-[8.5px] font-semibold"
            >
              {activeDateSubtitle}
            </text>
          </g>
        )}

        {/* X-axis Day Labels */}
        {coords.map((pt, idx) => {
          const isActive = idx === activeIndex;
          return (
            <text
              key={idx}
              x={pt.x}
              y={height - 10}
              textAnchor="middle"
              onClick={() => setActiveIndex(idx)}
              className={`cursor-pointer text-[11px] font-medium transition-colors ${
                isActive ? 'fill-[#2161F5] font-semibold' : 'fill-slate-400 hover:fill-slate-700'
              }`}
            >
              {pt.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
