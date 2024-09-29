export type Cell = {
    isMine: boolean;
    isRevealed: boolean;
    neighboringMines: number;
  };
  
  export type Board = Cell[][];
  