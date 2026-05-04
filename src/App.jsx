import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import ChatPanel from './components/ChatPanel.jsx'
import StatusPanel from './components/StatusPanel.jsx'
import ModulePanel from './components/ModulePanel.jsx'
import BrowserPanel from './panels/BrowserPanel.jsx'
import { getProviderStatus } from './api.js'

export default function App() {
  const [activeModule, setActiveModule] = useState('chat')
  const [providerStatus, setProviderStatus] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    fetchStatus()
    const t = setInterval(fetchStatus, 30000)
    return () => clearInterval(t)
  }, [])

  async function fetchStatus() {
    try { setProviderStatus(await getProviderStatus()) }
    catch { setProviderStatus({ openai:false, gemini:false, claude:false }) }
  }

  function renderMain() {
    if (activeModule === 'chat')    return <ChatPanel />
    if (activeModule === 'browser') return <BrowserPanel />
    return <ModulePanel module={activeModule} />
  }

  return (
    <div className="flex h-screen bg-purvis-bg overflow-hidden">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar providerStatus={providerStatus} onToggleSidebar={() => setSidebarOpen(o=>!o)} />
        <main className="flex flex-1 min-h-0">
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {renderMain()}
          </div>
          {/* Status panel hidden on browser tab — gives full width to iframe */}
          {activeModule !== 'browser' && (
            <div className="hidden lg:flex w-72 flex-col border-l border-purvis-border">
              <StatusPanel providerStatus={providerStatus} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
