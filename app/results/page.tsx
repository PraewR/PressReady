
"use client";

import { useEffect, useMemo, useState } from "react";

type Q = { id: string; question: string; difficulty: string; intent: string; rationale?: string };
type Follow = { base_question_id: string; followups: { question: string; trap_type: string; rationale: string }[] };
type Bucket = { theme: string; questions: string[] };

export default function Results(){
  const [brief, setBrief] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [mode, setMode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<"likely"|"tough"|"followups"|"themes"|"coaching"|"anchors">("likely");

  useEffect(()=>{
    const s = localStorage.getItem("pressreadyBrief");
    if (s) setBrief(JSON.parse(s));
  },[]);

  useEffect(()=>{
    async function run(){
      if(!brief) return;
      setLoading(true);
      setError("");
      try{
        const res = await fetch("/api/generate", {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify(brief)
        });
        const json = await res.json();
        if(!json.ok) throw new Error(json.error || "Failed");
        setData(json.data);
        setMode(json.mode || "");
      }catch(e:any){
        setError(e?.message || "Failed");
      }finally{
        setLoading(false);
      }
    }
    run();
  },[brief]);

  const tabs = useMemo(()=>[
    ["likely","Likely Questions"],
    ["tough","Tough Questions"],
    ["followups","Follow-ups & Traps"],
    ["themes","Theme Buckets"],
    ["coaching","Coaching"],
    ["anchors","Anchors Used"]
  ] as const, []);

  if(!brief) return <p className="p-10">Missing brief. Go back to /prepare.</p>;

  return (
    <main className="max-w-6xl mx-auto py-10 px-6">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-teal-800 text-white p-8 shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Press Simulation Results</h1>
            <div className="text-white/80 mt-2 text-sm">
              Client: <b>{brief.client}</b> · Topic: <b>{brief.topic}</b> · Market: <b>{brief.country}</b>
            </div>
          </div>
          <div className="text-sm bg-white/10 border border-white/15 px-4 py-2 rounded-lg">
            Mode: <b>{mode || "—"}</b>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map(([k,label]) => (
          <button key={k}
            onClick={()=>setTab(k as any)}
            className={(tab===k ? "bg-slate-900 text-white" : "bg-white") + " px-4 py-2 rounded-lg shadow text-sm font-semibold"}>
            {label}
          </button>
        ))}
      </div>

      {loading && <div className="mt-6 bg-white p-6 rounded-xl shadow">Generating…</div>}
      {error && <div className="mt-6 bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl">{error}</div>}

      {!loading && data && (
        <div className="mt-6">
          {tab==="likely" && <Questions title="Top 12 Likely Questions" items={data.likely_questions} />}
          {tab==="tough" && <Questions title="Tough Questions (6–10)" items={data.tough_questions} emphasis />}
          {tab==="followups" && <Followups items={data.followups_and_traps} />}
          {tab==="themes" && <Themes items={data.theme_buckets} />}
          {tab==="coaching" && <Coaching c={data.spokesperson_coaching} clarifiers={data.quick_clarifiers} />}
          {tab==="anchors" && <Anchors items={data.anchors_used} />}
        </div>
      )}
    </main>
  );
}

function Chip({ children, kind }: { children: any; kind: "diff"|"intent"|"trap" }) {
  const cls = kind==="diff" ? "bg-slate-100 text-slate-700"
    : kind==="intent" ? "bg-blue-50 text-blue-800"
    : "bg-amber-50 text-amber-800";
  return <span className={cls + " px-2 py-1 rounded-md text-xs font-semibold"}>{children}</span>;
}

function Questions({ title, items, emphasis }: { title: string; items: Q[]; emphasis?: boolean }){
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {emphasis && <span className="text-xs font-semibold bg-red-50 text-red-800 border border-red-200 px-3 py-1 rounded-full">High pressure</span>}
      </div>
      <div className="mt-4 grid gap-4">
        {(items || []).map((q: Q) => (
          <div key={q.id} className="border rounded-xl p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="font-semibold">{q.question}</div>
              <div className="flex gap-2 items-center">
                <Chip kind="diff">{q.difficulty}</Chip>
                <Chip kind="intent">{q.intent}</Chip>
                <span className="text-xs font-mono text-slate-400">{q.id}</span>
              </div>
            </div>
            {q.rationale && <div className="text-sm text-slate-600 mt-2">{q.rationale}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function Followups({ items }: { items: Follow[] }){
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold">Follow-ups & Traps</h2>
      <div className="mt-4 grid gap-4">
        {(items || []).map((f, idx) => (
          <div key={idx} className="border rounded-xl p-4">
            <div className="text-sm text-slate-500 mb-2">Base question ID: <b>{f.base_question_id}</b></div>
            <ul className="space-y-3">
              {f.followups.map((x, j) => (
                <li key={j}>
                  <div className="font-semibold flex flex-wrap items-center gap-2">
                    {x.question} <Chip kind="trap">{x.trap_type}</Chip>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{x.rationale}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Themes({ items }: { items: Bucket[] }){
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold">Theme Buckets</h2>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {(items || []).map((b, idx) => (
          <div key={idx} className="border rounded-xl p-4">
            <div className="font-semibold">{b.theme}</div>
            <div className="text-sm text-slate-600 mt-2">{(b.questions || []).join(", ")}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Coaching({ c, clarifiers }: { c: any; clarifiers: string[] }){
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold">Spokesperson Coaching</h2>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <Block title="Talking points" items={c?.talking_points || []} />
        <Block title="Bridging lines" items={c?.bridging_lines || []} />
        <Block title="Evidence to prepare" items={c?.evidence_to_prepare || []} />
      </div>
      {(clarifiers || []).length > 0 && (
        <div className="mt-6 border rounded-xl p-4 bg-slate-50">
          <div className="font-semibold">Quick clarifiers for next round</div>
          <ul className="list-disc ml-5 mt-2 text-sm text-slate-700">
            {clarifiers.slice(0,3).map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

function Block({ title, items }: { title: string; items: string[] }){
  return (
    <div className="border rounded-xl p-4">
      <div className="font-semibold">{title}</div>
      <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
        {(items || []).map((x,i)=><li key={i}>{x}</li>)}
      </ul>
    </div>
  );
}

function Anchors({ items }: { items: any[] }){
  return (
    <section className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold">Anchors Used (from library)</h2>
      <div className="mt-4 grid gap-4">
        {(items || []).map((a, idx) => (
          <div key={idx} className="border rounded-xl p-4">
            <div className="font-semibold">{a.question}</div>
            <div className="text-sm text-slate-600 mt-2">
              <span className="font-mono text-slate-400">{a.id}</span>
              {" · "}{a.category || "—"}{" · "}{a.scenario || "—"}{" · "}{a.tone || "—"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
