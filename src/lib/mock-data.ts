export const mockUser = {
  name: "Alex Chen",
  firstName: "Alex",
  email: "alex.chen@example.com",
  level: 4,
  xp: 1240,
};

export interface Pathway {
  id: string;
  name: string;
  institution: string;
  type: string;
  duration: string;
  cost: string;
  location: string;
  match: { budget: number; career: number; location: number; lifestyle: number };
  futureProof: number;
  why: string;
  emoji: string;
}

export const mockPathways: Pathway[] = [
  {
    id: "1",
    name: "BSc Computer Science",
    institution: "University of Melbourne",
    type: "University",
    duration: "3 years",
    cost: "$45,000/yr",
    location: "Melbourne, AU • On-campus",
    match: { budget: 78, career: 94, location: 88, lifestyle: 82 },
    futureProof: 91,
    why: "Top CS faculty, strong industry placement, fits your career-driven style.",
    emoji: "🎓",
  },
  {
    id: "2",
    name: "Full-Stack Dev Bootcamp",
    institution: "Coder Academy",
    type: "Bootcamp",
    duration: "24 weeks",
    cost: "$18,500 total",
    location: "Sydney • Hybrid",
    match: { budget: 92, career: 86, location: 80, lifestyle: 88 },
    futureProof: 78,
    why: "Fast track into industry, low debt, hands-on learning.",
    emoji: "⚡",
  },
  {
    id: "3",
    name: "Diploma of IT (Networking)",
    institution: "TAFE NSW",
    type: "TAFE",
    duration: "2 years",
    cost: "$8,200 total",
    location: "Sydney • On-campus",
    match: { budget: 96, career: 72, location: 90, lifestyle: 84 },
    futureProof: 70,
    why: "Most affordable, government-subsidized stepping stone.",
    emoji: "🛠️",
  },
];

export const mockUniversities = [
  { id: "u1", name: "University of Melbourne", country: "Australia", city: "Melbourne", score: 91, tag: "Top 50" },
  { id: "u2", name: "ETH Zürich", country: "Switzerland", city: "Zürich", score: 95, tag: "Top 10" },
  { id: "u3", name: "National University of Singapore", country: "Singapore", city: "Singapore", score: 93, tag: "Top 20" },
  { id: "u4", name: "University of Toronto", country: "Canada", city: "Toronto", score: 89, tag: "Top 25" },
  { id: "u5", name: "Technical University of Munich", country: "Germany", city: "Munich", score: 88, tag: "Affordable" },
  { id: "u6", name: "University of Edinburgh", country: "UK", city: "Edinburgh", score: 87, tag: "Top 50" },
  { id: "u7", name: "KTH Royal Institute", country: "Sweden", city: "Stockholm", score: 84, tag: "Free tuition" },
  { id: "u8", name: "TU Delft", country: "Netherlands", city: "Delft", score: 86, tag: "English-taught" },
];

export const mockChecklist = [
  { id: "c1", task: "Submit IELTS registration", due: "Apr 22", urgent: true, done: false },
  { id: "c2", task: "Request transcripts from current uni", due: "Apr 26", urgent: false, done: true },
  { id: "c3", task: "Draft personal statement v1", due: "May 3", urgent: false, done: false },
  { id: "c4", task: "Ask Prof. Wong for recommendation", due: "May 8", urgent: true, done: false },
  { id: "c5", task: "Compare scholarship deadlines", due: "May 15", urgent: false, done: false },
];

export const mockNews = [
  { id: "n1", title: "Australia raises post-study work visa to 4 years for STEM grads", source: "ABC News", time: "2h ago" },
  { id: "n2", title: "AI engineers see 28% salary growth year-over-year", source: "LinkedIn Insights", time: "1d ago" },
  { id: "n3", title: "New scholarship: $20k for international CS students at UMelb", source: "Leap Updates", time: "3d ago" },
];

export interface RoadmapTask { id: string; label: string; due?: string; done: boolean; }
export interface RoadmapPhase {
  id: string;
  title: string;
  encouragement: string;
  status: "done" | "current" | "upcoming";
  tasks: RoadmapTask[];
}

