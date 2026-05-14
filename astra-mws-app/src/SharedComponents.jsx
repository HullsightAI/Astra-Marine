import { useState } from 'react'
import { generateCertificate } from './certificate.js'

export function scoreColor(s) {
  return s >= 85 ? 'var(--green)' : s >= 65 ? 'var(--amber)' : 'var(--red)'
}

export function Findings({ f }) {
  if (!f) return null
  return (
    <div style={{ marginBottom: 13 }}>
      <div className="sec-hdr">Findings</div>
      {f.critical?.length > 0 && (
        <div className="fg">
          <div className="fg-hdr" style={{ color: 'var(--red)' }}>🔴 Critical ({f.critical.length})</div>
          {f.critical.map((x, i) => <div key={i} className="fi fi-c"><span className="fi-b">⬛</span>{x}</div>)}
        </div>
      )}
      {f.major?.length > 0 && (
        <div className="fg">
          <div className="fg-hdr" style={{ color: 'var(--amber)' }}>🟠 Major ({f.major.length})</div>
          {f.major.map((x, i) => <div key={i} className="fi fi-m"><span className="fi-b">⬛</span>{x}</div>)}
        </div>
      )}
      {f.minor?.length > 0 && (
        <div className="fg">
          <div className="fg-hdr" style={{ color: 'var(--white3)' }}>🔵 Minor ({f.minor.length})</div>
          {f.minor.map((x, i) => <div key={i} className="fi fi-mi"><span className="fi-b">·</span>{x}</div>)}
        </div>
      )}
      {f.positive?.length > 0 && (
        <div className="fg">
          <div className="fg-hdr" style={{ color: 'var(--green)' }}>✅ Satisfactory ({f.positive.length})</div>
          {f.positive.map((x, i) => <div key={i} className="fi fi-p"><span className="fi-b">✓</span>{x}</div>)}
        </div>
      )}
    </div>
  )
}

export function SignOff({ itemId, isVisual, result, surveyType, docType, itemName, notes, setNotes, confirmed, setConfirmed }) {
  const [generating, setGenerating] = useState(false)
  const [certIssued, setCertIssued] = useState(null)
  const conf = confirmed[itemId]

  const confirmDecision = (status) => {
    setConfirmed(c => ({ ...c, [itemId]: { status, note: notes[itemId] || '', timestamp: new Date().toISOString() } }))
  }

  const issueCert = async () => {
    if (!conf) return
    setGenerating(true)
    try {
      await generateCertificate({ type: isVisual ? 'visual' : 'doc', result, confirmed: conf, surveyType, docType, itemName })
      setCertIssued(new Date().toLocaleTimeString())
    } catch (e) {
      alert('Certificate generation failed: ' + e.message)
    } finally {
      setGenerating(false)
    }
  }

  const isApproved = conf?.status === 'APPROVED' || conf?.status === 'CLEARED' || conf?.status === 'CLEARED FOR OPERATIONS'
  const isConditional = conf?.status === 'CONDITIONAL'
  const confClass = isApproved ? 'conf-ok' : isConditional ? 'conf-cond' : 'conf-bad'

  return (
    <div className="signoff">
      <div className="signoff-lbl">⚓ Expert MWS Sign-Off — Brigitte Hagen-Peter, Astra MWS</div>
      <div className="signoff-note">
        AI review complete. Add expert notes then issue your decision. Your sign-off carries the full authority of Astra Marine Warranty Services.
      </div>
      <textarea
        className="signoff-ta"
        placeholder="Add expert notes, qualifications, conditions, or override reasoning..."
        value={notes[itemId] || ''}
        onChange={e => setNotes(n => ({ ...n, [itemId]: e.target.value }))}
      />
      {!conf ? (
        <div className="actions">
          <button className="btn btn-approve" onClick={() => confirmDecision(isVisual ? 'CLEARED' : 'APPROVED')}>
            {isVisual ? '✓ Clear for Ops' : '✓ Approve'}
          </button>
          <button className="btn btn-cond" onClick={() => confirmDecision('CONDITIONAL')}>~ Conditional</button>
          <button className="btn btn-reject" onClick={() => confirmDecision(isVisual ? 'NOT CLEARED' : 'REJECTED')}>
            {isVisual ? '✗ Not Cleared' : '✗ Reject'}
          </button>
        </div>
      ) : (
        <>
          <div className={`confirmed ${confClass}`}>
            {isApproved ? '✓' : isConditional ? '~' : '✗'}
            &nbsp;Confirmed: <strong>{conf.status}</strong> · {new Date(conf.timestamp).toLocaleTimeString()}
            {conf.note && <span style={{ marginLeft: 7, fontWeight: 400, opacity: .8 }}>· "{conf.note.substring(0, 50)}{conf.note.length > 50 ? '...' : ''}"</span>}
          </div>
          <div className="actions" style={{ marginTop: 8 }}>
            <button className="btn btn-cert" onClick={issueCert} disabled={generating}>
              {generating ? '⏳ Generating PDF...' : '📄 Issue Certificate / Notice'}
            </button>
            <button className="btn btn-ghost" onClick={() => setConfirmed(c => { const n = { ...c }; delete n[itemId]; return n })}>↩ Revise</button>
          </div>
          {certIssued && (
            <div className="cert-issued">
              📄 <strong>Certificate issued and downloaded</strong> · {certIssued}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function QueueItem({ item, isActive, confirmed, onClick, typeLabel }) {
  const fin = confirmed[item.id]?.status || item.result?.recommendation
  const col = fin === 'APPROVED' || (fin?.includes('CLEARED') && !fin?.includes('NOT')) ? 'var(--green)'
    : fin === 'CONDITIONAL' ? 'var(--amber)'
    : fin === 'REJECTED' || fin?.includes('NOT') ? 'var(--red)'
    : item.status === 'error' ? 'var(--red)'
    : 'var(--teal)'
  const icon = fin === 'APPROVED' || (fin?.includes('CLEARED') && !fin?.includes('NOT')) ? '✓'
    : fin === 'CONDITIONAL' ? '~'
    : fin === 'REJECTED' || fin?.includes('NOT') ? '✗'
    : null

  return (
    <div className={`qi ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="q-dot" style={{ background: col }} />
      <div className="q-info">
        <div className="q-name">{item.name || `${item.names?.length} image${item.names?.length !== 1 ? 's' : ''}`}</div>
        <div className="q-meta">{typeLabel}</div>
      </div>
      {icon && <div className="q-tag" style={{ color: col }}>{icon}</div>}
      {item.status === 'reviewing' && <div style={{ fontSize: 9, color: 'var(--teal)', fontFamily: 'monospace' }}>…</div>}
      {item.status === 'error' && <div style={{ fontSize: 9, color: 'var(--red)' }}>!</div>}
    </div>
  )
}

export function ReviewingState({ name, step, note }) {
  return (
    <div className="rving">
      <div className="spinner" />
      <div className="rving-title">Claude AI Reviewing</div>
      <div style={{ fontSize: 11, color: 'var(--white3)' }}>{name}</div>
      <div className="rving-step">{step}</div>
      {note && <div className="rving-note">{note}</div>}
    </div>
  )
}

export function ScoreBox({ score, label }) {
  const color = scoreColor(score)
  return (
    <div className="score-box">
      <div className="score-row">
        <span className="score-lbl">{label}</span>
        <span className="score-num" style={{ color }}>{score}/100</span>
      </div>
      <div className="score-bar">
        <div className="score-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}
