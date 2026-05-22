import { useState, useEffect } from "react";
import { Pencil, Download, GraduationCap, Briefcase, Wallet, Brain, Accessibility, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Jumpy } from "@/components/Jumpy";
import { mockProfile } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";

const AboutMe = () => {
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (!error && data) {
          setProfile(data);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const formatEducation = (code: string) => {
    switch (code) {
      case "hs": return "High School";
      case "diploma": return "Diploma / TAFE";
      case "bachelor": return "Bachelor's Degree";
      case "masters": return "Master's Degree";
      case "phd": return "PhD / Doctorate";
      case "none": return "None";
      default: return code || "Not set";
    }
  };

  // Determine user display details
  const displayName = profile?.name || "Alex Chen";
  const displayEmail = user?.email || "alex.chen@example.com";
  const displayLevel = user ? "1" : "4";
  const displayXp = user ? "0" : "1240";

  // Build profile sections based on whether user is logged in
  const academicsFields = profile
    ? [
        { label: "Education Level", value: formatEducation(profile.current_education) },
        { label: "Desired Field", value: profile.desired_field || "Not set" },
        { label: "Interests", value: profile.interests?.join(", ") || "None" },
      ]
    : mockProfile.academics;

  const locationFields = profile
    ? [
        { label: "Location", value: profile.location || "Not set" },
        { label: "Age", value: profile.age?.toString() || "Not set" },
      ]
    : [
        { label: "Location", value: "Sydney, Australia" },
        { label: "Age", value: "22" },
      ];

  const sections = [
    { key: "academics", title: "Academics & Goals", icon: GraduationCap, fields: academicsFields },
    { key: "location", title: "Personal Details", icon: MapPin, fields: locationFields },
    { key: "career", title: "Mock Career", icon: Briefcase, fields: mockProfile.career },
    { key: "finance", title: "Mock Finance", icon: Wallet, fields: mockProfile.finance },
    { key: "personality", title: "Mock Personality", icon: Brain, fields: mockProfile.personality },
    { key: "lifestyle", title: "Mock Lifestyle", icon: Sparkles, fields: mockProfile.lifestyle },
  ];

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
            <h1 className="font-display text-3xl font-black">{displayName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-coral/15 px-2.5 py-0.5 font-bold text-coral">Lvl {displayLevel}</span>
              <span>•</span>
              <span>{displayXp} XP</span>
              <span>•</span>
              <span>{displayEmail}</span>
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
