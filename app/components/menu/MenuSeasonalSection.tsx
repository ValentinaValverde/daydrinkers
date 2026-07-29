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
    name: 'Blueberry poptart',
    price: '$3.15',
    image: '/menu-images/shared/blueberry-poptart.png',
  },
  {
    name: 'Guava pastelito',
    price: '$3.15',
    image: '/menu-images/shared/guava-pastelito.png',
  },
  {
    name: 'Tomato Pie',
    price: '$3.15',
    image: '/menu-images/shared/tomato-pie.png',
  },
  {
    name: 'Orange Cardamom Cinnamon Roll',
    price: '$3.15',
    image: '/menu-images/shared/orange-cinnamon-roll.png',
  },
  {
    name: 'Pesto Mozzarella Puff Pastry',
    price: '$3.15',
    image: '/menu-images/shared/pesto-mozz-puff-pastry.png',
  },
];

const seasonalItems: Record<Location, SeasonalMenuItem[]> = {
  greenville: [
    ...sharedItems,
    {
      name: 'Tomato basil scone',
      price: '$3.15',
      image: '/menu-images/gvl/tomato-basil.png',
    },
    {
      name: 'Spinach Feta Puff',
      price: '$3.15',
      image: '/menu-images/gvl/spinach-feta.png',
    },
    {
      name: 'Blackberry Earl Gray Scone',
      price: '$3.15',
      image: '/menu-images/gvl/blackberry-earl-gray.png',
    },
    // {
    //   name: 'GF/V Oatberry bar',
    //   price: '$3.15',
    //   image: '/menu-images/placeholder.png',
    //   tag: 'Contains nuts',
    // },
    {
      name: 'Lemon blueberry danish',
      price: '$3.15',
      image: '/menu-images/gvl/blueberry-lemon-danish.png',
    },
  ],
  seneca: [
    ...sharedItems,
    {
      name: 'French onion scone',
      price: '$3.15',
      image: '/menu-images/seneca/french-onion-scone.png',
    },
    {
      name: 'Strawberry white chocolate scone',
      price: '$3.15',
      image: '/menu-images/seneca/strawberry-white-choc-scone.png',
    },
    {
      name: 'GF PB chocolate sandwich cookie',
      price: '$3.15',
      image: '/menu-images/seneca/gf-pb-choc-sandwich-cookie.png',
    },
    {
      name: 'Oatmeal raisin cookie',
      price: '$3.15',
      image: '/menu-images/seneca/oatmeal-raisin-cookie.png',
    },
    {
      name: 'Jalapeno cheddar scone',
      price: '$3.15',
      image: '/menu-images/seneca/jalapeno-cheddar-scone.png',
    },
    {
      name: 'Lemon earl grey shortbread',
      price: '$3.15',
      image: '/menu-images/seneca/earl-gray-lemon.png',
    },
    // {
    //   name: 'Blueberry lemon poppyseed roll',
    //   price: '$3.15',
    //   image: '/menu-images/placeholder.png',
    //   tag: 'Fri-Sun only',
    // },
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
