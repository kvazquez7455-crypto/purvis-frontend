import React, { useState, useRef, useEffect } from 'react'
import { sendChat } from '../api.js'

const DOMAINS = ['general','legal','content','sports','business','money']

function Msg({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 fade-up ${isUser?'flex-row-reverse':''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 border ${isUser?'bg-purvis-accent/20 border-purvis-accent/40 text-purvis-accent':'bg-purvis-green/15 border-purvis-green/30 text-purvis-green'}`}>
        {isUser?'K':'P'}
      </div>
      <div className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${isUser?'bg-purvis-accent/15 border-purvis-accent/20 text-purvis-text rounded-tr-sm':'bg-purvis-surface border-purvis-border text-purvis-text rounded-tl-sm'}`}>
        {msg.loading ? (
          <div className="flex gap-1 items-center py-1">
            {[0,150,300].map(d=><div key={d} className="w-2 h-2 rounded-full bg-purvis-muted animate-bounce" style={{animationDelay:d+'ms'}}/>)}
          </div>
        ) : <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>}
        {msg.model && <div className="mt-1 text-xs text-purvis-muted">via {msg.model}</div>}
      </div>
    </div>
  )
}

export default function ChatPanel() {
  const [messages, setMessages] = useState([{ id:0, role:'assistant', content:"PURVIS online. What's the move, Kelvin?" }])
  const [input, setInput] = useState('')
  const [domain, setDomain] = useState('general')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const uid = Date.now()
    const lid = uid + 1
    setMessages(p=>[...p, { id:uid, role:'user', content:text }, { id:lid, role:'assistant', loading:true }])
    setInput('')
    setLoading(true)
    try {
      const data = await sendChat(text, domain)
      setMessages(p=>p.map(m=>m.id===lid?{ ...m, loading:false, content:data.response||data.reply||JSON.stringify(data), model:data.model }:m))
    } catch(e) {
      setMessages(p=>p.map(m=>m.id===lid?{ ...m, loading:false, content:'⚠️ Error: '+e.message }:m))
    }
    setLoading(false)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3 border-b border-purvis-border">
        <div><h2 className="text-sm font-semibold text-purvis-text">PURVIS Chat</h2><p className="text-xs text-purvis-muted">Railway backend · live</p></div>
        <select value={domain} onChange={e=>setDomain(e.target.value)} className="bg-purvis-bg border border-purvis-border text-purvis-text text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purvis-accent">
          {DOMAINS.map(d=><option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
        </select>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map(m=><Msg key={m.id} msg={m}/>)}
        <div ref={bottomRef}/>
      </div>
      <div className="px-5 py-4 border-t border-purvis-border">
        <div className="flex gap-2 items-end">
          <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
            placeholder="Message PURVIS… (Enter to send)" rows={1} disabled={loading}
            className="flex-1 bg-purvis-bg border border-purvis-border rounded-xl px-4 py-3 text-sm text-purvis-text placeholder-purvis-muted focus:outline-none focus:border-purvis-accent resize-none transition-colors"
            style={{minHeight:'44px',maxHeight:'120px'}}
            onInput={e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,120)+'px'}}
          />
          <button onClick={send} disabled={loading||!input.trim()} className="w-11 h-11 rounded-xl bg-purvis-accent hover:bg-purvis-accent/80 disabled:opacity-40 flex items-center justify-center transition-all btn-press flex-shrink-0">
            <svg className="w-4 h-4 text-purvis-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
        <p className="text-xs text-purvis-muted mt-2 text-center">Domain: <span className="text-purvis-accent">{domain}</span> · PURVIS v11</p>
      </div>
    </div>
  )
}
