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
      isFlagged: false,
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
    "medium"
  );
  const [bombsDisplay, setBombsDisplay] = useState<string>("💣💣");
  const [size, setSize] = useState<"small" | "medium" | "big">("medium");

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
    const settingsSound = new Audio("/settings.wav");
    settingsSound.play();
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
    explosionSound.volume = 0.5;
    explosionSound.play();
    setLost(true);
    setLosses((prevLosses) => {
      const newLosses = prevLosses + 1;
      updateLocalStorage(wins, newLosses);
      return newLosses;
    });
  };

  const revealCell = (board: Board, row: number, col: number): Board => {
    if (
      row < 0 ||
      row >= board.length ||
      col < 0 ||
      col >= board[0].length ||
      board[row][col].isRevealed
    ) {
      return board;
    }

    const newBoard = [...board];
    newBoard[row][col].isRevealed = true;

    if (newBoard[row][col].neighboringMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i !== 0 || j !== 0) {
            revealCell(newBoard, row + i, col + j);
          }
        }
      }
    }

    return newBoard;
  };

  const handleCellRightClick = (row: number, col: number) => {
    if (lost || board[row][col].isRevealed) return;

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);

    const settingsSound = new Audio("/settings.wav");
    settingsSound.play();
  };

  const handleCellClick = (row: number, col: number) => {
    if (lost || board[row][col].isRevealed || board[row][col].isFlagged) return;

    let newBoard = [...board];

    if (newBoard[row][col].isMine) {
      handleLoss();
      newBoard[row][col].isRevealed = true;
    } else {
      const clickSound = new Audio("/click.wav");
      clickSound.play();
      newBoard = revealCell(newBoard, row, col);
    }

    setBoard(newBoard);
    const revealedCount = newBoard
      .flat()
      .filter((cell) => cell.isRevealed).length;
    const totalNonMineCells =
      rows * cols - Math.floor(rows * cols * minesPercentage);
    setRemainingCells(totalNonMineCells - revealedCount);

    if (revealedCount === totalNonMineCells) {
      handleWin();
    }
  };

  const handleDifficultyChange = (difficulty: "easy" | "medium" | "hard") => {
    let percentage = 0.2;
    switch (difficulty) {
      case "easy":
        percentage = 0.1;
        setBombsDisplay("💣");
        break;
      case "medium":
        percentage = 0.2;
        setBombsDisplay("💣💣");
        break;
      case "hard":
        percentage = 0.4;
        setBombsDisplay("💣💣💣");
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
        length = 14;
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
    <div className="flex flex-col-2 items-center justify-center h-screen gap-3">
      <div className="">
        <h1 className="text-4xl font-bold mb-4">Minesweeper</h1>
        <div className="mb-6 flex space-x-4 justify-center">
          <div className="px-4 py-2 bg-green-500 border border-green-400 text-green-800 rounded-lg shadow-md">
            <span className="font-semibold">Wins :</span>
            <div className="flex justify-center">{wins}</div>
          </div>
          <div className="px-4 py-2 bg-red-400 border border-red-400 text-red-800 rounded-lg shadow-md">
            <span className="font-semibold">Losses :</span>
            <div className="flex justify-center">{losses}</div>
          </div>
        </div>

        <div className="mb-4 items-center justify-center">
          <div>
            <h3 className="text-lg mb-2 flex justify-center items-center">
              Difficulty :&nbsp;
              <span className="text-sm">
                (
                {difficulty.charAt(0).toUpperCase() +
                  difficulty.slice(1) +
                  bombsDisplay}
                )
              </span>
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
          <div className="mt-4">
            <h3 className="text-lg mb-2 flex justify-center items-center">
              Size :&nbsp;
              <span className="text-sm">
                ({size.charAt(0).toUpperCase() + size.slice(1)})
              </span>
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
      </div>
      <div className="flex flex-col-2">
        <div>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: "flex" }}>
              {row.map((cell, colIndex) => (
                <Cell
                  key={colIndex}
                  cell={cell}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onRightClick={() => handleCellRightClick(rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
