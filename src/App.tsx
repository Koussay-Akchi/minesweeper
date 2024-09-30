import React from "react";
import Game from "./components/Game";
import "./index.css"; // Import Tailwind CSS
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <div className="h-screen  w-screen overflow-x-hidden">
      <div className="flex flex-col justify-center items-center ">
        <Game />
      </div>
      <Footer />
    </div>
  );
};

export default App;
