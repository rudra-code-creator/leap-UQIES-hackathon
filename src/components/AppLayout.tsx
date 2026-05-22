import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { JumpyLauncher } from "./JumpyLauncher";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <JumpyLauncher />
    </div>
  );
};
