import {MenuItemCard} from './shared';

const pastryData = [
  {name: 'Pastry 1', price: '$3.15', image: '/menu-images/pastry-1.png'},
  {name: 'Pastry 2', price: '$3.15', image: '/menu-images/pastry-2.png'},
  {name: 'Pastry 3', price: '$3.15', image: '/menu-images/pastry-3.png'},
  {name: 'Pastry 4', price: '$3.15', image: '/menu-images/pastry-4.png'},
  {name: 'Pastry 5', price: '$3.15', image: '/menu-images/pastry-5.png'},
  {name: 'Pastry 6', price: '$3.15', image: '/menu-images/pastry-6.png'},
  {name: 'Pastry 7', price: '$3.15', image: '/menu-images/pastry-7.png'},
  {name: 'Pastry 8', price: '$3.15', image: '/menu-images/pastry-8.png'},
  {name: 'Pastry 9', price: '$3.15', image: '/menu-images/pastry-9.png'},
  {name: 'Pastry 10', price: '$3.15', image: '/menu-images/pastry-10.png'},
  {name: 'Pastry 11', price: '$3.15', image: '/menu-images/pastry-11.png'},
];

export default function MenuPastriesSection() {
  return (
    <section className="bg-[#f0f2ea] px-6 md:px-16 max-w-screen-xl mx-auto py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-black">Pastries</h2>
        <p className="text-base text-black mt-2">
          Lorem ipsum dolor sit amet consectetur adipiscing elit.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-12">
        {pastryData.map((item, i) => (
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
