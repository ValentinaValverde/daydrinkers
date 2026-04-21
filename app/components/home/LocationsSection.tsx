const locations = [
  {
    name: 'Greenville Daydrinkers',
    address: '2903 Old Buncombe Rd. Greenville, SC 29609',
    image: '/images/greenville-location.png',
    link: 'https://www.google.com/maps/dir//daydrinkers,+2903+Old+Buncombe+Rd,+Greenville,+SC+29609/@34.716397,-82.2673408,15z',
  },
  {
    name: 'Seneca Daydrinkers',
    address: '307 E North 1st Street Seneca, SC 29678',
    image: '/images/greenville-location.png',
    link: 'https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=us&sa=X&geocode=KYvd_yHv9ViIMY9N2OHCTh7s&daddr=307+E+North+1st+St,+Seneca,+SC+29678',
  },
];

export default function LocationsSection() {
  return (
    <section id="locations" className="bg-[#f0f2ea] py-16 md:py-64">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8">
        <div className="text-left md:text-right mb-8 md:-mb-8">
          <h2 className="text-2xl font-bold text-black">You can find us here!</h2>
          <p className="text-base text-black mt-2">
            Lorem ipsum dolor sit amet consectetur adipiscing elit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((location, i) => (
            <div
              key={location.name}
              className={`flex flex-col gap-4${i === 1 ? ' md:mt-[89px]' : ''}`}
            >
              <a
                className="rounded-[64px] overflow-hidden hover:rotate-8 transition-all duration-300 border-2 border-black block"
                href={location.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-[380px] object-cover"
                />
              </a>
              <div className="text-base text-black">
                <p className="font-bold">{location.name}</p>
                <p>{location.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
