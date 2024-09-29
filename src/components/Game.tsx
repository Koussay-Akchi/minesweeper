import React, { useState } from "react";
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

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighboring mines
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

  const handleCellClick = (row: number, col: number) => {
    // Implement logic to reveal cell
    const newBoard = [...board];
    newBoard[row][col].isRevealed = true;
    setBoard(newBoard);
  };

  return (
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
  );
};

export default Game;
