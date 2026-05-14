import { DOC_TYPES, SURVEY_TYPES } from './constants.js'

function hexToRgb(hex) {
  return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)]
}

async function loadJsPDF() {
  if (window.jspdf) return window.jspdf.jsPDF
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    s.onload = () => resolve(window.jspdf.jsPDF)
    s.onerror = reject
    document.head.appendChild(s)
  })
}

export async function generateCertificate({ type, result, confirmed, surveyType, docType, itemName }) {
  const jsPDF = await loadJsPDF()
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210, H = 297

  const NAVY = hexToRgb('0D1F3C')
  const TEAL = hexToRgb('0A7C86')
  const GOLD = hexToRgb('C8882A')
  const WHITE = [255,255,255]
  const LIGHT = [230,242,244]
  const GRAY = [100,120,140]
  const DARK = [20,35,55]

  const isVisual = type === 'visual'
  const status = confirmed.status
  const isApproved = status === 'APPROVED' || status === 'CLEARED' || status === 'CLEARED FOR OPERATIONS'
  const isConditional = status === 'CONDITIONAL'
  const statusColor = isApproved ? hexToRgb('10A858') : isConditional ? hexToRgb('C88820') : hexToRgb('C03040')

  const certType = isVisual
    ? (isApproved ? 'VISUAL SURVEY CLEARANCE CERTIFICATE' : isConditional ? 'CONDITIONAL VISUAL SURVEY NOTICE' : 'VISUAL SURVEY NON-CLEARANCE NOTICE')
    : (isApproved ? 'MARINE WARRANTY CERTIFICATE' : isConditional ? 'CONDITIONAL APPROVAL NOTICE' : 'REJECTION NOTICE')

  const certNum = result.reviewId || `AMWS-${Date.now().toString(36).toUpperCase()}`
  const issuedDate = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' })
  const issuedTime = new Date().toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })

  // Background
  doc.setFillColor(...NAVY); doc.rect(0,0,W,H,'F')
  doc.setFillColor(...TEAL); doc.rect(0,0,6,H,'F')
  doc.setFillColor(...GOLD); doc.rect(6,0,W-6,3,'F')
  doc.setFillColor(248,251,254); doc.rect(6,3,W-6,H-3,'F')

  // Header
  doc.setFillColor(...NAVY); doc.rect(6,3,W-6,52,'F')
  doc.setFillColor(...TEAL); doc.circle(28,22,9,'F')
  doc.setFillColor(...NAVY); doc.circle(28,22,7.5,'F')
  doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(...TEAL)
  doc.text('A',28,25,{align:'center'})
  doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.setTextColor(...WHITE)
  doc.text('ASTRA MARINE WARRANTY SERVICES',42,18)
  doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(...TEAL)
  doc.text('Warranty Assurance for the New Offshore Frontier  ·  astramarinewarranty.com',42,25)
  doc.setDrawColor(...GOLD); doc.setLineWidth(0.4); doc.line(42,29,W-14,29)
  doc.setFillColor(...statusColor); doc.roundedRect(42,33,W-56,14,2,2,'F')
  doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(...WHITE)
  doc.text(certType,W/2,42,{align:'center'})

  // Cert row
  doc.setFillColor(...LIGHT); doc.rect(14,60,W-22,14,'F')
  doc.setDrawColor(...TEAL); doc.setLineWidth(0.3); doc.rect(14,60,W-22,14,'S')
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...GRAY)
  doc.text('CERTIFICATE NUMBER',18,66); doc.text('DATE ISSUED',100,66); doc.text('TIME (UTC)',158,66)
  doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(...DARK)
  doc.text(certNum,18,72); doc.text(issuedDate,100,72); doc.text(issuedTime,158,72)
  doc.setFillColor(...statusColor); doc.circle(W-30,66,10,'F')
  doc.setFont('helvetica','bold'); doc.setFontSize(6); doc.setTextColor(...WHITE)
  doc.text(isApproved?'APPROVED':isConditional?'CONDIT.':'REJECTED',W-30,67,{align:'center'})

  let y = 82

  const sectionHeader = (title) => {
    doc.setFillColor(...TEAL); doc.rect(14,y,W-22,7,'F')
    doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...WHITE)
    doc.text(title.toUpperCase(),18,y+5); y+=9
  }

  const row = (label, value, shade=false) => {
    if(shade){doc.setFillColor(240,245,250);doc.rect(14,y,W-22,8,'F')}
    doc.setDrawColor(210,220,230);doc.setLineWidth(0.2);doc.line(14,y+8,W-8,y+8)
    doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(...GRAY);doc.text(label,18,y+4.5)
    doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(...DARK)
    doc.text(String(value||'—').substring(0,90),70,y+5.5);y+=8
  }

  const bodyTxt = (text) => {
    if(!text) return
    doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(50,70,90)
    const lines = doc.splitTextToSize(String(text),W-32)
    doc.text(lines,18,y);y+=lines.length*5+2
  }

  const findingItem = (text, color) => {
    if(!text) return
    doc.setFillColor(...color);doc.circle(18,y+1.5,1.2,'F')
    doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(50,70,90)
    const lines = doc.splitTextToSize(String(text),W-40)
    doc.text(lines,22,y+2.5);y+=lines.length*4.5+1.5
    if(y>H-40){doc.addPage();y=20}
  }

  sectionHeader('Subject of Review')
  row('Type', isVisual ? (SURVEY_TYPES[surveyType]?.label||surveyType) : (DOC_TYPES[docType]?.label||docType), false)
  row('Reference', itemName, true)
  row('Review Method', isVisual?'Remote Visual Survey (AI-Assisted)':'Document Technical Review (AI-Assisted)', false)
  row('AI Platform', 'Claude Sonnet — Astra MWS AI Platform', true)
  if(result.documentTitle && !isVisual) row('Document Title',result.documentTitle,false)
  y+=3

  sectionHeader('Outcome')
  const score = isVisual ? result.conditionScore : result.complianceScore
  row('Decision',status,false)
  row(isVisual?'Visual Condition Score':'Compliance Score',`${score}/100`,true)
  row('AI Recommendation',result.recommendation,false)
  y+=3

  const summary = isVisual ? result.sceneDescription : result.documentSummary
  if(summary){
    doc.setFillColor(235,245,247);doc.rect(14,y,W-22,4,'F')
    doc.setFont('helvetica','bold');doc.setFontSize(7);doc.setTextColor(...TEAL)
    doc.text(isVisual?'SCENE DESCRIPTION':'DOCUMENT SUMMARY',18,y+3);y+=6
    bodyTxt(summary);y+=2
  }

  const mws = isVisual ? result.mwsObservations : result.mwsNotes
  if(mws){
    doc.setFillColor(235,245,247);doc.rect(14,y,W-22,4,'F')
    doc.setFont('helvetica','bold');doc.setFontSize(7);doc.setTextColor(...TEAL)
    doc.text('MWS TECHNICAL OBSERVATIONS',18,y+3);y+=6
    bodyTxt(mws);y+=2
  }

  const findings = isVisual ? result.deficiencies : result.findings
  if(findings&&(findings.critical?.length||findings.major?.length||findings.minor?.length||findings.positive?.length)){
    sectionHeader('Technical Findings')
    if(findings.critical?.length){doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(...hexToRgb('C03040'));doc.text(`CRITICAL (${findings.critical.length})`,18,y+3);y+=6;findings.critical.forEach(f=>findingItem(f,hexToRgb('C03040')));y+=1}
    if(findings.major?.length){doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(...hexToRgb('C88820'));doc.text(`MAJOR (${findings.major.length})`,18,y+3);y+=6;findings.major.forEach(f=>findingItem(f,hexToRgb('C88820')));y+=1}
    if(findings.minor?.length){doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(...GRAY);doc.text(`MINOR (${findings.minor.length})`,18,y+3);y+=6;findings.minor.forEach(f=>findingItem(f,GRAY));y+=1}
    if(findings.positive?.length){doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(...hexToRgb('10A858'));doc.text(`SATISFACTORY (${findings.positive.length})`,18,y+3);y+=6;findings.positive.forEach(f=>findingItem(f,hexToRgb('10A858')));y+=1}
  }

  const conditions = isVisual ? result.additionalMediaRequired : result.conditions
  if(conditions?.length){
    if(y>H-60){doc.addPage();y=20}
    sectionHeader(isVisual?'Additional Media Required':'Conditions for Approval')
    conditions.forEach((c,i)=>{
      const lines=doc.splitTextToSize(`${i+1}. ${c}`,W-36)
      doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(50,70,90)
      doc.text(lines,20,y+2);y+=lines.length*4.5+2
      if(y>H-40){doc.addPage();y=20}
    });y+=2
  }

  if(confirmed.note){
    if(y>H-50){doc.addPage();y=20}
    sectionHeader('Expert MWS Notes')
    bodyTxt(confirmed.note);y+=3
  }

  // Signatory
  if(y>H-70){doc.addPage();y=20}
  y=Math.max(y,H-78)
  doc.setDrawColor(...GOLD);doc.setLineWidth(0.5);doc.line(14,y,W-8,y);y+=5
  doc.setFillColor(...NAVY);doc.rect(14,y,W-22,44,'F')
  doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(...TEAL)
  doc.text('ISSUED BY / REVIEWING AUTHORITY',20,y+8)
  doc.setFont('helvetica','bold');doc.setFontSize(13);doc.setTextColor(...WHITE)
  doc.text('Brigitte Hagen-Peter',20,y+18)
  doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(...GOLD)
  doc.text('Marine Warranty Surveyor  ·  Vessel Manager, SpaceX',20,y+25)
  doc.setTextColor(160,190,210)
  doc.text('Astra Marine Warranty Services LLC  ·  Gulf of Mexico, USA  ·  astramarinewarranty.com',20,y+31)
  doc.setDrawColor(...GOLD);doc.setLineWidth(0.3);doc.line(W-82,y+30,W-16,y+30)
  doc.setFont('helvetica','normal');doc.setFontSize(6.5);doc.setTextColor(...GOLD)
  doc.text('Authorised Signature',W-49,y+34,{align:'center'})
  doc.setDrawColor(...TEAL);doc.setLineWidth(0.5)
  doc.circle(W-32,y+17,10,'S');doc.circle(W-32,y+17,8.5,'S')
  doc.setFont('helvetica','bold');doc.setFontSize(5);doc.setTextColor(...TEAL)
  doc.text('ASTRA',W-32,y+15,{align:'center'});doc.text('MWS',W-32,y+19,{align:'center'})

  // Footer
  doc.setFillColor(...NAVY);doc.rect(0,H-10,W,10,'F')
  doc.setFillColor(...GOLD);doc.rect(0,H-10,W,1,'F')
  doc.setFont('helvetica','normal');doc.setFontSize(5.5);doc.setTextColor(160,190,210)
  doc.text(`${certNum}  ·  ${issuedDate} ${issuedTime}  ·  Astra Marine Warranty Services LLC  ·  AI-assisted review validated by qualified MWS`,W/2,H-5,{align:'center'})

  doc.save(`Astra_MWS_${isApproved?'Certificate':isConditional?'Conditional_Notice':'Rejection_Notice'}_${certNum}.pdf`)
}
