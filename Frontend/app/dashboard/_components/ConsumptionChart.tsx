import type { ConsumptionDay } from "@/lib/mockData";

interface Props { data: ConsumptionDay[]; height?: number; }

export default function ConsumptionChart({ data, height = 120 }: Props) {
  const max = Math.max(...data.map(d => d.litersUsed), 1);
  const BAR_W = 32;
  const GAP = 10;
  const svgW = data.length * (BAR_W + GAP) - GAP;
  const today = data[data.length - 1];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width="100%"
        viewBox={`0 0 ${svgW} ${height + 28}`}
        preserveAspectRatio="xMidYMid meet"
        className="min-w-[280px]"
      >
        {data.map((day, i) => {
          const barH = Math.max(4, (day.litersUsed / max) * height);
          const x = i * (BAR_W + GAP);
          const y = height - barH;
          const isToday = i === data.length - 1;
          const color = day.suppressedEvents > 0 ? '#00A8E8' : '#eab308';

          return (
            <g key={day.date}>
              <rect x={x} y={y} width={BAR_W} height={barH}
                fill={color} opacity={isToday ? 1 : 0.55} rx={4} />
              {/* Suppressed dot */}
              {day.suppressedEvents > 0 && (
                <circle cx={x + BAR_W / 2} cy={y - 6} r={3} fill="#00A8E8" />
              )}
              <text x={x + BAR_W / 2} y={height + 16} textAnchor="middle"
                fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="sans-serif">
                {day.date.replace('Jun ', '')}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm inline-block" style={{ background: '#eab308', opacity: 0.6 }} />
          <span className="text-white/40">Usage (L)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block bg-[#00A8E8]" />
          <span className="text-white/40">Irrigation suppressed</span>
        </div>
        <div className="ml-auto text-white/40">
          Today: <span className="text-white font-semibold">{today.litersUsed.toLocaleString()} L</span>
        </div>
      </div>
    </div>
  );
}
