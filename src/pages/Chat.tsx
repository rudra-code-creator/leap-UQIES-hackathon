import { useState } from "react";
import { Send, Sparkles, SplitSquareHorizontal, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Jumpy } from "@/components/Jumpy";
import { ThemeToggle } from "@/components/ThemeToggle";
import { mockChatHistory, type ChatMessage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";

const prompts = [
  "Help me find scholarships",
  "What should I do first?",
  "Compare unis for CS",
  "Draft my personal statement",
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, from: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: `j-${Date.now()}`, from: "jumpy", text: "Great question! 🐸 (This is a mock reply — real Jumpy AI is coming soon.)" },
      ]);
    }, 600);
  };

  return (
    <AnimatedPage className="flex h-screen flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b-2 border-border bg-background px-4 py-3 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <Jumpy size="xs" animate="float" />
          <div>
            <div className="font-display text-base font-extrabold">Jumpy</div>
            <div className="text-[10px] font-bold uppercase text-secondary">● Online</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" className="hidden md:inline-flex"><SplitSquareHorizontal className="h-4 w-4" /> Split view</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-3xl space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    key={m.id} 
                    className={cn("flex gap-3", m.from === "user" && "flex-row-reverse")}
                  >
                    {m.from === "jumpy" && (
                      <motion.div whileHover={{ rotate: 10 }}>
                        <Jumpy size="xs" animate="none" />
                      </motion.div>
                    )}
                    {m.from === "user" && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-sm font-black text-foreground">A</div>
                    )}
                    <motion.div
                      layout
                      className={cn(
                        "max-w-[80%] rounded-2xl border-2 px-4 py-2.5 text-sm",
                        m.from === "jumpy" ? "border-border bg-surface text-foreground" : "border-primary bg-primary text-primary-foreground",
                      )}
                    >
                      {m.text}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {messages.length <= 3 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4"
                >
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <Sparkles className="h-3 w-3" /> Try asking
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prompts.map((p, index) => (
                      <motion.button
                        key={p}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => send(p)}
                        className="rounded-full border-2 border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-secondary hover:text-foreground transition-all"
                      >
                        {p}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="border-t-2 border-border bg-background px-4 py-3 shadow-inner">
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="mx-auto flex max-w-3xl gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Jumpy anything…"
                className="h-12 rounded-full border-2 px-5 transition-all focus-visible:ring-secondary"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button type="submit" variant="hero" size="lg" disabled={!input.trim()} className="rounded-full h-12 w-12 p-0 flex items-center justify-center">
                  <Send className="h-4 w-4" />
                </Button>
              </motion.div>
            </form>
          </div>
        </div>

        {/* Split panel (desktop) */}
        <aside className="hidden w-[40%] border-l-2 border-border bg-surface lg:block">
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <motion.div 
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <SplitSquareHorizontal className="h-10 w-10 text-muted-foreground" />
            </motion.div>
            <h3 className="mt-3 font-display text-lg font-extrabold">Split view</h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Pin a roadmap, plan, or document here while you chat with Jumpy. Coming soon.
            </p>
          </div>
        </aside>
      </div>
    </AnimatedPage>
  );
};

export default Chat;
