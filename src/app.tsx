import { Route, Routes } from "react-router-dom";
import GamePlays from "./features/game-plays";
import GameConfigs from "./features/game-configs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<GamePlays />} />
      <Route path="/configs" element={<GameConfigs />} />
    </Routes>
  );
}

export default App;
