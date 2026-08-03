import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AppLayouts from "@/layouts/app-layouts";
import GamePlays from "./features/game-plays";
import GameConfigs from "./features/game-configs";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayouts />}>
          <Route path="/" element={<GamePlays />} />
          <Route path="/configs/:store_id" element={<GameConfigs />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
