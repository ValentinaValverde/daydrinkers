import {useState} from 'react';
import type {MetaFunction} from 'react-router';
import MenuHeroSection from '~/components/menu/MenuHeroSection';
import MenuPastriesSection from '~/components/menu/MenuPastriesSection';
import MenuDrinksSection from '~/components/menu/MenuDrinksSection';
import MenuGrabAndGoSection from '~/components/menu/MenuGrabAndGoSection';
import MenuSeasonalSection from '~/components/menu/MenuSeasonalSection';
import MenuCollageSection from '~/components/menu/MenuCollageSection';
import LocationToggle, {type Location} from '~/components/menu/LocationToggle';

export const meta: MetaFunction = () => {
  return [{title: 'Daydrinkers | Menu'}];
};

export default function MenuPage() {
  const [location, setLocation] = useState<Location>('greenville');

  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      <MenuHeroSection />
      <MenuDrinksSection />

      {/* Pastries — location-specific, chosen via the toggle below */}
      <div className="bg-[#f0f2ea] text-center px-6 pt-16 md:pt-24">
        <h2 className="text-4xl md:text-5xl font-bold text-black">Pastries</h2>
      </div>
      <LocationToggle location={location} onLocationChange={setLocation} />
      <MenuPastriesSection location={location} />
      {/* <MenuGrabAndGoSection location={location} /> */}
      <MenuSeasonalSection location={location} />
      <MenuCollageSection />
    </div>
  );
}
