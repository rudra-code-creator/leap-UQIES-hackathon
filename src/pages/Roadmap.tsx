import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Brain, Clock, ShieldCheck, RefreshCw, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useExperiences } from "@/lib/experiences-store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useMilestones, usePlannerTasks, roadmapStore } from "@/lib/roadmap-store";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
    },
  },
};

const Roadmap = () => {
  const experiences = useExperiences();
  const { toast } = useToast();
  const [activePlannerTab, setActivePlannerTab] = useState<"week" | "month" | "year">("week");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const milestones = useMilestones();
  const plannerTasks = usePlannerTasks();

  const toggleMilestone = (id: string) => {
    roadmapStore.toggleMilestone(id);
  };

  const togglePlannerTask = (id: string) => {
    roadmapStore.togglePlannerTask(id);
  };

  const regenerateAIPlan = async () => {
    setIsRegenerating(true);
    
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const suggestedMilestones = [
      {
        id: `m-ai-${Date.now()}`,
        title: "Deploy application using Docker & Cloud",
        desc: "Learn containers for modern deployment.",
        done: false,
        phase: "Phase 2: Building",
        aiSuggested: true,
      },
      {
        id: `m-ai-${Date.now() + 1}`,
        title: "Write an engineering blog post about Rolldown bundling",
        desc: "Establish public tech leadership.",
        done: false,
        phase: "Phase 3: Launching",
        aiSuggested: true,
      },
    ];

    await roadmapStore.addMilestones(suggestedMilestones);
    setIsRegenerating(false);
    toast({
      title: "Roadmap updated with AI!",
      description: "Mistral AI analysed your logged skills and added cloud deployment milestones.",
    });
  };

  // Job Match Predictor calculation based on experiences
  const predictedJobs = useMemo(() => {
    const hasTypeScript = experiences.some(e => e.skills.some(s => s.toLowerCase().includes("typescript") || s.toLowerCase().includes("react")));
    const hasAI = experiences.some(e => e.skills.some(s => s.toLowerCase().includes("ai") || s.toLowerCase().includes("arduino")));
    const hasNetworking = experiences.some(e => e.skills.some(s => s.toLowerCase().includes("networking") || s.toLowerCase().includes("communication")));

    const baseJobs = [
      {
        name: "Full-Stack Developer",
        baseScore: 55,
        boost: hasTypeScript ? 30 : 0,
        factor: "TypeScript / React experience logged",
        description: "Building responsive web pages and structured server APIs.",
      },
      {
        name: "AI Solutions Engineer",
        baseScore: 40,
        boost: hasAI ? 45 : 0,
        factor: "AI Workshop or prototyping logged",
        description: "Integrating LLMs, prompt pipelines, and autonomous agent loops.",
      },
      {
        name: "Cloud Architect",
        baseScore: 35,
        boost: experiences.some(e => e.title.includes("Cloud") || e.title.includes("AWS")) ? 50 : 15,
        factor: "Cloud platform exposure logged",
        description: "Designing scalable, containerized microservice architectures.",
      },
      {
        name: "Product & UX Manager",
        baseScore: 45,
        boost: hasNetworking ? 25 : 0,
        factor: "Networking and presentation events attended",
        description: "Synthesizing market needs and designing intuitive user flows.",
      },
    ];

    return baseJobs
      .map(j => ({
        ...j,
        totalScore: Math.min(98, j.baseScore + j.boost),
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [experiences]);

  const activePlannerTasks = useMemo(() => {
    return plannerTasks.filter(pt => pt.timeframe === activePlannerTab);
  }, [plannerTasks, activePlannerTab]);

  return (
    <AnimatedPage className="container py-8 md:py-10 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Roadmap Planner</div>
          <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">Guide Your Career Goals</h1>
          <p className="text-sm text-muted-foreground">
            A personalized roadmap built to scale with your activities. See how every action impacts job matches.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={regenerateAIPlan}
            disabled={isRegenerating}
            variant="hero"
            className="self-start gap-2 font-bold py-5 px-5"
          >
            <RefreshCw className={cn("h-4 w-4", isRegenerating && "animate-spin")} />
            {isRegenerating ? "Regenerating..." : "Regenerate AI Plan"}
          </Button>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main Column */}
        <div className="space-y-6">
          <Tabs defaultValue="milestones" className="w-full">
            <TabsList className="flex w-full sm:w-fit justify-start gap-1 rounded-2xl border-2 border-border bg-surface p-1">
              <TabsTrigger value="milestones" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
                Personalized Milestones
              </TabsTrigger>
              <TabsTrigger value="planner" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
                Time Planner
              </TabsTrigger>
            </TabsList>

            {/* Milestones Content */}
            <TabsContent value="milestones" className="mt-6 space-y-4 focus-visible:outline-none">
              {/* Phases */}
              {Array.from(new Set(milestones.map(m => m.phase))).map((phase) => (
                <motion.div 
                  key={phase} 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="rounded-3xl border-2 border-border bg-surface p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow duration-250"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h3 className="font-display text-lg font-black text-foreground">{phase}</h3>
                    <span className="text-xs font-bold text-muted-foreground">
                      {milestones.filter(m => m.phase === phase && m.done).length} / {milestones.filter(m => m.phase === phase).length} Done
                    </span>
                  </div>

                  <motion.ul layout className="space-y-2">
                    {milestones
                      .filter(m => m.phase === phase)
                      .map((m) => (
                        <motion.li
                          layout
                          key={m.id}
                          onClick={() => toggleMilestone(m.id)}
                          whileHover={{ scale: 1.01, x: 2 }}
                          whileTap={{ scale: 0.99 }}
                          className={cn(
                            "flex items-start justify-between rounded-xl border-2 p-3.5 bg-background cursor-pointer hover:border-foreground/20 transition-all",
                            m.done ? "border-border/40 opacity-70" : "border-border shadow-sm",
                          )}
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                              <Checkbox checked={m.done} onCheckedChange={() => toggleMilestone(m.id)} />
                            </div>
                            <div className="min-w-0">
                              <span className={cn("text-sm font-bold leading-snug block text-foreground", m.done && "text-muted-foreground line-through")}>
                                {m.title}
                              </span>
                              <span className="text-xs text-muted-foreground block mt-0.5">{m.desc}</span>
                            </div>
                          </div>
                          {m.aiSuggested && (
                            <span className="shrink-0 ml-3 inline-flex items-center gap-1 rounded-full bg-coral/10 border border-coral/20 px-2 py-0.5 text-[9px] font-black text-coral uppercase">
                              <Sparkles className="h-2.5 w-2.5" /> AI Custom
                            </span>
                          )}
                        </motion.li>
                      ))}
                  </motion.ul>
                </motion.div>
              ))}
            </TabsContent>

            {/* Time Planner Content */}
            <TabsContent value="planner" className="mt-6 space-y-6 focus-visible:outline-none">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="rounded-3xl border-2 border-border bg-surface p-5 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-black text-foreground">Schedule Planner</h3>
                    <p className="text-xs text-muted-foreground">Break goals down into week, month, and year checklists.</p>
                  </div>

                  {/* Sub tabs for planner */}
                  <div className="flex bg-background rounded-xl p-1 border border-border h-10 w-fit items-center">
                    {(["week", "month", "year"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setActivePlannerTab(t)}
                        className="relative rounded-lg px-4 text-xs font-bold capitalize h-8 transition-colors z-10 flex items-center justify-center"
                        style={{ color: activePlannerTab === t ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
                      >
                        {activePlannerTab === t && (
                          <motion.div
                            layoutId="activePlannerTabBg"
                            className="absolute inset-0 rounded-lg bg-secondary z-0"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className={cn("relative z-10", activePlannerTab === t ? "font-black" : "hover:text-foreground")}>
                          {t}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Planner tasks checklist */}
                <motion.ul layout className="space-y-2 pt-2">
                  <AnimatePresence mode="popLayout">
                    {activePlannerTasks.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key="empty"
                        className="text-center py-6 text-sm text-muted-foreground"
                      >
                        No tasks scheduled for this timeframe.
                      </motion.div>
                    ) : (
                      activePlannerTasks.map((pt) => (
                        <motion.li
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={pt.id}
                          onClick={() => togglePlannerTask(pt.id)}
                          whileHover={{ scale: 1.01, x: 2 }}
                          whileTap={{ scale: 0.99 }}
                          className={cn(
                            "flex items-center justify-between rounded-xl border-2 p-3.5 bg-background cursor-pointer hover:border-foreground/20 transition-all",
                            pt.done ? "border-border/40 opacity-70" : "border-border shadow-sm",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div onClick={(e) => e.stopPropagation()}>
                              <Checkbox checked={pt.done} onCheckedChange={() => togglePlannerTask(pt.id)} />
                            </div>
                            <span className={cn("text-sm font-bold text-foreground", pt.done && "text-muted-foreground line-through")}>
                              {pt.task}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {pt.dueDate}
                          </span>
                        </motion.li>
                      ))
                    )}
                  </AnimatePresence>
                </motion.ul>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Side Rail: Job Match Predictor */}
        <aside className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="rounded-3xl border-2 border-border bg-surface p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Brain className="h-5 w-5 text-secondary" />
              <h3 className="font-display text-base font-extrabold text-foreground">Matched Job Predictions</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on your logged workshop skills, volunteering, projects, and fair attendance, our predictor calculates your career inclinations.
            </p>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {predictedJobs.map((job) => (
                <motion.div 
                  key={job.name}
                  variants={cardVariants}
                  whileHover={{ y: -2 }}
                  className="space-y-1.5 p-3 rounded-2xl bg-background border border-border"
                >
                  <div className="flex justify-between items-center text-xs font-extrabold">
                    <span className="text-foreground">{job.name}</span>
                    <span className="text-secondary">{job.totalScore}% match</span>
                  </div>
                  
                  {/* Animated Progress bar */}
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${job.totalScore}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  <p className="text-[10px] text-muted-foreground leading-tight">{job.description}</p>
                  
                  <div className="pt-1.5 flex items-center gap-1 text-[9px] font-black text-coral uppercase tracking-wider">
                    <ShieldCheck className="h-3 w-3" /> {job.factor}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="pt-2">
              <Link to="/career-vision">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button className="w-full text-xs font-black gap-1.5 py-4" variant="outline">
                    Launch Career Vision Simulator <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </aside>
      </div>
    </AnimatedPage>
  );
};

export default Roadmap;
