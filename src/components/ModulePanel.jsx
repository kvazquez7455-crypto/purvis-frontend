import React, { useState } from 'react'
import {
  getViralTrends, generateContent,
  browserSearch, browserScrape,
  buildPlan, buildGenerate,
  videoScript, videoRender,
  listAutomations, runChain,
  memorySearch,
} from '../api.js'

/* ─── Shared primitives ────────────────────────────────────────────────── */

function PanelHeader({ icon, title, desc }) {
  return (
    <div className="px-5 py-4 border-b border-purvis-border">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <div>
          <h2 className="text-sm font-semibold text-purvis-text">{title}</h2>
          <p className="text-xs text-purvis-muted">{desc}</p>
        </div>
      </div>
    </div>
  )
}

function Btn({ onClick, loading, children, variant = 'primary', size = 'md' }) {
  const base = 'rounded-xl font-medium transition-all btn-press disabled:opacity-40 disabled:cursor-not-allowed'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-sm' }
  const variants = {
    primary: 'bg-purvis-accent text-purvis-bg hover:bg-purvis-accent/80',
    ghost:   'bg-white/5 text-purvis-text hover:bg-white/10 border border-purvis-border',
    danger:  'bg-purvis-red/20 text-purvis-red hover:bg-purvis-red/30 border border-purvis-red/30',
    success: 'bg-purvis-green/20 text-purvis-green hover:bg-purvis-green/30 border border-purvis-green/30',
  }
  return (
    <button onClick={onClick} disabled={loading} className={`${base} ${sizes[size]} ${variants[variant]}`}>
      {loading ? '⏳ Working…' : children}
    </button>
  )
}

function Input({ value, onChange, placeholder, multiline = false }) {
  const cls = `
    w-full bg-purvis-bg border border-purvis-border rounded-xl
    px-4 py-3 text-sm text-purvis-text placeholder-purvis-muted
    focus:outline-none focus:border-purvis-accent transition-colors
  `
  return multiline
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} className={cls + ' resize-none'} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
}

function ResultBox({ data }) {
  if (!data) return null
  const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
  return (
    <div className="mt-4 bg-purvis-bg border border-purvis-border rounded-xl p-4 overflow-auto max-h-96">
      <pre className="text-xs text-purvis-text whitespace-pre-wrap font-mono">{text}</pre>
    </div>
  )
}

/* ─── Content Module ────────────────────────────────────────────────────── */
function ContentModule() {
  const [topic, setTopic] = useState('')
  const [track, setTrack] = useState('political')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [trends, setTrends] = useState(null)

  async function fetchTrends() {
    setLoading(true)
    try { setTrends(await getViralTrends(5)) } catch (e) { setTrends({ error: e.message }) }
    setLoading(false)
  }

  async function generate() {
    setLoading(true)
    try { setResult(await generateContent(topic, track)) } catch (e) { setResult({ error: e.message }) }
    setLoading(false)
  }

  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input value={topic} onChange={setTopic} placeholder="Topic (e.g. Patel FBI takeover)" />
        <select value={track} onChange={e => setTrack(e.target.value)}
          className="bg-purvis-bg border border-purvis-border text-purvis-text text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-purvis-accent">
          <option value="political">Political Track</option>
          <option value="scripture">Scripture Track</option>
          <option value="rabbit-hole">Rabbit Hole</option>
        </select>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Btn onClick={generate} loading={loading && !trends}>Generate Script</Btn>
        <Btn onClick={fetchTrends} loading={loading && !!trends} variant="ghost">Get Viral Trends</Btn>
      </div>
      <ResultBox data={result || trends} />
    </div>
  )
}

/* ─── Browser Module ────────────────────────────────────────────────────── */
function BrowserModule() {
  const [query, setQuery] = useState('')
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function search() {
    setLoading(true)
    try { setResult(await browserSearch(query)) } catch (e) { setResult({ error: e.message }) }
    setLoading(false)
  }

  async function scrape() {
    setLoading(true)
    try { setResult(await browserScrape(url)) } catch (e) { setResult({ error: e.message }) }
    setLoading(false)
  }

  return (
    <div className="p-5 space-y-4">
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1"><Input value={query} onChange={setQuery} placeholder="Search query (e.g. Florida plumbing license renewal)" /></div>
          <Btn onClick={search} loading={loading}>Search</Btn>
        </div>
        <div className="flex gap-2">
          <div className="flex-1"><Input value={url} onChange={setUrl} placeholder="URL to scrape (e.g. https://example.com)" /></div>
          <Btn onClick={scrape} loading={loading} variant="ghost">Scrape</Btn>
        </div>
      </div>
      <ResultBox data={result} />
    </div>
  )
}

