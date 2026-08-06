const features = [
  {
    title: 'Comfy apparel',
    description:
      "Tees, hats, and more — designed for people who like to look good while taking it easy. We take it seriously that you're repping us.",
    icon: '/seashell.svg',
  },
  {
    title: 'Drinks that hit',
    description:
      "House blend espresso, smooth cold brew, dreamy cold foams, housemade flavors — we take our drinks seriously so you can just enjoy the moment. There's something for everyone at the table.",
    icon: '/kettle.svg',
  },
  {
    title: 'Our people',
    description:
      'Our crew makes the difference. Come for the coffee, stay for the conversation.',
    icon: '/cards.svg',
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-[#e4ceb4] py-16">
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6"
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="flex-shrink-0 h-12 md:h-24 w-auto object-contain"
              />
              <div className="flex flex-col gap-2 pt-2 text-center md:text-left">
                <h3 className="text-base md:text-xl font-bold text-black">
                  {feature.title}
                </h3>
                <p className="text-base text-black max-w-[280px]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
