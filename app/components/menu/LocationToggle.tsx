export type Location = 'greenville' | 'seneca';

export default function LocationToggle({
  location,
  onLocationChange,
}: {
  location: Location;
  onLocationChange: (loc: Location) => void;
}) {
  return (
    <div className="flex justify-center py-10 bg-[#f0f2ea]">
      <div className="inline-flex bg-[#e4ceb4] rounded-full p-1">
        <button
          onClick={() => onLocationChange('greenville')}
          className={`px-8 py-3 rounded-full text-base transition-all duration-200 ${
            location === 'greenville'
              ? 'bg-black text-white'
              : 'text-black/60 hover:text-black'
          }`}
        >
          Greenville
        </button>
        <button
          onClick={() => onLocationChange('seneca')}
          className={`px-8 py-3 rounded-full text-base transition-all duration-200 ${
            location === 'seneca'
              ? 'bg-black text-white'
              : 'text-black/60 hover:text-black'
          }`}
        >
          Seneca
        </button>
      </div>
    </div>
  );
}
