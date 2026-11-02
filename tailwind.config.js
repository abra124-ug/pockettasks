const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        ink: v('ink'),
        muted: v('muted'),
        line: v('line'),
        brand: { DEFAULT: v('brand'), dark: v('brand-dark'), soft: v('brand-soft'), ink: v('brand-ink') },
        accent: { DEFAULT: v('accent'), soft: v('accent-soft'), ink: v('accent-ink') },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Roboto', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(16 40 40 / 0.04), 0 6px 16px rgb(16 40 40 / 0.06)',
        nav: '0 -6px 24px rgb(16 40 40 / 0.07)',
        fab: '0 10px 22px rgb(249 115 22 / 0.38)',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'none' } },
        slideIn: { from: { opacity: 0, transform: 'translateX(28px)' }, to: { opacity: 1, transform: 'none' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        pop: { '0%': { transform: 'scale(0.5)', opacity: 0 }, '60%': { transform: 'scale(1.18)', opacity: 1 }, '100%': { transform: 'scale(1)' } },
        sheetUp: { from: { transform: 'translateY(100%)' }, to: { transform: 'none' } },
        toastIn: { from: { opacity: 0, transform: 'translateY(-14px) scale(0.96)' }, to: { opacity: 1, transform: 'none' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '20%,60%': { transform: 'translateX(-6px)' }, '40%,80%': { transform: 'translateX(6px)' } },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'fade-up': 'fadeUp .42s cubic-bezier(.22,1,.36,1) both',
        'slide-in': 'slideIn .34s cubic-bezier(.22,1,.36,1) both',
        'fade-in': 'fadeIn .2s ease-out both',
        pop: 'pop .35s cubic-bezier(.22,1,.36,1) both',
        'sheet-up': 'sheetUp .32s cubic-bezier(.22,1,.36,1) both',
        'toast-in': 'toastIn .3s cubic-bezier(.22,1,.36,1) both',
        shake: 'shake .35s ease-in-out',
      },
    },
  },
  plugins: [],
};
