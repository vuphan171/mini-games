import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AppLayouts from "@/layouts/app-layouts";
import GamePlays from "./features/game-plays";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayouts />}>
          <Route path="/" element={<GamePlays />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
