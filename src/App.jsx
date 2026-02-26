import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── Full circ data (all branches, all item types) ────────────────────────────
const SEED_CIRCS_LAST = [
  {"location":"Brand Library DVD","pct":0.006,"qty":159,"changePrevYr":0.59,"changePrevMo":0.223,"prevYrQty":100,"prevMoQty":130,"branch":"Brand Library"},
  {"location":"Brand Library Music Compact Disc","pct":0.06,"qty":1668,"changePrevYr":0.225,"changePrevMo":-0.012,"prevYrQty":1362,"prevMoQty":1689,"branch":"Brand Library"},
  {"location":"Brand Library Non-Fiction","pct":0.036,"qty":1010,"changePrevYr":0.391,"changePrevMo":0.258,"prevYrQty":726,"prevMoQty":803,"branch":"Brand Library"},
  {"location":"Brand Library Children's Fiction","pct":0.005,"qty":151,"changePrevYr":0.48,"changePrevMo":0.678,"prevYrQty":102,"prevMoQty":90,"branch":"Brand Library"},
  {"location":"Brand Library Storage Music CDs","pct":0.004,"qty":116,"changePrevYr":-0.635,"changePrevMo":-0.314,"prevYrQty":318,"prevMoQty":169,"branch":"Brand Library"},
  {"location":"Central Library DVD","pct":0.052,"qty":1445,"changePrevYr":0.009,"changePrevMo":0.099,"prevYrQty":1432,"prevMoQty":1315,"branch":"Central Library"},
  {"location":"Central Library Fiction","pct":0.051,"qty":1432,"changePrevYr":0.189,"changePrevMo":0.156,"prevYrQty":1204,"prevMoQty":1239,"branch":"Central Library"},
  {"location":"Central Library Non-Fiction","pct":0.056,"qty":1560,"changePrevYr":0.168,"changePrevMo":-0.013,"prevYrQty":1336,"prevMoQty":1580,"branch":"Central Library"},
  {"location":"Central Library Children's Fiction","pct":0.141,"qty":3937,"changePrevYr":0.175,"changePrevMo":-0.049,"prevYrQty":3351,"prevMoQty":4138,"branch":"Central Library"},
  {"location":"Central Library Children's Non-Fiction","pct":0.031,"qty":859,"changePrevYr":0.198,"changePrevMo":-0.132,"prevYrQty":717,"prevMoQty":990,"branch":"Central Library"},
  {"location":"Central Library Children's Graphic Novel","pct":0.021,"qty":580,"changePrevYr":0.025,"changePrevMo":-0.101,"prevYrQty":566,"prevMoQty":645,"branch":"Central Library"},
  {"location":"Central Library Teen Fiction","pct":0.007,"qty":193,"changePrevYr":0.049,"changePrevMo":-0.005,"prevYrQty":184,"prevMoQty":194,"branch":"Central Library"},
  {"location":"Central Library Manga","pct":0.008,"qty":235,"changePrevYr":-0.033,"changePrevMo":-0.17,"prevYrQty":243,"prevMoQty":283,"branch":"Central Library"},
  {"location":"Central Library International Languages, Armenian","pct":0.008,"qty":235,"changePrevYr":0.193,"changePrevMo":0.32,"prevYrQty":197,"prevMoQty":178,"branch":"Central Library"},
  {"location":"Central Library Music Compact Disc","pct":0.021,"qty":584,"changePrevYr":0.147,"changePrevMo":-0.185,"prevYrQty":509,"prevMoQty":717,"branch":"Central Library"},
  {"location":"Montrose Library Fiction","pct":0.016,"qty":434,"changePrevYr":0.124,"changePrevMo":-0.011,"prevYrQty":386,"prevMoQty":439,"branch":"Montrose Library"},
  {"location":"Montrose Library Children's Fiction","pct":0.045,"qty":1259,"changePrevYr":0.176,"changePrevMo":0.202,"prevYrQty":1071,"prevMoQty":1047,"branch":"Montrose Library"},
  {"location":"Montrose Library Children's Graphic Novel","pct":0.01,"qty":273,"changePrevYr":0.177,"changePrevMo":0.332,"prevYrQty":232,"prevMoQty":205,"branch":"Montrose Library"},
  {"location":"Montrose Library Non-Fiction","pct":0.008,"qty":237,"changePrevYr":0.267,"changePrevMo":0.017,"prevYrQty":187,"prevMoQty":233,"branch":"Montrose Library"},
  {"location":"Montrose Library DVD","pct":0.004,"qty":123,"changePrevYr":0.088,"changePrevMo":-0.169,"prevYrQty":113,"prevMoQty":148,"branch":"Montrose Library"},
  {"location":"Pacific Park Library Children's Fiction","pct":0.054,"qty":1512,"changePrevYr":0.308,"changePrevMo":-0.019,"prevYrQty":1156,"prevMoQty":1541,"branch":"Pacific Park Library"},
  {"location":"Pacific Park Library Children's Graphic Novel","pct":0.015,"qty":405,"changePrevYr":0.294,"changePrevMo":0.171,"prevYrQty":313,"prevMoQty":346,"branch":"Pacific Park Library"},
  {"location":"Pacific Park Library Children's International Languages, Spanish","pct":0.028,"qty":779,"changePrevYr":0.229,"changePrevMo":0.069,"prevYrQty":634,"prevMoQty":729,"branch":"Pacific Park Library"},
  {"location":"Pacific Park Library Children's Non-Fiction","pct":0.02,"qty":561,"changePrevYr":0.352,"changePrevMo":-0.057,"prevYrQty":415,"prevMoQty":595,"branch":"Pacific Park Library"},
  {"location":"Casa Verdugo Library Children's Fiction","pct":0.019,"qty":543,"changePrevYr":0.086,"changePrevMo":0.148,"prevYrQty":500,"prevMoQty":473,"branch":"Casa Verdugo Library"},
  {"location":"Casa Verdugo Library Fiction","pct":0.006,"qty":162,"changePrevYr":0.604,"changePrevMo":0.276,"prevYrQty":101,"prevMoQty":127,"branch":"Casa Verdugo Library"},
  {"location":"Casa Verdugo Library Teen Manga","pct":0.002,"qty":48,"changePrevYr":3.8,"changePrevMo":0.714,"prevYrQty":10,"prevMoQty":28,"branch":"Casa Verdugo Library"},
  {"location":"Grandview Library Children's Fiction","pct":0.014,"qty":386,"changePrevYr":0.374,"changePrevMo":-0.135,"prevYrQty":281,"prevMoQty":446,"branch":"Grandview Library"},
  {"location":"Grandview Library Fiction","pct":0.002,"qty":66,"changePrevYr":0.245,"changePrevMo":1.062,"prevYrQty":53,"prevMoQty":32,"branch":"Grandview Library"},
  {"location":"Chevy Chase Library Children's Fiction","pct":0.003,"qty":92,"changePrevYr":0.415,"changePrevMo":0.673,"prevYrQty":65,"prevMoQty":55,"branch":"Chevy Chase Library"},
  {"location":"Chevy Chase Library Fiction","pct":0.002,"qty":55,"changePrevYr":0.528,"changePrevMo":0.196,"prevYrQty":36,"prevMoQty":46,"branch":"Chevy Chase Library"},
  {"location":"Library Connection Children's Fiction","pct":0.012,"qty":331,"changePrevYr":-0.193,"changePrevMo":0.145,"prevYrQty":410,"prevMoQty":289,"branch":"Library Connection"},
  {"location":"Library Connection Fiction","pct":0.002,"qty":51,"changePrevYr":0.085,"changePrevMo":0.645,"prevYrQty":47,"prevMoQty":31,"branch":"Library Connection"},
  {"location":"Bookmobile Children's Paperback","pct":0.002,"qty":49,"changePrevYr":0,"changePrevMo":0,"prevYrQty":0,"prevMoQty":0,"branch":"Bookmobile"},
  {"location":"Interlibrary Loan Request","pct":0.001,"qty":18,"changePrevYr":-0.514,"changePrevMo":-0.053,"prevYrQty":37,"prevMoQty":19,"branch":"Interlibrary Loan"},
  {"location":"15 - Sacramento Public","pct":0.004,"qty":118,"changePrevYr":0.372,"changePrevMo":0.967,"prevYrQty":86,"prevMoQty":60,"branch":"External Borrowers"},
  {"location":"19 - San Francisco Public","pct":0.003,"qty":70,"changePrevYr":0.111,"changePrevMo":0.556,"prevYrQty":63,"prevMoQty":45,"branch":"External Borrowers"},
  {"location":"Total","pct":1,"qty":27911,"changePrevYr":0.146,"changePrevMo":0.012,"prevYrQty":24362,"prevMoQty":27590,"branch":"Total"}
];
const SEED_CIRCS_YTD = [
  {"location":"Brand Library DVD","pct":0.004,"qty":207,"branch":"Brand Library"},
  {"location":"Brand Library Music Compact Disc","pct":0.058,"qty":2751,"branch":"Brand Library"},
  {"location":"Brand Library Non-Fiction","pct":0.032,"qty":1532,"branch":"Brand Library"},
  {"location":"Brand Library Children's Fiction","pct":0.004,"qty":212,"branch":"Brand Library"},
  {"location":"Central Library DVD","pct":0.05,"qty":2367,"branch":"Central Library"},
  {"location":"Central Library Fiction","pct":0.049,"qty":2341,"branch":"Central Library"},
  {"location":"Central Library Non-Fiction","pct":0.055,"qty":2602,"branch":"Central Library"},
  {"location":"Central Library Children's Fiction","pct":0.144,"qty":6850,"branch":"Central Library"},
  {"location":"Central Library Children's Non-Fiction","pct":0.031,"qty":1467,"branch":"Central Library"},
  {"location":"Central Library Children's Graphic Novel","pct":0.022,"qty":1054,"branch":"Central Library"},
  {"location":"Central Library Teen Fiction","pct":0.007,"qty":315,"branch":"Central Library"},
  {"location":"Central Library Manga","pct":0.009,"qty":428,"branch":"Central Library"},
  {"location":"Central Library International Languages, Armenian","pct":0.009,"qty":441,"branch":"Central Library"},
  {"location":"Central Library Music Compact Disc","pct":0.024,"qty":1126,"branch":"Central Library"},
  {"location":"Montrose Library Fiction","pct":0.015,"qty":718,"branch":"Montrose Library"},
  {"location":"Montrose Library Children's Fiction","pct":0.043,"qty":2056,"branch":"Montrose Library"},
  {"location":"Montrose Library Children's Graphic Novel","pct":0.01,"qty":476,"branch":"Montrose Library"},
  {"location":"Montrose Library Non-Fiction","pct":0.008,"qty":382,"branch":"Montrose Library"},
  {"location":"Montrose Library DVD","pct":0.004,"qty":191,"branch":"Montrose Library"},
  {"location":"Pacific Park Library Children's Fiction","pct":0.057,"qty":2716,"branch":"Pacific Park Library"},
  {"location":"Pacific Park Library Children's Graphic Novel","pct":0.015,"qty":735,"branch":"Pacific Park Library"},
  {"location":"Pacific Park Library Children's International Languages, Spanish","pct":0.029,"qty":1374,"branch":"Pacific Park Library"},
  {"location":"Pacific Park Library Children's Non-Fiction","pct":0.019,"qty":899,"branch":"Pacific Park Library"},
  {"location":"Casa Verdugo Library Children's Fiction","pct":0.02,"qty":930,"branch":"Casa Verdugo Library"},
  {"location":"Casa Verdugo Library Fiction","pct":0.006,"qty":277,"branch":"Casa Verdugo Library"},
  {"location":"Grandview Library Children's Fiction","pct":0.015,"qty":695,"branch":"Grandview Library"},
  {"location":"Grandview Library Fiction","pct":0.002,"qty":101,"branch":"Grandview Library"},
  {"location":"Chevy Chase Library Children's Fiction","pct":0.003,"qty":144,"branch":"Chevy Chase Library"},
  {"location":"Library Connection Children's Fiction","pct":0.014,"qty":664,"branch":"Library Connection"},
  {"location":"Bookmobile Children's Paperback","pct":0.001,"qty":50,"branch":"Bookmobile"},
  {"location":"Interlibrary Loan Request","pct":0.001,"qty":56,"branch":"Interlibrary Loan"},
  {"location":"15 - Sacramento Public","pct":0.004,"qty":170,"branch":"External Borrowers"},
  {"location":"19 - San Francisco Public","pct":0.002,"qty":104,"branch":"External Borrowers"},
  {"location":"Total","pct":1,"qty":47507,"branch":"Total"}
];

