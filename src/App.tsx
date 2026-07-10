/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Music, Sparkles, Share2, Play, Pause, Volume2, VolumeX, 
  RefreshCw, Download, User, Calendar, Sliders, ChevronRight,
  Disc, Star, Phone, Instagram, Send, Info, Check, Copy, X, Clock, Gift, Lock
} from "lucide-react";
import { SongData, SetType, LyricSection, VoiceStyle, OccasionType, OccasionTemplate } from "./types";
import { LyricCanvas } from "./components/LyricCanvas";
import { luteEngineInstance } from "./components/AudioEngine";

export default function App() {
  // --- Lifecycles & State Management ---
  const [target, setTarget] = useState("");
  const [context, setContext] = useState("");
  const [voiceStyle, setVoiceStyle] = useState<string>("male_warm");
  const [videoLength, setVideoLength] = useState<number>(10);
  const [customGenre, setCustomGenre] = useState("Acoustic Folk");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string>("");
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [occasion, setOccasion] = useState<OccasionType>("birthday");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [voiceRecording, setVoiceRecording] = useState<Blob | null>(null);
  const [manualSongUrl, setManualSongUrl] = useState<string>("");
  const [showManualImport, setShowManualImport] = useState(false);
  const [uploadedVoiceFile, setUploadedVoiceFile] = useState<File | null>(null);
  const [voiceMode, setVoiceMode] = useState<"addon" | "replace" | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const mainVideoSrc = "https://drive.google.com/uc?export=download&id=1H7bdSkULkzoNQGqqno26_KJzAPsZUPL2";
  const previewVideoSrc = "https://drive.google.com/uc?export=download&id=1dvyq1PS79s4e3GZlcDxZ3tK2lGKktyiC";
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sunoStatus, setSunoStatus] = useState<"idle" | "generating" | "success" | "error">("idle");
  const [sunoMessage, setSunoMessage] = useState("");
  const [setType, setSetType] = useState<SetType>("quick");
  const [gifterEmail, setGifterEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isPurposeExpanded, setIsPurposeExpanded] = useState(false);
  
  // Voice style options for song generation
  const voiceStyleOptions: Array<{ id: VoiceStyle; label: string; tags: string; icon: string; description: string }> = [
    { id: "male-warm", label: "Male Warm", tags: "male vocalist, warm voice, soulful, intimate", icon: "🎤", description: "Gentle, heartfelt male voice" },
    { id: "male-bright", label: "Male Bright", tags: "male vocalist, bright voice, energetic, uplifting", icon: "🌟", description: "Energetic, cheerful male voice" },
    { id: "female-soft", label: "Female Soft", tags: "female vocalist, soft voice, gentle, tender", icon: "🎵", description: "Sweet, nurturing female voice" },
    { id: "female-powerful", label: "Female Powerful", tags: "female vocalist, powerful voice, strong, emotive", icon: "⭐", description: "Strong, moving female voice" },
    { id: "duo-harmony", label: "Duo Harmony", tags: "duet, male and female, harmony, blended voices", icon: "👫", description: "Male & female harmonizing" },
    { id: "choir-ensemble", label: "Choir Ensemble", tags: "choir, ensemble, multiple voices, angelic", icon: "👥", description: "Heavenly choir arrangement" },
    { id: "child-innocent", label: "Child Voice", tags: "child vocalist, innocent, pure, sweet", icon: "👶", description: "Pure, innocent child's voice" },
    { id: "elder-wisdom", label: "Elder Wisdom", tags: "mature vocalist, wise, storytelling, experienced", icon: "👴", description: "Wise, experienced narrator" }
  ];

  // Occasion templates for gift cards
  const occasionTemplates: OccasionTemplate[] = [
    { 
      id: "birthday", 
      label: "Birthday", 
      icon: "🎂", 
      emoji: "🎉",
      colorScheme: { primary: "#FF6B9D", secondary: "#FFA500", background: "#FFF5E6" },
      description: "Celebrate another trip around the sun"
    },
    { 
      id: "anniversary", 
      label: "Anniversary", 
      icon: "💍", 
      emoji: "❤️",
      colorScheme: { primary: "#C41E3A", secondary: "#FFD700", background: "#FFF0F5" },
      description: "Honor your love story milestone"
    },
    { 
      id: "new-baby", 
      label: "New Baby", 
      icon: "👶", 
      emoji: "🍼",
      colorScheme: { primary: "#87CEEB", secondary: "#FFB6C1", background: "#F0F8FF" },
      description: "Welcome the newest family blessing"
    },
    { 
      id: "graduation", 
      label: "Graduation", 
      icon: "🎓", 
      emoji: "🌟",
      colorScheme: { primary: "#1E3A8A", secondary: "#FFD700", background: "#F0F4F8" },
      description: "Celebrate achievement and new beginnings"
    },
    { 
      id: "promotion", 
      label: "Promotion", 
      icon: "🏆", 
      emoji: "📈",
      colorScheme: { primary: "#059669", secondary: "#FFD700", background: "#F0FDF4" },
      description: "Honor professional success"
    },
    { 
      id: "mothers-day", 
      label: "Mother's Day", 
      icon: "💐", 
      emoji: "🌸",
      colorScheme: { primary: "#DB2777", secondary: "#FCA5A5", background: "#FDF2F8" },
      description: "Express gratitude to Mom"
    },
    { 
      id: "fathers-day", 
      label: "Father's Day", 
      icon: "👔", 
      emoji: "⚡",
      colorScheme: { primary: "#1F2937", secondary: "#3B82F6", background: "#F9FAFB" },
      description: "Honor Dad's strength and love"
    },
    { 
      id: "wedding", 
      label: "Wedding", 
      icon: "💑", 
      emoji: "💒",
      colorScheme: { primary: "#BE185D", secondary: "#F9A8D4", background: "#FDF2F8" },
      description: "Bless the happy couple"
    },
    { 
      id: "celebration", 
      label: "Just Because", 
      icon: "🎉", 
      emoji: "✨",
      colorScheme: { primary: "#7C3AED", secondary: "#FBBF24", background: "#FAF5FF" },
      description: "Spread joy for any reason"
    }
  ];
  
  // --- Stripe Live Session Variables ---
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const publishableKey = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || "";

  useEffect(() => {
    console.log("[Stripe Integration] Client-side Publishable Key detection:", publishableKey ? "Loaded. Ready for active checkouts." : "No live Publishable Key fallback active.");
  }, [publishableKey]);
  
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState("");

  const [currentSong, setCurrentSong] = useState<SongData | null>(null);
  const [allVariations, setAllVariations] = useState<SongData[]>([]);
  const [activeVariationIdx, setActiveVariationIdx] = useState(0);

  // --- Audio Player States ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false);

  // --- Suno Player States ---
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(120);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudioPlayback = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.warn(e));
      setIsAudioPlaying(true);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setAudioDuration(audioRef.current.duration);
      }
    }
  };

  const handleAudioSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const seekTime = percentage * audioDuration;
    audioRef.current.currentTime = seekTime;
    setAudioCurrentTime(seekTime);
  };

  // --- Keepsake Modal State ---
  const [showKeepsake, setShowKeepsake] = useState(false);
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [isVocalizing, setIsVocalizing] = useState(false);

  const trackerRef = useRef<number | null>(null);

  // --- Introductory Video Audio Controls ---
  const [introVideoMuted, setIntroVideoMuted] = useState(true);
  const introVideoRef = useRef<HTMLVideoElement | null>(null);

  const toggleMinstrelAudio = () => {
    if (introVideoRef.current && typeof introVideoRef.current.play === 'function') {
      const targetMute = !introVideoRef.current.muted;
      introVideoRef.current.muted = targetMute;
      setIntroVideoMuted(targetMute);
    } else {
      setIntroVideoMuted(prev => !prev);
    }
  };

  // Expose toggleMinstrelAudio globally in case of external/script control
  useEffect(() => {
    const globalWin = window as any;
    globalWin.toggleMinstrelAudio = () => {
      if (introVideoRef.current && typeof introVideoRef.current.play === 'function') {
        const targetMute = !introVideoRef.current.muted;
        introVideoRef.current.muted = targetMute;
        setIntroVideoMuted(targetMute);
      } else {
        setIntroVideoMuted(prev => !prev);
      }
    };
    return () => {
      delete globalWin.toggleMinstrelAudio;
    };
  }, []);

  // --- Admin Sandbox Gate States & Handlers ---
  const [isAdminGateVisible, setIsAdminGateVisible] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isTestStudio, setIsTestStudio] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const checkAdminRoute = () => {
      const active = window.location.href.includes('/admin/test-studio') || window.location.hash === '#test-studio';
      setIsTestStudio(active);
      setIsAdminGateVisible(active);
      if (active) {
        setTimeout(() => {
          const el = document.getElementById('admin-gate-container');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    };
    
    checkAdminRoute();

    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('load', checkAdminRoute);
    
    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('load', checkAdminRoute);
    };
  }, []);

  // --- Read URL for post-payments success triggers ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get("stripe_checkout") === "success";
    const mockParam = params.get("stripe_mock") === "true";
    const cancelParam = params.get("stripe_checkout") === "cancel";

    if (cancelParam) {
      setPaymentNotice("Checkout cancelled - Adjust your choices or strum again, Haddi is ready whenever you are!");
      window.history.replaceState(null, "", window.location.pathname);
    } else if (successParam || mockParam) {
      const urlTarget = params.get("target") || "";
      const urlContext = params.get("context") || "";
      const urlSetType = (params.get("setType") as SetType) || "quick";
      const urlCustomGenre = params.get("customGenre") || "Acoustic Folk";
      const urlGifterEmail = params.get("gifterEmail") || "";
      const urlRecipientEmail = params.get("recipientEmail") || "";

      if (urlTarget) {
        setTarget(urlTarget);
        setContext(urlContext);
        setSetType(urlSetType);
        setCustomGenre(urlCustomGenre);
        if (urlGifterEmail) setGifterEmail(urlGifterEmail);
        if (urlRecipientEmail) setRecipientEmail(urlRecipientEmail);
        
        const modeLabel = successParam ? "live Stripe payment session" : "sandbox payment simulation";
        setPaymentNotice(`🎉 SECURE CHECKOUT COMPLETION via ${modeLabel}! Compiling Haddi's blessing now...`);
        
        // Auto-run the generation!
        triggerSongGeneration(urlTarget, urlContext, urlSetType, urlCustomGenre);
      }
      
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handleValidateAuthorization = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const phrase = passwordInput.trim().toUpperCase();
    if (phrase === "SHALOM" || phrase === "ADMIN") {
      setIsAuthorized(true);
      setIsAdminUnlocked(true);
      setPasswordError("");
    } else {
      setPasswordError("Invalid authorization phrase. Please try again.");
    }
  };

  const handleCancelAuthorization = () => {
    setPasswordInput("");
    setPasswordError("");
    setIsAuthorized(false);
    setIsTestStudio(false);
    setIsAdminGateVisible(false);
    window.location.hash = "";
    window.history.replaceState(null, "", window.location.pathname || "/");
  };

  const verifyAdminGate = () => {
    const enteredEmail = (document.getElementById('admin-email-input') as HTMLInputElement | null)?.value.trim() || "";
    const masterDeveloperId = "Pswilliamh@gmail.com";
    
    if (!isAuthorized) {
      alert("Please authorize through the Seraphim Test Studio secure gateway first.");
      return;
    }
    
    if (enteredEmail.toLowerCase() === masterDeveloperId.toLowerCase()) {
      setIsAdminUnlocked(true);
    } else {
      alert("Access Denied: Terminal mismatch. Please enter your registered master developer credentials.");
    }
  };

  const executeMockSongGeneration = async () => {
    if (!isAuthorized) {
      alert("Unauthorized: Access locked.");
      return;
    }
    
    const email = (document.getElementById('test-target-email') as HTMLInputElement | null)?.value.trim() || "";
    const story = (document.getElementById('test-story-context') as HTMLTextAreaElement | null)?.value.trim() || "";
    
    if (!email || !story) {
      alert("Please fill in the target email and blessing story.");
      return;
    }
    
    const terminal = document.getElementById('sandbox-terminal');
    const btn = document.getElementById('test-submit-btn') as HTMLButtonElement | null;
    
    if (btn) {
      btn.disabled = true;
      btn.innerText = "🎵 Connecting to Suno AI...";
    }
    
    if (terminal) {
      terminal.style.display = 'block';
      terminal.innerHTML = `[SYSTEM] Starting real Suno generation for ${email}...<br>`;
    }
    
    setIsGenerating(true);
    setIsRendering(true);
    setError("");
    setSunoStatus("generating");
    setSunoMessage("Connecting to live Suno AI engines... Crafting vocal arrangement tracks.");
    
    try {
      const sunoApiKey = (import.meta as any).env.VITE_SUNO_API_KEY;
      if (!sunoApiKey || sunoApiKey.length < 15) {
        throw new Error("Suno API Key missing. Please add VITE_SUNO_API_KEY=sk-... in your .env file");
      }
      
      if (terminal) terminal.innerHTML += `[API] Sending story to 302.ai Suno V5...<br>`;
      
      const response = await fetch("https://api.302.ai/v1/suno/submit/music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sunoApiKey}`,
        },
        body: JSON.stringify({
          prompt: story,
          tags: `${customGenre || 'Modern Worship'}, emotional, acoustic, christian worship, folk, ballad`,
          make_instrumental: false,
          wait_audio_ready: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Suno API error: ${response.status}`);
      }

      const data = await response.json();
      let liveTrackUrl = data.audio_url || data.url || 
                         (data.data && data.data[0]?.audio_url) || 
                         (Array.isArray(data) && data[0]?.audio_url);

      if (!liveTrackUrl) {
        throw new Error("No audio URL returned");
      }

      setAudioUrl(liveTrackUrl);
      if (audioRef.current) {
        audioRef.current.src = liveTrackUrl;
        audioRef.current.load();
        audioRef.current.play().catch(console.warn);
      }
      setIsAudioPlaying(true);
      setSunoStatus("success");
      setSunoMessage("Prophetic worship track successfully rendered! Streaming live audio.");

      const customSongData: SongData = {
        id: `suno-${Date.now()}`,
        title: `Covenant Blessing for ${email}`,
        target: email,
        context: story,
        setType: "quick",
        tempo: "Peaceful Plucking (78 BPM)",
        genre: customGenre || "Modern Worship",
        artistIntro: `Halo kawanku! Haddi here with a special blessing for ${email}.`,
        lyricSections: [{ sectionName: "Blessing", lines: [story.substring(0, 150)], chords: ["G", "C"], timestamps: [0, 12] }],
        totalDurationSeconds: 120
      };
      setCurrentSong(customSongData);

      if (terminal) {
        terminal.innerHTML += `<span style="color:#2ecc71">[SUCCESS] Real Suno audio received!</span><br>`;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setSunoStatus("error");
      setSunoMessage(`Suno Connection Error: ${err.message}`);
      
      if (terminal) {
        terminal.innerHTML += `<span style="color:#e74c3c">[ERROR] ${err.message}</span><br>`;
      }
      const fallbackUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      setAudioUrl(fallbackUrl);
      if (audioRef.current) audioRef.current.src = fallbackUrl;
      setIsAudioPlaying(true);
    } finally {
      setIsGenerating(false);
      setIsRendering(false);
      if (btn) {
        btn.disabled = false;
        btn.innerText = "🚀 Render Song & Send Digital Gift Card";
      }
    }
  };

  // --- Mobile Browser Native Voice Blessing ---
  const playHaddiMobileVoice = (generatedLyrics: string) => {
    // Check if the mobile browser supports native speech
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsVocalizing(false);
        return;
      }

      const speech = new SpeechSynthesisUtterance(generatedLyrics);
      
      // Fine-tuning the frequency for a warm, humble, resonant male voice
      speech.pitch = 0.9;  // Slightly deeper tone
      speech.rate = 0.85;  // Deliberate, meaningful cadence
      speech.volume = 1.0; // Full presence
      
      // Find an English male voice model built into your phone
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;
      for (let i = 0; i < voices.length; i++) {
        if (voices[i].name.includes('Male') || voices[i].name.includes('Google US English')) {
          selectedVoice = voices[i];
          break;
        }
      }
      if (selectedVoice) {
        speech.voice = selectedVoice;
      }
      
      speech.onstart = () => {
        setIsVocalizing(true);
      };
      speech.onend = () => {
        setIsVocalizing(false);
      };
      speech.onerror = () => {
        setIsVocalizing(false);
      };

      // Execute the vocal blessing live on your phone
      window.speechSynthesis.speak(speech);
    } else {
      alert("Mobile audio synthesis node not supported on this device.");
    }
  };

  // Expose verifyAdminGate and executeMockSongGeneration globally for compatibility with manual script executions / custom triggers
  useEffect(() => {
    const globalWin = window as any;
    globalWin.verifyAdminGate = verifyAdminGate;
    globalWin.executeMockSongGeneration = executeMockSongGeneration;
    globalWin.playHaddiMobileVoice = (generatedLyrics: string) => playHaddiMobileVoice(generatedLyrics);
    return () => {
      delete globalWin.verifyAdminGate;
      delete globalWin.executeMockSongGeneration;
      delete globalWin.playHaddiMobileVoice;
    };
  }, []);

  // --- Strum audio synchronization helpers ---
  // Returns what chord should ring out at the current elapsed player time
  const getChordAtTime = (): string => {
    if (!currentSong) return "G";
    // Search the lyric sections chronologically
    const sections = currentSong.lyricSections;
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      // Pick the chord matching the active timeline line
      for (let j = section.timestamps.length - 1; j >= 0; j--) {
        if (currentTime >= section.timestamps[j]) {
          return section.chords[j] || section.chords[0] || "G";
        }
      }
    }
    return "G";
  };

  // Synchronized progress trigger
  useEffect(() => {
    if (isPlaying && currentSong) {
      trackerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSong.totalDurationSeconds) {
            setIsPlaying(false);
            luteEngineInstance.stopLutePlayback();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (trackerRef.current) {
        clearInterval(trackerRef.current);
        trackerRef.current = null;
      }
    }

    return () => {
      if (trackerRef.current) {
        clearInterval(trackerRef.current);
      }
    };
  }, [isPlaying, currentSong]);

  // Audio engine volume bindings
  useEffect(() => {
    luteEngineInstance.setVolume(muted ? 0 : volume / 100);
  }, [volume, muted]);

  // Sync variations with main active track selection
  useEffect(() => {
    if (allVariations.length > 0 && allVariations[activeVariationIdx]) {
      setCurrentSong(allVariations[activeVariationIdx]);
      setCurrentTime(0);
      setIsPlaying(false);
      luteEngineInstance.stopLutePlayback();
    }
  }, [activeVariationIdx, allVariations]);

  // --- Action Handlers ---
  const triggerSongGeneration = async (
    targetVal: string,
    contextVal: string,
    setTypeVal: SetType,
    customGenreVal: string
  ) => {
    setError("");
    setIsRendering(true);
    setStage(2); // Jump to Avatar loader Screen
    setLoadingStep(0);

    // Simulated staggered loading visual increments while calling backend
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < 4) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    try {
      // 1. Submit Request to the Full-Stack server API
      const res = await fetch("/api/generate-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: targetVal.trim(),
          context: contextVal.trim(),
          setType: setTypeVal,
          customGenre: customGenreVal
        })
      });

      const data = await res.json();
      if (!data.success || !data.song) {
        throw new Error(data.error || "Internal generation failed.");
      }

      const returnedSong: SongData = data.song;
      
      // Determine if variations list was populated via Extended Encore, Premium, or Legacy selection
      if ((setTypeVal === "extended" || setTypeVal === "premium" || setTypeVal === "legacy") && data.variations) {
        setAllVariations(data.variations);
        setActiveVariationIdx(0);
        setCurrentSong(data.variations[0]);
      } else {
        setAllVariations([returnedSong]);
        setActiveVariationIdx(0);
        setCurrentSong(returnedSong);
      }

      // 2. Play Audio Speech introduction from the Minstrel avatar!
      try {
        const speechRes = await fetch("/api/generate-avatar-intro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ introText: returnedSong.artistIntro })
        });
        const speechData = await speechRes.json();
        
        if (speechData.success && speechData.base64Audio) {
          // Play speech introduction sequentially using Web Audio context
          luteEngineInstance.initContext();
          await luteEngineInstance.playSpeechIntro(speechData.base64Audio);
        }
      } catch (speechErr) {
        // Fallback gracefully without throwing
        console.warn("Avatar voice vocalization skipped: ", speechErr);
      }

      // Transition smoothly into Stage 3 Playing Screen!
      clearInterval(interval);
      setStage(3);
    } catch (err: any) {
      console.error(err);
      setError("Trouble tuning to this exact frequency. Let us retry.");
      setStage(1);
    } finally {
      setIsRendering(false);
    }
  };

  const handleStrumSong = async () => {
    const valEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!gifterEmail.trim()) {
      setError("Please specify Your Email (Gifter) - this is required so Haddi can deliver your digital keepsake!");
      return;
    }
    if (!valEmail(gifterEmail)) {
      setError("Please enter a valid Gifter Email format.");
      return;
    }
    if (!recipientEmail.trim()) {
      setError("Please specify the Recipient's Email - this is required so Haddi can dedicate the song correctly!");
      return;
    }
    if (!valEmail(recipientEmail)) {
      setError("Please enter a valid Recipient Email format.");
      return;
    }
    if (!target.trim()) {
      setError("Please specify who you are creating this song for.");
      return;
    }
    const wordCount = context.trim() === "" ? 0 : context.trim().split(/\s+/).length;
    if (wordCount > 500) {
      setError("Please keep your Context & Special Story under 500 words before strumming.");
      return;
    }
    setError("");
    setIsGenerating(true);
    setIsRendering(true);
    setGenerationProgress(0);

    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + (Math.random() * 8 + 2);
      });
    }, 1000);

    try {
      const selectedVoice = voiceStyleOptions.find(v => v.id === voiceStyle);
      const voiceTags = selectedVoice ? selectedVoice.tags : "male vocalist, warm voice";

      // Step 1: Generate song lyrics via Gemini
      const res = await fetch("/api/generate-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: target.trim(),
          context: context.trim(),
          setType,
          customGenre,
          voiceStyle: voiceTags,
          gifterEmail: gifterEmail.trim(),
          recipientEmail: recipientEmail.trim()
        })
      });

      const data = await res.json();
      if (!data.success || !data.song) {
        throw new Error(data.error || "Minstrel song generation failed. Please try again.");
      }

      const returnedSong: SongData = data.song;
      setCurrentSong(returnedSong);

      if ((setType === "extended" || setType === "premium" || setType === "legacy") && data.variations) {
        setAllVariations(data.variations);
        setActiveVariationIdx(0);
      } else {
        setAllVariations([returnedSong]);
        setActiveVariationIdx(0);
      }

      // Step 2: Generate audio via Suno API
      console.log("Calling Suno API to generate audio with vocals...");
      const sunoPrompt = `${context.trim()}\n\nCreate a ${customGenre} song with ${voiceTags} vocals for ${target.trim()}.`;
      
      const sunoRes = await fetch("/api/generate-suno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: sunoPrompt,
          tags: `${customGenre}, ${voiceTags}, acoustic, folk, emotional, heartfelt`,
          make_instrumental: false,
          wait_audio_ready: true,
          target: target.trim(),
          context: context.trim()
        })
      });

      // Check if response is ok and parse properly
      if (!sunoRes.ok) {
        const errorText = await sunoRes.text();
        console.error("Suno API error response:", errorText);
        
        if (sunoRes.status === 502) {
          throw new Error("🔄 302.AI server is temporarily overloaded (502 Bad Gateway). Your song credits were NOT charged. Please wait 30 seconds and try again. If this persists, check the PM2 logs - your song may have generated successfully in the background! Thank you for your patience with My-Gift-Song! 🙏");
        }
        
        throw new Error(`Suno API returned ${sunoRes.status}: ${sunoRes.statusText}. Please check your API key and account credits.`);
      }

      // Get response text first, then try to parse as JSON
      const responseText = await sunoRes.text();
      let sunoData;
      
      try {
        sunoData = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("Failed to parse Suno response as JSON:", responseText.substring(0, 200));
        throw new Error("Suno API returned an invalid response format (HTML instead of JSON). The service may be temporarily unavailable or the API key may be incorrect. Thank you for using My-Gift-Song today!");
      }

      console.log("Suno API response:", sunoData);

      // Check if Suno generation was successful
      if (!sunoData.success && sunoData.code !== 200) {
        // Check if it's a retryable error
        if (sunoData.isRetryable) {
          throw new Error("302.AI server is temporarily overloaded. Your credits were NOT charged. Please try again in 30 seconds. 🙏");
        }
        throw new Error(sunoData.error || "Suno music generation failed. Please check your API key and account credits at https://302.ai. Thank you for trying My-Gift-Song!");
      }

      // Extract audio URL - server returns { success: true, audio_urls: [...], download_url: "..." }
      let liveTrackUrl = null;
      let directDownloadUrl = null;
      
      // PRIMARY: Check server's audio_urls array (what our backend returns)
      if (sunoData.audio_urls && Array.isArray(sunoData.audio_urls) && sunoData.audio_urls.length > 0) {
        liveTrackUrl = sunoData.audio_urls[0];
        directDownloadUrl = sunoData.download_url || liveTrackUrl;
        console.log("✓ Suno audio URL extracted from server response:", liveTrackUrl);
      }
      // FALLBACK: Check 302.AI's nested structure (if server passes raw response)
      else if (sunoData.data && sunoData.data.data && Array.isArray(sunoData.data.data) && sunoData.data.data[0]?.audio_url) {
        liveTrackUrl = sunoData.data.data[0].audio_url;
        directDownloadUrl = liveTrackUrl;
        console.log("✓ Suno audio URL extracted from nested 302.AI data:", liveTrackUrl);
      }
      // FALLBACK: Check direct url property
      else if (sunoData.url) {
        liveTrackUrl = sunoData.url;
        directDownloadUrl = liveTrackUrl;
        console.log("✓ Suno audio URL extracted from url property:", liveTrackUrl);
      }

      // If no audio URL, fail clearly with download suggestion
      if (!liveTrackUrl) {
        console.error("Failed to extract audio URL. Full response:", JSON.stringify(sunoData, null, 2));
        throw new Error("Suno API did not return an audio URL. The song may have generated successfully - check the browser console or PM2 logs for the download link. Thank you for your patience!");
      }

      setGenerationProgress(100);
      setAudioUrl(liveTrackUrl);
      setDownloadUrl(directDownloadUrl || liveTrackUrl);
      
      if (audioRef.current) {
        audioRef.current.src = liveTrackUrl;
        audioRef.current.load();
      }

      // Show success message with download link
      setTimeout(() => {
        alert(`🎉 Your song is ready!\n\n✅ Playing in the audio player below\n🔗 Direct download link copied to clipboard\n\nThank you for using My-Gift-Song today! 🎵`);
        
        // Copy download URL to clipboard
        if (directDownloadUrl && navigator.clipboard) {
          navigator.clipboard.writeText(directDownloadUrl).catch(() => {});
        }
      }, 500);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Trouble processing acoustic song generation. Please retry.");
      setGenerationProgress(0);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
      setIsRendering(false);
      setTimeout(() => setGenerationProgress(0), 2000);
    }
  };

  const handleGenerateVideo = async () => {
    if (!currentSong || !audioUrl) {
      setError("Generate a song first before creating a video!");
      return;
    }

    if (uploadedPhotos.length < 3) {
      setError("Please upload at least 3 photos for the video!");
      return;
    }

    setIsGeneratingVideo(true);
    setError("");

    try {
      // Step 1: Upload photos to server
      const formData = new FormData();
      uploadedPhotos.forEach((photo, idx) => {
        formData.append('photos', photo);
      });

      const uploadRes = await fetch("/api/upload-photos", {
        method: "POST",
        body: formData
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || "Photo upload failed");
      }

      // Step 2: Generate video with uploaded photo paths
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioUrl: audioUrl,
          lyrics: currentSong.lyrics,
          title: currentSong.title,
          videoLength: videoLength,
          photoPaths: uploadData.photoPaths
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Video generation failed");
      }

      setGeneratedVideoUrl(data.videoUrl);
      alert("🎉 Video generated successfully! Check the preview player.");
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Video generation failed. Please try again.");
      console.error("Video generation error:", error);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate: max 5 images, each under 5MB
    const validFiles = files.filter((file: File) => {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    const totalPhotos = uploadedPhotos.length + validFiles.length;
    if (totalPhotos > 5) {
      setError("Maximum 5 photos allowed for video");
      return;
    }

    setUploadedPhotos(prev => [...prev, ...validFiles]);
    setError("");
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setVoiceRecording(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 300) { // 5 minutes max
            stopRecording();
            return 300;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      setError("Microphone access denied. Please enable microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const handleVoiceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setError("Please upload an audio file (MP3, WAV, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Audio file must be under 10MB");
      return;
    }

    setUploadedVoiceFile(file);
    setError("");
  };

  const togglePlayback = () => {
    if (isPlaying) {
      luteEngineInstance.stopLutePlayback();
      setIsPlaying(false);
    } else {
      luteEngineInstance.initContext();
      luteEngineInstance.startLutePlayback(() => getChordAtTime());
      setIsPlaying(true);
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
  };

  const handleReset = () => {
    luteEngineInstance.stopLutePlayback();
    setIsPlaying(false);
    setCurrentTime(0);
    setTarget("");
    setContext("");
    setSetType("quick");
    setStage(1);
  };

  const handleLoadManualSong = () => {
    if (!manualSongUrl.trim()) {
      setError("Please enter a valid song URL");
      return;
    }

    // Validate URL format
    if (!manualSongUrl.startsWith("http")) {
      setError("Please enter a valid HTTP/HTTPS URL");
      return;
    }

    // Create a basic song object for manual imports
    const manualSong: SongData = {
      id: `manual-${Date.now()}`,
      title: `Song for ${target || "Someone Special"}`,
      target: target || "Someone Special",
      context: context || "A beautiful personalized song",
      setType: "quick",
      tempo: "Custom (Manual Import)",
      genre: customGenre || "Acoustic Folk",
      artistIntro: `A special song created for ${target || "you"}.`,
      lyricSections: [
        {
          sectionName: "Manual Import",
          lines: ["This song was manually imported.", "Enjoy the music!"],
          chords: ["G", "C"],
          timestamps: [0, 30]
        }
      ],
      totalDurationSeconds: 120
    };

    setCurrentSong(manualSong);
    setAudioUrl(manualSongUrl);
    setDownloadUrl(manualSongUrl);

    if (audioRef.current) {
      audioRef.current.src = manualSongUrl;
      audioRef.current.load();
    }

    setGenerationProgress(100);
    setIsGenerating(false);
    setIsRendering(false);
    setShowManualImport(false);
    setStage(3);
    setError("");

    alert("🎵 Song loaded successfully! You can now create your gift card and share it.");
  };

  const handleAutoRetrieveSong = async () => {
    setError("");
    setIsProcessing(true);

    try {
      // Call server endpoint to retrieve the most recent song for this context
      const response = await fetch("/api/retrieve-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: target.trim(),
          context: context.trim()
        })
      });

      const data = await response.json();

      if (!data.success || !data.audioUrl) {
        throw new Error(data.error || "Could not retrieve your song. Please try manual import.");
      }

      // Load the retrieved song
      const retrievedSong: SongData = {
        id: `retrieved-${Date.now()}`,
        title: `Song for ${target || "Someone Special"}`,
        target: target || "Someone Special",
        context: context || "A beautiful personalized song",
        setType: setType,
        tempo: "Retrieved from Server",
        genre: customGenre || "Acoustic Folk",
        artistIntro: `Your personalized song for ${target || "you"}.`,
        lyricSections: [
          {
            sectionName: "Retrieved Song",
            lines: ["Your song was successfully generated!", "Enjoy the music!"],
            chords: ["G", "C"],
            timestamps: [0, 30]
          }
        ],
        totalDurationSeconds: 120
      };

      setCurrentSong(retrievedSong);
      setAudioUrl(data.audioUrl);
      setDownloadUrl(data.audioUrl);

      if (audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.load();
      }

      setGenerationProgress(100);
      setIsGenerating(false);
      setIsRendering(false);
      setShowManualImport(false);
      setStage(3);

      alert("🎉 Your song was retrieved successfully! Continue building your gift card below.");
    } catch (err: any) {
      console.error("Auto-retrieval error:", err);
      setError(err.message || "Could not retrieve song automatically. Please try manual import.");
      setShowManualImport(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!currentSong) return;
    const selectedTemplate = occasionTemplates.find(t => t.id === occasion) || occasionTemplates[0];
    const text = encodeURIComponent(
      `${selectedTemplate.emoji} I created a personalized ${selectedTemplate.label} song titled "${currentSong.title}" for ${currentSong.target}!\n\n` +
      `Listen to this custom acoustic masterpiece here: https://mygiftsong.aiapps.com\n\n` +
      `"There is no greater gift than a song..." 🌟`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareEmail = () => {
    if (!currentSong) return;
    const selectedTemplate = occasionTemplates.find(t => t.id === occasion) || occasionTemplates[0];
    const subject = encodeURIComponent(`${selectedTemplate.emoji} A Special ${selectedTemplate.label} Song for ${currentSong.target}!`);
    const body = encodeURIComponent(
      `Hello!\n\nI created a personalized ${selectedTemplate.label} song titled "${currentSong.title}" for ${currentSong.target}!\n\n` +
      `Listen to this custom acoustic masterpiece here: https://mygiftsong.aiapps.com\n\n` +
      `Enjoy! 🎵`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleCopyLyrics = () => {
    if (!currentSong) return;
    const selectedTemplate = occasionTemplates.find(t => t.id === occasion) || occasionTemplates[0];
    const text = currentSong.lyricSections.map(s => 
      `[${s.sectionName}]\n` + s.lines.join("\n")
    ).join("\n\n");

    navigator.clipboard.writeText(`${selectedTemplate.emoji} "${currentSong.title}" for ${currentSong.target}\nListen here: https://mygiftsong.aiapps.com\n\n${text}`);
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2000);
  };

  // Render format helper
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#0d0a08] text-white flex flex-col justify-between font-sans selection:bg-[#FFD700] selection:text-black main-studio-bg">
      
      {/* --- Ambient Star Decor --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[10%] left-[5%] text-[#C5A880] text-lg ambient-decor"><Star size={16} /></div>
        <div className="absolute top-[40%] right-[8%] text-[#C5A880]/30 text-xl ambient-decor delay-1000"><Star size={12} /></div>
        <div className="absolute bottom-[25%] left-[12%] text-[#C5A880]/40 text-lg ambient-decor delay-3000"><Star size={14} /></div>
        <div className="absolute top-[80%] right-[20%] text-[#C5A880]/25 text-2xl ambient-decor delay-500"><Star size={10} /></div>
      </div>

      {/* --- Kinetic Audio Accents: Floating Note Stream --- */}
      <div className="fixed w-full pointer-events-none overflow-hidden z-10" style={{ top: "15%", height: "180px" }}>
        <div className="music-note-stream">
          <span className="note-item" style={{ animationDelay: "0s", top: "10%" }}>♫</span>
          <span className="note-item" style={{ animationDelay: "2s", top: "35%" }}>♪</span>
          <span className="note-item" style={{ animationDelay: "4.5s", top: "15%" }}>♬</span>
          <span className="note-item" style={{ animationDelay: "6.5s", top: "65%" }}>♫</span>
          <span className="note-item" style={{ animationDelay: "8s", top: "25%" }}>♪</span>
          <span className="note-item" style={{ animationDelay: "10s", top: "45%" }}>♬</span>
          <span className="note-item" style={{ animationDelay: "12s", top: "5%" }}>♫</span>
        </div>
      </div>

      {/* --- HEADER --- */}
      <header className="border-b border-[#C5A880]/20 bg-[#0c0b0a]/90 backdrop-blur-lg sticky top-0 z-40 px-6 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full border-2 border-[#FFD700] bg-gradient-to-br from-[#251e19] to-[#120e0a] text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.25)]">
              <span className="font-display font-bold text-base tracking-tighter">5+3</span>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-display font-bold tracking-wide text-white flex items-center gap-1.5">
                mygiftsong.aiapps.com <span className="text-[#FFD700] text-xs font-mono font-semibold">STUDIO</span>
              </h1>
              <p className="text-[11px] text-[#FFD700]/80 tracking-widest uppercase font-mono font-medium">Haddi the Street Minstrel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Kept completely clean in accordance with branding blueprint */}
          </div>
        </div>
      </header>

      {/* --- MAIN STAGES MATRIX --- */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        
        <AnimatePresence mode="wait">

          {/* STAGE 1: THE STUDIO INPUT FORM */}
          {stage === 1 && (
            <motion.div
              key="stage1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6 w-full max-w-[1100px] mx-auto py-2 animate-fade-in"
            >
              {paymentNotice && (
                <div id="stripe-checkout-notice" className="bg-[#1c1815]/95 border-2 border-[#FFD700] rounded-2xl p-4 md:p-5 w-full flex items-center justify-between text-xs md:text-sm text-amber-200 font-medium tracking-wide shadow-[0_0_20px_rgba(255,215,0,0.25)] animate-pulse mb-2">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-[#FFD700] shrink-0" size={18} />
                    <span>{paymentNotice}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setPaymentNotice(null)} 
                    className="text-[#FFD700] hover:text-white transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Expandable Accordion: Our Purpose & How to Use */}
              <div className="w-full bg-[#121110]/85 border border-[#C5A880]/30 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl transition-all">
                <button
                  type="button"
                  id="purpose_accordion_toggle"
                  onClick={() => setIsPurposeExpanded(!isPurposeExpanded)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between text-xs sm:text-sm font-mono font-bold text-[#FFD700] tracking-wider uppercase bg-[#1c1917]/85 hover:bg-[#2c2824]/90 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    ✨ OUR PURPOSE & HOW TO USE THIS APP {isPurposeExpanded ? "(CLICK TO COLLAPSE)" : "(CLICK TO EXPAND)"}
                  </span>
                  <ChevronRight size={18} className={`text-[#FFD700] transition-transform duration-300 ${isPurposeExpanded ? 'rotate-90' : 'rotate-0'}`} />
                </button>
                
                {isPurposeExpanded && (
                  <div className="p-6 md:p-8 space-y-6 border-t border-[#C5A880]/20 bg-black/60 text-white/90 animate-fade-in text-left">
                    {/* Official 5+3 Lyre Mandate */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-mono font-bold text-[#FFD700] uppercase tracking-widest flex items-center gap-2">
                        📜 The Official 5+3 Lyre Mandate
                      </h4>
                      <p className="text-xs md:text-sm leading-relaxed text-[#FAF9F6]/90 font-sans pl-4 border-l border-[#FFD700]/40">
                        Haddi’s system integrates five distinct digital narrative dimensions (character, location, history, milestone, and blessing) with three traditional acoustic plucking intentions (sincerity, honor, and resonance). Every single track is engineered not as generic ambient music, but as an active sonic keepsake.
                      </p>
                    </div>

                    {/* The 4-Step Gifting Journey */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-mono font-bold text-[#FFD700] uppercase tracking-widest flex items-center gap-2">
                        🚀 The Gifting Journey
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pl-4">
                        <div className="bg-[#1c1917]/70 border border-[#C5A880]/15 rounded-xl p-4 space-y-2">
                          <span className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-widest bg-[#2c1e14] px-2 py-0.5 rounded">Step 01</span>
                          <h5 className="text-xs font-bold text-white font-sans uppercase">Identify & Honor</h5>
                          <p className="text-[11px] text-white/75 leading-relaxed font-sans">
                            Specify the name of the special person or group the custom song is created to dedicate.
                          </p>
                        </div>
                        <div className="bg-[#1c1917]/70 border border-[#C5A880]/15 rounded-xl p-4 space-y-2">
                          <span className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-widest bg-[#2c1e14] px-2 py-0.5 rounded">Step 02</span>
                          <h5 className="text-xs font-bold text-white font-sans uppercase">Weave the Lore</h5>
                          <p className="text-[11px] text-white/75 leading-relaxed font-sans">
                            Describe memories, details, and message prompts to feed the acoustic AI songcrafting engine.
                          </p>
                        </div>
                        <div className="bg-[#1c1917]/70 border border-[#C5A880]/15 rounded-xl p-4 space-y-2">
                          <span className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-widest bg-[#2c1e14] px-2 py-0.5 rounded">Step 03</span>
                          <h5 className="text-xs font-bold text-white font-sans uppercase">Choose Package & Theme</h5>
                          <p className="text-[11px] text-white/75 leading-relaxed font-sans">
                            Select your gift package (Quick Strum, Full Set, Premium Video, or Legacy Bundle) and music theme.
                          </p>
                        </div>
                        <div className="bg-[#1c1917]/70 border border-[#C5A880]/15 rounded-xl p-4 space-y-2">
                          <span className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-widest bg-[#2c1e14] px-2 py-0.5 rounded">Step 04</span>
                          <h5 className="text-xs font-bold text-white font-sans uppercase">Strum & Receive</h5>
                          <p className="text-[11px] text-white/75 leading-relaxed font-sans">
                            Click "Strum the Strings" to generate your song. The audio will be ready in 30-90 seconds.
                          </p>
                        </div>
                      </div>
                      
                      {/* Optional Video Creation Step */}
                      <div className="bg-[#2c1e14]/50 border-2 border-[#FFD700]/30 rounded-xl p-4 space-y-2 mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-widest bg-[#1c1917] px-2 py-0.5 rounded">Optional</span>
                          <h5 className="text-xs font-bold text-[#FFD700] font-sans uppercase">Create Gift Video</h5>
                        </div>
                        <p className="text-[11px] text-white/75 leading-relaxed font-sans">
                          <strong>After your song is generated</strong>, you can optionally create a stunning HD video (Premium Video or Legacy Bundle packages only). Upload 3-5 personal photos, choose video length (10 or 20 seconds), and click "Generate Video" below the audio player. Your video will include animated lyrics synced with your custom song.
                        </p>
                        <ul className="space-y-1 text-[10px] text-white/60 font-sans pl-4">
                          <li>• Only available for Premium Video ($4.99) and Legacy Bundle ($12.99)</li>
                          <li>• Upload 3-5 photos (max 5MB each)</li>
                          <li>• Video renders in 30-60 seconds after song completion</li>
                          <li>• Downloadable MP4 format for easy sharing</li>
                        </ul>
                      </div>

                      {/* API Setup Information */}
                      <div className="bg-[#1c1917]/70 border border-[#C5A880]/20 rounded-xl p-4 space-y-2 mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-[#FFD700] uppercase tracking-widest bg-[#2c1e14] px-2 py-0.5 rounded">Setup</span>
                          <h5 className="text-xs font-bold text-[#FFD700] font-sans uppercase">Enable AI Features</h5>
                        </div>
                        <p className="text-[11px] text-white/75 leading-relaxed font-sans">
                          <strong>For AI-powered lyrics</strong>, add your Gemini API key in Settings (top-right) → Environment tab:
                        </p>
                        <div className="bg-black/60 rounded p-2 font-mono text-[10px] text-emerald-400">
                          VITE_GEMINI_API_KEY=your_key_here
                        </div>
                        <p className="text-[10px] text-white/60 font-sans">
                          Get a free key at: <a href="https://aistudio.google.com/apikey" target="_blank" className="text-[#FFD700] underline">aistudio.google.com/apikey</a>
                        </p>
                        <p className="text-[11px] text-white/75 leading-relaxed font-sans mt-2">
                          <strong>For song generation</strong>, add your 302.AI Suno API key:
                        </p>
                        <div className="bg-black/60 rounded p-2 font-mono text-[10px] text-emerald-400">
                          VITE_SUNO_API_KEY=sk-...
                        </div>
                        <p className="text-[10px] text-white/60 font-sans">
                          Get your key at: <a href="https://302.ai" target="_blank" className="text-[#FFD700] underline">302.ai</a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Top Section: Side-by-Side 50/50 Layout for Intro Text & Video/Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-stretch p-6 rounded-2xl bg-[#0c0b0a]/70 border border-[#C5A880]/15 backdrop-blur-md shadow-2xl max-w-[1100px] mx-auto w-full">
                
                {/* Left Side: Centered Smoked Charcoal Greeting Text Block & Flagship Video */}
                <div className="flex flex-col justify-start items-center text-center space-y-5 p-6 md:p-8 rounded-xl bg-[#121110]/95 border border-[#C5A880]/15 h-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#251e19] border border-[#C5A880]/20 rounded-full text-[10px] md:text-xs font-mono text-[#FFD700] uppercase tracking-wider">
                    <Sparkles size={12} className="text-[#FFD700]" /> 5+3 Lyre Method
                  </div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-display font-black tracking-wide text-white" style={{ textShadow: "2px 4px 12px rgba(0, 0, 0, 0.95), 0px 0px 20px rgba(0, 0, 0, 0.6)" }}>
                    Who is your <span className="text-[#FFD700]">Acoustic Song</span> honoring today?
                  </h1>
                  <p className="text-[#FAF9F6]/85 text-xs md:text-sm leading-relaxed font-sans">
                    Shalom! Welcome. My name is Haddi, a local street musician here in Jakarta, and this is my digital musician street corner. There is no greater gift than a song... so tell me, whose heart are we honoring with our silver strings today?
                  </p>

                  {/* Flagship Video Canvas: universal, front-and-center landing track layout with zero barriers */}
                  <div className="relative w-full rounded-xl overflow-hidden border border-[#C5A880]/20 shadow-xl bg-black/80 flex items-center justify-center aspect-video min-h-[200px]">
                    <iframe 
                      id="haddi-video"
                      src="https://drive.google.com/file/d/1H7bdSkULkzoNQGqqno26_KJzAPsZUPL2/preview" 
                      width="100%" 
                      height="450" 
                      allow="autoplay" 
                      style={{ border: "none", borderRadius: "12px", backgroundColor: "#050b14" }}
                    ></iframe>

                    {/* Golden unmute/mute overlay button */}
                    <button 
                      id="unmute-btn" 
                      type="button"
                      onClick={toggleMinstrelAudio}
                      style={{
                        position: "absolute",
                        bottom: "15px",
                        right: "15px",
                        background: "rgba(12, 11, 10, 0.85)",
                        border: "1.5px solid #FFD700",
                        color: "#FFD700",
                        borderRadius: "50%",
                        width: "42px",
                        height: "42px",
                        cursor: "pointer",
                        fontSize: "1.1rem",
                        boxShadow: "0 0 12px rgba(255, 215, 0, 0.4)",
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease"
                      }}
                      className="hover:scale-105 active:scale-95"
                    >
                      {introVideoMuted ? "🔇" : "🔊"}
                    </button>
                  </div>

                  {/* Official Anthem Lyrics Banner Container: Dedicated full-width banner container positioned underneath the media player */}
                  <div className="w-full bg-[#1c1917]/95 border-2 border-[#FFD700]/40 rounded-xl px-4 py-3.5 text-center shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/5 to-transparent animate-pulse pointer-events-none" />
                    <p className="text-xs sm:text-sm md:text-md text-[#FFD700] font-mono font-extrabold tracking-wider uppercase leading-relaxed select-none relative z-10 text-shadow-md">
                      "THERE IS NO GREATER GIFT THAN A SONG... IT IS WORTH MORE THAN A THOUSAND WORDS!"
                    </p>
                  </div>

                  {/* BOTTOM video player or custom audio player or loader depending on Suno state */}
                  {isGenerating ? (
                    <div className="relative w-full rounded-xl overflow-hidden border border-[#FFD700]/30 shadow-[0_0_25px_rgba(255,215,0,0.15)] bg-[#120e0a]/90 flex flex-col items-center justify-center aspect-video min-h-[200px] p-6 space-y-5">
                      <div className="relative flex items-center justify-center">
                        <Disc size={40} className="text-[#FFD700] animate-spin [animation-duration:3s]" />
                        <Sparkles size={16} className="text-[#FFD700] absolute -top-1 -right-1 animate-ping" />
                      </div>
                      <div className="space-y-2 text-center max-w-xs w-full">
                        <p className="text-xs font-mono font-bold text-[#FFD700] uppercase tracking-widest animate-pulse">HADDI IS STRUMMING...</p>
                        <p className="text-[10px] text-[#FAF9F6]/70 font-sans italic leading-relaxed">
                          "Plucking silver strings with Sumatra passion and Jakarta energy..."
                        </p>
                        
                        <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-[#FFD700]/30 mt-4">
                          <div 
                            className="h-full bg-gradient-to-r from-[#FFD700] via-[#FCE068] to-[#FFD700] transition-all duration-500 ease-out relative"
                            style={{ width: `${generationProgress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-[9px] font-mono text-[#FFD700]/70 mt-1.5">
                          <span>⏱️ Estimated: 30-60 seconds</span>
                          <span className="font-bold">{Math.round(generationProgress)}%</span>
                        </div>

                        {generationProgress >= 95 && generationProgress < 100 && (
                          <div className="mt-4 pt-4 border-t border-[#FFD700]/20 space-y-2 animate-fade-in">
                            <p className="text-[10px] text-amber-400 font-mono">
                              ⚠️ Taking longer than expected?
                            </p>
                            <div className="flex flex-col gap-2">
                              <button
                                type="button"
                                onClick={handleAutoRetrieveSong}
                                disabled={isProcessing}
                                className="px-4 py-2 bg-[#FFD700] hover:bg-[#FCE068] text-black text-[10px] font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {isProcessing ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    Retrieving...
                                  </>
                                ) : (
                                  <>🎵 Retrieve My Song</>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowManualImport(true);
                                  setIsGenerating(false);
                                }}
                                className="px-3 py-1.5 bg-transparent hover:bg-white/10 text-[#FFD700]/70 hover:text-[#FFD700] text-[9px] font-mono rounded-lg transition-all"
                              >
                                Or paste URL manually
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : showManualImport ? (
                    <div className="relative w-full rounded-xl overflow-hidden border border-[#FFD700]/40 shadow-[0_0_25px_rgba(255,215,0,0.2)] bg-[#120e0a]/95 flex flex-col justify-center items-center p-6 aspect-video min-h-[200px] space-y-4">
                      <div className="w-full space-y-3">
                        <div className="text-center space-y-1">
                          <h4 className="text-sm font-bold text-[#FFD700] uppercase tracking-wider">🎵 Manual Song Import</h4>
                          <p className="text-[10px] text-white/60 font-sans">
                            Paste your song URL from PM2 logs or previous generation
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-mono text-[#FFD700]/90 uppercase tracking-wider block">
                            Song URL:
                          </label>
                          <input
                            type="url"
                            value={manualSongUrl}
                            onChange={(e) => setManualSongUrl(e.target.value)}
                            placeholder="https://file.302.ai/gpt/imgs/..."
                            className="w-full bg-black/80 border border-[#FFD700]/30 rounded-lg px-3 py-2 text-white text-[11px] placeholder-white/30 focus:outline-none focus:border-[#FFD700] font-mono"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleLoadManualSong}
                            className="flex-1 px-4 py-2.5 bg-[#FFD700] hover:bg-[#FCE068] text-black text-xs font-bold rounded-lg transition-all"
                          >
                            ✅ Load Song & Continue to Gift Card
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowManualImport(false);
                              setManualSongUrl("");
                            }}
                            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all"
                          >
                            Cancel
                          </button>
                        </div>

                        <p className="text-[9px] text-white/40 font-sans italic text-center">
                          After loading, you'll be able to create gift cards and share your song
                        </p>
                      </div>
                    </div>
                  ) : audioUrl ? (
                    <div className="relative w-full rounded-xl overflow-hidden border border-[#FFD700]/40 shadow-[0_0_25px_rgba(255,215,0,0.2)] bg-[#120e0a]/95 flex flex-col justify-center items-center p-5 aspect-video min-h-[200px] space-y-3.5">
                      <div className="flex items-center gap-3.5 w-full">
                        <div className={`p-3.5 rounded-full bg-black/60 border-2 border-[#FFD700] text-[#FFD700] relative shrink-0 ${isAudioPlaying ? 'animate-spin [animation-duration:10s]' : ''}`}>
                          <Disc size={26} />
                          <div className="absolute -inset-1 bg-[#FFD700]/10 blur-md rounded-full -z-10" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <span className="text-[9px] font-mono text-[#FFD700] uppercase tracking-widest block font-bold">Suno AI Master Stream</span>
                          <h4 className="text-xs md:text-sm font-bold text-white truncate font-sans uppercase">
                            {currentSong?.title || "Bespoke Acoustic Masterpiece"}
                          </h4>
                          <p className="text-[10px] text-white/50 font-mono truncate">
                            Style: {customGenre} • {setType.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Active HTML5 Audio Player */}
                      <audio
                        id="suno-audio-player"
                        src={audioUrl}
                        ref={audioRef}
                        onTimeUpdate={handleAudioTimeUpdate}
                        onEnded={() => setIsAudioPlaying(false)}
                        autoPlay={true}
                        muted={false}
                        controls={true}
                        className="w-full mt-2 block rounded-lg bg-black/40 border border-[#FFD700]/20 text-white"
                      />

                      {/* Direct Download Link */}
                      {downloadUrl && (
                        <div className="mt-4 bg-gradient-to-r from-[#251e19]/80 to-[#1c1917]/80 border-2 border-[#FFD700]/40 rounded-xl p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-[#FFD700] uppercase tracking-wider mb-1">
                                🎵 Direct Download Link
                              </p>
                              <p className="text-[10px] text-white/60 font-mono truncate">
                                {downloadUrl}
                              </p>
                            </div>
                            <a
                              href={downloadUrl}
                              download="my-gift-song.mp3"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#1c1917] font-bold text-xs rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
                            >
                              <span>⬇️</span>
                              Download MP3
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Progress Line */}
                      <div className="w-full space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-white/40">
                          <span>{formatTime(audioCurrentTime)}</span>
                          <span>{formatTime(audioDuration || 120)}</span>
                        </div>
                        <div
                          onClick={handleAudioSeek}
                          className="h-1.5 w-full bg-white/10 rounded-full cursor-pointer relative overflow-hidden group hover:h-2 transition-all"
                        >
                          <div
                            className="h-full bg-gradient-to-r from-[#FFD700] via-[#FCE068] to-[#FFD700] rounded-full transition-all duration-100"
                            style={{ width: `${(audioCurrentTime / (audioDuration || 1)) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Lower Action Layout */}
                      <div className="flex items-center justify-between w-full pt-1.5">
                        <button
                          type="button"
                          onClick={toggleAudioPlayback}
                          className="bg-[#FFD700] hover:bg-[#FCE068] text-black rounded-lg px-4 py-1.5 text-[10px] font-mono tracking-wider font-extrabold uppercase transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-[0_2px_8px_rgba(255,215,0,0.15)] shrink-0"
                        >
                          {isAudioPlaying ? (
                            <>
                              <Pause size={12} fill="currentColor" /> PAUSE
                            </>
                          ) : (
                            <>
                              <Play size={12} fill="currentColor" /> PLAY
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1 bg-black/40 rounded-full px-2 py-1 border border-white/5">
                          <p className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-[#FFD700] animate-ping" />
                            LIVE
                          </p>
                        </div>

                        {/* Mute and volume */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (audioRef.current) {
                                const targetMute = !audioRef.current.muted;
                                audioRef.current.muted = targetMute;
                                setIsAudioMuted(targetMute);
                              }
                            }}
                            className="text-white/60 hover:text-white p-1"
                          >
                            {isAudioMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-[#FFD700]" />}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={audioVolume}
                            onChange={(e) => {
                              const newVol = parseFloat(e.target.value);
                              setAudioVolume(newVol);
                              if (audioRef.current) {
                                audioRef.current.volume = newVol;
                                audioRef.current.muted = false;
                                setIsAudioMuted(false);
                              }
                            }}
                            className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full rounded-xl overflow-hidden border border-[#C5A880]/20 shadow-xl bg-black/80 flex items-center justify-center aspect-video min-h-[200px]">
                      <iframe 
                        id="premium-preview-video"
                        src="https://drive.google.com/file/d/1dvyq1PS79s4e3GZlcDxZ3tK2lGKktyiC/preview" 
                        width="100%" 
                        height="450" 
                        allow="autoplay" 
                        style={{ border: "none", borderRadius: "12px", backgroundColor: "#050b14" }}
                      ></iframe>
                    </div>
                  )}

                  {/* The Sound of Honor & Covenant definition panel */}
                  <div className="w-full p-5 bg-[#1c1917]/60 border border-[#C5A880]/20 rounded-xl text-left backdrop-blur-md shadow-lg space-y-2 mt-1">
                    <h4 className="text-xs sm:text-sm font-mono font-semibold text-[#FFD700] uppercase tracking-widest flex items-center gap-1.5">
                      🎻 The Sound of Honor & Covenant
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#FAF9F6]/90 leading-relaxed font-sans">
                      A bespoke acoustic song is more than a melody; it is a sacred covenant of remembrance. Through Haddi's silver strings, your shared history, milestones, and blessings are bound into a living testament of honor, designed to persist as an unbreakable heritage of love and devotion.
                    </p>
                  </div>

                  {/* [Video Generation Feature] */}
                  <div className="w-full p-5 bg-gradient-to-br from-[#1c1917]/80 to-[#251e19]/60 border border-[#FFD700]/30 rounded-xl backdrop-blur-md shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-mono font-bold text-[#FFD700] uppercase tracking-widest flex items-center gap-2">
                        🎬 Optional: Create Gift Video
                      </h4>
                      {(setType === "premium" || setType === "legacy") && (
                        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest px-2 py-0.5 bg-emerald-950/40 rounded-full border border-emerald-500/30">
                          Available
                        </span>
                      )}
                    </div>
                    
                    {(setType !== "premium" && setType !== "legacy") ? (
                      <div className="text-center py-6 space-y-3">
                        <div className="text-3xl">🔒</div>
                        <p className="text-xs text-white/60 leading-relaxed font-sans">
                          Video creation is only available with <strong className="text-[#FFD700]">Premium Video</strong> ($4.99) or <strong className="text-[#FFD700]">Legacy Bundle</strong> ($12.99) packages.
                        </p>
                        <p className="text-[10px] text-white/40 italic font-sans">
                          Select one of these packages above to unlock video creation.
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-[10px] sm:text-xs text-[#FAF9F6]/80 leading-relaxed font-sans bg-black/30 p-3 rounded-lg border border-[#FFD700]/20">
                          <strong className="text-[#FFD700]">How it works:</strong> First, generate your song by clicking "Strum the Strings" below. Once your song is ready, return here to upload photos and create your video.
                        </p>
                        
                        <div className="space-y-3">
                          {/* Photo Upload Section */}
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono text-[#FFD700]/90 uppercase tracking-wider block">
                              Upload Photos (3-5 images, max 5MB each):
                            </label>
                            
                            {uploadedPhotos.length > 0 && (
                              <div className="grid grid-cols-3 gap-2">
                                {uploadedPhotos.map((photo, idx) => (
                                  <div key={idx} className="relative group">
                                    <img 
                                      src={URL.createObjectURL(photo)} 
                                      alt={`Upload ${idx + 1}`}
                                      className="w-full h-20 object-cover rounded-lg border border-[#FFD700]/30"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removePhoto(idx)}
                                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {uploadedPhotos.length < 5 && (
                              <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-[#FFD700]/30 rounded-lg cursor-pointer hover:border-[#FFD700]/60 transition-all bg-black/40">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handlePhotoUpload}
                                  className="hidden"
                                />
                                <span className="text-xs text-[#FFD700]/70 font-mono">
                                  📸 Click to Upload Photos ({uploadedPhotos.length}/5)
                                </span>
                              </label>
                            )}
                            
                            {uploadedPhotos.length > 0 && (
                              <p className="text-[9px] text-emerald-400 font-mono">
                                ✓ {uploadedPhotos.length} photo{uploadedPhotos.length > 1 ? 's' : ''} ready for video
                              </p>
                            )}
                          </div>

                          <label className="text-[10px] font-mono text-[#FFD700]/90 uppercase tracking-wider block">
                            Video Length:
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button 
                              type="button"
                              onClick={() => setVideoLength(10)}
                              className={`px-4 py-3 rounded-lg border text-center transition-all ${
                                videoLength === 10 
                                  ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" 
                                  : "bg-black/50 text-white/70 border-[#C5A880]/30 hover:border-[#FFD700]/50"
                              }`}
                            >
                              <div className="text-xs font-bold">10 Seconds</div>
                              <div className="text-[9px] opacity-75 mt-0.5">Quick Share</div>
                            </button>
                            <button 
                              type="button"
                              onClick={() => setVideoLength(20)}
                              className={`px-4 py-3 rounded-lg border text-center transition-all ${
                                videoLength === 20 
                                  ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" 
                                  : "bg-black/50 text-white/70 border-[#C5A880]/30 hover:border-[#FFD700]/50"
                              }`}
                            >
                              <div className="text-xs font-bold">20 Seconds</div>
                              <div className="text-[9px] opacity-75 mt-0.5">Full Preview</div>
                            </button>
                          </div>
                          
                          <button
                            type="button"
                            onClick={handleGenerateVideo}
                            disabled={!currentSong || !audioUrl || isGenerating || isGeneratingVideo || uploadedPhotos.length < 3}
                            className="w-full px-4 py-3 bg-gradient-to-r from-[#8B4513] to-[#A0522D] hover:from-[#A0522D] hover:to-[#CD853F] text-white font-bold text-xs rounded-lg border border-[#FFD700]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                          >
                            {isGeneratingVideo ? "Rendering Video..." : 
                             !currentSong ? "Generate Song First" :
                             uploadedPhotos.length < 3 ? "Upload 3+ Photos First" : 
                             "🎥 Generate Video Clip"}
                          </button>
                          
                          {!currentSong && !audioUrl && (
                            <p className="text-[9px] text-amber-400/80 font-mono text-center italic">
                              ⚠️ Generate your song first by clicking "Strum the Strings" below
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* [Video Preview Player] */}
                  <div className="w-full p-5 bg-gradient-to-br from-[#0c0b0a]/95 to-[#1c1917]/80 border border-[#FFD700]/20 rounded-xl backdrop-blur-md shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-mono font-bold text-[#FFD700] uppercase tracking-widest flex items-center gap-2">
                        📺 Video Preview
                      </h4>
                      {generatedVideoUrl && (
                        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                          Ready
                        </span>
                      )}
                    </div>
                    
                    {generatedVideoUrl ? (
                      <div className="space-y-3">
                        <div className="relative w-full rounded-xl overflow-hidden border border-[#FFD700]/30 shadow-lg bg-black">
                          <video 
                            src={generatedVideoUrl} 
                            controls 
                            className="w-full aspect-video"
                            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1280' height='720'%3E%3Crect fill='%231c1917' width='1280' height='720'/%3E%3C/svg%3E"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[9px] font-mono text-white/50">
                            <div>Duration: {videoLength} seconds</div>
                            <div>Format: MP4 • HD Quality</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const a = document.createElement("a");
                              a.href = generatedVideoUrl;
                              a.download = `${currentSong?.title || "song"}_video.mp4`;
                              a.click();
                            }}
                            className="px-3 py-1.5 bg-[#FFD700] hover:bg-[#FCE068] text-black text-[10px] font-bold rounded transition-all"
                          >
                            ⬇️ Download
                          </button>
                        </div>
                      </div>
                    ) : currentSong ? (
                      <div className="space-y-3">
                        <div className="relative w-full rounded-xl overflow-hidden border border-[#FFD700]/30 shadow-lg bg-black aspect-video">
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
                            {isGeneratingVideo ? (
                              <>
                                <div className="w-16 h-16 rounded-full border-4 border-[#FFD700]/20 border-t-[#FFD700] animate-spin" />
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-[#FFD700]">Rendering Video...</p>
                                  <p className="text-[10px] text-white/60 font-sans">
                                    This may take 30-60 seconds
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 flex items-center justify-center border border-[#FFD700]/30">
                                  <Play size={28} className="text-[#FFD700] ml-1" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-bold text-[#FFD700]">Video Ready to Generate</p>
                                  <p className="text-[10px] text-white/60 font-sans">
                                    "{currentSong.title}"
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleGenerateVideo}
                                  disabled={isGeneratingVideo}
                                  className="px-4 py-2 bg-[#FFD700] hover:bg-[#FCE068] text-black text-xs font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  🎬 Render Video Now
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-[9px] font-mono text-white/50">
                          <span>Duration: {videoLength} seconds</span>
                          <span>Format: MP4 • HD Quality</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full rounded-xl overflow-hidden border border-[#C5A880]/20 bg-black/60 aspect-video flex items-center justify-center">
                        <div className="text-center space-y-2 p-6">
                          <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 flex items-center justify-center border border-[#C5A880]/20 mx-auto">
                            <Music size={20} className="text-[#C5A880]/40" />
                          </div>
                          <p className="text-[10px] text-white/40 font-sans italic">
                            Generate a song first to create video
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* [Musical Style Theme Selector - Moved from right panel] */}
                  <div className="w-full p-5 bg-[#1c1917]/60 border border-[#C5A880]/20 rounded-xl backdrop-blur-md shadow-lg space-y-3">
                    <label className="text-xs md:text-sm font-mono text-[#FFD700] uppercase tracking-widest flex items-center gap-2 font-semibold">
                      <Sliders size={16} /> Select Your Musical Style Theme:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button" 
                        onClick={() => setCustomGenre("Acoustic Folk")} 
                        className={`p-3 rounded-xl border text-left transition-all ${customGenre === "Acoustic Folk" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" : "bg-black/40 text-white/70 border-[#C5A880]/20 hover:border-[#FFD700]/50"}`}
                      >
                        <div className="text-lg mb-1">🎸</div>
                        <div className="text-xs font-bold">Acoustic Folk</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Warm & Traditional</div>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomGenre("Bluegrass")} 
                        className={`p-3 rounded-xl border text-left transition-all ${customGenre === "Bluegrass" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" : "bg-black/40 text-white/70 border-[#C5A880]/20 hover:border-[#FFD700]/50"}`}
                      >
                        <div className="text-lg mb-1">🪕</div>
                        <div className="text-xs font-bold">Bluegrass</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Fast & Energetic</div>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomGenre("Rustic Lute")} 
                        className={`p-3 rounded-xl border text-left transition-all ${customGenre === "Rustic Lute" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" : "bg-black/40 text-white/70 border-[#C5A880]/20 hover:border-[#FFD700]/50"}`}
                      >
                        <div className="text-lg mb-1">🎻</div>
                        <div className="text-xs font-bold">Rustic Lute</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Medieval & Earthy</div>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomGenre("Modern Worship")} 
                        className={`p-3 rounded-xl border text-left transition-all ${customGenre === "Modern Worship" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" : "bg-black/40 text-white/70 border-[#C5A880]/20 hover:border-[#FFD700]/50"}`}
                      >
                        <div className="text-lg mb-1">🙏</div>
                        <div className="text-xs font-bold">Modern Worship</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Spiritual & Uplifting</div>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomGenre("Lofi Acoustic")} 
                        className={`p-3 rounded-xl border text-left transition-all ${customGenre === "Lofi Acoustic" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" : "bg-black/40 text-white/70 border-[#C5A880]/20 hover:border-[#FFD700]/50"}`}
                      >
                        <div className="text-lg mb-1">🎧</div>
                        <div className="text-xs font-bold">Lofi Acoustic</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Chill & Relaxed</div>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomGenre("Indie Pop")} 
                        className={`p-3 rounded-xl border text-left transition-all ${customGenre === "Indie Pop" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" : "bg-black/40 text-white/70 border-[#C5A880]/20 hover:border-[#FFD700]/50"}`}
                      >
                        <div className="text-lg mb-1">✨</div>
                        <div className="text-xs font-bold">Indie Pop</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Modern & Catchy</div>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomGenre("Classical Guitar")} 
                        className={`p-3 rounded-xl border text-left transition-all ${customGenre === "Classical Guitar" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" : "bg-black/40 text-white/70 border-[#C5A880]/20 hover:border-[#FFD700]/50"}`}
                      >
                        <div className="text-lg mb-1">🎼</div>
                        <div className="text-xs font-bold">Classical Guitar</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Elegant & Refined</div>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomGenre("Country Ballad")} 
                        className={`p-3 rounded-xl border text-left transition-all ${customGenre === "Country Ballad" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" : "bg-black/40 text-white/70 border-[#C5A880]/20 hover:border-[#FFD700]/50"}`}
                      >
                        <div className="text-lg mb-1">🤠</div>
                        <div className="text-xs font-bold">Country Ballad</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Heartfelt & Storytelling</div>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomGenre("Celtic Folk")} 
                        className={`p-3 rounded-xl border text-left transition-all ${customGenre === "Celtic Folk" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" : "bg-black/40 text-white/70 border-[#C5A880]/20 hover:border-[#FFD700]/50"}`}
                      >
                        <div className="text-lg mb-1">🍀</div>
                        <div className="text-xs font-bold">Celtic Folk</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Irish & Mystical</div>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomGenre("Jazz Acoustic")} 
                        className={`p-3 rounded-xl border text-left transition-all ${customGenre === "Jazz Acoustic" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" : "bg-black/40 text-white/70 border-[#C5A880]/20 hover:border-[#FFD700]/50"}`}
                      >
                        <div className="text-lg mb-1">🎺</div>
                        <div className="text-xs font-bold">Jazz Acoustic</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Smooth & Sophisticated</div>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomGenre("Gospel Hymn")} 
                        className={`p-3 rounded-xl border text-left transition-all ${customGenre === "Gospel Hymn" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" : "bg-black/40 text-white/70 border-[#C5A880]/20 hover:border-[#FFD700]/50"}`}
                      >
                        <div className="text-lg mb-1">⛪</div>
                        <div className="text-xs font-bold">Gospel Hymn</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Soulful & Powerful</div>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomGenre("Singer-Songwriter")} 
                        className={`p-3 rounded-xl border text-left transition-all ${customGenre === "Singer-Songwriter" ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg" : "bg-black/40 text-white/70 border-[#C5A880]/20 hover:border-[#FFD700]/50"}`}
                      >
                        <div className="text-lg mb-1">🎤</div>
                        <div className="text-xs font-bold">Singer-Songwriter</div>
                        <div className="text-[9px] opacity-75 mt-0.5">Intimate & Personal</div>
                      </button>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="bg-red-950/40 border border-red-500/30 p-3 rounded-xl text-xs font-mono text-red-300 w-full text-center">
                      ⚠️ {error}
                      {(error.includes("95") || error.includes("502") || error.includes("timeout") || error.includes("overload")) ? (
                        <div className="flex flex-col gap-2 mt-3">
                          <button
                            type="button"
                            onClick={handleAutoRetrieveSong}
                            disabled={isProcessing}
                            className="w-full px-4 py-2 bg-[#FFD700] hover:bg-[#FCE068] text-black text-[10px] font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Retrieving...
                              </>
                            ) : (
                              <>🎵 Retrieve My Song</>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowManualImport(true);
                              setError("");
                            }}
                            className="text-[9px] text-[#FFD700]/70 hover:text-[#FFD700] underline"
                          >
                            Or import manually
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Right Side: Interactive Studio Form */}
                <div className="input-panel-container window relative right-interaction-box w-full p-6 bg-[#0c0b0a]/40 border border-[#C5A880]/15 rounded-xl flex flex-col justify-between min-h-full h-auto">
                  
                  {/* Decorative Frame */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#C5A880]/30 rounded-tl"></div>
                  <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#C5A880]/30 rounded-tr"></div>
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#C5A880]/30 rounded-bl"></div>
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#C5A880]/30 rounded-br"></div>

                  <div className="space-y-6">
                    
                    {/* --- REQUIRED GIFTER & RECIPIENT EMAILS --- */}
                    <div className="flex flex-col gap-4 bg-black/40 border border-[#C5A880]/15 p-4 rounded-xl">
                      <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-mono text-[#FFD700] uppercase tracking-widest font-bold flex items-center gap-1.5">
                          📨 Your Email *
                        </label>
                        <input
                          id="gifter_email_input"
                          type="email"
                          required
                          placeholder="gifter@example.com"
                          value={gifterEmail}
                          onChange={(e) => setGifterEmail(e.target.value)}
                          className="w-full bg-black/90 border-2 border-[#C5A880]/80 rounded-xl px-3 py-2 text-[#FAF9F6] text-xs placeholder-white/30 focus:outline-none focus:border-[#FFD700] transition-all font-sans font-medium custom-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-mono text-[#FFD700] uppercase tracking-widest font-bold flex items-center gap-1.5">
                          ✉️ Recipient's Email *
                        </label>
                        <input
                          id="recipient_email_input"
                          type="email"
                          required
                          placeholder="recipient@example.com"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          className="w-full bg-black/90 border-2 border-[#C5A880]/80 rounded-xl px-3 py-2 text-[#FAF9F6] text-xs placeholder-white/30 focus:outline-none focus:border-[#FFD700] transition-all font-sans font-medium custom-input"
                        />
                      </div>
                    </div>

                    {/* [1. THE TARGET] */}
                    <div className="space-y-2">
                      <label className="text-[1.1rem] md:text-[1.3rem] font-mono text-[#FFD700] uppercase tracking-widest flex items-center gap-2 font-semibold">
                        <User size={16} /> Play a Song For...
                      </label>
                      <input
                        id="target_recipient_input"
                        type="text"
                        maxLength={40}
                        placeholder="e.g. Audrey, Johnny, My Eco-Brand"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="w-full bg-black/90 border-2 border-[#C5A880] rounded-xl px-4 py-3 text-[#FAF9F6] placeholder-white/30 focus:outline-none focus:border-[#FFD700] transition-all font-sans text-[1.1rem] md:text-[1.3rem] font-medium custom-input"
                      />
                    </div>

                    {/* [2. THE CONTEXT] */}
                    <div className="space-y-2">
                      <label className="text-sm md:text-md font-mono text-[#FFD700] uppercase tracking-widest flex items-center gap-2 font-semibold">
                        <Calendar size={16} /> The Context & Special Story
                      </label>
                      <textarea
                        id="context_story_textarea"
                        rows={5}
                        placeholder="e.g., Pour out your heart here up to 500 words. Describe their character, covenant promises, or a special milestone moment..."
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className={`w-full bg-black/95 border-2 rounded-xl px-3.5 py-2.5 text-[#FAF9F6] text-xs sm:text-sm leading-relaxed placeholder-white/30 focus:outline-none transition-all font-sans font-normal resize-y min-h-[120px] custom-input ${
                          (context.trim() === "" ? 0 : context.trim().split(/\s+/).length) > 500
                            ? "border-red-500 focus:border-red-500 text-red-100"
                            : "border-[#C5A880] focus:border-[#FFD700]"
                        }`}
                      />
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-white/50">Include ocean, morning, hero prompts...</span>
                        <span className={
                          (context.trim() === "" ? 0 : context.trim().split(/\s+/).length) > 500
                            ? "text-red-400 font-bold"
                            : "text-white/50"
                        }>
                          {context.trim() === "" ? 0 : context.trim().split(/\s+/).length} / 500 words
                        </span>
                      </div>
                    </div>

                    {/* [3. CONDITIONAL IMAGE UPLOADER] */}
                    {(setType === "premium" || setType === "legacy") && (
                      <div className="space-y-2 animate-fade-in bg-black/50 border border-[#C5A880]/20 p-4 rounded-xl text-left">
                        <label className="text-[11px] md:text-xs font-mono text-[#FFD700] uppercase tracking-widest font-semibold block">
                          📸 Add a Visual Touch (Optional - Max 5 Photos)
                        </label>
                        
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (uploadedImages.length >= 5) return;
                            const files = Array.from(e.dataTransfer.files) as File[];
                            const imageFiles = files.filter(f => f.type.startsWith("image/")).slice(0, 5 - uploadedImages.length);
                            imageFiles.forEach(file => {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  setUploadedImages(prev => [...prev, ev.target!.result as string].slice(0, 5));
                                }
                              };
                              reader.readAsDataURL(file);
                            });
                          }}
                          onClick={() => {
                            const fileInput = document.getElementById("uploader-file-input") as HTMLInputElement | null;
                            if (fileInput) fileInput.click();
                          }}
                          className="border-2 border-dashed border-[#C5A880]/30 hover:border-[#FFD700]/70 rounded-xl p-4 text-center cursor-pointer bg-black/40 hover:bg-[#121110]/85 transition-all text-white/50"
                        >
                          <input
                            id="uploader-file-input"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (uploadedImages.length >= 5) return;
                              const files = Array.from(e.target.files || []) as File[];
                              const imageFiles = files.filter(f => f.type.startsWith("image/")).slice(0, 5 - uploadedImages.length);
                              imageFiles.forEach(file => {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result) {
                                    setUploadedImages(prev => [...prev, ev.target!.result as string].slice(0, 5));
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }}
                          />
                          <p className="text-xs font-sans">
                            Drag & drop your photos here, or <span className="text-[#FFD700] underline font-bold">browse</span>
                          </p>
                          <p className="text-[10px] font-mono text-white/30 uppercase mt-1">Image files (Max 5)</p>
                        </div>

                        {uploadedImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1.5 justify-start">
                            {uploadedImages.map((imgSrc, idx) => (
                              <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#C5A880]/40 group bg-black">
                                <img src={imgSrc} alt={`Visual Touch ${idx + 1}`} className="w-full h-full object-cover animate-fade-in" />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUploadedImages(prev => prev.filter((_, i) => i !== idx));
                                  }}
                                  className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-red-400 font-bold"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* [Occasion Template Selector] */}
                    <div className="space-y-3 bg-black/50 border border-[#C5A880]/20 p-4 rounded-xl">
                      <label className="text-xs md:text-sm font-mono text-[#FFD700] uppercase tracking-widest flex items-center gap-2 font-semibold">
                        <Gift size={16} /> Choose Occasion:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {occasionTemplates.map((occ) => (
                          <button
                            key={occ.id}
                            type="button"
                            onClick={() => setOccasion(occ.id)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              occasion === occ.id
                                ? "border-[#FFD700] bg-[#251e19]/60 shadow-[0_0_15px_rgba(255,215,0,0.15)]"
                                : "border-[#C5A880]/20 bg-black/40 hover:border-[#C5A880]/50"
                            }`}
                          >
                            <div className="text-2xl mb-1">{occ.icon}</div>
                            <div className="text-[10px] font-bold text-[#FFD700]">{occ.label}</div>
                          </button>
                        ))}
                      </div>
                      <p className="text-[9px] text-white/50 font-sans italic">
                        {occasionTemplates.find(o => o.id === occasion)?.description}
                      </p>
                    </div>

                    {/* [Voice Recording/Upload Feature] */}
                    <div className="space-y-4 bg-gradient-to-br from-[#1c1917]/80 to-[#251e19]/60 border border-[#FFD700]/30 rounded-xl p-5 backdrop-blur-md shadow-xl">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-mono font-bold text-[#FFD700] uppercase tracking-widest flex items-center gap-2">
                          🎤 Add Your Voice (Optional)
                        </h4>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] md:text-xs font-mono text-white/80 uppercase tracking-wider block">
                          Choose how to use your voice:
                        </label>
                        
                        <div className="grid grid-cols-1 gap-2">
                          <button
                            type="button"
                            onClick={() => setVoiceMode(voiceMode === "addon" ? null : "addon")}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              voiceMode === "addon"
                                ? "border-[#FFD700] bg-[#251e19]/60 shadow-[0_0_15px_rgba(255,215,0,0.15)]"
                                : "border-[#C5A880]/20 bg-black/40 hover:border-[#C5A880]/50"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">💬</span>
                              <span className="text-xs font-bold text-[#FFD700]">Voice Message Add-On</span>
                            </div>
                            <p className="text-[10px] text-white/60 font-sans">Record or upload a personal message to play before/after the song</p>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setVoiceMode(voiceMode === "replace" ? null : "replace")}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              voiceMode === "replace"
                                ? "border-[#FFD700] bg-[#251e19]/60 shadow-[0_0_15px_rgba(255,215,0,0.15)]"
                                : "border-[#C5A880]/20 bg-black/40 hover:border-[#C5A880]/50"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">🎵</span>
                              <span className="text-xs font-bold text-[#FFD700]">Use Your Own Audio</span>
                            </div>
                            <p className="text-[10px] text-white/60 font-sans">Skip song generation and use your uploaded audio as the main track</p>
                          </button>
                        </div>

                        {voiceMode && (
                          <div className="mt-3 space-y-3 animate-fade-in bg-black/40 border border-[#FFD700]/20 rounded-lg p-4">
                            {/* Recording Controls */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-[#FFD700]/90 uppercase tracking-wider">Record Audio:</span>
                                {isRecording && (
                                  <span className="text-[9px] font-mono text-red-400 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')} / 5:00
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                {!isRecording ? (
                                  <button
                                    type="button"
                                    onClick={startRecording}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                                  >
                                    <div className="w-3 h-3 rounded-full bg-white" />
                                    Start Recording
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={stopRecording}
                                    className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                                  >
                                    <div className="w-3 h-3 bg-white" />
                                    Stop Recording
                                  </button>
                                )}
                              </div>

                              {voiceRecording && (
                                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2 flex items-center justify-between">
                                  <span className="text-[10px] text-emerald-400 font-mono">✓ Recording ready</span>
                                  <button
                                    type="button"
                                    onClick={() => setVoiceRecording(null)}
                                    className="text-xs text-red-400 hover:text-red-300"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* OR Divider */}
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-px bg-white/10" />
                              <span className="text-[9px] text-white/40 font-mono uppercase">or</span>
                              <div className="flex-1 h-px bg-white/10" />
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono text-[#FFD700]/90 uppercase tracking-wider block">
                                Upload Audio File (MP3/WAV, max 10MB, max 5 min):
                              </label>
                              
                              <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-[#FFD700]/30 rounded-lg cursor-pointer hover:border-[#FFD700]/60 transition-all bg-black/40">
                                <input
                                  type="file"
                                  accept="audio/*"
                                  onChange={handleVoiceFileUpload}
                                  className="hidden"
                                />
                                <span className="text-xs text-[#FFD700]/70 font-mono">
                                  🎵 Click to Upload Audio
                                </span>
                              </label>

                              {uploadedVoiceFile && (
                                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2 flex items-center justify-between">
                                  <span className="text-[10px] text-emerald-400 font-mono truncate">✓ {uploadedVoiceFile.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => setUploadedVoiceFile(null)}
                                    className="text-xs text-red-400 hover:text-red-300 ml-2"
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>

                            <p className="text-[9px] text-white/50 font-sans italic">
                              {voiceMode === "addon" 
                                ? "Your voice message will play before the generated song"
                                : "Your audio will be used instead of generating a new song"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* [Voice Style Selector] */}
                    <div className="space-y-3 bg-black/50 border border-[#C5A880]/20 p-4 rounded-xl">
                      <label className="text-xs md:text-sm font-mono text-[#FFD700] uppercase tracking-widest flex items-center gap-2 font-semibold">
                        <Volume2 size={16} /> Choose Voice Character:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {voiceStyleOptions.map((voice) => (
                          <button
                            key={voice.id}
                            type="button"
                            onClick={() => setVoiceStyle(voice.id)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              voiceStyle === voice.id
                                ? "border-[#FFD700] bg-[#251e19]/60 shadow-[0_0_15px_rgba(255,215,0,0.15)]"
                                : "border-[#C5A880]/20 bg-black/40 hover:border-[#C5A880]/50"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{voice.icon}</span>
                              <span className="text-xs font-bold text-[#FFD700]">{voice.label}</span>
                            </div>
                            <p className="text-[10px] text-white/60 font-sans">{voice.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* [3. CHOOSE YOUR GIFT PACKAGE] */}
                    <div className="space-y-5 bg-gradient-to-br from-[#1c1917]/90 to-[#251e19]/70 border-2 border-[#FFD700]/40 rounded-2xl p-6 shadow-2xl">
                      <div className="text-center space-y-2">
                        <label className="text-base md:text-lg font-mono text-[#FFD700] uppercase tracking-widest flex items-center justify-center gap-2.5 font-extrabold">
                          <Clock size={20} /> Choose Your Gift Package
                        </label>
                        <p className="text-[10px] text-white/60 font-sans italic">Select the perfect package for your special dedication</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <button
                          type="button"
                          onClick={() => setSetType("quick")}
                          className={`p-5 rounded-2xl border-2 text-left transition-all relative group ${
                            setType === "quick"
                              ? "border-[#FFD700] bg-[#251e19]/90 shadow-[0_0_25px_rgba(255,215,0,0.4)]"
                              : "border-[#C5A880]/30 bg-black/50 hover:border-[#FFD700]/60 hover:bg-black/70"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-[#FFD700] uppercase tracking-wider">Quick Strum</h4>
                              <p className="text-[10px] text-[#C5A880]/80 font-mono mt-0.5">$0.99</p>
                            </div>
                            {setType === "quick" && (
                              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest px-2 py-0.5 bg-emerald-950/40 rounded-full border border-emerald-500/30">Selected</span>
                            )}
                          </div>
                          <p className="text-[10px] sm:text-xs text-white/70 leading-relaxed">
                            3 unique acoustic variations (60s each) — different genres, melodies & lyric styles so you can choose your favorite.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSetType("extended")}
                          className={`p-5 rounded-2xl border-2 text-left transition-all relative group ${
                            setType === "extended"
                              ? "border-[#FFD700] bg-[#251e19]/90 shadow-[0_0_25px_rgba(255,215,0,0.4)]"
                              : "border-[#C5A880]/30 bg-black/50 hover:border-[#FFD700]/60 hover:bg-black/70"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD700]/30 to-[#FFD700]/10 flex items-center justify-center text-3xl shrink-0 border border-[#FFD700]/30 group-hover:scale-110 transition-transform">
                              🎵
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-[#FFD700] uppercase tracking-wide">Full Set</h4>
                                <span className="text-lg font-bold text-[#FFD700]">$1.99</span>
                              </div>
                              <p className="text-xs text-white/70 leading-relaxed font-sans">
                                Get 3 unique variations to find your perfect sound. Professional quality with full lyrics.
                              </p>
                              <ul className="space-y-1 text-[10px] text-white/50 font-sans">
                                <li className="flex items-center gap-1.5">✓ 3 song variations</li>
                                <li className="flex items-center gap-1.5">✓ Full lyric sheets included</li>
                                <li className="flex items-center gap-1.5">✓ Premium audio quality</li>
                                <li className="flex items-center gap-1.5">✓ Multiple style options</li>
                              </ul>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSetType("premium")}
                          className={`p-5 rounded-2xl border-2 text-left transition-all relative group ${
                            setType === "premium"
                              ? "border-[#FFD700] bg-[#251e19]/90 shadow-[0_0_25px_rgba(255,215,0,0.4)]"
                              : "border-[#C5A880]/30 bg-black/50 hover:border-[#FFD700]/60 hover:bg-black/70"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-[#FFD700] uppercase tracking-wider">Premium Video</h4>
                              <p className="text-[10px] text-[#C5A880]/80 font-mono mt-0.5">$4.99</p>
                            </div>
                            {setType === "premium" && (
                              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest px-2 py-0.5 bg-emerald-950/40 rounded-full border border-emerald-500/30">Selected</span>
                            )}
                          </div>
                          <p className="text-[10px] sm:text-xs text-white/70 leading-relaxed">
                            5 custom songs (120s each) + HD video with your photos, animated lyrics, and downloadable MP4.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSetType("legacy")}
                          className={`p-5 rounded-2xl border-2 text-left transition-all relative group ${
                            setType === "legacy"
                              ? "border-[#FFD700] bg-[#251e19]/90 shadow-[0_0_25px_rgba(255,215,0,0.4)]"
                              : "border-[#C5A880]/30 bg-black/50 hover:border-[#FFD700]/60 hover:bg-black/70"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-[#FFD700] uppercase tracking-wider">Legacy Bundle</h4>
                              <p className="text-[10px] text-[#C5A880]/80 font-mono mt-0.5">$12.99</p>
                            </div>
                            {setType === "legacy" && (
                              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest px-2 py-0.5 bg-emerald-950/40 rounded-full border border-emerald-500/30">Selected</span>
                            )}
                          </div>
                          <p className="text-[10px] sm:text-xs text-white/70 leading-relaxed">
                            7 premium songs (120s each) in diverse genres + HD video with photos + digital keepsake card + full archive download.
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* STRUM THE STRINGS / SUBMIT */}
                    <div className="pt-2">
                      <button
                        id="strum_generate_button"
                        type="button"
                        onClick={handleStrumSong}
                        disabled={isGenerating || !target.trim()}
                        className={`w-full px-6 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${
                          isGenerating
                            ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border border-emerald-400/50"
                            : "bg-gradient-to-r from-[#8B4513] to-[#A0522D] hover:from-[#A0522D] hover:to-[#CD853F] text-white border border-[#FFD700]/30"
                        }`}
                      >
                        {isGenerating
                          ? generationProgress < 100
                            ? `🎸 Strumming... ${generationProgress}%`
                            : "✨ Song Complete!"
                          : "🎸 Strum the Strings & Render"}
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* STAGE 2: THE AVATAR ACTIVATING & RESOLVING */}
          {stage === 2 && (
            <motion.div
              key="stage2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-xl mx-auto w-full text-center space-y-8"
            >
              
              {/* Pulsing avatar placeholder frame */}
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-4 border-[#FFD700] bg-gradient-to-tr from-[#251e19] to-[#0c0907] flex items-center justify-center shadow-[0_0_35px_rgba(255,215,0,0.3)] overflow-hidden mx-auto">
                  {/* Highly polished stylized silhouette of Haddi */}
                  <div className="relative">
                    <Music size={42} className="text-[#FFD700] opacity-80 animate-pulse" />
                    <div className="absolute -inset-2 bg-[#FFD700]/10 blur-xl rounded-full"></div>
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FFD700] text-black text-[9px] font-mono font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                  HADDI THE MINSTREL
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-display font-extrabold tracking-wider text-[#FFD700]">Haddi</h2>
                <p className="text-[11px] text-white/60 font-mono uppercase tracking-widest">Sumatran Soul • Jakarta Street Musician</p>
              </div>

              {/* Status information detailing what step is taking place */}
              <div className="space-y-4">
                <h3 className="text-xl font-display font-semibold text-white tracking-wide flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-ping"></span>
                  Plucking {target || "Audrey"}'s song frequency...
                </h3>

                {/* Highly descriptive dialog bubble displaying what the bard sees */}
                <div className="bg-black/90 border-2 border-[#C5A880] rounded-2xl p-6 text-left relative max-w-md mx-auto backdrop-blur-md">
                  <div className="absolute -top-[10px] left-[50%] -translate-x-1/2 w-4 h-4 bg-black border-t-2 border-l-2 border-[#C5A880] transform rotate-45"></div>
                  <p className="text-[#FAF9F6]/95 text-sm italic font-sans leading-relaxed text-center font-medium">
                    "{loadingStep === 0 && "Selamat datang! Haddi is tuning the acoustic guitar..."}
                     {loadingStep === 1 && "Aligning chords on the silver strings for Jakarta's warm breeze..."}
                     {loadingStep === 2 && "Reciting your special story with Sumatran soul and Jakarta energy..."}
                     {loadingStep === 3 && "Setting up my digital musician street corner vocals..."}
                     {loadingStep >= 4 && "Ada lagu! The silver strings are ready to sing your blessing..."}"
                  </p>
                </div>
              </div>

              {/* [ANIMATION: 3 GOLDEN PILLARS] Pulsing Visualizer */}
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-[#FFD700]/85 tracking-widest uppercase font-semibold">Geometric Acoustic Flow</p>
                <div className="flex justify-center items-end gap-3 h-14">
                  <div className="w-1.5 bg-[#FFD700]/50 rounded-full visualizer-pillar" style={{ height: "100%", animationDelay: "0.1s" }}></div>
                  <div className="w-1.5 bg-[#FFD700] rounded-full visualizer-pillar" style={{ height: "70%", animationDelay: "0.4s" }}></div>
                  <div className="w-1.5 bg-[#FFD700]/75 rounded-full visualizer-pillar" style={{ height: "85%", animationDelay: "0.25s" }}></div>
                  <div className="w-1.5 bg-[#FFD700]/45 rounded-full visualizer-pillar" style={{ height: "40%", animationDelay: "0.6s" }}></div>
                  <div className="w-1.5 bg-[#FFD700]/90 rounded-full visualizer-pillar" style={{ height: "95%", animationDelay: "0.33s" }}></div>
                </div>
              </div>

            </motion.div>
          )}

          {/* STAGE 3: THE NOW PLAYING SCREEN REVEAL */}
          {stage === 3 && currentSong && (
            <motion.div
              key="stage3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              
              {/* Back button and Sharing controls header */}
              <div className="flex justify-between items-center bg-black/85 border-2 border-[#C5A880] rounded-2xl px-5 py-4 backdrop-blur-md">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-[#FFD700] hover:text-white font-mono font-bold uppercase transition-colors"
                >
                  <RefreshCw size={13} /> Back to Studio
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKeepsake(true)}
                    className="flex items-center gap-1.5 text-xs text-black bg-[#FFD700] hover:brightness-110 px-3.5 py-1.5 rounded-lg font-mono font-bold transition-all cursor-pointer"
                  >
                    <Download size={13} /> Printable Card
                  </button>
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="flex items-center gap-1.5 text-xs text-white bg-green-700 hover:bg-green-600 px-3.5 py-1.5 rounded-lg font-mono font-semibold transition-colors cursor-pointer"
                  >
                    <Phone size={13} /> Send WhatsApp
                  </button>
                </div>
              </div>

              {/* Main Performance Center Block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side: Now playing title & Interactive Vinyl block */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* ASCII styled typography banner for Target */}
                  <div className="bg-black/90 border-2 border-[#C5A880] rounded-2xl p-6 text-center space-y-3 shadow-xl">
                    <span className="text-xs font-mono text-[#FFD700] tracking-widest uppercase font-bold">🎵 Now Playing For 🎵</span>
                    
                    {/* Generative big retro text displaying target name */}
                    <div className="font-mono text-xs text-neutral-500 overflow-x-auto whitespace-pre leading-none py-2 text-center max-w-full">
                      {"+-----------------------------------------------+\n"}
                      {`|    ${currentSong.target.toUpperCase().padEnd(38, " ")} |\n`}
                      {"+-----------------------------------------------+"}
                    </div>

                    <h3 className="text-2xl font-display font-semibold tracking-wide text-white">
                      {currentSong.title}
                    </h3>

                    <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FFD700] bg-black/80 border border-[#C5A880]/40 px-3 py-1 rounded font-semibold">
                      <Disc size={13} className={isPlaying ? "animate-spin text-[#FFD700]" : ""} /> 
                      {currentSong.genre} • {currentSong.tempo}
                    </div>
                  </div>

                  {/* Interactive Guitar Pluck Volume Console and Playback bar */}
                  <div className="bg-black/90 border-2 border-[#C5A880] rounded-2xl p-6 space-y-6 shadow-xl">
                    
                    <div className="flex justify-between items-center text-xs font-mono text-[#C5A880] font-bold">
                      <span>FOLK COORD SCALE</span>
                      <span>ACTIVE CHORD: <strong className="text-[#FFD700] text-sm ml-1 font-extrabold">{getChordAtTime()}</strong></span>
                    </div>

                    {/* Timeline and Drag-Seeker */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono text-white/50">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(currentSong.totalDurationSeconds)}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min={0}
                          max={currentSong.totalDurationSeconds}
                          value={currentTime}
                          onChange={(e) => handleSeek(Number(e.target.value))}
                          className="w-full accent-[#FFD700] bg-neutral-800 h-1 rounded-lg cursor-pointer"
                        />
                        <div 
                          className="absolute h-1 bg-[#FFD700] rounded-lg pointer-events-none top-0.5"
                          style={{ width: `${(currentTime / currentSong.totalDurationSeconds) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex justify-between items-center">
                      
                      <div className="flex items-center gap-3">
                        {/* Playback action toggle */}
                        <button
                          type="button"
                          onClick={togglePlayback}
                          className="w-14 h-14 rounded-full bg-[#FFD700] hover:brightness-110 text-black shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                        </button>

                        {/* Mobile Browser Native Vocalizer */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!currentSong) return;
                            const spokenText = currentSong.lyricSections
                              .map(s => {
                                const cleanLines = s.lines.filter(l => !l.startsWith("[") && !l.endsWith("]"));
                                return cleanLines.join(". ");
                              })
                              .join(". ");
                            playHaddiMobileVoice(spokenText);
                          }}
                          className={`h-11 px-4 rounded-xl border font-mono text-xs tracking-wider transition-all duration-300 flex items-center gap-2 font-semibold cursor-pointer ${
                            isVocalizing 
                              ? "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.15)] animate-pulse"
                              : "bg-black/40 text-white/70 border-[#C5A880]/30 hover:border-[#FFD700] hover:text-[#FFD700]"
                          }`}
                          title="Mobile Speech Synthesis Vocalizer"
                        >
                          <Volume2 size={16} className={isVocalizing ? "text-[#FFD700]" : ""} />
                          {isVocalizing ? "Speaking Blessing..." : "Vocalize Blessing"}
                        </button>
                      </div>

                      {/* Dynamic Volume Console */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setMuted(!muted)}
                          className="text-[#C5A880] hover:text-white transition-colors"
                        >
                          {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={volume}
                          onChange={(e) => {
                            setVolume(Number(e.target.value));
                            setMuted(false);
                          }}
                          className="w-20 accent-[#C5A880] bg-neutral-800 h-1 rounded"
                        />
                      </div>

                    </div>

                    <p className="text-[10px] text-white/30 font-mono text-center">
                      I have hand-picked the notes on the silver strings to fit your story perfectly. Feel free to drag the seeker or tap any lyric line to jump to different sections.
                    </p>

                  </div>

                  {/* Variation Swapper (Only populated in multi-track modes) */}
                  {(setType === "extended" || setType === "premium" || setType === "legacy") && allVariations.length > 1 && (
                    <div className="bg-black/90 border-2 border-[#C5A880] rounded-2xl p-5 space-y-3">
                      <span className="text-xs font-mono text-[#FFD700] tracking-wider uppercase font-bold">
                        🎁 Select Your Encore Variation:
                      </span>
                      <div className="space-y-2">
                        {allVariations.map((song, vIdx) => (
                          <button
                            key={vIdx}
                            type="button"
                            onClick={() => {
                              setActiveVariationIdx(vIdx);
                            }}
                            className={`w-full flex justify-between items-center px-3.5 py-2.5 rounded-xl text-left text-xs font-mono transition-all border-2 ${
                              activeVariationIdx === vIdx
                                ? "bg-[#271d15] border-[#FFD700] text-white"
                                : "bg-black/60 border-transparent text-[#ffffff]/50 hover:bg-black hover:text-white hover:border-[#C5A880]/50"
                            }`}
                          >
                            <span>Variation {vIdx + 1}: {song.genre}</span>
                            <span className="opacity-75">{song.tempo.split(" ")[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Back button */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-1 text-xs text-[#C5A880]/60 hover:text-[#C5A880]/90 font-mono"
                    >
                      Strum a New Dedication <ChevronRight size={12} />
                    </button>
                  </div>

                </div>

                {/* Right side: The Bronze Lyric Canvas */}
                <div className="lg:col-span-7">
                  <LyricCanvas
                    lyricSections={currentSong.lyricSections}
                    currentTimeSeconds={currentTime}
                    onLineClick={(stamp) => handleSeek(stamp)}
                  />
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* --- KEEPSAKE MODAL --- */}
      {showKeepsake && currentSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          {(() => {
            const tpl = occasionTemplates.find(t => t.id === occasion) || occasionTemplates[0];
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ backgroundColor: tpl.colorScheme.background, borderColor: tpl.colorScheme.primary }}
                className="w-full max-w-lg rounded-[2rem] shadow-2xl border-8 overflow-hidden relative"
              >
                {/* Decorative header */}
                <div style={{ backgroundColor: tpl.colorScheme.primary }} className="w-full py-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0, rgba(0,0,0,0.1) 100%)' }}></div>
                  <span className="text-6xl relative z-10 drop-shadow-md">{tpl.emoji}</span>
                  <h2 className="text-white font-display font-extrabold text-3xl mt-3 relative z-10 tracking-widest uppercase text-shadow-sm">{tpl.label}</h2>
                </div>

                {/* Modal actions */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-1.5 bg-black/20 hover:bg-black/30 rounded-full text-white text-xs font-mono flex items-center gap-1 transition-colors backdrop-blur-sm"
                    title="Print KeepSake Card"
                  >
                    Print
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowKeepsake(false)}
                    className="p-1 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Keepsake Portrait frame */}
                <div className="p-8 md:p-10 space-y-6 text-center text-print">
                  
                  {/* Elegant header */}
                  <div className="space-y-2">
                    <p style={{ color: tpl.colorScheme.primary }} className="text-[10px] font-mono tracking-widest uppercase font-bold bg-white/50 inline-block px-3 py-1 rounded-full">A Custom Song Dedication</p>
                    <h3 className="text-3xl font-display font-black text-gray-800 leading-tight">{currentSong.title}</h3>
                    <div style={{ backgroundColor: tpl.colorScheme.secondary }} className="w-16 h-1.5 mx-auto my-4 rounded-full"></div>
                    <p style={{ color: tpl.colorScheme.primary }} className="text-sm uppercase font-sans tracking-wider font-semibold">Especially for <span className="font-bold text-gray-900 text-lg block mt-1">{currentSong.target}</span></p>
                  </div>

                  {/* Body message section */}
                  <div className="border-2 border-black/5 rounded-2xl p-5 bg-white/70 max-h-[240px] overflow-y-auto text-left space-y-4 shadow-inner">
                    {currentSong.lyricSections.filter(s => s.sectionName !== "Intro").map((section, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <p style={{ color: tpl.colorScheme.primary }} className="font-mono text-[10px] font-extrabold uppercase">{section.sectionName}</p>
                        {section.lines.map((line, lIdx) => (
                          <p key={lIdx} className="font-sans text-gray-800 leading-relaxed font-medium">{line}</p>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Action row at bottom */}
                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleShareWhatsApp}
                      className="px-4 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <Phone size={16} /> WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={handleShareEmail}
                      className="px-4 py-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <Send size={16} /> Email
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLyrics}
                      style={{ backgroundColor: tpl.colorScheme.primary }}
                      className="px-4 py-2.5 text-white hover:brightness-110 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      {copiedLyrics ? <Check size={16} /> : <Copy size={16} />}
                      {copiedLyrics ? "Copied!" : "Copy Link"}
                    </button>
                  </div>

                </div>
              </motion.div>
            );
          })()}
        </div>
      )}

      {/* --- PASSWORD AUTHORIZATION MODAL GATEWAY --- */}
      {isTestStudio && !isAuthorized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md bg-[#121110] border border-[#C5A880]/30 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 text-center">
            {/* Decorative top grid accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-800 via-[#C5A880] to-red-800 rounded-t-2xl"></div>
            
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl">🔒</span>
              <h3 className="font-sans text-xl font-semibold tracking-tight text-[#C5A880]">
                Seraphim Test Studio Authorization Required
              </h3>
              <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                Bypassing active production streams requires the master security validation phrase.
              </p>
            </div>

            <form onSubmit={handleValidateAuthorization} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] uppercase tracking-wider font-mono text-[#C5A880]/70 font-bold">
                  Validation Secret
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950/80 border border-[#C5A880]/25 rounded-xl text-white text-center font-mono placeholder-neutral-700 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-500 text-[11px] font-mono mt-1 text-center font-medium">
                    ⚠️ {passwordError}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#C5A880] hover:bg-[#b0936b] text-[#121110] font-bold text-sm tracking-widest uppercase rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 animate-pulse"
                >
                  Verify Access
                </button>
                <button
                  type="button"
                  onClick={handleCancelAuthorization}
                  className="w-full py-2.5 bg-transparent hover:bg-neutral-900 text-neutral-400 hover:text-neutral-200 text-xs tracking-wider uppercase font-medium rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MINSTREL STUDIO SANDBOX ADMIN GATE --- */}
      <div 
        id="admin-gate-container" 
        style={{ 
          display: (isAdminGateVisible && isAuthorized) ? "block" : "none", 
          margin: "40px auto", 
          maxWidth: "600px", 
          padding: "30px", 
          background: "rgba(12, 11, 10, 0.95)", 
          border: "2px dashed #FFD700", 
          borderRadius: "16px", 
          boxShadow: "0 0 30px rgba(255, 215, 0, 0.2)", 
          backdropFilter: "blur(20px)", 
          WebkitBackdropFilter: "blur(20px)", 
          color: "#fff", 
          fontFamily: "sans-serif" 
        }}
        className="relative z-20"
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "2rem" }}>👑</span>
            <h2 style={{ color: "#FFD700", margin: "10px 0 5px 0", letterSpacing: "1px", fontWeight: "bold" }}>Minstrel Studio Sandbox</h2>
            <p style={{ color: "rgba(169, 169, 161, 0.7)", fontSize: "0.9rem" }}>Bypassing Live Production Lines for Verified Admin System Testing</p>
        </div>

        {/* login form */}
        <div id="sandbox-login-form" style={{ display: isAdminUnlocked ? "none" : "block" }}>
            <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", color: "#FFD700", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px", textTransform: "uppercase" }}>Master Developer ID</label>
                <input type="email" id="admin-email-input" placeholder="Enter master development email..." style={{ width: "100%", padding: "12px", background: "rgba(20, 18, 15, 0.8)", border: "1px solid rgba(255, 215, 0, 0.3)", borderRadius: "8px", color: "#fff", fontSize: "1rem", boxSizing: "border-box" }} />
            </div>
            <button onClick={verifyAdminGate} style={{ width: "100%", padding: "12px", background: "#FFD700", color: "#0c0b0a", fontWeight: "bold", fontSize: "1rem", border: "none", borderRadius: "8px", cursor: "pointer", transition: "background 0.3s ease" }}>
                Unlock Sandbox Controls
            </button>
        </div>

        {/* controls panel */}
        <div id="sandbox-controls-panel" style={{ display: isAdminUnlocked ? "block" : "none" }}>
            <div style={{ background: "rgba(255, 215, 0, 0.05)", border: "1px solid rgba(255, 215, 0, 0.2)", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#FFD700", lineHeight: "1.4" }}>
                    <strong>System Active:</strong> Operating under user verification: <code>Pswilliamh@gmail.com</code>. Transactions are fully simulated.
                </p>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", color: "rgba(169, 169, 161, 0.9)", fontSize: "0.85rem", marginBottom: "5px" }}>Recipient Email (Friend's Daughter)</label>
                <input type="email" id="test-target-email" placeholder="name@example.com" style={{ width: "100%", padding: "10px", background: "#14120f", border: "1px solid #333", borderRadius: "6px", color: "#fff", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", color: "rgba(169, 169, 161, 0.9)", fontSize: "0.85rem", marginBottom: "5px" }}>Custom Blessing Note / Story Details</label>
                <textarea id="test-story-context" rows={3} placeholder="Describe the sweet baby birth moment..." style={{ width: "100%", padding: "10px", background: "#14120f", border: "1px solid #333", borderRadius: "6px", color: "#fff", boxSizing: "border-box", resize: "vertical" }}></textarea>
            </div>

            {/* Contemporary Style Selector layout buttons inside Sandbox */}
            <div className="style-selector-section" style={{ marginTop: "15px", marginBottom: "20px" }}>
                <label style={{ color: "#FFD700", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "10px" }}>
                    Select Your Musical Style Theme:
                </label>
                <div className="style-grid-container">
                    <button 
                      type="button" 
                      onClick={() => setCustomGenre("Acoustic Folk")} 
                      className={`style-card ${customGenre === "Acoustic Folk" ? "active" : ""}`}
                    >
                      Acoustic Folk
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setCustomGenre("Bluegrass")} 
                      className={`style-card ${customGenre === "Bluegrass" ? "active" : ""}`}
                    >
                      Bluegrass
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setCustomGenre("Rustic Lute")} 
                      className={`style-card ${customGenre === "Rustic Lute" ? "active" : ""}`}
                    >
                      Rustic Lute
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={() => setCustomGenre("Modern Worship")} 
                      className={`style-card contemporary ${customGenre === "Modern Worship" ? "active" : ""}`}
                    >
                      Modern Worship
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setCustomGenre("Lofi Acoustic")} 
                      className={`style-card contemporary ${customGenre === "Lofi Acoustic" ? "active" : ""}`}
                    >
                      Lofi Acoustic
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setCustomGenre("Indie Pop")} 
                      className={`style-card contemporary ${customGenre === "Indie Pop" ? "active" : ""}`}
                    >
                      Indie Pop
                    </button>
                </div>
            </div>

            <button onClick={executeMockSongGeneration} id="test-submit-btn" style={{ width: "100%", padding: "14px", background: "#2ecc71", color: "#fff", fontWeight: "bold", fontSize: "1rem", border: "none", borderRadius: "8px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                🚀 Render Song & Send Digital Gift Card
            </button>

            <div id="sandbox-terminal" style={{ display: "none", marginTop: "20px", padding: "15px", background: "#000", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.85rem", color: "#2ecc71", lineHeight: "1.5", border: "1px solid #2ecc71" }}>
            </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="studio-footer">
        <div className="footer-container">
          <p className="footer-text flex items-center justify-center gap-2">
            © 2026 mygiftsong.org | All Rights Reserved.
            <button 
              type="button"
              onClick={() => {
                window.location.hash = '#test-studio';
              }} 
              className="text-white/10 hover:text-[#FFD700] transition-colors p-1"
              title="Admin Access"
            >
              <Lock size={10} />
            </button>
          </p>
          <a href="https://inflow.com/your-partner-id" target="_blank" rel="noopener noreferrer" className="affiliate-link">
            Powered by <span className="gold-text">Inflow</span> Network Architecture
          </a>
        </div>
      </footer>

    </div>
  );
}
