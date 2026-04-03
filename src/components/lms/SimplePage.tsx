import Link from "next/link";

type SimplePageProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function SimplePage({
  title,
  description,
  ctaLabel = "Back to Home",
  ctaHref = "/",
}: SimplePageProps) {
  return (
    <main className="min-h-screen bg-[#f6f8ff] dark:bg-background text-foreground flex items-center justify-center px-6">
      <section className="max-w-2xl w-full bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-violet-500/20 shadow-lg dark:shadow-none">
        <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] bg-blue-600/10 text-blue-600 border border-blue-600/20 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20 px-3 py-1 rounded-full mb-4 inline-flex">EduNova</div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{title}</h1>
        <p className="text-slate-500 dark:text-gray-400 leading-relaxed mb-8">{description}</p>
        <div className="flex items-center gap-3">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 dark:shadow-violet-500/30"
          >
            {ctaLabel}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