// ─── Fund data ────────────────────────────────────────────────────────────────
const SEED_FUNDS = [
  { name: "Book Group Kits", code: "gckits", appropriation: 3622, expenditure: 531.69, encumbrance: 0, freeBalance: 3090.31 },
  { name: "Bookmobile LibFund Donations", code: "gbkm-p4124", appropriation: 10000, expenditure: 0, encumbrance: 0, freeBalance: 10000 },
  { name: "Bookmobile Mobile Donations", code: "gbkm-p4118", appropriation: 6000, expenditure: 2889.85, encumbrance: 0, freeBalance: 3110.15 },
  { name: "Brand Books Art", code: "gb-art-books", appropriation: 19602, expenditure: 10742.78, encumbrance: 0, freeBalance: 8859.22 },
  { name: "Brand Books Music", code: "gb-music-books", appropriation: 12651, expenditure: 1108.13, encumbrance: 0, freeBalance: 11542.87 },
  { name: "Brand CDs", code: "gb-cd", appropriation: 10443, expenditure: 3089.67, encumbrance: 0, freeBalance: 7353.33 },
  { name: "Brand Children's Art", code: "gb-child-art", appropriation: 1181, expenditure: 418.07, encumbrance: 0, freeBalance: 762.93 },
  { name: "Brand Children's Music", code: "gb-child-music", appropriation: 1181, expenditure: 0, encumbrance: 0, freeBalance: 1181 },
  { name: "Brand Continuations", code: "gb-stand-orders", appropriation: 3256, expenditure: 1894.57, encumbrance: 0, freeBalance: 1361.43 },
  { name: "Brand DVDs Art", code: "gb-art-dvd", appropriation: 1669, expenditure: 117.74, encumbrance: 0, freeBalance: 1551.26 },
  { name: "Brand DVDs Music", code: "gb-music-dvd", appropriation: 1669, expenditure: 0, encumbrance: 0, freeBalance: 1669 },
  { name: "Ebooks PPU & High Holds", code: "g-ebooks-ppu", appropriation: 24000, expenditure: 0, encumbrance: 0, freeBalance: 24000 },
  { name: "Ebooks-Adult", code: "g-ebooks", appropriation: 96000, expenditure: 37403.48, encumbrance: 0, freeBalance: 58596.52 },
  { name: "Ebooks-Children", code: "g-ebooks-c", appropriation: 15000, expenditure: 0, encumbrance: 0, freeBalance: 15000 },
  { name: "Ebooks-Teen", code: "g-ebooks-t", appropriation: 15000, expenditure: 0, encumbrance: 0, freeBalance: 15000 },
  { name: "GUSD Edison", code: "gusd", appropriation: 3000, expenditure: 308.49, encumbrance: 0, freeBalance: 2691.51 },
  { name: "Online Resources", code: "g-online", appropriation: 275926.16, expenditure: 275926.16, encumbrance: 0, freeBalance: 0 },
  { name: "System Armenian", code: "gc-armenian", appropriation: 6634, expenditure: 6294.25, encumbrance: 0, freeBalance: 339.75 },
  { name: "System Books on CD", code: "gc-books-cd", appropriation: 4355, expenditure: 48.04, encumbrance: 0, freeBalance: 4306.96 },
  { name: "System CDs-Music", code: "gc-cd", appropriation: 5006, expenditure: 481.41, encumbrance: 0, freeBalance: 4524.59 },
  { name: "System Children's", code: "gcc", appropriation: 130337, expenditure: 40759.17, encumbrance: 0, freeBalance: 89577.83 },
  { name: "System Children's AV", code: "gcc-av", appropriation: 6105, expenditure: 662.56, encumbrance: 0, freeBalance: 5442.44 },
  { name: "System Children's Global Languages", code: "gcc-glob-lang", appropriation: 16269, expenditure: 3821.11, encumbrance: 0, freeBalance: 12447.89 },
  { name: "System Continuations", code: "gc-stand-orders", appropriation: 14001, expenditure: 7978, encumbrance: 0, freeBalance: 6023 },
  { name: "System DVDs", code: "gc-dvd", appropriation: 20880, expenditure: 4656.19, encumbrance: 0, freeBalance: 16223.81 },
  { name: "System Fiction", code: "gc-fiction", appropriation: 40905, expenditure: 9682.22, encumbrance: 0, freeBalance: 31222.78 },
  { name: "System Graphic Novels", code: "gc-graphic", appropriation: 9443, expenditure: 1798.61, encumbrance: 0, freeBalance: 7644.39 },
  { name: "System Korean", code: "gc-korean", appropriation: 4803, expenditure: 1587.46, encumbrance: 0, freeBalance: 3215.54 },
  { name: "System Large Type", code: "gc-lt", appropriation: 9158, expenditure: 731.03, encumbrance: 0, freeBalance: 8426.97 },
  { name: "System Maker", code: "gc-maker", appropriation: 1791, expenditure: 0, encumbrance: 0, freeBalance: 1791 },
  { name: "System Marketplace", code: "gc-mrktplc", appropriation: 16728, expenditure: 2402.93, encumbrance: 0, freeBalance: 14325.07 },
  { name: "System Non-Fiction", code: "gc-nf", appropriation: 44690, expenditure: 6019.72, encumbrance: 0, freeBalance: 38670.28 },
  { name: "System Periodicals", code: "gc-period", appropriation: 35000, expenditure: 35342.07, encumbrance: 0, freeBalance: -342.07 },
  { name: "System Persian", code: "gc-persian", appropriation: 4152, expenditure: 0, encumbrance: 0, freeBalance: 4152 },
  { name: "System Russian", code: "gc-russian", appropriation: 2157, expenditure: 0, encumbrance: 0, freeBalance: 2157 },
  { name: "System Spanish", code: "gc-spanish", appropriation: 4314, expenditure: 318.89, encumbrance: 0, freeBalance: 3995.11 },
  { name: "System Teen", code: "gc-teen", appropriation: 9890, expenditure: 1420.45, encumbrance: 0, freeBalance: 8469.55 },
  { name: "VAS Process Fees", code: "g-vas", appropriation: 14577.99, expenditure: 14577.99, encumbrance: 0, freeBalance: 0 },
];

