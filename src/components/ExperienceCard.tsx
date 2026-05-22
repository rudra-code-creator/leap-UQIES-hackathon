import { Link } from "react-router-dom";
import { Calendar, MapPin, Sparkles, Users } from "lucide-react";
import type { Experience } from "@/lib/experiences-store";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<Experience["type"], string> = {
  Event: "bg-secondary/30 text-foreground",
  Workshop: "bg-primary/15 text-primary",
  Volunteer: "bg-coral/20 text-coral",
  Project: "bg-foreground/10 text-foreground",
  Internship: "bg-coral/15 text-coral",
  Competition: "bg-secondary/40 text-foreground",
};

export const ExperienceCard = ({ experience }: { experience: Experience }) => {
  const e = experience;
  const postedCount = Object.values(e.posted).filter(Boolean).length;

  return (
    <Link
      to={`/journey/${e.id}`}
      className="group block overflow-hidden rounded-3xl border-2 border-border bg-surface transition-all hover:-translate-y-1 hover:border-secondary hover:shadow-[0_8px_0_0_hsl(var(--border))]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {e.photoUrl ? (
          <img
            src={e.photoUrl}
            alt={e.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">📔</div>
        )}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
            TYPE_STYLES[e.type],
          )}
        >
          {e.type}
        </span>
        {postedCount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-foreground/90 px-2.5 py-1 text-[11px] font-bold text-background">
            ✓ Shared {postedCount}×
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-display text-base font-extrabold leading-tight">{e.title}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {e.date}
          </span>
          {e.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {e.location}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 pt-1 text-xs font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-secondary" /> {e.skills.length} skills
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3 text-coral" /> {e.peopleMet.length} contacts
          </span>
        </div>
      </div>
    </Link>
  );
};
