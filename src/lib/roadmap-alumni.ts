export interface RoadmapAlumni {
  id: string;
  name: string;
  role: string;
  company: string;
  tip: string;
  linkedInUrl: string;
}

export const ROADMAP_PHASE_ORDER = [
  "Phase 1: Exploration",
  "Phase 2: Building",
  "Phase 3: Launching",
  "Phase 4: Connecting",
  "Phase 5: Mastering",
  "Phase 6: Leading",
] as const;

export type RoadmapPhaseName = (typeof ROADMAP_PHASE_ORDER)[number];

export const ROADMAP_ALUMNI_BY_PHASE: Record<RoadmapPhaseName, RoadmapAlumni[]> = {
  "Phase 1: Exploration": [
    {
      id: "a-1-1",
      name: "Priya Nair",
      role: "Software Engineer",
      company: "Canva (Graduate)",
      tip: "Happy to chat about picking your first tech clubs and hackathons at UQ.",
      linkedInUrl: "https://www.linkedin.com/",
    },
    {
      id: "a-1-2",
      name: "James Okonkwo",
      role: "Product Analyst",
      company: "Atlassian",
      tip: "Ask me how I turned a uni project into my first internship application story.",
      linkedInUrl: "https://www.linkedin.com/",
    },
  ],
  "Phase 2: Building": [
    {
      id: "a-2-1",
      name: "Mia Chen",
      role: "Full-Stack Developer",
      company: "SafetyCulture",
      tip: "I can review a React portfolio repo or suggest a solid capstone scope.",
      linkedInUrl: "https://www.linkedin.com/",
    },
    {
      id: "a-2-2",
      name: "Liam Torres",
      role: "ML Engineer",
      company: "CSIRO Data61",
      tip: "Reach out if you want feedback on integrating an LLM API into a student project.",
      linkedInUrl: "https://www.linkedin.com/",
    },
  ],
  "Phase 3: Launching": [
    {
      id: "a-3-1",
      name: "Sofia Rahman",
      role: "Graduate Consultant",
      company: "Deloitte Digital",
      tip: "I do quick resume roasts and LinkedIn headline reviews for students.",
      linkedInUrl: "https://www.linkedin.com/",
    },
    {
      id: "a-3-2",
      name: "Ethan Brooks",
      role: "DevOps Engineer",
      company: "AWS",
      tip: "Happy to share how I prepared for grad interviews and portfolio walk-throughs.",
      linkedInUrl: "https://www.linkedin.com/",
    },
  ],
  "Phase 4: Connecting": [
    {
      id: "a-4-1",
      name: "Aisha Patel",
      role: "Community Lead",
      company: "Brisbane Tech Network",
      tip: "I can intro you to meetup hosts and help you draft outreach messages.",
      linkedInUrl: "https://www.linkedin.com/",
    },
    {
      id: "a-4-2",
      name: "Noah Kim",
      role: "Engineering Manager",
      company: "REA Group",
      tip: "Ask about informational interviews — I still reply to thoughtful student DMs.",
      linkedInUrl: "https://www.linkedin.com/",
    },
  ],
  "Phase 5: Mastering": [
    {
      id: "a-5-1",
      name: "Chloe Nguyen",
      role: "Senior UX Designer",
      company: "Figma",
      tip: "Portfolio deep-dives: case study structure and showing design process clearly.",
      linkedInUrl: "https://www.linkedin.com/",
    },
    {
      id: "a-5-2",
      name: "Marcus Webb",
      role: "Staff Engineer",
      company: "Microsoft",
      tip: "Good contact for cloud certs, system design basics, and open-source first PRs.",
      linkedInUrl: "https://www.linkedin.com/",
    },
  ],
  "Phase 6: Leading": [
    {
      id: "a-6-1",
      name: "Yuki Tanaka",
      role: "Engineering Lead",
      company: "Stripe",
      tip: "Mentoring students on leading workshops and negotiating your first full-time offer.",
      linkedInUrl: "https://www.linkedin.com/",
    },
    {
      id: "a-6-2",
      name: "Amara Okafor",
      role: "Founder",
      company: "Leap Alumni Ventures",
      tip: "Connect if you want to guest-speak at events or shape a personal brand as a senior.",
      linkedInUrl: "https://www.linkedin.com/",
    },
  ],
};

export function phaseShortLabel(phase: string): string {
  return phase.replace(/^Phase \d+: /, "");
}
