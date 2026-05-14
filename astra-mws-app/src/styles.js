export const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink: #080F18;
  --ink2: #0E1A28;
  --teal: #0ABFCA;
  --teal2: #079AA5;
  --gold: #E0A030;
  --red: #E03050;
  --amber: #E08020;
  --green: #20C870;
  --green2: #10A858;
  --white: #F0F6FC;
  --white2: #C8D8E8;
  --white3: #8098B0;
  --line: rgba(255,255,255,0.07);
  --line2: rgba(255,255,255,0.13);
}

html, body, #root { height: 100%; }
body { background: var(--ink); color: var(--white); font-family: 'Syne', sans-serif; -webkit-font-smoothing: antialiased; }

.app { min-height: 100vh; display: flex; flex-direction: column; }

/* ── HEADER ── */
.hdr { display:flex; align-items:center; justify-content:space-between; padding:0 28px; height:60px; background:rgba(8,15,24,.97); border-bottom:1px solid var(--line2); position:sticky; top:0; z-index:100; backdrop-filter:blur(20px); }
.brand { display:flex; align-items:center; gap:10px; }
.hex { width:34px; height:34px; background:linear-gradient(135deg,var(--teal2),var(--teal)); clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); display:flex; align-items:center; justify-content:center; font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:600; color:var(--ink); flex-shrink:0; }
.bname { font-size:13px; font-weight:700; letter-spacing:2px; text-transform:uppercase; }
.bsub { font-size:9px; letter-spacing:1.5px; color:var(--teal); text-transform:uppercase; margin-top:1px; }
.ai-badge { display:flex; align-items:center; gap:7px; padding:5px 12px; border-radius:2px; background:rgba(10,191,202,.08); border:1px solid rgba(10,191,202,.2); font-family:'IBM Plex Mono',monospace; font-size:9px; color:var(--teal); letter-spacing:1px; }
.pulse { width:5px; height:5px; border-radius:50%; background:var(--teal); animation:pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

/* ── TABS ── */
.tabs { display:flex; border-bottom:1px solid var(--line2); background:var(--ink2); }
.tab { padding:0 28px; height:48px; display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; letter-spacing:1px; cursor:pointer; border-bottom:2px solid transparent; color:var(--white3); transition:all .2s; user-select:none; }
.tab:hover { color:var(--white2); }
.tab.active { color:var(--teal); border-bottom-color:var(--teal); }
.tab-badge { font-family:'IBM Plex Mono',monospace; font-size:9px; background:rgba(10,191,202,.15); border:1px solid rgba(10,191,202,.3); border-radius:10px; padding:1px 6px; color:var(--teal); }

/* ── STATS ── */
.stats { display:grid; grid-template-columns:repeat(5,1fr); gap:1px; background:var(--line); border-bottom:1px solid var(--line); }
.stat { background:var(--ink2); padding:10px 14px; text-align:center; }
.stat-v { font-family:'IBM Plex Mono',monospace; font-size:20px; font-weight:600; line-height:1; }
.stat-l { font-size:8px; letter-spacing:2px; text-transform:uppercase; color:var(--white3); margin-top:3px; }

/* ── LAYOUT ── */
.layout { display:grid; grid-template-columns:280px 1fr; flex:1; min-height:0; height:calc(100vh - 156px); }
.sidebar { background:var(--ink2); border-right:1px solid var(--line); display:flex; flex-direction:column; overflow-y:auto; }
.sbs { padding:16px; border-bottom:1px solid var(--line); }
.sbl { font-family:'IBM Plex Mono',monospace; font-size:8px; letter-spacing:3px; text-transform:uppercase; color:var(--white3); margin-bottom:9px; }

/* ── DROP ZONE ── */
.drop { border:1.5px dashed rgba(10,191,202,.25); border-radius:4px; padding:18px 12px; text-align:center; cursor:pointer; transition:all .2s; position:relative; background:rgba(10,191,202,.02); }
.drop:hover, .drop.drag { border-color:var(--teal); background:rgba(10,191,202,.06); }
.drop input { position:absolute; inset:0; opacity:0; cursor:pointer; }
.drop-icon { font-size:22px; margin-bottom:5px; }
.drop-title { font-size:11px; font-weight:600; margin-bottom:2px; }
.drop-sub { font-size:9px; color:var(--white3); line-height:1.4; }

/* ── TYPE GRID ── */
.tgrid { display:grid; grid-template-columns:1fr 1fr; gap:4px; }
.tbtn { padding:7px 5px; border-radius:3px; background:rgba(255,255,255,.02); border:1px solid var(--line); cursor:pointer; transition:all .15s; text-align:center; font-family:'Syne',sans-serif; }
.tbtn:hover { border-color:rgba(10,191,202,.25); }
.tbtn.sel { border-color:var(--teal); background:rgba(10,191,202,.1); }
.tbtn-icon { font-size:15px; margin-bottom:3px; }
.tbtn-lbl { font-size:8px; color:var(--white2); line-height:1.2; }
.tbtn-row { display:flex; flex-direction:column; gap:4px; }
.tbtn-row .tbtn { display:flex; align-items:center; gap:8px; text-align:left; padding:8px 10px; }
.tbtn-row .tbtn-lbl { font-size:10px; }

/* ── QUEUE ── */
.qi { display:flex; align-items:center; gap:8px; padding:9px 10px; border-radius:3px; background:rgba(255,255,255,.02); border:1px solid var(--line); margin-bottom:4px; cursor:pointer; transition:all .15s; }
.qi:hover { border-color:var(--line2); }
.qi.active { border-color:var(--teal); background:rgba(10,191,202,.06); }
.q-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.q-info { flex:1; min-width:0; }
.q-name { font-size:10px; color:var(--white); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:500; }
.q-meta { font-size:8px; color:var(--white3); margin-top:1px; }
.q-tag { font-family:'IBM Plex Mono',monospace; font-size:8px; font-weight:600; }

/* ── PANEL ── */
.panel { overflow-y:auto; background:var(--ink); }

/* ── EMPTY STATE ── */
.empty { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:48px; text-align:center; gap:12px; }
.empty-hex { width:64px; height:64px; background:linear-gradient(135deg,rgba(10,191,202,.12),rgba(10,191,202,.03)); clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); display:flex; align-items:center; justify-content:center; font-size:24px; }
.empty-title { font-family:'DM Serif Display',serif; font-size:24px; }
.empty-sub { font-size:11px; color:var(--white3); line-height:1.6; max-width:340px; }
.empty-note { padding:10px 14px; background:rgba(10,191,202,.05); border:1px solid rgba(10,191,202,.15); border-radius:3px; font-size:10px; color:var(--white3); max-width:360px; line-height:1.5; }

