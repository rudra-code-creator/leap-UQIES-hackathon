import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";
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
  const { level, xp } = useProgression();

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
          <Link
            to="/about-me"
            className="flex items-center gap-2 rounded-full border-2 border-coral bg-coral px-3.5 py-1.5 shadow-[0_2px_0_0_hsl(var(--foreground)/0.12)] transition-transform hover:scale-[1.02]"
            aria-label={`${xp.toLocaleString()} experience points, level ${level}`}
          >
            <Sparkles className="h-4 w-4 shrink-0 text-coral-foreground" aria-hidden />
            <span className="font-display text-xl font-black tabular-nums leading-none text-coral-foreground">
              {xp.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-coral-foreground/90">XP</span>
          </Link>
          <div className="hidden items-center gap-2 rounded-full border-2 border-secondary bg-secondary/20 px-3 py-1.5 lg:flex">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lvl</span>
            <span className="font-display text-sm font-black text-foreground">{level}</span>
          </div>
          <Link to="/about-me">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-display text-sm font-black text-foreground">
              A
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/about-me"
            className="flex items-center gap-1.5 rounded-full border-2 border-coral bg-coral px-2.5 py-1 shadow-[0_2px_0_0_hsl(var(--foreground)/0.12)]"
            aria-label={`${xp.toLocaleString()} experience points`}
          >
            <span className="font-display text-base font-black tabular-nums leading-none text-coral-foreground">
              {xp.toLocaleString()}
            </span>
            <span className="text-[9px] font-bold uppercase text-coral-foreground/90">XP</span>
          </Link>
          <ThemeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="mt-8 flex flex-col gap-1">
              <Link
                to="/about-me"
                onClick={() => setOpen(false)}
                className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-coral bg-coral px-4 py-3"
              >
                <Sparkles className="h-5 w-5 text-coral-foreground" aria-hidden />
                <span className="font-display text-2xl font-black tabular-nums text-coral-foreground">
                  {xp.toLocaleString()}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-coral-foreground/90">XP</span>
                <span className="text-xs font-bold text-coral-foreground/80">· Lvl {level}</span>
              </Link>
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
