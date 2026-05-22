import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Jumpy } from "@/components/Jumpy";
import { defaultQuiz, type QuizState } from "@/lib/quiz-types";
import { cn } from "@/lib/utils";

const sectionTitles = [
  "Who are you?",
  "Profile",
  "Academics",
  "Career",
  "Finance",
  "Personality",
  "Lifestyle",
];

const Quiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuizState>(defaultQuiz);
  const update = <K extends keyof QuizState>(k: K, v: QuizState[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const totalSteps = sectionTitles.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const next = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else {
      sessionStorage.setItem("leap-quiz", JSON.stringify(data));
      navigate("/results");
    }
  };
  const back = () => (step > 0 ? setStep(step - 1) : navigate("/"));

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b-2 border-border bg-background/90 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <button onClick={back} className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            Step {step + 1} of {totalSteps}
          </div>
          <button onClick={() => navigate("/")} className="text-sm font-bold text-muted-foreground hover:text-foreground">
            Save & exit
          </button>
        </div>
        <div className="container pb-3">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-secondary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute -top-1 transition-all duration-500"
              style={{ left: `calc(${progress}% - 16px)` }}
            >
              <Jumpy size="xs" animate="none" className="!w-8 !h-8" />
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl py-10 pb-32">
        <div key={step} className="animate-fade-in">
          <div className="mb-2 text-sm font-bold uppercase tracking-wider text-secondary">
            Section {step + 1}
          </div>
          <h1 className="font-display text-3xl font-black md:text-4xl">{sectionTitles[step]}</h1>

          <div className="mt-8 space-y-6">
            {step === 0 && <StepUserType data={data} update={update} />}
            {step === 1 && <StepProfile data={data} update={update} />}
            {step === 2 && <StepAcademics data={data} update={update} />}
            {step === 3 && <StepCareer data={data} update={update} />}
            {step === 4 && <StepFinance data={data} update={update} />}
            {step === 5 && <StepPersonality data={data} update={update} />}
            {step === 6 && <StepLifestyle data={data} update={update} />}
          </div>
        </div>
      </main>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t-2 border-border bg-surface/95 backdrop-blur">
        <div className="container flex max-w-3xl items-center justify-between py-4">
          <Button variant="ghost" onClick={back}>
            <ArrowLeft />
            Back
          </Button>
          <Button variant="hero" size="lg" onClick={next}>
            {step === totalSteps - 1 ? "See my matches" : "Continue"}
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Reusable bits ---------------- */

interface StepProps {
  data: QuizState;
  update: <K extends keyof QuizState>(k: K, v: QuizState[K]) => void;
}

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-2xl border-2 border-border bg-surface p-6", className)}>{children}</div>
);

const ChoiceGrid = ({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: { value: string; label: string; desc?: string }[];
  value: string;
  onChange: (v: string) => void;
  cols?: 2 | 3 | 4;
}) => (
  <div className={cn("grid gap-3", cols === 2 && "sm:grid-cols-2", cols === 3 && "sm:grid-cols-3", cols === 4 && "sm:grid-cols-2 md:grid-cols-4")}>
    {options.map((opt) => {
      const active = value === opt.value;
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-2xl border-2 p-4 text-left transition-all",
            active
              ? "border-secondary bg-secondary/10 shadow-[0_2px_0_0_hsl(var(--primary))]"
              : "border-border bg-surface hover:border-secondary/60",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-foreground">{opt.label}</span>
            {active && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-foreground">
                <Check className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          {opt.desc && <p className="mt-1 text-xs text-muted-foreground">{opt.desc}</p>}
        </button>
      );
    })}
  </div>
);

