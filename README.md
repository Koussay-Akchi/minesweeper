# Basic Minesweeper

A basic Minesweeper game built with React. 

I made this out of curiosity/boredom, it came out decent enough somehow 🤷
## 👉 [Live website](https://basic-minesweeper.web.app/)
<div style="display: flex; gap: 20px;">
    <img src="/minesweeper.png" alt="screenshot" height="300">
</div>



## Features
- Customizable board size (Small, Medium, Big)
- Customizable Difficulty settings (Easy, Medium, Hard) that adjust mine density
- Win/Loss tracking stored in local storage
- Flagging cells
- Audio feedback

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Koussay-Akchi/minesweeper.git
   ```

2. Navigate to the project directory:

   ```bash
   cd minesweeper
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and go to `http://localhost:5173/`.

## Usage

- Click on a cell to reveal it.
- If you reveal a mine, you lose the game 💣.
- If you reveal a cell with 0 neighboring mines, it will automatically reveal adjacent cells.
- Right-click on a cell to flag it as a potential mine 🚩.
- Try to reveal all non-mine cells to win!

## Game Rules

- The objective is to clear the board without hitting any mines.
- Each cell can either be a mine or a number indicating how many mines are next to it.
- If a player clicks on a mine, the game is over.
- If a player successfully reveals all non-mine cells, they win the game.