const SEED_BUDGET_FUNDS = [
  { fund: "Brand CDs", budget: 12943, selector: "Blair Whittington", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "Brand DVDs Art", budget: 1669, selector: "Ellen Bae", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "Brand DVDs Music", budget: 1669, selector: "Blair Whittington", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "Brand Books Art", budget: 17852, selector: "Ellen Bae", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "Brand Books Music", budget: 11901, selector: "Blair Whittington", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "Brand Continuations", budget: 3256, selector: "Ellen Bae & Blair Whittington", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "Brand Children's Art", budget: 1181, selector: "Ellen Bae", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "Brand Children's Music", budget: 1180, selector: "Blair Whittington", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "eBooks Adult cloudLibrary", budget: 96000, selector: "Rubina Markosyan / Bryan Griest", accountString: "45101-1010-LAC-6012-P4121", category: "Digital" },
  { fund: "eBooks Children cloudLibrary", budget: 15000, selector: "Aurora Arevalo", accountString: "45101-1010-LAC-6012-P4121", category: "Digital" },
  { fund: "eBooks Teen cloudLibrary", budget: 15000, selector: "Sarah Walker", accountString: "45101-1010-LAC-6012-P4121", category: "Digital" },
  { fund: "System Books on CD", budget: 4355, selector: "Rubina Markosyan / Bryan Griest", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System CDs-Music", budget: 5006, selector: "Blair Whittington", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System DVDs", budget: 20880, selector: "Bryan Griest", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "Central Continuations", budget: 14001, selector: "Bryan Griest", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Fiction", budget: 40905, selector: "Rubina Markosyan", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Graphic Novels", budget: 9443, selector: "Bryan Griest", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Group Kits", budget: 3622, selector: "Rubina Markosyan", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Large Type", budget: 9158, selector: "Rubina Markosyan / Bryan Griest", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Maker", budget: 1791, selector: "TBD", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Non-Fiction", budget: 44690, selector: "Bryan Griest", accountString: "45100-1010-LAC-6012-P4121", category: "Books" },
  { fund: "System Marketplace", budget: 16728, selector: "Nancy Park", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Armenian", budget: 6634, selector: "Elizabeth Grigorian", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Korean", budget: 4803, selector: "Nancy Park", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Persian", budget: 4152, selector: "Solomon Blaylock", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Russian", budget: 2157, selector: "Solomon Blaylock", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Spanish", budget: 4314, selector: "Guillermo Garcia", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Periodicals", budget: 35000, selector: "All", accountString: "45050-1010-LAC-6012-P4121", category: "Periodicals" },
  { fund: "eBooks PPU & High Holds", budget: 24000, selector: "Multiple", accountString: "45101-1010-LAC-6012-P4121", category: "Digital" },
  { fund: "System Children's AV", budget: 6105, selector: "Heather Honig / Cecile Pham", accountString: "45100-4070-lac-0020", category: "Books" },
  { fund: "System Children's", budget: 133337, selector: "Chris Baker / Meghan Day", accountString: "45100-1010-LAC-6012-P4121", category: "Books" },
  { fund: "System Children's Global Language", budget: 13269, selector: "Multiple", accountString: "45100-1010-LAC-6012-P4121", category: "Books" },
  { fund: "System Teen", budget: 9890, selector: "Sarah Walker", accountString: "45100-1010-LAC-6012-P4121", category: "Books" },
];

const BRANCHES = ["Brand Library","Central Library","Grandview Library","Chevy Chase Library","Library Connection","Montrose Library","Pacific Park Library","Casa Verdugo Library","Bookmobile","Interlibrary Loan","External Borrowers","Default Location"];

// ─── Palette & shared styles ─────────────────────────────────────────────────
const PALETTE = ["#3b82f6","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ef4444","#ec4899","#84cc16"];
const BG = "#0d1117", CARD = "#161b22", BORDER = "#30363d", TEXT = "#e6edf3", MUTED = "#8b949e";
const card = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" };
const badge = (color) => ({ display:"inline-block", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:700, background:color+"22", color, border:`1px solid ${color}44`, letterSpacing:"0.04em", textTransform:"uppercase" });

