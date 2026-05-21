import { DOC_TYPES, SURVEY_TYPES } from './constants.js'

const CLAUDE_MODEL = 'claude-sonnet-4-20250514'
const API_URL = 'https://api.anthropic.com/v1/messages'

// ── BAKED-IN INDUSTRY STANDARDS KNOWLEDGE BASE ──────────────────────────────
// These core standards are permanently embedded in every document review.
// The AI cross-checks every submission against these requirements automatically.

const CORE_STANDARDS_KNOWLEDGE = `
ASTRA MWS CORE INDUSTRY STANDARDS KNOWLEDGE BASE
=================================================
The following standards and guidelines are permanently embedded in your review framework.
Cross-check every document submission against these requirements.

── DYNAMIC POSITIONING ──────────────────────────────────────────────────────

IMCA M 166 (Guidance on Failure Modes and Effects Analyses):
- FMEA must demonstrate that the vessel meets its DP class notation under worst case single failure
- Worst Case Failure Design Intent (WCFDI) must be clearly identified and demonstrated
- Single failure analysis must cover all power, thruster, and reference system failures
- FMEA trials programme must verify all identified failure modes
- Gap analysis between FMEA and actual vessel configuration must be documented
- FMEA must be updated after any modification affecting DP capability

IMCA M 103 (Guidelines for the Design and Operation of DP Vessels):
- DP Class 1: loss of position may occur in event of single failure
- DP Class 2: loss of position shall not occur in event of single failure (excluding drive-through)
- DP Class 3: as Class 2 but also withstands flooding of one watertight compartment
- Capability plots must be produced for all relevant environmental conditions
- DP incidents must be recorded and analysed

IMO MSC/Circ.645 (Guidelines for Vessels with Dynamic Positioning Systems):
- Equipment class defines minimum redundancy requirements
- Position reference systems: minimum 2 for Class 2, minimum 3 for Class 3
- Environmental sensors: minimum redundancy as per class notation
- DP control system: independent and redundant as per class notation

DNV-RP-E307 (Dynamic Positioning Systems — Operation Guidance):
- Annual DP trials required for Class 2 and Class 3 vessels
- DP Capability Analysis must use recognised methodology
- Reference system selection and weighting must be documented
- ASOG (Activity Specific Operating Guidelines) required for critical operations

── MARINE WARRANTY SURVEY ────────────────────────────────────────────────────

Noble Denton Technical Policy ND-G-010 (General Requirements):
- MWS must be engaged before detailed engineering is finalised where practicable
- Survey scope must be agreed in writing before survey commences
- Deviations from approved procedures must be documented and approved
- Marine Warranty Certificate must not be issued until all conditions are satisfied
- Surveyor must have adequate time to review all documentation

Noble Denton ND-G-0013 (Guidelines for Marine Operations):
- Marine Operation Manuals must include: scope, vessel particulars, equipment, procedures, limits
- Weather criteria must be defined for each phase of the operation
- Contingency procedures must be documented for foreseeable abnormal situations
- Personnel qualifications must be appropriate for the operations to be performed

IMCA M 206 (A Guide to MWS for Offshore Projects):
- MWS scope must clearly define which operations require approval
- Approval documentation must be retained for minimum 7 years
- MWS must have access to all relevant technical documentation
- Conditions on certificates must be specific and measurable

── LIFTING OPERATIONS ────────────────────────────────────────────────────────

Noble Denton Guidelines 0013/ND (Marine Lifting):
- Lift weight must include all rigging, spreader beams, and appurtenances
- Dynamic Amplification Factor (DAF): minimum 1.1 for offshore lifts, higher in poor conditions
- Sling angles: maximum 45 degrees from vertical without specific engineering justification
- Crane SWL must not be exceeded under any rigging configuration
- Lift plan must address centre of gravity, rigging arrangement, and contingencies
- Weather criteria must be defined: Hs limit, wind limit, current limit

DNV-ST-N001 (Marine Operations and Marine Warranty):
- All offshore lifts over 50 tonnes require engineering review
- Lift studies must address static and dynamic loads
- Multiple crane lifts require additional analysis of load sharing
- Personnel transfer by crane requires specific procedures and equipment certification

ISO 4309 / EN 13000 (Crane safety):
- All lifting equipment must have current certification
- Slings, shackles, and rigging accessories must be within rated capacity
- Pre-lift inspection required before every lift

── SEA FASTENING & CARGO SECURING ───────────────────────────────────────────

DNV-RP-N001 (Integrity Management of Offshore Structures) / Noble Denton Sea Fastening:
- Sea fastening design loads must be based on vessel motion analysis for the specific voyage
- Vessel motions must account for: route, season, vessel particulars, cargo position
- Safety factor on sea fastening design: minimum 1.5 on yield, minimum 2.0 on ultimate
- Grillage and sea fastening must be designed by a qualified structural engineer
- As-built sea fastening must be inspected and approved before departure
- Voyage criteria (Hs limit, heading limits) must be defined and communicated to master

IMO CSS Code (Code of Safe Practice for Cargo Stowage and Securing):
- Cargo must be secured against all reasonably foreseeable conditions of the voyage
- Securing arrangements must be accessible for inspection at sea
- Documentation must include securing arrangement drawings and calculations

── STABILITY ─────────────────────────────────────────────────────────────────

IMO Resolution A.749(18) (Code on Intact Stability):
- Righting lever GZ at 30 degrees: minimum 0.20 metres
- Maximum GZ at 25 degrees or above
- Area under GZ curve 0-30 degrees: minimum 0.055 metre-radians
- Area under GZ curve 0-40 degrees: minimum 0.090 metre-radians
- Area under GZ curve 30-40 degrees: minimum 0.030 metre-radians
- GM (metacentric height): minimum 0.15 metres

SOLAS Chapter II-1 (Construction — Subdivision and Stability):
- Damage stability requirements vary by vessel type and service
- Flooding assumptions must be conservative
- All loading conditions in the stability booklet must demonstrate compliance

IMO MSC.267(85) (2008 IS Code):
- Severe wind and rolling criterion must be satisfied
- Passenger vessels have additional requirements
- Stability booklet must be approved by flag state or recognised organisation

── OPERATIONAL PROCEDURES ────────────────────────────────────────────────────

ISM Code (International Safety Management Code — SOLAS Chapter IX):
- SMS must identify risks and provide safeguards
- Emergency procedures must be documented and drilled
- Non-conformities must be reported and corrected
- Designated Person Ashore (DPA) must be identified

IMCA SEA 009 (A Guide to Risk Assessment for Offshore Operations):
- Hazard identification must be systematic
- Risk ratings must consider both likelihood and consequence
- Control measures must be documented and assigned to responsible persons
- Residual risk must be acceptable before operations commence

OVID/CMID (Offshore Vessel Inspection Database):
- Go/No-Go criteria must be clearly defined and measurable
- Environmental operating limits must be specific: Hs, wind speed, visibility, current
- Communication protocols must identify primary and backup methods
- Personnel competency requirements must be stated with reference to recognised standards

── VOYAGE PLANNING ───────────────────────────────────────────────────────────

SOLAS V/34 (Safe Navigation):
- Voyage plan must be prepared before departure
- Plan must consider: traffic separation, depths, tides, currents, weather
- Plan must be approved by master before departure

IMO Resolution A.893(21) (Guidelines for Voyage Planning):
- Four stages: appraisal, planning, execution, monitoring
- Contingency options must be identified for each leg
- Port entry/departure plans must include pilot requirements
- Weather routing service recommended for ocean passages

── AUTONOMOUS & NOVEL OPERATIONS ────────────────────────────────────────────

IMO MSC-MEPC.1/Circ.3 (MASS Regulatory Scoping Exercise):
- No binding international regulation yet for fully autonomous vessels
- Flag state discretion applies — formal approval required before operations
- Class society innovation notices/approval in principle required
- DP systems on autonomous vessels must meet applicable class notation requirements

IMCA guidance on Remote Operations:
- Remote operations centre must have equivalent situational awareness to bridge
- Communications redundancy essential for autonomous operations
- Failure modes must consider loss of communications as a primary failure
- Return-to-port or safe haven capability must be demonstrated

── MWS INDUSTRY PRACTICE & PROCESS KNOWLEDGE ────────────────────────────────
(Source: Marine Warranty Surveying Companies — Industry Overview Document)

MWS Company Structure & Market:
- MWS originated from Noble Denton and Matthews Daniel — nearly all current companies
  trace lineage to these two firms
- Major active MWS companies: DNV (formerly Noble Denton), ABL Group, Global Maritime,
  Matthews Daniel (BV), MCE, Sterling Technical, WavesGroup
- No MWS company survives on MWS work alone — all have diversified service lines
- Smaller specialist companies can and do win MWS contracts, including directly from underwriters
- Pre-qualification required per JNRC 2019-010 MWS Companies Pre-Qualification Guideline

MWS Bidding & Contract Standards:
- Bid documents must clearly define: documents to be reviewed, time allocated per document,
  attendance assumptions, rates and expenses
- Standard review time: ~4 hours per document per revision; re-review typically 2-4 hours
- MWS company typically agrees to limit liability to the cost of the survey
- Hold/Harmless clauses should be sought but are increasingly omitted by clients
- Scope changes post-award require formal Variation Orders — ambiguity must be avoided
- Lowest price bidding is increasing, especially in Far East and some European NOCs
- MWS must be contracted as close to the Assured as possible — being two companies
  removed from the Assured is a known risk factor

Project Document Control Standards:
- Documents must progress through formal revision stages: ITC → Internal Review →
  Client Comment → AFD → AFC
- MWS typically reviews documents at AFC (Approved For Construction) revision
- Document changes must be marked on each revision
- Every page must carry the document number
- Dimensions must appear only once across all project drawings
- Referenced documents must be clearly listed
- Document register (MDR) should be obtained by MWS at kick-off — MWS selects
  which documents to review, not the project team

Document Review Categories (TRN — Technical Review Notes):
- Category A: Critical showstopper — must be resolved before any site attendance
- Category B: Important question/clarification — must be answered before site attendance
- Category C: Issue addressable on site — must be closed before Certificate of Approval (CoA)
- Category D: Information only
- All A and B items must be answered before attending site
- All A, B, and C items must be closed before issuing CoA

MWS Kick-Off Meeting Requirements:
- Must include: MWS, project team, underwriter, and broker
- Establish: standards required, first attendances, invoicing mechanism
- Obtain Main Document Register (MDR) immediately after kick-off
- Confirm contract is signed and accepted

Suitability Survey Standards:
- Not a condition survey alone — must assess suitability for the specific operation
- Check: dimensional restrictions, operational restrictions, certification, crew competency
- Galley hygiene and housekeeping are valid survey considerations on long voyages
- Ideal timing: approximately 2 months before operation to allow defect rectification
- Written report required with recommendations and follow-up survey

Site Attendance Standards:
- Pre-operation meeting mandatory: project manager, contractor supervisors, vessel masters,
  site staff, MWS all present
- Tool box talk to follow pre-op meeting
- Project hierarchy must be reiterated, radios allocated, exclusion zones established
- Site checklist must be project-specific — generic checklists are not acceptable
- All document reviews, suitability surveys, and equipment tests must be closed out
  before CoA is signed
- CoA must include date and time of signing
- Copies of CoA to project manager immediately upon signing

Certificate of Approval (CoA) — Five Prerequisites (all must be complete):
1. All document reviews signed off with all MWS questions answered
2. All suitability survey recommendations closed out
3. All equipment testing complete with satisfactory results
4. All meeting recommendations completed
5. All site attendance items completed to surveyor's satisfaction

MWS Role and Limitations:
- MWS provides overarching view of marine operations — not exhaustive engineering review
- Approximately 4 hours average per document — not every detail fully understood
- MWS is typically the only independent party in the chain with overall marine operations experience
- MWS usually attends site alone — dual attendance only for junior experience or 24-hour coverage
- Specialist engineer second opinion should be sought internally when doubt exists
- Novel/unique projects must be identified early as higher risk — unknowns require explicit management

── SPACE INDUSTRY MARITIME (ASTRA MWS PROPRIETARY) ─────────────────────────

Astra Marine Warranty Services Space Maritime Framework (v1.0):
- All offshore launch and recovery vessel operations require pre-operation MWS approval
- DP systems supporting launch or recovery operations must be Class 2 minimum
- DP FMEA must specifically address failure modes during active launch/landing sequences
- Exclusion zone procedures must be documented and coordinated with launch authority
- Rocket/payload transport operations: sea fastening design loads must include
  vibration, dynamic loads specific to aerospace hardware sensitivity
- Autonomous vessel operations supporting space operations: remote operations centre
  must maintain independent communications with launch control
- Weather criteria must align with both maritime and launch/recovery operational limits
- Novel operation types without existing precedent require flag state engagement
  and class society approval in principle before MWS certificate can be issued
`

