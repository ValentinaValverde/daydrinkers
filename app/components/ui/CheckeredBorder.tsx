const TILE = 106;

const checkerStyle: React.CSSProperties = {
  backgroundImage: `repeating-conic-gradient(#2a6b8f 0deg 90deg, #f0f2ea 90deg 180deg)`,
  backgroundSize: `${TILE}px ${TILE}px`,
  padding: `${TILE}px`,
};

export default function CheckeredBorder({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full" style={checkerStyle}>
      <div className="bg-[#f0f2ea]">{children}</div>
    </div>
  );
}
