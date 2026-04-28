import PrimaryButton from '~/components/ui/Button';
import DraggableImage from '~/components/ui/DraggableImage';

const images = [
  {rotate: '-8deg', src: '/menu-images/pastry-1.png'},
  {rotate: '12deg', src: '/menu-images/pastry-2.png'},
  {rotate: '-5deg', src: '/menu-images/pastry-3.png'},
  {rotate: '7deg', src: '/menu-images/pastry-4.png'},
  {rotate: '-12deg', src: '/menu-images/pastry-5.png'},
  {rotate: '9deg', src: '/menu-images/pastry-6.png'},
  {rotate: '-6deg', src: '/menu-images/pastry-7.png'},
  {rotate: '-10deg', src: '/menu-images/pastry-8.png'},
  {rotate: '5deg', src: '/menu-images/pastry-9.png'},
  {rotate: '11deg', src: '/menu-images/pastry-10.png'},
  {rotate: '-4deg', src: '/menu-images/pastry-11.png'},
  {rotate: '8deg', src: '/menu-images/pastry-1.png'},
  {rotate: '-13deg', src: '/menu-images/pastry-2.png'},
  {rotate: '6deg', src: '/menu-images/pastry-3.png'},
  {rotate: '-9deg', src: '/menu-images/pastry-4.png'},
  {rotate: '13deg', src: '/menu-images/pastry-5.png'},
  {rotate: '-3deg', src: '/menu-images/pastry-6.png'},
  {rotate: '10deg', src: '/menu-images/pastry-7.png'},
  {rotate: '-11deg', src: '/menu-images/pastry-8.png'},
  {rotate: '5deg', src: '/menu-images/pastry-9.png'},
  {rotate: '11deg', src: '/menu-images/pastry-10.png'},
  {rotate: '-4deg', src: '/menu-images/pastry-11.png'},
  {rotate: '-8deg', src: '/menu-images/pastry-1.png'},
  {rotate: '12deg', src: '/menu-images/pastry-2.png'},
];

function CollageImage({src, rotate}: {src: string; rotate: string}) {
  return (
    <DraggableImage>
      <img
        src={src}
        alt=""
        className="w-full aspect-square object-contain drop-shadow-md hover:rotate-45 transition-all duration-300"
        style={{transform: `rotate(${rotate})`}}
      />
    </DraggableImage>
  );
}

export default function MenuCollageSection() {
  return (
    <section className="bg-[#f0f2ea] py-16 md:py-24 px-6 md:px-16">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-16 items-center">
          {/* Row 1 — 5 images */}
          {images.slice(0, 5).map((img, i) => (
            <CollageImage key={i} src={img.src} rotate={img.rotate} />
          ))}

          {/* Row 2 col 1 */}
          <CollageImage src={images[5].src} rotate={images[5].rotate} />

          {/* Text block — spans cols 2–4, rows 2–3 */}
          <div className="col-span-3 row-span-2 flex flex-col gap-5 px-4 md:px-8">
            <h2 className="text-3xl font-bold text-black leading-snug">
              Looking for something more permanent?
            </h2>
            <p className="text-base text-black">
              Love the Daydrinkers vibe? Take it home. Browse our full
              collection of apparel and goods made for people who like to keep
              it easy.
            </p>
            <PrimaryButton text="Shop Now" link="/collections" />
          </div>

          {/* Row 2 col 5 */}
          <CollageImage src={images[6].src} rotate={images[6].rotate} />

          {/* Row 3 col 1 */}
          <CollageImage src={images[7].src} rotate={images[7].rotate} />

          {/* Row 3 col 5 */}
          <CollageImage src={images[8].src} rotate={images[8].rotate} />

          {/* Rows 4–5 — remaining images */}
          {images.slice(9).map((img, i) => (
            <CollageImage key={i + 9} src={img.src} rotate={img.rotate} />
          ))}
        </div>
      </div>
    </section>
  );
}
