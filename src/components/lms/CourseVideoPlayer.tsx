"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, Maximize, Minimize, Settings, Monitor, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  url: string;
  title: string;
  startSec?: number;
  endSec?: number;
  onEnded?: () => void;
  nextLessonTitle?: string;
  onNextUpConfirm?: () => void;
}

const CourseVideoPlayer = ({ url, title, startSec = 0, endSec, onEnded, nextLessonTitle, onNextUpConfirm }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [showNextUp, setShowNextUp] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Parse YouTube ID
  const videoId = useMemo(() => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }, [url]);

  // Build Embed URL with params
  const embedUrl = useMemo(() => {
    if (!videoId) return "";
    const params = new URLSearchParams({
      autoplay: "1",
      controls: "0",
      disablekb: "1",
      enablejsapi: "1",
      fs: "0",
      modestbranding: "1",
      rel: "0",
      showinfo: "0",
      start: startSec.toString(),
      origin: typeof window !== "undefined" ? window.location.origin : "",
      cc_load_policy: captionsEnabled ? "1" : "0",
    });
    // Use the nocookie domain for better privacy/compatibility
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, startSec, captionsEnabled]);

  const ytCommand = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  }, []);

  const handleSliceEnd = useCallback(() => {
    ytCommand("pauseVideo");
    setIsPlaying(false);
    if (nextLessonTitle && onNextUpConfirm) {
      setShowNextUp(true);
      setCountdown(10);
    } else {
      onEnded?.();
    }
  }, [nextLessonTitle, onNextUpConfirm, onEnded, ytCommand]);

  // Listen for YouTube state changes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.event === "infoDelivery" && data.info) {
          if (data.info.currentTime !== undefined) {
            const absTime = data.info.currentTime;
            const relTime = Math.max(0, absTime - startSec);
            setCurrentTime(relTime);

            // Handle endSec logic
            if (endSec && absTime >= endSec) {
              handleSliceEnd();
            }
          }
          if (data.info.duration !== undefined) {
            const totalDuration = data.info.duration;
            const sliceDuration = endSec ? Math.min(endSec - startSec, totalDuration - startSec) : totalDuration - startSec;
            setDuration(sliceDuration);
          }
          if (data.info.playerState !== undefined) {
            setIsPlaying(data.info.playerState === 1);
            if (data.info.playerState === 0) {
              handleSliceEnd();
            }
          }
        }
      } catch {
        // Not a JSON message or not from YT
      }
    };

    window.addEventListener("message", handleMessage);
    // Poll for status
    const interval = setInterval(() => {
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening" }), "*");
    }, 500);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(interval);
    };
  }, [videoId, startSec, endSec, handleSliceEnd]);

  // Next Up Countdown Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showNextUp && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showNextUp && countdown === 0) {
      onNextUpConfirm?.();
      setShowNextUp(false);
    }
    return () => clearInterval(timer);
  }, [showNextUp, countdown, onNextUpConfirm]);

  const togglePlay = () => {
    if (isPlaying) ytCommand("pauseVideo");
    else ytCommand("playVideo");
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (isMuted) ytCommand("unMute");
    else ytCommand("mute");
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    ytCommand("setVolume", [v * 100]);
  };

  const rewind = () => ytCommand("seekTo", [Math.max(0, (currentTime + startSec) - 10), true]);
  const skip = () => ytCommand("seekTo", [Math.min(duration + startSec, (currentTime + startSec) + 10), true]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    ytCommand("seekTo", [startSec + (percent * duration), true]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    ytCommand("setPlaybackRate", [speed]);
    setShowSpeedMenu(false);
    setShowSettingsMenu(false);
  };

  function formatTime(secs: number) {
    if (!isFinite(secs) || secs < 0) return "0:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  if (!videoId) return <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-500">Invalid Video URL</div>;

  return (
    <div ref={playerContainerRef} className="relative aspect-video w-full bg-black overflow-hidden group/player select-none rounded-xl shadow-2xl">
      {/* Next Up Overlay */}
      <AnimatePresence>
        {showNextUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[#08080f]/95 backdrop-blur-sm"
          >
            <div className="max-w-md w-full text-center">
              <p className="text-violet-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Next Lesson Up</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-8 line-clamp-2 leading-tight">
                {nextLessonTitle}
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    onNextUpConfirm?.();
                    setShowNextUp(false);
                  }}
                  className="w-full sm:flex-1 bg-white text-black font-black py-4 rounded-2xl hover:bg-violet-50 transition-all flex items-center justify-center gap-2 group"
                >
                  Play Now <span className="text-gray-400 font-mono text-sm ml-1 group-hover:text-black transition-colors">{countdown}s</span>
                </button>
                <button
                  onClick={() => setShowNextUp(false)}
                  className="w-full sm:px-8 py-4 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all"
                >
                  Stay Here
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="w-full h-full border-0 pointer-events-none"
        title={title}
        allow="autoplay; encrypted-media"
      />

      {/* CLICK OVERLAY */}
      <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />

      {/* CONTROLS */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pointer-events-auto">
          {/* Progress Bar */}
          <div className="relative h-1.5 w-full bg-white/20 rounded-full mb-5 group/progress cursor-pointer overflow-hidden" onClick={handleSeek}>
            <div
              className="absolute top-0 left-0 h-full bg-violet-600 rounded-full transition-all duration-150"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={togglePlay} className="text-white hover:text-violet-400 transition-colors">
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>

              <div className="flex items-center gap-2 group/volume relative">
                <button onClick={toggleMute} className="text-white hover:text-violet-400 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-violet-600 hidden group-hover/volume:block transition-all"
                />
              </div>

              <div className="flex items-center gap-4">
                <button onClick={rewind} className="text-gray-400 hover:text-white transition-colors">
                  <RotateCcw size={18} />
                </button>
                <div className="text-xs font-mono text-white tracking-widest tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <button onClick={skip} className="text-gray-400 hover:text-white transition-colors">
                  <RotateCw size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 relative">
              {/* CC Button */}
              <button
                onClick={() => setCaptionsEnabled(!captionsEnabled)}
                className={`transition-colors relative ${captionsEnabled ? "text-violet-400" : "text-gray-400 hover:text-white"}`}
                title="Captions"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
                </svg>
                {captionsEnabled && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-violet-400 rounded-full" />}
              </button>

              {/* Settings Gear */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSettingsMenu(!showSettingsMenu); }}
                  className={`transition-colors ${showSettingsMenu ? "text-violet-400 rotate-45" : "text-gray-400 hover:text-white"} transition-transform duration-300`}
                >
                  <Settings size={20} />
                </button>

                <AnimatePresence>
                  {showSettingsMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-full right-0 mb-4 bg-[#0a0a14] border border-white/10 rounded-2xl p-3 min-w-[180px] shadow-2xl backdrop-blur-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 px-2">Settings</p>
                      
                      <div className="space-y-1">
                        <div 
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        >
                          <span className="text-xs text-gray-300 font-bold">Speed</span>
                          <span className="text-xs text-violet-400 font-black flex items-center gap-1">
                            {playbackSpeed}x <ChevronRight size={12} className="text-gray-600 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>

                        {showSpeedMenu && (
                          <div className="grid grid-cols-3 gap-1 p-1 mt-1 bg-black/40 rounded-xl">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                              <button
                                key={s}
                                onClick={() => changeSpeed(s)}
                                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                  playbackSpeed === s ? "bg-violet-600 text-white" : "text-gray-500 hover:text-white"
                                }`}
                              >
                                {s}x
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="px-3 py-2.5 opacity-30 cursor-not-allowed flex items-center justify-between">
                          <span className="text-xs text-gray-300 font-bold">Quality</span>
                          <span className="text-[10px] text-gray-600 font-black">Auto</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="text-gray-400 hover:text-white transition-colors">
                <Monitor size={18} />
              </button>

              <button onClick={toggleFullscreen} className="text-gray-400 hover:text-white transition-colors">
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseVideoPlayer;
