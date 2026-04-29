import {SpotifyLogo, Play} from '@phosphor-icons/react';
import {useSpotify} from '~/components/SpotifyPlayer';

export default function SpotifySection() {
  const {playing, setPlaying} = useSpotify();

  return (
    <section className="bg-[#f0f2ea] py-16 md:py-20 px-6 md:px-16">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center gap-6">
        <SpotifyLogo size={40} weight="fill" className="text-black" />
        <h2 className="text-3xl md:text-5xl font-semibold text-black">
          Drink to this.
        </h2>
        <p className="text-base text-black max-w-sm">
          Press play and let the vibe wash over you while you plan your visit.
        </p>
        <button
          onClick={() => setPlaying(true)}
          disabled={playing}
          className="bg-black text-[#f0f2ea] border-2 border-black rounded-full px-8 py-4 flex flex-row items-center justify-center gap-3 w-fit mt-2 text-base group hover:bg-transparent hover:text-black transition-colors disabled:opacity-50 disabled:cursor-default disabled:hover:bg-black disabled:hover:text-[#f0f2ea]"
        >
          <Play size={16} weight="fill" />
          {playing ? 'Now playing...' : 'Play our playlist'}
        </button>
      </div>
    </section>
  );
}
