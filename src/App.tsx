import React from "react";
import Game from "./components/Game";
import "./index.css"; // Import Tailwind CSS

const App: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen  w-screen overflow-x-hidden">
      <h1 className="text-4xl font-bold mb-4">Minesweeper</h1> 
      <Game />
    </div>
  );
};

export default App;
