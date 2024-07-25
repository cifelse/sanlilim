import localFont from "next/font/local";

export const display = localFont({
	src: [
		{
			path: '400.ttf',
			weight: '400',
		},
	],
	display: 'swap',
	variable: '--font-nunito',
});