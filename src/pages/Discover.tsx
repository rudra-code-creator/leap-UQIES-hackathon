import { useState, useMemo } from "react";
import { Search, Users, MessageSquare, Calendar, MapPin, Check, Plus, Filter, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useDiscoverStates, discoverStore } from "@/lib/discover-store";

interface Community {
  id: string;
  name: string;
  desc: string;
  members: number;
  type: string;
  category: string;
  joined: boolean;
}

interface Chat {
  id: string;
  name: string;
  activeNow: number;
  platform: "Discord" | "WhatsApp" | "Slack" | "In-App";
  description: string;
  joined: boolean;
  category: string;
}

interface DiscoverEvent {
  id: string;
  title: string;
  skills: string[];
  interest: string;
  date: string;
  type: string;
  joined: boolean;
  speaker: string;
}

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeInterestFilter, setActiveInterestFilter] = useState("All");

  const discoverStates = useDiscoverStates();

  const communities = useMemo(() => {
    const defaultCommunities = [
      {
        id: "c-1",
        name: "UQ Computer Science Club",
        desc: "Largest tech club at UQ, hosting industry nights, coding competitions, and weekly hack-sessions.",
        members: 1420,
        type: "Campus Club",
        category: "Tech & Coding",
      },
      {
        id: "c-2",
        name: "Brisbane AI Builders",
        desc: "For developers and researchers building products with LLMs, diffusion models, and agents.",
        members: 580,
        type: "Local Meetup",
        category: "Artificial Intelligence",
      },
      {
        id: "c-3",
        name: "Women in Technology (WiT) Student Chapter",
        desc: "Empowering female tech leaders through mentorship, masterclasses, and networking opportunities.",
        members: 890,
        type: "Professional Network",
        category: "Career Growth",
      },
      {
        id: "c-4",
        name: "Design & UX Syndicate",
        desc: "A creative group for student designers, UX researchers, and product managers.",
        members: 410,
        type: "Creative Circle",
        category: "UI/UX Design",
      },
    ];

    return defaultCommunities.map((c) => {
      const joined = discoverStore.isJoined("community", c.id);
      return {
        ...c,
        joined,
        members: joined ? c.members + 1 : c.members,
      };
    });
  }, [discoverStates]);

  const chats = useMemo(() => {
    const defaultChats = [
      {
        id: "ch-1",
        name: "#ai-agents-collaboration",
        activeNow: 42,
        platform: "Discord" as const,
        description: "Discussing local Mistral and OpenAI integrations, prompt engineering, and hackathon teams.",
        category: "Artificial Intelligence",
      },
      {
        id: "ch-2",
        name: "QUT React & Vite study cohort",
        activeNow: 18,
        platform: "Slack" as const,
        description: "Daily coding accountability, peer review, and debugging help for web developers.",
        category: "Tech & Coding",
      },
      {
        id: "ch-3",
        name: "Career Advice & Resume Roast",
        activeNow: 65,
        platform: "Slack" as const,
        description: "Get your profile reviewed by senior students and recruiters.",
        category: "Career Growth",
      },
      {
        id: "ch-4",
        name: "UX Feedback & Portfolio Critiques",
        activeNow: 11,
        platform: "Discord" as const,
        description: "Share your wireframes and portfolio links for design feedback.",
        category: "UI/UX Design",
      },
    ];

    return defaultChats.map((ch) => ({
      ...ch,
      joined: discoverStore.isJoined("chat", ch.id),
    }));
  }, [discoverStates]);

  const events = useMemo(() => {
    const defaultEvents = [
      {
        id: "ev-1",
        title: "Generative AI Hackathon 2026",
        skills: ["Mistral API", "Vite", "Prompt Engineering"],
        interest: "Artificial Intelligence",
        date: "May 25, 2026 • 10:00 AM",
        type: "Hackathon",
        speaker: "Sponsored by Google Cloud",
      },
      {
        id: "ev-2",
        title: "How to Build a High-converting Career Brand",
        skills: ["LinkedIn Formatting", "Networking", "Public Speaking"],
        interest: "Career Growth",
        date: "May 29, 2026 • 2:00 PM",
        type: "Masterclass",
        speaker: "Host: Jumpy Coaching Services",
      },
      {
        id: "ev-3",
        title: "Intro to Rolldown: Next-Gen JS Bundling",
        skills: ["Vite 8", "Rolldown", "Web Performance"],
        interest: "Tech & Coding",
        date: "June 4, 2026 • 5:00 PM",
        type: "Developer Meetup",
        speaker: "Speaker: Core Vite Contributor",
      },
      {
        id: "ev-4",
        title: "Heuristic Evaluation & Figma Design Systems",
        skills: ["Figma", "UI Design", "Heuristic Review"],
        interest: "UI/UX Design",
        date: "June 10, 2026 • 3:00 PM",
        type: "Workshop",
        speaker: "Speaker: Senior UX Lead",
      },
    ];

    return defaultEvents.map((e) => ({
      ...e,
      joined: discoverStore.isJoined("event", e.id),
    }));
  }, [discoverStates]);

  const toggleJoinCommunity = (id: string) => {
    discoverStore.toggleJoined("community", id);
  };

  const toggleJoinChat = (id: string) => {
    discoverStore.toggleJoined("chat", id);
  };

  const toggleRSVPEvent = (id: string) => {
    discoverStore.toggleJoined("event", id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const filteredCommunities = communities.filter(
    (c) =>
      (searchTerm === "" || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.desc.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeInterestFilter === "All" || c.category === activeInterestFilter)
  );

  const filteredChats = chats.filter(
    (c) =>
      (searchTerm === "" || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeInterestFilter === "All" || c.category === activeInterestFilter)
  );

  const filteredEvents = events.filter(
    (e) =>
      (searchTerm === "" || e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (activeInterestFilter === "All" || e.interest === activeInterestFilter)
  );

  const categories = ["All", "Tech & Coding", "Artificial Intelligence", "UI/UX Design", "Career Growth"];

  return (
    <AnimatedPage className="container py-8 md:py-10 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Discover Hub</div>
        <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">Find Opportunities</h1>
        <p className="text-sm text-muted-foreground">
          Join student-led communities, find active cohort group chats, and attend skills-based events.
        </p>
      </div>

      {/* Search & Category Filter Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search communities, chat groups, skills (e.g. Mistral, Figma)..."
            className="h-12 rounded-full border-2 pl-11 pr-4 text-sm focus-visible:ring-secondary"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground hidden sm:block" />
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveInterestFilter(cat)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-extrabold whitespace-nowrap transition-all border-2",
                activeInterestFilter === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted-foreground hover:border-foreground/30",
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="communities" className="w-full">
        <TabsList className="flex w-full sm:w-fit justify-start gap-1 rounded-2xl border-2 border-border bg-surface p-1">
          <TabsTrigger value="communities" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
            <Users className="h-4 w-4 mr-2 inline" /> Communities
          </TabsTrigger>
          <TabsTrigger value="group-chats" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
            <MessageSquare className="h-4 w-4 mr-2 inline" /> Group Chats
          </TabsTrigger>
          <TabsTrigger value="events" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
            <Calendar className="h-4 w-4 mr-2 inline" /> Upcoming Events
          </TabsTrigger>
        </TabsList>

        {/* Communities Content */}
        <TabsContent value="communities" className="mt-6 focus-visible:outline-none">
          {filteredCommunities.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border-2 border-dashed border-border bg-surface p-12 text-center"
            >
              <div className="text-4xl">🐸</div>
              <h3 className="mt-3 font-display text-xl font-extrabold">No communities found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try clearing your filters or changing search keywords.</p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 md:grid-cols-2"
            >
              {filteredCommunities.map((c) => (
                <motion.div
                  key={c.id}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  className="rounded-3xl border-2 border-border bg-surface p-6 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-secondary/15 border border-secondary/20 px-3 py-1 text-[10px] font-extrabold text-foreground uppercase tracking-wide">
                        {c.type}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {c.members} members
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-extrabold text-foreground">{c.name}</h3>
                      <span className="text-xs font-bold text-muted-foreground uppercase">{c.category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-semibold">Weekly events held</span>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => toggleJoinCommunity(c.id)}
                        variant={c.joined ? "outline" : "hero"}
                        size="sm"
                        className="font-bold gap-1 transition-all"
                      >
                        {c.joined ? (
                          <>
                            <Check className="h-4 w-4" /> Joined
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" /> Join Community
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        {/* Group Chats Content */}
        <TabsContent value="group-chats" className="mt-6 focus-visible:outline-none">
          {filteredChats.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border-2 border-dashed border-border bg-surface p-12 text-center"
            >
              <div className="text-4xl">💬</div>
              <h3 className="mt-3 font-display text-xl font-extrabold">No active group chats</h3>
              <p className="mt-1 text-sm text-muted-foreground">Adjust your filters to see active chats.</p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 md:grid-cols-2"
            >
              {filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  className="rounded-3xl border-2 border-border bg-surface p-6 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[10px] font-extrabold text-foreground uppercase tracking-wide">
                        {chat.platform}
                      </span>
                      <span className="text-xs font-bold text-coral flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-coral"></span>
                        </span>
                        {chat.activeNow} typing now
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-black text-foreground">{chat.name}</h3>
                      <span className="text-xs font-bold text-muted-foreground uppercase">{chat.category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{chat.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-semibold">Requires student verification</span>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => toggleJoinChat(chat.id)}
                        variant={chat.joined ? "outline" : "hero"}
                        size="sm"
                        className="font-bold gap-1 transition-all"
                      >
                        {chat.joined ? (
                          <>
                            <Check className="h-4 w-4" /> Joined
                          </>
                        ) : (
                          <>
                            <MessageCircle className="h-4 w-4" /> Enter Chatroom
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        {/* Upcoming Events Content */}
        <TabsContent value="events" className="mt-6 focus-visible:outline-none">
          {filteredEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border-2 border-dashed border-border bg-surface p-12 text-center"
            >
              <div className="text-4xl">📅</div>
              <h3 className="mt-3 font-display text-xl font-extrabold">No interest-based events</h3>
              <p className="mt-1 text-sm text-muted-foreground">Adjust your search or look at other categories.</p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6"
            >
              {filteredEvents.map((e) => (
                <motion.div
                  key={e.id}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  className="rounded-3xl border-2 border-border bg-surface p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-secondary/15 border border-secondary/20 px-2.5 py-0.5 text-[9px] font-extrabold text-foreground uppercase tracking-wide">
                        {e.interest}
                      </span>
                      <span className="rounded-full bg-coral/10 border border-coral/25 px-2.5 py-0.5 text-[9px] font-extrabold text-coral uppercase tracking-wide">
                        {e.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-2xl font-extrabold text-foreground leading-tight">{e.title}</h3>
                      <p className="text-sm font-semibold text-muted-foreground mt-0.5">{e.speaker}</p>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {e.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-background border border-border px-2 py-0.5 text-[10px] font-extrabold text-muted-foreground"
                        >
                          +{skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                    <div className="space-y-1 md:text-right">
                      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 md:justify-end">
                        <Calendar className="h-4 w-4" /> {e.date}
                      </p>
                      <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 md:justify-end">
                        <MapPin className="h-4 w-4" /> Brisbane Hall / Hybrid
                      </p>
                    </div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => toggleRSVPEvent(e.id)}
                        variant={e.joined ? "outline" : "hero"}
                        size="lg"
                        className="font-bold min-w-[130px] transition-all"
                      >
                        {e.joined ? "Going ✓" : "RSVP & Add to Plan"}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </AnimatedPage>
  );
};

export default Discover;
