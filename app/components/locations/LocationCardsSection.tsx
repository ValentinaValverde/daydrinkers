const locations = [
  {
    name: 'Greenville Daydrinkers',
    address: '2903 Old Buncombe Rd. Greenville, SC 29609',
    description:
      'Nestled in the heart of Greenville, this is where it all started. Stop by for your morning brew, an afternoon treat, or just to say hello.',
    image: '/images/greenville-location.png',
    link: 'https://www.google.com/maps/dir//daydrinkers,+2903+Old+Buncombe+Rd,+Greenville,+SC+29609',
    reversed: false,
  },
  {
    name: 'Seneca Daydrinkers',
    address: '307 E North 1st Street Seneca, SC 29678',
    description:
      'Our Seneca spot brings the same good vibes to the upstate. Come hang out, grab a pastry, and stay a while — we\'ve got plenty of room.',
    image: '/images/greenville-location.png',
    link: 'https://www.google.com/maps?daddr=307+E+North+1st+St,+Seneca,+SC+29678',
    reversed: true,
  },
];

export default function LocationCardsSection() {
  return (
    <section className="bg-[#f0f2ea] py-16 md:py-24">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8 flex flex-col gap-16 md:gap-28">
        {locations.map((location, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              location.reversed ? 'md:flex-row-reverse' : 'md:flex-row'
            } items-center gap-8 md:gap-16`}
          >
            {/* Image — links to maps */}
            <a
              href={location.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-1/2 rounded-[64px] overflow-hidden hover:rotate-[2deg] transition-all duration-300 border border-black flex-shrink-0"
            >
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-[380px] object-cover"
              />
            </a>

            {/* Details */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-medium text-black">{location.name}</h2>
                <p className="text-base text-black mt-1">{location.address}</p>
              </div>
              <p className="text-base text-black">{location.description}</p>
              <a
                href={location.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-[#f0f2ea] border-2 border-black rounded-full px-8 h-[52px] flex items-center w-fit font-medium hover:bg-transparent hover:text-black transition-colors mt-2"
              >
                Get Directions →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
