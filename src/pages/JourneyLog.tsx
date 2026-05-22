import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Mic, Sparkles, Send, Copy, Laptop, Layout, FileText, Globe } from "lucide-react";
import { useExperiences, type Experience } from "@/lib/experiences-store";
import { ExperienceCard } from "@/components/ExperienceCard";
import { JumpyNudge } from "@/components/JumpyNudge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";

const FILTERS: Array<{ label: string; value: "All" | Experience["type"] }> = [
  { label: "All", value: "All" },
  { label: "Events", value: "Event" },
  { label: "Workshops", value: "Workshop" },
  { label: "Volunteering", value: "Volunteer" },
  { label: "Projects", value: "Project" },
  { label: "Internships", value: "Internship" },
  { label: "Competitions", value: "Competition" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

const JourneyLog = () => {
  const experiences = useExperiences();
  const { toast } = useToast();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("All");
  
  // Content Studio State
  const [studioExpId, setStudioExpId] = useState<string>(experiences[0]?.id || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [drafts, setDrafts] = useState<{ linkedin: string; twitter: string; blog: string } | null>(null);

  // Portfolio Builder State
  const [portfolioTheme, setPortfolioTheme] = useState<"neon" | "dark" | "emerald">("neon");
  const [portfolioBio, setPortfolioBio] = useState("Aspiring Software Engineer & AI Builder. Studying at UQ.");
  const [isPublished, setIsPublished] = useState(false);

  const filtered = useMemo(
    () => (filter === "All" ? experiences : experiences.filter((e) => e.type === filter)),
    [experiences, filter],
  );

  const unsharedCount = experiences.filter(
    (e) => !Object.values(e.posted).some(Boolean),
  ).length;
  const thisMonth = experiences.filter((e) => e.date.includes("2026")).length;
  const firstUnshared = experiences.find((e) => !Object.values(e.posted).some(Boolean));

  // Find the selected experience in Content Studio
  const selectedStudioExp = useMemo(() => {
    return experiences.find((e) => e.id === studioExpId) || experiences[0];
  }, [experiences, studioExpId]);

  const generateSocialPosts = () => {
    if (!selectedStudioExp) return;
    setIsGenerating(true);
    setTimeout(() => {
      const skillsStr = selectedStudioExp.skills.map((s) => `#${s.replace(/\s+/g, "")}`).join(" ");
      const takeawaysStr = selectedStudioExp.takeaways.map((t) => `• ${t}`).join("\n");
      
      setDrafts({
        linkedin: `🚀 Thrilled to share that I recently completed "${selectedStudioExp.title}"! \n\nHere are my key takeaways:\n${takeawaysStr}\n\nGratitude to everyone I met during this experience! ${skillsStr} #studentdevelopment #careerleap`,
        twitter: `Just logged "${selectedStudioExp.title}" on my journey roadmap! 🧵 👇\n\n1/ Key lesson: "${selectedStudioExp.takeaways[0] || "Rapid learning is key"}"\n2/ Met amazing builders & expanded my skills in: ${selectedStudioExp.skills.slice(0, 3).join(", ")}.\n\nKeep hopping! 🐸`,
        blog: `# Deep Dive: What I Learned at ${selectedStudioExp.title}\n\n### Introduction\nOn ${selectedStudioExp.date}, I participated in ${selectedStudioExp.title}. Here is a reflection of my experience.\n\n### Core Learnings\n${takeawaysStr}\n\n### Actionable Next Steps\n- Build a follow-up demo application incorporating these skills.\n- Stay in touch with contacts met at the event.`,
      });
      setIsGenerating(false);
      toast({
        title: "Drafts generated!",
        description: "Your social media posts have been crafted by Jumpy Coach.",
      });
    }, 1200);
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${platform} draft copied to clipboard.`,
    });
  };

  const publishPortfolio = () => {
    setIsPublished(true);
    toast({
      title: "Portfolio Published!",
      description: "Your personal portfolio is now live at leap.me/explorer-dev",
    });
  };

  return (
    <AnimatedPage className="container py-8 md:py-10 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Journey Log</div>
          <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">Document Wins & Build Your Brand</h1>
          <p className="text-sm text-muted-foreground">
            Track your milestones, build a clean portfolio website, and draft social posts instantly.
          </p>
        </div>
        <Link to="/journey/new" className="self-start">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="hero" className="rounded-full px-5 py-6 font-display text-sm font-extrabold gap-2">
              <Plus className="h-4 w-4" /> Log experience
            </Button>
          </motion.div>
        </Link>
      </div>

      <Tabs defaultValue="wins" className="w-full">
        <TabsList className="flex w-full sm:w-fit justify-start gap-1 rounded-2xl border-2 border-border bg-surface p-1">
          <TabsTrigger value="wins" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
            My Wins
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
            <Laptop className="h-4 w-4 mr-2 inline" /> Portfolio Builder
          </TabsTrigger>
          <TabsTrigger value="studio" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
            <FileText className="h-4 w-4 mr-2 inline" /> Content Studio
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Wins Grid */}
        <TabsContent value="wins" className="mt-6 focus-visible:outline-none">
          {firstUnshared && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <JumpyNudge
                message={`You logged "${firstUnshared.title}" but haven't shared it yet. Want me to draft a post?`}
                ctaLabel="Draft it"
                to={`/journey/${firstUnshared.id}`}
              />
            </motion.div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* Main column */}
            <div>
              {/* Filter chips */}
              <div className="mb-5 flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <motion.button
                    key={f.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFilter(f.value)}
                    className={cn(
                      "rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-all",
                      filter === f.value
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-surface text-muted-foreground hover:border-foreground/40",
                    )}
                  >
                    {f.label}
                  </motion.button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border-2 border-dashed border-border bg-surface p-12 text-center"
                >
                  <div className="text-4xl">📝</div>
                  <p className="mt-3 font-display text-lg font-bold">Nothing logged here yet</p>
                  <p className="text-sm text-muted-foreground">Try a different filter or add your first experience.</p>
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {filtered.map((exp) => (
                    <motion.div key={exp.id} variants={itemVariants}>
                      <ExperienceCard experience={exp} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Right rail */}
            <aside className="hidden space-y-4 lg:block">
              <motion.button 
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex w-full items-center gap-3 rounded-3xl border-2 border-border bg-surface p-4 text-left transition-all hover:border-coral"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral text-coral-foreground">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-sm font-extrabold">Quick voice log</div>
                  <div className="text-xs text-muted-foreground">Tap to record (coming soon)</div>
                </div>
              </motion.button>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border-2 border-border bg-surface p-4"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand streak</div>
                <div className="mt-2 font-display text-3xl font-black">{thisMonth}</div>
                <div className="text-xs text-muted-foreground">experiences logged in 2026</div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, thisMonth * 12)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                {unsharedCount > 0 && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    <span className="font-bold text-coral">{unsharedCount} unshared</span> · turn them into content
                  </p>
                )}
              </motion.div>
            </aside>
          </div>
        </TabsContent>

        {/* Tab 2: Personal Portfolio Builder */}
        <TabsContent value="portfolio" className="mt-6 focus-visible:outline-none">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/* Customizer Sidebar */}
            <aside className="space-y-6 rounded-3xl border-2 border-border bg-surface p-5 h-fit">
              <div className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-secondary" />
                <h3 className="font-display text-lg font-extrabold">Portfolio Settings</h3>
              </div>

              {/* Theme selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Theme Palette</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["neon", "dark", "emerald"] as const).map((theme) => (
                    <motion.button
                      key={theme}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPortfolioTheme(theme)}
                      className={cn(
                        "rounded-xl p-2 text-xs font-bold border-2 transition-all capitalize",
                        theme === "neon" && (portfolioTheme === "neon" ? "border-secondary bg-secondary/15" : "border-border bg-background"),
                        theme === "dark" && (portfolioTheme === "dark" ? "border-foreground bg-muted" : "border-border bg-background"),
                        theme === "emerald" && (portfolioTheme === "emerald" ? "border-coral bg-coral/15" : "border-border bg-background"),
                      )}
                    >
                      {theme}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Bio description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Profile Headline / Bio</label>
                <Textarea
                  value={portfolioBio}
                  onChange={(e) => setPortfolioBio(e.target.value)}
                  placeholder="Tell your story..."
                  className="rounded-xl border-2 min-h-[100px] text-xs focus-visible:ring-secondary"
                />
              </div>

              {/* Publish CTA */}
              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button onClick={publishPortfolio} className="w-full font-bold py-5" variant="hero">
                    <Globe className="h-4 w-4 mr-2" /> Publish Live Website
                  </Button>
                </motion.div>
                <AnimatePresence>
                  {isPublished && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl bg-background border border-border p-3 text-center space-y-1.5 overflow-hidden"
                    >
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Your site is live</p>
                      <a
                        href="https://leap.me/explorer-dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-extrabold text-primary hover:underline block truncate"
                      >
                        leap.me/explorer-dev
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </aside>

            {/* Live Portfolio Preview */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Preview
                </span>
              </div>

              {/* Preview Window */}
              <motion.div
                layout
                className={cn(
                  "rounded-3xl border-4 border-black/40 overflow-hidden shadow-2xl transition-all duration-300 min-h-[480px] p-6 sm:p-8 bg-background relative",
                  portfolioTheme === "neon" && "bg-slate-950 text-white border-slate-800 shadow-secondary/15",
                  portfolioTheme === "dark" && "bg-neutral-900 text-white border-neutral-800",
                  portfolioTheme === "emerald" && "bg-emerald-950 text-emerald-50 border-emerald-900",
                )}
              >
                {/* Simulated browser bar */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-black/20 flex items-center px-4 gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] opacity-50 ml-4 font-mono">https://leap.me/explorer-dev</span>
                </div>

                {/* Simulated Content */}
                <div className="pt-8 space-y-8">
                  {/* Hero */}
                  <div className="space-y-3 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/25 border border-primary/40 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
                      🎓 Student Portfolio
                    </div>
                    <h2 className="font-display text-3xl font-black tracking-tight leading-none mt-2">
                      Explorer Dev
                    </h2>
                    <p className="text-sm opacity-80 max-w-xl leading-relaxed">
                      {portfolioBio}
                    </p>
                  </div>

                  {/* Logged wins */}
                  <div className="space-y-4">
                    <h3 className="font-display text-lg font-extrabold border-b border-white/10 pb-2">
                      Project Garden & Event Journal
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {experiences.slice(0, 4).map((exp) => (
                        <motion.div
                          layout
                          key={exp.id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-black uppercase tracking-wider opacity-60">
                              {exp.type}
                            </span>
                            <span className="text-[9px] font-medium opacity-65">{exp.date}</span>
                          </div>
                          <h4 className="font-display font-extrabold text-sm leading-tight">{exp.title}</h4>
                          <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                            {exp.reflection}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {exp.skills.slice(0, 2).map((skill) => (
                              <span
                                key={skill}
                                className="rounded px-1.5 py-0.5 text-[8px] font-bold bg-white/10 text-white"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          </div>
        </TabsContent>

        {/* Tab 3: Content Studio */}
        <TabsContent value="studio" className="mt-6 focus-visible:outline-none">
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/* Control rail */}
            <div className="space-y-4 rounded-3xl border-2 border-border bg-surface p-5 h-fit">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-coral animate-pulse" />
                <h3 className="font-display text-base font-extrabold">Generate Posts</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Select one of your logged experiences to draft targeted, professional social media posts.
              </p>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Select Win</label>
                <select
                  value={studioExpId}
                  onChange={(e) => {
                    setStudioExpId(e.target.value);
                    setDrafts(null);
                  }}
                  className="w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 text-xs font-bold focus-visible:outline-none focus-visible:border-secondary"
                >
                  {experiences.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.title} ({exp.type})
                    </option>
                  ))}
                </select>
              </div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={generateSocialPosts}
                  disabled={isGenerating || !studioExpId}
                  variant="hero"
                  className="w-full font-black py-5"
                >
                  {isGenerating ? "Writing Drafts..." : "Generate AI Drafts"}
                </Button>
              </motion.div>
            </div>

            {/* Generated output */}
            <div className="space-y-5">
              <AnimatePresence mode="wait">
                {drafts === null ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key="empty"
                    className="rounded-3xl border-2 border-dashed border-border bg-surface p-16 text-center space-y-4"
                  >
                    <div className="text-5xl">✍️</div>
                    <h3 className="font-display text-xl font-extrabold">Ready to share your achievements?</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Select a logged win on the left and click "Generate AI Drafts". Jumpy will write platform-optimized copy based on your reflection and takeaways.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="drafts"
                    className="grid gap-6"
                  >
                    {/* LinkedIn */}
                    <div className="rounded-3xl border-2 border-border bg-surface p-5 space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <span className="text-xs font-extrabold text-muted-foreground uppercase flex items-center gap-1">
                          <Send className="h-4 w-4" /> LinkedIn Post
                        </span>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            onClick={() => copyToClipboard(drafts.linkedin, "LinkedIn")}
                            variant="outline"
                            size="xs"
                            className="font-bold gap-1 text-[11px]"
                          >
                            <Copy className="h-3.5 w-3.5" /> Copy Draft
                          </Button>
                        </motion.div>
                      </div>
                      <Textarea
                        readOnly
                        value={drafts.linkedin}
                        className="min-h-[140px] text-sm bg-background border-none resize-none focus-visible:ring-0 leading-relaxed font-sans"
                      />
                    </div>

                    {/* Twitter / X */}
                    <div className="rounded-3xl border-2 border-border bg-surface p-5 space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <span className="text-xs font-extrabold text-muted-foreground uppercase flex items-center gap-1">
                          <Send className="h-4 w-4" /> Twitter/X Tweet
                        </span>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            onClick={() => copyToClipboard(drafts.twitter, "Twitter")}
                            variant="outline"
                            size="xs"
                            className="font-bold gap-1 text-[11px]"
                          >
                            <Copy className="h-3.5 w-3.5" /> Copy Draft
                          </Button>
                        </motion.div>
                      </div>
                      <Textarea
                        readOnly
                        value={drafts.twitter}
                        className="min-h-[100px] text-sm bg-background border-none resize-none focus-visible:ring-0 leading-relaxed font-sans"
                      />
                    </div>

                    {/* Blog outline */}
                    <div className="rounded-3xl border-2 border-border bg-surface p-5 space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <span className="text-xs font-extrabold text-muted-foreground uppercase flex items-center gap-1">
                          <FileText className="h-4 w-4" /> Blog/Medium Outline
                        </span>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            onClick={() => copyToClipboard(drafts.blog, "Medium Blog")}
                            variant="outline"
                            size="xs"
                            className="font-bold gap-1 text-[11px]"
                          >
                            <Copy className="h-3.5 w-3.5" /> Copy Outline
                          </Button>
                        </motion.div>
                      </div>
                      <Textarea
                        readOnly
                        value={drafts.blog}
                        className="min-h-[160px] text-sm bg-background border-none resize-none focus-visible:ring-0 leading-relaxed font-mono"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AnimatedPage>
  );
};

export default JourneyLog;
