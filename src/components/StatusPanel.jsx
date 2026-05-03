import React, { useState, useEffect } from 'react'
import { memoryStats, listAutomations } from '../api.js'

function Row({ label, value, active, color }) {
  const c = { green:'text-purvis-green', red:'text-purvis-red', blue:'text-purvis-accent', yellow:'text-purvis-yellow' }[color] || 'text-purvis-text'
  return (
    <div className="flex items-center justify-between py-2 border-b border-purvis-border/50 last:border-0">
      <span className="text-xs text-purvis-muted">{label}</span>
      <div className="flex items-center gap-1.5">
        {active !== undefined && (
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-purvis-green pulse' : 'bg-purvis-muted opacity-40'}`}/>
        )}
        <span className={`text-xs font-medium ${c}`}>{value}</span>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-purvis-muted uppercase tracking-wider mb-2 px-1">{title}</div>
      <div className="bg-purvis-bg rounded-xl border border-purvis-border px-3 py-1">{children}</div>
    </div>
  )
}

export default function StatusPanel({ providerStatus }) {
  const [memory, setMemory] = useState(null)
  const [autos, setAutos] = useState(null)

  useEffect(() => {
    load()
    const t = setInterval(load, 60000)
    return () => clearInterval(t)
  }, [])

  async function load() {
    try { setMemory(await memoryStats()) } catch {}
    try { setAutos(await listAutomations()) } catch {}
  }

  const ps = providerStatus

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 bg-purvis-surface">
      <h3 className="text-sm font-semibold text-purvis-text mb-4">System Status</h3>

      <Section title="AI Providers">
        <Row label="OpenAI"  active={ps?.openai}  value={ps?.openai  ? 'ONLINE' : ps ? 'OFFLINE' : '…'} color={ps?.openai  ? 'green' : 'red'}/>
        <Row label="Gemini"  active={ps?.gemini}  value={ps?.gemini  ? 'ONLINE' : ps ? 'OFFLINE' : '…'} color={ps?.gemini  ? 'green' : 'red'}/>
        <Row label="Claude"  active={ps?.claude}  value={ps?.claude  ? 'ONLINE' : ps ? 'OFFLINE' : '…'} color={ps?.claude  ? 'green' : 'red'}/>
        {ps?.active_provider && <Row label="Active" value={ps.active_provider} color="blue"/>}
      </Section>

      <Section title="Memory">
        <Row label="Supabase" active={!!memory} value={memory ? 'LIVE' : '…'} color="green"/>
        <Row label="Sessions" value={memory?.total_cached ?? '—'}/>
        <Row label="Mode"     value={memory?.mode ?? 'sovereign'}/>
      </Section>

      <Section title="Automation Chains">
        {autos?.available_chains
          ? autos.available_chains.map(c => <Row key={c} label={c.replace(/_/g,' ')} active={true} value="READY" color="green"/>)
          : ['content_daily','sports_daily','income_check','memory_sync'].map(c =>
              <Row key={c} label={c.replace(/_/g,' ')} value="—"/>
            )
        }
      </Section>

      <div className="mt-2 p-3 bg-purvis-bg rounded-xl border border-purvis-border">
        <div className="text-xs text-purvis-muted mb-1">Backend</div>
        <div className="text-xs text-purvis-accent font-mono break-all leading-relaxed">
          purvis-v11-production-8ad7.up.railway.app
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-purvis-green pulse"/>
          <span className="text-xs text-purvis-green font-medium">SOVEREIGN · LIVE</span>
        </div>
      </div>
    </div>
  )
}