/* ─── App Builder Module ────────────────────────────────────────────────── */
function BuilderModule() {
  const [idea, setIdea] = useState('')
  const [plan, setPlan] = useState(null)
  const [code, setCode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tech, setTech] = useState('react')

  async function getPlan() {
    setLoading(true)
    try {
      const data = await buildPlan(idea)
      setPlan(data)
      setCode(null)
    } catch (e) { setPlan({ error: e.message }) }
    setLoading(false)
  }

  async function generate() {
    setLoading(true)
    try { setCode(await buildGenerate(plan, tech)) } catch (e) { setCode({ error: e.message }) }
    setLoading(false)
  }

  return (
    <div className="p-5 space-y-4">
      <Input value={idea} onChange={setIdea} placeholder="Describe your app (e.g. mobile notary booking system with Stripe)" multiline />
      <div className="flex gap-2 flex-wrap items-center">
        <Btn onClick={getPlan} loading={loading}>Build Plan</Btn>
        {plan && !plan.error && (
          <>
            <select value={tech} onChange={e => setTech(e.target.value)}
              className="bg-purvis-bg border border-purvis-border text-purvis-text text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-purvis-accent">
              <option value="react">React</option>
              <option value="html">HTML/JS</option>
              <option value="vue">Vue</option>
            </select>
            <Btn onClick={generate} loading={loading} variant="success">Generate Code</Btn>
          </>
        )}
      </div>
      <ResultBox data={code || plan} />
    </div>
  )
}

/* ─── Video Module ────────────────────────────────────────────────────────── */
function VideoModule() {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('rabbit-hole')
  const [script, setScript] = useState(null)
  const [loading, setLoading] = useState(false)

  async function getScript() {
    setLoading(true)
    try { setScript(await videoScript(topic, style)) } catch (e) { setScript({ error: e.message }) }
    setLoading(false)
  }

  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input value={topic} onChange={setTopic} placeholder="Topic (e.g. Epstein list 2025 cover-up)" />
        </div>
        <select value={style} onChange={e => setStyle(e.target.value)}
          className="bg-purvis-bg border border-purvis-border text-purvis-text text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-purvis-accent">
          <option value="rabbit-hole">Rabbit Hole</option>
          <option value="breaking-news">Breaking News</option>
          <option value="countdown">Countdown</option>
          <option value="exposé">Exposé</option>
        </select>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Btn onClick={getScript} loading={loading}>Generate Script</Btn>
        <span className="text-xs text-purvis-muted self-center">Script → Voiceover → Render on Railway</span>
      </div>
      <ResultBox data={script} />
    </div>
  )
}

/* ─── Automation Module ───────────────────────────────────────────────────── */
function AutomationModule() {
  const [automations, setAutomations] = useState(null)
  const [runResult, setRunResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const CHAINS = ['content_daily', 'sports_daily', 'income_check', 'memory_sync']

  async function fetchList() {
    setLoading(true)
    try { setAutomations(await listAutomations()) } catch (e) { setAutomations({ error: e.message }) }
    setLoading(false)
  }

  async function run(chain) {
    setLoading(true)
    try { setRunResult(await runChain(chain)) } catch (e) { setRunResult({ error: e.message }) }
    setLoading(false)
  }

  return (
    <div className="p-5 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-purvis-muted uppercase tracking-wider mb-3">Quick-Fire Chains</h3>
        <div className="grid grid-cols-2 gap-2">
          {CHAINS.map(chain => (
            <button
              key={chain}
              onClick={() => run(chain)}
              disabled={loading}
              className="
                bg-purvis-bg border border-purvis-border rounded-xl px-4 py-3
                text-left text-sm text-purvis-text hover:border-purvis-accent
                hover:bg-purvis-accent/5 transition-all btn-press disabled:opacity-40
              "
            >
              <div className="font-medium capitalize">{chain.replace(/_/g, ' ')}</div>
              <div className="text-xs text-purvis-muted mt-0.5">Click to trigger</div>
            </button>
          ))}
        </div>
      </div>
      <Btn onClick={fetchList} loading={loading} variant="ghost">List All Automations</Btn>
      <ResultBox data={runResult || automations} />
    </div>
  )
}

/* ─── Memory Module ───────────────────────────────────────────────────────── */
function MemoryModule() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function search() {
    setLoading(true)
    try { setResult(await memorySearch(query)) } catch (e) { setResult({ error: e.message }) }
    setLoading(false)
  }

  return (
    <div className="p-5 space-y-4">
      <div className="flex gap-2">
        <div className="flex-1"><Input value={query} onChange={setQuery} placeholder="Search PURVIS memory (e.g. Christine case, BIP, plumbing license)" /></div>
        <Btn onClick={search} loading={loading}>Search</Btn>
      </div>
      <ResultBox data={result} />
    </div>
  )
}

