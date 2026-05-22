import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { experiencesStore, type Experience } from "@/lib/experiences-store";
import { toast } from "sonner";

const TYPES: Experience["type"][] = [
  "Event",
  "Workshop",
  "Volunteer",
  "Project",
  "Internship",
  "Competition",
];

const NewExperience = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<Experience["type"]>("Event");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [reflection, setReflection] = useState("");
  const [takeaways, setTakeaways] = useState("");
  const [skills, setSkills] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reflection.trim()) {
      toast.error("Title and reflection are required");
      return;
    }
    const exp: Experience = {
      id: `ex-${Date.now()}`,
      title: title.trim(),
      type,
      date: date.trim() || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      location: location.trim() || undefined,
      photoUrl: photoUrl.trim() || undefined,
      reflection: reflection.trim(),
      takeaways: takeaways.split("\n").map((t) => t.trim()).filter(Boolean),
      skills: skills.split(",").map((t) => t.trim()).filter(Boolean),
      peopleMet: [],
      posted: { linkedin: false, instagram: false, tiktok: false, twitter: false },
    };
    experiencesStore.add(exp);
    toast.success("Experience logged 🐸");
    navigate(`/journey/${exp.id}`);
  };

  return (
    <div className="container max-w-2xl py-8 md:py-10">
      <Link to="/journey" className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Journey Log
      </Link>

      <h1 className="font-display text-3xl font-black md:text-4xl">Log a new experience</h1>
      <p className="mb-6 text-sm text-muted-foreground">A few minutes now → a portfolio + LinkedIn post later.</p>

      <form onSubmit={submit} className="space-y-5 rounded-3xl border-2 border-border bg-surface p-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. UQ Innovation Summit 2026" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as Experience["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Apr 18, 2026" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Brisbane, AU" />
          </div>
          <div>
            <Label htmlFor="photo">Photo URL</Label>
            <Input id="photo" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div>
          <Label htmlFor="reflection">Reflection *</Label>
          <Textarea id="reflection" value={reflection} onChange={(e) => setReflection(e.target.value)} rows={4} placeholder="What happened? How did it feel? What did you actually learn?" />
        </div>

        <div>
          <Label htmlFor="takeaways">Key takeaways (one per line)</Label>
          <Textarea id="takeaways" value={takeaways} onChange={(e) => setTakeaways(e.target.value)} rows={3} placeholder={"Cold-emailing speakers actually works\nPitching out loud beats rehearsing in my head"} />
        </div>

        <div>
          <Label htmlFor="skills">Skills gained (comma-separated)</Label>
          <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Networking, Pitching, Public Speaking" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={() => navigate("/journey")}>Cancel</Button>
          <Button type="submit" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
            Save experience
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewExperience;
