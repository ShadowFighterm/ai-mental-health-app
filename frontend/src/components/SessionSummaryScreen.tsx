import { Calendar, TrendingDown, TrendingUp, Clock, Heart, PlayCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

interface Session {
  _id: string;
  type: string;
  primaryEmotion: string;
  stressScore: number;
  title: string;
  createdAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: Session[];
}

interface SessionHistoryItem {
  date: string;
  emotion: string;
  stressScore: number;
  notes: string;
}

interface StressTrendData {
  time: string;
  stress: number;
}

interface SessionSummaryScreenProps {
  onStartNewSession?: () => void;
}

export function SessionSummaryScreen({ onStartNewSession }: SessionSummaryScreenProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await axios.get<ApiResponse>("https://ai-mental-health-app.onrender.com/api/sessions");
        
        // Access the nested data property from the API response
        const sessionsData = res.data.data || [];
        setSessions(sessionsData);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setError("Failed to load session data");
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const sessionHistory: SessionHistoryItem[] = sessions.map((s: Session) => ({
    date: new Date(s.createdAt).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "2-digit",
      month: "short"
    }),
    emotion: s.primaryEmotion || "Unknown",
    stressScore: s.stressScore || 0,
    notes: s.title || "No notes"
  }));

  const stressTrendData: StressTrendData[] = sessions.slice(-7).map(s => ({
    time: new Date(s.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    stress: s.stressScore || 0
  }));

  const getStressColor = (score: number) => {
    if (score < 4) return "#6ECB63";
    if (score < 7) return "#F7D060";
    return "#E57373";
  };

  const averageStress = stressTrendData.length > 0
    ? (stressTrendData.reduce((acc, curr) => acc + curr.stress, 0) / stressTrendData.length).toFixed(1)
    : "0.0";

  const trend = stressTrendData.length >= 2
    ? stressTrendData[stressTrendData.length - 1].stress < stressTrendData[0].stress
      ? "down"
      : "up"
    : "stable";

  const lastSessionDate = sessionHistory.length > 0 ? sessionHistory[0].date : 'N/A';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EEF5] py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A7C7E7] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EEF5] py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#A7C7E7] text-white rounded-lg hover:bg-[#95B6D8] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EEF5] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Session Summary</h1>
            <p className="text-gray-600">Track your emotional wellbeing over time</p>
          </div>

          {onStartNewSession && (
            <button
              onClick={onStartNewSession}
              className="px-8 py-4 bg-gradient-to-r from-[#A7C7E7] to-[#C5B8F1] text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Start New Session
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#A7C7E7]/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#A7C7E7]" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{averageStress}</div>
                <div className="text-sm text-gray-600">Avg. Stress Level</div>
              </div>
            </div>
            <div className={`flex items-center gap-2 text-sm ${
              trend === "down" ? "text-[#6ECB63]" : 
              trend === "up" ? "text-[#E57373]" : "text-gray-500"
            }`}>
              {trend === "down" ? <TrendingDown className="w-4 h-4" /> : 
               trend === "up" ? <TrendingUp className="w-4 h-4" /> : <span className="w-4 h-4">—</span>}
              <span>
                {trend === "down" ? "Improving" : 
                 trend === "up" ? "Increasing" : "Stable"} trend
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#C5B8F1]/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#C5B8F1]" />
              </div>
              <div>
                <div className="text-2xl font-semibold">{sessionHistory.length}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Last session: {lastSessionDate}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#6ECB63]/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#6ECB63]" />
              </div>
              <div>
                <div className="text-2xl font-semibold">42</div>
                <div className="text-sm text-gray-600">Minutes Today</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Keep up the great work!
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stress Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Stress Level Timeline</h3>

            {stressTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stressTrendData}>
                  <defs>
                    <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A7C7E7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#A7C7E7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="stress"
                    stroke="#A7C7E7"
                    strokeWidth={3}
                    fill="url(#stressGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No data available for chart
              </div>
            )}

            <div className="flex items-center justify-center gap-8 mt-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#6ECB63]"></div>
                <span className="text-gray-600">Low (0-4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F7D060]"></div>
                <span className="text-gray-600">Medium (4-7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E57373]"></div>
                <span className="text-gray-600">High (7-10)</span>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Quick Insights</h3>

            <div className="space-y-4">
              <div className="p-4 bg-[#6ECB63]/10 rounded-xl">
                <div className="text-2xl mb-1">😊</div>
                <div className="font-semibold text-gray-800 mb-1">Most Common Emotion</div>
                <div className="text-sm text-gray-600">Calm (45% of sessions)</div>
              </div>

              <div className="p-4 bg-[#A7C7E7]/10 rounded-xl">
                <div className="text-2xl mb-1">🌅</div>
                <div className="font-semibold text-gray-800 mb-1">Best Time of Day</div>
                <div className="text-sm text-gray-600">Morning sessions (9-11 AM)</div>
              </div>

              <div className="p-4 bg-[#C5B8F1]/10 rounded-xl">
                <div className="text-2xl mb-1">🎯</div>
                <div className="font-semibold text-gray-800 mb-1">Weekly Goal</div>
                <div className="text-sm text-gray-600">4 of 5 sessions completed</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#C5B8F1] h-2 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session History */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Recent Sessions</h3>

          {sessionHistory.length > 0 ? (
            <div className="space-y-4">
              {sessionHistory.map((session, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                    style={{ backgroundColor: `${getStressColor(session.stressScore)}20` }}
                  >
                    {session.stressScore < 4 ? "🙂" : session.stressScore < 7 ? "😐" : "😟"}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-800">{session.emotion}</span>
                      <span
                        className="px-3 py-1 rounded-full text-sm text-white"
                        style={{ backgroundColor: getStressColor(session.stressScore) }}
                      >
                        {session.stressScore}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{session.notes}</p>
                    <p className="text-gray-400 text-xs">{session.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No sessions found. Start your first session to see data here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}