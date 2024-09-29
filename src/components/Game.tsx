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

  useEffect(() => {
    const initialBoard = createBoard();
    setBoard(initialBoard);
  }, []);

  const resetGame = () => {
    const newBoard = createBoard();
    setBoard(newBoard);
    setLost(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (lost || board[row][col].isRevealed) return;

    const newBoard = [...board];

    if (newBoard[row][col].isMine) {
      const explosionSound = new Audio("/explosion.mp3");
      explosionSound.play();
      setLost(true);
    }

    const clickSound = new Audio("/click.wav");
    clickSound.play();

    newBoard[row][col].isRevealed = true;
    setBoard(newBoard);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {lost && (
        <button
          onClick={resetGame}
          className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      )}

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
