import { useState, useRef, useCallback } from 'react'
import { DOC_TYPES } from './constants.js'
import { reviewDocument } from './api.js'
import { readDocFile, genId, genReviewId } from './fileReaders.js'
import { Findings, SignOff, QueueItem, ReviewingState, ScoreBox } from './SharedComponents.jsx'

const STEPS = [
  'Reading document content...',
  'Loading core industry standards...',
  'Cross-referencing IMCA guidelines...',
  'Cross-referencing Noble Denton requirements...',
  'Checking IMO & SOLAS compliance...',
  'Evaluating against Astra MWS framework...',
  'Identifying deficiencies...',
  'Generating MWS report...'
]

// ── Read reference document as text ─────────────────────────────────────────
async function readReferenceFile(file) {
  const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf')
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    if (isPDF) {
      // For PDFs we send as base64 and note it's a reference
      reader.onload = e => resolve({ content: e.target.result.split(',')[1], isPDF: true, name: file.name })
      reader.readAsDataURL(file)
    } else {
      reader.onload = e => resolve({ content: e.target.result, isPDF: false, name: file.name })
      reader.readAsText(file)
    }
    reader.onerror = reject
  })
}

export default function DocumentTab({ notes, setNotes, confirmed, setConfirmed, onCount }) {
  const [queue, setQueue] = useState([])
  const [selected, setSelected] = useState(null)
  const [docType, setDocType] = useState('lift-study')
  const [step, setStep] = useState('')
  const [drag, setDrag] = useState(false)
  const [dragRef, setDragRef] = useState(false)

  // Reference document state
  const [referenceDoc, setReferenceDoc] = useState(null) // { name, content, isPDF }
  const [refLoading, setRefLoading] = useState(false)

  const fileRef = useRef()
  const refFileRef = useRef()

  // ── Load reference document ─────────────────────────────────────────────
  const handleReferenceFile = useCallback(async (files) => {
    const file = files[0]
    if (!file) return
    setRefLoading(true)
    try {
      const result = await readReferenceFile(file)
      setReferenceDoc(result)
    } catch (e) {
      alert('Could not read reference file: ' + e.message)
    } finally {
      setRefLoading(false)
    }
  }, [])

  // ── Handle document review ──────────────────────────────────────────────
  const handleFiles = useCallback(async (files) => {
    for (const file of Array.from(files)) {
      const id = genId('doc')
      setQueue(q => {
        const nq = [...q, {
          id, name: file.name, docType, status: 'reviewing',
          result: null, error: null,
          usedReference: referenceDoc ? referenceDoc.name : null
        }]
        onCount(nq.length)
        return nq
      })
      setSelected(id)

      try {
        let si = 0; setStep(STEPS[0])
        const iv = setInterval(() => {
          si = Math.min(si + 1, STEPS.length - 1)
          setStep(STEPS[si])
        }, 1600)

        const { content, isPDF } = await readDocFile(file)

        // Pass reference doc text if available
        let refText = null
        if (referenceDoc) {
          refText = referenceDoc.isPDF
            ? `[Reference document "${referenceDoc.name}" provided as PDF — apply its requirements to your review]`
            : referenceDoc.content
        }

        const result = await reviewDocument(docType, content, file.name, isPDF, refText)
        clearInterval(iv)
        result.reviewId = genReviewId()
        result.timestamp = new Date().toISOString()
        result.referenceDoc = referenceDoc?.name || null

        setQueue(q => q.map(x => x.id === id ? { ...x, status: 'done', result } : x))
      } catch (e) {
        setQueue(q => q.map(x => x.id === id ? { ...x, status: 'error', error: e.message } : x))
      } finally {
        setStep('')
      }
    }
  }, [docType, onCount, referenceDoc])

  const onDrop = useCallback(e => {
    e.preventDefault(); setDrag(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const onDropRef = useCallback(e => {
    e.preventDefault(); setDragRef(false)
    handleReferenceFile(e.dataTransfer.files)
  }, [handleReferenceFile])

  const item = queue.find(q => q.id === selected)
  const result = item?.result
  const vc = result?.recommendation === 'APPROVED' ? 'v-ok'
    : result?.recommendation === 'CONDITIONAL' ? 'v-cond' : 'v-bad'

  return (
    <div className="layout">
      <div className="sidebar">

        {/* ── REFERENCE DOCUMENT SECTION ── */}
        <div className="sbs">
          <div className="sbl">Reference Standard / Guideline</div>
          <div
            className={`drop ref-drop ${dragRef ? 'drag' : ''} ${referenceDoc ? 'ref-loaded' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragRef(true) }}
            onDragLeave={() => setDragRef(false)}
            onDrop={onDropRef}
            onClick={() => refFileRef.current?.click()}
          >
            {refLoading ? (
              <>
                <div className="drop-icon">⏳</div>
                <div className="drop-title">Loading...</div>
              </>
            ) : referenceDoc ? (
              <>
                <div className="drop-icon">📘</div>
                <div className="drop-title" style={{ color: 'var(--teal)', fontSize: 10 }}>
                  {referenceDoc.name.length > 30
                    ? referenceDoc.name.substring(0, 27) + '...'
                    : referenceDoc.name}
                </div>
                <div className="drop-sub" style={{ color: 'var(--teal)', marginTop: 3 }}>
                  Active — AI will cross-check against this
                </div>
                <div
                  className="drop-sub"
                  style={{ color: 'var(--red)', marginTop: 6, cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={e => { e.stopPropagation(); setReferenceDoc(null) }}
                >
                  Remove
                </div>
              </>
            ) : (
              <>
                <div className="drop-icon">📘</div>
                <div className="drop-title">Upload Reference Standard</div>
                <div className="drop-sub">
                  PDF · DOCX · TXT<br />
                  IMCA, Noble Denton, client spec,<br />
                  or your own Astra MWS Standard
                </div>
              </>
            )}
            <input
              ref={refFileRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={e => handleReferenceFile(e.target.files)}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            />
          </div>

          {/* Standards always active indicator */}
          <div style={{
            marginTop: 8, padding: '8px 10px',
            background: 'rgba(10,191,202,0.05)',
            border: '1px solid rgba(10,191,202,0.15)',
            borderRadius: 3
          }}>
            <div style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 5, fontFamily: 'monospace' }}>
              Always Active
            </div>
            {[
              'IMCA M 166 (DP FMEA)',
              'Noble Denton Guidelines',
              'IMO A.749 (Stability)',
              'SOLAS V/34 (Voyage)',
              'DNV-RP-E307 (DP Ops)',
              'ISM Code',
              'Astra MWS Framework',
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
                <div style={{ fontSize: 9, color: 'var(--white3)' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DOCUMENT UPLOAD ── */}
        <div className="sbs">
          <div className="sbl">Upload Document for Review</div>
          <div
            className={`drop ${drag ? 'drag' : ''}`}
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
          >
            <div className="drop-icon">📄</div>
            <div className="drop-title">Drop or click to upload</div>
            <div className="drop-sub">
              PDF · DOCX · TXT
              {referenceDoc && (
                <span style={{ display: 'block', color: 'var(--teal)', marginTop: 4 }}>
                  + cross-checking vs. {referenceDoc.name.substring(0, 20)}...
                </span>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
              onChange={e => handleFiles(e.target.files)}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* ── DOCUMENT TYPE ── */}
        <div className="sbs">
          <div className="sbl">Document Type</div>
          <div className="tgrid">
            {Object.entries(DOC_TYPES).map(([k, { label, icon }]) => (
              <div
                key={k}
                className={`tbtn ${docType === k ? 'sel' : ''}`}
                onClick={() => setDocType(k)}
              >
                <div className="tbtn-icon">{icon}</div>
                <div className="tbtn-lbl">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── QUEUE ── */}
        <div className="sbs" style={{ flex: 1 }}>
          <div className="sbl">Queue ({queue.length})</div>
          {queue.length === 0 && (
            <div style={{ fontSize: 10, color: 'var(--white3)', textAlign: 'center', padding: '12px 0' }}>
              No documents yet
            </div>
          )}
          {queue.map(q => (
            <QueueItem
              key={q.id}
              item={q}
              isActive={selected === q.id}
              confirmed={confirmed}
              typeLabel={DOC_TYPES[q.docType]?.label}
              onClick={() => setSelected(q.id)}
            />
          ))}
        </div>
      </div>

      {/* ── MAIN PANEL ── */}
      <div className="panel">
        {!selected && (
          <div className="empty">
            <div className="empty-hex">📄</div>
            <div className="empty-title">Document Review</div>
            <div className="empty-sub">
              Upload any MWS document. Claude cross-checks against IMCA, Noble Denton, IMO, SOLAS, and the Astra MWS framework automatically.
              <br /><br />
              Optionally upload your own reference standard above to cross-check against that too.
            </div>
            <div className="empty-note">
              <strong style={{ color: 'var(--teal)' }}>Standards always active:</strong> IMCA M 166 · Noble Denton · IMO A.749 · SOLAS · DNV-RP-E307 · ISM Code · Astra MWS Framework
            </div>
          </div>
        )}

        {selected && item?.status === 'reviewing' && (
          <ReviewingState
            name={item?.name}
            step={step}
            note={`Reviewing against core industry standards${item.usedReference ? ` + ${item.usedReference}` : ''}`}
          />
        )}

        {selected && item?.status === 'error' && (
          <div className="err-box">
            <strong>Review failed:</strong> {item.error}
            <br /><br />Check file format. PDF and plain text files work best.
          </div>
        )}

        {selected && result && item?.status === 'done' && (
          <div className="results">
            <div className="r-header">
              <div className="r-meta">
                <div className="r-id">ID: {result.reviewId} · {new Date(result.timestamp).toLocaleString()}</div>
                <div className="r-title">{result.documentTitle || DOC_TYPES[item.docType]?.label}</div>
                <div className="r-sub">{item.name}</div>
                {result.referenceDoc && (
                  <div style={{
                    marginTop: 6, padding: '5px 10px',
                    background: 'rgba(10,191,202,0.06)',
                    border: '1px solid rgba(10,191,202,0.2)',
                    borderRadius: 3, fontSize: 10, color: 'var(--teal)'
                  }}>
                    📘 Cross-checked against: {result.referenceDoc}
                  </div>
                )}
                {result.documentSummary && (
                  <div className="r-summary">{result.documentSummary}</div>
                )}
              </div>
              <div className={`verdict ${vc}`}>
                {result.recommendation}
                <div className="verdict-sub">
                  {result.recommendation === 'APPROVED' ? 'Ready for sign-off'
                    : result.recommendation === 'CONDITIONAL' ? 'Issues to resolve'
                    : 'Cannot approve'}
                </div>
              </div>
            </div>

            <ScoreBox score={result.complianceScore} label="Compliance Score" />

            {/* Standards checked */}
            {result.standardsChecked?.length > 0 && (
              <div style={{ marginBottom: 13 }}>
                <div className="sec-hdr">Standards Cross-Checked</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.standardsChecked.map((s, i) => (
                    <div key={i} style={{
                      padding: '4px 10px', borderRadius: 3,
                      background: 'rgba(10,191,202,0.08)',
                      border: '1px solid rgba(10,191,202,0.2)',
                      fontSize: 10, color: 'var(--teal)'
                    }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.mwsNotes && (
              <div className="mws-box">
                <div className="mws-lbl">MWS Commentary</div>
                {result.mwsNotes}
              </div>
            )}

            {result.recommendation === 'CONDITIONAL' && result.conditions?.length > 0 && (
              <div className="cond-box">
                <div className="cond-lbl">Conditions for Approval</div>
                {result.conditions.map((c, i) => (
                  <div key={i} className="cond-item">
                    <span style={{ color: 'var(--amber)', flexShrink: 0 }}>{i + 1}.</span>{c}
                  </div>
                ))}
              </div>
            )}

            {result.checksResult?.length > 0 && (
              <div style={{ marginBottom: 13 }}>
                <div className="sec-hdr">Checklist</div>
                <div className="checks-grid">
                  {result.checksResult.map(({ check, status, note }, i) => (
                    <div key={i} className={`chk ${status}`}>
                      <div className="chk-dot" style={{
                        background: status === 'pass' ? 'var(--green)'
                          : status === 'flag' ? 'var(--amber)' : 'var(--red)'
                      }} />
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

            <SignOff
              itemId={selected}
              isVisual={false}
              result={result}
              docType={item.docType}
              itemName={item.name}
              notes={notes}
              setNotes={setNotes}
              confirmed={confirmed}
              setConfirmed={setConfirmed}
            />
          </div>
        )}
      </div>

      <style>{`
        .ref-drop {
          border-color: rgba(10,191,202,0.2);
          background: rgba(10,191,202,0.02);
        }
        .ref-drop.ref-loaded {
          border-color: rgba(10,191,202,0.4) !important;
          background: rgba(10,191,202,0.06) !important;
          border-style: solid !important;
        }
      `}</style>
    </div>
  )
}