const ChipMulti = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const active = value.includes(opt);
      return (
        <button
          key={opt}
          type="button"
          onClick={() =>
            onChange(active ? value.filter((v) => v !== opt) : [...value, opt])
          }
          className={cn(
            "rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-all",
            active
              ? "border-secondary bg-secondary text-foreground"
              : "border-border bg-surface text-muted-foreground hover:border-secondary/60",
          )}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

/* ---------------- Steps ---------------- */

const StepUserType = ({ data, update }: StepProps) => (
  <>
    <p className="text-muted-foreground">This helps Jumpy tailor everything to you.</p>
    <Card>
      <Label className="mb-3 block font-display text-base">Are you a student or worker?</Label>
      <ChoiceGrid
        options={[
          { value: "student", label: "🎓 Student", desc: "Looking at courses, unis, or grad school" },
          { value: "worker", label: "💼 Worker", desc: "Upskilling or changing careers" },
        ]}
        value={data.userType ?? ""}
        onChange={(v) => update("userType", v as QuizState["userType"])}
      />
    </Card>
    {data.userType === "student" && (
      <Card>
        <Label className="mb-3 block font-display text-base">What's your current level?</Label>
        <ChoiceGrid
          cols={4}
          options={[
            { value: "high-school", label: "High school" },
            { value: "bachelor", label: "Bachelor's" },
            { value: "masters", label: "Master's" },
            { value: "phd", label: "PhD" },
          ]}
          value={data.studentLevel ?? ""}
          onChange={(v) => update("studentLevel", v as QuizState["studentLevel"])}
        />
      </Card>
    )}
    {data.userType === "worker" && (
      <Card>
        <Label className="mb-3 block font-display text-base">What's your goal?</Label>
        <ChoiceGrid
          options={[
            { value: "upskill", label: "Upskill", desc: "Stay in my field, level up" },
            { value: "change", label: "Change path", desc: "Pivot to a new career" },
          ]}
          value={data.workerGoal ?? ""}
          onChange={(v) => update("workerGoal", v as QuizState["workerGoal"])}
        />
      </Card>
    )}
  </>
);

const StepProfile = ({ data, update }: StepProps) => (
  <>
    <p className="text-muted-foreground">A quick intro so Jumpy can call you by name.</p>
    <Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Alex Chen" className="mt-1.5 h-12 rounded-xl" />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" value={data.age} onChange={(e) => update("age", e.target.value)} placeholder="22" className="mt-1.5 h-12 rounded-xl" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="loc">Where are you based?</Label>
          <Input id="loc" value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="Sydney, Australia" className="mt-1.5 h-12 rounded-xl" />
        </div>
      </div>
    </Card>
    <Card>
      <Label className="mb-3 block">Pick your interests</Label>
      <ChipMulti
        options={["Tech", "Art & Design", "Business", "Healthcare", "Engineering", "Science", "Education", "Trades", "Hospitality", "Sports", "Sustainability"]}
        value={data.interests}
        onChange={(v) => update("interests", v)}
      />
    </Card>
  </>
);

const StepAcademics = ({ data, update }: StepProps) => (
  <>
    <p className="text-muted-foreground">Where you've been, and where you want to go.</p>
    <Card>
      <Label className="mb-3 block font-display">Current education</Label>
      <ChoiceGrid
        cols={3}
        options={[
          { value: "hs", label: "High school" },
          { value: "diploma", label: "Diploma / TAFE" },
          { value: "bachelor", label: "Bachelor's" },
          { value: "masters", label: "Master's" },
          { value: "phd", label: "PhD" },
          { value: "none", label: "None" },
        ]}
        value={data.currentEducation}
        onChange={(v) => update("currentEducation", v)}
      />
    </Card>
    <Card>
      <Label htmlFor="ff">Desired field of study</Label>
      <Input id="ff" value={data.futureField} onChange={(e) => update("futureField", e.target.value)} placeholder="Software engineering, design, biology…" className="mt-1.5 h-12 rounded-xl" />
    </Card>
    <Card>
      <Label className="mb-3 block">Preferred format</Label>
      <ChoiceGrid
        cols={3}
        options={[
          { value: "campus", label: "On-campus" },
          { value: "online", label: "Online" },
          { value: "hybrid", label: "Hybrid" },
        ]}
        value={data.format}
        onChange={(v) => update("format", v)}
      />
    </Card>
  </>
);

const StepCareer = ({ data, update }: StepProps) => (
  <>
    <p className="text-muted-foreground">Tell Jumpy about your dream gig.</p>
    <Card>
      <Label htmlFor="df">Dream field or role</Label>
      <Input id="df" value={data.desiredField} onChange={(e) => update("desiredField", e.target.value)} placeholder="UX designer, surgeon, founder…" className="mt-1.5 h-12 rounded-xl" />
    </Card>
    <Card>
      <div className="mb-3 flex items-baseline justify-between">
        <Label>Salary expectation</Label>
        <span className="font-display text-lg font-extrabold text-primary">${data.salaryExpectation.toLocaleString()}/yr</span>
      </div>
      <Slider
        value={[data.salaryExpectation]}
        min={30000}
        max={250000}
        step={5000}
        onValueChange={([v]) => update("salaryExpectation", v)}
      />
    </Card>
    <Card>
      <Label className="mb-3 block">When do you want to start?</Label>
      <ChoiceGrid
        cols={3}
        options={[
          { value: "asap", label: "ASAP" },
          { value: "6m", label: "Within 6 months" },
          { value: "1y", label: "Within a year" },
          { value: "2y+", label: "2+ years" },
        ]}
        value={data.timeline}
        onChange={(v) => update("timeline", v)}
      />
    </Card>
  </>
);

const StepFinance = ({ data, update }: StepProps) => (
  <>
    <p className="text-muted-foreground">No judgement — this just helps us find what fits.</p>
    <Card>
      <div className="mb-3 flex items-baseline justify-between">
        <Label>Annual income</Label>
        <span className="font-display text-lg font-extrabold text-primary">${data.income.toLocaleString()}</span>
      </div>
      <Slider value={[data.income]} min={0} max={200000} step={5000} onValueChange={([v]) => update("income", v)} />
    </Card>
    <Card>
      <div className="mb-3 flex items-baseline justify-between">
        <Label>Savings</Label>
        <span className="font-display text-lg font-extrabold text-primary">${data.savings.toLocaleString()}</span>
      </div>
      <Slider value={[data.savings]} min={0} max={100000} step={1000} onValueChange={([v]) => update("savings", v)} />
    </Card>
    <Card>
      <div className="mb-3 flex items-baseline justify-between">
        <Label>Weekly living budget</Label>
        <span className="font-display text-lg font-extrabold text-primary">${data.weeklyCost}/wk</span>
      </div>
      <Slider value={[data.weeklyCost]} min={150} max={1500} step={25} onValueChange={([v]) => update("weeklyCost", v)} />
    </Card>
    <Card>
      <Label className="mb-3 block">Comfort with debt</Label>
      <Slider value={[data.debtComfort]} max={100} step={1} onValueChange={([v]) => update("debtComfort", v)} />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>Avoid all debt</span>
        <span>Comfortable with loans</span>
      </div>
    </Card>
  </>
);

const personalityPairs = [
  ["Introvert", "Extrovert"],
  ["Solo work", "Team work"],
  ["Theory", "Hands-on"],
  ["Structure", "Flexibility"],
  ["Stable", "Risk-taking"],
  ["Big picture", "Detail-oriented"],
  ["Analytical", "Creative"],
  ["Slow & steady", "Fast-paced"],
];

const StepPersonality = ({ data, update }: StepProps) => (
  <>
    <p className="text-muted-foreground">Drag the sliders to where you naturally land.</p>
    <Card className="space-y-5">
      {personalityPairs.map(([left, right], i) => (
        <div key={i}>
          <div className="mb-2 flex justify-between text-sm font-semibold text-foreground">
            <span>{left}</span>
            <span>{right}</span>
          </div>
          <Slider
            value={[data.personality[i]]}
            max={100}
            step={1}
            onValueChange={([v]) => {
              const next = [...data.personality];
              next[i] = v;
              update("personality", next);
            }}
          />
        </div>
      ))}
    </Card>
  </>
);

const StepLifestyle = ({ data, update }: StepProps) => {
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...data.priorities];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    update("priorities", next);
  };
  return (
    <>
      <p className="text-muted-foreground">The vibe you want for your day-to-day.</p>
      <Card>
        <Label className="mb-3 block">Preferred city size</Label>
        <ChoiceGrid
          cols={3}
          options={[
            { value: "small", label: "Small town" },
            { value: "mid", label: "Mid-sized city" },
            { value: "metro", label: "Big metro" },
          ]}
          value={data.citySize}
          onChange={(v) => update("citySize", v)}
        />
      </Card>
      <Card>
        <div className="mb-3 flex items-baseline justify-between">
          <Label>Work-life balance importance</Label>
          <span className="font-display text-lg font-extrabold text-primary">{data.workLifeBalance}%</span>
        </div>
        <Slider value={[data.workLifeBalance]} max={100} step={1} onValueChange={([v]) => update("workLifeBalance", v)} />
      </Card>
      <Card>
        <Label className="mb-3 block">Rank your priorities (drag arrows)</Label>
        <div className="space-y-2">
          {data.priorities.map((p, i) => (
            <div key={p} className="flex items-center gap-3 rounded-xl border-2 border-border bg-background p-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary font-display text-sm font-extrabold text-foreground">
                {i + 1}
              </span>
              <span className="flex-1 font-semibold">{p}</span>
              <button onClick={() => move(i, -1)} className="rounded-md p-1 hover:bg-muted" aria-label="Move up">▲</button>
              <button onClick={() => move(i, 1)} className="rounded-md p-1 hover:bg-muted" aria-label="Move down">▼</button>
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default Quiz;
