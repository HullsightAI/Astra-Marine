import { useState, useRef, useCallback } from 'react'
import { SURVEY_TYPES } from './constants.js'
import { reviewVisual } from './api.js'
import { readImageFile, genId, genReviewId } from './fileReaders.js'
import { Findings, SignOff, QueueItem, ReviewingState, ScoreBox } from './SharedComponents.jsx'

const STEPS = [
  'Processing images...', 'Identifying visual elements...',
  'Assessing equipment condition...', 'Cross-referencing survey checklist...',
  'Identifying deficiencies...', 'Evaluating safety compliance...',
  'Generating visual survey report...'
]

export default function VisualTab({ notes, setNotes, confirmed, setConfirmed, onCount }) {
  const [queue, setQueue] = useState([])
  const [selected, setSelected] = useState(null)
  const [surveyType, setSurveyType] = useState('vessel-condition')
  const [step, setStep] = useState('')
  const [drag, setDrag] = useState(false)
  const fileRef = useRef()

  const handleFiles = useCallback(async (files) => {
    const imgs = Array.from(files).filter(f => f.type.startsWith('image/') || f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
    if (!imgs.length) return alert('Please upload image files (JPG, PNG, WEBP).')

    const id = genId('vis')
    setQueue(q => { const nq = [...q, { id, names: imgs.map(f => f.name), surveyType, status: 'reviewing', result: null, error: null, previews: [] }]; onCount(nq.length); return nq })
    setSelected(id)

    try {
      const previews = imgs.slice(0, 8).map(f => URL.createObjectURL(f))
      setQueue(q => q.map(x => x.id === id ? { ...x, previews } : x))

      let si = 0; setStep(STEPS[0])
      const iv = setInterval(() => { si = Math.min(si + 1, STEPS.length - 1); setStep(STEPS[si]) }, 1800)

      const imgData = await Promise.all(imgs.slice(0, 4).map(readImageFile))
      const result = await reviewVisual(surveyType, imgData, imgs.map(f => f.name))
      clearInterval(iv)

      result.reviewId = genReviewId('AMWS-VIS')
      result.timestamp = new Date().toISOString()
      result.imageCount = imgs.length
      setQueue(q => q.map(x => x.id === id ? { ...x, status: 'done', result } : x))
    } catch (e) {
      setQueue(q => q.map(x => x.id === id ? { ...x, status: 'error', error: e.message } : x))
    } finally { setStep('') }
  }, [surveyType, onCount])

  const onDrop = useCallback(e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }, [handleFiles])

  const item = queue.find(q => q.id === selected)
  const result = item?.result
  const rec = result?.recommendation || ''
  const vc = rec.includes('CLEARED FOR') || rec === 'CLEARED' ? 'v-ok' : rec.includes('CONDITIONAL') ? 'v-cond' : 'v-bad'
  const shortRec = rec.includes('CLEARED FOR') ? 'CLEARED' : rec.includes('CONDITIONAL') ? 'CONDITIONAL' : rec.includes('NOT') ? 'NOT CLEARED' : rec

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sbs">
          <div className="sbl">Upload Images</div>
          <div className={`drop ${drag ? 'drag' : ''}`}
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}>
            <div className="drop-icon">📸</div>
            <div className="drop-title">Drop photos here</div>
            <div className="drop-sub">JPG · PNG · WEBP<br />Multiple files OK</div>
            <input ref={fileRef} type="file" multiple accept="image/*" onChange={e => handleFiles(e.target.files)} />
          </div>
        </div>

        <div className="sbs">
          <div className="sbl">Survey Type</div>
          <div className="tbtn-row">
            {Object.entries(SURVEY_TYPES).map(([k, { label, icon }]) => (
              <div key={k} className={`tbtn ${surveyType === k ? 'sel' : ''}`} onClick={() => setSurveyType(k)}>
                <span style={{ fontSize: 15 }}>{icon}</span>
                <span className="tbtn-lbl">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sbs" style={{ flex: 1 }}>
          <div className="sbl">Survey Queue ({queue.length})</div>
          {queue.length === 0 && <div style={{ fontSize: 10, color: 'var(--white3)', textAlign: 'center', padding: '12px 0' }}>No surveys yet</div>}
          {queue.map(q => (
            <QueueItem key={q.id} item={q} isActive={selected === q.id} confirmed={confirmed}
              typeLabel={SURVEY_TYPES[q.surveyType]?.label} onClick={() => setSelected(q.id)} />
          ))}
        </div>
      </div>

      <div className="panel">
        {!selected && (
          <div className="empty">
            <div className="empty-hex">📸</div>
            <div className="empty-title">Remote Visual Survey</div>
            <div className="empty-sub">Upload photos from the vessel or site. Claude analyses visual evidence against your MWS survey checklist and generates a remote survey report.</div>
            <div className="empty-note"><strong style={{ color: 'var(--teal)' }}>Covers:</strong> Vessel Condition · Lift & Rigging · DP Bridge · Sea Fastening · General Pre-Op</div>
          </div>
        )}

        {selected && item?.status === 'reviewing' && (
          <ReviewingState
            name={`${item?.names?.length} image(s)`}
            step={step}
            note={`Claude is visually analysing each image against the ${SURVEY_TYPES[item?.surveyType]?.label} checklist.`}
          />
        )}

        {selected && item?.status === 'error' && (
          <div className="err-box"><strong>Survey failed:</strong> {item.error}<br /><br />Ensure images are clear JPG or PNG files.</div>
        )}

        {selected && result && item?.status === 'done' && (
          <div className="results">
            {item.previews?.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, color: 'var(--white3)', marginBottom: 5, fontFamily: 'monospace' }}>
                  {result.imageCount} image(s) analysed
                </div>
                <div className="img-grid">
                  {item.previews.map((src, i) => (
                    <div key={i} className="img-thumb"><img src={src} alt={`Survey ${i + 1}`} /></div>
                  ))}
                </div>
              </div>
            )}

            <div className="r-header">
              <div className="r-meta">
                <div className="r-id">SURVEY ID: {result.reviewId} · {new Date(result.timestamp).toLocaleString()}</div>
                <div className="r-title">{result.surveyTitle || SURVEY_TYPES[item.surveyType]?.label}</div>
                <div className="r-sub">{result.imageCount} image(s) · {SURVEY_TYPES[item.surveyType]?.label}</div>
                {result.sceneDescription && <div className="r-summary">{result.sceneDescription}</div>}
              </div>
              <div className={`verdict ${vc}`}>
                {shortRec}
                <div className="verdict-sub">
                  {rec.includes('CLEARED FOR') ? 'Ready for operations' : rec.includes('CONDITIONAL') ? 'Issues noted' : 'Not cleared'}
                </div>
              </div>
            </div>

            <ScoreBox score={result.conditionScore} label="Visual Condition Score" />

            {result.mwsObservations && <div className="mws-box"><div className="mws-lbl">MWS Visual Observations</div>{result.mwsObservations}</div>}

            {result.additionalMediaRequired?.length > 0 && (
              <div className="cond-box">
                <div className="cond-lbl">Additional Media Required</div>
                {result.additionalMediaRequired.map((m, i) => (
                  <div key={i} className="cond-item"><span style={{ color: 'var(--amber)', flexShrink: 0 }}>{i + 1}.</span>{m}</div>
                ))}
              </div>
            )}

            {result.visualChecks?.length > 0 && (
              <div style={{ marginBottom: 13 }}>
                <div className="sec-hdr">Visual Checklist</div>
                <div className="checks-grid">
                  {result.visualChecks.map(({ item: chk, finding, status }, i) => (
                    <div key={i} className={`chk ${status}`}>
                      <div className="chk-dot" style={{ background: status === 'pass' ? 'var(--green)' : status === 'flag' ? 'var(--amber)' : 'var(--red)' }} />
                      <div className="chk-wrap">
                        <div className="chk-text">{chk}</div>
                        {finding && <div className="chk-note">{finding}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Findings f={result.deficiencies} />

            <SignOff itemId={selected} isVisual={true} result={result} surveyType={item.surveyType}
              itemName={`${result.imageCount} images - ${SURVEY_TYPES[item.surveyType]?.label}`}
              notes={notes} setNotes={setNotes} confirmed={confirmed} setConfirmed={setConfirmed} />
          </div>
        )}
      </div>
    </div>
  )
}