export const mockRoadmap: RoadmapPhase[] = [
  {
    id: "prep",
    title: "Preparation",
    encouragement: "You've got this — let's gather what we need 🐸",
    status: "done",
    tasks: [
      { id: "p1", label: "Book IELTS exam", due: "Mar 10", done: true },
      { id: "p2", label: "Research 5 target programs", due: "Mar 18", done: true },
      { id: "p3", label: "Apply for passport renewal", due: "Mar 25", done: true },
      { id: "p4", label: "Open AUD savings account", due: "Apr 2", done: true },
    ],
  },
  {
    id: "app",
    title: "Application",
    encouragement: "This is the big hop! One task at a time.",
    status: "current",
    tasks: [
      { id: "a1", label: "Upload transcripts", due: "Apr 22", done: true },
      { id: "a2", label: "Submit personal statement", due: "May 3", done: false },
      { id: "a3", label: "Collect 2 recommendation letters", due: "May 8", done: false },
      { id: "a4", label: "Pay application fee", due: "May 12", done: false },
      { id: "a5", label: "Apply for scholarships", due: "May 15", done: false },
    ],
  },
  {
    id: "dec",
    title: "Decision",
    encouragement: "Soon you'll be choosing between offers!",
    status: "upcoming",
    tasks: [
      { id: "d1", label: "Compare offer letters", done: false },
      { id: "d2", label: "Confirm acceptance", done: false },
      { id: "d3", label: "Pay deposit", done: false },
    ],
  },
  {
    id: "dep",
    title: "Pre-Departure",
    encouragement: "Pack light, dream big 🌏",
    status: "upcoming",
    tasks: [
      { id: "dp1", label: "Book accommodation", done: false },
      { id: "dp2", label: "Apply for student visa", done: false },
      { id: "dp3", label: "Book flights", done: false },
      { id: "dp4", label: "Pack climate-appropriate clothing", done: false },
    ],
  },
];

export const mockProfile = {
  academics: [
    { label: "Current level", value: "Bachelor's, Year 3" },
    { label: "Major", value: "Computer Science" },
    { label: "GPA", value: "3.8 / 4.0" },
    { label: "IELTS", value: "Booked — May 2" },
  ],
  career: [
    { label: "Target role", value: "Software Engineer" },
    { label: "Industry", value: "Tech / SaaS" },
    { label: "Future-proof score", value: "91 / 100" },
    { label: "Timeline", value: "2 years to entry-level" },
  ],
  finance: [
    { label: "Budget", value: "$30k–$50k AUD/yr" },
    { label: "Savings", value: "$12,400" },
    { label: "Family support", value: "Partial" },
    { label: "Scholarships applied", value: "3 of 8" },
  ],
  personality: [
    { label: "Learning style", value: "Hands-on, visual" },
    { label: "Work style", value: "Collaborative" },
    { label: "Risk tolerance", value: "Moderate" },
    { label: "Pace", value: "Fast" },
  ],
  accessibility: [
    { label: "Support needs", value: "None reported" },
    { label: "Campus needs", value: "Quiet study spaces" },
  ],
  lifestyle: [
    { label: "City size", value: "Mid-to-large" },
    { label: "Commute", value: "Walking / transit" },
    { label: "Social", value: "Small close circle" },
    { label: "Top priority", value: "Career growth" },
  ],
};

export interface ChatMessage { id: string; from: "jumpy" | "user"; text: string; }
export const mockChatHistory: ChatMessage[] = [
  { id: "m1", from: "jumpy", text: "Hey Alex! 🐸 I see you're between BSc CompSci at UMelb and the Coder Academy bootcamp. Want me to compare them?" },
  { id: "m2", from: "user", text: "Yes — focus on cost and time to first job." },
  { id: "m3", from: "jumpy", text: "Bootcamp wins on both: ~$18.5k vs $135k total, and grads land first roles in ~6 months vs ~12. UMelb wins on long-term ceiling and visa duration. Want a side-by-side?" },
];
