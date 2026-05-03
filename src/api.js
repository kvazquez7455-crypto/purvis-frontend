import axios from 'axios'
const BASE = 'https://purvis-v11-production-8ad7.up.railway.app'
const PIN  = '7271'
const client = axios.create({ baseURL: BASE, timeout: 30000, headers: { 'x-pin': PIN, 'Content-Type': 'application/json' } })
export const sendChat        = (msg, domain='general') => client.post('/api/chat', { message: msg, domain }).then(r=>r.data)
export const getProviderStatus = () => client.get('/api/provider/status').then(r=>r.data)
export const recommendModel  = (domain, message) => client.get('/api/ai/recommend', { params:{domain,message} }).then(r=>r.data)
export const getViralTrends  = (count=5) => client.get('/api/viral/trends', { params:{count} }).then(r=>r.data)
export const generateContent = (topic, track='political') => client.post('/api/viral/generate', { topic, track }).then(r=>r.data)
export const browserSearch   = (query) => client.post('/api/browser/search', { query }).then(r=>r.data)
export const browserScrape   = (url) => client.post('/api/browser/scrape', { url }).then(r=>r.data)
export const buildPlan       = (idea) => client.post('/api/build/plan', { idea }).then(r=>r.data)
export const buildGenerate   = (plan, tech='react') => client.post('/api/build/generate', { plan, tech }).then(r=>r.data)
export const videoScript     = (topic, style='rabbit-hole') => client.post('/api/video/script', { topic, style }).then(r=>r.data)
export const listAutomations = () => client.get('/api/automation/list').then(r=>r.data)
export const runChain        = (chain) => client.post('/api/automation/run-chain', { chain }).then(r=>r.data)
export const memoryStats     = () => client.get('/api/memory/stats').then(r=>r.data)
export const memorySearch    = (query) => client.post('/api/memory/search', { query }).then(r=>r.data)
