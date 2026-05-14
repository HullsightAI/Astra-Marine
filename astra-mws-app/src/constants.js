export const SURVEY_TYPES = {
  "vessel-condition": {
    label: "Vessel Condition & Equipment", icon: "🚢",
    checklist: ["Hull condition and visible corrosion","Deck equipment condition and securing","Mooring equipment and lines","Navigation lights and mast equipment","Lifeboat and LSA equipment condition","Fire fighting equipment visibility","Hatch covers and weathertight closures","Anchor and chain condition"]
  },
  "lift-rigging": {
    label: "Lift Operations & Rigging", icon: "🏗",
    checklist: ["Crane condition and certificate visibility","Rigging arrangement and sling configuration","Shackle sizes and orientation","Lift point markings and condition","Cargo securing before lift","Exclusion zone establishment","Personnel positioning during lift","Tag line arrangement"]
  },
  "dp-bridge": {
    label: "DP System & Bridge Equipment", icon: "🖥",
    checklist: ["DP console condition and display clarity","Reference system equipment visibility","Thruster control panel condition","Bridge instrumentation completeness","UPS and power supply indicators","Alarm panel and indicator lights","CCTV coverage of thrusters","DP operator position and visibility"]
  },
  "sea-fastening": {
    label: "Sea Fastening & Cargo Securing", icon: "🔩",
    checklist: ["Grillage and support structure condition","Lashing arrangement and tension","Seafastening weld quality (visual)","Cargo position vs. approved plan","CoG marking and documentation visible","Turnbuckle and fitting condition","Deck pad eye condition","Weather protection of cargo"]
  },
  "general-mws": {
    label: "General MWS Pre-Op Survey", icon: "📋",
    checklist: ["Vessel certificates posted and visible","Safety signage adequate and legible","PPE availability and condition","Work area condition and housekeeping","Equipment identification and labelling","Operational boundaries marked","Emergency equipment accessibility","Personnel competency documentation visible"]
  }
}

export const DOC_TYPES = {
  "lift-study": { label: "Lift Study", icon: "⚓", standards: "Noble Denton Guidelines, DNV-ST-N001, DNVGL-ST-0378", focus: "crane capacity, rigging loads, dynamic amplification factors, CoG, lift point adequacy, vessel stability during lift, weather criteria, emergency procedures" },
  "sea-fastening": { label: "Sea Fastening", icon: "🔩", standards: "DNV-RP-N001, IMO MSC/Circ.745, Noble Denton Guidelines", focus: "vessel motion criteria, sea fastening load calculations, grillage adequacy, tie-down lashing, cargo CoG, voyage criteria, emergency release" },
  "dp-fmea": { label: "DP FMEA", icon: "🖥", standards: "IMCA M 166, IMO MSC/Circ.645, DNV-RP-E307, IEC 60812", focus: "DP class compliance, worst case failure design intent (WCFDI), single failure analysis, power redundancy, thruster configuration, reference system adequacy, FMEA trial programme" },
  "stability": { label: "Stability Booklet", icon: "⚖️", standards: "IMO A.749(18), IMO MSC.267(85), SOLAS Chapter II-1", focus: "intact stability compliance, GZ curve adequacy, freeboard, damage stability, loading conditions, cargo/ballast limits, weather criteria" },
  "ops-procedures": { label: "Ops Procedures", icon: "📋", standards: "IMCA guidelines, ISM Code, OVID/CMID standards", focus: "go/no-go criteria, emergency response adequacy, crew competency requirements, communication protocols, risk assessment coverage, environmental limits, incident reporting" },
  "mws-application": { label: "MWS Application", icon: "📦", standards: "Noble Denton TG-MS-01, IMCA M 206, Lloyd's Register MWS guidelines", focus: "vessel certificates validity, class notation appropriateness, flag state documentation, insurance certificate, crew certification, pre-operation survey checklist" },
  "voyage-plan": { label: "Voyage Plan", icon: "🗺", standards: "SOLAS V/34, IMO Resolution A.893(21), ISGOTT", focus: "route survey, hazard assessment, weather routing criteria, port entry conditions, tidal assessment, emergency port of refuge, crew rest schedule, communication schedule, pilot/tug requirements" },
  "other": { label: "Other Document", icon: "📄", standards: "IMO, IMCA, DNV, Bureau Veritas, Lloyd's Register applicable standards", focus: "document scope, technical basis, calculation methodology, assumptions, safety factors, applicable standards, revision control, signatory authority" }
}
