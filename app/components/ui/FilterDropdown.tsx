import {useState, useEffect, useRef} from 'react';
import {CaretUp, CaretDown, Check} from '@phosphor-icons/react';

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: {label: string; value: string}[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-base"
      >
        <span className="font-semibold">{label}:</span>
        <span>{selectedLabel}</span>
        {open ? <CaretUp size={14} /> : <CaretDown size={14} />}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 z-20 bg-white border border-black rounded-lg p-4 flex flex-col gap-3 min-w-[160px]">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="flex items-center justify-between gap-6 text-left text-base hover:opacity-60 transition-opacity"
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
