import {createContext, useContext, useState} from 'react';
import {SpotifyLogo, X} from '@phosphor-icons/react';

const PLAYLIST_ID = '5cwPclg5ZtafoBPWgZMHMb';

type SpotifyContextType = {
  playing: boolean;
  setPlaying: (v: boolean) => void;
};

const SpotifyContext = createContext<SpotifyContextType>({
  playing: false,
  setPlaying: () => {},
});

export function useSpotify() {
  return useContext(SpotifyContext);
}

export function SpotifyProvider({children}: {children: React.ReactNode}) {
  const [playing, setPlaying] = useState(false);

  return (
    <SpotifyContext.Provider value={{playing, setPlaying}}>
      {children}
      {playing && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col rounded-[24px] overflow-hidden shadow-2xl w-[320px]">
          <iframe
            src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&autoplay=1`}
            width="320"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="border-0 block"
          />
        </div>
      )}
    </SpotifyContext.Provider>
  );
}
