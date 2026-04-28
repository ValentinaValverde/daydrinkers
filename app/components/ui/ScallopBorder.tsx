interface ScallopBorderProps {
  color: string;
  flipped?: boolean;
  height?: number;
  bumps?: number;
}

export default function ScallopBorder({
  color,
  flipped = false,
  height = 80,
  bumps = 30,
}: ScallopBorderProps) {
  const width = 1280;
  const bumpWidth = width / bumps;
  const midY = 0;
  const peakY = height;

  let d = `M${width},${midY}`;
  for (let i = bumps; i > 0; i--) {
    const cx = (i - 0.5) * bumpWidth;
    const x2 = (i - 1) * bumpWidth;
    d += ` Q${cx},${peakY} ${x2},${midY}`;
  }
  d += ` L0,${-height * 2} L${width},${-height * 2} Z`;

  return (
    <div
      className="w-full overflow-hidden leading-none"
      style={{
        height: `${height}px`,
        transform: flipped ? 'scaleY(-1)' : undefined,
      }}
    >
      <svg
        viewBox={`0 ${-height * 2} ${width} ${height * 2 + height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        <path d={d} fill={color} />
      </svg>
    </div>
  );
}
