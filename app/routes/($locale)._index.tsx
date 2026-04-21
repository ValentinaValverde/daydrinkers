import type {Route} from './+types/_index';
import HeroSection from '~/components/home/HeroSection';
import FeaturesSection from '~/components/home/FeaturesSection';
import WinterCollectionSection from '~/components/home/WinterCollectionSection';
import OurStorySection from '~/components/home/OurStorySection';
import ShopCollectionSection from '~/components/home/ShopCollectionSection';
import MenuSection from '~/components/home/MenuSection';
import GiftCardsSection from '~/components/home/GiftCardsSection';
import LocationsSection from '~/components/home/LocationsSection';
import ContactSection from '~/components/home/ContactSection';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Daydrinkers'}];
};

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      <HeroSection />
      <FeaturesSection />
      <WinterCollectionSection />
      <OurStorySection />
      <ShopCollectionSection />
      {/* z-50 so overflowing menu images stack above the checkered section */}
      <div className="relative z-50">
        <MenuSection />
      </div>
      <GiftCardsSection />
      <LocationsSection />
      <ContactSection />
    </div>
  );
}
