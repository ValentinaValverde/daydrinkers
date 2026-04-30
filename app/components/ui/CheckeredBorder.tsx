const TILE = 106;

const checkerStyle: React.CSSProperties = {
  backgroundImage: `repeating-conic-gradient(#2a6b8f 0deg 90deg, #f0f2ea 90deg 180deg)`,
  backgroundSize: `${TILE}px ${TILE}px`,
};

export default function CheckeredBorder({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-[53px] py-[106px] md:px-[106px]" style={checkerStyle}>
      <div className="bg-[#f0f2ea]">{children}</div>
    </div>
  );
}
