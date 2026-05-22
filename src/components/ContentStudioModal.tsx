import { useState } from "react";
import { Copy, Loader2, RefreshCw, Save, Linkedin, Instagram, Twitter, Video, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Jumpy } from "@/components/Jumpy";
import { supabase } from "@/integrations/supabase/client";
import { experiencesStore, type Experience } from "@/lib/experiences-store";
import { progressionStore } from "@/lib/progression-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Format = "linkedin" | "instagram" | "tiktok" | "twitter" | "portfolio";

const FORMATS: { id: Format; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-primary" },
  { id: "instagram", label: "Instagram", icon: Instagram, color: "text-coral" },
  { id: "tiktok", label: "TikTok", icon: Video, color: "text-foreground" },
  { id: "twitter", label: "X / Twitter", icon: Twitter, color: "text-foreground" },
  { id: "portfolio", label: "Portfolio", icon: FileText, color: "text-primary" },
];

interface Props {
  experience: Experience | null;
  initialFormat?: Format;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContentStudioModal = ({ experience, initialFormat = "linkedin", open, onOpenChange }: Props) => {
  const [format, setFormat] = useState<Format>(initialFormat);
  const [toneValue, setToneValue] = useState<number[]>([20]); // 0 = professional, 100 = casual
  const [text, setText] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const tone = toneValue[0] < 50 ? "professional" : "casual";

  const generate = async () => {
    if (!experience) return;
    setLoading(true);
    setText("");
    setHashtags([]);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { experience, format, tone },
      });
      if (error) {
        // supabase-js wraps non-2xx into error; surface message
        const msg = (error as { message?: string }).message ?? "Failed to generate";
        if (msg.includes("429")) toast.error("Too many requests — try again in a moment.");
        else if (msg.includes("402")) toast.error("AI credits exhausted. Add credits in Settings → Workspace.");
        else toast.error(msg);
        return;
      }
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      setText(data?.text ?? "");
      setHashtags(Array.isArray(data?.hashtags) ? data.hashtags : []);
      progressionStore.grantContentGenerated(experience.id, format);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = async () => {
    const tagLine = hashtags.length ? "\n\n" + hashtags.map((h) => `#${h}`).join(" ") : "";
    try {
      await navigator.clipboard.writeText(text + tagLine);
      toast.success("Copied to clipboard ✨");
    } catch {
      toast.error("Couldn't copy. Select and copy manually.");
    }
  };

  const markPosted = () => {
    if (!experience) return;
    if (format === "portfolio") {
      toast.success("Saved to portfolio");
      return;
    }
    experiencesStore.markPosted(experience.id, format);
    toast.success(`Marked as posted to ${FORMATS.find((f) => f.id === format)?.label} 🚀`);
  };

  if (!experience) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl font-black">
            <Jumpy size="xs" animate="float" />
            Content Studio
          </DialogTitle>
        </DialogHeader>

        {/* Format tabs */}
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => {
            const Icon = f.icon;
            const active = f.id === format;
            return (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border-2 px-3.5 py-1.5 text-xs font-bold transition-all",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface text-muted-foreground hover:border-foreground/40",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Tone slider */}
        <div className="rounded-2xl border-2 border-border bg-surface-soft p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Professional</span>
            <span>Casual</span>
          </div>
          <Slider value={toneValue} onValueChange={setToneValue} max={100} step={5} />
          <div className="mt-2 text-center text-xs font-semibold text-foreground">
            Tone: <span className="text-secondary">{tone}</span>
          </div>
        </div>

        {/* Output area */}
        {!text && !loading && (
          <div className="rounded-2xl border-2 border-dashed border-border bg-background p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Click <strong>Generate</strong> and Jumpy will draft a {FORMATS.find((f) => f.id === format)?.label} post from this experience.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center rounded-2xl border-2 border-border bg-background p-10">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-secondary" />
            <span className="text-sm font-semibold">Jumpy is writing...</span>
          </div>
        )}

        {text && !loading && (
          <div className="space-y-3">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={format === "tiktok" || format === "twitter" ? 12 : 9}
              className="font-body text-sm"
            />
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {hashtags.map((h, i) => (
                  <span key={i} className="rounded-full bg-secondary/20 px-2.5 py-1 text-xs font-bold text-foreground">
                    #{h}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <Button onClick={generate} disabled={loading} variant={text ? "outline" : "default"} className="rounded-full">
            {text ? <RefreshCw className="mr-2 h-4 w-4" /> : <Jumpy size="xs" animate="none" className="mr-1 scale-50" />}
            {loading ? "Generating..." : text ? "Regenerate" : "Generate ✨"}
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={copyAll} disabled={!text}>
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
            <Button onClick={markPosted} disabled={!text} className="rounded-full bg-foreground text-background hover:bg-foreground/90">
              <Save className="mr-2 h-4 w-4" /> Mark posted
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
