import { useState } from "react";
import { MessageSquare, Mic, Camera, Sparkles, TrendingUp, Lightbulb, Heart } from "lucide-react";

export function MainInteractionScreen() {
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Mock analysis results
  const [results] = useState({
    stressScore: 4.5,
    stressLevel: "medium",
    primaryEmotion: "Anxious",
    confidence: 78,
    textEmotion: "Worried",
    faceEmotion: "Neutral",
    tips: [
      "Take a 5-minute breathing break",
      "Practice mindfulness meditation",
      "Go for a short walk outside"
    ],
    quote: "You are not your thoughts. You are the observer of your thoughts."
  });

  const handleAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const getStressColor = (score: number) => {
    if (score < 4) return "#6ECB63";
    if (score < 7) return "#F7D060";
    return "#E57373";
  };

  const getStressEmoji = (score: number) => {
    if (score < 4) return "🙂";
    if (score < 7) return "😐";
    return "😟";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EEF5] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT PANEL - Input Methods */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-[#C5B8F1]" />
              <h2>Share Your Feelings</h2>
            </div>

            {/* Text Input Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#A7C7E7]/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#A7C7E7]" />
                </div>
                <h3>Type your thoughts</h3>
              </div>
              
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="How are you feeling today? What's on your mind?"
                className="w-full h-32 p-4 border-2 border-gray-100 rounded-xl resize-none focus:outline-none focus:border-[#A7C7E7] transition-colors"
              />
              
              <button className="mt-4 px-6 py-3 bg-[#A7C7E7] text-white rounded-xl hover:bg-[#8FB5D9] transition-all">
                Analyze Text
              </button>
            </div>

            {/* Voice Input Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#C5B8F1]/20 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-[#C5B8F1]" />
                </div>
                <h3>Speak your thoughts</h3>
              </div>
              
              <div className="flex flex-col items-center py-8">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-[#E57373] animate-pulse"
                      : "bg-[#C5B8F1] hover:bg-[#B5A5E1]"
                  }`}
                >
                  <Mic className="w-8 h-8 text-white" />
                </button>
                
                {/* Waveform visualization */}
                {isRecording && (
                  <div className="flex gap-1 mt-6">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-[#C5B8F1] rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 40 + 20}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <button className="w-full px-6 py-3 bg-[#C5B8F1] text-white rounded-xl hover:bg-[#B5A5E1] transition-all">
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
            </div>

            {/* Webcam Input Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#6ECB63]/20 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-[#6ECB63]" />
                </div>
                <h3>Capture your emotion</h3>
              </div>
              
              <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center mb-4">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Camera preview</p>
                </div>
              </div>
              
              <button className="w-full px-6 py-3 bg-[#6ECB63] text-white rounded-xl hover:bg-[#5EBB53] transition-all">
                Capture Emotion
              </button>
            </div>

            {/* Run Analysis Button */}
            <button
              onClick={handleAnalysis}
              disabled={isAnalyzing}
              className="w-full px-8 py-5 bg-gradient-to-r from-[#A7C7E7] to-[#C5B8F1] text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                "Run Full Analysis"
              )}
            </button>
          </div>

          {/* RIGHT PANEL - Results Display */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-[#A7C7E7]" />
              <h2>Your Results</h2>
            </div>

            {!showResults ? (
              <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500">Complete your analysis to see results here</p>
              </div>
            ) : (
              <>
                {/* Stress Score Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="mb-6">Stress Score</h3>
                  
                  <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#E5E7EB"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke={getStressColor(results.stressScore)}
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${(results.stressScore / 10) * 351.86} 351.86`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl">{getStressEmoji(results.stressScore)}</span>
                        <span className="font-semibold">{results.stressScore}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="inline-block px-4 py-2 rounded-xl mb-2" style={{ backgroundColor: `${getStressColor(results.stressScore)}20` }}>
                        <span style={{ color: getStressColor(results.stressScore) }}>
                          {results.stressLevel.charAt(0).toUpperCase() + results.stressLevel.slice(1)} Stress
                        </span>
                      </div>
                      <p className="text-gray-600">Your stress level is currently in the moderate range.</p>
                    </div>
                  </div>
                </div>

                {/* Emotion Breakdown Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="mb-4">Emotion Breakdown</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">Primary Emotion</span>
                      <span className="font-semibold text-[#C5B8F1]">{results.primaryEmotion}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">Confidence</span>
                      <span className="font-semibold">{results.confidence}%</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[#A7C7E7]/10 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">Text Emotion</div>
                        <div className="font-semibold text-[#A7C7E7]">{results.textEmotion}</div>
                      </div>
                      <div className="p-4 bg-[#6ECB63]/10 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">Face Emotion</div>
                        <div className="font-semibold text-[#6ECB63]">{results.faceEmotion}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-[#F7D060]" />
                    <h3>Your Recommendations</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {results.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#A7C7E7]/10 to-[#C5B8F1]/10 rounded-xl"
                      >
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quote Card */}
                <div className="bg-gradient-to-br from-[#A7C7E7] to-[#C5B8F1] rounded-2xl p-8 shadow-lg text-white">
                  <Heart className="w-8 h-8 mb-4 opacity-80" />
                  <p className="text-lg italic mb-2">"{results.quote}"</p>
                  <p className="text-sm opacity-80">Daily Inspiration</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
