import React from 'react';

export const BRAND_GOLD = '#B8832F';
export const BRAND_NAVY = '#1C1B2E';

// Shopping-bag "B" mark. `handleColor` should contrast with the background it sits on.
export const BrandMark = ({ height = 38, handleColor = BRAND_NAVY, className = '' }) => (
  <svg
    viewBox="0 0 48 56"
    height={height}
    width={(height * 48) / 56}
    aria-hidden="true"
    className={`shrink-0 ${className}`}
  >
    <path d="M15 16V11a9 9 0 0 1 18 0v5" fill="none" stroke={handleColor} strokeWidth="4" strokeLinecap="round" />
    <rect x="0" y="12" width="48" height="44" rx="10" fill={BRAND_GOLD} />
    <path
      d="M17.5 23H24.5a5.25 5.25 0 0 1 0 10.5H17.5Z M17.5 33.5H25.5a5.75 5.75 0 0 1 0 11.5H17.5Z"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
  </svg>
);

const SIZES = {
  sm: { mark: 30, word: 'text-2xl', tag: 'text-[7px] tracking-[0.3em]', gap: 'gap-2.5' },
  md: { mark: 38, word: 'text-[30px]', tag: 'text-[8px] tracking-[0.32em]', gap: 'gap-3' },
  lg: { mark: 54, word: 'text-5xl', tag: 'text-[10px] tracking-[0.35em]', gap: 'gap-4' },
};

// Full Bazaro logo: bag mark + serif wordmark + optional tagline.
// tone="dark" is for light backgrounds, tone="light" for dark backgrounds.
const BrandLogo = ({ size = 'md', tone = 'dark', tagline = 'Online Marketplace', taglineClassName = '', className = '' }) => {
  const s = SIZES[size] || SIZES.md;
  const isLight = tone === 'light';

  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <BrandMark height={s.mark} handleColor={isLight ? '#F7F2EA' : BRAND_NAVY} />
      <span className="flex flex-col leading-none">
        <span
          className={`${s.word} font-bold tracking-tight ${isLight ? 'text-white' : 'text-[#1C1B2E]'}`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Bazaro<span style={{ color: BRAND_GOLD }}>.</span>
        </span>
        {tagline && (
          <span
            className={`${s.tag} mt-1 uppercase font-medium font-body ${
              isLight ? 'text-slate-400' : 'text-[#5B5A6B]'
            } ${taglineClassName}`}
          >
            {tagline}
          </span>
        )}
      </span>
    </span>
  );
};

export default BrandLogo;
