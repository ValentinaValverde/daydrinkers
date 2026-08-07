type CoffeeItem = {name: string; lines: string[]};
type TeaItem = {name: string; note?: string};
type LatteItem = {name: string; hot: string; iced: string};
type AddOn = {name: string; price: string};

const coffee: CoffeeItem[] = [
  {name: 'Espresso', lines: ['Hot $3.75 · Iced $3.75']},
  {name: 'Americano', lines: ['Hot $3.75 · Iced $3.75']},
  {name: 'Espresso Tonic', lines: ['Iced — 16oz $5.00 · 24oz $6.50']},
  {name: 'Macchiato', lines: ['Hot $4.25 · Iced $4.25']},
  {name: 'Cortado', lines: ['Hot $4.25 · Iced $4.25']},
  {name: 'Cappuccino', lines: ['Hot $4.50 · Iced $4.50']},
  {
    name: 'Latte',
    lines: ['Hot — 12oz $5.00 · 16oz $5.50', 'Iced — 16oz $5.00 · 24oz $6.50'],
  },
  {name: 'Cold Brew', lines: ['Iced — 16oz $4.75 · 24oz $6.75']},
  {name: 'Drip', lines: ['8oz $2.25 · 12oz $3.25 · 16oz $3.75']},
];

const teas: TeaItem[] = [
  {name: 'Earl Grey'},
  {name: 'Mao Feng Green'},
  {name: 'Milk Oolong', note: 'Rose, jasmine, orchids'},
  {
    name: 'Paradise Peach (Decaf)',
    note: 'Apple pieces, hibiscus petals, rosehip, orange pieces',
  },
  {
    name: 'Golden Hour',
    note: 'Ceylon black tea, apple pieces, cinnamon, clove, rose, marigold, honey, vanilla',
  },
  {
    name: 'Meadows Blend (Decaf)',
    note: 'Organic chamomile, organic ginger, lemon verbena, organic lemongrass, organic rosehip, blue cornflower, organic licorice root',
  },
  {name: 'Peppermint (Decaf)'},
];

const teaLattes: LatteItem[] = [
  {name: 'Chai Tea Latte', hot: '12oz $5.00 · 16oz $5.50', iced: '16oz $5.00 · 24oz $6.50'},
  {name: 'Matcha Latte', hot: '12oz $5.00 · 16oz $5.50', iced: '16oz $5.00 · 24oz $6.50'},
  {name: 'Tea Latte', hot: '12oz $4.75 · 16oz $5.25', iced: '16oz $4.75 · 24oz $6.25'},
];

const syrups: AddOn[] = [
  {name: 'Vanilla', price: '$0.50'},
  {name: 'Lavender', price: '$0.50'},
  {name: 'Honey', price: '$0.50'},
  {name: 'Caramel', price: '$1.00'},
  {name: 'Chocolate', price: '$1.00'},
  {name: 'Brown Sugar Cinnamon', price: '$0.50'},
  {name: 'Simple', price: 'Included'},
];

const milk: AddOn[] = [
  {name: 'Local Whole Milk', price: 'Included'},
  {name: 'Califia Oat Milk', price: '$0.50'},
  {name: 'Califia Almond Milk', price: '$0.50'},
  {name: 'Half & Half', price: '$0.75'},
  {name: 'Heavy Cream', price: '$1.00'},
];

function SectionHeading({children}: {children: React.ReactNode}) {
  return (
    <h3 className="text-2xl font-bold text-[#2a6b8f] mb-5">{children}</h3>
  );
}

function AddOnRow({name, price}: AddOn) {
  return (
    <div className="flex items-end gap-2 text-black">
      <span className="text-lg">{name}</span>
      <span className="flex-1 min-w-4 border-b border-dotted border-black/40 mb-[6px]" />
      <span className="text-lg whitespace-nowrap text-black/70">{price}</span>
    </div>
  );
}

export default function MenuDrinksSection() {
  return (
    <section className="bg-[#f0f2ea] px-6 md:px-16 max-w-screen-xl mx-auto pt-16 md:pt-24 pb-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-black">Drinks</h2>
        <p className="text-base text-black mt-2">
          Served at both Greenville and Seneca.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
        {/* Left column */}
        <div className="flex flex-col gap-12">
          <div>
            <SectionHeading>Coffee</SectionHeading>
            <div className="flex flex-col gap-4">
              {coffee.map((item) => (
                <div key={item.name}>
                  <p className="text-lg font-semibold text-black leading-tight">
                    {item.name}
                  </p>
                  {item.lines.map((line) => (
                    <p key={line} className="text-sm text-black/70">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading>Tea Lattes</SectionHeading>
            <div className="flex flex-col gap-4">
              {teaLattes.map((item) => (
                <div key={item.name}>
                  <p className="text-lg font-semibold text-black leading-tight">
                    {item.name}
                  </p>
                  <p className="text-sm text-black/70">Hot — {item.hot}</p>
                  <p className="text-sm text-black/70">Iced — {item.iced}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading>House-Made Syrups</SectionHeading>
            <div className="flex flex-col gap-3">
              {syrups.map((item) => (
                <AddOnRow key={item.name} name={item.name} price={item.price} />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-12">
          <div>
            <SectionHeading>Tea</SectionHeading>
            <p className="text-sm text-black/70 mb-5">
              Hot — 12oz/16oz $4.00 · Iced — 16oz/24oz $4.00/$6.00
            </p>
            <div className="flex flex-col gap-4">
              {teas.map((item) => (
                <div key={item.name}>
                  <p className="text-lg font-semibold text-black leading-tight">
                    {item.name}
                  </p>
                  {item.note && (
                    <p className="text-sm text-black/70">{item.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading>Milk</SectionHeading>
            <div className="flex flex-col gap-3">
              {milk.map((item) => (
                <AddOnRow key={item.name} name={item.name} price={item.price} />
              ))}
            </div>
          </div>

          <p className="text-xs text-black/60 leading-relaxed">
            <span className="font-semibold">Allergen Notice:</span> Our menu
            items may contain or come into contact with common food allergens,
            including wheat, eggs, peanuts, tree nuts, milk, fish, shellfish,
            sesame, and soy. While we take precautions to accommodate dietary
            restrictions, cross-contamination can occur. Please inform your
            server of any food allergies or special dietary needs before
            ordering.
          </p>
        </div>
      </div>
    </section>
  );
}
