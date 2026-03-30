"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, Maximize, Minimize, Settings, ChevronRight, MonitorDot } from "lucide-react";
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

  // Parse YouTube ID (handles both IDs and full URLs)
  const videoId = useMemo(() => {
    if (!url) return null;
    if (url.length === 11) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }, [url]);

  // Build Reliability-focused Embed URL
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
      // Removing 'origin' often fixes "Video Unavailable" on localhost
      cc_load_policy: captionsEnabled ? "1" : "0",
    });
    // Use standard youtube.com (sometimes nocookie is blocked/restricts features)
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
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

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackSpeed(newSpeed);
    ytCommand("setPlaybackRate", [newSpeed]);
  };

  const setFixedSpeed = (s: number) => {
    setPlaybackSpeed(s);
    ytCommand("setPlaybackRate", [s]);
    setShowSettingsMenu(false);
  };

  const togglePiP = async () => {
    // Note: Iframe PiP is limited by browser support for YT frames.
    // Most browsers allow users to right-click twice on YT video for native PiP.
    // Programmatic PiP often works best with native <video> elements.
    try {
      if ((document as any).pictureInPictureElement) {
        await (document as any).exitPictureInPicture();
      } else if (iframeRef.current) {
        // Fallback or specific library would go here.
        // For now, we alert the user of the double-right-click trick for YT.
      }
    } catch (e) {
      console.error("PiP failed", e);
    }
  };

  function formatTime(secs: number) {
    if (!isFinite(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  if (!videoId) return <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-500 font-bold border border-white/5 rounded-2xl">Invalid Video ID</div>;

  return (
    <div ref={playerContainerRef} className="relative aspect-video w-full bg-[#050510] overflow-hidden group/player select-none rounded-2xl shadow-2xl ring-1 ring-white/5">
      {/* Next Up Overlay */}
      <AnimatePresence>
        {showNextUp && (
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

      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="w-full h-full border-0 pointer-events-none scale-[1.01]"
        title={title}
        allow="autoplay; encrypted-media"
      />

      {/* CLICK OVERLAY */}
      <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} aria-label="Toggle Play" />

      {/* CONTROLS */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pointer-events-auto">
          {/* Progress Bar */}
          <div className="relative h-1 w-full bg-white/10 rounded-full mb-6 group/progress cursor-pointer overflow-hidden" onClick={handleSeek}>
            <div
              className="absolute top-0 left-0 h-full bg-violet-600 rounded-full transition-all duration-150"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            {/* Knob visible on hover */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 shadow-lg"
              style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-6">
              <button 
                onClick={togglePlay} 
                className="text-white hover:text-violet-400 transform transition-all active:scale-90"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
              </button>

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

              <div className="flex items-center gap-4">
                <button onClick={rewind} className="text-gray-500 hover:text-white transition-colors" title="Rewind 10s">
                  <RotateCcw size={18} />
                </button>
                <div className="text-[10px] sm:text-xs font-mono text-gray-300 tracking-widest tabular-nums font-bold">
                  {formatTime(currentTime)} <span className="text-gray-600 mx-1">/</span> {formatTime(duration)}
                </div>
                <button onClick={skip} className="text-gray-500 hover:text-white transition-colors" title="Skip 10s">
                  <RotateCw size={18} />
                </button>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-5 sm:gap-6 relative">
              {/* Quick Speed Cycle */}
              <button
                onClick={cycleSpeed}
                className="text-gray-400 hover:text-white text-[11px] font-black w-10 h-7 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
                title="Cycle Speed"
              >
                {playbackSpeed}x
              </button>

              {/* CC Button */}
              <button
                onClick={() => setCaptionsEnabled(!captionsEnabled)}
                className={`transition-all relative ${captionsEnabled ? "text-violet-400" : "text-gray-500 hover:text-white"}`}
                title="Captions (CC)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
                </svg>
                {captionsEnabled && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-violet-400 rounded-full" />}
              </button>

              {/* Settings Gear - Positioned to prevent clipping */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSettingsMenu(!showSettingsMenu); }}
                  className={`transition-all ${showSettingsMenu ? "text-violet-400 rotate-45" : "text-gray-500 hover:text-white"} transform active:scale-90`}
                  title="Settings"
                >
                  <Settings size={20} />
                </button>

                <AnimatePresence>
                  {showSettingsMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      // Using bottom-12 to ensure it stays well within the player box
                      className="absolute bottom-12 right-0 bg-[#080812] border border-white/10 rounded-2xl p-2.5 min-w-[160px] shadow-2xl backdrop-blur-3xl z-30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2 px-2">Settings</p>
                      
                      <div className="space-y-0.5">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => setFixedSpeed(s)}
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

              {/* PiP Button */}
              <button 
                onClick={togglePiP}
                className="text-gray-500 hover:text-white transition-all active:scale-90" 
                title="Picture-in-Picture"
              >
                <MonitorDot size={18} />
              </button>

              <button 
                onClick={toggleFullscreen} 
                className="text-gray-500 hover:text-white transition-all active:scale-90"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
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
