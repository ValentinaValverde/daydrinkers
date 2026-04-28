import ScallopBorder from '~/components/ui/ScallopBorder';

const drinks = [
  'Espresso',
  'Americano',
  'Espresso Tonic',
  'Macchiato',
  'Cortado',
  'Cappuccino',
  'Latte',
  'Homemade Nitro Cold Brew',
  'Drip',
  'Chai',
  'Matcha',
];

function MenuRow({name, price}: {name: string; price: string}) {
  return (
    <div className="flex items-end gap-2 text-black">
      <span className="font-semibold text-xl whitespace-nowrap">{name}</span>
      <span className="flex-1 border-b border-dotted border-black/50 mb-[5px]" />
      <span className="text-xl whitespace-nowrap">{price}</span>
    </div>
  );
}

export default function MenuDrinksSection() {
  return (
    <>
      <div className="bg-[#f0f2ea] rotate-180">
        <ScallopBorder color="#e4ceb4" />
      </div>

      <section className="bg-[#e4ceb4] rounded-b-[32px] pb-24 px-6 md:px-16">
        <div className="max-w-screen-xl mx-auto pt-16">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-semibold text-black text-center mb-2">
                Drinks
              </h2>
              <p className="text-base text-black text-center mb-8">
                This is what it looks like when there are no photos.
              </p>
              <div className="flex flex-col gap-4">
                {drinks.map((name) => (
                  <MenuRow key={`drink-${name}`} name={name} price="$3.25" />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-black text-center mb-2">
                Tea
              </h2>
              <p className="text-base text-black text-center mb-8">
                This is what it looks like when there are no photos.
              </p>
              <div className="flex flex-col gap-4">
                {drinks.map((name) => (
                  <MenuRow key={`tea-${name}`} name={name} price="$3.25" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
