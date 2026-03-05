
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const COUNTRIES = ["Thailand","Singapore","Vietnam","Indonesia","Philippines"] as const;

export default function Prepare() {
  const router = useRouter();

  const [form, setForm] = useState({
    client:"",
    industry:"",
    country:"",
    topic:"",
    messages:"",
    risks:"",
    mediaOutlet:"",
    journalistName:"",
    interviewFormat:"1:1 interview",
    spokespersonRole:""
  });

  const canGo = useMemo(() => (
    form.client && form.industry && form.country && form.topic && form.messages && form.risks
  ), [form]);

  function update(e:any){ setForm({...form,[e.target.name]:e.target.value}); }

  function submit(e:any){
    e.preventDefault();
    localStorage.setItem("pressreadyBrief", JSON.stringify(form));
    router.push("/results");
  }

  return (
    <main className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Client Brief</h1>
        <p className="text-slate-600 mt-2">Fill in the briefing and generate a press-realistic simulation.</p>
      </div>

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <label className="text-sm font-semibold">Client name</label>
          <input className="w-full p-3 border rounded mt-2" name="client" value={form.client} onChange={update} />

          <label className="text-sm font-semibold mt-5 block">Industry</label>
          <input className="w-full p-3 border rounded mt-2" name="industry" value={form.industry} onChange={update} />

          <label className="text-sm font-semibold mt-5 block">Country (must match library sheet)</label>
          <select className="w-full p-3 border rounded mt-2" name="country" value={form.country} onChange={update}>
            <option value="" disabled>Select</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <label className="text-sm font-semibold mt-5 block">Media outlet</label>
          <input className="w-full p-3 border rounded mt-2" name="mediaOutlet" value={form.mediaOutlet} onChange={update} />

          <label className="text-sm font-semibold mt-5 block">Journalist name (optional)</label>
          <input className="w-full p-3 border rounded mt-2" name="journalistName" value={form.journalistName} onChange={update} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <label className="text-sm font-semibold">Announcement topic</label>
          <textarea className="w-full p-3 border rounded mt-2 h-24" name="topic" value={form.topic} onChange={update} />

          <label className="text-sm font-semibold mt-5 block">Key messages</label>
          <textarea className="w-full p-3 border rounded mt-2 h-32" name="messages" value={form.messages} onChange={update} />

          <label className="text-sm font-semibold mt-5 block">Sensitive issues</label>
          <textarea className="w-full p-3 border rounded mt-2 h-32" name="risks" value={form.risks} onChange={update} />

          <label className="text-sm font-semibold mt-5 block">Interview format</label>
          <input className="w-full p-3 border rounded mt-2" name="interviewFormat" value={form.interviewFormat} onChange={update} />

          <label className="text-sm font-semibold mt-5 block">Spokesperson role (optional)</label>
          <input className="w-full p-3 border rounded mt-2" name="spokespersonRole" value={form.spokespersonRole} onChange={update} />

          <div className="mt-6 flex gap-3 items-center">
            <button disabled={!canGo} className="bg-blue-600 disabled:bg-slate-300 text-white px-6 py-3 rounded-lg font-semibold">
              Generate
            </button>
            <span className="text-sm text-slate-500">AI when OPENAI_API_KEY is set; otherwise Mock mode.</span>
          </div>
        </div>
      </form>
    </main>
  );
}
