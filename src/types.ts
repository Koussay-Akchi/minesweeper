export type Cell = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighboringMines: number;
  };
  
  export type Board = Cell[][];
  