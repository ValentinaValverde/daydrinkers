import type {Location} from './LocationToggle';
import ScallopBorder from '~/components/ui/ScallopBorder';
import {MenuItemCard} from './shared';

type SeasonalMenuItem = {
  name: string;
  price: string;
  image: string;
  tag?: string;
};

const sharedItems: SeasonalMenuItem[] = [
  {
    name: 'Item 1',
    price: '$3.15',
    image: '/menu-images/pastry-1.png',
  },
];

const seasonalItems: Record<Location, SeasonalMenuItem[]> = {
  greenville: [
    {
      name: 'Tomato basil scone',
      price: '$3.15',
      image: '/menu-images/pastry-1.png',
    },
    {
      name: 'Spinach Feta Puff',
      price: '$3.15',
      image: '/menu-images/pastry-2.png',
    },
    {
      name: 'Early Grey Berry Scone',
      price: '$3.15',
      image: '/menu-images/pastry-3.png',
    },
    {
      name: 'GF/V Oatberry bar',
      price: '$3.15',
      image: '/menu-images/pastry-4.png',
      tag: 'Contains nuts',
    },
    {
      name: 'Lemon blueberry danish',
      price: '$3.15',
      image: '/menu-images/pastry-5.png',
    },
    // ...sharedItems,
  ],
  seneca: [
    {
      name: 'Lemon earl grey shortbread',
      price: '$3.15',
      image: '/menu-images/pastry-6.png',
    },
    {
      name: 'French onion scone',
      price: '$3.15',
      image: '/menu-images/pastry-7.png',
    },
    {
      name: 'Strawberry white chocolate scone',
      price: '$3.15',
      image: '/menu-images/pastry-8.png',
    },
    {
      name: 'GF PB chocolate sandwich cookie',
      price: '$3.15',
      image: '/menu-images/pastry-9.png',
    },
    {
      name: 'Blueberry lemon poppyseed roll',
      price: '$3.15',
      image: '/menu-images/pastry-10.png',
      tag: 'Fri-Sun only',
    },
    // ...sharedItems,
  ],
};

export default function MenuSeasonalSection({location}: {location: Location}) {
  const items = seasonalItems[location];

  return (
    <>
      <div className="bg-[#f0f2ea] rotate-180">
        <ScallopBorder color="#e4ceb4" />
      </div>

      <div className="bg-[#e4ceb4] rounded-b-[32px] ">
        <section className="px-6 md:px-16 max-w-screen-xl mx-auto py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-black">
              Seasonal Selections
            </h2>
            {/* <p className="text-base text-black mt-2">
              Lorem ipsum dolor sit amet.
            </p> */}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {items.map((item, i) => (
              <MenuItemCard
                key={i}
                name={item.name}
                price={item.price}
                image={item.image}
                tag={item.tag}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
