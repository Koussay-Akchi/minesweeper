import React from "react";
import { Cell as CellType } from "../types";

interface CellProps {
  cell: CellType;
  onClick: () => void;
}

const getCellStyle = (neighboringMines: number) => {
  let textColor = "";

  switch (neighboringMines) {
    case 0:
      textColor = "text-[#7F7F7F]";
      break;
    case 1:
      textColor = "text-[#0000FE]";
      break;
    case 2:
      textColor = "text-[#007D00]";
      break;
    default:
      textColor = "text-red-600";
      break;
  }

  return textColor;
};

const Cell: React.FC<CellProps> = ({ cell, onClick }) => {
  const handleClick = () => {
    if (!cell.isRevealed) {
      onClick();
    }
  };

  const style = getCellStyle(cell.neighboringMines);

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center w-10 h-10 border border-gray-400 transition-colors duration-150 bg-[#BFBFBF]
        ${
          !cell.isRevealed
            ? "shadow-[inset_-5px_-3px_3px_0px_rgba(255,255,255,0.8),inset_3px_3px_3px_0px_rgba(0,0,0,0.2)]"
            : "bg-gray-300 cursor-default"
        }`}
    >
      <span className={style} style={{ fontSize: "20px" }}>
        {cell.isRevealed ? (cell.isMine ? "💣" : cell.neighboringMines) : ""}
      </span>
    </button>
  );
};

export default Cell;
