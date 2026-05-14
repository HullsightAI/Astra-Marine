import { useState, useEffect } from 'react'
import { globalCSS } from './styles.js'
import DocumentTab from './DocumentTab.jsx'
import VisualTab from './VisualTab.jsx'

export default function App() {
  const [tab, setTab] = useState('docs')
  const [docCount, setDocCount] = useState(0)
  const [visCount, setVisCount] = useState(0)
  const [notes, setNotes] = useState({})
  const [confirmed, setConfirmed] = useState({})

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = globalCSS
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const totApproved = Object.values(confirmed).filter(c =>
    c.status === 'APPROVED' || c.status === 'CLEARED' || c.status === 'CLEARED FOR OPERATIONS'
  ).length
  const totOther = Object.values(confirmed).filter(c =>
    c.status === 'CONDITIONAL' || c.status === 'REJECTED' || c.status === 'NOT CLEARED'
  ).length

  return (
    <div className="app">
      {/* HEADER */}
      <div className="hdr">
        <div className="brand">
          <div className="hex">A</div>
          <div>
            <div className="bname">Astra MWS</div>
            <div className="bsub">AI Survey Platform · Powered by Claude</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: 'var(--white3)' }}>Reviewing Authority</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Brigitte Hagen-Peter</div>
            <div style={{ fontSize: 9, color: 'var(--gold)' }}>MWS · Astra Marine Warranty Services</div>
          </div>
          <div className="ai-badge">
            <div className="pulse" />
            CLAUDE AI ACTIVE
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <div className={`tab ${tab === 'docs' ? 'active' : ''}`} onClick={() => setTab('docs')}>
          <span>📄</span> Document Review
          {docCount > 0 && <span className="tab-badge">{docCount}</span>}
        </div>
        <div className={`tab ${tab === 'visual' ? 'active' : ''}`} onClick={() => setTab('visual')}>
          <span>📸</span> Remote Visual Survey
          {visCount > 0 && <span className="tab-badge">{visCount}</span>}
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        {[
          { v: docCount + visCount, l: 'Total Reviews', c: 'var(--white)' },
          { v: docCount, l: 'Documents', c: 'var(--teal)' },
          { v: visCount, l: 'Visual Surveys', c: 'var(--teal)' },
          { v: totApproved, l: 'Cleared / Approved', c: 'var(--green)' },
          { v: totOther, l: 'Conditional / Rejected', c: 'var(--red)' },
        ].map(({ v, l, c }) => (
          <div className="stat" key={l}>
            <div className="stat-v" style={{ color: c }}>{v}</div>
            <div className="stat-l">{l}</div>
          </div>
        ))}
      </div>

      {/* TAB CONTENT */}
      {tab === 'docs' && (
        <DocumentTab notes={notes} setNotes={setNotes} confirmed={confirmed} setConfirmed={setConfirmed} onCount={setDocCount} />
      )}
      {tab === 'visual' && (
        <VisualTab notes={notes} setNotes={setNotes} confirmed={confirmed} setConfirmed={setConfirmed} onCount={setVisCount} />
      )}
    </div>
  )
}
