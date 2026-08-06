import {useEffect, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import type {ContactActionData} from '~/routes/api.contact';

const decorativeImages = [
  {
    src: '/images/contact-img.png',
    baseRotation: -7.5,
    speed: 0.02,
    classes: 'w-[370px] h-[481px]',
    zIndex: 2,
  },
  {
    src: '/images/baby-nikki.png',
    baseRotation: 13,
    speed: 0.012,
    classes: 'w-[135px] h-[131px]',
    zIndex: 3,
  },
  {
    src: '/images/baby-katie.png',
    baseRotation: 19,
    speed: -0.025,
    classes: 'w-[176px] h-[172px]',
    zIndex: 3,
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollDelta, setScrollDelta] = useState(0);
  const fetcher = useFetcher<ContactActionData>();
  const isSubmitting = fetcher.state !== 'idle';
  const data = fetcher.data;
  const succeeded = data?.ok === true;
  const errors = data?.errors;

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      setScrollDelta(window.innerHeight / 2 - sectionCenter);
    };
    window.addEventListener('scroll', handleScroll, {passive: true});
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#f0f2ea] py-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left: decorative images — desktop only */}
          <div className="hidden md:flex relative h-[560px] items-center justify-center">
            <div
              className={`${decorativeImages[0].classes} rounded-[32px] overflow-hidden absolute border border-black left-1/2 top-1/2`}
              style={{
                zIndex: 2,
                transform: `translate(-50%, -50%) rotate(${decorativeImages[0].baseRotation + scrollDelta * decorativeImages[0].speed}deg)`,
                boxShadow: '-4px 4px 0 0 rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={decorativeImages[0].src}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`${decorativeImages[1].classes} rounded-[32px] overflow-hidden absolute border border-black`}
              style={{
                top: '30px',
                left: '30px',
                zIndex: 3,
                transform: `rotate(${decorativeImages[1].baseRotation + scrollDelta * decorativeImages[1].speed}deg)`,
                boxShadow: '-4px 4px 0 0 rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={decorativeImages[1].src}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`${decorativeImages[2].classes} rounded-[32px] overflow-hidden absolute border border-black`}
              style={{
                bottom: '30px',
                right: '10px',
                zIndex: 3,
                transform: `rotate(${decorativeImages[2].baseRotation + scrollDelta * decorativeImages[2].speed}deg)`,
                boxShadow: '-4px 4px 0 0 rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={decorativeImages[2].src}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: contact form */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-bold text-black">
                We would love to chat!
              </h2>
              <p className="text-base text-black mt-2">
                Drop us a note and we&rsquo;ll get back to you soon.
              </p>
            </div>

            {succeeded ? (
              <div
                role="status"
                className="bg-white border border-[#2a6b8f] rounded-[32px] px-8 py-10 text-center"
              >
                <p className="text-xl font-bold text-black">
                  Thanks for reaching out!
                </p>
                <p className="text-base text-black mt-2">
                  We got your message and someone from our crew will get back to
                  you soon.
                </p>
              </div>
            ) : (
              <fetcher.Form
                method="post"
                action="/api/contact"
                className="flex flex-col gap-4"
              >
                {/* Honeypot — hidden from real users, catches bots. */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  autoComplete="name"
                  className="bg-white border border-[#2a6b8f] rounded-full px-8 h-[67px] text-base text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-[#2a6b8f]"
                />

                <div className="flex flex-col gap-1">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email*"
                    autoComplete="email"
                    aria-invalid={errors?.email ? true : undefined}
                    className="bg-white border border-[#2a6b8f] rounded-full px-8 h-[67px] text-base text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-[#2a6b8f]"
                  />
                  {errors?.email && (
                    <p className="text-sm text-red-700 px-4">{errors.email}</p>
                  )}
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  autoComplete="tel"
                  className="bg-white border border-[#2a6b8f] rounded-full px-8 h-[67px] text-base text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-[#2a6b8f]"
                />

                <div className="flex flex-col gap-1">
                  <textarea
                    name="message"
                    required
                    placeholder="What's on your mind?"
                    rows={5}
                    aria-invalid={errors?.message ? true : undefined}
                    className="bg-white border border-[#2a6b8f] rounded-[32px] px-8 py-5 text-base text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-[#2a6b8f] resize-none h-[212px]"
                  />
                  {errors?.message && (
                    <p className="text-sm text-red-700 px-4">{errors.message}</p>
                  )}
                </div>

                {errors?.form && (
                  <p className="text-sm text-red-700 px-4">{errors.form}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-[#f0f2ea] border-2 border-black rounded-full px-8 py-4 flex items-center text-base w-fit mt-2 hover:bg-transparent hover:text-black transition-colors disabled:opacity-60 disabled:hover:bg-black disabled:hover:text-[#f0f2ea] disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending…' : 'Submit'}
                </button>
              </fetcher.Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
