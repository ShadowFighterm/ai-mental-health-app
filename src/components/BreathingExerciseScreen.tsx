import { useState, useEffect } from "react";
import { X, Play, Pause } from "lucide-react";

interface BreathingExerciseScreenProps {
  onEnd?: () => void;
}

export function BreathingExerciseScreen({ onEnd }: BreathingExerciseScreenProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [countdown, setCountdown] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;
        
        // Move to next phase
        if (phase === "inhale") {
          setPhase("hold");
          return 4;
        } else if (phase === "hold") {
          setPhase("exhale");
          return 6;
        } else {
          setPhase("inhale");
          setCycles((c) => c + 1);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const getCircleScale = () => {
    if (phase === "inhale") return "scale-150";
    if (phase === "hold") return "scale-150";
    return "scale-100";
  };

  const getPhaseText = () => {
    if (phase === "inhale") return "Breathe In...";
    if (phase === "hold") return "Hold...";
    return "Breathe Out...";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A7C7E7] via-[#C5B8F1] to-[#A7C7E7] flex items-center justify-center relative overflow-hidden">
      {/* Background animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-white mb-4">Breathing Exercise</h2>
          <p className="text-white/80 text-lg">Follow the circle and breathe deeply</p>
        </div>

        {/* Breathing Circle */}
        <div className="relative mb-16">
          <div className="flex items-center justify-center">
            <div
              className={`w-48 h-48 rounded-full bg-white/30 backdrop-blur-lg border-4 border-white/50 shadow-2xl transition-all duration-[4000ms] ease-in-out ${
                isActive ? getCircleScale() : ""
              }`}
              style={{
                transitionDuration: phase === "exhale" ? "6000ms" : "4000ms"
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="text-white/90 text-xl mb-2">{getPhaseText()}</div>
                <div className="text-white text-5xl">{countdown}</div>
              </div>
            </div>
          </div>

          {/* Outer ring */}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-96 h-96 rounded-full border-2 border-white/20"></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => setIsActive(!isActive)}
            className="w-20 h-20 rounded-full bg-white text-[#A7C7E7] shadow-xl hover:scale-110 transition-all flex items-center justify-center"
          >
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          {/* Stats */}
          <div className="flex gap-8 text-white">
            <div className="text-center">
              <div className="text-3xl mb-1">{cycles}</div>
              <div className="text-sm text-white/70">Cycles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">{Math.floor((cycles * 14) / 60)}</div>
              <div className="text-sm text-white/70">Minutes</div>
            </div>
          </div>

          {/* End Exercise Button */}
          {onEnd && (
            <button
              onClick={onEnd}
              className="mt-8 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/30 transition-all flex items-center gap-2 border border-white/30"
            >
              <X className="w-5 h-5" />
              End Exercise
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-16 max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-white mb-4">How it works</h3>
            <div className="space-y-2 text-white/80 text-sm text-left">
              <p>• Inhale slowly for 4 seconds</p>
              <p>• Hold your breath for 4 seconds</p>
              <p>• Exhale slowly for 6 seconds</p>
              <p>• Repeat for best results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
