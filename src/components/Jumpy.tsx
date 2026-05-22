import jumpyImg from "@/assets/jumpy-default.png";
import { cn } from "@/lib/utils";

interface JumpyProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  animate?: "hop" | "float" | "wiggle" | "none";
  className?: string;
  glow?: boolean;
}

const sizeMap = {
  xs: "w-12 h-12",
  sm: "w-20 h-20",
  md: "w-32 h-32",
  lg: "w-48 h-48",
  xl: "w-72 h-72",
};

const animMap = {
  hop: "animate-hop",
  float: "animate-float",
  wiggle: "animate-wiggle",
  none: "",
};

export const Jumpy = ({ size = "md", animate = "float", className, glow }: JumpyProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      {glow && (
        <div className="absolute inset-0 rounded-full bg-secondary/40 blur-3xl scale-90" aria-hidden />
      )}
      <img
        src={jumpyImg}
        alt="Jumpy the frog mascot"
        className={cn("relative object-contain select-none", sizeMap[size], animMap[animate])}
        draggable={false}
      />
    </div>
  );
};
