import localFont from "next/font/local";

export const display = localFont({
	src: [
		{
			path: '400.ttf',
			weight: '400',
		},
		{
			path: '500.ttf',
			weight: '500',
		},
		{
			path: '600.ttf',
			weight: '600',
		},
	],
	display: 'swap',
	variable: '--font-bowlby',
});