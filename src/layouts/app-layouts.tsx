import { Outlet } from "react-router-dom";
import { AppBg } from "@/assets";

const AppLayouts = () => {
  return (
    <div className="relative min-h-screen w-full">
      <AppBg
        className="absolute inset-0 -z-10 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      />
      <Outlet />
    </div>
  );
};

export default AppLayouts;
