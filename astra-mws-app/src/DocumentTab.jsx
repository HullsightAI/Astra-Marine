import { useState, useRef, useCallback } from 'react'
import { DOC_TYPES } from './constants.js'
import { reviewDocument } from './api.js'
import { readDocFile, genId, genReviewId } from './fileReaders.js'
import { Findings, SignOff, QueueItem, ReviewingState, ScoreBox } from './SharedComponents.jsx'

const STEPS = [
  'Reading document content...', 'Identifying scope and purpose...',
  'Cross-referencing standards...', 'Analysing calculations...',
  'Checking compliance requirements...', 'Evaluating safety margins...',
  'Identifying deficiencies...', 'Generating MWS report...'
]

export default function DocumentTab({ notes, setNotes, confirmed, setConfirmed, onCount }) {
  const [queue, setQueue] = useState([])
  const [selected, setSelected] = useState(null)
  const [docType, setDocType] = useState('lift-study')
  const [step, setStep] = useState('')
  const [drag, setDrag] = useState(false)
  const fileRef = useRef()

  const handleFiles = useCallback(async (files) => {
    for (const file of Array.from(files)) {
      const id = genId('doc')
      setQueue(q => { const nq = [...q, { id, name: file.name, docType, status: 'reviewing', result: null, error: null }]; onCount(nq.length); return nq })
      setSelected(id)
      try {
        let si = 0; setStep(STEPS[0])
        const iv = setInterval(() => { si = Math.min(si + 1, STEPS.length - 1); setStep(STEPS[si]) }, 1800)
        const { content, isPDF } = await readDocFile(file)
        const result = await reviewDocument(docType, content, file.name, isPDF)
        clearInterval(iv)
        result.reviewId = genReviewId()
        result.timestamp = new Date().toISOString()
        setQueue(q => q.map(x => x.id === id ? { ...x, status: 'done', result } : x))
      } catch (e) {
        setQueue(q => q.map(x => x.id === id ? { ...x, status: 'error', error: e.message } : x))
      } finally { setStep('') }
    }
  }, [docType, onCount])

  const onDrop = useCallback(e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }, [handleFiles])
  const item = queue.find(q => q.id === selected)
  const result = item?.result
  const vc = result?.recommendation === 'APPROVED' ? 'v-ok' : result?.recommendation === 'CONDITIONAL' ? 'v-cond' : 'v-bad'

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sbs">
          <div className="sbl">Upload Document</div>
          <div className={`drop ${drag ? 'drag' : ''}`}
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}>
            <div className="drop-icon">📄</div>
            <div className="drop-title">Drop or click to upload</div>
            <div className="drop-sub">PDF · DOCX · TXT</div>
            <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
              onChange={e => handleFiles(e.target.files)} />
          </div>
        </div>

        <div className="sbs">
          <div className="sbl">Document Type</div>
          <div className="tgrid">
            {Object.entries(DOC_TYPES).map(([k, { label, icon }]) => (
              <div key={k} className={`tbtn ${docType === k ? 'sel' : ''}`} onClick={() => setDocType(k)}>
                <div className="tbtn-icon">{icon}</div>
                <div className="tbtn-lbl">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sbs" style={{ flex: 1 }}>
          <div className="sbl">Queue ({queue.length})</div>
          {queue.length === 0 && <div style={{ fontSize: 10, color: 'var(--white3)', textAlign: 'center', padding: '12px 0' }}>No documents yet</div>}
          {queue.map(q => (
            <QueueItem key={q.id} item={q} isActive={selected === q.id} confirmed={confirmed}
              typeLabel={DOC_TYPES[q.docType]?.label} onClick={() => setSelected(q.id)} />
          ))}
        </div>
      </div>

      <div className="panel">
        {!selected && (
          <div className="empty">
            <div className="empty-hex">📄</div>
            <div className="empty-title">Document Review</div>
            <div className="empty-sub">Upload any MWS document. Claude reads the actual content and generates a genuine technical review against applicable standards.</div>
            <div className="empty-note"><strong style={{ color: 'var(--teal)' }}>Supports:</strong> Lift Studies · DP FMEA · Sea Fastening · Stability · Ops Procedures · MWS Applications · Voyage Plans</div>
          </div>
        )}

        {selected && item?.status === 'reviewing' && (
          <ReviewingState name={item?.name} step={step} note="Claude is reading the actual document content and cross-referencing against applicable MWS standards, class rules, and IMCA guidelines." />
        )}

        {selected && item?.status === 'error' && (
          <div className="err-box"><strong>Review failed:</strong> {item.error}<br /><br />Check file format. PDF and plain text files work best.</div>
        )}

        {selected && result && item?.status === 'done' && (
          <div className="results">
            <div className="r-header">
              <div className="r-meta">
                <div className="r-id">ID: {result.reviewId} · {new Date(result.timestamp).toLocaleString()}</div>
                <div className="r-title">{result.documentTitle || DOC_TYPES[item.docType]?.label}</div>
                <div className="r-sub">{item.name}</div>
                {result.documentSummary && <div className="r-summary">{result.documentSummary}</div>}
              </div>
              <div className={`verdict ${vc}`}>
                {result.recommendation}
                <div className="verdict-sub">
                  {result.recommendation === 'APPROVED' ? 'Ready for sign-off' : result.recommendation === 'CONDITIONAL' ? 'Issues to resolve' : 'Cannot approve'}
                </div>
              </div>
            </div>

            <ScoreBox score={result.complianceScore} label="Compliance Score" />

            {result.mwsNotes && <div className="mws-box"><div className="mws-lbl">MWS Commentary</div>{result.mwsNotes}</div>}

            {result.recommendation === 'CONDITIONAL' && result.conditions?.length > 0 && (
              <div className="cond-box">
                <div className="cond-lbl">Conditions for Approval</div>
                {result.conditions.map((c, i) => (
                  <div key={i} className="cond-item"><span style={{ color: 'var(--amber)', flexShrink: 0 }}>{i + 1}.</span>{c}</div>
                ))}
              </div>
            )}

            {result.checksResult?.length > 0 && (
              <div style={{ marginBottom: 13 }}>
                <div className="sec-hdr">Checklist</div>
                <div className="checks-grid">
                  {result.checksResult.map(({ check, status, note }, i) => (
                    <div key={i} className={`chk ${status}`}>
                      <div className="chk-dot" style={{ background: status === 'pass' ? 'var(--green)' : status === 'flag' ? 'var(--amber)' : 'var(--red)' }} />
                      <div className="chk-wrap">
                        <div className="chk-text">{check}</div>
                        {note && <div className="chk-note">{note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Findings f={result.findings} />

            <SignOff itemId={selected} isVisual={false} result={result} docType={item.docType}
              itemName={item.name} notes={notes} setNotes={setNotes} confirmed={confirmed} setConfirmed={setConfirmed} />
          </div>
        )}
      </div>
    </div>
  )
}
