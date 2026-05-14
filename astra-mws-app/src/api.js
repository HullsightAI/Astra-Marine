import { DOC_TYPES, SURVEY_TYPES } from './constants.js'

const CLAUDE_MODEL = 'claude-sonnet-4-20250514'
const API_URL = 'https://api.anthropic.com/v1/messages'

async function callClaude(system, userContent) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      system,
      messages: [{ role: 'user', content: userContent }]
    })
  })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error(e.error?.message || `API error ${res.status}`)
  }
  const data = await res.json()
  const text = data.content?.find(b => b.type === 'text')?.text || ''
  return JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
}

export async function reviewDocument(docTypeKey, content, fileName, isPDF) {
  const dt = DOC_TYPES[docTypeKey]
  const system = `You are an expert Marine Warranty Surveyor (MWS) AI for Astra Marine Warranty Services, founded by Brigitte Hagen-Peter — 15+ year offshore maritime veteran, qualified DPO, DP FMEA specialist, and MWS manager.

Review this ${dt.label} against: ${dt.standards}
Focus areas: ${dt.focus}

Return ONLY this JSON (no markdown, no preamble):
{
  "documentTitle": "extracted or inferred title",
  "documentSummary": "2-3 sentence summary of document scope and purpose",
  "recommendation": "APPROVED" | "CONDITIONAL" | "REJECTED",
  "complianceScore": <integer 0-100>,
  "checksResult": [{"check": "description", "status": "pass"|"flag"|"fail", "note": "brief explanation"}],
  "findings": {
    "critical": ["show-stopper findings"],
    "major": ["must resolve before approval"],
    "minor": ["recommended corrections"],
    "positive": ["satisfactory elements"]
  },
  "mwsNotes": "2-3 sentences expert MWS commentary",
  "conditions": ["if CONDITIONAL: conditions to meet"]
}

Rules: Base ALL findings on actual document content. 85-100=APPROVED, 65-84=CONDITIONAL, 0-64=REJECTED. Be technically precise.`

  const userContent = isPDF
    ? [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: content } },
        { type: 'text', text: `Review this ${dt.label}: "${fileName}". Return JSON only.` }
      ]
    : [{ type: 'text', text: `Review this ${dt.label}: "${fileName}"\n\nContent:\n${content}\n\nReturn JSON only.` }]

  return callClaude(system, userContent)
}

export async function reviewVisual(surveyTypeKey, imageDataArray, fileNames) {
  const st = SURVEY_TYPES[surveyTypeKey]
  const system = `You are an expert Marine Warranty Surveyor (MWS) conducting a remote visual survey for Astra Marine Warranty Services, founded by Brigitte Hagen-Peter — 15+ year offshore veteran, qualified DPO, DP FMEA specialist.

Survey type: ${st.label}
Visual checklist: ${st.checklist.map((c, i) => `${i + 1}. ${c}`).join(', ')}

Return ONLY this JSON (no markdown, no preamble):
{
  "surveyTitle": "brief descriptive title of what you see",
  "sceneDescription": "2-3 sentence objective description of what is visible",
  "overallCondition": "SATISFACTORY" | "CONCERNS NOTED" | "UNSATISFACTORY",
  "conditionScore": <integer 0-100>,
  "visualChecks": [{"item": "checklist item", "finding": "what you observe", "status": "pass"|"flag"|"fail"}],
  "deficiencies": {
    "critical": ["safety-critical deficiencies"],
    "major": ["significant deficiencies"],
    "minor": ["minor observations"],
    "positive": ["satisfactory elements"]
  },
  "mwsObservations": "2-3 sentences expert MWS commentary",
  "additionalMediaRequired": ["specific additional photos or angles needed"],
  "recommendation": "CLEARED FOR OPERATIONS" | "CONDITIONAL CLEARANCE" | "OPERATIONS NOT CLEARED"
}

Rules: Base ALL findings ONLY on what is visually observable. Be specific. 85-100=CLEARED, 65-84=CONDITIONAL, 0-64=NOT CLEARED.`

  const userContent = [
    ...imageDataArray.map(b64 => ({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: b64 }
    })),
    { type: 'text', text: `Remote MWS visual survey of ${imageDataArray.length} image(s): ${fileNames.join(', ')}. Return JSON only.` }
  ]

  return callClaude(system, userContent)
}
