import { ArrowRight, Sparkles, Target, Map, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Jumpy } from "@/components/Jumpy";
import { JumpyLauncher } from "@/components/JumpyLauncher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";

const features = [
  {
    icon: Sparkles,
    title: "Personalized in 5 minutes",
    body: "A friendly quiz figures out where you want to go and how to get there.",
  },
  {
    icon: Target,
    title: "Top 3 pathways",
    body: "Bootcamps, universities, TAFEs — ranked by what actually fits your life.",
  },
  {
    icon: Map,
    title: "Step-by-step roadmap",
    body: "Exams, documents, deadlines, packing lists. Nothing falls through the cracks.",
  },
  {
    icon: MessageCircle,
    title: "Talk to Jumpy",
    body: "An AI guide that drafts essays, compares unis, and answers anything.",
  },
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
  hidden: { opacity: 0, y: 25 },
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

const Home = () => {
  return (
    <AnimatedPage className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Jumpy size="xs" animate="none" />
          <span className="font-display text-2xl font-extrabold text-foreground">Leap</span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#about" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">About</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/quiz">
            <Button variant="outline" size="sm">Sign in</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-surface px-4 py-1.5"
          >
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Your AI guide to what's next
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="font-display text-5xl font-black leading-[1.05] text-foreground md:text-7xl"
          >
            Leap into your future with{" "}
            <span className="text-coral">confidence</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="max-w-lg text-lg text-muted-foreground"
          >
            Replace expensive education consultants with Jumpy — your friendly AI companion that
            finds the perfect course, university, or career path for who you actually are.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to="/quiz">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="hero" size="xl">
                  Get started
                  <ArrowRight />
                </Button>
              </motion.div>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-secondary" />
              Free • No account needed to start
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-6 pt-4"
          >
            <div>
              <div className="font-display text-2xl font-extrabold">12k+</div>
              <div className="text-xs text-muted-foreground">Students guided</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="font-display text-2xl font-extrabold">200+</div>
              <div className="text-xs text-muted-foreground">Institutions</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="font-display text-2xl font-extrabold">98%</div>
              <div className="text-xs text-muted-foreground">Match accuracy</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.3 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 -z-10 m-auto h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Jumpy size="xl" animate="hop" glow />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="bg-primary py-20 text-primary-foreground">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-4xl font-black md:text-5xl">
              Everything you need, in one pond
            </h2>
            <p className="mt-3 text-primary-foreground/70">
              From the very first "what do I do with my life?" to your acceptance letter.
            </p>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-surface p-6 text-foreground shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-display text-lg font-extrabold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-4xl font-black md:text-5xl">How Leap works</h2>
          <p className="mt-3 text-muted-foreground">Three hops and you're on your way.</p>
        </div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {[
            { step: "01", title: "Take the quiz", body: "Tell us about your goals, budget, and lifestyle. Takes about 5 minutes." },
            { step: "02", title: "Meet your matches", body: "See your top 3 personalized pathways with match scores and a future-proof rating." },
            { step: "03", title: "Follow your roadmap", body: "Step-by-step plan from exams to acceptance to packing your bags." },
          ].map((s) => (
            <motion.div 
              key={s.step} 
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="rounded-2xl border-2 border-border bg-surface p-6 shadow-sm"
            >
              <div className="font-display text-5xl font-black text-secondary">{s.step}</div>
              <h3 className="mt-4 font-display text-xl font-extrabold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section id="about" className="container pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="relative overflow-hidden rounded-3xl bg-secondary p-10 md:p-16 shadow-lg"
        >
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl font-black text-foreground md:text-5xl">
                Ready to make the leap?
              </h2>
              <p className="mt-3 max-w-xl text-foreground/80">
                Jumpy is waiting. Build your personalized plan in minutes, not months.
              </p>
              <Link to="/quiz" className="mt-6 inline-block">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="default" size="xl">
                    Start the quiz
                    <ArrowRight />
                  </Button>
                </motion.div>
              </Link>
            </div>
            <motion.div 
              whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <Jumpy size="lg" animate="hop" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <footer className="container border-t-2 border-border py-8 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Jumpy size="xs" animate="none" />
            <span className="font-display font-extrabold text-foreground">Leap</span>
          </div>
          <div>© {new Date().getFullYear()} Leap. Built with 🐸 by students for students.</div>
        </div>
      </footer>
      <JumpyLauncher />
    </AnimatedPage>
  );
};

export default Home;
