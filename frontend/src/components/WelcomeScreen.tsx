import { Sparkles, Info, Shield } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface WelcomeScreenProps {
  onStartSession: () => void;
}

export function WelcomeScreen({ onStartSession }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#E8EEF5]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-sm mb-8">
            <Sparkles className="w-5 h-5 text-[#C5B8F1]" />
            <span className="text-gray-600">Your personal wellness companion</span>
          </div>
          
          <h1 className="mb-6 bg-gradient-to-r from-[#A7C7E7] to-[#C5B8F1] bg-clip-text text-transparent">
            AI Mental Fitness Coach
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Analyze your emotional state and improve your wellbeing through voice, text, and facial expression analysis.
          </p>

          {/* Illustration */}
          <div className="relative w-full max-w-2xl mx-auto mb-12 rounded-3xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1722094250550-4993fa28a51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwY2FsbSUyMHdlbGxuZXNzfGVufDF8fHx8MTc2NDAwNjgwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Calming wellness illustration"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent"></div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onStartSession}
            className="px-12 py-5 bg-gradient-to-r from-[#A7C7E7] to-[#C5B8F1] text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Start Session
          </button>

          {/* Secondary Actions */}
          <div className="flex gap-6 justify-center mt-8">
            <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-gray-700">
              <Info className="w-5 h-5" />
              How it works
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-gray-700">
              <Shield className="w-5 h-5" />
              Privacy
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#A7C7E7]/20 flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="mb-3">Text Analysis</h3>
            <p className="text-gray-600">Express your thoughts through writing and receive instant emotional insights.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#C5B8F1]/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🎤</span>
            </div>
            <h3 className="mb-3">Voice Detection</h3>
            <p className="text-gray-600">Speak naturally and let AI analyze the emotion in your voice.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#6ECB63]/20 flex items-center justify-center mb-4">
              <span className="text-2xl">📸</span>
            </div>
            <h3 className="mb-3">Facial Recognition</h3>
            <p className="text-gray-600">Capture your expression for comprehensive emotion analysis.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
