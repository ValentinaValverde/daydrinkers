import type {Location} from './LocationToggle';
import {MenuItemCard} from './shared';

type PastryItem = {name: string; price: string; image: string; tag?: string};

const sharedPastries: PastryItem[] = [
  {
    name: 'Chocolate chip cookie',
    price: '$3.15',
    image: '/menu-images/pastry-3.png',
  },
  {
    name: 'GF banana chocolate chip loaf',
    price: '$3.15',
    image: '/menu-images/pastry-7.png',
  },
  {
    name: 'Cinnamon roll',
    price: '$3.15',
    image: '/menu-images/pastry-1.png',
    tag: 'Saturdays only',
  },
];

const pastryItems: Record<Location, PastryItem[]> = {
  greenville: [...sharedPastries],
  seneca: [
    ...sharedPastries,
    {
      name: 'Bacon, egg, and cheese sandwich',
      price: '$3.15',
      image: '/menu-images/pastry-6.png',
      tag: 'Fri-Sun only',
    },
    {
      name: 'Garden press sandwich',
      price: '$3.15',
      image: '/menu-images/pastry-7.png',
      tag: 'Fri-Sun only',
    },
    {
      name: 'Avocado smash toast',
      price: '$3.15',
      image: '/menu-images/pastry-8.png',
      tag: 'Fri-Sun only',
    },
    {
      name: 'Waffle with topping',
      price: '$3.15',
      image: '/menu-images/pastry-9.png',
      tag: 'Fri-Sun only',
    },
  ],
};

export default function MenuPastriesSection({location}: {location: Location}) {
  const items = pastryItems[location];

  return (
    <section className="bg-[#f0f2ea] px-6 md:px-16 max-w-screen-xl mx-auto py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-black">Goodies</h2>
        <p className="text-base text-black mt-2">
          Baked fresh and made to disappear.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-12">
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
  );
}
