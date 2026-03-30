"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Award, 
  Download, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Printer,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  studentName: string;
  issueDate: Date;
  certificateId: string;
}

const CertificateModal = ({ isOpen, onClose, courseTitle, studentName, issueDate, certificateId }: Props) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-[#08081a] rounded-[40px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Sidebar / Info */}
            <div className="w-full lg:w-80 bg-white/[0.02] border-r border-white/5 p-8 flex flex-col justify-between order-2 lg:order-1">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-white italic tracking-tighter">EduNova<span className="text-violet-500">.</span></h2>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Professional Certification</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Verify Authenticity</p>
                    <p className="text-xs font-mono text-gray-300 break-all">{certificateId}</p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-500">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Blockchain Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-8 border-t border-white/5">
                <button 
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-3 bg-white text-black font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                <div className="grid grid-cols-2 gap-2">
                   <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-all">
                     <Share2 size={14} />
                     Share
                   </button>
                   <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-3 rounded-2xl text-[10px] uppercase tracking-widest transition-all">
                     <Printer size={14} />
                     Print
                   </button>
                </div>
              </div>
            </div>

            {/* Certificate Preview */}
            <div className="flex-1 bg-gradient-to-br from-violet-950/20 to-black p-4 sm:p-12 flex items-center justify-center order-1 lg:order-2 overflow-hidden relative">
              
              <div className="absolute top-4 right-4 z-50">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-all text-gray-500 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              {/* Decorative background for the actual cert */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 blur-[120px] rounded-full" />
                 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 blur-[120px] rounded-full" />
              </div>

              {/* THE CERTIFICATE CARD */}
              <div id="printable-certificate" className="w-full max-w-3xl aspect-[1.414/1] bg-white rounded-sm shadow-2xl relative p-8 sm:p-16 border-[12px] border-double border-gray-100 print:shadow-none print:border-black">
                  
                  {/* Watermark Logo */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
                     <Award size={600} className="text-black" strokeWidth={0.5} />
                  </div>

                  <div className="h-full border-2 border-gray-200 p-6 sm:p-12 flex flex-col justify-between items-center text-center relative z-10">
                    
                    <div>
                      <h3 className="text-3xl font-black text-black italic tracking-tighter mb-4">EduNova<span className="text-violet-600">.</span></h3>
                      <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto" />
                    </div>

                    <div className="space-y-6">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">Certificate of Completion</p>
                      
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400 font-medium italic">This is to certify that</p>
                        <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight underline decoration-violet-500/30 decoration-8 underline-offset-8">
                          {studentName}
                        </h1>
                      </div>

                      <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto font-medium">
                        has successfully completed all required modules and assessments for the professional course in
                        <span className="font-bold text-black block text-xl mt-2">{courseTitle}</span>
                      </p>
                    </div>

                    <div className="w-full flex justify-between items-end pt-12">
                      <div className="text-left space-y-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Issued Date</p>
                        <p className="text-xs font-bold text-black">{format(issueDate, 'MMMM dd, yyyy')}</p>
                      </div>

                      <div className="relative group">
                         <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[10px] border-violet-500/5 flex items-center justify-center">
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0"
                            >
                               <svg className="w-full h-full" viewBox="0 0 100 100">
                                 <path id="circlePath" fill="none" d="M 10, 50 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
                                 <text className="text-[8px] font-black uppercase tracking-[0.3em] fill-violet-400">
                                   <textPath href="#circlePath">Professional Certification • Verified Learner • </textPath>
                                 </text>
                               </svg>
                            </motion.div>
                            <Award className="text-violet-600" size={32} />
                         </div>
                      </div>

                      <div className="text-right space-y-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Instructor Signature</p>
                        <p className="text-xl font-serif text-black italic">Jessica Willis</p>
                      </div>
                    </div>

                  </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal;
