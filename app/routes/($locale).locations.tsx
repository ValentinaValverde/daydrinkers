import type {MetaFunction} from 'react-router';
import LocationsHeroSection from '~/components/locations/LocationsHeroSection';
import LocationCardsSection from '~/components/locations/LocationCardsSection';
import SpotifySection from '~/components/locations/SpotifySection';
import GrabABiteSection from '~/components/locations/GrabABiteSection';

export const meta: MetaFunction = () => {
  return [{title: 'Daydrinkers | Locations'}];
};

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      <LocationsHeroSection />
      <LocationCardsSection />
      <SpotifySection />
      <GrabABiteSection />
    </div>
  );
}
