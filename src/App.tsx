import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataProvider } from "@/contexts/DataContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import RequireAuth from "@/components/RequireAuth";
import PageSkeleton from "@/components/PageSkeleton";
import Landing from "./pages/Landing";
import FeaturesPage from "./pages/FeaturesPage";
import Auth from "./pages/Auth";
import DashboardLayout from "./pages/DashboardLayout";
import NotFound from "./pages/NotFound";

// Lazy-load heavy / dashboard pages so the initial bundle stays light.
const WorkflowPage = lazy(() => import("./pages/WorkflowPage"));
const ToolsHubPage = lazy(() => import("./pages/ToolsHubPage"));
const DashboardHome = lazy(() => import("./pages/DashboardHome"));
const PreviewPage = lazy(() => import("./pages/PreviewPage"));
const CleanPage = lazy(() => import("./pages/CleanPage"));
const ChartsPage = lazy(() => import("./pages/ChartsPage"));
const CustomChartPage = lazy(() => import("./pages/CustomChartPage"));
const InsightsPage = lazy(() => import("./pages/InsightsPage"));
const ExportPage = lazy(() => import("./pages/ExportPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const ImportDataPage = lazy(() => import("./pages/ImportDataPage"));
const ForecastingPage = lazy(() => import("./pages/ForecastingPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route
                path="/workflow"
                element={
                  <RequireAuth>
                    <Suspense fallback={<PageSkeleton />}>
                      <WorkflowPage />
                    </Suspense>
                  </RequireAuth>
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <DashboardLayout />
                  </RequireAuth>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <ToolsHubPage />
                    </Suspense>
                  }
                />
                <Route
                  path="overview"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <DashboardHome />
                    </Suspense>
                  }
                />
                <Route
                  path="import"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <ImportDataPage />
                    </Suspense>
                  }
                />
                <Route
                  path="upload"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <ImportDataPage />
                    </Suspense>
                  }
                />
                <Route
                  path="connect"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <ImportDataPage />
                    </Suspense>
                  }
                />
                <Route
                  path="preview"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <PreviewPage />
                    </Suspense>
                  }
                />
                <Route
                  path="clean"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <CleanPage />
                    </Suspense>
                  }
                />
                <Route
                  path="charts"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <ChartsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="custom-chart"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <CustomChartPage />
                    </Suspense>
                  }
                />
                <Route
                  path="insights"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <InsightsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="forecasting"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <ForecastingPage />
                    </Suspense>
                  }
                />
                <Route
                  path="export"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <ExportPage />
                    </Suspense>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <SettingsPage />
                    </Suspense>
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
