import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronRight, Calendar, ListTodo, Bell, MapPin, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Jumpy } from "@/components/Jumpy";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { usePlannerTasks, roadmapStore } from "@/lib/roadmap-store";
import { useDiscoverStates, discoverStore } from "@/lib/discover-store";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  { label: "Explorer", desc: "Discovering interests & matching paths" },
  { label: "Skill Builder", desc: "Attending workshops & building projects" },
  { label: "Networker", desc: "Joining communities & attending events" },
  { label: "Ready to Leap", desc: "Personal brand ready for job applications" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState(2); // Start at Networker
  const [userName, setUserName] = useState("Explorer");

  const plannerTasks = usePlannerTasks();
  const discoverStates = useDiscoverStates();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", session.user.id)
          .single();
        if (!error && data?.name) {
          const firstName = data.name.split(" ")[0];
          setUserName(firstName);
        }
      } else {
        setUserName("Explorer");
      }
    };
    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchProfile();
      } else {
        setUserName("Explorer");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const weeklyTasks = useMemo(() => {
    return plannerTasks.filter((t) => t.timeframe === "week");
  }, [plannerTasks]);

  const todos = useMemo(() => {
    return weeklyTasks.map((t, idx) => ({
      id: t.id,
      task: t.task,
      priority: (idx === 0 ? "High" : idx === 1 ? "High" : "Medium") as "High" | "Medium" | "Low",
      due: t.dueDate || "This week",
      done: t.done,
      category: idx === 0 ? "Event" : idx === 1 ? "Personal Brand" : "Portfolio",
    }));
  }, [weeklyTasks]);

  const events = useMemo(() => {
    const defaultEvents = [
      {
        id: "ev-1",
        title: "Google Cloud Tech Hackathon",
        date: "May 25, 2026 • 10:00 AM",
        location: "Brisbane HQ & Online",
        attendees: 142,
        interest: "AI & Cloud Engineering",
      },
      {
        id: "ev-2",
        title: "Mistral AI Developer Workshop",
        date: "May 29, 2026 • 2:00 PM",
        location: "UQ Innovate Hall",
        attendees: 89,
        interest: "Large Language Models",
      },
      {
        id: "ev-3",
        title: "Women in Tech Networking Mixer",
        date: "June 2, 2026 • 6:30 PM",
        location: "Riverfront Lounge",
        attendees: 210,
        interest: "Career Growth",
      },
    ];

    return defaultEvents.map((e) => {
      const isJoined = discoverStore.isJoined("event", e.id);
      return {
        ...e,
        joined: isJoined,
        attendees: isJoined ? e.attendees + 1 : e.attendees,
      };
    });
  }, [discoverStates]);

  const toggleTodo = (id: string) => {
    roadmapStore.togglePlannerTask(id);
  };

  const toggleRSVP = (id: string) => {
    discoverStore.toggleJoined("event", id);
  };

  const completedCount = todos.filter((t) => t.done).length;

  return (
    <AnimatedPage className="container py-8 md:py-10 space-y-8 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Student Hub</div>
          <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">
            Welcome back, {userName} 🐸
          </h1>
          <p className="text-sm text-muted-foreground">
            You're currently in the <span className="font-bold text-foreground">{steps[currentStep].label}</span> phase. Let's make some moves!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-coral"></span>
            </span>
            <span className="ml-1">2 updates</span>
          </Button>
          <Link to="/roadmap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="hero" size="sm">
                Full roadmap <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Current Progress Section */}
      <section className="rounded-3xl border-2 border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary animate-pulse" />
            <h2 className="font-display text-xl font-extrabold text-foreground">Current Progress</h2>
          </div>
          <span className="text-xs font-bold text-muted-foreground uppercase bg-background px-3 py-1.5 rounded-full border border-border">
            Stage {currentStep + 1} of 4
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-4 relative">
          {/* Progress line connector */}
          <div className="absolute top-[18px] left-[12%] right-[12%] h-[2px] bg-border -z-10 hidden md:block" />
          <div
            className="absolute top-[18px] left-[12%] h-[2px] bg-secondary -z-10 transition-all duration-500 hidden md:block"
            style={{ width: `${(currentStep / (steps.length - 1)) * 76}%` }}
          />

          {steps.map((s, i) => (
            <motion.div
              key={s.label}
              onClick={() => setCurrentStep(i)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-3 cursor-pointer group"
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-black transition-all duration-300",
                  i < currentStep && "border-secondary bg-secondary text-foreground scale-105",
                  i === currentStep && "border-coral bg-coral text-coral-foreground ring-4 ring-coral/20 scale-110",
                  i > currentStep && "border-border bg-surface text-muted-foreground group-hover:border-foreground/30",
                )}
              >
                {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <div className="flex flex-col md:items-center">
                <div className={cn("text-sm font-extrabold transition-colors", i === currentStep ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                  {s.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 max-w-[200px] leading-tight">
                  {s.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Grid: Weekly Todo & Upcoming Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Todo List */}
        <section className="rounded-3xl border-2 border-border bg-surface p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-coral" />
                <h2 className="font-display text-xl font-extrabold text-foreground">Weekly To-Do List</h2>
              </div>
              <span className="text-xs font-bold text-muted-foreground">
                {completedCount}/{todos.length} done
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Completing weekly tasks unlocks personalized career achievements. Keep ticking!
            </p>

            {todos.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-border bg-background p-8 text-center text-muted-foreground text-sm">
                No weekly tasks left. Add some in your Roadmap!
              </div>
            ) : (
              <motion.ul layout className="space-y-3">
                {todos.map((todo) => (
                  <motion.li
                    layout
                    key={todo.id}
                    onClick={() => toggleTodo(todo.id)}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      "flex items-start justify-between rounded-2xl border-2 p-3.5 bg-background hover:border-foreground/20 cursor-pointer transition-all",
                      todo.done ? "border-border/40 opacity-70" : "border-border shadow-sm",
                    )}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={todo.done} onCheckedChange={() => toggleTodo(todo.id)} />
                      </div>
                      <div className="min-w-0">
                        <span className={cn("text-sm font-bold leading-tight block text-foreground", todo.done && "text-muted-foreground line-through")}>
                          {todo.task}
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-[9px] font-extrabold text-muted-foreground uppercase">
                            {todo.category}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase",
                              todo.priority === "High" && "bg-coral/10 text-coral",
                              todo.priority === "Medium" && "bg-secondary/20 text-foreground",
                              todo.priority === "Low" && "bg-muted text-muted-foreground",
                            )}
                          >
                            {todo.priority} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-3 font-semibold self-center">
                      {todo.due}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Updated just now</span>
            <Link to="/roadmap" className="text-sm font-extrabold text-primary hover:underline flex items-center gap-1">
              Go to Planner <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="rounded-3xl border-2 border-border bg-surface p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-secondary" />
                <h2 className="font-display text-xl font-extrabold text-foreground">Upcoming Events</h2>
              </div>
              <Link to="/discover" className="text-xs font-extrabold text-primary hover:underline">
                Find more opportunities
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Based on your interests. Attending events helps Jumpy build your Career Predictor.
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {events.map((e) => (
                <motion.div
                  key={e.id}
                  variants={itemVariants}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border-2 border-border bg-background p-4 shadow-sm"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-secondary/15 border border-secondary/20 px-2 py-0.5 text-[9px] font-extrabold text-foreground uppercase tracking-wide">
                        {e.interest}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-extrabold leading-snug text-foreground">
                      {e.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {e.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {e.location}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                      <Users className="h-4 w-4 text-muted-foreground" /> {e.attendees} going
                    </span>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => toggleRSVP(e.id)}
                        variant={e.joined ? "outline" : "hero"}
                        size="sm"
                        className="w-24 font-bold transition-all duration-200"
                      >
                        {e.joined ? "Going ✓" : "Join Event"}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Powered by your Jumpy Buddy recommendations</span>
          </div>
        </section>
      </div>

      {/* Jumpy Nudge / Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ y: -3 }}
        className="flex flex-col sm:flex-row items-center gap-4 rounded-3xl border-2 border-border bg-surface p-6 shadow-sm"
      >
        <div className="shrink-0 flex items-center justify-center p-3 rounded-full bg-secondary/10">
          <Jumpy size="sm" animate="float" />
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h3 className="font-display text-lg font-black text-foreground">
            Looking for tailored advice?
          </h3>
          <p className="text-sm text-muted-foreground">
            Chat with Jumpy to get instant advice on Passion Mapping, LinkedIn branding, or creating custom roadmap steps.
          </p>
        </div>
        <Link to="/career-vision" className="w-full sm:w-auto shrink-0">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="hero" className="w-full sm:w-auto font-black px-6 py-5">
              Talk to Jumpy Coach
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </AnimatedPage>
  );
};

export default Dashboard;
