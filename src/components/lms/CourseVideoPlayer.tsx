"use client";

import React, { useRef, useState, useEffect } from "react";
import { Maximize, Minimize, Volume2, VolumeX, RotateCcw, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CourseVideoPlayerProps {
  url: string;
  title: string;
  startSec?: number;
  endSec?: number;
  onEnded?: () => void;
  onProgress?: (currentTime: number, duration: number) => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/** Build a YouTube embed src from a watch URL + options */
function buildYouTubeSrc(url: string, startSec: number, endSec?: number): string {
  // Extract video ID from various YouTube URL formats
  let videoId = "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      videoId = u.pathname.slice(1);
    } else {
      videoId = u.searchParams.get("v") ?? "";
    }
  } catch {
    const match = url.match(/[?&]v=([^&]+)/);
    if (match) videoId = match[1];
  }

  const params = new URLSearchParams({
    autoplay: "0",
    controls: "0",          // hide YouTube controls
    rel: "0",                // no related videos
    modestbranding: "1",
    iv_load_policy: "3",     // hide annotations
    disablekb: "1",
    fs: "0",                 // hide fullscreen button (we use our own)
    start: String(startSec ?? 0),
    ...(endSec ? { end: String(endSec) } : {}),
    enablejsapi: "1",        // needed for JS API
    origin: typeof window !== "undefined" ? window.location.origin : "",
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function isYouTube(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export default function CourseVideoPlayer({
  url,
  title,
  startSec = 0,
  endSec,
  onEnded,
}: CourseVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ytPlayerReady = useRef(false);

  const youtube = isYouTube(url);
  const embedSrc = youtube ? buildYouTubeSrc(url, startSec, endSec) : null;

  // ── Fullscreen listener
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ── Native video progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video || youtube) return;
    const onTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
      if (endSec && video.currentTime >= endSec) {
        video.pause();
        setPlaying(false);
        onEnded?.();
      }
    };
    const onLoaded = () => setDuration(video.duration || 0);
    const onEnd = () => { setPlaying(false); onEnded?.(); };
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("ended", onEnd);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("ended", onEnd);
    };
  }, [youtube, endSec, onEnded]);

  // ── YouTube postMessage API for time tracking
  useEffect(() => {
    if (!youtube) return;
    const handler = (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "onStateChange") {
          // 1 = playing, 2 = paused, 0 = ended
          if (data.info === 1) setPlaying(true);
          if (data.info === 2) setPlaying(false);
          if (data.info === 0) { setPlaying(false); onEnded?.(); }
        }
      } catch { /* ignore non-JSON messages */ }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [youtube, onEnded]);

  // ── Controls auto-hide
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const togglePlay = () => {
    if (youtube) {
      // Send postMessage to YouTube iframe
      const func = playing ? "pauseVideo" : "playVideo";
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args: [] }),
        "*"
      );
      setPlaying((p) => !p);
    } else {
      const video = videoRef.current;
      if (!video) return;
      if (playing) video.pause(); else void video.play();
      setPlaying((p) => !p);
    }
  };

  const replay10 = () => {
    if (!youtube && videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const toggleMute = () => {
    if (!youtube && videoRef.current) {
      videoRef.current.muted = !muted;
    }
    setMuted((m) => !m);
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (youtube || !videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = frac * duration;
  };

  const changeSpeed = (s: number) => {
    setSpeed(s);
    if (!youtube && videoRef.current) videoRef.current.playbackRate = s;
    setShowSettings(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const played = duration > 0 ? currentTime / duration : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
      className="relative w-full bg-black overflow-hidden select-none"
      style={{ aspectRatio: "16/9", maxHeight: "520px" }}
    >
      {/* ── YouTube iframe ── */}
      {youtube && embedSrc && (
        <iframe
          ref={iframeRef}
          src={embedSrc}
          title={title}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      )}

      {/* ── Native Video ── */}
      {!youtube && (
        <video
          ref={videoRef}
          src={url}
          muted={muted}
          playsInline
          onClick={togglePlay}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        />
      )}

      {/* ── Dim overlay when paused (YouTube) ── */}
      {youtube && (
        <AnimatePresence>
          {!playing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={togglePlay}
              className="absolute inset-0 cursor-pointer z-10"
              style={{ background: "rgba(0,0,0,0.25)" }}
            />
          )}
        </AnimatePresence>
      )}

      {/* ── Center Play Button ── */}
      <AnimatePresence>
        {!playing && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center z-20 w-full h-full"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center border border-white/25 shadow-2xl transition-transform hover:scale-110"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}
            >
              <svg className="ml-1" width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Controls Bar ── */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-3 pt-10"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)" }}
          >
            {/* Progress bar (native video only) */}
            {!youtube && (
              <div
                className="w-full h-1 rounded-full mb-3 cursor-pointer relative group/bar"
                style={{ background: "rgba(255,255,255,0.15)" }}
                onClick={handleSeekClick}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${played * 100}%`,
                    background: "linear-gradient(90deg, #7c3aed, #a855f7)",
                    boxShadow: "0 0 6px rgba(168,85,247,0.5)",
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity"
                  style={{ left: `calc(${played * 100}% - 6px)` }}
                />
              </div>
            )}
            {/* YouTube — thin decorative bar (no seek needed — YT handles it */}
            {youtube && (
              <div className="w-full h-0.5 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.1)" }} />
            )}

            {/* Controls row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Play / Pause */}
                <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                  {playing ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </button>

                {/* Replay 10s (native only) */}
                {!youtube && (
                  <button onClick={replay10} className="text-white/70 hover:text-white transition-colors">
                    <RotateCcw size={15} />
                  </button>
                )}

                {/* Mute (native only — YouTube has its own volume) */}
                {!youtube && (
                  <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                    {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                )}

                {/* Time (native only) */}
                {!youtube && (
                  <span className="text-[11px] font-mono text-white/50 tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                )}
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-3 relative">
                {/* Speed (native only — YouTube controls its own speed) */}
                {!youtube && (
                  <div className="relative">
                    <button
                      onClick={() => setShowSettings((s) => !s)}
                      className="text-[11px] font-bold text-white/60 hover:text-white px-2 py-0.5 rounded border border-white/15 hover:border-white/30 transition-all"
                    >
                      {speed}x
                    </button>
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.95 }}
                          className="absolute bottom-full right-0 mb-2 w-32 rounded-xl overflow-hidden z-50"
                          style={{ background: "rgba(10,10,20,0.97)", border: "1px solid rgba(124,58,237,0.25)", backdropFilter: "blur(20px)" }}
                        >
                          <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-600 px-3 py-2 border-b border-white/5">Speed</p>
                          {SPEEDS.map((s) => (
                            <button
                              key={s}
                              onClick={() => changeSpeed(s)}
                              className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-white/5 transition-colors"
                              style={{ color: speed === s ? "#a78bfa" : "#9ca3af" }}
                            >
                              {s === 1 ? "Normal" : `${s}x`}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* YouTube label */}
                {youtube && (
                  <span className="text-[10px] text-white/30 font-semibold">YouTube</span>
                )}

                <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors">
                  {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
