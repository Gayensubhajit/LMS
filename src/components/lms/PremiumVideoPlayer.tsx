"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize, 
  Minimize, 
  Monitor, 
  SkipForward,
  FastForward,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumVideoPlayerProps {
  url: string;
  title: string;
  onEnded?: () => void;
  onProgress?: (currentTime: number, duration: number) => void;
}

export default function PremiumVideoPlayer({ url, title, onEnded, onProgress }: PremiumVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      if (onProgress) onProgress(video.currentTime, video.duration);
    };
    
    const updateDuration = () => setDuration(video.duration);
    
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("ended", () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    });

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [onEnded, onProgress]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative group overflow-hidden bg-black rounded-3xl border border-white/5 shadow-2xl transition-all duration-500 ${isTheaterMode ? "aspect-[21/9]" : "aspect-video"}`}
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {/* ── Overlay Gradient ── */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" 
          />
        )}
      </AnimatePresence>

      {/* ── Center Play/Pause Indicator ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {!isPlaying && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 text-white pointer-events-auto shadow-2xl"
              onClick={togglePlay}
            >
              <Play size={32} fill="white" className="ml-1" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Controls UI ── */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4"
          >
            {/* Progress Bar */}
            <div className="group/progress relative h-1.5 w-full flex items-center cursor-pointer">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
              />
              <div className="absolute inset-x-0 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-violet-500 relative"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-lg" />
                </motion.div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                
                <button className="text-white/70 hover:text-white transition-colors" onClick={() => { if(videoRef.current) videoRef.current.currentTime -= 10 }}>
                  <RotateCcw size={18} />
                </button>

                <div className="group/volume flex items-center gap-2">
                  <button onClick={toggleMute} className="text-white hover:scale-110 transition-transform">
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300 flex items-center">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.1}
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full accent-violet-500"
                    />
                  </div>
                </div>

                <div className="text-[11px] font-black text-white/80 tabular-nums bg-white/5 px-2 py-1 rounded-md border border-white/10">
                  {formatTime(currentTime)} <span className="text-white/30 mx-1">/</span> {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-4 relative">
                {/* Playback Speed Tag */}
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-[10px] font-black text-white/70 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/10 transition-colors"
                >
                  {playbackSpeed}x
                </button>

                {/* Settings Menu Overlay */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute bottom-full right-0 mb-4 w-40 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-2xl z-50 overflow-hidden"
                    >
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2 py-1 border-b border-white/5 mb-1">Playback Speed</p>
                      {[0.5, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => {
                             setPlaybackSpeed(speed);
                             if(videoRef.current) videoRef.current.playbackRate = speed;
                             setShowSettings(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${playbackSpeed === speed ? "bg-violet-600/20 text-violet-400" : "text-white/60 hover:bg-white/5"}`}
                        >
                          {speed === 1 ? "Normal" : `${speed}x`}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button onClick={() => setIsTheaterMode(!isTheaterMode)} className="text-white/70 hover:text-white transition-colors">
                  <Monitor size={18} />
                </button>

                <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors">
                  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Header (Title) ── */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-0 left-0 right-0 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                  <FastForward size={14} className="text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{title}</h3>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">EduNova Premium Player</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[10px] font-black text-violet-400 uppercase tracking-widest">
                HD 1080P
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ── Custom CSS for range inputs (Edu Nova Style) ── */}
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          background: transparent;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
        }
        input[type="range"]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
