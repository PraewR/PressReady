
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen px-6">
      <div className="max-w-5xl mx-auto py-16">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-teal-800 text-white p-10 shadow">
          <h1 className="text-5xl font-bold mb-4">PressReady</h1>
          <p className="text-xl text-white/85 max-w-2xl">
            AI-powered media preparation for PR consultants — with question intelligence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/prepare">
              <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-white/90">
                Start Press Simulation
              </button>
            </Link>
            <span className="text-sm bg-white/10 border border-white/15 px-4 py-3 rounded-lg">
              Country must match library sheet name
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
