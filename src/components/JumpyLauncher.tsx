import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jumpyImg from "@/assets/jumpy-default.png";
import { cn } from "@/lib/utils";

export const JumpyLauncher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hover, setHover] = useState(false);

  if (location.pathname === "/chat" || location.pathname === "/quiz") return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      <div
        className={cn(
          "relative rounded-2xl border-2 border-coral bg-surface px-3 py-2 text-xs font-bold text-foreground shadow-sm transition-all duration-200",
          hover ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-1",
        )}
      >
        Wanna chat? 💬
        <span
          className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-b-2 border-r-2 border-coral bg-surface"
          aria-hidden
        />
      </div>
      <button
        onClick={() => navigate("/chat")}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label="Chat with Jumpy"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-border bg-surface shadow-[0_4px_0_0_hsl(var(--primary))] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_0_0_hsl(var(--primary))]"
      >
        <img
          src={jumpyImg}
          alt=""
          draggable={false}
          className="h-10 w-10 select-none object-contain animate-float-slow"
        />
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-surface bg-coral" />
      </button>
    </div>
  );
};
