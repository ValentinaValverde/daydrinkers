import {SecondaryButton} from '~/components/ui/Button';
import DraggableImage from '~/components/ui/DraggableImage';
import ScallopBorder from '~/components/ui/ScallopBorder';

export default function MenuSection() {
  return (
    <div id="menu">
      <div className="bg-[#f0f2ea] rotate-180">
        <ScallopBorder color="#2a6b8f" />
      </div>

      <section className="bg-[#2a6b8f] overflow-x-clip">
        <div
          className="max-w-screen-xl mx-auto px-6 md:px-16 relative"
          style={{minHeight: '800px'}}
        >
          <div className="flex flex-col gap-6 pt-16 md:pt-32 max-w-[440px] relative z-10">
            <h2 className="text-2xl font-bold text-[#f0f2ea]">
              Looking for our menu?
            </h2>
            <p className="text-base text-[#f0f2ea]">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
              faucibus ex sapien vitae pellentesque sem placerat. In id cursus
              mi pretium tellus duis convallis.
            </p>
            <SecondaryButton text="Explore Options" link="/menu" />
          </div>

          {/* Mobile: single image */}
          <div className="md:hidden mt-10 pb-16 flex justify-center">
            <div
              className="w-full max-w-[340px] h-[380px] rounded-[24px] overflow-hidden"
              style={{
                transform: 'rotate(5deg)',
                boxShadow: '-8px 8px 0 0 rgba(0,0,0,0.5)',
              }}
            >
              <img
                src="/images/menu-img-1.png"
                alt="Menu tray"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Desktop: three draggable rotated images */}
          <DraggableImage className="hidden md:block absolute top-[50px] right-[-30px] z-10">
            <div
              className="w-[420px] h-[530px] rounded-[24px] overflow-hidden border border-black"
              style={{
                transform: 'rotate(14deg)',
                boxShadow: '-8px 8px 0 0 rgba(0,0,0,0.5)',
              }}
            >
              <img
                src="/images/menu-img-1.png"
                alt="Menu tray"
                className="w-full h-full object-cover"
              />
            </div>
          </DraggableImage>

          <DraggableImage className="hidden md:block absolute top-[280px] right-[300px] z-30">
            <div
              className="w-[400px] h-[480px] rounded-[24px] overflow-hidden border border-black"
              style={{
                transform: 'rotate(-30deg)',
                boxShadow: '-8px 8px 0 0 rgba(0,0,0,0.5)',
              }}
            >
              <img
                src="/images/menu-img-2.png"
                alt="Menu food board"
                className="w-full h-full object-cover"
              />
            </div>
          </DraggableImage>

          <DraggableImage className="hidden md:block absolute top-[450px] right-[670px] z-20">
            <div
              className="w-[370px] h-[370px] rounded-[24px] overflow-hidden border border-black"
              style={{
                transform: 'rotate(12deg)',
                boxShadow: '-8px 8px 0 0 rgba(0,0,0,0.5)',
              }}
            >
              <img
                src="/images/menu-img-3.png"
                alt="Menu food plates"
                className="w-full h-full object-cover"
              />
            </div>
          </DraggableImage>
        </div>
      </section>
    </div>
  );
}
