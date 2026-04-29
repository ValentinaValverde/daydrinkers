import {useState} from 'react';
import type {MetaFunction} from 'react-router';
import MenuHeroSection from '~/components/menu/MenuHeroSection';
import MenuPastriesSection from '~/components/menu/MenuPastriesSection';
import MenuDrinksSection from '~/components/menu/MenuDrinksSection';
import MenuGrabAndGoSection from '~/components/menu/MenuGrabAndGoSection';
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
      <LocationToggle location={location} onLocationChange={setLocation} />
      <MenuPastriesSection location={location} />
      <MenuGrabAndGoSection location={location} />
      <MenuDrinksSection location={location} />
      <MenuCollageSection />
    </div>
  );
}