// ── API HELPER ────────────────────────────────────────────────────────────────
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

// ── BUILD SYSTEM PROMPT ───────────────────────────────────────────────────────
function buildDocSystemPrompt(docTypeKey, referenceDocText = null) {
  const dt = DOC_TYPES[docTypeKey]

  const referenceSection = referenceDocText
    ? `
── ADDITIONAL REFERENCE DOCUMENT PROVIDED BY REVIEWER ──────────────────────
The following document has been uploaded by the reviewing MWS as an additional
reference standard. Cross-check the submitted document against this reference
in addition to the core standards above. Flag any non-compliance or deviations.

${referenceDocText.substring(0, 8000)}
── END OF REFERENCE DOCUMENT ────────────────────────────────────────────────
`
    : ''

  return `You are an expert Marine Warranty Surveyor (MWS) AI for Astra Marine Warranty Services,
founded by Brigitte Hagen-Peter — 15+ year offshore maritime veteran, qualified DPO,
DP FMEA specialist, and MWS manager with experience across Gulf of Mexico oil & gas,
offshore wind, and space industry maritime operations.

${CORE_STANDARDS_KNOWLEDGE}
${referenceSection}

You are reviewing a ${dt.label} document.
Primary applicable standards for this document type: ${dt.standards}
Key technical focus areas: ${dt.focus}

Cross-check the submitted document against ALL of the above standards.
Identify any gaps, non-conformances, or areas where the document does not meet
the requirements of the applicable standards listed above.

Return ONLY this JSON (no markdown, no preamble):
{
  "documentTitle": "extracted or inferred title",
  "documentSummary": "2-3 sentence summary of document scope and purpose",
  "recommendation": "APPROVED" | "CONDITIONAL" | "REJECTED",
  "complianceScore": <integer 0-100>,
  "standardsChecked": ["list of specific standards cross-checked against this document"],
  "checksResult": [{"check": "description", "status": "pass"|"flag"|"fail", "note": "specific standard reference and explanation"}],
  "findings": {
    "critical": ["show-stopper findings with specific standard reference"],
    "major": ["must resolve before approval — with specific standard reference"],
    "minor": ["recommended corrections"],
    "positive": ["satisfactory elements — noting which standards are met"]
  },
  "mwsNotes": "2-3 sentences of expert MWS commentary on overall quality and standards compliance",
  "conditions": ["if CONDITIONAL: specific conditions referencing applicable standards"]
}

Rules:
- Base ALL findings on the actual document content AND the standards above
- When citing a finding, reference the specific standard (e.g. "Per IMCA M 166, the WCFDI has not been demonstrated")
- 85-100 = APPROVED, 65-84 = CONDITIONAL, 0-64 = REJECTED
- Be technically precise — this is a professional MWS review`
}

