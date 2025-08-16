/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./index.html", // Add this line to cover the main HTML file
		"./src/**/*.{ts,tsx}", // Ensure you cover all React files
	],
	theme: {
		extend: {
			fontFamily: {
				firasans: ["Fira Sans Condensed", "sans-serif"],
				manrope: ["Manrope", "sans-serif"],
			},
			colors: {
				skyblue: "#24A9E2",
				darkblue: "#2C3691",
				yellow: "#FEB92C",
				red: "#FD1E1E",
				gray: "#8F8F8F",
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
				},
			},
			backgroundImage: {
				topBarBg:
					"linear-gradient(90.06deg, rgba(36, 169, 226, 0.85) 14.95%, rgba(44, 54, 145, 0.85) 81.71%)",

				heroBanner:
					"linear-gradient(104.13deg, rgba(36, 169, 226, 0.45) 15%, rgba(44, 54, 145, 0.45) 82%), url(/src/assets/images/hero-banner.jpg)",
				careerBanner:
					"linear-gradient(104.13deg, rgba(36, 169, 226, 0.40) 15%, rgba(44, 54, 145, 0.40) 82%), url(/src/assets/images/career-hero-banner.jpg)",

				shapesBg: "url(/src/assets/images/shapes.png)",

				factsBg:
					"linear-gradient(97.01deg, rgba(36, 169, 226, 0.45) 15%, rgba(44, 54, 145, 0.45) 82%), url(/src/assets/images/facts-bg.jpg)",
			},
			width: {
				100: "30rem",
				"row-sm": "calc(100% - 2rem)",
				row: "calc(100% - 4rem)",
			},
			height: {
				"0-2rem": "0.2rem",
			},
			borderWidth: {
				"2rem": "0.125rem",
				"1rem": "0.1rem",
				"1-2rem": "0.120rem",
			},
			lineHeight: {
				12: "4rem",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
				wave: {
					"0%, 100%": { height: "10px" },
					"50%": { height: "50px" },
				},
				"caret-blink": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				wave: "wave 1s ease-in-out infinite",
				"caret-blink": "caret-blink 1s infinite",
			},
			animationDelay: {
				100: "0.1s",
				200: "0.2s",
				300: "0.3s",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
