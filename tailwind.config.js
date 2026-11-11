/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F2F4F5',
        surface: '#FFFFFF',
        ink: '#171717',
        'ink-black': '#000000',
        muted: '#787574',
        hairline: '#EBEBEB',
        stone: '#CCCCCC',
        fog: '#ACB0AA',
        violet: {
          DEFAULT: '#5433EB',
          wash: '#C0B5F3',
          soft: '#EDEAFD',
        },
        slate: '#332F2D',
        ash: '#665A54',
        success: '#15803D',
        warning: '#B45309',
        danger: '#B91C1C',
      },
      fontFamily: {
        sans: [
          'GT Standard',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: ['GT Standard', 'Inter', 'sans-serif'],
      },
      fontSize: {
        caption: ['11px', { lineHeight: '1.33' }],
        'body-sm': ['12px', { lineHeight: '1.33' }],
        body: ['14px', { lineHeight: '1.33' }],
        'body-lg': ['16px', { lineHeight: '1.33' }],
        display: ['28px', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        hero: ['44px', { lineHeight: '1.05', letterSpacing: '-0.035em' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.031em',
        tightish: '-0.017em',
        micro: '-0.014em',
      },
      borderRadius: {
        card: '28px',
        pill: '9999px',
        chip: '9999px',
        input: '9999px',
        inner: '20px',
      },
      boxShadow: {
        soft: 'rgba(0,0,0,0.06) 0px 2px 8px 0px',
        card: 'rgba(0,0,0,0.1) 0px 4px 6px -1px, rgba(0,0,0,0.1) 0px 2px 4px -2px',
        lift: 'rgba(0,0,0,0.12) 0px 4px 24px 0px',
        violet: 'rgba(69,36,219,0.34) 0px 4px 24px 0px',
      },
      maxWidth: {
        page: '1200px',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
