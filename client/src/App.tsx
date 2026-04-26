import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import QuoteList from "@/pages/QuoteList";

// Lazy load components for better performance
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const QuoteBuilderPage = lazy(() => import("@/components/QuoteBuilder"));
const QuoteDetailPage = lazy(() => import("@/pages/QuoteDetail"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboard"));
const AdminLoginPage = lazy(() => import("@/pages/AdminLogin"));
const SettingsPage = lazy(() => import("@/pages/Settings"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">Loading...</span>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Quote Management Routes */}
      <Route path="/quotes">
        {() => (
          <Suspense fallback={<LoadingSpinner />}>
            <QuoteList />
          </Suspense>
        )}
      </Route>
      <Route path="/quotes/:id">
        {(params) => (
          <Suspense fallback={<LoadingSpinner />}>
            <QuoteDetailPage />
          </Suspense>
        )}
      </Route>
      <Route path="/create-quote">
        {() => (
          <Suspense fallback={<LoadingSpinner />}>
            <div className="min-h-screen flex flex-col">
              <main className="flex-grow">
                <QuoteBuilderPage />
              </main>
            </div>
          </Suspense>
        )}
      </Route>
      
      {/* Settings Route */}
      <Route path="/settings">
        {() => (
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsPage />
          </Suspense>
        )}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login">
        {() => (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminLoginPage />
          </Suspense>
        )}
      </Route>
      <Route path="/admin/dashboard">
        {() => (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminDashboardPage />
          </Suspense>
        )}
      </Route>
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
