import type {Location} from './LocationToggle';
import ScallopBorder from '~/components/ui/ScallopBorder';
import {MenuItemCard} from './shared';

type SeasonalMenuItem = {
  name: string;
  price: string;
  image: string;
  tag?: string;
};

// Shared summer seasonal items — offered at both Greenville and Seneca.
const sharedItems: SeasonalMenuItem[] = [
  {
    name: 'Blueberry poptart',
    price: '$3.15',
    image: '/menu-images/shared/blueberry-poptart.png',
  },
  {
    name: 'Guava pastelito',
    price: '$3.15',
    image: '/menu-images/shared/guava-pastelito.png',
  },
];

const seasonalItems: Record<Location, SeasonalMenuItem[]> = {
  greenville: [
    ...sharedItems,
    {
      name: 'Tomato pie',
      price: '$3.15',
      image: '/menu-images/shared/tomato-pie.png',
    },
    {
      name: 'Orange cardamom cinnamon roll',
      price: '$3.15',
      image: '/menu-images/shared/orange-cinnamon-roll.png',
    },
    {
      name: 'Tomato pesto puff',
      price: '$3.15',
      image: '/menu-images/shared/pesto-mozz-puff-pastry.png',
    },
    {
      name: 'Lemon scone',
      price: '$3.15',
      image: '/menu-images/gvl/lemon-scone.png',
    },
    {
      name: 'Matcha cookie',
      price: '$3.15',
      image: '/menu-images/gvl/matcha-cookie.png',
    },
  ],
  seneca: [
    ...sharedItems,
    {
      name: 'Tomato jalapeño cheddar scone',
      price: '$3.15',
      image: '/menu-images/seneca/jalapeno-cheddar-scone.png',
    },
    {
      name: 'Oatmeal raisin cookie',
      price: '$3.15',
      image: '/menu-images/seneca/oatmeal-raisin-cookie.png',
    },
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
