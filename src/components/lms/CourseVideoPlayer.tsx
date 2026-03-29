"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Maximize, Minimize, Volume2, VolumeX, RotateCcw, Settings, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CourseVideoPlayerProps {
  url: string;
  title: string;
  startSec?: number;
  endSec?: number;
  onEnded?: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function extractYouTubeId(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("?")[0];
    return u.searchParams.get("v") ?? "";
  } catch {
    const m = url.match(/[?&]v=([^&]+)/);
    return m?.[1] ?? "";
  }
}

function isYouTubeUrl(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function buildEmbedSrc(videoId: string, startSec: number, endSec?: number) {
  const params = new URLSearchParams({
    enablejsapi: "1",
    autoplay: "0",
    controls: "0",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
    playsinline: "1",
    start: String(startSec),
    ...(endSec ? { end: String(endSec) } : {}),
    origin: typeof window !== "undefined" ? window.location.origin : "https://edunova-lms.vercel.app",
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}

function formatTime(secs: number) {
  if (!isFinite(secs) || secs < 0) return "0:00";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
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
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isYT = isYouTubeUrl(url);
  const videoId = isYT ? extractYouTubeId(url) : "";
  const embedSrc = isYT ? buildEmbedSrc(videoId, startSec, endSec) : null;

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPiP, setIsPiP] = useState(false);

  // time state (native video only — YouTube polling is limited)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const played = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  // ── YouTube postMessage control ─────────────────────────────────────────
  const ytCommand = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*"
    );
  }, []);

  // Listen for YT state changes
  useEffect(() => {
    if (!isYT) return;
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "onStateChange") {
          // YT states: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
          if (data.info === 1) setPlaying(true);
          if (data.info === 2) setPlaying(false);
          if (data.info === 0) { setPlaying(false); onEnded?.(); }
        }
        if (data?.event === "infoDelivery" && data?.info?.currentTime !== undefined) {
          setCurrentTime(data.info.currentTime as number);
          if (data.info.duration) setDuration(data.info.duration as number);
          // enforce endSec
          if (endSec && (data.info.currentTime as number) >= endSec) {
            ytCommand("pauseVideo");
            setPlaying(false);
            onEnded?.();
          }
        }
      } catch { /* ignore */ }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [isYT, endSec, onEnded, ytCommand]);

  // Poll YT for time info every 500ms
  useEffect(() => {
    if (!isYT || !playing) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening" }), "*"
      );
    }, 500);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [isYT, playing]);

  // ── Native video events ─────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v || isYT) return;
    const onTime = () => {
      setCurrentTime(v.currentTime);
      if (endSec && v.currentTime >= endSec) {
        v.pause(); setPlaying(false); onEnded?.();
      }
    };
    const onMeta = () => setDuration(v.duration);
    const onEnd = () => { setPlaying(false); onEnded?.(); };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnd);
    if (startSec > 0) v.currentTime = startSec;
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnd);
    };
  }, [isYT, startSec, endSec, onEnded]);

  // ── Fullscreen ──────────────────────────────────────────────────────────
  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  // ── Controls auto-hide ──────────────────────────────────────────────────
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  // ── Actions ─────────────────────────────────────────────────────────────
  const togglePlay = () => {
    if (isYT) {
      if (playing) ytCommand("pauseVideo"); else ytCommand("playVideo");
      setPlaying((p) => !p);
    } else {
      const v = videoRef.current;
      if (!v) return;
      if (playing) v.pause(); else void v.play();
      setPlaying((p) => !p);
    }
    resetControlsTimer();
  };

  const replay10 = () => {
    if (isYT) {
      ytCommand("seekTo", [Math.max(0, currentTime - 10), true]);
    } else if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  const forward10 = () => {
    if (isYT) {
      ytCommand("seekTo", [currentTime + 10, true]);
    } else if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    }
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (isYT) { next ? ytCommand("mute") : ytCommand("unMute"); }
    else if (videoRef.current) videoRef.current.muted = next;
  };

  const changeSpeed = (s: number) => {
    setSpeed(s);
    if (isYT) ytCommand("setPlaybackRate", [s]);
    else if (videoRef.current) videoRef.current.playbackRate = s;
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const togglePiP = async () => {
    if (!isYT && videoRef.current) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t = frac * duration;
    if (isYT) ytCommand("seekTo", [t, true]);
    else if (videoRef.current) videoRef.current.currentTime = t;
    setCurrentTime(t);
  };

  // Segment duration for display
  const segDuration = endSec ? endSec - startSec : duration;
  const segCurrent = Math.max(0, currentTime - startSec);

  return (
    <div
      ref={containerRef}
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => playing && setShowControls(false)}
      className="relative w-full bg-black overflow-hidden select-none"
      style={{ aspectRatio: "16/9", maxHeight: "520px" }}
    >
      {/* ── YouTube iframe ── */}
      {isYT && embedSrc && (
        <iframe
          ref={iframeRef}
          src={embedSrc}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0 pointer-events-none"
        />
      )}

      {/* ── Native video ── */}
      {!isYT && (
        <video
          ref={videoRef}
          src={url}
          muted={muted}
          playsInline
          onClick={togglePlay}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* ── Click overlay (capture clicks on iframe) ── */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={togglePlay}
      />

      {/* ── Center play button (when paused) ── */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform"
              style={{ background: "rgba(255,255,255,0.13)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <svg className="ml-1" width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Controls Bar ── */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 14, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-0 left-0 right-0 z-30 px-3 pb-2.5 pt-12"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)" }}
          >
            {/* ── Progress bar ── */}
            <div
              className="w-full mb-2 cursor-pointer group/bar flex items-center"
              style={{ height: "16px" }}
              onClick={handleSeek}
            >
              <div className="relative w-full" style={{ height: "3px" }}>
                {/* Track */}
                <div className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                {/* Played */}
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all"
                  style={{
                    width: `${played * 100}%`,
                    background: "linear-gradient(90deg, #7c3aed, #a855f7)",
                    boxShadow: "0 0 8px rgba(168,85,247,0.6)",
                  }}
                />
                {/* Scrubber dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover/bar:opacity-100 transition-all z-10 -translate-x-1/2"
                  style={{ left: `${played * 100}%` }}
                />
              </div>
            </div>

            {/* ── Controls Row ── */}
            <div className="flex items-center justify-between gap-2">
              {/* LEFT controls */}
              <div className="flex items-center gap-2.5">
                {/* Play/Pause */}
                <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform flex-shrink-0">
                  {playing ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Volume */}
                <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                {/* Replay 10s */}
                <button
                  onClick={replay10}
                  className="text-white/70 hover:text-white transition-colors relative"
                  title="Rewind 10 seconds"
                >
                  <RotateCcw size={15} />
                  <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white" style={{ marginTop: "1px" }}>10</span>
                </button>

                {/* Time */}
                <span className="text-[11px] font-mono text-white/60 tabular-nums text-nowrap">
                  {formatTime(segCurrent)} / {formatTime(segDuration > 0 ? segDuration : 0)}
                </span>

                {/* Forward 10s */}
                <button
                  onClick={forward10}
                  className="text-white/70 hover:text-white transition-colors relative"
                  title="Skip 10 seconds"
                >
                  {/* Flip the RotateCcw to make it go forward */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}>
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white" style={{ marginTop: "1px" }}>10</span>
                </button>
              </div>

              {/* RIGHT controls */}
              <div className="flex items-center gap-2.5">
                {/* Speed */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings((s) => !s)}
                    className="text-[11px] font-bold text-white/70 hover:text-white transition-colors min-w-[24px]"
                  >
                    {speed}x
                  </button>
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        className="absolute bottom-full right-0 mb-3 w-32 rounded-xl overflow-hidden z-50"
                        style={{ background: "rgba(8,8,15,0.98)", border: "1px solid rgba(124,58,237,0.3)", backdropFilter: "blur(20px)" }}
                      >
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-600 px-3 pt-2 pb-1.5 border-b border-white/5">
                          Playback Speed
                        </p>
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

                {/* Settings */}
                <button className="text-white/70 hover:text-white transition-colors" title="Settings">
                  <Settings size={15} />
                </button>

                {/* Captions */}
                <button className="text-white/70 hover:text-white transition-colors" title="Captions">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
                  </svg>
                </button>

                {/* Theater / Mini player */}
                <button className="text-white/70 hover:text-white transition-colors" title="Mini player">
                  <Monitor size={15} />
                </button>

                {/* Picture-in-Picture (native video only) */}
                {!isYT && (
                  <button
                    onClick={() => void togglePiP()}
                    className="text-white/70 hover:text-white transition-colors"
                    title="Picture in Picture"
                    style={{ color: isPiP ? "#a78bfa" : undefined }}
                  >
                    {/* PiP icon */}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <rect x="13" y="10" width="8" height="5" rx="1" fill="currentColor" stroke="none" />
                    </svg>
                  </button>
                )}

                {/* Fullscreen */}
                <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors" title="Fullscreen">
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