/* ─── Legal Module ────────────────────────────────────────────────────────── */
function LegalModule() {
  const FACTS = [
    { label: 'Case', value: '2024-DR-012028-O · Division 44' },
    { label: 'Court', value: 'Orange County 9th Circuit' },
    { label: 'Petitioner', value: 'Christine Montalvo' },
    { label: 'Respondent', value: 'Kelvin Vazquez' },
    { label: 'Judgment', value: 'January 24, 2025' },
    { label: 'Injunction Expires', value: 'January 4, 2030' },
    { label: 'BIP Status', value: 'ENROLLED ONLY — Starts April 1, 2026' },
    { label: 'Ring Camera', value: 'NEGATIVE (no incident recorded)' },
    { label: 'Kelvin Called Police', value: 'YES — he was the victim' },
    { label: "Christine's Oath", value: '"No, you never have." (PERJURY KILL SHOT)' },
  ]

  const KILL_SHOTS = [
    'Christine sworn oath: "No, you never have." — Kelvin NEVER harmed her',
    'Ring camera NEGATIVE — no footage of incident',
    'Kelvin called the police — he was the victim',
    'Christine admitted hitting back + grabbing genitals + pushing Kelvin down stairs',
    'Aug 2024 prior incident — Christine was aggressor (Osceola County)',
    'Sep 2024 prior incident — Christine was aggressor (Osceola County)',
    'BIP enrolled ONLY — NOT completed. No other programs completed.',
    'Transcript contradictions documented across multiple hearings',
  ]

  return (
    <div className="p-5 space-y-5">
      <div className="bg-purvis-bg border border-purvis-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-purvis-border bg-purvis-surface">
          <h3 className="text-xs font-semibold text-purvis-muted uppercase tracking-wider">Case Facts — LOCKED</h3>
        </div>
        <div className="divide-y divide-purvis-border/50">
          {FACTS.map(f => (
            <div key={f.label} className="flex gap-4 px-4 py-2.5">
              <span className="text-xs text-purvis-muted w-36 flex-shrink-0">{f.label}</span>
              <span className="text-xs text-purvis-text">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-purvis-red/5 border border-purvis-red/20 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-purvis-red/20">
          <h3 className="text-xs font-semibold text-purvis-red uppercase tracking-wider">⚠️ Kill Shots ({KILL_SHOTS.length} Documented)</h3>
        </div>
        <div className="divide-y divide-purvis-red/10">
          {KILL_SHOTS.map((k, i) => (
            <div key={i} className="flex gap-3 px-4 py-2.5">
              <span className="text-xs font-bold text-purvis-red flex-shrink-0">#{i + 1}</span>
              <span className="text-xs text-purvis-text">{k}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Router ─────────────────────────────────────────────────────────────── */
const MODULE_MAP = {
  content:    { icon: '🎬', title: 'Content Engine',   desc: 'Generate viral scripts + trend analysis',   Component: ContentModule },
  browser:    { icon: '🌐', title: 'Browser Engine',   desc: 'Web search, scrape, and deep research',     Component: BrowserModule },
  builder:    { icon: '🏗️', title: 'App Builder',      desc: 'AI-powered app generator',                  Component: BuilderModule },
  video:      { icon: '📹', title: 'Video Engine',     desc: 'Script, voice, and render pipeline',        Component: VideoModule },
  automation: { icon: '⚡', title: 'Automation',       desc: 'Chain-based workflow execution',            Component: AutomationModule },
  memory:     { icon: '🧠', title: 'Memory Engine',    desc: 'Search and retrieve PURVIS brain',          Component: MemoryModule },
  legal:      { icon: '⚖️', title: 'Legal Brain',      desc: 'Case 2024-DR-012028-O — Kill shots locked', Component: LegalModule },
}

export default function ModulePanel({ module }) {
  const mod = MODULE_MAP[module]
  if (!mod) return <div className="p-8 text-purvis-muted">Module not found.</div>
  const { icon, title, desc, Component } = mod

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PanelHeader icon={icon} title={title} desc={desc} />
      <div className="flex-1 overflow-y-auto">
        <Component />
      </div>
    </div>
  )
}
