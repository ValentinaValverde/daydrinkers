import {useEffect, useRef, useState} from 'react';
import ScallopBorder from '~/components/ui/ScallopBorder';

const TEXT =
  'We started Daydrinkers because we believed a great drink deserved a great atmosphere. Born in the South Carolina foothills, we\'re part café, part gathering place — a spot where good coffee, fresh pastries, and good company all collide. Whether you\'re starting your morning or stretching your afternoon, we\'re here for it.';

export default function OurStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const delay = windowHeight * 0.2;
      const progress = Math.max(
        0,
        Math.min(1, (windowHeight - rect.top - delay) / windowHeight),
      );
      setRevealedCount(Math.round(progress * TEXT.length));
    };
    window.addEventListener('scroll', handleScroll, {passive: true});
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-32 overflow-hidden">
      <img
        src="/images/about-img.png"
        alt="Our story"
        className="absolute inset-0 w-full h-full object-cover rounded-b-[64px]"
      />
      <div className="absolute inset-0 bg-black/35 rounded-b-[64px]" />
      <div className="absolute top-0 left-0 w-full z-[1]">
        <ScallopBorder color="#f0f2ea" />
      </div>
      <div className="relative z-10 mt-12 flex flex-col items-center justify-center h-full gap-8 px-6 md:px-8 text-center">
        <p className="text-2xl md:text-5xl font-semibold max-w-[904px] leading-tight">
          {TEXT.split('').map((char, i) => (
            <span
              key={i}
              style={{
                color:
                  i < revealedCount
                    ? 'rgba(255,255,255,1)'
                    : 'rgba(255,255,255,0.2)',
                transition: 'color 0.3s ease',
              }}
            >
              {char}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
