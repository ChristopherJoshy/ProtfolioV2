import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import { CustomCursor } from "@/components/ui/cursor";
import { useEffect, useState } from "react";
import { initializeFirebase } from "./lib/firebase";
import { useToast } from "@/hooks/use-toast";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Initialize Firebase
    try {
      const firebaseApp = initializeFirebase();
      if (firebaseApp) {
        console.log("Firebase initialized successfully");
        setFirebaseInitialized(true);
      }
    } catch (error) {
      console.error("Firebase initialization error:", error);
      toast({
        title: "Firebase Initialization Error",
        description: "There was an issue connecting to Firebase. Some features may not work properly.",
        variant: "destructive"
      });
    }
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <CustomCursor />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
