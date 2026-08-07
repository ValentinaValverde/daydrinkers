type SummerDrink = {name: string; recipe: string; note: string};

const summerDrinks: SummerDrink[] = [
  {
    name: 'Banana Boat',
    recipe: 'Espresso + homemade caramelized banana syrup + milk',
    note: 'Also good as a matcha!',
  },
  {
    name: 'Bahama Mama',
    recipe: 'Espresso + homemade toasted coconut syrup + milk',
    note: 'Also good as a matcha',
  },
  {
    name: 'Mango Spritz',
    recipe: 'Tonic water + mango nectar + squeeze of lime + sprinkle of Tajín',
    note: 'Refreshingly spicy',
  },
  {
    name: 'Mango Matcha Lemonade',
    recipe: 'Lemonade + mango nectar + matcha',
    note: 'The only way to drink matcha this summer!',
  },
];

export default function MenuSummerDrinksSection() {
  return (
    <section className="bg-[#f0f2ea] px-6 md:px-16 pb-16 md:pb-24">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-[#2a6b8f] rounded-[32px] px-6 py-14 md:px-16 md:py-20 text-[#f0f2ea]">
          <div className="text-center flex flex-col items-center gap-3">
            <h2 className="text-3xl md:text-4xl font-bold">Summer Menu</h2>
            <p className="text-lg italic opacity-80">xoxo, daydrinkers</p>
            <span className="mt-2 text-sm md:text-base bg-[#f0f2ea] text-[#2a6b8f] font-medium rounded-full px-5 py-2">
              Add blueberry cream cheese cold foam to any drink · $1.00
            </span>
          </div>

          <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
            {summerDrinks.map((drink) => (
              <div key={drink.name} className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold">{drink.name}</h3>
                <p className="mt-2 text-base md:text-lg opacity-90">
                  {drink.recipe}
                </p>
                <p className="mt-1 text-base italic opacity-70">{drink.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
