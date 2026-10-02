# SpongeBob Side-Scrolling Game

A SpongeBob-themed side-scrolling platformer built with [p5.js](https://p5js.org/) and the p5.sound library as a final game project.

## Features

- Side-scrolling world with a camera that follows SpongeBob.
- Platforms ("sticks") to jump onto, and canyons to avoid.
- Plankton enemies that patrol the level.
- Patty collectibles that raise your score.
- Lives (Gary) and game-over handling.
- A Krusty Krab flagpole that marks the end of the level.
- Sound effects and a theme song using p5.sound.

## Controls

| Key | Action |
|-----|--------|
| `A` | Move left |
| `D` | Move right |
| `W` | Jump |
| `Space` | Restart after Game Over or Level Complete |

## Project Structure

```
sound_template/
├── index.html          # Loads p5, p5.sound and the game
├── sketch.js           # All game code
├── p5.min.js
├── p5.sound.min.js
└── assets/             # Sound effects and theme song (.mp3)
```

## Run Locally

The game needs to be served from a local web server so the sounds load.

```bash
git clone https://github.com/ayeshaatif07/Game-Project-Final-Submission.git
cd Game-Project-Final-Submission/sound_template
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser. Press `Ctrl+C` in the terminal to stop the server.

If you already have the project folder, just run the last command from inside `sound_template`:

```bash
python3 -m http.server 8000
```

If the page looks stale after an update, hard refresh with `Cmd+Shift+R` (`Ctrl+Shift+R` on Windows/Linux).

## Author and Credits

- **Author:** Ayesha Atif
- **Coursework:** Introduction to Programming 1 – Final Game Project
- Sounds from [101soundboards](https://www.101soundboards.com/boards/20194-spongebob-squarepants-sounds)
- Built with [p5.js](https://p5js.org/) and p5.sound
