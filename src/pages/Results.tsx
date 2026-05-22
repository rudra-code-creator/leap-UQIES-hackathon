import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Send, Sparkles, TrendingUp, MapPin, Clock, DollarSign, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Jumpy } from "@/components/Jumpy";
import { JumpyLauncher } from "@/components/JumpyLauncher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { defaultQuiz, type QuizState } from "@/lib/quiz-types";
import { cn } from "@/lib/utils";

interface Pathway {
  id: string;
  name: string;
  institution: string;
  type: string;
  duration: string;
  cost: string;
  location: string;
  match: { budget: number; career: number; location: number; lifestyle: number };
  futureProof: number;
  why: string;
  emoji: string;
}

const pathways: Pathway[] = [
  {
    id: "1",
    name: "BSc Computer Science",
    institution: "University of Melbourne",
    type: "University",
    duration: "3 years",
    cost: "$45,000/yr",
    location: "Melbourne, AU • On-campus",
    match: { budget: 78, career: 94, location: 88, lifestyle: 82 },
    futureProof: 91,
    why: "Top CS faculty, strong industry placement, and your high career-driven personality fits Melbourne's startup scene.",
    emoji: "🎓",
  },
  {
    id: "2",
    name: "Full-Stack Dev Bootcamp",
    institution: "Coder Academy",
    type: "Bootcamp",
    duration: "24 weeks",
    cost: "$18,500 total",
    location: "Sydney • Hybrid",
    match: { budget: 92, career: 86, location: 80, lifestyle: 88 },
    futureProof: 78,
    why: "Fast track into industry, low debt, perfect for your hands-on learning style and ASAP timeline.",
    emoji: "⚡",
  },
  {
    id: "3",
    name: "Diploma of IT (Networking)",
    institution: "TAFE NSW",
    type: "TAFE",
    duration: "2 years",
    cost: "$8,200 total",
    location: "Sydney • On-campus",
    match: { budget: 96, career: 72, location: 90, lifestyle: 84 },
    futureProof: 70,
    why: "Most affordable, government-subsidized, and a clear stepping stone if you want to upgrade later.",
    emoji: "🛠️",
  },
];

