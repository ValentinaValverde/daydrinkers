import type {Location} from './LocationToggle';
import {MenuItemCard} from './shared';

type GrabAndGoItem = {name: string; price: string; image: string; tag?: string};

const sharedItems: GrabAndGoItem[] = [
  {
    name: 'Bacon egg and cheese sandwich',
    price: '$3.15',
    image: '/menu-images/pastry-3.png',
  },
  {
    name: 'Bacon and cheese Quiche bites',
    price: '$3.15',
    image: '/menu-images/pastry-7.png',
  },
  {
    name: 'Spinach tomato feta quiche bites',
    price: '$3.15',
    image: '/menu-images/pastry-1.png',
  },
];

const grabAndGoItems: Record<Location, GrabAndGoItem[]> = {
  greenville: [
    {name: 'Energy bites', price: '$3.15', image: '/menu-images/pastry-5.png'},
    {
      name: 'PB chocolate chip overnight oats',
      price: '$3.15',
      image: '/menu-images/pastry-2.png',
    },
    ...sharedItems,
  ],
  seneca: [...sharedItems],
};

export default function MenuGrabAndGoSection({location}: {location: Location}) {
  const items = grabAndGoItems[location];

  return (
    <section className="bg-[#f0f2ea] py-16 md:py-24 px-6 md:px-16 max-w-screen-xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-black">Grab &amp; Go</h2>
        <p className="text-base text-black mt-2">
          Perfect for busy mornings or afternoon cravings — grab something good
          on your way.
        </p>
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
  );
}
