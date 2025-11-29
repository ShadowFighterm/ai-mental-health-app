import { useState, useRef, useEffect } from "react";
import { MessageSquare, Mic, Search, RefreshCw, Loader, RotateCcw, Camera, Sparkles, TrendingUp, Lightbulb, Heart } from "lucide-react";
import { parse } from "path";

export function MainInteractionScreen() {


  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [results, setResults] = useState<any | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const [isTextProcessing, setIsTextProcessing] = useState(false);
  const [analysisSource, setAnalysisSource] = useState<"text" | "voice" | "face" | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [faceError, setFaceError] = useState(false);


  // Clean up stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Initialize video element when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const playAudio = () => {
    if (audioUrl) {
      if (!audioPlayerRef.current || audioPlayerRef.current.src !== audioUrl) {
        audioPlayerRef.current = new Audio(audioUrl);
        audioPlayerRef.current.addEventListener("play", () => setIsPlaying(true));
        audioPlayerRef.current.addEventListener("pause", () => setIsPlaying(false));
        audioPlayerRef.current.addEventListener("ended", () => setIsPlaying(false));
        audioPlayerRef.current.addEventListener("loadedmetadata", () => {
          if (audioPlayerRef.current) {
            setDuration(audioPlayerRef.current.duration);
          }
        });
        audioPlayerRef.current.addEventListener("timeupdate", () => {
          if (audioPlayerRef.current) {
            setCurrentTime(audioPlayerRef.current.currentTime);
          }
        });
      }

      if (audioPlayerRef.current) {
        audioPlayerRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    }
  };

  const pauseAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const runTextAnalysis = async () => {
    if (!textInput.trim()) return;

    setAnalysisSource("text");
    setIsAnalyzing(true);
    setIsTextProcessing(true);
    setShowResults(false);

    try {
      const response = await fetch("http://localhost:5000/api/text/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const parsedData = data.message ? JSON.parse(data.message) : data;
      console.log("Text analysis result:", parsedData);
      setResults(parsedData);
      setShowResults(true);

    } catch (error) {
      console.error("Analysis error:", error);
      alert("Error analyzing text. Check console.");
    } finally {
      setIsAnalyzing(false);
      setIsTextProcessing(false);
    }
  };

  const runVoiceAnalysis = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("voice", audioBlob, "voice.wav");

    try {
      setAnalysisSource("voice");
      setIsAnalyzing(true);
      setShowResults(false);
      setVoiceError(null);
      setIsVoiceProcessing(true);

      const response = await fetch("http://localhost:5000/api/voice/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("Voice analysis response:", data);
      setResults(data);
      setShowResults(true);

    } catch (err: any) {
      console.error("Voice analysis failed:", err);
      const msg = err?.message || "Error analyzing voice";
      setVoiceError(msg);
      throw err;
    } finally {
      setIsAnalyzing(false);
      setIsVoiceProcessing(false);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const localChunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      localChunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(localChunks, { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setAudioBlob(blob);
      setAudioUrl(url);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const startCamera = async () => {
    try {
      setCameraError(null);

      // Stop existing stream if any
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Use front camera
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      setStream(newStream);
      setIsCameraActive(true);

      // Reset photo state when starting new camera session
      setPhotoBlob(null);
      setPhotoUrl(null);

    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please check permissions and make sure you're using HTTPS or localhost.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas not available");
      return;
    }

    const video = videoRef.current;

    // Make sure video is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Video not ready");
      return;
    }

    const canvas = canvasRef.current;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get canvas context");
      return;
    }

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create URL
    canvas.toBlob((blob) => {
      if (blob) {
        setPhotoBlob(blob);
        const url = URL.createObjectURL(blob);
        setPhotoUrl(url);
        console.log("Photo captured successfully");
        // Delay stopping camera slightly to allow state update
        setTimeout(() => stopCamera(), 100);
      } else {
        console.error("Failed to create blob from canvas");
      }
    }, "image/jpeg", 0.95);

  };

  const runImageAnalysis = async () => {
    if (!photoBlob) {
      console.error("No photo to analyze");
      return;
    }

    const formData = new FormData();
    formData.append("face", photoBlob, "photo.jpg");

    try {
      setAnalysisSource("face");
      setIsAnalyzing(true);
      setFaceError(false);
      setAnalysisSource("full");
      setShowResults(false);

      const response = await fetch("http://localhost:5000/api/face/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Image analysis failed");

      const data = await response.json();
      const parsedData = data.message ? JSON.parse(data.message) : data;
      console.log("Image analysis response:", parsedData);
      setResults(parsedData);
      setShowResults(true);

    } catch (err) {
      console.error("Image analysis error:", err);
      setFaceError(true); // show retry button
    } finally {
      setIsAnalyzing(false);
    }

  };

  const retakePhoto = () => {
    // Clear the captured photo and restart camera
    setPhotoBlob(null);
    setPhotoUrl(null);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8EEF5] py-12">
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div className={`max-w-7xl mx-auto px-6 ${isAnalyzing ? "pointer-events-none opacity-60" : ""}`}>
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

              <button
                onClick={() => runTextAnalysis()}
                disabled={!textInput || isAnalyzing}
                className="mt-4 px-6 py-3 bg-[#A7C7E7] text-white rounded-xl hover:bg-[#8FB5D9] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isTextProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  "Analyze Text"
                )}
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
                  onClick={() => {
                    if (isRecording) stopRecording();
                    else startRecording();
                  }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-[#E57373] animate-pulse" : "bg-[#C5B8F1] hover:bg-[#B5A5E1]"
                    }`}
                >
                  <Mic className="w-8 h-8 text-white" />
                </button>

                {isRecording && (
                  <div className="flex gap-1 mt-6">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-[#C5B8F1] rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 40 + 20}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {!isRecording && audioUrl && (
                  <>
                    <div className="mt-6 w-full bg-gradient-to-r from-[#C5B8F1]/20 to-[#A7C7E7]/20 rounded-xl p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => {
                            if (isPlaying) pauseAudio();
                            else playAudio();
                          }}
                          className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C5B8F1] hover:bg-[#B5A5E1] text-white flex items-center justify-center transition-all"
                        >
                          {isPlaying ? (
                            <div className="flex gap-1">
                              <div className="w-1 h-4 bg-white rounded-sm animate-pulse"></div>
                              <div className="w-1 h-6 bg-white rounded-sm animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-1 h-4 bg-white rounded-sm animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                          ) : (
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>

                        <div className="flex-1">
                          <div
                            className="bg-white rounded-full h-2 overflow-hidden cursor-pointer"
                            onClick={(e) => {
                              if (audioPlayerRef.current) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const percent = (e.clientX - rect.left) / rect.width;
                                audioPlayerRef.current.currentTime = percent * audioPlayerRef.current.duration;
                              }
                            }}
                          >
                            <div
                              className="h-full bg-gradient-to-r from-[#C5B8F1] to-[#A7C7E7] transition-all"
                              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={stopAudio}
                          className="flex-shrink-0 text-[#C5B8F1] hover:text-[#B5A5E1] transition-all"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h12v12H6z" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-600 px-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>

                      <button
                        onClick={async () => {
                          if (audioBlob) {
                            const blobToSend = audioBlob;
                            stopAudio();
                            try {
                              await runVoiceAnalysis(blobToSend);
                              setAudioBlob(null);
                              setAudioUrl(null);
                            } catch (err) {
                              // Keep audio for retry
                            }
                          }
                        }}
                        disabled={!audioBlob || isAnalyzing}
                        className="w-full mt-3 px-6 py-3 bg-[#C5B8F1] text-white rounded-xl hover:bg-[#B5A5E1] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isVoiceProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          "Analyze Voice"
                        )}
                      </button>
                      {voiceError && audioBlob && (
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={async () => {
                              if (!audioBlob) return;
                              setVoiceError(null);
                              try {
                                await runVoiceAnalysis(audioBlob);
                                setAudioBlob(null);
                                setAudioUrl(null);
                              } catch (e) {
                                // Keep audio for retry
                              }
                            }}
                            disabled={isAnalyzing}
                            className="px-4 py-2 bg-gradient-to-r from-[#A7C7E7] to-[#C5B8F1] text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Retry
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Webcam Input Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#6ECB63]/20 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-[#6ECB63]" />
                </div>
                <h3>Capture your emotion</h3>
              </div>

              {/* Camera Error Message */}
              {cameraError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{cameraError}</p>
                </div>
              )}

              {/* Live Preview */}
              <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center mb-4 overflow-hidden">
                {!isCameraActive && !photoUrl ? (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Camera preview</p>
                    <p className="text-gray-400 text-sm mt-2">Click "Start Camera" to begin</p>
                  </div>
                ) : isCameraActive ? (
                  <video
                    ref={videoRef}
                    className="w-full h-48 object-cover rounded-xl"
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={() => console.log("Video metadata loaded")}
                    onCanPlay={() => console.log("Video can play")}
                    onError={(e) => console.error("Video error:", e)}
                  />
                ) : (
                  // Show captured photo when camera is not active
                  photoUrl && (
                    <img
                      src={photoUrl}
                      alt="Captured"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  )
                )}
              </div>

              <canvas ref={canvasRef} style={{ display: "none" }} />

              {/* Camera Controls */}
              <div className="space-y-3">
                {!isCameraActive && !photoUrl ? (
                  // Start Camera
                  <button onClick={startCamera} className="icon-btn">
                    <Camera className="w-6 h-6" />
                  </button>
                ) : isCameraActive ? (
                  // Capture Photo
                  <button onClick={capturePhoto} className="icon-btn">
                    <Camera className="w-6 h-6" />
                  </button>
                ) : (
                  // Photo captured
                  <div className="flex gap-3">
                    {!faceError ? (
                      <button onClick={runImageAnalysis} className="icon-btn" disabled={isAnalyzing}>
                        {isAnalyzing ? <Loader /> : <Search className="w-6 h-6" />}
                      </button>
                    ) : (
                      <button onClick={runImageAnalysis} className="icon-btn">
                        <RefreshCw className="w-6 h-6" /> {/* Retry */}
                      </button>
                    )}
                    <button onClick={retakePhoto} className="icon-btn">
                      <RotateCcw className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Results Display */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-[#A7C7E7]" />
              <h2>Your Results</h2>
              {analysisSource && (
                <span className="ml-3 text-xs px-2 py-1 rounded-full bg-[#F3F4F6] text-gray-700">
                  {analysisSource === "text" ? "Text" : analysisSource === "voice" ? "Voice" : "Face"}
                </span>
              )}
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
                        <span style={{ color: getStressColor(results?.stressScore ?? 0) }}>
                          {results?.stressLevel
                            ? results.stressLevel.charAt(0).toUpperCase() + results.stressLevel.slice(1)
                            : ""} Stress
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
                        <div className="text-sm text-gray-600 mb-1">{(analysisSource === "voice" || results.voiceEmotion) ? "Voice Emotion" : "Text Emotion"}</div>
                        <div className="font-semibold text-[#A7C7E7]">{(analysisSource === "voice" || results.voiceEmotion) ? (results.voiceEmotion || results.textEmotion || "unknown") : (results.textEmotion || "unknown")}</div>
                      </div>
                      <div className="p-4 bg-[#6ECB63]/10 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">Face Emotion</div>
                        <div className="font-semibold text-[#6ECB63]">{results.faceEmotion || "unknown"}</div>
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
                    {results?.tips?.map((tip: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#A7C7E7]/10 to-[#C5B8F1]/10 rounded-xl">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm">{index + 1}</span>
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    )) || null}
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