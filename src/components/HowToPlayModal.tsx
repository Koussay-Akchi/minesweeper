import React from "react";
import Cell from "./Cell";
interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const grid = [
  [
    { isMine: false, isRevealed: true, isFlagged: false, neighboringMines: 0 },
    { isMine: false, isRevealed: true, isFlagged: false, neighboringMines: 0 },
    { isMine: false, isRevealed: true, isFlagged: false, neighboringMines: 0 },
  ],
  [
    { isMine: false, isRevealed: true, isFlagged: false, neighboringMines: 2 },
    { isMine: false, isRevealed: true, isFlagged: false, neighboringMines: 2 },
    { isMine: false, isRevealed: true, isFlagged: false, neighboringMines: 1 },
  ],
  [
    { isMine: true, isRevealed: true, isFlagged: false, neighboringMines: 1 },
    { isMine: true, isRevealed: true, isFlagged: false, neighboringMines: 1 },
    { isMine: false, isRevealed: true, isFlagged: false, neighboringMines: 1 },
  ],
];
const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 "
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 relative">
        <div
          className="absolute top-2 right-2 text-gray-600 hover:bg-red-400 cursor-pointer px-2 pb-1 rounded-md font-medium text-xl"
          onClick={onClose}
        >
          x
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-gray-700">How to Play</h2>
        <p className="text-gray-700">
          Left-click on a cell to reveal it. The number on a cell indicates how
          many mines are next to it.
          </p>
          <div className="flex flex-col-3 -mb-3 justify-center mt-2">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex}>
              {row.map((cell, colIndex) => (
                <Cell
                  key={colIndex}
                  cell={cell}
                  onClick={() => {}}
                  onRightClick={() => {}}
                />
              ))}
            </div>
          ))}
        </div>
        <p className="text-gray-700">
          <br />
          Right-click on a cell to mark it as a mine. 🚩
          <br />
          The goal is to reveal all non-mine 💣 cells without clicking any mine.
          <br />
          Use logic to avoid the mines!
        </p>
        
      </div>
    </div>
  );
};

export default HowToPlayModal;
