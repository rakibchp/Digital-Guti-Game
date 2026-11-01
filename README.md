# Guti — A game of beads

A responsive, local two-player version of **Guti Khela (গুটি খেলা)**, a traditional Bangladeshi bead-alignment game. Take turns placing three gutis each, then slide them along the board’s connected lines. The first player to align three gutis wins — or win by leaving your opponent with no legal move.

## Play

1. Player one and Player two take turns placing their three beads on any empty point.
2. After all six beads are on the board, select one of your beads and move it to an empty point connected by a line.
3. Make a row, column, or diagonal of three to win. If a player has no legal move, their opponent wins.
4. Choose **New game** to clear the board and start again.

The board is designed for two people sharing one screen. Click or tap the points to place and move beads; during the sliding phase, select a bead before choosing its destination.

## Getting started

### Requirements

- Node.js 20.9 or later
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Built with

- [Next.js](https://nextjs.org/) App Router
- [React](https://react.dev/) and TypeScript
- [Tailwind CSS](https://tailwindcss.com/) with custom responsive game-board styling

The game runs entirely in the browser; it does not require an account, backend, or external game service.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
