"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { 
  Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, 
  Maximize, Minimize, Settings, ChevronRight, MonitorDot, 
  X, ExternalLink, GripHorizontal 
} from "lucide-react";
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
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [showNextUp, setShowNextUp] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [showCursor, setShowCursor] = useState(true);
  const [isPipMode, setIsPipMode] = useState(false);

  // Parse YouTube ID
  const videoId = useMemo(() => {
    if (!url) return null;
    if (url.length === 11) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }, [url]);

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
      iv_load_policy: "3",
      start: startSec.toString(),
      cc_load_policy: captionsEnabled ? "1" : "0",
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, startSec, captionsEnabled]);

  const ytCommand = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  }, []);

  // Timer Ref for activity tracking
  const activityTimerRef = useRef<NodeJS.Timeout>(null);

  const resetActivityTimer = useCallback(() => {
    setShowCursor(true);
    if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    
    // In fullscreen, hide after 2 seconds
    if (isFullscreen) {
      activityTimerRef.current = setTimeout(() => {
        setShowCursor(false);
        setShowSettingsMenu(false); // Close settings if hiding
      }, 2000);
    }
  }, [isFullscreen]);

  useEffect(() => {
    resetActivityTimer();
    return () => {
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    };
  }, [isFullscreen, resetActivityTimer]);

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

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.event === "infoDelivery" && data.info) {
          if (data.info.currentTime !== undefined) {
            const absTime = data.info.currentTime;
            const relTime = Math.max(0, absTime - startSec);
            setCurrentTime(relTime);
            if (endSec && absTime >= endSec) handleSliceEnd();
          }
          if (data.info.duration !== undefined) {
            const totalDuration = data.info.duration;
            const sliceDuration = endSec ? Math.min(endSec - startSec, totalDuration - startSec) : totalDuration - startSec;
            setDuration(sliceDuration);
          }
          if (data.info.playerState !== undefined) {
            setIsPlaying(data.info.playerState === 1);
            if (data.info.playerState === 0) handleSliceEnd();
          }
        }
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    const interval = setInterval(() => {
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening" }), "*");
    }, 1000);
    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(interval);
    };
  }, [videoId, startSec, endSec, handleSliceEnd]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showNextUp && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
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
    resetActivityTimer();
  };

  const toggleMute = () => {
    if (isMuted) ytCommand("unMute");
    else ytCommand("mute");
    setIsMuted(!isMuted);
    resetActivityTimer();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    ytCommand("setVolume", [v * 100]);
    resetActivityTimer();
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
    resetActivityTimer();
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackSpeed(newSpeed);
    ytCommand("setPlaybackRate", [newSpeed]);
    resetActivityTimer();
  };

  const togglePipMode = () => {
    setIsPipMode(!isPipMode);
    if (!isPipMode) setIsFullscreen(false); // Can't be fullscreen and PiP
  };

  function formatTime(secs: number) {
    if (!isFinite(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  if (!videoId) return <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-500 font-bold border border-white/5 rounded-2xl">Invalid Video ID</div>;

  return (
    <>
      <div 
        ref={playerContainerRef}
        onMouseMove={resetActivityTimer}
        onMouseEnter={resetActivityTimer}
        className={`
          relative bg-[#050510] overflow-hidden group/player select-none 
          transition-all duration-500 ease-in-out shadow-2xl ring-1 ring-white/5
          ${isPipMode 
            ? "fixed bottom-6 right-6 w-[360px] aspect-video z-[9999] rounded-xl ring-2 ring-violet-500/50" 
            : "w-full aspect-video rounded-2xl"}
          ${!isPipMode && !isFullscreen ? "z-10" : ""}
          ${!showCursor && isFullscreen ? "cursor-none" : "cursor-default"}
        `}
      >
        {/* DRAG HANDLE FOR PIP */}
        {isPipMode && (
          <motion.div 
            drag
            dragConstraints={{ left: -1000, right: 0, top: -800, bottom: 0 }}
            className="absolute inset-0 z-[100] cursor-move"
            style={{ pointerEvents: isPipMode ? "auto" : "none" }}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 p-1.5 bg-black/40 backdrop-blur-md rounded-full text-violet-400 opacity-0 group-hover/player:opacity-100 transition-opacity flex items-center gap-2">
              <GripHorizontal size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest pr-2">Drag to move</span>
            </div>
          </motion.div>
        )}

        {/* Next Up Overlay */}
        <AnimatePresence>
          {showNextUp && !isPipMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[#08080f]/98 backdrop-blur-xl"
            >
              <div className="max-w-md w-full text-center">
                <p className="text-violet-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Up Next</p>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-8 line-clamp-2 leading-tight px-4">
                  {nextLessonTitle}
                </h3>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
                  <button
                    onClick={() => { onNextUpConfirm?.(); setShowNextUp(false); }}
                    className="w-full sm:flex-1 bg-white text-black font-black py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                  >
                    Play now <span className="text-gray-400 font-mono text-sm ml-1 group-hover:text-black transition-colors">{countdown}s</span>
                  </button>
                  <button
                    onClick={() => setShowNextUp(false)}
                    className="w-full sm:px-8 py-4 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all active:scale-95"
                  >
                    Stay
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exit PiP Buttons */}
        {isPipMode && (
          <div className="absolute top-2 right-2 z-[110] flex gap-2 opacity-0 group-hover/player:opacity-100 transition-opacity">
            <button 
              onClick={togglePipMode}
              className="p-2 bg-black/60 rounded-full text-white backdrop-blur-md hover:bg-violet-600/80 transition-colors"
            >
              <Maximize size={16} />
            </button>
            <button 
              onClick={togglePlay}
              className="p-2 bg-black/60 rounded-full text-white backdrop-blur-md hover:bg-red-600/80 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full border-0 pointer-events-none scale-[1.01]"
          title={title}
          allow="autoplay; encrypted-media"
        />

        {/* CLICK OVERLAY */}
        <div 
          className="absolute inset-0 z-10 cursor-pointer" 
          onClick={togglePlay} 
          onMouseMove={resetActivityTimer}
          aria-label="Toggle Play" 
        />

        {/* CONTROLS OVERLAY - NO CSS HOVER ON DESKTOP FULLSCREEN TO PREVENT STICKY CONTROLS */}
        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent 
          transition-opacity duration-300 z-20 pointer-events-none
          ${(showCursor || !isFullscreen) ? "opacity-100" : "opacity-0"}
          ${!isPipMode ? "group-hover/player:opacity-100" : "opacity-0 hover:opacity-100"}
        `}>
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 pointer-events-auto">
            {/* Progress Bar */}
            <div className={`relative h-1 w-full bg-white/10 rounded-full mb-4 sm:mb-6 group/progress cursor-pointer overflow-hidden ${isPipMode ? 'mb-2 h-0.5' : ''}`} onClick={handleSeek}>
              <div
                className="absolute top-0 left-0 h-full bg-violet-600 rounded-full transition-all duration-150"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-4 sm:gap-6">
                <button 
                  onClick={togglePlay} 
                  className="text-white hover:text-violet-400 transform transition-all active:scale-90"
                >
                  {isPlaying ? <Pause size={isPipMode ? 18 : 22} fill="currentColor" /> : <Play size={isPipMode ? 18 : 22} fill="currentColor" />}
                </button>

                {!isPipMode && (
                  <>
                    <div className="flex items-center gap-2 group/volume relative">
                      <button onClick={toggleMute} className="text-white hover:text-violet-400 transition-colors">
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <div className="w-0 group-hover/volume:w-24 overflow-hidden transition-all duration-300 ease-out flex items-center">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20 accent-violet-500 ml-2 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={rewind} className="hidden sm:block text-gray-500 hover:text-white transition-colors">
                        <RotateCcw size={18} />
                      </button>
                      <div className="text-[10px] sm:text-xs font-mono text-gray-300 tracking-widest tabular-nums font-bold">
                        {formatTime(currentTime)} <span className="text-gray-600 mx-1">/</span> {formatTime(duration)}
                      </div>
                      <button onClick={skip} className="hidden sm:block text-gray-500 hover:text-white transition-colors">
                        <RotateCw size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-4 sm:gap-6 relative">
                {!isPipMode && (
                  <>
                    <button
                      onClick={cycleSpeed}
                      className="text-gray-400 hover:text-white text-[11px] font-black w-10 h-7 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center"
                    >
                      {playbackSpeed}x
                    </button>

                    <button
                      onClick={() => { setCaptionsEnabled(!captionsEnabled); resetActivityTimer(); }}
                      className={`relative transition-colors ${captionsEnabled ? "text-violet-400" : "text-gray-500 hover:text-white"}`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
                      </svg>
                    </button>

                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowSettingsMenu(!showSettingsMenu); resetActivityTimer(); }}
                        className={`transition-all ${showSettingsMenu ? "text-violet-400 rotate-45" : "text-gray-500 hover:text-white"}`}
                      >
                        <Settings size={20} />
                      </button>
                      <AnimatePresence>
                        {showSettingsMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute bottom-12 right-0 bg-[#080812] border border-white/10 rounded-2xl p-2.5 min-w-[160px] shadow-2xl backdrop-blur-3xl z-30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2 px-2">Settings</p>
                            <div className="space-y-0.5">
                              <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-gray-400 border border-white/5">
                                <span>Quality</span>
                                <span className="text-violet-400">Auto</span>
                              </div>
                              {[1, 1.25, 1.5, 2].map((s) => (
                                <button
                                  key={s}
                                  onClick={() => { setPlaybackSpeed(s); ytCommand("setPlaybackRate", [s]); setShowSettingsMenu(false); }}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                    playbackSpeed === s ? "bg-violet-600/20 text-violet-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                  }`}
                                >
                                  <span>Speed</span>
                                  <span>{s === 1 ? "Normal" : `${s}x`}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}

                <button 
                  onClick={togglePipMode}
                  className={`${isPipMode ? "text-violet-400" : "text-gray-500 hover:text-white"}`}
                >
                  <MonitorDot size={isPipMode ? 16 : 18} />
                </button>

                <button 
                  onClick={toggleFullscreen} 
                  className="text-gray-500 hover:text-white"
                >
                  {isFullscreen ? <Minimize size={isPipMode ? 18 : 20} /> : <Maximize size={isPipMode ? 18 : 20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for PiP to prevent layout shift when toggling */}
      {isPipMode && (
        <div className="w-full aspect-video bg-gray-900/40 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-6">
          <ExternalLink size={32} className="text-gray-700 mb-4" />
          <p className="text-sm font-bold text-gray-500">Video is playing in mini-player</p>
          <button 
            onClick={togglePipMode}
            className="mt-4 text-xs font-bold text-violet-400 hover:underline"
          >
            Bring it back
          </button>
        </div>
      )}
    </>
  );
};

export default CourseVideoPlayer;
