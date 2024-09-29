import React from "react";
import { Cell as CellType } from "../types";

interface CellProps {
  cell: CellType;
  onClick: () => void;
}

const getCellContentAndStyle = (neighboringMines: number) => {
  if (neighboringMines === 0) {
    return { content: "", style: "text-transparent" };
  }
  const content = neighboringMines.toString();
  let textColor = "";

  switch (neighboringMines) {
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

  return { content, style: textColor };
};

const Cell: React.FC<CellProps> = ({ cell, onClick }) => {
  const handleClick = () => {
    if (!cell.isRevealed) {
      onClick();
    }
  };

  const { content, style } = getCellContentAndStyle(cell.neighboringMines);

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center w-10 h-10 border border-gray-400 transition-colors duration-150 bg-[#BFBFBF] rounded-none 
                  ${
                    cell.isRevealed
                      ? "bg-gray-300"
                      : "bg-[#BFBFBF] hover:bg-gray-400"
                  }`}
    >
      <span className={style} style={{ fontSize: "18px" }}>
        {cell.isRevealed ? (cell.isMine ? "💣" : content) : ""}
      </span>
    </button>
  );
};

export default Cell;
