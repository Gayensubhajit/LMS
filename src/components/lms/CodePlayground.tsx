"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { 
  Play, 
  RotateCcw, 
  Code2, 
  Terminal, 
  CheckCircle2, 
  Loader2,
  Copy
} from "lucide-react";
import { motion } from "framer-motion";

interface CodePlaygroundProps {
  initialCode?: string;
  language?: string;
}

export default function CodePlayground({ 
  initialCode = "// Practice your code here...\n\nconsole.log(\"Hello from EduNova Lab!\");",
  language = "javascript" 
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setOutput([]);
    
    const originalLog = console.log;
    const logs: string[] = [];
    
    console.log = (...args: any[]) => {
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
    };

    try {
      const runner = new Function(code);
      runner();
      setOutput(logs.length > 0 ? logs : ["Code executed successfully (no output)."]);
    } catch (err: any) {
      setOutput([`Error: ${err.message}`]);
    } finally {
      console.log = originalLog;
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset code to initial state?")) {
      setCode(initialCode);
      setOutput([]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto py-6 px-4 sm:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/5">
            <Code2 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">Interactive Lab</h3>
            <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em] font-black mt-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {language} environment active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 rounded-xl hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={handleReset}
            className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 rounded-xl hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-br from-orange-600 to-orange-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-500/30 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50"
          >
            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
            Run Lab
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[450px]">
        {/* Editor Area */}
        <div className="lg:col-span-3 flex flex-col bg-[#1e1e1e] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl relative group">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/40">
             <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/40" />
               <div className="w-3 h-3 rounded-full bg-amber-500/40" />
               <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
             </div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">playground.js</span>
          </div>
          <div className="flex-1 min-h-0 pt-4">
            <Editor
              height="100%"
              defaultLanguage={language}
              defaultValue={initialCode}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                automaticLayout: true,
                padding: { top: 10, bottom: 10 },
                lineNumbers: "on",
                roundedSelection: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: false,
                renderLineHighlight: "all",
                hideCursorInOverviewRuler: true,
                scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden'
                }
              }}
            />
          </div>
        </div>

        {/* Console Area */}
        <div className="lg:col-span-2 flex flex-col bg-[#0b0b14] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <Terminal size={16} className="text-orange-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Console Output</span>
            </div>
            <button
              onClick={() => setOutput([])}
              className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/5 hover:bg-white/5 transition-all"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 p-8 font-mono text-xs overflow-y-auto no-scrollbar">
            {output.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10 text-center select-none">
                <Terminal size={48} strokeWidth={1} className="mb-6" />
                <p className="font-black uppercase tracking-[0.3em] text-sm">System Ready</p>
                <p className="text-[10px] mt-3 max-w-[150px] font-medium">Click "Run Lab" to execute your code and see results.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {output.map((line, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className={`flex gap-4 p-3 rounded-xl ${line.startsWith("Error:") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/5 text-emerald-400 border border-emerald-500/10"}`}
                  >
                    <span className="text-white/20 select-none shrink-0 font-bold">{i + 1}</span>
                    <span className="whitespace-pre-wrap leading-relaxed">{line}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-8 p-5 bg-gradient-to-r from-blue-600/5 to-transparent border-l-4 border-blue-600 rounded-r-3xl flex items-center gap-4">
         <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0">
           <CheckCircle2 size={20} />
         </div>
         <p className="text-xs text-slate-500 dark:text-gray-400 font-medium leading-relaxed">
           <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight mr-1">Lab Note:</span> 
           Experiment freely in this sandboxed environment. Your code is executed locally in your browser for maximum performance and privacy.
         </p>
      </div>
    </div>
  );
}
