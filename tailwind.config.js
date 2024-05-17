/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			scrollbar: {
				custom: {
					width: "12px",
					track: {
						background: "#f1f1f1"
					},
					thumb: {
						background: "#888",
						rounded: "md"
					},
					hover: {
						thumb: {
							background: "#555"
						}
					}
				}
			},
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				btn: {
					background: "hsl(var(--btn-background))",
					"background-hover": "hsl(var(--btn-background-hover))"
				}
			},
			keyframes: {
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" }
				}
			},
			animation: {
				"caret-blink": "caret-blink 1.25s ease-out infinite"
			}
		}
	},
	plugins: []
};
