import React, { useEffect, useState } from "react";
import { Board } from "../types";
import Cell from "./Cell";

const DEFAULT_ROWS = 10;
const DEFAULT_COLS = 10;
const DEFAULT_MINES_PERCENTAGE = 0.2;

const createBoard = (
  rows: number,
  cols: number,
  minesPercentage: number
): Board => {
  const board: Board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      neighboringMines: 0,
    }))
  );

  const totalCells = rows * cols;
  const mines = Math.floor(totalCells * minesPercentage);

  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = r + i;
            const newCol = c + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
              board[newRow][newCol].neighboringMines++;
            }
          }
        }
      }
    }
  }

  return board;
};

const Game: React.FC = () => {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [minesPercentage, setMinesPercentage] = useState(
    DEFAULT_MINES_PERCENTAGE
  );
  const [board, setBoard] = useState<Board>(
    createBoard(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_MINES_PERCENTAGE)
  );
  const [lost, setLost] = useState(false);
  const [, setRemainingCells] = useState(
    rows * cols - Math.floor(rows * cols * minesPercentage)
  );
  const [wins, setWins] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [size, setSize] = useState<"small" | "medium" | "big">("small");

  useEffect(() => {
    const storedWins = localStorage.getItem("wins");
    const storedLosses = localStorage.getItem("losses");
    if (storedWins) setWins(parseInt(storedWins, 10));
    if (storedLosses) setLosses(parseInt(storedLosses, 10));
  }, []);

  const updateLocalStorage = (wins: number, losses: number) => {
    localStorage.setItem("wins", wins.toString());
    localStorage.setItem("losses", losses.toString());
  };

  const resetGame = () => {
    const newBoard = createBoard(rows, cols, minesPercentage);
    setBoard(newBoard);
    setLost(false);
    setRemainingCells(rows * cols - Math.floor(rows * cols * minesPercentage));
  };

  const resetGame2 = (rows: number, cols: number, minesPercentage: number) => {
    const newBoard = createBoard(rows, cols, minesPercentage);
    setBoard(newBoard);
    setLost(false);
    setRemainingCells(rows * cols - Math.floor(rows * cols * minesPercentage));
  };

  const handleWin = () => {
    const winSound = new Audio("/win.mp3");
    winSound.play();
    const oldWins = wins;
    setWins(oldWins + 1);
    console.log(oldWins, oldWins + 1);
    updateLocalStorage(oldWins + 1, losses);
    setLost(true);
  };

  const handleLoss = () => {
    const explosionSound = new Audio("/explosion.mp3");
    explosionSound.play();
    setLost(true);
    setLosses((prevLosses) => {
      const newLosses = prevLosses + 1;
      updateLocalStorage(wins, newLosses);
      return newLosses;
    });
  };

  const handleCellClick = (row: number, col: number) => {
    if (lost || board[row][col].isRevealed) return;

    const newBoard = [...board];

    if (newBoard[row][col].isMine) {
      handleLoss();
    } else {
      const clickSound = new Audio("/click.wav");
      clickSound.play();
    }

    newBoard[row][col].isRevealed = true;
    setBoard(newBoard);
    setRemainingCells((prev) => {
      const newRemaining = prev - 1;
      if (newRemaining === 0) {
        handleWin();
      }
      return newRemaining;
    });
  };

  const handleDifficultyChange = (difficulty: "easy" | "medium" | "hard") => {
    let percentage = 0.2;
    switch (difficulty) {
      case "easy":
        percentage = 0.1;
        break;
      case "medium":
        percentage = 0.2;
        break;
      case "hard":
        percentage = 0.4;
        break;
    }
    const settingsSound = new Audio("/settings.wav");
    settingsSound.play();
    setMinesPercentage(0.2);
    setDifficulty(difficulty);
    resetGame2(rows, cols, percentage);
  };

  const handleSizeChange = (size: "small" | "medium" | "big") => {
    let length = 10;
    switch (size) {
      case "small":
        length = 6;
        break;
      case "medium":
        length = 10;
        break;
      case "big":
        length = 20;
        break;
    }
    const settingsSound = new Audio("/settings.wav");
    settingsSound.play();
    setRows(length);
    setCols(length);
    setSize(size);
    resetGame2(length, length, minesPercentage);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-6 flex space-x-4">
        <div className="px-4 py-2 bg-green-500 border border-green-400 text-green-800 rounded-lg shadow-md">
          <span className="font-semibold">Wins :</span>
          <div className="flex justify-center">{wins}</div>
        </div>
        <div className="px-4 py-2 bg-red-400 border border-red-400 text-red-800 rounded-lg shadow-md">
          <span className="font-semibold">Losses :</span>
          <div className="flex justify-center">{losses}</div>
        </div>
      </div>

      <div className="mb-4 flex space-x-4 items-center justify-center">
        <div>
          <h3 className="text-lg mb-2">
            Difficulty: <span className="text-sm">({difficulty})</span>
          </h3>
          <button
            onClick={() => handleDifficultyChange("easy")}
            className="mr-2 px-4 py-2 bg-blue-200 rounded"
          >
            Easy
          </button>
          <button
            onClick={() => handleDifficultyChange("medium")}
            className="mr-2 px-4 py-2 bg-blue-300 rounded"
          >
            Medium
          </button>
          <button
            onClick={() => handleDifficultyChange("hard")}
            className="px-4 py-2 bg-blue-400 rounded"
          >
            Hard
          </button>
        </div>
        <div>
          <h3 className="text-lg mb-2">
            Size:<span className="text-sm">({size})</span>
          </h3>
          <button
            onClick={() => handleSizeChange("small")}
            className="mr-2 px-4 py-2 bg-green-200 rounded"
          >
            Small
          </button>
          <button
            onClick={() => handleSizeChange("medium")}
            className="mr-2 px-4 py-2 bg-green-300 rounded"
          >
            Medium
          </button>
          <button
            onClick={() => handleSizeChange("big")}
            className="px-4 py-2 bg-green-400 rounded"
          >
            Big
          </button>
        </div>
      </div>
      <div className="mb-4 h-12 flex items-center justify-center">
        {lost && (
          <button
            onClick={resetGame}
            className="mb-4 px-4 py-2 bg-gold text-white rounded hover:bg-yellow-600"
          >
            Play Again
          </button>
        )}
      </div>

      <div>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((cell, colIndex) => (
              <Cell
                key={colIndex}
                cell={cell}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
