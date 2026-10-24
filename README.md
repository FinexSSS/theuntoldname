# নিশিপদ্ম — Nishipoddo

**একটি রাতের কবিতা** · *A poem of one night*

An interactive Bangla poem you turn page by page. Ten short pages about darkness, water, a lamp,
a lotus and the light that stays. Each page is its own small scene, with its own way of opening and
something quiet to discover.

> পথ ছিল,
> দিশা ছিল না।
>
> জানালা ছিল,
> জোছনা ছিল না।

## The experience

- **Ten pages, thirteen scenes.** An opening, the ten poem pages, a short game and an ending. Each
  scene opens with a transition taken from its own image: a ripple, ink, stars, a window, the moon,
  lights, falling petals.
- **Words that answer back.** Some words in the poem (আলো, প্রদীপ, পদ্ম, জোছনা, দিশা, রেশ…) make
  the page respond: a glow, a lamp on the lake, a star, a warm horizon. There are no tooltips.
- **Find the real flower.** A small game: several lotuses float on the water, but only one is real.
  The rest are reflections. *আলোকে নয়, ফুলটাকে চিনুন।*
- **Hidden discoveries.** Small secrets are spread through the poem. One appears only if you stay
  still for a while: the lake goes calm and a single petal crosses the screen.
- **Music that moves the night.** A custom audio player plays the poem's music. The Web Audio API
  splits the sound into bass, mid and high bands that drive the visuals and make the lotus breathe.
- **Synthesised sound effects.** Page turns, ripples and chimes are made live with Web Audio
  oscillators, with no extra audio files.
- **A living background.** A canvas layer of drifting motes and ripples wherever you tap the water.
- **Every replay is a little different.** Positions shift slightly each time you start again.

## How to move through it

| Input | Action |
| --- | --- |
| `→`, `Enter`, `Space` | Next page |
| `←` | Previous page |
| Swipe left / right | Next / previous page on a phone |
| Dots on the right edge | Jump back to any page you have already reached |

It respects `prefers-reduced-motion`. Sound effects can be switched off on their own, and the music
player has play/pause, seek, volume, mute and loop.

## Design

- Night-violet palette with a warm lotus-pink light
- Bangla type: **Tiro Bangla**, **Noto Serif Bengali** and **Noto Sans Bengali**
- A soft custom cursor on mouse devices that opens into a ring over anything clickable; swipe and tap on phones
- The poem is stored as data (`src/content/poem.ts`), so the interface can be rebuilt without
  rewriting the poem

## Built with

- [React 19](https://react.dev) and TypeScript
- [TanStack Start](https://tanstack.com/start) with TanStack Router
- [Tailwind CSS v4](https://tailwindcss.com)
- Canvas 2D and the Web Audio API (`AnalyserNode`, oscillators)
- Vite
- Started in [Lovable](https://lovable.dev)

## Run it locally

You need [Node.js](https://nodejs.org) (or [Bun](https://bun.sh)).

```sh
git clone https://github.com/FinexSSS/theuntoldname.git
cd theuntoldname
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`, `npm run format`.

## Project structure

```
src/
  content/poem.ts                  the ten pages, the living words and their effects
  routes/index.tsx                 the page: scene switching, keyboard and swipe controls
  components/nishipoddo/
    experience*.ts(x)              shared state: current scene, transitions, discoveries, audio bands
    scenes/                        one component per scene (Arrival, Darkness, Path, Lamp, …, Ending)
    AudioPlayer.tsx                music player and frequency analyser
    AmbientCanvas.tsx              background canvas: motes, ripples, light effects
    Lotus.tsx                      the drawn lotus
  lib/nishipoddo/sfx.ts            synthesised sound effects
```
