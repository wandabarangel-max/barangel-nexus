import { useState, useEffect } from "react";

// ── HELPERS ───────────────────────────────────────────────────────────────
function ytId(url) {
  if (!url) return null;
  const pats = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /\/live\/([a-zA-Z0-9_-]{11})/,
    /\/shorts\/([a-zA-Z0-9_-]{11})/,
    /\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of pats) { const m = url.match(p); if (m) return m[1]; }
  return null;
}
async function loadData(key, def) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : def; }
  catch { return def; }
}
async function saveData(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}

// ── DEFAULT DATA ──────────────────────────────────────────────────────────
const DEF_BOOKS = [
  { id:1, title:"African Wonder: The Liberation Saga", author:"Wanda barAngel", cat:"Entertainment", cover:"🌍", desc:"An Afrofuturist action epic of liberation and identity.", free:true, link:"" },
  { id:2, title:"Christ in African Context", author:"barAngel", cat:"Theology", cover:"✝️", desc:"Understanding Jesus through an African theological lens.", free:true, link:"" },
  { id:3, title:"Engineering the Future", author:"barAngel", cat:"Engineering", cover:"⚙️", desc:"Mechanical principles for African development.", free:true, link:"" },
  { id:4, title:"The Conscious Universe", author:"barAngel", cat:"Philosophy", cover:"🌌", desc:"Consciousness, identity, and the nature of being.", free:true, link:"" },
];
const DEF_ARTICLES = [
  { id:1, title:"Why Truth Is Africa's Greatest Resource", cat:"Truth", date:"June 2026", readTime:"8 min", content:"In a continent rich with natural resources, the most undervalued is intellectual honesty — the courage to see clearly and speak plainly about what is real.\n\nTruth-telling requires courage. It requires the willingness to stand alone when necessary, to hold a position not because it is popular but because it is accurate.", premium:false },
  { id:2, title:"The Physics of Creation", cat:"Theology", date:"June 2026", readTime:"12 min", content:"When we examine the first moments of the cosmos, theology and science converge on the same startling conclusion: that existence itself is not accidental.\n\nThe fine-tuning of universal constants, the arrow of time, the emergence of consciousness from matter — all point toward design.", premium:false },
];
const DEF_SOCIALS = [
  { id:1, name:"YouTube",   icon:"▶️", color:"#FF0000", url:"https://youtube.com/@bar-angel",     active:true  },
  { id:2, name:"TikTok",    icon:"🎵", color:"#69C9D0", url:"https://tiktok.com/@barangel.7",     active:true  },
  { id:3, name:"Gmail",     icon:"📧", color:"#EA4335", url:"mailto:wandabarangel@gmail.com",      active:true  },
  { id:4, name:"Telegram",  icon:"✈️", color:"#229ED9", url:"",                                    active:false },
  { id:5, name:"WhatsApp",  icon:"💬", color:"#25D366", url:"",                                    active:false },
  { id:6, name:"Instagram", icon:"📸", color:"#E4405F", url:"",                                    active:false },
];

const CATS_LIB = ["All","Truth","Science","Engineering","Entertainment","Philosophy","Theology","Culture","Self-Sustainability"];
const CATS_PUB = ["All","Truth","Science","Engineering","Theology","Philosophy","Culture","Stories & SciFi","Self-Sustainability"];
const NAV = [
  {id:"home",label:"Home",icon:"🏠"},{id:"library",label:"Library",icon:"📚"},
  {id:"publications",label:"Posts",icon:"📝"},{id:"videos",label:"Videos",icon:"🎬"},
  {id:"community",label:"Community",icon:"🌍"},{id:"premium",label:"Premium",icon:"⭐"},
  {id:"donate",label:"Donate",icon:"❤️"},
];

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  bg:"#0B0B12", card:"#111120", cardB:"#1E1E35",
  gold:"#D4A017", goldL:"#F0C040", orange:"#E8621A",
  teal:"#2A9D8F", violet:"#1A0A2E", text:"#E8E8E8",
  muted:"#7A7A9A", red:"#E05555",
};
const S = {
  app:   { backgroundColor:C.bg, minHeight:"100vh", fontFamily:"'Inter',sans-serif", color:C.text },
  hdr:   { backgroundColor:"#0D0D1A", borderBottom:`1px solid ${C.cardB}`, padding:"0 14px",
           display:"flex", alignItems:"center", justifyContent:"space-between",
           height:56, position:"sticky", top:0, zIndex:100 },
  logo:  { fontFamily:"'Cinzel',serif", fontSize:17, fontWeight:700, color:C.gold, letterSpacing:2, cursor:"pointer", userSelect:"none" },
  main:  { maxWidth:1080, margin:"0 auto", padding:"30px 14px 100px" },
  h1:    { fontFamily:"'Cinzel',serif", fontSize:23, fontWeight:700, color:C.gold, margin:"0 0 5px" },
  sub:   { color:C.muted, fontSize:13, marginBottom:24 },
  card:  { backgroundColor:C.card, border:`1px solid ${C.cardB}`, borderRadius:12, padding:15, transition:"transform .2s, border-color .2s" },
  gBtn:  { backgroundColor:C.gold, color:"#0B0B12", border:"none", borderRadius:8, padding:"9px 17px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif" },
  oBtn:  { backgroundColor:"transparent", color:C.gold, border:`1px solid ${C.gold}`, borderRadius:8, padding:"9px 17px", fontSize:13, fontWeight:600, cursor:"pointer" },
  dBtn:  { backgroundColor:"transparent", color:C.red, border:`1px solid ${C.red}`, borderRadius:8, padding:"6px 11px", fontSize:11, fontWeight:600, cursor:"pointer" },
  inp:   { backgroundColor:"#1A1A2E", border:`1px solid ${C.cardB}`, borderRadius:8, padding:"9px 11px", color:C.text, fontSize:13, width:"100%", outline:"none", fontFamily:"'Inter',sans-serif", boxSizing:"border-box" },
  grid:  (min=200) => ({ display:"grid", gridTemplateColumns:`repeat(auto-fill,minmax(${min}px,1fr))`, gap:12 }),
  tag:   (col) => ({ backgroundColor:col+"22", color:col, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600, display:"inline-block" }),
  catB:  (on) => ({ padding:"5px 12px", borderRadius:20, border:`1px solid ${on?C.gold:C.cardB}`, backgroundColor:on?C.gold+"22":"transparent", color:on?C.gold:C.muted, cursor:"pointer", fontSize:11, fontWeight:500 }),
  navB:  (on) => ({ padding:"6px 9px", borderRadius:7, border:"none", cursor:"pointer", fontSize:11, fontWeight:500, backgroundColor:on?C.gold:"transparent", color:on?"#0B0B12":C.muted, transition:"all .2s" }),
  overlay: { position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,.88)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:14 },
  modal: { backgroundColor:C.card, border:`1px solid ${C.cardB}`, borderRadius:16, padding:24, maxWidth:460, width:"100%", maxHeight:"90vh", overflowY:"auto", position:"relative" },
};

