import React, { useEffect, useState } from "react";
import { Board } from "../types";
import Cell from "./Cell";

const ROWS = 10;
const COLS = 10;
const MINES = 20;

const createBoard = (): Board => {
  const board: Board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      neighboringMines: 0,
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].isMine) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = r + i;
            const newCol = c + j;
            if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
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
  const [board, setBoard] = useState<Board>(createBoard());
  const [lost, setLost] = useState(false);
  const [, setRemainingCells] = useState(ROWS * COLS - MINES);
  const [wins, setWins] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);

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
    const newBoard = createBoard();
    setBoard(newBoard);
    setLost(false);
    setRemainingCells(ROWS * COLS - MINES);
  };

  const handleWin = () => {
    console.log("aa", wins);
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
