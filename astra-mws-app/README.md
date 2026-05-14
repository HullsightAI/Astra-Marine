# Astra MWS — AI Survey Platform

**Astra Marine Warranty Services**  
AI-assisted Document Review & Remote Visual Survey Platform  
Powered by Claude AI (Anthropic)

---

## Quick Deploy to Vercel (5 minutes)

1. **Install Node.js** (v18+) from [nodejs.org](https://nodejs.org) if not already installed

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```
   Follow the prompts. Your app will be live at `https://your-app.vercel.app` within 2 minutes.

4. **Custom domain** — in Vercel dashboard, add `astramarinewarranty.com` as a custom domain.

---

## Quick Deploy to Netlify

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Drag the `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop)
4. Done — live URL instantly.

---

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

---

## Project Structure

```
astra-mws-app/
├── index.html              # Entry point
├── vite.config.js          # Vite config
├── package.json
├── public/
│   └── favicon.svg         # Astra MWS hex logo
└── src/
    ├── main.jsx            # React root
    ├── App.jsx             # Root component (tabs, stats, header)
    ├── DocumentTab.jsx     # Document review tab
    ├── VisualTab.jsx       # Remote visual survey tab
    ├── SharedComponents.jsx # Findings, SignOff, ScoreBox, etc.
    ├── api.js              # Claude API calls
    ├── certificate.js      # PDF certificate generation (jsPDF)
    ├── constants.js        # DOC_TYPES and SURVEY_TYPES
    ├── fileReaders.js      # File reading utilities
    └── styles.js           # All CSS
```

---

## Features

### 📄 Document Review
- Upload PDF, DOCX, or TXT documents
- Select from 8 document types: Lift Study, DP FMEA, Sea Fastening, Stability Booklet, Ops Procedures, MWS Application, Voyage Plan, Other
- Claude AI reads actual document content and reviews against applicable standards (Noble Denton, IMCA, DNV, IMO)
- Returns: compliance score, checklist, critical/major/minor findings, MWS commentary
- Expert sign-off: Approve / Conditional / Reject

### 📸 Remote Visual Survey
- Upload photos or images from vessel or operation site
- Select survey type: Vessel Condition, Lift & Rigging, DP Bridge, Sea Fastening, General Pre-Op
- Claude AI analyses each image visually against the survey checklist
- Returns: condition score, visual checklist findings, deficiencies, additional media requirements
- Verdict: Cleared for Operations / Conditional Clearance / Not Cleared

### 📄 Certificate Generation
- One-click PDF certificate generation after expert sign-off
- Professional Astra MWS branded certificates with:
  - Unique certificate number
  - Full findings summary
  - Expert notes
  - Signatory block (Brigitte Hagen-Peter, Astra MWS)
  - Official stamp

---

## Technology

- **React 18** + **Vite 5** — fast, modern frontend
- **Claude Sonnet** (Anthropic) — AI document and visual analysis
- **jsPDF** — client-side PDF certificate generation (no server needed)
- No backend required — all processing happens in the browser + Claude API

---

## Founded By

**Brigitte Hagen-Peter**  
Vessel Manager, SpaceX | Maritime Expert Witness & Consultant  
Astra Marine Warranty Services LLC | Gulf of Mexico, USA  
[astramarinewarranty.com](https://astramarinewarranty.com)
