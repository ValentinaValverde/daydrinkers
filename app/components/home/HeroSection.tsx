import {useEffect, useState} from 'react';
import {SecondaryButton} from '~/components/ui/Button';

export default function HeroSection() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.3);
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full h-[500px] md:h-[853px] overflow-hidden">
      <img
        src="/images/header-img.png"
        alt="Hero background"
        className="absolute inset-0 w-full h-[110%] object-cover"
        style={{transform: `translateY(${offset}px)`}}
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 px-6 md:px-8">
        <h1 className="text-white text-3xl md:text-5xl font-semibold text-center leading-tight">
          Comfy apparel, top notch drinks, cool people.
        </h1>
        <SecondaryButton text="Shop Now" link="/collections/all" />
      </div>
    </section>
  );
}