const fmt$ = (n) => n==null?"—":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0,maximumFractionDigits:0}).format(n);
const fmtPct = (n) => n==null?"—":`${(n*100).toFixed(1)}%`;
const fmtChg = (n) => {
  if(n==null||n===0) return <span style={{color:MUTED}}>—</span>;
  const color = n>0?"#4ade80":"#f87171";
  return <span style={{color}}>{n>0?"▲":"▼"} {Math.abs(n*100).toFixed(1)}%</span>;
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({label,value,sub,color="#3b82f6"}) {
  return (
    <div style={{...card,flex:1,minWidth:160}}>
      <div style={{fontSize:11,color:MUTED,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{label}</div>
      <div style={{fontSize:28,fontWeight:800,color,fontFamily:"'DM Mono',monospace",lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:12,color:MUTED,marginTop:6}}>{sub}</div>}
    </div>
  );
}

function SectionHeader({title,sub}) {
  return (
    <div style={{marginBottom:20}}>
      <h2 style={{margin:0,fontSize:18,fontWeight:700,color:TEXT}}>{title}</h2>
      {sub&&<p style={{margin:"4px 0 0",fontSize:13,color:MUTED}}>{sub}</p>}
    </div>
  );
}

function FileUploadZone({label,onFile,accepted=".csv,.xlsx"}) {
  const [hover,setHover]=useState(false);
  const [loaded,setLoaded]=useState(null);
  const handleChange=(e)=>{const f=e.target.files[0];if(f){setLoaded(f.name);onFile(f);}};
  return (
    <label style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:`2px dashed ${hover?"#3b82f6":BORDER}`,borderRadius:10,padding:"24px 16px",cursor:"pointer",transition:"all 0.2s",background:hover?"#3b82f611":"transparent",textAlign:"center"}}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      <div style={{fontSize:28,marginBottom:8}}>{loaded?"✅":"📂"}</div>
      <div style={{fontSize:13,fontWeight:600,color:loaded?"#4ade80":TEXT,marginBottom:4}}>{loaded||label}</div>
      <div style={{fontSize:11,color:MUTED}}>{loaded?"Click to replace":`Accepts ${accepted}`}</div>
      <input type="file" accept={accepted} style={{display:"none"}} onChange={handleChange}/>
    </label>
  );
}

// ─── Login Wall ───────────────────────────────────────────────────────────────
function LoginWall({onLogin}) {
  const [user,setUser]=useState(""), [pass,setPass]=useState(""), [err,setErr]=useState(false), [show,setShow]=useState(false);
  const submit = () => {
    if(user==="admin"&&pass==="Glendale123!"){onLogin();}
    else{setErr(true);setTimeout(()=>setErr(false),2000);}
  };
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:16}}>
      <div style={{...card,width:360,display:"flex",flexDirection:"column",gap:14}}>
        <div style={{textAlign:"center",marginBottom:4}}>
          <div style={{fontSize:28,marginBottom:8}}>🔒</div>
          <div style={{fontSize:16,fontWeight:700,color:TEXT}}>Admin Access Required</div>
          <div style={{fontSize:12,color:MUTED,marginTop:4}}>This section is restricted to administrators</div>
        </div>
        <div>
          <label style={{fontSize:11,color:MUTED,display:"block",marginBottom:4}}>Username</label>
          <input value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}
            style={{width:"100%",background:BG,border:`1px solid ${err?"#ef4444":BORDER}`,borderRadius:6,padding:"8px 12px",color:TEXT,fontSize:13,boxSizing:"border-box"}} autoFocus/>
        </div>
        <div>
          <label style={{fontSize:11,color:MUTED,display:"block",marginBottom:4}}>Password</label>
          <div style={{position:"relative"}}>
            <input type={show?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}
              style={{width:"100%",background:BG,border:`1px solid ${err?"#ef4444":BORDER}`,borderRadius:6,padding:"8px 36px 8px 12px",color:TEXT,fontSize:13,boxSizing:"border-box"}}/>
            <button onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:MUTED,cursor:"pointer",fontSize:14}}>{show?"🙈":"👁"}</button>
          </div>
        </div>
        {err&&<div style={{fontSize:12,color:"#ef4444",textAlign:"center"}}>Incorrect username or password</div>}
        <button onClick={submit} style={{background:PALETTE[0]+"22",border:`1px solid ${PALETTE[0]}44`,color:PALETTE[0],borderRadius:8,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Sign In</button>
      </div>
    </div>
  );
}