/* ── REVIEWING ── */
.rving { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:16px; padding:48px; }
.spinner { width:52px; height:52px; border:2px solid rgba(10,191,202,.12); border-top-color:var(--teal); border-radius:50%; animation:spin .9s linear infinite; }
@keyframes spin { to { transform:rotate(360deg) } }
.rving-title { font-family:'DM Serif Display',serif; font-size:20px; }
.rving-step { font-size:11px; color:var(--teal); font-family:'IBM Plex Mono',monospace; letter-spacing:1px; }
.rving-note { font-size:10px; color:var(--white3); text-align:center; max-width:320px; line-height:1.5; }

/* ── IMAGE GRID ── */
.img-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:5px; margin-bottom:14px; }
.img-thumb { aspect-ratio:4/3; border-radius:3px; overflow:hidden; border:1px solid var(--line); }
.img-thumb img { width:100%; height:100%; object-fit:cover; }

/* ── RESULTS ── */
.results { padding:24px; max-width:820px; }
.r-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:18px; gap:14px; }
.r-meta { flex:1; }
.r-id { font-family:'IBM Plex Mono',monospace; font-size:9px; color:var(--white3); letter-spacing:2px; margin-bottom:5px; }
.r-title { font-family:'DM Serif Display',serif; font-size:26px; line-height:1.1; margin-bottom:3px; }
.r-sub { font-size:11px; color:var(--white3); }
.r-summary { font-size:12px; color:var(--white2); line-height:1.6; margin-top:7px; padding:10px 13px; background:rgba(255,255,255,.02); border-left:2px solid var(--teal); border-radius:0 3px 3px 0; }

