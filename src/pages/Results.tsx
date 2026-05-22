import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Jumpy } from "@/components/Jumpy";
import { JumpyLauncher } from "@/components/JumpyLauncher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { defaultQuiz, type QuizState } from "@/lib/quiz-types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";

const Results = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<QuizState>(defaultQuiz);
  const [transformed, setTransformed] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("leap-quiz");
    if (raw) try { setData({ ...defaultQuiz, ...JSON.parse(raw) }); } catch { }
    const t = setTimeout(() => setTransformed(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const firstName = useMemo(() => (data.name?.split(" ")[0] || "friend"), [data.name]);

  return (
    <AnimatedPage className="min-h-screen bg-background pb-32 overflow-x-hidden">
      {/* Top */}
      <header className="container flex items-center justify-between py-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <Jumpy size="xs" animate="none" />
          <span className="font-display text-xl font-extrabold">Leap</span>
        </button>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={() => navigate("/quiz")}>Retake quiz</Button>
        </div>
      </header>

      {/* Hero / transformation */}
      <section className="container">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="inline-flex items-center gap-2 rounded-full bg-coral/15 px-4 py-1.5"
          >
            <Sparkles className="h-4 w-4 text-coral" />
            <span className="text-xs font-bold uppercase tracking-wider text-coral">Your matches are ready</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-4 font-display text-4xl font-black md:text-6xl"
          >
            Here's where you want to be,{" "}
            <span className="text-primary">{firstName}</span>…
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-3 text-muted-foreground md:text-lg"
          >
            …and here's where you are now. Let's build the path between them.
          </motion.p>
        </div>

        {/* Transformation cards */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          <TransformCard
            label="Dream Career Jumpy"
            title={data.desiredField || "Engineer Wizard"}
            subtitle="Future you"
            tone="dream"
            visible
            delay={0.3}
          />
          <AnimatePresence>
            {transformed && (
              <TransformCard
                label="Current You Jumpy"
                title={data.currentEducation ? `Current ${data.currentEducation}` : "Curious explorer"}
                subtitle="Where you are now"
                tone="current"
                visible={transformed}
                delay={0}
              />
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Sticky CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 80, damping: 15 }}
        className="fixed bottom-0 left-0 right-0 border-t-2 border-border bg-surface/95 backdrop-blur z-20 shadow-lg"
      >
        <div className="container flex max-w-5xl items-center justify-between py-4">
          <div className="text-sm">
            <div className="font-display font-extrabold">Ready to commit?</div>
            <div className="text-xs text-muted-foreground">Start building your step-by-step roadmap now.</div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")}>
              Go to dashboard
              <ArrowRight />
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <JumpyLauncher />
    </AnimatedPage>
  );
};

/* ---------- subcomponents ---------- */

const TransformCard = ({
  label,
  title,
  subtitle,
  tone,
  visible,
  delay = 0,
}: {
  label: string;
  title: string;
  subtitle: string;
  tone: "dream" | "current";
  visible: boolean;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 70, damping: 15, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className={cn(
      "relative overflow-hidden rounded-3xl border-2 p-8 text-center transition-shadow duration-300 shadow-sm hover:shadow-md",
      tone === "dream" ? "border-secondary bg-secondary/15" : "border-border bg-surface",
    )}
  >
    {tone === "dream" && (
      <div className="absolute inset-0 -z-10 m-auto h-40 w-40 rounded-full bg-secondary/40 blur-3xl" />
    )}
    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="mt-4 flex justify-center">
      <Jumpy size="md" animate={tone === "dream" ? "hop" : "float"} glow={tone === "dream"} />
    </div>
    <div className="mt-4 font-display text-2xl font-black">{title}</div>
    <div className="text-sm text-muted-foreground">{subtitle}</div>
    {tone === "dream" && (
      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-coral/15 px-3 py-1 text-xs font-bold text-coral">
        ✨ Aspirational
      </div>
    )}
  </motion.div>
);

export default Results;
