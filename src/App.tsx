import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import GamePage from "./pages/Game";
import About from "./pages/About";
import Tutorial from "./pages/Tutorial";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DataSessions from "./pages/dashboard/DataSessions";
import QoEAnalysis from "./pages/dashboard/QoEAnalysis";
import LatencyStats from "./pages/dashboard/LatencyStats";
import DashboardSettings from "./pages/dashboard/DashboardSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="sessions" element={<DataSessions />} />
            <Route path="qoe" element={<QoEAnalysis />} />
            <Route path="latency" element={<LatencyStats />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
