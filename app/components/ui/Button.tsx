import {ArrowRightIcon} from '@phosphor-icons/react';

export default function PrimaryButton({
  text,
  link,
  target,
}: {
  text: string;
  link: string;
  target?: string;
}) {
  return (
    <a
      href={link}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className="bg-black text-[#f0f2ea] border-2 border-black rounded-full px-8 py-4 flex flex-row items-center justify-center w-fit mt-2 text-base group hover:bg-transparent hover:text-black transition-colors"
    >
      {text}
      <span className="overflow-hidden w-0 group-hover:w-4 group-hover:ml-4 transition-all duration-300">
        <ArrowRightIcon
          size={16}
          weight="bold"
          className="translate-x-[-16px] group-hover:translate-x-0 transition-transform duration-300"
        />
      </span>
    </a>
  );
}

export function SecondaryButton({text, link}: {text: string; link: string}) {
  return (
    <a
      href={link}
      className="bg-[#f0f2ea] text-[#3c6d8e] border-2 border-[#f0f2ea] rounded-full px-8 py-4 flex flex-row items-center justify-center w-fit text-base font-medium group hover:bg-transparent hover:text-white transition-colors"
    >
      {text}
      <span className="overflow-hidden w-0 group-hover:w-4 group-hover:ml-4 transition-all duration-300">
        <ArrowRightIcon
          size={16}
          weight="bold"
          className="translate-x-[-16px] group-hover:translate-x-0 transition-transform duration-300"
        />
      </span>
    </a>
  );
}