function buildVisualSystemPrompt(surveyTypeKey) {
  const st = SURVEY_TYPES[surveyTypeKey]
  return `You are an expert Marine Warranty Surveyor (MWS) conducting a remote visual survey
for Astra Marine Warranty Services, founded by Brigitte Hagen-Peter.

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

Rules: Base ALL findings ONLY on what is visually observable. Be specific.
85-100 = CLEARED, 65-84 = CONDITIONAL, 0-64 = NOT CLEARED.`
}

// ── EXPORTED API FUNCTIONS ────────────────────────────────────────────────────

export async function reviewDocument(docTypeKey, content, fileName, isPDF, referenceDocText = null) {
  const dt = DOC_TYPES[docTypeKey]
  const system = buildDocSystemPrompt(docTypeKey, referenceDocText)

  const userContent = isPDF
    ? [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: content } },
        { type: 'text', text: `Review this ${dt.label}: "${fileName}". Cross-check against all standards in your knowledge base${referenceDocText ? ' and the additional reference document provided' : ''}. Return JSON only.` }
      ]
    : [{
        type: 'text',
        text: `Review this ${dt.label}: "${fileName}"\n\nDocument content:\n${content}\n\nCross-check against all standards in your knowledge base${referenceDocText ? ' and the additional reference document provided' : ''}. Return JSON only.`
      }]

  return callClaude(system, userContent)
}

export async function reviewVisual(surveyTypeKey, imageDataArray, fileNames) {
  const system = buildVisualSystemPrompt(surveyTypeKey)
  const userContent = [
    ...imageDataArray.map(b64 => ({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: b64 }
    })),
    {
      type: 'text',
      text: `Remote MWS visual survey of ${imageDataArray.length} image(s): ${fileNames.join(', ')}. Return JSON only.`
    }
  ]
  return callClaude(system, userContent)
}

export { CORE_STANDARDS_KNOWLEDGE }

