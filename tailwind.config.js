/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF7F4',
          dark: '#F2EDE8',
        },
        blush: {
          DEFAULT: '#FDF0F4',
          mid: '#F5D4DC',
        },
        rose: {
          DEFAULT: '#E8899A',
          deep: '#C4607A',
          dark: '#9E445C',
        },
        gold: {
          DEFAULT: '#B8904A',
          light: '#EEE0C4',
        },
        charcoal: '#1A1920',
        ink: '#2D2B3A',
        muted: '#6B6880',
        faint: '#A8A5B8',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 20px rgba(26,25,32,0.05)',
        rose: '0 8px 28px rgba(196,96,122,0.22)',
        'rose-lg': '0 16px 48px rgba(196,96,122,0.28)',
      },
      backgroundImage: {
        'gradient-rose': 'linear-gradient(135deg, #E8899A 0%, #C4607A 100%)',
        'gradient-dark': 'linear-gradient(135deg, #2D2B3A 0%, #1A1920 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4A860 0%, #9E7030 100%)',
        'gradient-blush': 'linear-gradient(135deg, #FDF0F4 0%, #F5D4DC 100%)',
        'gradient-success': 'linear-gradient(135deg, #88C8A4 0%, #5AAA80 100%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
