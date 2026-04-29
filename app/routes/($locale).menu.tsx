import type {MetaFunction} from 'react-router';
import MenuHeroSection from '~/components/menu/MenuHeroSection';
import MenuPastriesSection from '~/components/menu/MenuPastriesSection';
import MenuDrinksSection from '~/components/menu/MenuDrinksSection';
import MenuGrabAndGoSection from '~/components/menu/MenuGrabAndGoSection';
import MenuSyrupsSection from '~/components/menu/MenuSyrupsSection';
import MenuCollageSection from '~/components/menu/MenuCollageSection';

export const meta: MetaFunction = () => {
  return [{title: 'Daydrinkers | Menu'}];
};

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      <MenuHeroSection />
      <MenuPastriesSection />
      <MenuGrabAndGoSection />
      <MenuDrinksSection />
      {/* <MenuSyrupsSection /> */}
      <MenuCollageSection />
    </div>
  );
}
