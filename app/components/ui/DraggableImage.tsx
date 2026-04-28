import {useEffect, useRef, useState} from 'react';

export default function DraggableImage({
  className,
  style,
  baseTransform,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  baseTransform?: string;
  children: React.ReactNode;
}) {
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({mouseX: 0, mouseY: 0, offsetX: 0, offsetY: 0});

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  };

  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e: MouseEvent) => {
      setOffset({
        x: dragStart.current.offsetX + e.clientX - dragStart.current.mouseX,
        y: dragStart.current.offsetY + e.clientY - dragStart.current.mouseY,
      });
    };
    const onMouseUp = () => setDragging(false);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `${baseTransform ?? ''} translate(${offset.x}px, ${offset.y}px)`.trim(),
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}