// ── MAIN APP ──────────────────────────────────────────────────────────────
export default function BarAngelNexus() {
  const [books,    setBooks]    = useState([]);
  const [articles, setArticles] = useState([]);
  const [videos,   setVideos]   = useState([]);
  const [socials,  setSocials]  = useState([]);
  const [loaded,   setLoaded]   = useState(false);

  const [sec,         setSec]         = useState("home");
  const [libCat,      setLibCat]      = useState("All");
  const [pubCat,      setPubCat]      = useState("All");
  const [playVideo,   setPlayVideo]   = useState(null);
  const [readArticle, setReadArticle] = useState(null);
  const [donoAmt,     setDonoAmt]     = useState("5");

  // Admin
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminTab,  setAdminTab]  = useState("books");
  const [passInput, setPassInput] = useState("");
  const [passErr,   setPassErr]   = useState(false);
  const ADMIN_PASS = "barAngel2026";

  useEffect(() => {
    (async () => {
      const [b,a,v,s] = await Promise.all([
        loadData("baN_books",    DEF_BOOKS),
        loadData("baN_articles", DEF_ARTICLES),
        loadData("baN_videos",   []),
        loadData("baN_socials",  DEF_SOCIALS),
      ]);
      setBooks(b); setArticles(a); setVideos(v); setSocials(s);
      setLoaded(true);
    })();
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(l);
    return () => { try { document.head.removeChild(l); } catch {} };
  }, []);

  const upBooks    = async v => { setBooks(v);    await saveData("baN_books", v); };
  const upArticles = async v => { setArticles(v); await saveData("baN_articles", v); };
  const upVideos   = async v => { setVideos(v);   await saveData("baN_videos", v); };
  const upSocials  = async v => { setSocials(v);  await saveData("baN_socials", v); };

  const tryLogin = () => {
    if (passInput === ADMIN_PASS) { setAdminAuth(true); setPassErr(false); setPassInput(""); }
    else setPassErr(true);
  };

  const filtBooks = libCat === "All" ? books    : books.filter(b => b.cat === libCat);
  const filtArts  = pubCat === "All" ? articles : articles.filter(a => a.cat === pubCat);
  const activeSocs = socials.filter(s => s.url && s.active !== false);

  if (!loaded) return (
    <div style={{ ...S.app, display:"flex", alignItems:"center", justifyContent:"center", height:"100vh" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"'Cinzel',serif", color:C.gold, fontSize:22 }}>✦ barAngel Nexus</div>
        <div style={{ color:C.muted, fontSize:13, marginTop:6 }}>Loading…</div>
      </div>
    </div>
  );

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION: HOME
  // ──────────────────────────────────────────────────────────────────────────
  function Home() {
    return (
      <div>
        <div style={{ background:`linear-gradient(135deg,#1A0A2E 0%,#0B0B12 55%,#0D1A1A 100%)`,
                      borderRadius:16, padding:"46px 26px", marginBottom:30,
                      border:`1px solid ${C.cardB}`, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:10, right:24, fontSize:96, opacity:.05, pointerEvents:"none" }}>✦</div>
          <div style={{ fontSize:10, color:C.teal, fontWeight:700, letterSpacing:3, textTransform:"uppercase", marginBottom:11 }}>Where Truth Meets Creation</div>
          <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:38, fontWeight:700, color:C.gold, lineHeight:1.15, margin:"0 0 11px" }}>barAngel Nexus</h1>
          <p style={{ color:C.muted, fontSize:14, lineHeight:1.75, maxWidth:480, marginBottom:22 }}>
            A universe of truth, science, engineering, theology, culture, and creativity.
            Books, articles, videos — all free, all African.
          </p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <button style={S.gBtn} onClick={()=>setSec("library")}>📚 Library</button>
            <button style={S.oBtn} onClick={()=>setSec("publications")}>📝 Publications</button>
            <button style={{ ...S.oBtn, borderColor:C.teal, color:C.teal }} onClick={()=>setSec("videos")}>🎬 Videos</button>
            <button style={{ ...S.oBtn, borderColor:"#229ED9", color:"#229ED9" }} onClick={()=>setSec("community")}>🌍 Community</button>
          </div>
        </div>

        <div style={{ ...S.grid(115), marginBottom:28 }}>
          {[["📚",books.length,"Books"],["📝",articles.length,"Articles"],["🎬",videos.length,"Videos"],
            ["🌍","Free","Forever"],["⭐","Premium","Content"],["❤️","Donate","Support"]].map(([ic,n,lb])=>(
            <div key={lb} style={{ ...S.card, textAlign:"center", padding:"14px 8px" }}>
              <div style={{ fontSize:18 }}>{ic}</div>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:15, fontWeight:700, color:C.gold, margin:"3px 0 1px" }}>{n}</div>
              <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:.8 }}>{lb}</div>
            </div>
          ))}
        </div>

        {books.length > 0 && <>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:14, color:C.text, margin:"0 0 11px" }}>✦ Featured Books</div>
          <div style={{ ...S.grid(185), marginBottom:26 }}>
            {books.slice(0,4).map(b=>(
              <div key={b.id} style={{ ...S.card, borderLeft:`3px solid ${C.gold}`, cursor:"pointer" }}
                   onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
                   onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{ fontSize:28, marginBottom:7 }}>{b.cover||"📖"}</div>
                <div style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>{b.title}</div>
                <div style={S.tag(C.teal)}>{b.cat}</div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.5, marginTop:7 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </>}

        {articles.length > 0 && <>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:14, color:C.text, margin:"0 0 11px" }}>✦ Latest Publications</div>
          <div style={S.grid(240)}>
            {articles.slice(0,3).map(a=>(
              <div key={a.id} style={{ ...S.card, borderLeft:`3px solid ${C.orange}`, cursor:"pointer" }}
                   onClick={()=>setReadArticle(a)}
                   onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
                   onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                  <span style={S.tag(C.orange)}>{a.cat}</span>
                  {a.premium && <span style={S.tag(C.gold)}>⭐</span>}
                </div>
                <div style={{ fontWeight:600, fontSize:13, marginBottom:5 }}>{a.title}</div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{(a.content||"").slice(0,100)}…</div>
              </div>
            ))}
          </div>
        </>}
      </div>
    );
  }

  // SECTION: LIBRARY
  function Library() {
    return (
      <div>
        <h2 style={S.h1}>📚 Library</h2>
        <p style={S.sub}>Books on truth, science, engineering, theology, philosophy, and more.</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
          {CATS_LIB.map(c=><button key={c} style={S.catB(libCat===c)} onClick={()=>setLibCat(c)}>{c}</button>)}
        </div>
        {filtBooks.length === 0 ? (
          <div style={{ textAlign:"center", padding:40, color:C.muted }}>
            <div style={{ fontSize:32, marginBottom:8 }}>📚</div>
            No books yet in this category. Log in as admin to add books.
          </div>
        ) : (
          <div style={S.grid(185)}>
            {filtBooks.map(b=>(
              <div key={b.id} style={{ ...S.card, borderTop:`3px solid ${C.gold}` }}
                   onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.borderTopColor=C.goldL; }}
                   onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.borderTopColor=C.gold; }}>
                <div style={{ fontSize:42, textAlign:"center", padding:"12px 0", background:`linear-gradient(135deg,${C.violet},#0D0D1A)`, borderRadius:8, marginBottom:10 }}>{b.cover||"📖"}</div>
                <div style={{ fontWeight:600, fontSize:13, marginBottom:3 }}>{b.title}</div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:7 }}>by {b.author}</div>
                <div style={{ ...S.tag(C.teal), marginBottom:8 }}>{b.cat}</div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.5, marginBottom:10 }}>{b.desc}</div>
                {b.link
                  ? <a href={b.link} target="_blank" rel="noreferrer"
                       style={{ ...S.gBtn, display:"block", textAlign:"center", textDecoration:"none", padding:"8px 0", fontSize:12 }}>
                      {b.free !== false ? "Read — Free" : "Get Access"}
                    </a>
                  : <button style={{ ...S.gBtn, width:"100%", padding:"8px 0", fontSize:12, opacity:.55, cursor:"default" }}>Coming Soon</button>
                }
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // SECTION: PUBLICATIONS
  function Publications() {
    return (
      <div>
        <h2 style={S.h1}>📝 Publications</h2>
        <p style={S.sub}>Articles, essays, and writings across all topics.</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
          {CATS_PUB.map(c=><button key={c} style={S.catB(pubCat===c)} onClick={()=>setPubCat(c)}>{c}</button>)}
        </div>
        {filtArts.length === 0 ? (
          <div style={{ textAlign:"center", padding:40, color:C.muted }}>
            <div style={{ fontSize:32, marginBottom:8 }}>📝</div>
            No publications yet. Log in as admin to add articles.
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtArts.map(a=>(
              <div key={a.id} style={{ ...S.card, display:"flex", gap:13, alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", marginBottom:6 }}>
                    <span style={S.tag(C.orange)}>{a.cat}</span>
                    {a.premium && <span style={S.tag(C.gold)}>⭐ Premium</span>}
                    <span style={{ fontSize:11, color:C.muted }}>{a.date} · {a.readTime}</span>
                  </div>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>{a.title}</div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.65 }}>
                    {(a.content||"").slice(0, a.premium ? 80 : 150)}{(a.content||"").length > 80 ? "…" : ""}
                  </div>
                </div>
                <div style={{ flexShrink:0 }}>
                  {a.premium
                    ? <button style={{ ...S.oBtn, fontSize:11, padding:"7px 11px" }} onClick={()=>setSec("premium")}>🔒 Unlock</button>
                    : <button style={{ ...S.gBtn, fontSize:11, padding:"7px 11px" }} onClick={()=>setReadArticle(a)}>Read →</button>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // SECTION: VIDEOS
  function Videos() {
    return (
      <div>
        <h2 style={S.h1}>🎬 Videos</h2>
        <p style={S.sub}>Watch YouTube videos, live streams, and more — all here.</p>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:10, color:C.muted, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:9 }}>▶ YouTube Channel</div>
          <div style={{ ...S.card, display:"flex", gap:13, alignItems:"center", borderLeft:`3px solid #FF0000` }}>
            <div style={{ fontSize:38 }}>▶️</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, marginBottom:2 }}>barAngel YouTube Channel</div>
              <div style={{ fontSize:12, color:C.muted }}>@bar-angel · Subscribe for truth, engineering, science & culture</div>
            </div>
            <a href="https://youtube.com/@bar-angel" target="_blank" rel="noreferrer"
               style={{ ...S.gBtn, textDecoration:"none", flexShrink:0 }}>Visit →</a>
          </div>
        </div>

        {videos.length > 0 ? (
          <>
            <div style={{ fontSize:10, color:C.muted, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:9 }}>🎬 All Videos</div>
            <div style={S.grid(210)}>
              {videos.map(v => {
                const vid = ytId(v.url);
                const thumb = vid ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg` : null;
                return (
                  <div key={v.id} style={{ ...S.card, cursor:"pointer", overflow:"hidden", padding:0 }}
                       onClick={()=>setPlayVideo(v)}
                       onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
                       onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                    {thumb
                      ? <img src={thumb} alt={v.title} style={{ width:"100%", aspectRatio:"16/9", objectFit:"cover", display:"block" }} />
                      : <div style={{ width:"100%", aspectRatio:"16/9", backgroundColor:C.violet, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30 }}>🎬</div>
                    }
                    <div style={{ padding:"10px 12px" }}>
                      <div style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>{v.title}</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {v.cat && <span style={S.tag(C.orange)}>{v.cat}</span>}
                        {v.live && <span style={S.tag(C.red)}>🔴 LIVE</span>}
                      </div>
                      {v.desc && <div style={{ fontSize:11, color:C.muted, marginTop:5, lineHeight:1.5 }}>{v.desc}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ textAlign:"center", padding:36, border:`1px dashed ${C.cardB}`, borderRadius:12 }}>
            <div style={{ fontSize:30, marginBottom:7 }}>🎬</div>
            <div style={{ fontWeight:600, marginBottom:5 }}>No videos added yet</div>
            <div style={{ color:C.muted, fontSize:12 }}>Log in as admin to add YouTube videos or live streams.</div>
          </div>
        )}
      </div>
    );
  }

  // SECTION: COMMUNITY
  function Community() {
    const tel = socials.find(s=>s.name==="Telegram"&&s.url);
    const wa  = socials.find(s=>s.name==="WhatsApp"&&s.url);
    return (
      <div>
        <h2 style={S.h1}>🌍 Community</h2>
        <p style={S.sub}>Connect across all platforms.</p>
        {activeSocs.length === 0 ? (
          <div style={{ textAlign:"center", padding:40, color:C.muted }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🌍</div>
            Social links coming soon. Log in as admin to add them.
          </div>
        ) : (
          <div style={{ ...S.grid(160), marginBottom:28 }}>
            {activeSocs.map(s=>(
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer"
                 style={{ ...S.card, display:"flex", flexDirection:"column", alignItems:"center",
                          textAlign:"center", textDecoration:"none", borderLeft:`3px solid ${s.color}`, gap:7 }}
                 onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"}
                 onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{ fontSize:34 }}>{s.icon}</div>
                <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{s.name}</div>
                <span style={S.tag(s.color)}>Open →</span>
              </a>
            ))}
          </div>
        )}

        {tel && (
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:10, color:C.muted, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:9 }}>✈ Telegram Channel</div>
            <div style={{ ...S.card, display:"flex", gap:13, alignItems:"center", borderLeft:`3px solid #229ED9` }}>
              <div style={{ fontSize:34 }}>✈️</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, marginBottom:2 }}>barAngel Telegram Channel</div>
                <div style={{ fontSize:12, color:C.muted }}>Posts, updates, and community discussions</div>
              </div>
              <a href={tel.url} target="_blank" rel="noreferrer" style={{ ...S.gBtn, textDecoration:"none", flexShrink:0 }}>Join →</a>
            </div>
          </div>
        )}
        {wa && (
          <div>
            <div style={{ fontSize:10, color:C.muted, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:9 }}>💬 WhatsApp</div>
            <div style={{ ...S.card, display:"flex", gap:13, alignItems:"center", borderLeft:`3px solid #25D366` }}>
              <div style={{ fontSize:34 }}>💬</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, marginBottom:2 }}>Chat on WhatsApp</div>
                <div style={{ fontSize:12, color:C.muted }}>Direct messages and discussions</div>
              </div>
              <a href={wa.url} target="_blank" rel="noreferrer"
                 style={{ backgroundColor:"#25D366", color:"#fff", border:"none", borderRadius:8, padding:"9px 16px", fontSize:13, fontWeight:700, cursor:"pointer", textDecoration:"none", flexShrink:0 }}>Chat →</a>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SECTION: PREMIUM
  function Premium() {
    const [showP, setShowP] = useState(false);
    return (
      <div>
        <h2 style={S.h1}>⭐ Premium Access</h2>
        <p style={S.sub}>Unlock exclusive content, partner benefits, and inner-circle access.</p>
        <div style={S.grid(220)}>
          <div style={{ ...S.card, border:`2px solid ${C.cardB}` }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:15, marginBottom:5 }}>🌱 Explorer</div>
            <div style={{ fontSize:26, fontWeight:700, marginBottom:2 }}>Free</div>
            <div style={{ color:C.muted, fontSize:11, marginBottom:15 }}>Always & forever</div>
            {["Full library","All free articles","Video access","Community links"].map(f=>(
              <div key={f} style={{ display:"flex", gap:6, alignItems:"center", marginBottom:5, fontSize:12 }}>
                <span style={{ color:C.teal }}>✓</span>{f}
              </div>
            ))}
            <div style={{ ...S.oBtn, display:"block", textAlign:"center", marginTop:15, padding:"9px 0", opacity:.5, cursor:"default" }}>Current Plan</div>
          </div>
          <div style={{ ...S.card, border:`2px solid ${C.gold}` }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:15, color:C.gold, marginBottom:5 }}>⭐ Nexus Premium</div>
            <div style={{ fontSize:26, fontWeight:700, color:C.gold, marginBottom:2 }}>$3<span style={{ fontSize:12, color:C.muted }}>/mo</span></div>
            <div style={{ color:C.muted, fontSize:11, marginBottom:15 }}>Cancel anytime</div>
            {["Everything in Free","Premium articles & books","Exclusive videos","Early access","Download as PDF"].map(f=>(
              <div key={f} style={{ display:"flex", gap:6, alignItems:"center", marginBottom:5, fontSize:12 }}>
                <span style={{ color:C.gold }}>✓</span>{f}
              </div>
            ))}
            <button style={{ ...S.gBtn, width:"100%", marginTop:15, padding:"10px 0" }}>Upgrade — $3/mo</button>
          </div>
          <div style={{ ...S.card, border:`2px solid ${C.orange}`, background:`linear-gradient(135deg,#1A0A2E,${C.card})` }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:15, color:C.orange, marginBottom:5 }}>🔥 Partner</div>
            <div style={{ fontSize:26, fontWeight:700, color:C.orange, marginBottom:2 }}>$10<span style={{ fontSize:12, color:C.muted }}>/mo</span></div>
            <div style={{ color:C.muted, fontSize:11, marginBottom:15 }}>Collaborators & supporters</div>
            {["Everything in Premium","Partner badge","Collaboration invite","Partner Telegram","Co-creation rights"].map(f=>(
              <div key={f} style={{ display:"flex", gap:6, alignItems:"center", marginBottom:5, fontSize:12 }}>
                <span style={{ color:C.orange }}>✓</span>{f}
              </div>
            ))}
            <button style={{ backgroundColor:C.orange, color:"#fff", border:"none", borderRadius:8, padding:"10px 0", fontSize:13, fontWeight:700, cursor:"pointer", width:"100%", marginTop:15, fontFamily:"'Inter',sans-serif" }}
                    onClick={()=>setShowP(true)}>Become a Partner</button>
          </div>
        </div>
        {showP && (
          <div style={S.overlay}>
            <div style={{ ...S.modal, maxWidth:360, textAlign:"center" }}>
              <div style={{ fontSize:34, marginBottom:9 }}>🔥</div>
              <h3 style={{ fontFamily:"'Cinzel',serif", color:C.orange, marginBottom:6 }}>Partner Request</h3>
              <p style={{ color:C.muted, fontSize:12, marginBottom:16 }}>Join the inner circle. Collaborate and co-create with barAngel.</p>
              <input style={{ ...S.inp, marginBottom:8 }} placeholder="Your name…" />
              <input style={{ ...S.inp, marginBottom:8 }} placeholder="Email or Telegram…" />
              <textarea style={{ ...S.inp, height:70, resize:"none", marginBottom:13 }} placeholder="Why do you want to partner?" />
              <button style={{ backgroundColor:C.orange, color:"#fff", border:"none", borderRadius:8, padding:"11px 0", fontSize:13, fontWeight:700, cursor:"pointer", width:"100%", marginBottom:8, fontFamily:"'Inter',sans-serif" }}>Submit</button>
              <button style={S.oBtn} onClick={()=>setShowP(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SECTION: DONATE
  function Donate() {
    return (
      <div>
        <h2 style={S.h1}>❤️ Support the Mission</h2>
        <p style={S.sub}>Your support keeps all content free and enables more creation.</p>
        <div style={{ maxWidth:440, margin:"0 auto" }}>
          <div style={{ ...S.card, textAlign:"center", padding:"30px 22px", marginBottom:14 }}>
            <div style={{ fontSize:42, marginBottom:10 }}>🌍</div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:17, color:C.gold, marginBottom:9 }}>Every Contribution Matters</div>
            <div style={{ color:C.muted, fontSize:13, lineHeight:1.75, marginBottom:22 }}>
              Supporting original African content — truth, science, theology, engineering, and creativity. 100% goes toward research and creation.
            </div>
            <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:14, flexWrap:"wrap" }}>
              {["1","3","5","10","20"].map(a=>(
                <button key={a} style={{ padding:"7px 13px", borderRadius:8, fontWeight:600, fontSize:13, border:`1px solid ${donoAmt===a?C.gold:C.cardB}`, backgroundColor:donoAmt===a?C.gold+"22":"transparent", color:donoAmt===a?C.gold:C.muted, cursor:"pointer" }} onClick={()=>setDonoAmt(a)}>${a}</button>
              ))}
            </div>
            <input style={{ ...S.inp, textAlign:"center", fontSize:16, fontWeight:700, marginBottom:12 }}
                   value={`$${donoAmt}`} onChange={e=>setDonoAmt(e.target.value.replace("$",""))} />
            <button style={{ ...S.gBtn, width:"100%", padding:"12px 0", fontSize:14, marginBottom:8 }}>💳 Donate ${donoAmt} via PayPal</button>
            <button style={{ ...S.oBtn, width:"100%", padding:"10px 0" }}>📱 Mobile Money</button>
            <div style={{ marginTop:11, fontSize:11, color:C.muted }}>Secure · No account required</div>
          </div>
          <div style={{ ...S.card, textAlign:"center" }}>
            <div style={{ fontWeight:600, marginBottom:8 }}>Other ways to support</div>
            <div style={{ display:"flex", gap:7, justifyContent:"center", flexWrap:"wrap" }}>
              <button style={{ ...S.oBtn, fontSize:11, padding:"7px 11px" }}>📢 Share</button>
              <button style={{ ...S.oBtn, fontSize:11, padding:"7px 11px" }} onClick={()=>setSec("premium")}>⭐ Premium</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── ADMIN PANEL ────────────────────────────────────────────────────────────
  function AdminPanel() {
    const nextId = arr => arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1;
    const label = { fontSize:11, color:C.muted, display:"block", marginBottom:4 };
    const inp2  = { ...S.inp, marginBottom:9 };
    const row2  = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:0 };

    // Book form
    const [bf, setBf] = useState({ title:"", author:"barAngel", cat:"Truth", cover:"📖", desc:"", free:true, link:"" });
    const saveBook = async () => { if (!bf.title) return; await upBooks([...books, { ...bf, id:nextId(books) }]); setBf({ title:"", author:"barAngel", cat:"Truth", cover:"📖", desc:"", free:true, link:"" }); };
    const delBook  = async id  => upBooks(books.filter(b=>b.id!==id));

    // Article form
    const [af, setAf] = useState({ title:"", cat:"Truth", date:"", readTime:"5 min", content:"", premium:false });
    const saveArt = async () => {
      if (!af.title) return;
      const d = af.date || new Date().toLocaleDateString("en-GB",{month:"long",year:"numeric"});
      await upArticles([...articles, { ...af, id:nextId(articles), date:d }]);
      setAf({ title:"", cat:"Truth", date:"", readTime:"5 min", content:"", premium:false });
    };
    const delArt = async id => upArticles(articles.filter(a=>a.id!==id));

    // Video form
    const [vf, setVf] = useState({ title:"", url:"", cat:"", desc:"", live:false });
    const [prevId, setPrevId] = useState(null);
    const saveVid = async () => { if (!vf.title||!vf.url) return; await upVideos([...videos, { ...vf, id:nextId(videos) }]); setVf({ title:"", url:"", cat:"", desc:"", live:false }); setPrevId(null); };
    const delVid  = async id  => upVideos(videos.filter(v=>v.id!==id));

    // Social form
    const [sf, setSf] = useState(null);
    const saveSoc = async () => { if(!sf) return; await upSocials(socials.map(s=>s.id===sf.id?sf:s)); setSf(null); };

    const TABS = [{id:"books",lbl:"📚 Books"},{id:"articles",lbl:"📝 Articles"},{id:"videos",lbl:"🎬 Videos"},{id:"socials",lbl:"🌍 Socials"}];

    return (
      <div style={S.overlay} onClick={e=>{ if(e.target===e.currentTarget){ setAdminOpen(false); setAdminAuth(false); } }}>
        <div style={{ backgroundColor:C.card, border:`1px solid ${C.gold}`, borderRadius:16, width:"100%", maxWidth:660, maxHeight:"92vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ backgroundColor:"#0D0D1A", padding:"12px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.cardB}`, flexShrink:0 }}>
            <span style={{ fontFamily:"'Cinzel',serif", color:C.gold, fontSize:15 }}>⚙ Admin Panel — barAngel Nexus</span>
            <button style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer" }} onClick={()=>{ setAdminOpen(false); setAdminAuth(false); }}>✕</button>
          </div>
          <div style={{ display:"flex", borderBottom:`1px solid ${C.cardB}`, flexShrink:0 }}>
            {TABS.map(t=>(
              <button key={t.id} style={{ flex:1, padding:"9px 0", border:"none", cursor:"pointer", fontSize:12, fontWeight:600, backgroundColor:adminTab===t.id?C.gold+"22":"transparent", color:adminTab===t.id?C.gold:C.muted, borderBottom:adminTab===t.id?`2px solid ${C.gold}`:"2px solid transparent" }} onClick={()=>setAdminTab(t.id)}>{t.lbl}</button>
            ))}
          </div>
          <div style={{ overflowY:"auto", padding:18, flex:1 }}>

            {/* BOOKS */}
            {adminTab==="books" && (
              <div>
                <div style={{ fontWeight:700, marginBottom:11, color:C.gold, fontSize:12 }}>+ ADD NEW BOOK</div>
                <div style={row2}>
                  <div><label style={label}>Title *</label><input style={inp2} value={bf.title} onChange={e=>setBf({...bf,title:e.target.value})} placeholder="Book title…" /></div>
                  <div><label style={label}>Author</label><input style={inp2} value={bf.author} onChange={e=>setBf({...bf,author:e.target.value})} /></div>
                </div>
                <div style={row2}>
                  <div><label style={label}>Category</label><select style={inp2} value={bf.cat} onChange={e=>setBf({...bf,cat:e.target.value})}>{CATS_LIB.slice(1).map(c=><option key={c}>{c}</option>)}</select></div>
                  <div><label style={label}>Cover Emoji</label><input style={inp2} value={bf.cover} onChange={e=>setBf({...bf,cover:e.target.value})} /></div>
                </div>
                <label style={label}>Description</label>
                <textarea style={{ ...inp2, height:55, resize:"none" }} value={bf.desc} onChange={e=>setBf({...bf,desc:e.target.value})} placeholder="Short description…" />
                <label style={label}>Link (PDF / Google Drive / website URL)</label>
                <input style={inp2} value={bf.link} onChange={e=>setBf({...bf,link:e.target.value})} placeholder="https://…" />
                <label style={{ ...label, display:"flex", alignItems:"center", gap:7, marginBottom:12, cursor:"pointer" }}>
                  <input type="checkbox" checked={bf.free!==false} onChange={e=>setBf({...bf,free:e.target.checked})} /> Free content
                </label>
                <button style={S.gBtn} onClick={saveBook}>+ Add Book</button>

                {books.length > 0 && (
                  <div style={{ marginTop:18, borderTop:`1px solid ${C.cardB}`, paddingTop:14 }}>
                    <div style={{ fontWeight:700, marginBottom:9, fontSize:11, color:C.muted }}>EXISTING BOOKS ({books.length})</div>
                    {books.map(b=>(
                      <div key={b.id} style={{ ...S.card, display:"flex", gap:9, alignItems:"center", marginBottom:7, padding:"9px 11px" }}>
                        <span style={{ fontSize:18 }}>{b.cover}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:12 }}>{b.title}</div>
                          <div style={{ fontSize:10, color:C.muted }}>{b.cat} · {b.free!==false?"Free":"Paid"}</div>
                        </div>
                        <button style={S.dBtn} onClick={()=>delBook(b.id)}>Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ARTICLES */}
            {adminTab==="articles" && (
              <div>
                <div style={{ fontWeight:700, marginBottom:11, color:C.gold, fontSize:12 }}>+ ADD ARTICLE / PUBLICATION</div>
                <label style={label}>Title *</label>
                <input style={inp2} value={af.title} onChange={e=>setAf({...af,title:e.target.value})} placeholder="Article title…" />
                <div style={row2}>
                  <div><label style={label}>Category</label><select style={inp2} value={af.cat} onChange={e=>setAf({...af,cat:e.target.value})}>{CATS_PUB.slice(1).map(c=><option key={c}>{c}</option>)}</select></div>
                  <div><label style={label}>Read time</label><input style={inp2} value={af.readTime} onChange={e=>setAf({...af,readTime:e.target.value})} placeholder="5 min" /></div>
                </div>
                <label style={label}>Content — write here, or paste from Word / HTML</label>
                <textarea style={{ ...inp2, height:150, resize:"vertical" }} value={af.content} onChange={e=>setAf({...af,content:e.target.value})} placeholder="Write your article here…" />
                <label style={{ ...label, display:"flex", alignItems:"center", gap:7, marginBottom:12, cursor:"pointer" }}>
                  <input type="checkbox" checked={af.premium} onChange={e=>setAf({...af,premium:e.target.checked})} /> Premium content (paid)
                </label>
                <button style={S.gBtn} onClick={saveArt}>+ Publish Article</button>

                {articles.length > 0 && (
                  <div style={{ marginTop:18, borderTop:`1px solid ${C.cardB}`, paddingTop:14 }}>
                    <div style={{ fontWeight:700, marginBottom:9, fontSize:11, color:C.muted }}>PUBLISHED ({articles.length})</div>
                    {articles.map(a=>(
                      <div key={a.id} style={{ ...S.card, display:"flex", gap:9, alignItems:"center", marginBottom:7, padding:"9px 11px" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:12 }}>{a.title}</div>
                          <div style={{ fontSize:10, color:C.muted }}>{a.cat} · {a.premium?"Premium":"Free"} · {a.date}</div>
                        </div>
                        <button style={S.dBtn} onClick={()=>delArt(a.id)}>Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIDEOS */}
            {adminTab==="videos" && (
              <div>
                <div style={{ fontWeight:700, marginBottom:11, color:C.gold, fontSize:12 }}>+ ADD VIDEO (YouTube / Live Stream / Online)</div>
                <label style={label}>Title *</label>
                <input style={inp2} value={vf.title} onChange={e=>setVf({...vf,title:e.target.value})} placeholder="Video title…" />
                <label style={label}>YouTube URL * — paste any YouTube link</label>
                <input style={inp2} value={vf.url}
                       onChange={e=>{ setVf({...vf,url:e.target.value}); setPrevId(ytId(e.target.value)); }}
                       placeholder="https://youtube.com/watch?v=… or https://youtu.be/…" />
                {prevId && (
                  <div style={{ marginBottom:9, borderRadius:8, overflow:"hidden", aspectRatio:"16/9" }}>
                    <iframe src={`https://www.youtube.com/embed/${prevId}?rel=0`}
                            style={{ width:"100%", height:"100%", border:"none" }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen title="preview" />
                  </div>
                )}
                <div style={row2}>
                  <div><label style={label}>Category</label><select style={inp2} value={vf.cat} onChange={e=>setVf({...vf,cat:e.target.value})}><option value="">— None —</option>{CATS_PUB.slice(1).map(c=><option key={c}>{c}</option>)}</select></div>
                  <div style={{ display:"flex", alignItems:"flex-end", paddingBottom:9 }}>
                    <label style={{ ...label, display:"flex", alignItems:"center", gap:7, marginBottom:0, cursor:"pointer" }}>
                      <input type="checkbox" checked={vf.live} onChange={e=>setVf({...vf,live:e.target.checked})} /> Mark as 🔴 Live
                    </label>
                  </div>
                </div>
                <label style={label}>Description (optional)</label>
                <input style={inp2} value={vf.desc} onChange={e=>setVf({...vf,desc:e.target.value})} placeholder="Short description…" />
                <button style={S.gBtn} onClick={saveVid}>+ Add Video</button>

                {videos.length > 0 && (
                  <div style={{ marginTop:18, borderTop:`1px solid ${C.cardB}`, paddingTop:14 }}>
                    <div style={{ fontWeight:700, marginBottom:9, fontSize:11, color:C.muted }}>VIDEOS ({videos.length})</div>
                    {videos.map(v=>(
                      <div key={v.id} style={{ ...S.card, display:"flex", gap:9, alignItems:"center", marginBottom:7, padding:"9px 11px" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:12 }}>{v.title}</div>
                          <div style={{ fontSize:10, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:280 }}>{v.url}</div>
                        </div>
                        <button style={S.dBtn} onClick={()=>delVid(v.id)}>Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SOCIALS */}
            {adminTab==="socials" && (
              <div>
                <div style={{ fontWeight:700, marginBottom:4, color:C.gold, fontSize:12 }}>MANAGE SOCIAL LINKS</div>
                <div style={{ color:C.muted, fontSize:12, marginBottom:14 }}>Add, edit, or hide your social platforms.</div>
                {sf ? (
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, marginBottom:11 }}>Editing: {sf.icon} {sf.name}</div>
                    <label style={label}>URL</label>
                    <input style={inp2} value={sf.url} onChange={e=>setSf({...sf,url:e.target.value})} placeholder={sf.name==="Gmail"?"mailto:your@gmail.com":"https://…"} />
                    <label style={{ ...label, display:"flex", alignItems:"center", gap:7, marginBottom:13, cursor:"pointer" }}>
                      <input type="checkbox" checked={sf.active!==false} onChange={e=>setSf({...sf,active:e.target.checked})} /> Show on site
                    </label>
                    <div style={{ display:"flex", gap:8 }}>
                      <button style={S.gBtn} onClick={saveSoc}>Save</button>
                      <button style={S.oBtn} onClick={()=>setSf(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  socials.map(s=>(
                    <div key={s.id} style={{ ...S.card, display:"flex", gap:9, alignItems:"center", marginBottom:8, padding:"11px 13px", borderLeft:`3px solid ${s.url&&s.active!==false?s.color:C.cardB}` }}>
                      <span style={{ fontSize:20 }}>{s.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:12 }}>{s.name}</div>
                        <div style={{ fontSize:10, color:s.url?C.muted:C.red, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:280 }}>
                          {s.url || "Not set — click Edit to add URL"}
                        </div>
                      </div>
                      <button style={{ ...S.oBtn, fontSize:11, padding:"6px 11px" }} onClick={()=>setSf({...s})}>Edit</button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── VIDEO PLAYER MODAL ────────────────────────────────────────────────────
  function VideoPlayer() {
    if (!playVideo) return null;
    const vid = ytId(playVideo.url);
    return (
      <div style={S.overlay} onClick={e=>{ if(e.target===e.currentTarget) setPlayVideo(null); }}>
        <div style={{ ...S.modal, maxWidth:700, width:"100%" }}>
          <button style={{ position:"absolute", top:9, right:9, background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer" }} onClick={()=>setPlayVideo(null)}>✕</button>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:11, paddingRight:26 }}>{playVideo.title}</div>
          {vid ? (
            <div style={{ borderRadius:10, overflow:"hidden", aspectRatio:"16/9" }}>
              <iframe src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`}
                      style={{ width:"100%", height:"100%", border:"none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen title={playVideo.title} />
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:30, color:C.muted }}>
              <div style={{ fontSize:28, marginBottom:7 }}>⚠️</div>Invalid YouTube URL
            </div>
          )}
          {playVideo.desc && <div style={{ color:C.muted, fontSize:12, marginTop:10 }}>{playVideo.desc}</div>}
        </div>
      </div>
    );
  }

  // ── ARTICLE READER ────────────────────────────────────────────────────────
  function ArticleReader() {
    if (!readArticle) return null;
    return (
      <div style={S.overlay} onClick={e=>{ if(e.target===e.currentTarget) setReadArticle(null); }}>
        <div style={{ ...S.modal, maxWidth:600, width:"100%" }}>
          <button style={{ position:"absolute", top:9, right:9, background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer" }} onClick={()=>setReadArticle(null)}>✕</button>
          <div style={{ display:"flex", gap:7, marginBottom:11, flexWrap:"wrap" }}>
            <span style={S.tag(C.orange)}>{readArticle.cat}</span>
            {readArticle.premium && <span style={S.tag(C.gold)}>⭐ Premium</span>}
            <span style={{ fontSize:11, color:C.muted }}>{readArticle.date} · {readArticle.readTime}</span>
          </div>
          <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:19, color:C.gold, marginBottom:15, paddingRight:26 }}>{readArticle.title}</h2>
          <div style={{ fontSize:14, color:C.text, lineHeight:1.85, whiteSpace:"pre-wrap" }}>{readArticle.content}</div>
        </div>
      </div>
    );
  }

  // ── ADMIN LOGIN ───────────────────────────────────────────────────────────
  function AdminLogin() {
    return (
      <div style={S.overlay}>
        <div style={{ ...S.modal, maxWidth:320, textAlign:"center" }}>
          <div style={{ fontSize:30, marginBottom:9 }}>⚙️</div>
          <h3 style={{ fontFamily:"'Cinzel',serif", color:C.gold, marginBottom:5 }}>Admin Access</h3>
          <p style={{ color:C.muted, fontSize:12, marginBottom:16 }}>Enter your admin password to manage all content.</p>
          <input style={{ ...S.inp, marginBottom:10, textAlign:"center" }} type="password" placeholder="Password…"
                 value={passInput} onChange={e=>{ setPassInput(e.target.value); setPassErr(false); }}
                 onKeyDown={e=>e.key==="Enter"&&tryLogin()} />
          {passErr && <div style={{ color:C.red, fontSize:12, marginBottom:9 }}>Incorrect password</div>}
          <button style={{ ...S.gBtn, width:"100%", marginBottom:8 }} onClick={tryLogin}>Login</button>
          <button style={{ ...S.oBtn, width:"100%" }} onClick={()=>{ setAdminOpen(false); setPassInput(""); setPassErr(false); }}>Cancel</button>
        </div>
      </div>
    );
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={S.app}>
      <header style={S.hdr}>
        <span style={S.logo} onClick={()=>setSec("home")}>✦ barAngel Nexus</span>
        <nav style={{ display:"flex", gap:2, flexWrap:"wrap" }}>
          {NAV.map(n=>(
            <button key={n.id} style={S.navB(sec===n.id)} onClick={()=>setSec(n.id)}>
              {n.icon} {n.label}
            </button>
          ))}
        </nav>
      </header>

      <main style={S.main}>
        {sec==="home"         && <Home />}
        {sec==="library"      && <Library />}
        {sec==="publications" && <Publications />}
        {sec==="videos"       && <Videos />}
        {sec==="community"    && <Community />}
        {sec==="premium"      && <Premium />}
        {sec==="donate"       && <Donate />}
      </main>

      <footer style={{ borderTop:`1px solid ${C.cardB}`, padding:"16px 14px 68px", textAlign:"center" }}>
        <div style={{ fontFamily:"'Cinzel',serif", color:C.gold, fontSize:13, marginBottom:3 }}>✦ barAngel Nexus</div>
        <div style={{ color:C.muted, fontSize:11, marginBottom:8 }}>© 2026 barAngel · Truth · Science · Engineering · Culture · Faith</div>
        <button style={{ background:"none", border:"none", color:C.cardB, fontSize:11, cursor:"pointer", transition:"color .2s" }}
                onMouseEnter={e=>e.currentTarget.style.color=C.muted}
                onMouseLeave={e=>e.currentTarget.style.color=C.cardB}
                onClick={()=>setAdminOpen(true)}>⚙ Admin</button>
      </footer>

      {/* Mobile Nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, backgroundColor:"#0D0D1A", borderTop:`1px solid ${C.cardB}`, display:"flex", zIndex:100 }}>
        {NAV.map(n=>(
          <button key={n.id} style={{ flex:1, border:"none", backgroundColor:"transparent", color:sec===n.id?C.gold:C.muted, padding:"7px 0", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:1 }} onClick={()=>setSec(n.id)}>
            <span style={{ fontSize:15 }}>{n.icon}</span>
            <span style={{ fontSize:8, textTransform:"uppercase", letterSpacing:.5 }}>{n.label}</span>
          </button>
        ))}
      </div>

      <VideoPlayer />
      <ArticleReader />
      {adminOpen && !adminAuth && <AdminLogin />}
      {adminOpen && adminAuth  && <AdminPanel />}
    </div>
  );
}
