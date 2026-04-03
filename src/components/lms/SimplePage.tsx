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
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <section className="max-w-2xl w-full glass-card rounded-3xl p-8 md:p-10 border border-violet-500/20">
        <div className="tag-purple mb-4 inline-flex">EduNova</div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">{title}</h1>
        <p className="text-gray-400 leading-relaxed mb-8">{description}</p>
        <div className="flex items-center gap-3">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl"
          >
            {ctaLabel}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-violet-500/30 text-violet-300 font-semibold px-6 py-3 rounded-xl"
          >
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