/* ── VERDICT ── */
.verdict { flex-shrink:0; padding:12px 18px; border-radius:3px; font-family:'IBM Plex Mono',monospace; font-size:13px; font-weight:600; letter-spacing:2px; text-align:center; min-width:140px; }
.v-ok { background:rgba(32,200,112,.09); border:2px solid var(--green); color:var(--green); }
.v-cond { background:rgba(224,128,32,.09); border:2px solid var(--amber); color:var(--amber); }
.v-bad { background:rgba(224,48,80,.09); border:2px solid var(--red); color:var(--red); }
.verdict-sub { font-size:8px; letter-spacing:1px; margin-top:3px; opacity:.7; }

/* ── SCORE ── */
.score-box { background:rgba(255,255,255,.02); border:1px solid var(--line); border-radius:3px; padding:14px; margin-bottom:13px; }
.score-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.score-lbl { font-size:9px; color:var(--white3); letter-spacing:1px; text-transform:uppercase; }
.score-num { font-family:'IBM Plex Mono',monospace; font-size:22px; font-weight:600; }
.score-bar { height:4px; background:rgba(255,255,255,.05); border-radius:2px; overflow:hidden; }
.score-fill { height:100%; border-radius:2px; transition:width 1.2s ease; }

/* ── CHECKLIST ── */
.checks-grid { display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-top:9px; }
.chk { display:flex; align-items:flex-start; gap:7px; padding:8px 10px; border-radius:3px; background:rgba(255,255,255,.02); border:1px solid var(--line); font-size:10px; line-height:1.4; }
.chk.pass { border-left:2px solid var(--green); }
.chk.flag { border-left:2px solid var(--amber); }
.chk.fail { border-left:2px solid var(--red); }
.chk-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; margin-top:3px; }
.chk-wrap { flex:1; }
.chk-text { color:var(--white2); }
.chk-note { font-size:9px; color:var(--white3); margin-top:2px; }

/* ── SECTION HEADER ── */
.sec-hdr { font-family:'IBM Plex Mono',monospace; font-size:8px; letter-spacing:3px; text-transform:uppercase; color:var(--white3); margin-bottom:8px; display:flex; align-items:center; gap:7px; }
.sec-hdr::after { content:''; flex:1; height:1px; background:var(--line); }

/* ── FINDINGS ── */
.fg { margin-bottom:12px; }
.fg-hdr { display:flex; align-items:center; gap:5px; font-size:9px; font-weight:600; letter-spacing:2px; text-transform:uppercase; margin-bottom:5px; padding-bottom:4px; border-bottom:1px solid var(--line); }
.fi { display:flex; align-items:flex-start; gap:7px; padding:9px 11px; border-radius:3px; margin-bottom:4px; font-size:11px; line-height:1.5; }
.fi-c { background:rgba(224,48,80,.06); border:1px solid rgba(224,48,80,.18); color:var(--white2); }
.fi-m { background:rgba(224,128,32,.06); border:1px solid rgba(224,128,32,.18); color:var(--white2); }
.fi-mi { background:rgba(255,255,255,.02); border:1px solid var(--line); color:var(--white3); }
.fi-p { background:rgba(32,200,112,.04); border:1px solid rgba(32,200,112,.13); color:var(--white2); }
.fi-b { flex-shrink:0; font-size:11px; margin-top:1px; }

/* ── MWS BOX ── */
.mws-box { padding:12px 14px; background:rgba(10,191,202,.04); border:1px solid rgba(10,191,202,.13); border-radius:3px; margin-bottom:13px; font-size:12px; color:var(--white2); line-height:1.6; }
.mws-lbl { font-size:8px; letter-spacing:2px; text-transform:uppercase; color:var(--teal); margin-bottom:5px; font-weight:600; }

