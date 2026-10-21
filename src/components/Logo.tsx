"use client";

import Link from 'next/link';
import uniclampMark from '@/assets/uniclamp-mark.png';

interface LogoProps {
  href?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showSubtext?: boolean;
}

export function Logo({
  href = '/',
  className = '',
  size = 'default',
  showSubtext = true,
}: LogoProps) {
  const markHeight =
    size === 'sm' ? 'h-6' : size === 'lg' ? 'h-9 md:h-10' : 'h-7 md:h-8';
  const subtextSize =
    size === 'sm' ? 'text-[7px]' : size === 'lg' ? 'text-[9.5px]' : 'text-[7.5px] sm:text-[8.5px]';

  return (
    <Link
      href={href}
      aria-label="UNIclamp - Pipe Supports & Fixing Systems"
      className={`inline-flex flex-col items-start justify-center select-none group transition-all duration-200 ${className}`}
    >
      <img
        src={typeof uniclampMark === 'string' ? uniclampMark : (uniclampMark as any).src}
        alt="UNIclamp"
        className={`${markHeight} w-auto object-contain block`}
      />
      {showSubtext && (
        <span
          className={`${subtextSize} font-bold tracking-[0.20em] text-white/95 uppercase font-sans mt-1 leading-none whitespace-nowrap block transition-colors duration-200 group-hover:text-[#f6c042]`}
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
          }}
        >
          PIPE SUPPORTS &amp; FIXING SYSTEMS
        </span>
      )}
    </Link>
  );
}

export default Logo;
