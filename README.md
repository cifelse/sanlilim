# Sanlilim
A web application that aims to help Filipinos in locating their own nearest Evacuation Centers. The name Sanlilim was derived from two Filipino words sa'n (which means "where") and lilim (which means "shelter"). These two words make up the foundation of the aforementioned web application. This project is for the partial completion of the DATA101 course in De La Salle University in Manila, Philippines.

## Prerequisites
The following are the frameworks and tools that you must be familiar with to be able to contribute to this project:
1. [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) and [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html)
2. [Node.js](https://nodejs.org/en/download/) or [Bun](https://bun.sh/) (we personally prefer Bun)
3. [React](https://react.dev/learn)
4. [Next.js](https://nextjs.org/learn)
5. [Tailwind CSS](https://tailwindcss.com/docs)
6. [Vercel](https://vercel.com/docs)

## Running Locally
1. Run the following in your terminal starting with cloning the repository:
```bash
git clone https://github.com/cifrelabs/sanlilim.git
```
2. Install dependencies:
```bash
npm install    # or bun install
```
3. Create a `.env.local` file at the root of the project with the contents of `.env.template` and fill in the keys.

> [!IMPORTANT]
> The project will not run properly without the environment variables. Seek assistance from other developers in the team if you don't have the necessary values for the variables.

1. Run the development server:
```bash
npm run dev    # or bun dev
```

## Deployment
Once changes have been made, you can push commits to the `main` branch and Vercel will take care of the building and deployment. You can view the deployed progressive web application at [sanlilim.vercel.app](https://sanlilim.vercel.app).
