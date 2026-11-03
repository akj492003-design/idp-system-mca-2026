import { useEffect, useRef, useState } from 'react';

function CountryFlag({ country }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span className="inline-flex h-4 w-6 shrink-0 items-center justify-center overflow-hidden rounded-[3px] bg-slate-800 ring-1 ring-white/10">
      {!imageFailed ? (
        <img
          src={`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`}
          alt=""
          width="40"
          height="30"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="text-[8px] font-bold leading-none text-slate-200" aria-hidden="true">
          {country.iso}
        </span>
      )}
    </span>
  );
}

export default function CountryCodeSelect({ countries, value, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);
  const selectedIndex = Math.max(0, countries.findIndex((country) => country.iso === value));
  const selectedCountry = countries[selectedIndex];

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const frame = window.requestAnimationFrame(() => {
      optionRefs.current[activeIndex]?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  const moveActiveOption = (nextIndex) => {
    const boundedIndex = Math.max(0, Math.min(nextIndex, countries.length - 1));
    setActiveIndex(boundedIndex);
    window.requestAnimationFrame(() => optionRefs.current[boundedIndex]?.focus());
  };

  const openAt = (index = selectedIndex) => {
    setActiveIndex(Math.max(0, Math.min(index, countries.length - 1)));
    setIsOpen(true);
  };

  const chooseCountry = (country) => {
    onChange(country.iso);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event) => {
    if (disabled) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openAt(selectedIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openAt(selectedIndex);
    } else if (event.key === 'Home') {
      event.preventDefault();
      openAt(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      openAt(countries.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isOpen) setIsOpen(false);
      else openAt(selectedIndex);
    }
  };

  const handleOptionKeyDown = (event, index) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActiveOption((index + 1) % countries.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActiveOption((index - 1 + countries.length) % countries.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveActiveOption(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      moveActiveOption(countries.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      chooseCountry(countries[index]);
    } else if (event.key === 'Tab') {
      triggerRef.current?.focus();
      setIsOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <button
        ref={triggerRef}
        id="country-code"
        type="button"
        disabled={disabled}
        aria-label={`Country code: ${selectedCountry.name}, +${selectedCountry.dial}. Change country`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? setIsOpen(false) : openAt(selectedIndex))}
        onKeyDown={handleTriggerKeyDown}
        className="flex w-full min-w-0 items-center justify-between gap-1.5 rounded-xl border border-[#1e3a8a] bg-[#0b1a3d] px-2 py-3.5 text-[11px] text-slate-100 transition duration-300 hover:border-sky-400/50 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:text-xs"
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <CountryFlag key={selectedCountry.iso} country={selectedCountry} />
          <span className="truncate">{selectedCountry.name}</span>
          <span className="shrink-0 text-slate-300">(+{selectedCountry.dial})</span>
        </span>
        <svg className={`h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Choose country and dialing code"
          className="absolute left-0 top-full z-50 mt-2 max-h-64 w-72 max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain rounded-xl border border-[#1e3a8a] bg-[#0b1a3d] p-1.5 shadow-[0_18px_45px_-15px_rgba(0,0,0,0.85)] sm:w-80"
        >
          {countries.map((country, index) => (
            <button
              key={country.iso}
              ref={(element) => { optionRefs.current[index] = element; }}
              id={`country-option-${country.iso}`}
              type="button"
              role="option"
              aria-selected={country.iso === value}
              onClick={() => chooseCountry(country)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400/70 ${country.iso === value ? 'bg-blue-600/25 text-white' : 'text-slate-300 hover:bg-blue-500/15 hover:text-white'}`}
            >
              <CountryFlag country={country} />
              <span className="min-w-0 flex-1 truncate">{country.name}</span>
              <span className="shrink-0 tabular-nums text-slate-400">+{country.dial}</span>
              {country.iso === value && <span className="text-sky-300" aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
