interface Props { level: number; capacityL: number; }

export default function TankGauge({ level, capacityL }: Props) {
  const clampedLevel = Math.max(0, Math.min(100, level));
  const color = clampedLevel < 20 ? '#f97316' : clampedLevel < 40 ? '#eab308' : '#34d399';
  const currentL = Math.round((clampedLevel / 100) * capacityL);

  // SVG dimensions
  const W = 80; const H = 160;
  const padX = 8; const padTop = 16; const padBot = 16;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBot;
  const fillH = (clampedLevel / 100) * innerH;
  const fillY = padTop + innerH - fillH;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Tank body */}
        <rect x={padX} y={padTop} width={innerW} height={innerH} rx={6} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        {/* Water fill */}
        <rect x={padX + 1} y={fillY} width={innerW - 2} height={fillH - 0.5} rx={4}
          fill={color} opacity={0.75}
          style={{ transition: 'all 1s ease' }}
        />
        {/* Wave shimmer */}
        <rect x={padX + 1} y={fillY} width={innerW - 2} height={3} rx={2} fill="white" opacity={0.15} />
        {/* Level text inside */}
        <text x={W / 2} y={padTop + innerH / 2 + 5} textAnchor="middle" fill="white" fontSize={14} fontWeight="700">
          {clampedLevel}%
        </text>
      </svg>
      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color }}>{currentL.toLocaleString()} L</p>
        <p className="text-[11px] text-white/30">of {capacityL.toLocaleString()} L</p>
      </div>
    </div>
  );
}