/* ── CONDITIONS ── */
.cond-box { padding:12px 14px; background:rgba(224,128,32,.04); border:1px solid rgba(224,128,32,.18); border-radius:3px; margin-bottom:13px; }
.cond-lbl { font-size:8px; letter-spacing:2px; text-transform:uppercase; color:var(--amber); margin-bottom:7px; font-weight:600; }
.cond-item { font-size:11px; color:var(--white2); padding:3px 0; display:flex; gap:7px; line-height:1.4; }

/* ── SIGN-OFF ── */
.signoff { margin-top:18px; padding:16px; background:rgba(10,191,202,.03); border:1px solid rgba(10,191,202,.13); border-radius:3px; }
.signoff-lbl { font-size:8px; letter-spacing:2px; text-transform:uppercase; color:var(--teal); margin-bottom:9px; font-weight:600; }
.signoff-note { font-size:10px; color:var(--white3); line-height:1.5; margin-bottom:10px; }
.signoff-ta { width:100%; background:rgba(255,255,255,.03); border:1px solid rgba(10,191,202,.18); border-radius:3px; padding:9px; color:var(--white); font-family:'Syne',sans-serif; font-size:11px; resize:vertical; min-height:60px; outline:none; transition:border-color .2s; }
.signoff-ta:focus { border-color:var(--teal); }

/* ── BUTTONS ── */
.actions { display:flex; gap:7px; margin-top:9px; flex-wrap:wrap; }
.btn { padding:8px 16px; border-radius:3px; border:none; cursor:pointer; font-family:'Syne',sans-serif; font-size:10px; font-weight:600; letter-spacing:1px; transition:all .2s; display:flex; align-items:center; gap:5px; }
.btn:disabled { opacity:.5; cursor:not-allowed; }
.btn-approve { background:var(--green2); color:#fff; }
.btn-approve:hover:not(:disabled) { background:var(--green); }
.btn-cond { background:rgba(224,128,32,.14); color:var(--amber); border:1px solid var(--amber); }
.btn-cond:hover:not(:disabled) { background:rgba(224,128,32,.24); }
.btn-reject { background:rgba(224,48,80,.11); color:var(--red); border:1px solid rgba(224,48,80,.35); }
.btn-reject:hover:not(:disabled) { background:rgba(224,48,80,.2); }
.btn-ghost { background:rgba(255,255,255,.04); color:var(--white2); border:1px solid var(--line2); }
.btn-ghost:hover:not(:disabled) { background:rgba(255,255,255,.08); }
.btn-cert { background:linear-gradient(135deg,var(--teal2),var(--teal)); color:#fff; border:none; }
.btn-cert:hover:not(:disabled) { opacity:.9; transform:translateY(-1px); box-shadow:0 4px 14px rgba(10,191,202,.3); }

/* ── CONFIRMED ── */
.confirmed { padding:11px 14px; border-radius:3px; margin-top:9px; display:flex; align-items:center; gap:9px; font-size:11px; font-weight:600; }
.conf-ok { background:rgba(32,200,112,.08); border:1px solid var(--green); color:var(--green); }
.conf-cond { background:rgba(224,128,32,.08); border:1px solid var(--amber); color:var(--amber); }
.conf-bad { background:rgba(224,48,80,.08); border:1px solid var(--red); color:var(--red); }
.cert-issued { margin-top:8px; padding:10px 14px; background:rgba(224,160,48,.08); border:1px solid rgba(224,160,48,.25); border-radius:3px; font-size:10px; color:var(--gold); display:flex; align-items:center; gap:8px; }

/* ── ERROR ── */
.err-box { padding:12px 14px; background:rgba(224,48,80,.07); border:1px solid rgba(224,48,80,.25); border-radius:3px; font-size:11px; color:var(--red); line-height:1.5; margin:24px; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { height: auto; max-height: 40vh; }
  .stats { grid-template-columns: repeat(3,1fr); }
  .checks-grid { grid-template-columns: 1fr; }
}
`
