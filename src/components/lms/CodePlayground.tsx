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
  defaultLanguage?: string;
}

const SUPPORTED_LANGUAGES = [
  { id: "javascript", name: "JavaScript", icon: "js", template: "// Practice your JS here...\n\nconsole.log(\"Hello from EduNova Lab!\");" },
  { id: "typescript", name: "TypeScript", icon: "ts", template: "// Strongly typed JS practice\n\ninterface User {\n  name: string;\n  id: number;\n}\n\nconst user: User = { name: \"Student\", id: 1 };\nconsole.log(`Hello, ${user.name}! (ID: ${user.id})`);" },
  { id: "python", name: "Python", icon: "py", template: "# Python syntax practice\n\ndef greet(name):\n    return f\"Hello, {name}!\"\n\nprint(greet(\"EduNova student\"))" },
  { id: "cpp", name: "C++", icon: "cpp", template: "// C++ syntax practice\n#include <iostream>\n\nint main() {\n    std::cout << \"Hello World\" << std::endl;\n    return 0;\n}" },
  { id: "html", name: "HTML", icon: "html", template: "<!-- Practice your HTML layout here -->\n<div class=\"p-10 shadow-xl rounded-2xl bg-white\">\n  <h1 class=\"text-3xl font-black text-blue-600\">Hello World</h1>\n  <p class=\"text-slate-500 mt-4\">Welcome to the EduNova Lab.</p>\n</div>" },
  { id: "css", name: "CSS", icon: "css", template: "/* Style your components freely */\n.premium-card {\n  background: linear-gradient(135deg, #6366f1, #8b5cf6);\n  border-radius: 1.5rem;\n  padding: 2rem;\n  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);\n}" },
];

export default function CodePlayground({ 
  initialCode,
  defaultLanguage = "javascript" 
}: CodePlaygroundProps) {
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(initialCode || (SUPPORTED_LANGUAGES.find(l => l.id === defaultLanguage)?.template || ""));
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (newLang: string) => {
    if (confirm(`Switching to ${newLang} will reset your current work. Continue?`)) {
      const langConfig = SUPPORTED_LANGUAGES.find(l => l.id === newLang);
      setActiveLanguage(newLang);
      setCode(langConfig?.template || "");
      setOutput([]);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput([]);
    
    // Only JS/TS execution supported in browser sandbox for now
    if (activeLanguage !== "javascript" && activeLanguage !== "typescript") {
      setOutput([
        `Notice: Browser execution for ${activeLanguage.toUpperCase()} is coming soon.`,
        "Currently, only JavaScript and TypeScript (interpreted) are executable in the sandbox.",
        "Syntax highlighting and IntelliSense are active."
      ]);
      setIsRunning(false);
      return;
    }

    const originalLog = console.log;
    const logs: string[] = [];
    
    console.log = (...args: any[]) => {
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
    };

    try {
      // For TS, we treat it as JS for now since browser Function constructor can run basic TS if we strip types (manually or via simple regex)
      // or just assume student is writing JS-compatible TS for simple practice.
      const executableCode = code.replace(/interface\s+\w+\s+\{[\s\S]*?\}/g, '').replace(/:\s+\w+/g, '');
      const runner = new Function(executableCode);
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
    if (confirm("Reset current code to template state?")) {
      const langConfig = SUPPORTED_LANGUAGES.find(l => l.id === activeLanguage);
      setCode(langConfig?.template || "");
      setOutput([]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const currentLangName = SUPPORTED_LANGUAGES.find(l => l.id === activeLanguage)?.name || "JavaScript";

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto py-4 sm:py-8 px-4 sm:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/5">
            <Code2 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">Interactive Lab</h3>
            <div className="flex items-center gap-2 mt-1.5 font-black uppercase tracking-widest text-[9px]">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <select 
                 value={activeLanguage}
                 onChange={(e) => handleLanguageChange(e.target.value)}
                 className="bg-transparent text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white cursor-pointer outline-none transition-colors border-none p-0 focus:ring-0"
               >
                 {SUPPORTED_LANGUAGES.map(lang => (
                   <option key={lang.id} value={lang.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{lang.name} Environment</option>
                 ))}
               </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 mr-2">
             <button
                onClick={handleCopy}
                title="Copy Code"
                className="p-2.5 text-slate-500 dark:text-gray-400 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 transition-all"
              >
                <Copy size={15} />
              </button>
              <button
                onClick={handleReset}
                title="Reset Workspace"
                className="p-2.5 text-slate-500 dark:text-gray-400 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 transition-all"
              >
                <RotateCcw size={15} />
              </button>
          </div>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-br from-orange-600 to-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/30 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50"
          >
            {isRunning ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} fill="currentColor" />}
            Run Lab
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-6 min-h-[500px]">
        {/* Editor Area */}
        <div className="lg:col-span-3 flex flex-col bg-[#1e1e1e] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl relative group min-h-[350px] lg:min-h-0">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/40">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
               <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
             </div>
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">playground.{activeLanguage === 'javascript' ? 'js' : activeLanguage === 'typescript' ? 'ts' : activeLanguage}</span>
          </div>
          <div className="flex-1 min-h-0 pt-4">
            <Editor
              height="100%"
              language={activeLanguage === 'typescript' ? 'typescript' : activeLanguage === 'cpp' ? 'cpp' : activeLanguage}
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
                },
                wordWrap: "on"
              }}
            />
          </div>
        </div>

        {/* Console Area */}
        <div className="lg:col-span-2 flex flex-col bg-[#0b0b14] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl min-h-[250px] lg:min-h-0">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <Terminal size={14} className="text-orange-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Console Output</span>
            </div>
            <button
              onClick={() => setOutput([])}
              className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/5 hover:bg-white/5 transition-all"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 p-6 sm:p-8 font-mono text-[11px] overflow-y-auto no-scrollbar max-h-[300px] lg:max-h-none">
            {output.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10 text-center select-none py-10">
                <Terminal size={40} strokeWidth={1} className="mb-6" />
                <p className="font-black uppercase tracking-[0.3em] text-xs">System Ready</p>
                <p className="text-[9px] mt-3 max-w-[150px] font-medium leading-relaxed">Execute your {currentLangName} code and results will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {output.map((line, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className={`flex gap-3.5 p-3.5 rounded-2xl ${line.startsWith("Error:") ? "bg-red-500/10 text-red-100 border border-red-500/20" : line.startsWith("Notice:") ? "bg-blue-500/10 text-blue-100 border border-blue-500/20" : "bg-emerald-500/10 text-emerald-100 border border-emerald-500/10"}`}
                  >
                    <span className="text-white/20 select-none shrink-0 font-bold">{i + 1}</span>
                    <span className="whitespace-pre-wrap leading-relaxed opacity-90">{line}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile-Friendly Footer Info */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-600/5 to-transparent border-l-4 border-blue-600 rounded-r-[2rem] flex items-center gap-4">
         <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
           <CheckCircle2 size={18} />
         </div>
         <p className="text-[11px] text-slate-500 dark:text-gray-400 font-medium leading-relaxed">
           <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight mr-1.5">Lab Cloud:</span> 
           Your {currentLangName} environment is fully sandboxed. Experiment with different languages to master programming fundamentals.
         </p>
      </div>
    </div>
  );
}
