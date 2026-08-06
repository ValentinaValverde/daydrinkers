import CheckeredBorder from '~/components/ui/CheckeredBorder';
import PrimaryButton from '~/components/ui/Button';

export default function GiftCardsSection() {
  return (
    <section className="relative z-10 bg-[#f0f2ea]">
      <CheckeredBorder>
        <div className="flex flex-col items-center justify-center gap-10 py-16 px-6 md:py-20 md:px-24 text-center">
          <p className="text-2xl text-black max-w-[526px] leading-relaxed">
            Give the gift of a good excuse to slow down. Perfect for the coffee
            lovers, snack fiends, and daydrinkers in your life.
          </p>
          <PrimaryButton
            text="Gift Cards"
            link="https://squareup.com/gift/MLAGR2N3GH71F/order"
            target="_blank"
          />
        </div>
      </CheckeredBorder>
    </section>
  );
}
