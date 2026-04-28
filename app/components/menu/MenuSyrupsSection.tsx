import {useState} from 'react';
import ScallopBorder from '~/components/ui/ScallopBorder';

const syrupData = [
  {name: 'Vanilla', image: '/vanilla.jpg'},
  {name: 'Lavender', image: '/lavender.jpg'},
  {name: 'Honey', image: '/honey.jpg'},
  {name: 'Caramel', image: '/caramel.jpg'},
  {name: 'Chocolate', image: '/chocolate.jpg'},
  {name: 'Brown Sugar', image: '/brown-sugar.jpg'},
  {name: 'Cinnamon', image: '/cinnamon.jpg'},
];

export default function MenuSyrupsSection() {
  const [active, setActive] = useState('Vanilla');

  return (
    <>
      <div className="bg-[#f0f2ea] rotate-180">
        <ScallopBorder color="#5c5043" />
      </div>

      <section className="bg-[#5c5043] rounded-b-[32px] overflow-hidden">
        <div className="text-center pt-16 pb-10 px-6">
          <h2 className="text-3xl font-semibold text-white">
            House-Made Syrups
          </h2>
          <p className="text-base text-white mt-2 opacity-80">
            This is what it looks like when there are no photos.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 text-white text-xl mb-48 px-6">
          {syrupData.map((syrup) => (
            <span
              key={syrup.name}
              onMouseEnter={() => setActive(syrup.name)}
              className={`cursor-default transition-all duration-200 ${
                active === syrup.name
                  ? 'font-bold'
                  : 'opacity-60 hover:opacity-90'
              }`}
            >
              {syrup.name}
            </span>
          ))}
        </div>

        {/* Image row — mb-[-160px] clips the bottom half; active image rises 128px */}
        <div className="flex -space-x-[64px] px-4 mb-[-160px]">
          {syrupData.map((syrup) => (
            <div
              key={syrup.name}
              className={`flex-1 transition-transform duration-500 ease-out ${
                active === syrup.name ? '-translate-y-[128px]' : 'translate-y-0'
              }`}
            >
              <img
                src={syrup.image}
                alt={syrup.name}
                className={`w-full h-[320px] object-cover rounded-t-2xl ${
                  active === syrup.name
                    ? 'shadow-[-4px_4px_0_0_rgba(0,0,0,0.5)]'
                    : ''
                }`}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