// ─── Funds Dashboard ──────────────────────────────────────────────────────────
function FundsDashboard({funds}) {
  const withBudget = funds.filter(f=>f.appropriation>0);
  const totalApprop = funds.reduce((s,f)=>s+f.appropriation,0);
  const totalExp = funds.reduce((s,f)=>s+f.expenditure,0);
  const totalFree = funds.reduce((s,f)=>s+f.freeBalance,0);
  const spendPct = totalApprop>0?totalExp/totalApprop:0;
  const chartData = withBudget.filter(f=>f.appropriation>5000).sort((a,b)=>b.appropriation-a.appropriation).slice(0,16).map(f=>({
    name: f.name.replace("System ","Sys ").replace("Brand ","Br ").replace("Children's","Child."),
    Appropriation: f.appropriation, Spent: f.expenditure, Remaining: Math.max(0,f.freeBalance),
  }));
  const pieData = [{name:"Spent",value:totalExp},{name:"Remaining",value:Math.max(0,totalFree)}];
  return (
    <div>
      <SectionHeader title="Fund Balances" sub="Current appropriation vs. expenditure across all funds"/>
      <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:24}}>
        <StatCard label="Total Appropriation" value={fmt$(totalApprop)} color="#3b82f6"/>
        <StatCard label="Total Expenditure" value={fmt$(totalExp)} color="#f59e0b" sub={fmtPct(spendPct)+" spent"}/>
        <StatCard label="Free Balance" value={fmt$(totalFree)} color="#10b981"/>
        <StatCard label="Active Funds" value={withBudget.length} color="#8b5cf6" sub="funds with appropriation"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:20,marginBottom:24}}>
        <div style={card}>
          <div style={{fontSize:13,fontWeight:600,color:MUTED,marginBottom:16}}>Top Funds — Appropriation vs. Spent</div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} layout="vertical" margin={{left:0,right:20}}>
              <XAxis type="number" tick={{fill:MUTED,fontSize:10}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <YAxis type="category" dataKey="name" width={110} tick={{fill:TEXT,fontSize:10}}/>
              <Tooltip formatter={fmt$} contentStyle={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:8}} labelStyle={{color:TEXT}}/>
              <Bar dataKey="Appropriation" fill="#3b82f633" stroke="#3b82f6" strokeWidth={1} radius={[0,4,4,0]}/>
              <Bar dataKey="Spent" fill="#f59e0b" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{...card,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontSize:13,fontWeight:600,color:MUTED,marginBottom:8}}>Overall Spend Rate</div>
          <PieChart width={200} height={200}>
            <Pie data={pieData} cx={100} cy={100} innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
              {pieData.map((_,i)=><Cell key={i} fill={[PALETTE[0],PALETTE[4]][i]}/>)}
            </Pie>
            <Tooltip formatter={fmt$} contentStyle={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:8}}/>
          </PieChart>
          <div style={{textAlign:"center",marginTop:4}}>
            <div style={{fontSize:28,fontWeight:800,color:PALETTE[0],fontFamily:"monospace"}}>{fmtPct(spendPct)}</div>
            <div style={{fontSize:11,color:MUTED}}>of budget spent</div>
          </div>
        </div>
      </div>
      <div style={card}>
        <div style={{fontSize:13,fontWeight:600,color:MUTED,marginBottom:14}}>All Funds Detail</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{borderBottom:`1px solid ${BORDER}`}}>
              {["Fund Name","Code","Appropriation","Expenditure","Free Balance","% Spent"].map(h=>(
                <th key={h} style={{padding:"8px 12px",textAlign:h==="Fund Name"||h==="Code"?"left":"right",color:MUTED,fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {funds.filter(f=>f.appropriation!==0||f.expenditure!==0).map((f,i)=>{
                const pct=f.appropriation>0?f.expenditure/f.appropriation:null;
                const isOver=f.freeBalance<0;
                return (
                  <tr key={i} style={{borderBottom:`1px solid ${BORDER}22`,background:i%2===0?"transparent":"#ffffff05"}}>
                    <td style={{padding:"7px 12px",color:TEXT,fontWeight:500}}>{f.name}</td>
                    <td style={{padding:"7px 12px",color:MUTED,fontFamily:"monospace",fontSize:11}}>{f.code}</td>
                    <td style={{padding:"7px 12px",color:TEXT,textAlign:"right"}}>{fmt$(f.appropriation)}</td>
                    <td style={{padding:"7px 12px",color:"#f59e0b",textAlign:"right"}}>{fmt$(f.expenditure)}</td>
                    <td style={{padding:"7px 12px",color:isOver?"#f87171":"#4ade80",textAlign:"right",fontWeight:600}}>{fmt$(f.freeBalance)}</td>
                    <td style={{padding:"7px 12px",textAlign:"right"}}>
                      {pct!==null&&(
                        <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8}}>
                          <div style={{width:60,height:4,background:BORDER,borderRadius:2,overflow:"hidden"}}>
                            <div style={{width:`${Math.min(100,pct*100)}%`,height:"100%",background:pct>0.9?"#ef4444":pct>0.7?"#f59e0b":PALETTE[0],borderRadius:2}}/>
                          </div>
                          <span style={{color:pct>0.9?"#ef4444":TEXT}}>{fmtPct(pct)}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Circs Dashboard ──────────────────────────────────────────────────────────
function CircsDashboard({lastMonth,ytd,lastMonthLabel,ytdLabel}) {
  const [view,setView]=useState("lastMonth"); // "lastMonth" | "ytd"
  const [branchFilter,setBranchFilter]=useState("All");
  const [formatFilter,setFormatFilter]=useState("All");
  const [expandedBranches,setExpandedBranches]=useState({});

  const activeData = view==="lastMonth" ? lastMonth : ytd;

  // Extract all unique formats (item type = location minus branch prefix)
  const allFormats = useMemo(()=>{
    const fmts = new Set();
    activeData.forEach(r=>{
      if(r.location==="Total") return;
      const branch = BRANCHES.find(b=>r.location.startsWith(b));
      const fmt = branch ? r.location.slice(branch.length).trim() : r.location;
      if(fmt) fmts.add(fmt);
    });
    return ["All",...Array.from(fmts).sort()];
  },[activeData]);

  // Filter rows
  const filteredRows = useMemo(()=>{
    return activeData.filter(r=>{
      if(r.location==="Total") return false;
      if(branchFilter!=="All" && r.branch!==branchFilter) return false;
      if(formatFilter!=="All"){
        const branch = BRANCHES.find(b=>r.location.startsWith(b));
        const fmt = branch ? r.location.slice(branch.length).trim() : r.location;
        if(fmt!==formatFilter) return false;
      }
      return true;
    });
  },[activeData,branchFilter,formatFilter]);

  // Group by branch for collapsible display
  const grouped = useMemo(()=>{
    const g = {};
    filteredRows.forEach(r=>{
      const b = r.branch||"Other";
      if(!g[b]) g[b]=[];
      g[b].push(r);
    });
    return g;
  },[filteredRows]);

  const branchTotals = useMemo(()=>{
    const t = {};
    Object.entries(grouped).forEach(([b,rows])=>{
      t[b] = rows.reduce((s,r)=>s+r.qty,0);
    });
    return t;
  },[grouped]);

  const totalRow = activeData.find(r=>r.location==="Total");
  const filteredTotal = filteredRows.reduce((s,r)=>s+r.qty,0);

  const toggleBranch = (b)=>setExpandedBranches(prev=>({...prev,[b]:!prev[b]}));

  // Chart data - top items across filtered set
  const chartData = [...filteredRows].sort((a,b)=>b.qty-a.qty).slice(0,12).map(r=>({
    name: r.location.replace("Brand Library","BL").replace("Central Library","CL").replace("Library Connection","LC").replace("Pacific Park Library","PPL").replace("Casa Verdugo Library","CVL").replace("Grandview Library","GL").replace("Montrose Library","ML").replace("Chevy Chase Library","CCL").substring(0,28),
    qty: r.qty
  }));

  const selectStyle = {background:BG,border:`1px solid ${BORDER}`,borderRadius:6,padding:"6px 10px",color:TEXT,fontSize:12,cursor:"pointer",fontFamily:"inherit"};

  return (
    <div>
      <SectionHeader title="Circulation Statistics" sub="Checkout activity by location and item type"/>

      {/* Controls */}
      <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",marginBottom:20}}>
        <div style={{display:"flex",background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,overflow:"hidden"}}>
          {[["lastMonth","Last Month"],["ytd","Year to Date"]].map(([v,label])=>(
            <button key={v} onClick={()=>setView(v)} style={{padding:"8px 18px",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",background:view===v?PALETTE[0]+"33":"transparent",color:view===v?PALETTE[0]:MUTED,borderRight:`1px solid ${BORDER}`,transition:"all 0.15s"}}>{label}</button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,color:MUTED}}>Location:</span>
          <select value={branchFilter} onChange={e=>setBranchFilter(e.target.value)} style={selectStyle}>
            <option>All</option>
            {BRANCHES.map(b=><option key={b}>{b}</option>)}
          </select>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,color:MUTED}}>Format:</span>
          <select value={formatFilter} onChange={e=>setFormatFilter(e.target.value)} style={selectStyle}>
            {allFormats.map(f=><option key={f}>{f}</option>)}
          </select>
        </div>
        {(branchFilter!=="All"||formatFilter!=="All")&&(
          <button onClick={()=>{setBranchFilter("All");setFormatFilter("All");}} style={{background:"transparent",border:`1px solid ${BORDER}`,color:MUTED,borderRadius:6,padding:"6px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✕ Clear filters</button>
        )}
      </div>

      {/* Stats */}
      <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:24}}>
        <StatCard label={view==="lastMonth"?"Last Month Total":"YTD Total"} value={filteredTotal.toLocaleString()} color="#3b82f6" sub={view==="lastMonth"?lastMonthLabel:ytdLabel}/>
        {view==="lastMonth"&&totalRow&&branchFilter==="All"&&formatFilter==="All"&&<>
          <StatCard label="vs. Prior Year" value={fmtPct(totalRow.changePrevYr)} color={totalRow.changePrevYr>=0?"#4ade80":"#f87171"}/>
          <StatCard label="vs. Prior Month" value={fmtPct(totalRow.changePrevMo)} color={totalRow.changePrevMo>=0?"#4ade80":"#f87171"}/>
        </>}
        <StatCard label="Branches Shown" value={Object.keys(grouped).length} color="#8b5cf6"/>
      </div>

      {/* Chart */}
      {chartData.length>0&&(
        <div style={{...card,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:600,color:MUTED,marginBottom:14}}>Top Items by Circulation Qty</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" tick={{fill:MUTED,fontSize:10}}/>
              <YAxis type="category" dataKey="name" width={150} tick={{fill:TEXT,fontSize:10}}/>
              <Tooltip contentStyle={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:8}} labelStyle={{color:TEXT}}/>
              <Bar dataKey="qty" fill={PALETTE[0]} radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Collapsible branch table */}
      <div style={card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,color:TEXT}}>All Item Types by Location</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setExpandedBranches(Object.fromEntries(Object.keys(grouped).map(b=>[b,true])))} style={{fontSize:11,color:MUTED,background:"transparent",border:`1px solid ${BORDER}`,borderRadius:4,padding:"3px 8px",cursor:"pointer",fontFamily:"inherit"}}>Expand all</button>
            <button onClick={()=>setExpandedBranches({})} style={{fontSize:11,color:MUTED,background:"transparent",border:`1px solid ${BORDER}`,borderRadius:4,padding:"3px 8px",cursor:"pointer",fontFamily:"inherit"}}>Collapse all</button>
          </div>
        </div>
        {Object.entries(grouped).sort(([,a],[,b])=>b.reduce((s,r)=>s+r.qty,0)-a.reduce((s,r)=>s+r.qty,0)).map(([branch,rows])=>{
          const isOpen = expandedBranches[branch];
          const branchTotal = branchTotals[branch];
          return (
            <div key={branch} style={{marginBottom:2}}>
              {/* Branch header row */}
              <div onClick={()=>toggleBranch(branch)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:isOpen?"#3b82f611":BG,borderRadius:isOpen?"8px 8px 0 0":"8px",cursor:"pointer",border:`1px solid ${isOpen?PALETTE[0]+"44":BORDER}`,transition:"all 0.15s"}}>
                <span style={{fontSize:12,color:MUTED,width:14}}>{isOpen?"▾":"▸"}</span>
                <span style={{fontWeight:700,color:TEXT,fontSize:13,flex:1}}>{branch}</span>
                <span style={{fontSize:12,color:MUTED}}>{rows.length} item type{rows.length!==1?"s":""}</span>
                <span style={{fontFamily:"monospace",fontWeight:700,color:PALETTE[0],fontSize:14,minWidth:60,textAlign:"right"}}>{branchTotal.toLocaleString()}</span>
              </div>
              {/* Item rows */}
              {isOpen&&(
                <div style={{border:`1px solid ${PALETTE[0]}44`,borderTop:"none",borderRadius:"0 0 8px 8px",overflow:"hidden",marginBottom:4}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr style={{background:"#3b82f608",borderBottom:`1px solid ${BORDER}`}}>
                      <th style={{padding:"6px 12px 6px 28px",textAlign:"left",color:MUTED,fontWeight:600}}>Item Type</th>
                      <th style={{padding:"6px 12px",textAlign:"right",color:MUTED,fontWeight:600}}>% of Total</th>
                      <th style={{padding:"6px 12px",textAlign:"right",color:MUTED,fontWeight:600}}>Qty</th>
                      {view==="lastMonth"&&<>
                        <th style={{padding:"6px 12px",textAlign:"right",color:MUTED,fontWeight:600}}>vs. Prev Year</th>
                        <th style={{padding:"6px 12px",textAlign:"right",color:MUTED,fontWeight:600}}>vs. Prev Month</th>
                      </>}
                    </tr></thead>
                    <tbody>
                      {rows.sort((a,b)=>b.qty-a.qty).map((r,i)=>{
                        const branch2=BRANCHES.find(b2=>r.location.startsWith(b2));
                        const itemType=branch2?r.location.slice(branch2.length).trim()||"(General)":r.location;
                        return (
                          <tr key={i} style={{borderBottom:`1px solid ${BORDER}22`,background:i%2===0?"transparent":"#ffffff04"}}>
                            <td style={{padding:"6px 12px 6px 28px",color:TEXT}}>{itemType||"(General)"}</td>
                            <td style={{padding:"6px 12px",color:MUTED,textAlign:"right"}}>{fmtPct(r.pct)}</td>
                            <td style={{padding:"6px 12px",color:TEXT,textAlign:"right",fontWeight:r.qty>0?600:400}}>{r.qty.toLocaleString()}</td>
                            {view==="lastMonth"&&<>
                              <td style={{padding:"6px 12px",textAlign:"right"}}>{fmtChg(r.changePrevYr)}</td>
                              <td style={{padding:"6px 12px",textAlign:"right"}}>{fmtChg(r.changePrevMo)}</td>
                            </>}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
        {Object.keys(grouped).length===0&&(
          <div style={{padding:"32px",textAlign:"center",color:MUTED}}>No results match your current filters.</div>
        )}
      </div>
    </div>
  );
}

// ─── Budget Generator ─────────────────────────────────────────────────────────
function BudgetGenerator({ytdCircs}) {
  const [fyLabel,setFyLabel]=useState("FY26-27");
  const [booksTotal,setBooksTotal]=useState(207013);
  const [difSupp,setDifSupp]=useState(200000);
  const [digitalTotal,setDigitalTotal]=useState(527000);
  const [periodicalsTotal,setPeriodicalsTotal]=useState(35000);
  const [funds,setFunds]=useState(SEED_BUDGET_FUNDS.map(f=>({...f})));
  const [generated,setGenerated]=useState(false);
  const [editingSelector,setEditingSelector]=useState(null);
  const [selectorDraft,setSelectorDraft]=useState("");

  const totalAllocatable=booksTotal+difSupp;
  const totalAllocated=funds.reduce((s,f)=>s+(f.budget||0),0);
  const diff=totalAllocated-totalAllocatable;

  const autoCalculate=()=>{
    const totalCircs=ytdCircs.filter(r=>r.location!=="Total").reduce((s,r)=>s+r.qty,0);
    const updatedFunds=funds.map(f=>{
      if(f.category!=="Books") return f;
      const circRow=ytdCircs.find(r=>r.location.toLowerCase().includes(f.fund.toLowerCase().replace("system ","").replace("brand ","").substring(0,8)));
      const circPct=circRow?circRow.qty/totalCircs:0;
      const priorPct=f.budget/(totalAllocatable>0?totalAllocatable:1);
      const weightedPct=circPct*0.25+priorPct*0.75;
      return {...f,budget:Math.round(weightedPct*totalAllocatable)};
    });
    setFunds(updatedFunds);
  };

  const updateFundBudget=(i,val)=>{
    const n=parseFloat(String(val).replace(/[^0-9.]/g,""))||0;
    setFunds(prev=>prev.map((f,idx)=>idx===i?{...f,budget:n}:f));
  };

  const startEditSelector=(i)=>{setEditingSelector(i);setSelectorDraft(funds[i].selector);};
  const saveSelector=(i)=>{
    setFunds(prev=>prev.map((f,idx)=>idx===i?{...f,selector:selectorDraft}:f));
    setEditingSelector(null);
  };

  const generateCSV=()=>{
    const rows=[
      [`${fyLabel} Collection Budget Allocations`],[],
      ["Sierra Fund","Budget","Assigned Selector","Account String","Category","50% by Dec 1","75% by Feb 1","90% by Apr 1"],
      ...funds.map(f=>[f.fund,f.budget,f.selector,f.accountString,f.category,(f.budget*0.5).toFixed(0),(f.budget*0.75).toFixed(0),(f.budget*0.9).toFixed(0)]),
      [],
      ["Total",funds.reduce((s,f)=>s+f.budget,0),"","","",
        (funds.reduce((s,f)=>s+f.budget,0)*0.5).toFixed(0),
        (funds.reduce((s,f)=>s+f.budget,0)*0.75).toFixed(0),
        (funds.reduce((s,f)=>s+f.budget,0)*0.9).toFixed(0)],
      [],[`Budget Summary — ${fyLabel}`],
      ["Books + DIF Supp.",totalAllocatable],["Digital",digitalTotal],["Periodicals",periodicalsTotal],
      ["Total Materials Budget",totalAllocatable+digitalTotal+periodicalsTotal],
    ];
    const csv=rows.map(r=>r.map(c=>`"${c}"`).join(",")).join("
");
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`${fyLabel}_CollectionsBudgetAllocations.csv`;a.click();
    setGenerated(true);
  };

  const catColor=c=>c==="Digital"?PALETTE[0]:c==="Books"?PALETTE[4]:PALETTE[3];

  return (
    <div>
      <SectionHeader title="Budget Allocation Generator" sub="Generate next fiscal year's collection budget allocation document"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        <div style={card}>
          <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:16}}>Fiscal Year & Budget Inputs</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[{label:"Fiscal Year Label",val:fyLabel,set:setFyLabel,type:"text"},{label:"Books Budget",val:booksTotal,set:setBooksTotal,type:"number"},{label:"DIF Supplement",val:difSupp,set:setDifSupp,type:"number"},{label:"Digital Budget",val:digitalTotal,set:setDigitalTotal,type:"number"},{label:"Periodicals Budget",val:periodicalsTotal,set:setPeriodicalsTotal,type:"number"}].map(({label,val,set,type})=>(
              <div key={label}>
                <label style={{fontSize:11,color:MUTED,display:"block",marginBottom:4}}>{label}</label>
                <input type={type} value={val} onChange={e=>set(type==="number"?parseFloat(e.target.value)||0:e.target.value)}
                  style={{width:"100%",background:BG,border:`1px solid ${BORDER}`,borderRadius:6,padding:"7px 10px",color:TEXT,fontSize:13,boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,padding:"12px 14px",background:BG,borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:12,color:MUTED}}>Total Allocatable (Books + DIF)</span>
            <span style={{fontSize:16,fontWeight:700,color:PALETTE[0],fontFamily:"monospace"}}>{fmt$(totalAllocatable)}</span>
          </div>
        </div>
        <div style={card}>
          <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:12}}>Allocation Status</div>
          <div style={{padding:"14px",background:BG,borderRadius:8,marginBottom:12}}>
            {[["Allocatable (Books + DIF)",totalAllocatable],["Currently Allocated",totalAllocated]].map(([label,val])=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:12,color:MUTED}}>{label}</span>
                <span style={{color:TEXT,fontFamily:"monospace",fontWeight:600}}>{fmt$(val)}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:`1px solid ${BORDER}`}}>
              <span style={{fontSize:12,color:MUTED}}>Difference</span>
              <span style={{color:Math.abs(diff)<100?"#4ade80":diff>0?"#f87171":"#f59e0b",fontFamily:"monospace",fontWeight:700}}>{diff>0?"+":""}{fmt$(diff)}</span>
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{height:8,background:BORDER,borderRadius:4,overflow:"hidden"}}>
              <div style={{width:`${Math.min(100,(totalAllocated/totalAllocatable)*100)}%`,height:"100%",background:Math.abs(diff)<100?"#4ade80":diff>0?"#ef4444":PALETTE[0],borderRadius:4,transition:"width 0.3s"}}/>
            </div>
            <div style={{fontSize:11,color:MUTED,marginTop:4}}>{((totalAllocated/totalAllocatable)*100).toFixed(1)}% of allocatable budget distributed</div>
          </div>
          <button onClick={autoCalculate} style={{width:"100%",background:"#8b5cf622",border:"1px solid #8b5cf644",color:"#a78bfa",borderRadius:8,padding:"10px",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:8,fontFamily:"inherit"}}>✨ Auto-Calculate from Circs Data</button>
          <button onClick={generateCSV} style={{width:"100%",background:PALETTE[0]+"22",border:`1px solid ${PALETTE[0]}44`,color:PALETTE[0],borderRadius:8,padding:"10px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📥 Download Budget CSV</button>
          {generated&&<div style={{fontSize:11,color:"#4ade80",textAlign:"center",marginTop:8}}>✓ File downloaded!</div>}
        </div>
      </div>
      <div style={card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,color:TEXT}}>Fund Allocations — Edit Individual Budgets & Selectors</div>
          <div style={{fontSize:11,color:MUTED}}>Click any selector name to edit it</div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{borderBottom:`1px solid ${BORDER}`}}>
              {["Fund","Category","Budget","Selector","50%","75%","90%"].map(h=>(
                <th key={h} style={{padding:"8px 12px",textAlign:"left",color:MUTED,fontWeight:600}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {funds.map((f,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${BORDER}22`,background:i%2===0?"transparent":"#ffffff05"}}>
                  <td style={{padding:"7px 12px",color:TEXT,fontWeight:500,whiteSpace:"nowrap"}}>{f.fund}</td>
                  <td style={{padding:"7px 12px"}}><span style={badge(catColor(f.category))}>{f.category}</span></td>
                  <td style={{padding:"7px 12px"}}>
                    <input type="number" value={f.budget} onChange={e=>updateFundBudget(i,e.target.value)}
                      style={{width:90,background:BG,border:`1px solid ${BORDER}`,borderRadius:4,padding:"4px 8px",color:TEXT,fontSize:12}}/>
                  </td>
                  <td style={{padding:"7px 12px"}}>
                    {editingSelector===i?(
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <input value={selectorDraft} onChange={e=>setSelectorDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveSelector(i);if(e.key==="Escape")setEditingSelector(null);}}
                          style={{flex:1,minWidth:140,background:BG,border:`1px solid ${PALETTE[0]}`,borderRadius:4,padding:"4px 8px",color:TEXT,fontSize:12}} autoFocus/>
                        <button onClick={()=>saveSelector(i)} style={{background:PALETTE[4]+"22",border:`1px solid ${PALETTE[4]}44`,color:PALETTE[4],borderRadius:4,padding:"3px 8px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✓</button>
                        <button onClick={()=>setEditingSelector(null)} style={{background:"transparent",border:`1px solid ${BORDER}`,color:MUTED,borderRadius:4,padding:"3px 8px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
                      </div>
                    ):(
                      <span onClick={()=>startEditSelector(i)} style={{color:MUTED,fontSize:11,cursor:"pointer",borderBottom:`1px dashed ${BORDER}`,paddingBottom:1}} title="Click to edit">{f.selector}</span>
                    )}
                  </td>
                  <td style={{padding:"7px 12px",color:MUTED,textAlign:"right"}}>{fmt$(f.budget*0.5)}</td>
                  <td style={{padding:"7px 12px",color:MUTED,textAlign:"right"}}>{fmt$(f.budget*0.75)}</td>
                  <td style={{padding:"7px 12px",color:MUTED,textAlign:"right"}}>{fmt$(f.budget*0.9)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Upload ─────────────────────────────────────────────────────────────
function AdminUpload({onFundsUpdate,onLastMonthUpdate,onYtdUpdate,onUpdateTimestamp}) {
  const parseCSV=(text)=>{
    const lines=text.trim().split("
");
    const headers=lines[0].split(",").map(h=>h.trim().replace(/"/g,""));
    return lines.slice(1).map(line=>{
      const vals=line.split(",").map(v=>v.trim().replace(/"/g,""));
      const obj={};
      headers.forEach((h,i)=>{obj[h]=vals[i]||"";});
      return obj;
    });
  };

  return (
    <div>
      <SectionHeader title="Data Management" sub="Upload updated monthly files to refresh the dashboard"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:24}}>
        <div style={card}>
          <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:4}}>Fund Balances</div>
          <div style={{fontSize:11,color:MUTED,marginBottom:14}}>Upload updated <code style={{background:BORDER,padding:"1px 4px",borderRadius:3}}>funds.csv</code></div>
          <FileUploadZone label="funds.csv" accepted=".csv" onFile={(f)=>{
            const reader=new FileReader();
            reader.onload=(e)=>{
              try{
                const rows=parseCSV(e.target.result);
                const parsed=rows.filter(r=>r["Fund Name"]&&r["Fund Name"]!=="Totals").map(r=>({
                  name:r["Fund Name"]?.trim(),code:r["Fund Code"]?.trim(),
                  appropriation:parseFloat(r["Appropriation"]?.replace(/[$,]/g,""))||0,
                  expenditure:parseFloat(r["Expenditure"]?.replace(/[$,]/g,""))||0,
                  encumbrance:parseFloat(r["Encumbrance"]?.replace(/[$,]/g,""))||0,
                  freeBalance:parseFloat(r["Free Balance"]?.replace(/[$,]/g,""))||0,
                }));
                onFundsUpdate(parsed);
                onUpdateTimestamp(new Date());
                alert(`✅ Loaded ${parsed.length} fund records`);
              }catch(err){alert("Error parsing file: "+err.message);}
            };
            reader.readAsText(f);
          }}/>
        </div>
        <div style={card}>
          <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:4}}>Last Month Circs</div>
          <div style={{fontSize:11,color:MUTED,marginBottom:14}}>Upload updated <code style={{background:BORDER,padding:"1px 4px",borderRadius:3}}>Circs_LastMonth.csv</code></div>
          <FileUploadZone label="Circs_LastMonth.csv" accepted=".csv" onFile={(f)=>{
            const reader=new FileReader();
            reader.onload=(e)=>{
              try{
                const lines=e.target.result.trim().split("
");
                const parsed=[];
                for(let i=4;i<lines.length;i++){
                  const vals=lines[i].split(",").map(v=>v.trim().replace(/"/g,""));
                  if(!vals[0]) continue;
                  const getBranch=(loc)=>{for(const b of BRANCHES){if(loc.startsWith(b))return b;}return "External Borrowers";};
                  parsed.push({location:vals[0],pct:parseFloat(vals[1])||0,qty:parseInt(vals[2])||0,changePrevYr:parseFloat(vals[3])||0,changePrevMo:parseFloat(vals[4])||0,prevYrQty:parseInt(vals[5])||0,prevMoQty:parseInt(vals[6])||0,branch:getBranch(vals[0])});
                }
                onLastMonthUpdate(parsed);
                onUpdateTimestamp(new Date());
                alert(`✅ Loaded ${parsed.length} circulation records`);
              }catch(err){alert("Error: "+err.message);}
            };
            reader.readAsText(f);
          }}/>
        </div>
        <div style={card}>
          <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:4}}>YTD Circs</div>
          <div style={{fontSize:11,color:MUTED,marginBottom:14}}>Upload updated <code style={{background:BORDER,padding:"1px 4px",borderRadius:3}}>Circs_YTD.csv</code></div>
          <FileUploadZone label="Circs_YTD.csv" accepted=".csv" onFile={(f)=>{
            const reader=new FileReader();
            reader.onload=(e)=>{
              try{
                const lines=e.target.result.trim().split("
");
                const parsed=[];
                for(let i=4;i<lines.length;i++){
                  const vals=lines[i].split(",").map(v=>v.trim().replace(/"/g,""));
                  if(!vals[0]) continue;
                  const getBranch=(loc)=>{for(const b of BRANCHES){if(loc.startsWith(b))return b;}return "External Borrowers";};
                  parsed.push({location:vals[0],pct:parseFloat(vals[1])||0,qty:parseInt(vals[2])||0,branch:getBranch(vals[0])});
                }
                onYtdUpdate(parsed);
                onUpdateTimestamp(new Date());
                alert(`✅ Loaded ${parsed.length} YTD records`);
              }catch(err){alert("Error: "+err.message);}
            };
            reader.readAsText(f);
          }}/>
        </div>
      </div>
      <div style={card}>
        <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:12}}>How to Use This Dashboard</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {[
            {step:"1",title:"Monthly Fund Update",desc:"Export your Sierra fund report as a CSV with the same column headers as the original funds.csv file, then upload it above. The Fund Balances dashboard updates instantly."},
            {step:"2",title:"Monthly Circs Update",desc:"Export your circulation reports from Sierra as CSV files (File → Export). Keep the same column structure. Upload each file above to update the Circs dashboards."},
            {step:"3",title:"Annual Budget Generation",desc:"At the start of each fiscal year, go to the Budget Generator tab. Enter the new total budget figures, click Auto-Calculate, adjust as needed, and download the CSV."},
            {step:"4",title:"Tips",desc:"The Budget Generator auto-calculation uses 25% circ weighting + 75% prior-year budget weighting — the same methodology as the FY25-26 Rationale sheet. You can override any fund manually."},
          ].map(({step,title,desc})=>(
            <div key={step} style={{display:"flex",gap:12,padding:14,background:BG,borderRadius:8}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:PALETTE[0]+"22",border:`1px solid ${PALETTE[0]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:PALETTE[0],flexShrink:0}}>{step}</div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:4}}>{title}</div>
                <div style={{fontSize:12,color:MUTED,lineHeight:1.5}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
const TABS = ["📊 Fund Balances","🔄 Circulation Stats","💰 Budget Generator","⚙️ Data Management"];
const ADMIN_TABS = [2,3]; // tabs requiring auth

export default function App() {
  const [tab,setTab]=useState(0);
  const [funds,setFunds]=useState(SEED_FUNDS);
  const [lastMonthCircs,setLastMonthCircs]=useState(SEED_CIRCS_LAST);
  const [ytdCircs,setYtdCircs]=useState(SEED_CIRCS_YTD);
  const [lastUpdated,setLastUpdated]=useState(null);
  const [adminAuthed,setAdminAuthed]=useState(false);
  const [pendingTab,setPendingTab]=useState(null);

  const handleTabClick=(i)=>{
    if(ADMIN_TABS.includes(i)&&!adminAuthed){
      setPendingTab(i);
      setTab(i); // show login wall on that tab
    } else {
      setTab(i);
    }
  };

  const handleLogin=()=>{
    setAdminAuthed(true);
    if(pendingTab!=null) setTab(pendingTab);
  };

  const isAdminTab = ADMIN_TABS.includes(tab);
  const showLoginWall = isAdminTab && !adminAuthed;

  const fmtDate=(d)=>{
    if(!d) return null;
    return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"});
  };

  return (
    <div style={{minHeight:"100vh",background:BG,color:TEXT,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-track{background:${BG};}
        ::-webkit-scrollbar-thumb{background:${BORDER};border-radius:3px;}
        input:focus,select:focus{outline:1px solid ${PALETTE[0]};}
        button:hover{opacity:0.85;}
        option{background:${CARD};}
      `}</style>

      {/* Header */}
      <div style={{borderBottom:`1px solid ${BORDER}`,padding:"14px 32px",display:"flex",alignItems:"center",gap:16,position:"sticky",top:0,background:BG+"ee",backdropFilter:"blur(12px)",zIndex:100}}>
        <div style={{width:36,height:36,borderRadius:8,background:PALETTE[0]+"33",border:`1px solid ${PALETTE[0]}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📚</div>
        <div>
          <div style={{fontSize:16,fontWeight:800,letterSpacing:"-0.02em"}}>Collection Development Dashboard</div>
          <div style={{fontSize:11,color:MUTED}}>
            {lastUpdated
              ? <span>Last updated: <span style={{color:PALETTE[4]}}>{fmtDate(lastUpdated)}</span></span>
              : <span style={{color:"#444c56",fontStyle:"italic"}}>Last updated: — (upload files in Data Management to set this date)</span>
            }
          </div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:4,alignItems:"center"}}>
          {TABS.map((t,i)=>{
            const isAdmin=ADMIN_TABS.includes(i);
            return (
              <button key={i} onClick={()=>handleTabClick(i)} style={{padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit",background:tab===i?PALETTE[0]+"22":"transparent",color:tab===i?PALETTE[0]:MUTED,borderBottom:tab===i?`2px solid ${PALETTE[0]}`:"2px solid transparent",transition:"all 0.15s",display:"flex",alignItems:"center",gap:5}}>
                {t}{isAdmin&&<span style={{fontSize:9,opacity:0.6}}>🔒</span>}
              </button>
            );
          })}
          {adminAuthed&&<button onClick={()=>setAdminAuthed(false)} style={{padding:"5px 10px",borderRadius:6,border:`1px solid ${BORDER}`,background:"transparent",color:MUTED,fontSize:11,cursor:"pointer",fontFamily:"inherit",marginLeft:4}}>Sign out</button>}
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:1280,margin:"0 auto",padding:"32px"}}>
        {showLoginWall
          ? <LoginWall onLogin={handleLogin}/>
          : <>
              {tab===0&&<FundsDashboard funds={funds}/>}
              {tab===1&&<CircsDashboard lastMonth={lastMonthCircs} ytd={ytdCircs} lastMonthLabel="January 2026" ytdLabel="Jan–Feb 2026"/>}
              {tab===2&&<BudgetGenerator ytdCircs={ytdCircs}/>}
              {tab===3&&<AdminUpload onFundsUpdate={setFunds} onLastMonthUpdate={setLastMonthCircs} onYtdUpdate={setYtdCircs} onUpdateTimestamp={setLastUpdated}/>}
            </>
        }
      </div>
    </div>
  );
}
