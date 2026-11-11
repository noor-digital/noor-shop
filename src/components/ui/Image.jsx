import { useState } from 'react';
import { classNames } from '../../lib/format.js';

const FALLBACK_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='#F2F4F5'/>
          <stop offset='1' stop-color='#E8E6F7'/>
        </linearGradient>
      </defs>
      <rect width='400' height='400' fill='url(#g)'/>
      <g fill='none' stroke='#C0B5F3' stroke-width='3' stroke-linecap='round'>
        <path d='M120 260 L180 200 L230 240 L290 170'/>
        <circle cx='260' cy='150' r='18'/>
      </g>
      <text x='200' y='310' text-anchor='middle'
        font-family='Inter, system-ui, sans-serif' font-size='18'
        fill='#8A82C8' letter-spacing='1'>NOOR SHOP</text>
    </svg>`
  );

/**
 * Image with a graceful inline-SVG fallback.
 * - Keeps the card height stable (ratio aware via className).
 * - Never shows a broken-image glyph.
 * - Uses lazy loading and async decoding by default.
 */
export default function Image({
  src,
  alt = '',
  className = '',
  loading = 'lazy',
  decoding = 'async',
  ...rest
}) {
  const [failed, setFailed] = useState(false);
  const url = failed || !src ? FALLBACK_SVG : src;
  return (
    <img
      src={url}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={() => setFailed(true)}
      className={classNames('bg-canvas', className)}
      {...rest}
    />
  );
}
