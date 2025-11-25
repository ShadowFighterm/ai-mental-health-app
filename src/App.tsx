import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { MainInteractionScreen } from "./components/MainInteractionScreen";
import { BreathingExerciseScreen } from "./components/BreathingExerciseScreen";
import { SessionSummaryScreen } from "./components/SessionSummaryScreen";

type Screen = "home" | "session" | "breathing" | "summary";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <WelcomeScreen onStartSession={() => setCurrentScreen("session")} />;
      case "session":
        return <MainInteractionScreen />;
      case "breathing":
        return <BreathingExerciseScreen onEnd={() => setCurrentScreen("summary")} />;
      case "summary":
        return <SessionSummaryScreen onStartNewSession={() => setCurrentScreen("session")} />;
      default:
        return <WelcomeScreen onStartSession={() => setCurrentScreen("session")} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation activeScreen={currentScreen} onNavigate={(screen) => setCurrentScreen(screen as Screen)} />
      {renderScreen()}
    </div>
  );
}
