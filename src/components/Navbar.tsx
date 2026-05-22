import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { Jumpy } from "@/components/Jumpy";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/discover", label: "Discover" },
  { to: "/journey", label: "Journey Log" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/career-vision", label: "Career Vision" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileName, setProfileName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfileName("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", userId)
      .single();
    if (!error && data) {
      setProfileName(data.name || "");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative px-1 py-2 text-sm font-bold transition-colors",
      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
    );

  const userInitial = profileName
    ? profileName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "A";

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
          {user ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border-2 border-border bg-surface px-3 py-1.5 lg:flex">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lvl</span>
                <span className="font-display text-sm font-black">4</span>
              </div>
              <Link to="/about-me" title="Profile Details">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-display text-sm font-black text-foreground hover:opacity-85 transition-opacity">
                  {userInitial}
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign Out"
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/quiz">
              <Button variant="hero" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 flex flex-col justify-between">
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

              <div className="pb-6 px-4">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-display text-base font-black text-foreground">
                        {userInitial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{profileName || "Explorer"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/quiz" onClick={() => setOpen(false)}>
                    <Button variant="hero" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
