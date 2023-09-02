/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			"sans": [
				'Sora Variable', 'sans-serif'
			]
		},
		extend: {
			colors: {
				'poimandres': {
					dark: '#1B1E28',
					lighter: '#2B2E3B',
				},
			},
			keyframes: {
        animatedgradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      animation: {
        gradient: 'animatedgradient 6s ease infinite alternate',
      },
			rotate: {
				'135': '135deg'
			}
		},
	},
	plugins: [],
	darkMode: 'class'
}
