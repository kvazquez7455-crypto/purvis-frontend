import React, { useState, useRef } from 'react'

const HOME = 'https://www.google.com/webhp?igu=1'

export default function BrowserPanel() {
  const [inputUrl, setInputUrl]     = useState(HOME)
  const [iframeUrl, setIframeUrl]   = useState(HOME)
  const [loading, setLoading]       = useState(false)
  const [history, setHistory]       = useState([HOME])
  const [historyIdx, setHistoryIdx] = useState(0)
  const inputRef = useRef(null)

  function navigate(target) {
    // Auto-prefix protocol if missing
    let url = target.trim()
    if (!url) return
    if (!/^https?:\/\//i.test(url)) {
      // treat as search if no dot, else add https
      url = url.includes('.') ? `https://${url}` : `https://www.google.com/search?q=${encodeURIComponent(url)}`
    }
    setIframeUrl(url)
    setInputUrl(url)
    setLoading(true)
    // push to history
    const newHistory = history.slice(0, historyIdx + 1)
    newHistory.push(url)
    setHistory(newHistory)
    setHistoryIdx(newHistory.length - 1)
  }

  function goBack() {
    if (historyIdx <= 0) return
    const idx = historyIdx - 1
    setHistoryIdx(idx)
    setIframeUrl(history[idx])
    setInputUrl(history[idx])
    setLoading(true)
  }

  function goForward() {
    if (historyIdx >= history.length - 1) return
    const idx = historyIdx + 1
    setHistoryIdx(idx)
    setIframeUrl(history[idx])
    setInputUrl(history[idx])
    setLoading(true)
  }

  function reload() {
    // force iframe reload by briefly clearing src
    const current = iframeUrl
    setIframeUrl('')
    setTimeout(() => setIframeUrl(current), 50)
    setLoading(true)
  }

  function handleKey(e) {
    if (e.key === 'Enter') navigate(inputUrl)
  }

  // Quick-nav shortcuts
  const QUICK = [
    { label: 'Google',   url: 'https://www.google.com' },
    { label: 'ESPN',     url: 'https://www.espn.com' },
    { label: 'X',        url: 'https://x.com' },
    { label: 'YouTube',  url: 'https://www.youtube.com' },
    { label: 'Reddit',   url: 'https://www.reddit.com' },
    { label: 'GitHub',   url: 'https://github.com/kvazquez7455-crypto' },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#0f0f0f' }}>

      {/* ── NAV BAR ── */}
      <div style={{
        display:'flex', alignItems:'center', gap:'6px',
        padding:'8px 12px', background:'#1a1a1a',
        borderBottom:'1px solid #2a2a2a', flexShrink:0
      }}>
        {/* Back */}
        <button onClick={goBack} disabled={historyIdx<=0}
          title="Back"
          style={btnStyle(historyIdx<=0)}>←</button>
        {/* Forward */}
        <button onClick={goForward} disabled={historyIdx>=history.length-1}
          title="Forward"
          style={btnStyle(historyIdx>=history.length-1)}>→</button>
        {/* Reload */}
        <button onClick={reload} title="Reload"
          style={btnStyle(false)}>↻</button>

        {/* URL bar */}
        <input
          ref={inputRef}
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter URL or search..."
          style={{
            flex:1, padding:'6px 12px', borderRadius:'6px',
            background:'#111', border:'1px solid #333',
            color:'#e5e5e5', fontSize:'13px', outline:'none',
            fontFamily:'monospace'
          }}
        />

        {/* Go */}
        <button onClick={() => navigate(inputUrl)}
          style={{
            padding:'6px 14px', borderRadius:'6px',
            background:'#8b5cf6', border:'none',
            color:'#fff', fontSize:'13px', cursor:'pointer',
            fontWeight:600, letterSpacing:'0.5px'
          }}>Go</button>

        {/* Loading pill */}
        {loading && (
          <span style={{
            fontSize:'11px', color:'#8b5cf6',
            background:'#8b5cf620', padding:'2px 8px',
            borderRadius:'99px', whiteSpace:'nowrap'
          }}>Loading…</span>
        )}
      </div>

      {/* ── QUICK NAV ── */}
      <div style={{
        display:'flex', gap:'6px', padding:'6px 12px',
        background:'#141414', borderBottom:'1px solid #222',
        flexShrink:0, overflowX:'auto'
      }}>
        {QUICK.map(q => (
          <button key={q.url} onClick={() => navigate(q.url)}
            style={{
              padding:'3px 10px', borderRadius:'99px',
              background:'#1f1f1f', border:'1px solid #333',
              color:'#aaa', fontSize:'12px', cursor:'pointer',
              whiteSpace:'nowrap', flexShrink:0,
              transition:'color .15s, border-color .15s'
            }}
            onMouseEnter={e=>{e.target.style.color='#e5e5e5';e.target.style.borderColor='#8b5cf6'}}
            onMouseLeave={e=>{e.target.style.color='#aaa';e.target.style.borderColor='#333'}}
          >{q.label}</button>
        ))}
      </div>

      {/* ── IFRAME ── */}
      <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
        {/* Sandboxed site notice */}
        <div style={{
          position:'absolute', top:0, left:0, right:0,
          fontSize:'11px', color:'#555', textAlign:'center',
          padding:'2px', background:'#0a0a0a', zIndex:10, pointerEvents:'none'
        }}>
          ⚠️ Some sites block iframe embedding (X-Frame-Options). Use Google Search to navigate them.
        </div>
        <iframe
          src={iframeUrl}
          title="PURVIS Browser"
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          style={{
            width:'100%', height:'100%',
            border:'none', display:'block',
            marginTop:'20px'
          }}
        />
      </div>

    </div>
  )
}

function btnStyle(disabled) {
  return {
    padding:'6px 10px', borderRadius:'6px',
    background: disabled ? '#111' : '#1f1f1f',
    border:'1px solid #2a2a2a',
    color: disabled ? '#444' : '#ccc',
    fontSize:'15px', cursor: disabled ? 'not-allowed' : 'pointer',
    lineHeight:1, flexShrink:0
  }
}
