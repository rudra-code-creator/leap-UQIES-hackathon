import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Jumpy } from "@/components/Jumpy";

interface Props {
  message: string;
  ctaLabel?: string;
  to?: string;
}

export const JumpyNudge = ({ message, ctaLabel, to }: Props) => {
  return (
    <div className="flex items-center gap-4 rounded-3xl border-2 border-coral/40 bg-coral/10 p-4">
      <Jumpy size="xs" animate="float" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">{message}</p>
      </div>
      {ctaLabel && to && (
        <Link
          to={to}
          className="inline-flex items-center gap-1 rounded-full bg-coral px-4 py-2 text-xs font-bold text-coral-foreground transition-transform hover:scale-105"
        >
          {ctaLabel} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
};
