# [`Game of "Life"`](https://game-live-gules.vercel.app/)
The `Game of Life`, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTRxYm5vdjR2cW1xdm9waWpwdWVnM2wyZTkwcjBpdHlxNWc0aDNsNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0Tc1tmZ2pu4YlXCX5/giphy-downsized-large.gif)

## Rules:

- Any live cell with fewer than two live neighbors dies, as if by underpopulation.
- Any live cell with two or three live neighbors lives on to the next generation.
- Any live cell with more than three live neighbors dies, as if by overpopulation.
- Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

## Implementation:

My implementation of the Game of Life is entirely based on `GPU computations` with using `WebGL`. Both the computation of new states and their display are carried out using fragment shaders.
The game can be run on a `1000`x`1000` field without significant loss of performance.