const Results = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<QuizState>(defaultQuiz);
  const [chat, setChat] = useState("");
  const [transformed, setTransformed] = useState(false);
  const [selected, setSelected] = useState(pathways[0].id);

  useEffect(() => {
    const raw = sessionStorage.getItem("leap-quiz");
    if (raw) try { setData({ ...defaultQuiz, ...JSON.parse(raw) }); } catch {}
    const t = setTimeout(() => setTransformed(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const firstName = useMemo(() => (data.name?.split(" ")[0] || "friend"), [data.name]);

  return (
    <div className="min-h-screen bg-background pb-32">
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
          <div className="inline-flex items-center gap-2 rounded-full bg-coral/15 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-coral" />
            <span className="text-xs font-bold uppercase tracking-wider text-coral">Your matches are ready</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-black md:text-6xl">
            Here's where you want to be,{" "}
            <span className="text-primary">{firstName}</span>…
          </h1>
          <p className="mt-3 text-muted-foreground md:text-lg">
            …and here's where you are now. Let's build the path between them.
          </p>
        </div>

        {/* Transformation cards */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          <TransformCard
            label="Dream Career Jumpy"
            title={data.desiredField || "Engineer Wizard"}
            subtitle="Future you"
            tone="dream"
            visible
          />
          <TransformCard
            label="Current You Jumpy"
            title={data.currentEducation ? `Current ${data.currentEducation}` : "Curious explorer"}
            subtitle="Where you are now"
            tone="current"
            visible={transformed}
          />
        </div>
      </section>

      {/* Pathways */}
      <section className="container mt-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-black">Top 3 personalized pathways</h2>
            <p className="text-sm text-muted-foreground">Tap one to set as your main plan.</p>
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
            <TrendingUp className="h-4 w-4 text-secondary" />
            Ranked by your match score
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {pathways.map((p, i) => (
            <PathwayCard
              key={p.id}
              p={p}
              rank={i + 1}
              selected={selected === p.id}
              onSelect={() => setSelected(p.id)}
            />
          ))}
        </div>
      </section>

      {/* Jumpy chat */}
      <section className="container mt-16">
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-border bg-surface p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Jumpy size="sm" animate="float" />
            <div className="flex-1">
              <h3 className="font-display text-2xl font-extrabold">Not quite right? Chat with Jumpy 🐸</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask me to swap pathways, lower the cost, focus on a specific country — anything.
              </p>
              <form
                onSubmit={(e) => { e.preventDefault(); setChat(""); }}
                className="mt-4 flex gap-2"
              >
                <Input
                  value={chat}
                  onChange={(e) => setChat(e.target.value)}
                  placeholder="e.g. Show me cheaper options in Europe…"
                  className="h-12 rounded-full border-2 px-5"
                />
                <Button type="submit" variant="hero" size="lg">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Cheaper options", "Online only", "Closer to home", "Highest future-proof"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setChat(s)}
                    className="rounded-full border-2 border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground hover:border-secondary hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t-2 border-border bg-surface/95 backdrop-blur">
        <div className="container flex max-w-5xl items-center justify-between py-4">
          <div className="text-sm">
            <div className="font-display font-extrabold">Ready to commit?</div>
            <div className="text-xs text-muted-foreground">Selected: {pathways.find(p => p.id === selected)?.name}</div>
          </div>
          <Button variant="hero" size="lg" onClick={() => navigate("/dashboard")}>
            Build my roadmap
            <ArrowRight />
          </Button>
        </div>
      </div>
      <JumpyLauncher />
    </div>
  );
};

/* ---------- subcomponents ---------- */

const TransformCard = ({
  label,
  title,
  subtitle,
  tone,
  visible,
}: {
  label: string;
  title: string;
  subtitle: string;
  tone: "dream" | "current";
  visible: boolean;
}) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-3xl border-2 p-8 text-center transition-all duration-700",
      tone === "dream" ? "border-secondary bg-secondary/15" : "border-border bg-surface",
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
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
  </div>
);

const MatchBar = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="mb-1 flex justify-between text-xs font-semibold">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}%</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-secondary" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const PathwayCard = ({
  p,
  rank,
  selected,
  onSelect,
}: {
  p: Pathway;
  rank: number;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    onClick={onSelect}
    className={cn(
      "group flex flex-col rounded-3xl border-2 bg-surface p-6 text-left transition-all hover:-translate-y-1",
      selected ? "border-secondary shadow-[0_4px_0_0_hsl(var(--primary))]" : "border-border",
    )}
  >
    <div className="mb-4 flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl">
          {p.emoji}
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            #{rank} • {p.type}
          </div>
          <div className="font-display text-lg font-extrabold leading-tight">{p.name}</div>
          <div className="text-xs text-muted-foreground">{p.institution}</div>
        </div>
      </div>
      <Heart className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-coral" />
    </div>

    <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
      <Meta icon={Clock} text={p.duration} />
      <Meta icon={DollarSign} text={p.cost} />
      <Meta icon={MapPin} text={p.location} className="col-span-2" />
    </div>

    <div className="space-y-2">
      <MatchBar label="Budget fit" value={p.match.budget} />
      <MatchBar label="Career & interests" value={p.match.career} />
      <MatchBar label="Location fit" value={p.match.location} />
      <MatchBar label="Lifestyle fit" value={p.match.lifestyle} />
    </div>

    <div className="mt-5 flex items-center justify-between rounded-2xl bg-primary p-4 text-primary-foreground">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider opacity-70">Future-proof score</div>
        <div className="font-display text-3xl font-black">{p.futureProof}<span className="text-base opacity-60">/100</span></div>
      </div>
      <TrendingUp className="h-8 w-8 opacity-80" />
    </div>

    <p className="mt-4 text-sm text-muted-foreground">
      <span className="font-bold text-foreground">Why this fits: </span>{p.why}
    </p>

    <div className="mt-5 flex items-center justify-between text-sm font-bold text-primary">
      <span>{selected ? "✓ Selected" : "Tap to select"}</span>
      <span className="inline-flex items-center gap-1">
        Explore <ArrowRight className="h-4 w-4" />
      </span>
    </div>
  </button>
);

const Meta = ({
  icon: Icon,
  text,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  className?: string;
}) => (
  <div className={cn("flex items-center gap-1.5 text-muted-foreground", className)}>
    <Icon className="h-3.5 w-3.5" />
    <span>{text}</span>
  </div>
);

export default Results;
