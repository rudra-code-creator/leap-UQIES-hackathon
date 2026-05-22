import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail, Lock, User, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Jumpy } from "@/components/Jumpy";
import { ThemeToggle } from "@/components/ThemeToggle";
import { defaultQuiz, type QuizState } from "@/lib/quiz-types";
import { progressionStore } from "@/lib/progression-store";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

const interestOptions = [
  "Tech",
  "Art & Design",
  "Business",
  "Healthcare",
  "Engineering",
  "Science",
  "Education",
  "Trades",
  "Hospitality",
  "Sports",
  "Sustainability",
];

const Quiz = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<QuizState>(defaultQuiz);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const update = <K extends keyof QuizState>(k: K, v: QuizState[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const validateAndSubmit = () => {
    if (!data.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (!data.currentEducation) {
      toast.error("Please select your current education level.");
      return;
    }
    if (!data.desiredField.trim()) {
      toast.error("Please enter your dream field or role.");
      return;
    }

    // Save user configuration to session storage for results matching
    sessionStorage.setItem("leap-quiz", JSON.stringify(data));
    progressionStore.grantQuizComplete();
    toast.success("Account created successfully! Finding your matches... 🐸");
    navigate("/results");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b-2 border-border bg-background/90 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <Jumpy size="xs" animate="float" />
            <span className="font-display text-lg font-black">Leap Sign-up</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => navigate("/")}
              className="text-sm font-bold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl py-10 pb-32">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="font-display text-4xl font-black md:text-5xl leading-tight">
            Start your journey with <span className="text-coral">Leap</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Create your account and build your personalized roadmap in seconds.
          </p>
        </div>

        {/* Form Layout Stacked (Up to Down) */}
        <div className="space-y-8 animate-fade-in">
          
          {/* Card 1: Account Details */}
          <div className="rounded-3xl border-2 border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 font-display text-2xl font-extrabold text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-secondary" />
              1. Account Details
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="font-bold text-sm">Full Name</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Alex Chen"
                    className="h-12 pl-10 rounded-xl"
                  />
                  <User className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="age" className="font-bold text-sm">Age</Label>
                  <Input
                    id="age"
                    value={data.age}
                    onChange={(e) => update("age", e.target.value)}
                    placeholder="22"
                    className="mt-1.5 h-12 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="loc" className="font-bold text-sm">Where are you based?</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="loc"
                      value={data.location}
                      onChange={(e) => update("location", e.target.value)}
                      placeholder="Sydney, Australia"
                      className="h-12 pl-10 rounded-xl"
                    />
                    <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="font-bold text-sm">Email Address</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.chen@example.com"
                    className="h-12 pl-10 rounded-xl"
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="font-bold text-sm">Create Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="h-12 pl-10 rounded-xl"
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Background & Ambitions */}
          <div className="rounded-3xl border-2 border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 font-display text-2xl font-extrabold text-foreground flex items-center gap-2">
              🎓 2. Background & Ambitions
            </h2>
            <div className="space-y-4">
              <div>
                <Label className="mb-1.5 block font-bold text-sm">Highest Education Achieved</Label>
                <Select
                  value={data.currentEducation}
                  onValueChange={(v) => update("currentEducation", v)}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-background border-input hover:border-secondary/60 transition-colors">
                    <SelectValue placeholder="Select highest education..." />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-2 border-border rounded-xl">
                    <SelectItem value="hs">High School</SelectItem>
                    <SelectItem value="diploma">Diploma / TAFE</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD / Doctorate</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="df" className="font-bold text-sm">Dream Role or Field</Label>
                <Input
                  id="df"
                  value={data.desiredField}
                  onChange={(e) => update("desiredField", e.target.value)}
                  placeholder="e.g. UX Designer, Software Engineer, Founder..."
                  className="mt-1.5 h-12 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Personal Interests */}
          <div className="rounded-3xl border-2 border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-4 font-display text-2xl font-extrabold text-foreground flex items-center gap-2">
              🎨 3. Select Your Interests
            </h2>
            <p className="text-sm text-muted-foreground mb-3 leading-snug">
              Select your fields of interest to help Jumpy personalize matches.
            </p>
            
            <div className="space-y-2">
              <Label className="font-bold text-sm">Interests</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-between rounded-xl px-4 font-normal text-muted-foreground bg-background hover:bg-background border-input hover:border-secondary/60 transition-colors"
                  >
                    <span className="text-foreground truncate max-w-[90%]">
                      {data.interests.length > 0
                        ? data.interests.join(", ")
                        : "Select your interests..."}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50 text-foreground shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[340px] max-h-[300px] overflow-y-auto bg-surface border-2 border-border rounded-xl p-1 z-30 shadow-md">
                  {interestOptions.map((opt) => (
                    <DropdownMenuCheckboxItem
                      key={opt}
                      checked={data.interests.includes(opt)}
                      onCheckedChange={(checked) => {
                        const next = checked
                          ? [...data.interests, opt]
                          : data.interests.filter((x) => x !== opt);
                        update("interests", next);
                      }}
                      className="rounded-lg py-2 font-semibold hover:bg-secondary/15 cursor-pointer text-foreground"
                    >
                      {opt}
                      </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

        </div>
      </main>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t-2 border-border bg-surface/95 backdrop-blur z-20 shadow-lg animate-fade-in">
        <div className="container flex max-w-2xl items-center justify-between py-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button variant="hero" size="xl" onClick={validateAndSubmit}>
            Create Account & Match Me
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
