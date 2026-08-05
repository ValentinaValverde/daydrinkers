import type {MetaFunction} from 'react-router';

export const meta: MetaFunction = () => {
  return [{title: 'Daydrinkers | Events'}];
};

import {useEffect, useRef} from 'react';

export default function EventsPage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw = () => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;

      const ctx = canvas.getContext('2d')!;
      const W = wrap.offsetWidth;
      const H = wrap.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      const r = 22;
      const pad = r;
      const cW = W + pad * 2;
      const cH = H + pad * 2;

      canvas.width = cW * dpr;
      canvas.height = cH * dpr;
      canvas.style.width = `${cW}px`;
      canvas.style.height = `${cH}px`;
      canvas.style.left = `-${pad}px`;
      canvas.style.top = `-${pad}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cW, cH);
      ctx.fillStyle = '#d4b99a';

      const cols = Math.floor(W / (r * 1.85));
      const colStep = W / cols;
      const rows = Math.floor(H / (r * 1.85));
      const rowStep = H / rows;

      for (let i = 0; i <= cols; i++) {
        const cx = pad + colStep * i;
        ctx.beginPath();
        ctx.arc(cx, pad, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, pad + H, r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 1; i < rows; i++) {
        const cy = pad + rowStep * i;
        ctx.beginPath();
        ctx.arc(pad, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pad + W, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      {/* <EventsHeroSection /> */}

      <div className="min-h-[400px] relative z-10 flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Event Calendar</h1>
        <p className="text-base max-w-[452px] opacity-90">
          Lorem ipsum dolor sit amet.
        </p>
      </div>

      <div style={{padding: 50, borderRadius: 16}}>
        <div
          ref={wrapRef}
          style={{position: 'relative', background: '#d4b99a'}}
        >
          <iframe
            src="https://calendar.google.com/calendar/embed?src=vvgreenville%40gmail.com&ctz=America%2FNew_York"
            className="rounded-xl border-2 border-black w-full h-[700px]"
            style={{position: 'relative', zIndex: 2}}
          />

          <canvas
            ref={canvasRef}
            style={{position: 'absolute', pointerEvents: 'none', zIndex: 1}}
          />
        </div>
      </div>
    </div>
  );
}
