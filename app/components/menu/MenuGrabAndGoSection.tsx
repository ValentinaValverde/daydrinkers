import {MenuItemCard} from './shared';

const grabAndGoData = [
  {name: 'Item 1', price: '$3.15', image: '/menu-images/pastry-5.png'},
  {name: 'Item 2', price: '$3.15', image: '/menu-images/pastry-2.png'},
  {name: 'Item 3', price: '$3.15', image: '/menu-images/pastry-3.png'},
  {name: 'Item 4', price: '$3.15', image: '/menu-images/pastry-4.png'},
];

export default function MenuGrabAndGoSection() {
  return (
    <section className="bg-[#f0f2ea] py-16 md:py-24 px-6 md:px-16 max-w-screen-xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-black">Grab &amp; Go</h2>
        <p className="text-base text-black mt-2">
          Perfect for busy mornings or afternoon cravings — grab something good on your way.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
        {grabAndGoData.map((item, i) => (
          <MenuItemCard
            key={i}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </section>
  );
}
