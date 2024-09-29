// src/components/Cell.tsx

import React from 'react';
import { Cell as CellType } from '../types';

interface CellProps {
  cell: CellType;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ cell, onClick }) => {
  const handleClick = () => {
    if (!cell.isRevealed) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: '30px',
        height: '30px',
        backgroundColor: cell.isRevealed ? 'lightgray' : 'lightblue',
        border: '1px solid black',
      }}
    >
      {!cell.isRevealed ? (cell.isMine ? '💣' : cell.neighboringMines) : ''}
    </button>
  );
};

export default Cell;
