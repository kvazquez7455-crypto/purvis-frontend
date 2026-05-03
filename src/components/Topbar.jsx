import React from 'react'
function Dot({ label, active }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${active?'bg-purvis-green pulse':'bg-purvis-muted opacity-40'}`}/>
      <span className={`text-xs font-medium ${active?'text-purvis-text':'text-purvis-muted'}`}>{label}</span>
    </div>
  )
}
export default function Topbar({ providerStatus, onToggleSidebar }) {
  const now = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-purvis-surface border-b border-purvis-border min-h-[56px]">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="p-1.5 rounded-md text-purvis-muted hover:text-purvis-text hover:bg-white/5 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div><span className="text-sm font-semibold text-purvis-text">PURVIS Control Center</span><span className="ml-2 text-xs text-purvis-muted hidden sm:inline">· {now}</span></div>
      </div>
      <div className="flex items-center gap-4">
        {providerStatus ? (
          <><Dot label="OpenAI" active={providerStatus.openai}/><Dot label="Gemini" active={providerStatus.gemini}/><Dot label="Claude" active={providerStatus.claude}/></>
        ) : <span className="text-xs text-purvis-muted">Checking providers…</span>}
        <div className="w-8 h-8 rounded-full bg-purvis-accent/20 border border-purvis-accent/40 flex items-center justify-center">
          <span className="text-xs font-bold text-purvis-accent">K</span>
        </div>
      </div>
    </header>
  )
}
