import { Brain } from "lucide-react";

interface NavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function Navigation({ activeScreen, onNavigate }: NavigationProps) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "session", label: "Session" },
    { id: "breathing", label: "Breathing" },
    { id: "summary", label: "Summary" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A7C7E7] to-[#C5B8F1] flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-800">AI Mental Fitness Coach</span>
          </div>
          
          <div className="flex gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeScreen === item.id
                    ? "bg-gradient-to-r from-[#A7C7E7] to-[#C5B8F1] text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
