/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(214 32% 91%)', input: 'hsl(214 32% 91%)', ring: 'hsl(217 91% 40%)',
        background: 'hsl(0 0% 100%)', foreground: 'hsl(222 47% 11%)',
        primary: { DEFAULT: 'hsl(217 91% 40%)', foreground: 'hsl(0 0% 100%)' },
        secondary: { DEFAULT: 'hsl(210 40% 96%)', foreground: 'hsl(222 47% 11%)' },
        muted: { DEFAULT: 'hsl(210 40% 96%)', foreground: 'hsl(215 16% 47%)' },
        accent: { DEFAULT: 'hsl(210 40% 96%)', foreground: 'hsl(222 47% 11%)' },
      },
      borderRadius: { lg: '0.625rem', md: '0.5rem', sm: '0.375rem' },
    },
  },
  plugins: [],
}
