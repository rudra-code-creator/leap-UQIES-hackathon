import { useState, useEffect, useRef } from "react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Brain, Sparkles, Send, RefreshCw, Key, Plus, Upload, FileText, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Jumpy } from "@/components/Jumpy";
import { useExperiences } from "@/lib/experiences-store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { roadmapStore } from "@/lib/roadmap-store";

interface JobPrediction {
  title: string;
  score: number;
  reason: string;
  skillsNeeded: string[];
}

interface Message {
  sender: "user" | "jumpy";
  text: string;
  timestamp: string;
  isRoadmap?: boolean;
  roadmapSteps?: string[];
}

const CareerVision = () => {
  const experiences = useExperiences();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mistral API State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("mistral_api_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Career Predictor State
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState<JobPrediction[] | null>(null);

  // Chat Coach State
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "jumpy",
      text: "Ribbit! 🐸 I'm Jumpy, your career journey buddy and brand coach. How can I help you take your next leap today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Selected events to feed into AI
  const attendedEvents = experiences.filter(e => e.type === "Event" || e.type === "Workshop" || e.type === "Competition");
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(() => attendedEvents.map(e => e.id));

  // Resume Roaster State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isRoasting, setIsRoasting] = useState(false);
  const [roastResult, setRoastResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleEventSelection = (id: string) => {
    setSelectedEventIds(prev =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const handleSaveApiKey = () => {
    localStorage.setItem("mistral_api_key", apiKey);
    setShowKeyInput(false);
    toast({
      title: "API Key Saved",
      description: "Mistral API Key updated. Requests will now go to Mistral AI.",
    });
  };

  // Mistral AI Live Request
  const callMistralAPI = async (prompt: string): Promise<string> => {
    if (!apiKey) throw new Error("No API Key");

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "open-mixtral-8x7b",
        messages: [
          {
            role: "system",
            content: "You are Jumpy, a career vision coach assistant. Return concise responses. If predicting jobs, output a JSON array of 5 jobs. Format: [{\"title\":\"Job Title\",\"score\":90,\"reason\":\"Why based on prompt details\",\"skillsNeeded\":[\"Skill1\",\"Skill2\"]}]",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.message || "Failed to contact Mistral API");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  // Run Job Predictor
  const runPredictor = async () => {
    setIsPredicting(true);
    const selectedEventsText = experiences
      .filter(e => selectedEventIds.includes(e.id))
      .map(e => `${e.title} (${e.skills.join(", ")})`)
      .join("; ");

    const prompt = `Based on these attended events and workshops: "${selectedEventsText}". Predict the top 5 job titles the student is most inclined to do. Provide a match score (0-100), a short reason, and key skills to focus on. Ensure the response format is exactly JSON: [{"title":"Job Title","score":95,"reason":"why","skillsNeeded":["skill1","skill2"]}]`;

    try {
      if (apiKey) {
        const rawResult = await callMistralAPI(prompt);
        // Find JSON block in the output
        const jsonStart = rawResult.indexOf("[");
        const jsonEnd = rawResult.lastIndexOf("]") + 1;
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const parsed = JSON.parse(rawResult.substring(jsonStart, jsonEnd)) as JobPrediction[];
          setPredictions(parsed);
        } else {
          throw new Error("Could not parse JSON output from AI");
        }
      } else {
        // Fallback Premium Simulation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Custom logic to reflect logged events
        const hasAI = experiences.some(e => e.skills.some(s => s.toLowerCase().includes("ai") || s.toLowerCase().includes("arduino")));
        const hasWeb = experiences.some(e => e.skills.some(s => s.toLowerCase().includes("react") || s.toLowerCase().includes("typescript")));

        const mockResults: JobPrediction[] = [
          {
            title: hasAI ? "Generative AI Solutions Architect" : "AI Integration Engineer",
            score: hasAI ? 95 : 82,
            reason: "Driven by your participation in AI workshops and hackathons, showing a strong capability for integrating complex LLM workflows.",
            skillsNeeded: ["Prompt Engineering", "Python", "Mistral APIs", "Vector Databases"],
          },
          {
            title: hasWeb ? "Front-End Developer & UI Engineer" : "Full-Stack Software Engineer",
            score: hasWeb ? 91 : 85,
            reason: "Your logged experiences in project creation (e.g., Studyflow) and React coding show strong layout and functional application building skills.",
            skillsNeeded: ["Vite", "TypeScript", "React State Management", "Tailwind CSS"],
          },
          {
            title: "Technical Product Manager",
            score: 78,
            reason: "By presenting at summits and organizing team structures at hackathons, you display crucial leadership and feature-scoping abilities.",
            skillsNeeded: ["Sprint Planning", "Market Analytics", "UX Prototyping", "Public Pitching"],
          },
          {
            title: "Developer Advocate",
            score: 74,
            reason: "You have a solid track record of participating in networking events and volunteering, signifying high emotional intelligence and tech communication skills.",
            skillsNeeded: ["Community Building", "Technical Writing", "Presentation Skills", "Content Creation"],
          },
          {
            title: "Systems & Security Analyst",
            score: 68,
            reason: "Based on hardware prototyping and debugging experiences, you show logical reasoning and low-level understanding of systems.",
            skillsNeeded: ["Linux Shell", "Arduino Debugging", "Network Topologies", "Threat Analysis"],
          },
        ];
        setPredictions(mockResults);
      }
      toast({
        title: "Predictions Completed",
        description: apiKey ? "Real-time Mistral AI job prediction completed!" : "Career prediction simulation completed!",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: err.message || "Please check your Mistral API key and network connection.",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  // Coaching Chat actions
  const sendChatMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setChatInput("");
    setIsTyping(true);

    try {
      if (apiKey) {
        // Real Mistral Chat
        const selectedEventsText = experiences.map(e => e.title).join(", ");
        const fullPrompt = `The student is asking: "${textToSend}". Their logged achievements are: [${selectedEventsText}]. Reply to them as Jumpy, their friendly career consultant buddy. Keep the reply to under 3 sentences. If they ask to generate a roadmap or milestones, include a section: "[ROADMAP_STEPS]: Step 1; Step 2; Step 3" at the very end of your message.`;
        
        const rawReply = await callMistralAPI(fullPrompt);
        
        let displayReply = rawReply;
        let roadmapSteps: string[] = [];
        const index = rawResultIndex(rawReply);
        
        if (index !== -1) {
          displayReply = rawReply.substring(0, index).trim();
          const stepsStr = rawReply.substring(index + "[ROADMAP_STEPS]:".length).trim();
          roadmapSteps = stepsStr.split(";").map(s => s.trim()).filter(Boolean);
        }

        setMessages(prev => [
          ...prev,
          {
            sender: "jumpy",
            text: displayReply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isRoadmap: roadmapSteps.length > 0,
            roadmapSteps,
          },
        ]);
      } else {
        // Coaching Chat Fallback Mock replies
        await new Promise(resolve => setTimeout(resolve, 1500));
        let replyText = "";
        let roadmapSteps: string[] = [];

        if (textToSend.toLowerCase().includes("passion") || textToSend.toLowerCase().includes("explore")) {
          replyText = "Ribbit! Exploring passion is all about finding where what you love meets what people need. Let's look at your logged wins: you seem to enjoy hands-on building (like Arduino & Hackathons). Have you considered hosting a developer build-session to test your coaching abilities?";
        } else if (textToSend.toLowerCase().includes("consulting") || textToSend.toLowerCase().includes("career")) {
          replyText = "Based on your tech-focused portfolio, you are positioned well for high-growth tech positions. I suggest focusing on building your personal brand online—turning those hackathon logs into LinkedIn writeups is key!";
        } else if (textToSend.toLowerCase().includes("event") || textToSend.toLowerCase().includes("recommend")) {
          replyText = "I highly recommend attending the upcoming 'Mistral AI Developer Workshop' or joining the local 'Brisbane AI Builders' meetup to match your interest in large language models.";
        } else if (textToSend.toLowerCase().includes("roadmap") || textToSend.toLowerCase().includes("milestone")) {
          replyText = "Ribbit! I've designed a specialized brand roadmap for you. You can apply these milestones directly to your planner:";
          roadmapSteps = [
            "Log your next 3 tech experiences in detail",
            "Write a blog post outline in Content Studio",
            "Connect with 5 local developers on LinkedIn",
            "Publish your personal portfolio website link in bio"
          ];
        } else {
          replyText = "Great point! Taking the leap is all about combining active building with strategic networking. Try joining one of the Discover communities to leverage your skills!";
        }

        setMessages(prev => [
          ...prev,
          {
            sender: "jumpy",
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isRoadmap: roadmapSteps.length > 0,
            roadmapSteps,
          },
        ]);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: "jumpy",
          text: "Ribbit... I hit an error contacting my Mistral brain cells. Let me know if your API Key is correct!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const rawResultIndex = (reply: string) => {
    return reply.indexOf("[ROADMAP_STEPS]:");
  };

  const addRoadmapStepsToPlanner = async (steps: string[]) => {
    const newTasks = steps.map((s) => ({
      task: s,
      timeframe: "week" as const,
      dueDate: "From Coach",
    }));

    await roadmapStore.addPlannerTasks(newTasks);

    toast({
      title: "Roadmap steps added!",
      description: `${steps.length} coaching steps imported to your Roadmap Planner.`,
    });
  };

  // Resume Roaster – uses VITE_MISTRAL_AI_RESUME_ROASTER env key
  const roastResume = async () => {
    if (!resumeFile) return;
    setIsRoasting(true);
    setRoastResult(null);
    const roasterKey = (import.meta.env.VITE_MISTRAL_AI_RESUME_ROASTER as string | undefined) || apiKey;
    try {
      let resumeContent = "";
      if (resumeFile.type === "text/plain") {
        resumeContent = await resumeFile.text();
      } else {
        resumeContent = `[File: ${resumeFile.name} — binary PDF/DOCX. Roast based on typical weaknesses of a fresh graduate or student resume applying for tech roles.]`;
      }
      if (roasterKey) {
        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${roasterKey}` },
          body: JSON.stringify({
            model: "open-mixtral-8x7b",
            messages: [
              { role: "system", content: "You are the AI Resume Roaster — a brutally honest, hilariously savage career critic. Find every weakness, gap, buzzword, and embarrassing section in the resume and ROAST it mercilessly with wit and sarcasm. Be funny but genuinely constructive at the end. Format your response as 3-4 roast paragraphs, then a section titled '🔥 Redemption Arc (Fix These):' with 3 bullet-point tips." },
              { role: "user", content: `Roast this resume:\n\n${resumeContent}` },
            ],
          }),
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error((errData as any)?.message || "Mistral API error");
        }
        const data = await response.json();
        setRoastResult(data.choices[0].message.content);
      } else {
        await new Promise(r => setTimeout(r, 2500));
        setRoastResult(`🔥 **Roasting: ${resumeFile.name}** 🔥\n\nOh wow, where do I even begin? Your "Objective" statement reads like it was written in 2003 and left to marinate in mediocrity. "Seeking a challenging role to grow my skills" — congratulations, you've described every human on the planet.\n\nYour skills section lists Microsoft Word and Google Docs. Bold strategy listing software your grandmother has used since 1998. Recruiters are absolutely electrified by that level of innovation.\n\nThose 4-month internships look less like a career trajectory and more like someone who gets bored easily. The gaps between them are doing a lot of heavy lifting.\n\nNo LinkedIn, no GitHub, no portfolio? In 2025? We might as well have found this resume in a time capsule.\n\n🔥 Redemption Arc (Fix These):\n• Replace your Objective with a punchy 2-line Professional Summary tailored to the role.\n• Add quantified achievements — "Increased conversion by 23%" beats "Helped with marketing tasks".\n• Link your GitHub, portfolio, or LinkedIn — let the work do the talking.`);
      }
      toast({ title: "Roast complete! 🔥", description: "Your resume has been thoroughly incinerated." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Roast Failed", description: err.message || "Could not contact Mistral API." });
    } finally {
      setIsRoasting(false);
    }
  };

  return (
    <AnimatedPage className="container py-8 md:py-10 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vision Builder</div>
          <h1 className="mt-1 font-display text-3xl font-black md:text-4xl flex items-center gap-2">
            Career Vision & Brand Coaching <Brain className="h-7 w-7 text-secondary" />
          </h1>
          <p className="text-sm text-muted-foreground">
            Leverage Mistral AI to map your attended events to optimal job roles and consult with Jumpy, your career consultant buddy.
          </p>
        </div>

        {/* API Settings */}
        <div className="relative shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="font-bold gap-2 text-xs"
          >
            <Key className="h-4 w-4 text-muted-foreground" />
            {apiKey ? "Mistral API: Configured ✓" : "Configure Mistral API"}
          </Button>
          
          {showKeyInput && (
            <div className="absolute right-0 mt-2 p-4 bg-surface border-2 border-border rounded-2xl shadow-xl w-72 z-50 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Mistral API Key</label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your Mistral Key..."
                  className="h-9 text-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveApiKey} size="sm" className="flex-1 font-bold text-xs">
                  Save Key
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem("mistral_api_key");
                    setApiKey("");
                    setShowKeyInput(false);
                    toast({ title: "Key Cleared", description: "Using built-in simulation fallback." });
                  }}
                  variant="outline"
                  size="sm"
                  className="font-bold text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subsection Tabs */}
      <Tabs defaultValue="predictor" className="w-full">
        <TabsList className="flex w-full sm:w-fit justify-start gap-1 rounded-2xl border-2 border-border bg-surface p-1 flex-wrap font-display font-bold">
          <TabsTrigger value="predictor" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
            <Sparkles className="h-4 w-4 mr-2 inline" /> AI Career Predictor
          </TabsTrigger>
          <TabsTrigger value="coach" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
            🐸 Jumpy Buddy Coach
          </TabsTrigger>
          <TabsTrigger value="roaster" className="rounded-xl px-4 py-2 font-display text-sm font-bold data-[state=active]:bg-foreground data-[state=active]:text-background transition-all">
            <Flame className="h-4 w-4 mr-2 inline" /> AI Resume Roaster 🔥
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: AI Career Predictor */}
        <TabsContent value="predictor" className="mt-6 focus-visible:outline-none">
          <section className="rounded-3xl border-2 border-border bg-surface p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Sparkles className="h-5 w-5 text-coral animate-pulse" />
                <h2 className="font-display text-lg font-black text-foreground">AI Career Predictor</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Select which logged events or workshops to feed into the Mistral model to predict your top 5 inclined jobs.
              </p>
              {/* Event checklist */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {attendedEvents.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-xl bg-background">
                    No events logged yet. Go to Journey Log to add wins!
                  </div>
                ) : (
                  attendedEvents.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => toggleEventSelection(e.id)}
                      className={cn(
                        "flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all text-sm font-semibold",
                        selectedEventIds.includes(e.id) ? "border-secondary bg-secondary/5 text-foreground" : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      <Checkbox
                        checked={selectedEventIds.includes(e.id)}
                        onCheckedChange={() => toggleEventSelection(e.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="truncate flex-1">{e.title}</span>
                    </div>
                  ))
                )}
              </div>
              {/* Predictions Result */}
              {predictions === null ? (
                <div className="rounded-2xl border-2 border-dashed border-border bg-background p-10 text-center space-y-2">
                  <Brain className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                  <h3 className="text-sm font-bold text-muted-foreground uppercase">Prediction Ready</h3>
                  <p className="text-sm text-muted-foreground">Click Generate to scan your profile.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Top 5 Inclined Jobs</h3>
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {predictions.map((p, index) => (
                      <div key={p.title} className="p-3 rounded-2xl bg-background border border-border space-y-2">
                        <div className="flex justify-between items-center text-sm font-black">
                          <span className="text-foreground">#{index + 1} {p.title}</span>
                          <span className="text-secondary">{p.score}% match</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-secondary" style={{ width: `${p.score}%` }} />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{p.reason}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.skillsNeeded.map(s => (
                            <span key={s} className="rounded bg-surface px-1.5 py-0.5 text-sm font-bold text-muted-foreground border border-border">{s}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-border">
              <Button onClick={runPredictor} disabled={isPredicting || selectedEventIds.length === 0} variant="hero" className="w-full font-black py-5 gap-2">
                {isPredicting ? <><RefreshCw className="h-4 w-4 animate-spin" /> Analysing Skills...</> : <><Brain className="h-4 w-4" /> Run Mistral Career Predictor</>}
              </Button>
            </div>
          </section>
        </TabsContent>

        {/* Tab 2: Jumpy Buddy Coach */}
        <TabsContent value="coach" className="mt-6 focus-visible:outline-none">
          <section className="rounded-3xl border-2 border-border bg-surface p-5 shadow-sm flex flex-col justify-between min-h-[500px]">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="p-2 bg-secondary/15 rounded-full border border-secondary/25">
                <Jumpy size="xs" animate="float" />
              </div>
              <div>
                <h2 className="font-display text-lg font-black text-foreground">Jumpy Buddy Coach</h2>
                <p className="text-sm text-muted-foreground">Your career &amp; personal brand consultant buddy</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-2 max-h-[400px] min-h-[200px]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-3 max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed",
                    m.sender === "user"
                      ? "ml-auto bg-foreground text-background font-semibold"
                      : "bg-background border border-border text-foreground flex-col"
                  )}
                >
                  {m.sender === "jumpy" && (
                    <div className="flex items-center gap-2 mb-1 border-b border-border/10 pb-1 shrink-0">
                      <Jumpy size="xs" animate="none" />
                      <span className="font-display text-sm font-black">Jumpy</span>
                      <span className="text-sm text-muted-foreground font-normal ml-auto">{m.timestamp}</span>
                    </div>
                  )}
                  <span>{m.text}</span>
                  {m.isRoadmap && m.roadmapSteps && (
                    <div className="mt-3 p-3 rounded-xl bg-surface border border-border space-y-2">
                      <p className="text-sm font-extrabold text-foreground">Suggested Roadmap Steps:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4 font-semibold">
                        {m.roadmapSteps.map((step, sIdx) => <li key={sIdx}>{step}</li>)}
                      </ul>
                      <Button onClick={() => addRoadmapStepsToPlanner(m.roadmapSteps!)} variant="hero" size="sm" className="w-full text-sm font-bold gap-1 mt-1">
                        <Plus className="h-4 w-4" /> Apply Steps to My Planner
                      </Button>
                    </div>
                  )}
                  {m.sender === "user" && (
                    <span className="text-sm opacity-75 self-end block mt-1">{m.timestamp}</span>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 items-center bg-background border border-border text-muted-foreground rounded-2xl p-3 max-w-[120px]">
                  <Jumpy size="xs" animate="hop" />
                  <span className="text-sm font-bold animate-pulse">Typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => sendChatMessage("Help me explore my passions & skills")} className="rounded-full border border-border bg-background px-3 py-1 text-sm font-bold text-muted-foreground hover:border-secondary hover:text-foreground">
                  Passion Exploration 🔍
                </button>
                <button onClick={() => sendChatMessage("Suggest upcoming events for my profile")} className="rounded-full border border-border bg-background px-3 py-1 text-sm font-bold text-muted-foreground hover:border-secondary hover:text-foreground">
                  Event Recommendation 📅
                </button>
                <button onClick={() => sendChatMessage("Generate a personal branding roadmap")} className="rounded-full border border-border bg-background px-3 py-1 text-sm font-bold text-muted-foreground hover:border-secondary hover:text-foreground">
                  Generate Roadmap 🛣️
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); sendChatMessage(); }} className="flex gap-2">
                <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask Jumpy for career consulting & branding tips..." className="h-11 rounded-full border-2 text-sm" />
                <Button type="submit" variant="hero" className="rounded-full h-11 w-11 shrink-0 p-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </section>
        </TabsContent>

        {/* Tab 3: AI Resume Roaster */}
        <TabsContent value="roaster" className="mt-6 focus-visible:outline-none">
          <section className="rounded-3xl border-2 border-border bg-surface p-5 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Flame className="h-5 w-5 text-coral animate-pulse" />
              <h2 className="font-display text-lg font-black text-foreground">AI Resume Roaster 🔥</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload your resume and let our brutally honest AI tear it apart — then tell you how to fix it. Supports PDF, DOCX, and TXT files.
            </p>

            {/* Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all",
                resumeFile ? "border-secondary bg-secondary/5" : "border-border bg-background hover:border-secondary/60 hover:bg-secondary/5"
              )}
            >
              {resumeFile ? (
                <>
                  <FileText className="h-10 w-10 text-secondary" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">{resumeFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(resumeFile.size / 1024).toFixed(1)} KB · Ready to roast</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-sm font-bold" onClick={(e) => { e.stopPropagation(); setResumeFile(null); setRoastResult(null); }}>
                    Remove file
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground/50" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">Click to upload your resume</p>
                    <p className="text-sm text-muted-foreground">PDF, DOCX, or TXT — max 5MB</p>
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setResumeFile(f); setRoastResult(null); }
                }}
              />
            </div>

            <Button
              onClick={roastResume}
              disabled={!resumeFile || isRoasting}
              variant="hero"
              className="w-full font-black py-5 gap-2"
            >
              {isRoasting ? <><RefreshCw className="h-4 w-4 animate-spin" /> Incinerating your resume...</> : <><Flame className="h-4 w-4" /> Roast My Resume 🔥</>}
            </Button>

            {/* Roast Output */}
            {roastResult && (
              <div className="rounded-2xl border-2 border-coral/30 bg-coral/5 p-5 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-coral/20">
                  <Flame className="h-5 w-5 text-coral" />
                  <h3 className="font-display text-sm font-black text-coral uppercase tracking-wide">Roast Results</h3>
                </div>
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-medium">{roastResult}</div>
              </div>
            )}
          </section>
        </TabsContent>
      </Tabs>
    </AnimatedPage>
  );
};


export default CareerVision;
