import { Pencil, Download, GraduationCap, Briefcase, Wallet, Brain, Accessibility, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Jumpy } from "@/components/Jumpy";
import { mockProfile, mockUser } from "@/lib/mock-data";
import { useProgression } from "@/lib/progression-store";
import { Progress } from "@/components/ui/progress";

const sections = [
  { key: "academics", title: "Academics", icon: GraduationCap, fields: mockProfile.academics },
  { key: "career", title: "Career", icon: Briefcase, fields: mockProfile.career },
  { key: "finance", title: "Finance", icon: Wallet, fields: mockProfile.finance },
  { key: "personality", title: "Personality", icon: Brain, fields: mockProfile.personality },
  { key: "accessibility", title: "Accessibility", icon: Accessibility, fields: mockProfile.accessibility },
  { key: "lifestyle", title: "Lifestyle", icon: Sparkles, fields: mockProfile.lifestyle },
];

const AboutMe = () => {
  const { xp, level, levelProgress, streakDays } = useProgression();

  return (
    <div className="container py-8 md:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-border bg-surface p-6">
        <div className="flex items-center gap-5">
          <div className="rounded-full bg-secondary/30 p-2">
            <Jumpy size="sm" animate="float" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">About me</div>
            <h1 className="font-display text-3xl font-black">{mockUser.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-coral/15 px-2.5 py-0.5 font-bold text-coral">Lvl {level}</span>
              <span>•</span>
              <span>{xp.toLocaleString()} XP</span>
              <span>•</span>
              <span>{streakDays}-day streak</span>
              <span>•</span>
              <span>{mockUser.email}</span>
            </div>
            <div className="mt-3 max-w-md">
              <div className="mb-1 flex justify-between text-[11px] font-bold text-muted-foreground">
                <span>Progress to Lvl {level + 1}</span>
                <span>
                  {levelProgress.current} / {levelProgress.needed} XP
                </span>
              </div>
              <Progress value={levelProgress.percent} className="h-2" />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Download all</Button>
          <Button variant="hero" size="sm"><Pencil className="h-4 w-4" /> Edit profile</Button>
        </div>
      </div>

      {/* Sections */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <section key={s.key} className="rounded-3xl border-2 border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
                  <s.icon className="h-4 w-4" />
                </div>
                <h2 className="font-display text-lg font-extrabold">{s.title}</h2>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-2"><Pencil className="h-3.5 w-3.5" /></Button>
            </div>
            <dl className="space-y-2.5">
              {s.fields.map((f) => (
                <div key={f.label} className="flex items-start justify-between gap-3 text-sm">
                  <dt className="text-muted-foreground">{f.label}</dt>
                  <dd className="text-right font-bold text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
};

export default AboutMe;
