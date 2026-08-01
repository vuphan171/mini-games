import { Route, Routes } from "react-router-dom";
import CowSoccerGame from "./features/cow-soccer/cow-soccer-game.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CowSoccerGame />} />
    </Routes>
  );
}

export default App;
