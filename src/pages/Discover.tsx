import { Heart, MapPin, Search, SlidersHorizontal, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { mockUniversities } from "@/lib/mock-data";

const subjects = ["Computer Science", "Engineering", "Business", "Design", "Medicine", "Data Science", "Psychology"];
const formats = ["On-campus", "Online", "Hybrid"];

const Discover = () => {
  return (
    <div className="container py-8 md:py-10">
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Discover</div>
        <h1 className="mt-1 font-display text-3xl font-black md:text-4xl">Discover your future</h1>
        <p className="text-sm text-muted-foreground">Search universities, courses, scholarships, and more.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Try: SAT 1450 or 'affordable engineering Australia'"
          className="h-14 rounded-full border-2 pl-11 pr-4 text-base"
        />
      </div>

      <Tabs defaultValue="universities">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 rounded-full border-2 border-border bg-surface p-1">
          {["universities", "courses", "scholarships", "accommodation", "favorites"].map((t) => (
            <TabsTrigger key={t} value={t} className="rounded-full px-4 capitalize data-[state=active]:bg-secondary data-[state=active]:text-foreground">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="universities" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* Filters */}
            <aside className="space-y-5 rounded-3xl border-2 border-border bg-surface p-5 h-fit lg:sticky lg:top-20">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <h3 className="font-display text-base font-extrabold">Filters</h3>
              </div>

              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Budget</div>
                <Slider defaultValue={[40]} max={100} step={5} />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>$0</span><span>$80k+</span></div>
              </div>

              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Country</div>
                <select className="w-full rounded-xl border-2 border-border bg-background px-3 py-2 text-sm font-semibold">
                  <option>Anywhere</option><option>Australia</option><option>Canada</option><option>Germany</option><option>UK</option>
                </select>
              </div>

              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</div>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map((s) => (
                    <span key={s} className="rounded-full border-2 border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:border-secondary hover:text-foreground cursor-pointer">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Format</div>
                <div className="space-y-2">
                  {formats.map((f) => (
                    <label key={f} className="flex items-center gap-2 text-sm font-semibold">
                      <Checkbox /> {f}
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">Reset filters</Button>
            </aside>

            {/* Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {mockUniversities.map((u) => (
                <article key={u.id} className="group rounded-3xl border-2 border-border bg-surface p-5 transition-transform hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">{u.tag}</span>
                    <button aria-label="Favorite" className="text-muted-foreground hover:text-coral"><Heart className="h-5 w-5" /></button>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-extrabold leading-tight">{u.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {u.city}, {u.country}
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary p-3 text-primary-foreground">
                    <div>
                      <div className="text-[10px] font-bold uppercase opacity-70">Future-proof</div>
                      <div className="font-display text-xl font-black">{u.score}<span className="text-xs opacity-60">/100</span></div>
                    </div>
                    <TrendingUp className="h-6 w-6 opacity-80" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </TabsContent>

        {["courses", "scholarships", "accommodation", "favorites"].map((t) => (
          <TabsContent key={t} value={t} className="mt-6">
            <div className="rounded-3xl border-2 border-dashed border-border bg-surface p-12 text-center">
              <div className="text-4xl">🐸</div>
              <h3 className="mt-3 font-display text-xl font-extrabold capitalize">{t} coming soon</h3>
              <p className="mt-1 text-sm text-muted-foreground">Jumpy is gathering the best {t} for you.</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Discover;
