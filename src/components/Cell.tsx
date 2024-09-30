import React from "react";
import { Cell as CellType } from "../types";

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
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

const Cell: React.FC<CellProps> = React.memo(
  ({ cell, onClick, onRightClick }) => {
    const handleClick = () => {
      if (!cell.isRevealed && !cell.isFlagged) {
        onClick();
      }
    };

    const handleRightClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!cell.isRevealed) {
        onRightClick(e);
      }
    };

    const style = getCellStyle(cell.neighboringMines);

    return (
      <button
        onClick={handleClick}
        onContextMenu={handleRightClick}
        className={`flex items-center justify-center w-10 h-10 border border-gray-400 transition-colors duration-150 bg-[#BFBFBF]
        ${
          !cell.isRevealed
            ? "shadow-[inset_-5px_-3px_3px_0px_rgba(255,255,255,0.8),inset_3px_3px_3px_0px_rgba(0,0,0,0.2)]"
            : "bg-gray-300 cursor-default"
        }`}
      >
        <span className={style} style={{ fontSize: "20px" }}>
          {cell.isRevealed
            ? cell.isMine
              ? "💣"
              : cell.neighboringMines
            : cell.isFlagged
            ? "🚩"
            : ""}
        </span>
      </button>
    );
  }
);

export default Cell;
