import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index.tsx";
import Quiz from "./pages/Quiz.tsx";
import Results from "./pages/Results.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Discover from "./pages/Discover.tsx";
import Plans from "./pages/Plans.tsx";
import Roadmap from "./pages/Roadmap.tsx";
import AboutMe from "./pages/AboutMe.tsx";
import Chat from "./pages/Chat.tsx";
import JourneyLog from "./pages/JourneyLog.tsx";
import ExperienceDetail from "./pages/ExperienceDetail.tsx";
import NewExperience from "./pages/NewExperience.tsx";
import CareerVision from "./pages/CareerVision.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/chat" element={<Chat />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/journey" element={<JourneyLog />} />
            <Route path="/journey/new" element={<NewExperience />} />
            <Route path="/journey/:id" element={<ExperienceDetail />} />
            <Route path="/career-vision" element={<CareerVision />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
