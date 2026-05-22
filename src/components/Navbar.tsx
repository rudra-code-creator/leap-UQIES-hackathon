import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Jumpy } from "@/components/Jumpy";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useProgression } from "@/lib/progression-store";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/discover", label: "Discover" },
  { to: "/plans", label: "Plans" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/journey", label: "Journey Log" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { level } = useProgression();

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative px-1 py-2 text-sm font-bold transition-colors",
      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
    );

  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Jumpy size="xs" animate="none" />
          <span className="font-display text-2xl font-extrabold text-foreground">Leap</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls}>
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-secondary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <div className="hidden items-center gap-2 rounded-full border-2 border-border bg-surface px-3 py-1.5 lg:flex">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lvl</span>
            <span className="font-display text-sm font-black">{level}</span>
          </div>
          <Link to="/about-me">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-display text-sm font-black text-foreground">
              A
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="mt-8 flex flex-col gap-1">
              <div className="mb-4 flex items-center justify-between px-4">
                <span className="text-sm font-bold text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-4 py-3 font-display text-base font-bold",
                      isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted",
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
};
