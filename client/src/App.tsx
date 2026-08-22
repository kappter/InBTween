import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ConversationProvider } from "./contexts/ConversationContext";
import Home from "./pages/Home";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <ConversationProvider>
          <TooltipProvider>
            <Toaster />
            <Home />
          </TooltipProvider>
        </ConversationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
