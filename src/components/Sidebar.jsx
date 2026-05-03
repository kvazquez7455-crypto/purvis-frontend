import React from 'react'
const MODULES = [
  { id:'chat',       label:'Chat',        icon:'💬', desc:'Talk to PURVIS' },
  { id:'content',    label:'Content',     icon:'🎬', desc:'Viral video engine' },
  { id:'browser',    label:'Browser',     icon:'🌐', desc:'Web search & scrape' },
  { id:'builder',    label:'App Builder', icon:'🏗️', desc:'AI app generator' },
  { id:'video',      label:'Video',       icon:'📹', desc:'Script & render' },
  { id:'automation', label:'Automation',  icon:'⚡', desc:'Chain workflows' },
  { id:'memory',     label:'Memory',      icon:'🧠', desc:'PURVIS brain' },
  { id:'legal',      label:'Legal',       icon:'⚖️', desc:'Case 2024-DR-012028-O' },
]
export default function Sidebar({ activeModule, setActiveModule, open }) {
  return (
    <aside className={`flex flex-col bg-purvis-surface border-r border-purvis-border transition-all duration-200 ${open?'w-56':'w-14'}`}>
      <div className="flex items-center gap-3 px-4 py-4 border-b border-purvis-border min-h-[56px]">
        <div className="w-7 h-7 rounded-lg bg-purvis-accent flex items-center justify-center font-bold text-purvis-bg text-sm flex-shrink-0">P</div>
        {open && <div><div className="text-sm font-semibold text-purvis-text whitespace-nowrap">PURVIS</div><div className="text-xs text-purvis-muted whitespace-nowrap">Sovereign AI OS</div></div>}
      </div>
      <nav className="flex-1 py-3 overflow-y-auto space-y-0.5 px-1">
        {MODULES.map(m => (
          <button key={m.id} onClick={() => setActiveModule(m.id)} title={!open?m.label:''}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all btn-press text-left ${!open?'justify-center':''} ${activeModule===m.id?'bg-purvis-accent/15 text-purvis-accent':'text-purvis-muted hover:text-purvis-text hover:bg-white/5'}`}>
            <span className="text-base flex-shrink-0">{m.icon}</span>
            {open && <div className="min-w-0"><div className="text-sm font-medium truncate">{m.label}</div><div className="text-xs text-purvis-muted truncate">{m.desc}</div></div>}
          </button>
        ))}
      </nav>
      {open && <div className="px-4 py-3 border-t border-purvis-border"><div className="text-xs text-purvis-muted">v11.0.1 · Railway · Sovereign</div></div>}
    </aside>
  )
}
