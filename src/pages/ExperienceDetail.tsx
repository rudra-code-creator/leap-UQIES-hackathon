import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Linkedin, Instagram, Twitter, Video, FileText, Sparkles, Users, Target } from "lucide-react";
import { useExperiences } from "@/lib/experiences-store";
import { ContentStudioModal } from "@/components/ContentStudioModal";
import { cn } from "@/lib/utils";

type Format = "linkedin" | "instagram" | "tiktok" | "twitter" | "portfolio";

const ACTIONS: { id: Format; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "linkedin", label: "LinkedIn post", icon: Linkedin },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "tiktok", label: "TikTok script", icon: Video },
  { id: "twitter", label: "X thread", icon: Twitter },
  { id: "portfolio", label: "Portfolio entry", icon: FileText },
];

const ExperienceDetail = () => {
  const { id } = useParams();
  const experiences = useExperiences();
  const exp = experiences.find((e) => e.id === id);
  const [modalOpen, setModalOpen] = useState(false);
  const [chosenFormat, setChosenFormat] = useState<Format>("linkedin");

  if (!exp) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Experience not found.</p>
        <Link to="/journey" className="mt-4 inline-block font-bold text-secondary">Back to Journey Log</Link>
      </div>
    );
  }

  const open = (f: Format) => {
    setChosenFormat(f);
    setModalOpen(true);
  };

  return (
    <div className="container max-w-4xl py-8 md:py-10">
      <Link to="/journey" className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Journey Log
      </Link>

      {/* Hero */}
      <div className="overflow-hidden rounded-3xl border-2 border-border bg-surface">
        {exp.photoUrl && (
          <div className="aspect-[16/7] overflow-hidden bg-muted">
            <img src={exp.photoUrl} alt={exp.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="p-6 md:p-8">
          <span className="rounded-full bg-secondary/30 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground">
            {exp.type}
          </span>
          <h1 className="mt-3 font-display text-3xl font-black md:text-4xl">{exp.title}</h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> {exp.date}</span>
            {exp.location && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {exp.location}</span>}
            {exp.impact && <span className="inline-flex items-center gap-1"><Target className="h-4 w-4 text-coral" /> {exp.impact}</span>}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="my-6 flex flex-wrap gap-2 rounded-3xl border-2 border-border bg-surface p-3">
        <span className="self-center pl-2 pr-1 font-display text-sm font-extrabold">✨ Create:</span>
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          const posted = a.id !== "portfolio" && exp.posted[a.id as keyof typeof exp.posted];
          return (
            <button
              key={a.id}
              onClick={() => open(a.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border-2 px-3.5 py-2 text-xs font-bold transition-all hover:-translate-y-0.5",
                posted
                  ? "border-secondary/60 bg-secondary/15 text-foreground"
                  : "border-border bg-background text-foreground hover:border-foreground/40",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {a.label}
              {posted && <span className="text-[10px] text-secondary">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Content sections */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Section icon="📝" title="My reflection">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{exp.reflection}</p>
          </Section>

          {exp.takeaways.length > 0 && (
            <Section icon="💡" title="Key takeaways">
              <ul className="space-y-2">
                {exp.takeaways.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-secondary">▸</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {exp.peopleMet.length > 0 && (
            <Section icon="👥" title="People I met">
              <ul className="space-y-2">
                {exp.peopleMet.map((p, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-xl bg-background px-3 py-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-display text-sm font-black">
                      {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{p.name}</div>
                      {p.role && <div className="text-xs text-muted-foreground">{p.role}</div>}
                    </div>
                    {p.linkedin && (
                      <a href={p.linkedin} className="text-primary hover:opacity-70" aria-label="LinkedIn">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <div className="space-y-6">
          {exp.skills.length > 0 && (
            <Section icon={<Sparkles className="h-4 w-4 text-secondary" />} title="Skills gained">
              <div className="flex flex-wrap gap-1.5">
                {exp.skills.map((s, i) => (
                  <span key={i} className="rounded-full bg-secondary/20 px-2.5 py-1 text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          <Section icon={<Users className="h-4 w-4 text-coral" />} title="At a glance">
            <dl className="space-y-1 text-sm">
              <Stat label="People met" value={exp.peopleMet.length} />
              <Stat label="Skills" value={exp.skills.length} />
              <Stat label="Posts shared" value={Object.values(exp.posted).filter(Boolean).length} />
            </dl>
          </Section>
        </div>
      </div>

      <ContentStudioModal
        experience={exp}
        initialFormat={chosenFormat}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="rounded-3xl border-2 border-border bg-surface p-5">
    <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
      <span>{icon}</span> {title}
    </h2>
    {children}
  </section>
);

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="font-display font-extrabold">{value}</dd>
  </div>
);

export default ExperienceDetail;
