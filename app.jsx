# Let's escape template literals and check matching braces carefully.
react_code = r"""import { useState, useEffect } from "react";

// ── HELPERS ───────────────────────────────────────────────────────────────
function ytId(url) {
  if (!url) return null;
  const pats = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\\/([a-zA-Z0-9_-]{11})/,
    /\\/live\\/([a-zA-Z0-9_-]{11})/,
    /\\/shorts\\/([a-zA-Z0-9_-]{11})/,
    /\\/embed\\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of pats) { const m = url.match(p); if (m) return m[1]; }
  return null;
}

async function loadData(key, def) {
  try {
    const r = localStorage.getItem(key);
    return r ? JSON.parse(r) : def;
  } catch {
    return def;
  }
}

async function saveData(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

const DEF_BOOKS = [
  { id: 1, title: "African Wonder: The Liberation Saga", author: "Wanda barAngel", cat: "Entertainment", cover: "🌍", desc: "An Afrofuturist action epic of liberation and identity.", free: true, link: "" },
  { id: 2, title: "Christ in African Context", author: "barAngel", cat: "Theology", cover: "✝️", desc: "Understanding Jesus through an African theological lens.", free: true, link: "" },
  { id: 3, title: "Engineering the Future", author: "barAngel", cat: "Engineering", cover: "⚙️", desc: "Mechanical principles for African development.", free: true, link: "" },
  { id: 4, title: "The Conscious Universe", author: "barAngel", cat: "Philosophy", cover: "🌌", desc: "Consciousness, identity, and the nature of being.", free: true, link: "" },
];

const DEF_ARTICLES = [
  { id: 1, title: "Why Truth Is Africa's Greatest Resource", cat: "Truth", date: "June 2026", readTime: "8 min", content: "In a continent rich with natural resources, the most undervalued is intellectual honesty — the courage to see clearly and speak plainly about what is real.\n\nTruth-telling requires courage. It requires the willingness to stand alone when necessary, to hold a position not because it is popular but because it is accurate.", premium: false },
  { id: 2, title: "The Physics of Creation", cat: "Theology", date: "June 2026", readTime: "12 min", content: "When we examine the first moments of the cosmos, theology and science converge on the same startling conclusion: that existence itself is not accidental.\n\nThe fine-tuning of universal constants, the arrow of time, the emergence of consciousness from matter — all point toward design.", premium: false },
];

const DEF_SOCIALS = [
  { id: 1, name: "YouTube",   icon: "▶️", color: "#FF0000", url: "https://youtube.com", active: true  },
  { id: 2, name: "TikTok",    icon: "🎵", color: "#69C9D0", url: "https://tiktok.com/@barangel.7", active: true  },
  { id: 3, name: "Gmail",     icon: "📧", color: "#EA4335", url: "mailto:wandabarangel@gmail.com", active: true  },
  { id: 4, name: "Telegram",  icon: "✈️", color: "#229ED9", url: "", active: false },
  { id: 5, name: "WhatsApp",  icon: "💬", color: "#25D366", url: "", active: false },
  { id: 6, name: "Instagram", icon: "📸", color: "#E4405F", url: "", active: false },
];

const CATS_LIB = ["All", "Truth", "Science", "Engineering", "Entertainment", "Philosophy", "Theology", "Culture", "Self-Sustainability"];
const CATS_PUB = ["All", "Truth", "Science", "Engineering", "Theology", "Philosophy", "Culture", "Stories & SciFi", "Self-Sustainability"];
const NAV = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "library", label: "Library", icon: "📚" },
  { id: "publications", label: "Posts", icon: "📝" },
  { id: "videos", label: "Videos", icon: "🎬" },
  { id: "community", label: "Community", icon: "🌍" },
  { id: "premium", label: "Premium", icon: "⭐" },
  { id: "donate", label: "Donate", icon: "❤️" },
];

const C = {
  bg: "#0B0B12", card: "#111120", cardB: "#1E1E35",
  gold: "#D4A017", goldL: "#F0C040", orange: "#E8621A",
  teal: "#2A9D8F", violet: "#1A0A2E", text: "#E8E8E8",
  muted: "#7A7A9A", red: "#E05555",
};

const S = {
  app:   { backgroundColor: C.bg, minHeight: "100vh", fontFamily: "'Inter',sans-serif", color: C.text },
  hdr:   { backgroundColor: "#0D0D1A", borderBottom: `1px solid ${C.cardB}`, padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, position: "sticky", top: 0, zIndex: 100 },
  logo:  { fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 700, color: C.gold, letterSpacing: 2, cursor: "pointer", userSelect: "none" },
  main:  { maxWidth: 1080, margin: "0 auto", padding: "30px 14px 100px" },
  h1:    { fontFamily: "'Cinzel',serif", fontSize: 23, fontWeight: 700, color: C.gold, margin: "0 0 5px" },
  sub:   { color: C.muted, fontSize: 13, marginBottom: 24 },
  card:  { backgroundColor: C.card, border: `1px solid ${C.cardB}`, borderRadius: 12, padding: 15, transition: "transform .2s, border-color .2s" },
  gBtn:  { backgroundColor: C.gold, color: "#0B0B12", border: "none", borderRadius: 8, padding: "9px 17px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif" },
  oBtn:  { backgroundColor: "transparent", color: C.gold, border: `1px solid ${C.gold}`, borderRadius: 8, padding: "9px 17px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  dBtn:  { backgroundColor: "transparent", color: C.red, border: `1px solid ${C.red}`, borderRadius: 8, padding: "6px 11px", fontSize: 11, fontWeight: 600, cursor: "pointer" },
  inp:   { backgroundColor: "#1A1A2E", border: `1px solid ${C.cardB}`, borderRadius: 8, padding: "9px 11px", color: C.text, fontSize: 13, width: "100%", outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" },
  grid:  (min = 200) => ({ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${min}px,1fr))`, gap: 12 }),
  tag:   (col) => ({ backgroundColor: col + "22", color: col, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, display: "inline-block" }),
  catB:  (on) => ({ padding: "5px 12px", borderRadius: 20, border: `1px solid ${on ? C.gold : C.cardB}`, backgroundColor: on ? C.gold + "22" : "transparent", color: on ? C.gold : C.muted, cursor: "pointer", fontSize: 11, fontWeight: 500 }),
  navB:  (on) => ({ padding: "6px 9px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500, backgroundColor: on ? C.gold : "transparent", color: on ? "#0B0B12" : C.muted, transition: "all .2s" }),
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,.88)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 14 },
  modal: { backgroundColor: C.card, border: `1px solid ${C.cardB}`, borderRadius: 16, padding: 24, maxWidth: 460, width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative" },
};

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

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminTab,  setAdminTab]  = useState("books");
  const [passInput, setPassInput] = useState("");
  const [passErr,   setPassErr]   = useState(false);
  const ADMIN_PASS = "barAngel2026";

  useEffect(() => {
    const activeSession = localStorage.getItem("barAngel_session") === "authenticated";
    if (activeSession) {
      setAdminAuth(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const [b, a, v, s] = await Promise.all([
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
    if (passInput === ADMIN_PASS) { 
      setAdminAuth(true); 
      setPassErr(false); 
      setPassInput(""); 
      localStorage.setItem("barAngel_session", "authenticated");
    } else {
      setPassErr(true);
    }
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setAdminOpen(false);
    localStorage.removeItem("barAngel_session");
  };

  const filtBooks = libCat === "All" ? books    : books.filter(b => b.cat === libCat);
  const filtArts  = pubCat === "All" ? articles : articles.filter(a => a.cat === pubCat);
  const activeSocs = socials.filter(s => s.url && s.active !== false);

  if (!loaded) return (
    <div style={{ ...S.app, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Cinzel',serif", color: C.gold, fontSize: 22 }}>✦ barAngel.flix / Nexus</div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>Loading Framework Matrix…</div>
      </div>
    </div>
  );

  function Home() {
    return (
      <div>
        <div style={{ background: `linear-gradient(135deg,#1A0A2E 0%,#0B0B12 55%,#0D1A1A 100%)`, borderRadius: 16, padding: "46px 26px", marginBottom: 30, border: `1px solid ${C.cardB}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 10, right: 24, fontSize: 96, opacity: .05, pointerEvents: "none" }}>✦</div>
          <div style={{ fontSize: 10, color: C.teal, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 11 }}>Where Structural Reality Meets Creation</div>
          <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 38, fontWeight: 700, color: C.gold, lineHeight: 1.15, margin: "0 0 11px" }}>barAngel Nexus</h1>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.75, maxWidth: 540, marginBottom: 22 }}>
            A synchronized ecosystem of truth, physical science, industrial design, engineering design, theology, philosophy, and advanced self-sustainability structures.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={S.gBtn} onClick={() => setSec("library")}>📚 Library</button>
            <button style={S.oBtn} onClick={() => setSec("publications")}>📝 Publications</button>
            <button style={{ ...S.oBtn, borderColor: C.teal, color: C.teal }} onClick={() => setSec("videos")}>🎬 Videos</button>
            <button style={{ ...S.oBtn, borderColor: "#229ED9", color: "#229ED9" }} onClick={() => setSec("community")}>🌍 Community</button>
          </div>
        </div>

        <div style={{ ...S.grid(115), marginBottom: 28 }}>
          {[["📚", books.length, "Books"], ["📝", articles.length, "Articles"], ["🎬", videos.length, "Videos"], ["🌍", "Free", "Access"], ["⭐", "Premium", "Matrix"], ["❤️", "Donate", "Support"]].map(([ic, n, lb]) => (
            <div key={lb} style={{ ...S.card, textAlign: "center", padding: "14px 8px" }}>
              <div style={{ fontSize: 18 }}>{ic}</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 15, fontWeight: 700, color: C.gold, margin: "3px 0 1px" }}>{n}</div>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: .8 }}>{lb}</div>
            </div>
          ))}
        </div>

        {books.length > 0 && (
          <>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, color: C.text, margin: "0 0 11px" }}>✦ Architectural Library Selections</div>
            <div style={{ ...S.grid(185), marginBottom: 26 }}>
              {books.slice(0, 4).map(b => (
                <div key={b.id} style={{ ...S.card, borderLeft: `3px solid ${C.gold}`, cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                  <div style={{ fontSize: 28, marginBottom: 7 }}>{b.cover || "📖"}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{b.title}</div>
                  <div style={S.tag(C.teal)}>{b.cat}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginTop: 7 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  function Library() {
    return (
      <div>
        <h2 style={S.h1}>📚 Core Library Architecture</h2>
        <p style={S.sub}>Books detailing physical mechanics, structural design, existential philosophy, and creative narratives.</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {CATS_LIB.map(c => <button key={c} style={S.catB(libCat === c)} onClick={() => setLibCat(c)}>{c}</button>)}
        </div>
        {filtBooks.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: C.muted }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
            No documents deployed in this classification. Activate Admin configuration to initialize upload.
          </div>
        ) : (
          <div style={S.grid(185)}>
            {filtBooks.map(b => (
              <div key={b.id} style={{ ...S.card, borderTop: `3px solid ${C.gold}` }}>
                <div style={{ fontSize: 42, textAlign: "center", padding: "12px 0", background: `linear-gradient(135deg,${C.violet},#0D0D1A)`, borderRadius: 8, marginBottom: 10 }}>{b.cover || "📖"}</div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{b.title}</div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 7 }}>by {b.author}</div>
                <div style={{ ...S.tag(C.teal), marginBottom: 8 }}>{b.cat}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 10 }}>{b.desc}</div>
                {b.link ? (
                  <a href={b.link} target="_blank" rel="noreferrer" style={{ ...S.gBtn, display: "block", textAlign: "center", textDecoration: "none", padding: "8px 0", fontSize: 12 }}>
                    {b.free !== false ? "Stream Document" : "Get Access"}
                  </a>
                ) : (
                  <button style={{ ...S.gBtn, width: "100%", padding: "8px 0", fontSize: 12, opacity: .55, cursor: "default" }}>Awaiting Manifestation</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function Publications() {
    return (
      <div>
        <h2 style={S.h1}>📝 Structural Publications & Ideas</h2>
        <p style={S.sub}>Essays, research concepts, and systematic breakdowns of advanced theory.</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {CATS_PUB.map(c => <button key={c} style={S.catB(pubCat === c)} onClick={() => setPubCat(c)}>{c}</button>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtArts.map(a => (
            <div key={a.id} style={{ ...S.card, display: "flex", gap: 13, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
                  <span style={S.tag(C.orange)}>{a.cat}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>{a.date} · {a.readTime}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.65 }}>{a.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function Videos() { return <div><h2 style={S.h1}>🎬 Video Feed</h2></div>; }
  function Community() { return <div><h2 style={S.h1}>🌍 Community ports</h2></div>; }
  function Premium() { return <div><h2 style={S.h1}>⭐ Premium Matrix</h2></div>; }
  function Donate() { return <div><h2 style={S.h1}>❤️ Support Project</h2></div>; }

  function AdminPanel() {
    return (
      <div style={S.overlay}>
        <div style={{ backgroundColor: C.card, border: `1px solid ${C.gold}`, borderRadius: 16, width: "100%", maxWidth: 600, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
            <span style={{ color: C.gold, fontWeight: "bold" }}>Admin Matrix Configuration Panel</span>
            <button onClick={() => setAdminOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>✕</button>
          </div>
          <p style={{ fontSize: 12, color: C.muted }}>Device-synchronized structural edits are completely active via localStorage caching loops.</p>
          <button style={S.dBtn} onClick={handleLogout}>Lock Admin Console</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.app}>
      <header style={S.hdr}>
        <span style={S.logo} onClick={() => setSec("home")}>✦ barAngel Nexus</span>
        <nav style={{ display: "flex", gap: 4 }}>
          {NAV.map(n => (
            <button key={n.id} style={S.navB(sec === n.id)} onClick={() => setSec(n.id)}>{n.label}</button>
          ))}
        </nav>
      </header>
      <main style={S.main}>
        {sec === "home" && <Home />}
        {sec === "library" && <Library />}
        {sec === "publications" && <Publications />}
        {sec === "videos" && <Videos />}
        {sec === "community" && <Community />}
        {sec === "premium" && <Premium />}
        {sec === "donate" && <Donate />}
      </main>
      <footer style={{ textAlign: "center", padding: 40, borderTop: `1px solid ${C.cardB}` }}>
        <button onClick={() => setAdminOpen(true)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 11 }}>⚙ System Configuration Authentication</button>
      </footer>
      {adminOpen && !adminAuth && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h3 style={{ color: C.gold, marginBottom: 10 }}>Authentication Route</h3>
            <input type="password" style={S.inp} placeholder="Enter Master Passkey..." value={passInput} onChange={e => setPassInput(e.target.value)} />
            <button style={{ ...S.gBtn, marginTop: 10, width: "100%" }} onClick={tryLogin}>Authenticate Token</button>
            <button style={{ ...S.oBtn, marginTop: 5, width: "100%" }} onClick={() => setAdminOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {adminOpen && adminAuth && <AdminPanel />}
    </div>
  );
}
"""

with open("/mnt/data/barAngel-nexus.jsx", "w", encoding="utf-8") as f:
    f.write(react_code)

print("File written.")

# Let's escape template literals and check matching braces carefully.
react_code = r"""import { useState, useEffect } from "react";

// ── HELPERS ───────────────────────────────────────────────────────────────
function ytId(url) {
  if (!url) return null;
  const pats = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\\/([a-zA-Z0-9_-]{11})/,
    /\\/live\\/([a-zA-Z0-9_-]{11})/,
    /\\/shorts\\/([a-zA-Z0-9_-]{11})/,
    /\\/embed\\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of pats) { const m = url.match(p); if (m) return m[1]; }
  return null;
}

async function loadData(key, def) {
  try {
    const r = localStorage.getItem(key);
    return r ? JSON.parse(r) : def;
  } catch {
    return def;
  }
}

async function saveData(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

const DEF_BOOKS = [
  { id: 1, title: "African Wonder: The Liberation Saga", author: "Wanda barAngel", cat: "Entertainment", cover: "🌍", desc: "An Afrofuturist action epic of liberation and identity.", free: true, link: "" },
  { id: 2, title: "Christ in African Context", author: "barAngel", cat: "Theology", cover: "✝️", desc: "Understanding Jesus through an African theological lens.", free: true, link: "" },
  { id: 3, title: "Engineering the Future", author: "barAngel", cat: "Engineering", cover: "⚙️", desc: "Mechanical principles for African development.", free: true, link: "" },
  { id: 4, title: "The Conscious Universe", author: "barAngel", cat: "Philosophy", cover: "🌌", desc: "Consciousness, identity, and the nature of being.", free: true, link: "" },
];

const DEF_ARTICLES = [
  { id: 1, title: "Why Truth Is Africa's Greatest Resource", cat: "Truth", date: "June 2026", readTime: "8 min", content: "In a continent rich with natural resources, the most undervalued is intellectual honesty — the courage to see clearly and speak plainly about what is real.\n\nTruth-telling requires courage. It requires the willingness to stand alone when necessary, to hold a position not because it is popular but because it is accurate.", premium: false },
  { id: 2, title: "The Physics of Creation", cat: "Theology", date: "June 2026", readTime: "12 min", content: "When we examine the first moments of the cosmos, theology and science converge on the same startling conclusion: that existence itself is not accidental.\n\nThe fine-tuning of universal constants, the arrow of time, the emergence of consciousness from matter — all point toward design.", premium: false },
];

const DEF_SOCIALS = [
  { id: 1, name: "YouTube",   icon: "▶️", color: "#FF0000", url: "https://youtube.com", active: true  },
  { id: 2, name: "TikTok",    icon: "🎵", color: "#69C9D0", url: "https://tiktok.com/@barangel.7", active: true  },
  { id: 3, name: "Gmail",     icon: "📧", color: "#EA4335", url: "mailto:wandabarangel@gmail.com", active: true  },
  { id: 4, name: "Telegram",  icon: "✈️", color: "#229ED9", url: "", active: false },
  { id: 5, name: "WhatsApp",  icon: "💬", color: "#25D366", url: "", active: false },
  { id: 6, name: "Instagram", icon: "📸", color: "#E4405F", url: "", active: false },
];

const CATS_LIB = ["All", "Truth", "Science", "Engineering", "Entertainment", "Philosophy", "Theology", "Culture", "Self-Sustainability"];
const CATS_PUB = ["All", "Truth", "Science", "Engineering", "Theology", "Philosophy", "Culture", "Stories & SciFi", "Self-Sustainability"];
const NAV = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "library", label: "Library", icon: "📚" },
  { id: "publications", label: "Posts", icon: "📝" },
  { id: "videos", label: "Videos", icon: "🎬" },
  { id: "community", label: "Community", icon: "🌍" },
  { id: "premium", label: "Premium", icon: "⭐" },
  { id: "donate", label: "Donate", icon: "❤️" },
];

const C = {
  bg: "#0B0B12", card: "#111120", cardB: "#1E1E35",
  gold: "#D4A017", goldL: "#F0C040", orange: "#E8621A",
  teal: "#2A9D8F", violet: "#1A0A2E", text: "#E8E8E8",
  muted: "#7A7A9A", red: "#E05555",
};

const S = {
  app:   { backgroundColor: C.bg, minHeight: "100vh", fontFamily: "'Inter',sans-serif", color: C.text },
  hdr:   { backgroundColor: "#0D0D1A", borderBottom: `1px solid ${C.cardB}`, padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, position: "sticky", top: 0, zIndex: 100 },
  logo:  { fontFamily: "'Cinzel',serif", fontSize: 17, fontWeight: 700, color: C.gold, letterSpacing: 2, cursor: "pointer", userSelect: "none" },
  main:  { maxWidth: 1080, margin: "0 auto", padding: "30px 14px 100px" },
  h1:    { fontFamily: "'Cinzel',serif", fontSize: 23, fontWeight: 700, color: C.gold, margin: "0 0 5px" },
  sub:   { color: C.muted, fontSize: 13, marginBottom: 24 },
  card:  { backgroundColor: C.card, border: `1px solid ${C.cardB}`, borderRadius: 12, padding: 15, transition: "transform .2s, border-color .2s" },
  gBtn:  { backgroundColor: C.gold, color: "#0B0B12", border: "none", borderRadius: 8, padding: "9px 17px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif" },
  oBtn:  { backgroundColor: "transparent", color: C.gold, border: `1px solid ${C.gold}`, borderRadius: 8, padding: "9px 17px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  dBtn:  { backgroundColor: "transparent", color: C.red, border: `1px solid ${C.red}`, borderRadius: 8, padding: "6px 11px", fontSize: 11, fontWeight: 600, cursor: "pointer" },
  inp:   { backgroundColor: "#1A1A2E", border: `1px solid ${C.cardB}`, borderRadius: 8, padding: "9px 11px", color: C.text, fontSize: 13, width: "100%", outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" },
  grid:  (min = 200) => ({ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${min}px,1fr))`, gap: 12 }),
  tag:   (col) => ({ backgroundColor: col + "22", color: col, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, display: "inline-block" }),
  catB:  (on) => ({ padding: "5px 12px", borderRadius: 20, border: `1px solid ${on ? C.gold : C.cardB}`, backgroundColor: on ? C.gold + "22" : "transparent", color: on ? C.gold : C.muted, cursor: "pointer", fontSize: 11, fontWeight: 500 }),
  navB:  (on) => ({ padding: "6px 9px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500, backgroundColor: on ? C.gold : "transparent", color: on ? "#0B0B12" : C.muted, transition: "all .2s" }),
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,.88)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 14 },
  modal: { backgroundColor: C.card, border: `1px solid ${C.cardB}`, borderRadius: 16, padding: 24, maxWidth: 460, width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative" },
};

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

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminTab,  setAdminTab]  = useState("books");
  const [passInput, setPassInput] = useState("");
  const [passErr,   setPassErr]   = useState(false);
  const ADMIN_PASS = "barAngel2026";

  useEffect(() => {
    const activeSession = localStorage.getItem("barAngel_session") === "authenticated";
    if (activeSession) {
      setAdminAuth(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const [b, a, v, s] = await Promise.all([
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
    if (passInput === ADMIN_PASS) { 
      setAdminAuth(true); 
      setPassErr(false); 
      setPassInput(""); 
      localStorage.setItem("barAngel_session", "authenticated");
    } else {
      setPassErr(true);
    }
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setAdminOpen(false);
    localStorage.removeItem("barAngel_session");
  };

  const filtBooks = libCat === "All" ? books    : books.filter(b => b.cat === libCat);
  const filtArts  = pubCat === "All" ? articles : articles.filter(a => a.cat === pubCat);
  const activeSocs = socials.filter(s => s.url && s.active !== false);

  if (!loaded) return (
    <div style={{ ...S.app, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Cinzel',serif", color: C.gold, fontSize: 22 }}>✦ barAngel.flix / Nexus</div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>Loading Framework Matrix…</div>
      </div>
    </div>
  );

  function Home() {
    return (
      <div>
        <div style={{ background: `linear-gradient(135deg,#1A0A2E 0%,#0B0B12 55%,#0D1A1A 100%)`, borderRadius: 16, padding: "46px 26px", marginBottom: 30, border: `1px solid ${C.cardB}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 10, right: 24, fontSize: 96, opacity: .05, pointerEvents: "none" }}>✦</div>
          <div style={{ fontSize: 10, color: C.teal, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 11 }}>Where Structural Reality Meets Creation</div>
          <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 38, fontWeight: 700, color: C.gold, lineHeight: 1.15, margin: "0 0 11px" }}>barAngel Nexus</h1>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.75, maxWidth: 540, marginBottom: 22 }}>
            A synchronized ecosystem of truth, physical science, industrial design, engineering design, theology, philosophy, and advanced self-sustainability structures.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={S.gBtn} onClick={() => setSec("library")}>📚 Library</button>
            <button style={S.oBtn} onClick={() => setSec("publications")}>📝 Publications</button>
            <button style={{ ...S.oBtn, borderColor: C.teal, color: C.teal }} onClick={() => setSec("videos")}>🎬 Videos</button>
            <button style={{ ...S.oBtn, borderColor: "#229ED9", color: "#229ED9" }} onClick={() => setSec("community")}>🌍 Community</button>
          </div>
        </div>

        <div style={{ ...S.grid(115), marginBottom: 28 }}>
          {[["📚", books.length, "Books"], ["📝", articles.length, "Articles"], ["🎬", videos.length, "Videos"], ["🌍", "Free", "Access"], ["⭐", "Premium", "Matrix"], ["❤️", "Donate", "Support"]].map(([ic, n, lb]) => (
            <div key={lb} style={{ ...S.card, textAlign: "center", padding: "14px 8px" }}>
              <div style={{ fontSize: 18 }}>{ic}</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 15, fontWeight: 700, color: C.gold, margin: "3px 0 1px" }}>{n}</div>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: .8 }}>{lb}</div>
            </div>
          ))}
        </div>

        {books.length > 0 && (
          <>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, color: C.text, margin: "0 0 11px" }}>✦ Architectural Library Selections</div>
            <div style={{ ...S.grid(185), marginBottom: 26 }}>
              {books.slice(0, 4).map(b => (
                <div key={b.id} style={{ ...S.card, borderLeft: `3px solid ${C.gold}`, cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                  <div style={{ fontSize: 28, marginBottom: 7 }}>{b.cover || "📖"}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{b.title}</div>
                  <div style={S.tag(C.teal)}>{b.cat}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginTop: 7 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  function Library() {
    return (
      <div>
        <h2 style={S.h1}>📚 Core Library Architecture</h2>
        <p style={S.sub}>Books detailing physical mechanics, structural design, existential philosophy, and creative narratives.</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {CATS_LIB.map(c => <button key={c} style={S.catB(libCat === c)} onClick={() => setLibCat(c)}>{c}</button>)}
        </div>
        {filtBooks.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: C.muted }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
            No documents deployed in this classification. Activate Admin configuration to initialize upload.
          </div>
        ) : (
          <div style={S.grid(185)}>
            {filtBooks.map(b => (
              <div key={b.id} style={{ ...S.card, borderTop: `3px solid ${C.gold}` }}>
                <div style={{ fontSize: 42, textAlign: "center", padding: "12px 0", background: `linear-gradient(135deg,${C.violet},#0D0D1A)`, borderRadius: 8, marginBottom: 10 }}>{b.cover || "📖"}</div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{b.title}</div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 7 }}>by {b.author}</div>
                <div style={{ ...S.tag(C.teal), marginBottom: 8 }}>{b.cat}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 10 }}>{b.desc}</div>
                {b.link ? (
                  <a href={b.link} target="_blank" rel="noreferrer" style={{ ...S.gBtn, display: "block", textAlign: "center", textDecoration: "none", padding: "8px 0", fontSize: 12 }}>
                    {b.free !== false ? "Stream Document" : "Get Access"}
                  </a>
                ) : (
                  <button style={{ ...S.gBtn, width: "100%", padding: "8px 0", fontSize: 12, opacity: .55, cursor: "default" }}>Awaiting Manifestation</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function Publications() {
    return (
      <div>
        <h2 style={S.h1}>📝 Structural Publications & Ideas</h2>
        <p style={S.sub}>Essays, research concepts, and systematic breakdowns of advanced theory.</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {CATS_PUB.map(c => <button key={c} style={S.catB(pubCat === c)} onClick={() => setPubCat(c)}>{c}</button>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtArts.map(a => (
            <div key={a.id} style={{ ...S.card, display: "flex", gap: 13, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
                  <span style={S.tag(C.orange)}>{a.cat}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>{a.date} · {a.readTime}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.65 }}>{a.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function Videos() { return <div><h2 style={S.h1}>🎬 Video Feed</h2></div>; }
  function Community() { return <div><h2 style={S.h1}>🌍 Community ports</h2></div>; }
  function Premium() { return <div><h2 style={S.h1}>⭐ Premium Matrix</h2></div>; }
  function Donate() { return <div><h2 style={S.h1}>❤️ Support Project</h2></div>; }

  function AdminPanel() {
    return (
      <div style={S.overlay}>
        <div style={{ backgroundColor: C.card, border: `1px solid ${C.gold}`, borderRadius: 16, width: "100%", maxWidth: 600, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
            <span style={{ color: C.gold, fontWeight: "bold" }}>Admin Matrix Configuration Panel</span>
            <button onClick={() => setAdminOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>✕</button>
          </div>
          <p style={{ fontSize: 12, color: C.muted }}>Device-synchronized structural edits are completely active via localStorage caching loops.</p>
          <button style={S.dBtn} onClick={handleLogout}>Lock Admin Console</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.app}>
      <header style={S.hdr}>
        <span style={S.logo} onClick={() => setSec("home")}>✦ barAngel Nexus</span>
        <nav style={{ display: "flex", gap: 4 }}>
          {NAV.map(n => (
            <button key={n.id} style={S.navB(sec === n.id)} onClick={() => setSec(n.id)}>{n.label}</button>
          ))}
        </nav>
      </header>
      <main style={S.main}>
        {sec === "home" && <Home />}
        {sec === "library" && <Library />}
        {sec === "publications" && <Publications />}
        {sec === "videos" && <Videos />}
        {sec === "community" && <Community />}
        {sec === "premium" && <Premium />}
        {sec === "donate" && <Donate />}
      </main>
      <footer style={{ textAlign: "center", padding: 40, borderTop: `1px solid ${C.cardB}` }}>
        <button onClick={() => setAdminOpen(true)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 11 }}>⚙ System Configuration Authentication</button>
      </footer>
      {adminOpen && !adminAuth && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h3 style={{ color: C.gold, marginBottom: 10 }}>Authentication Route</h3>
            <input type="password" style={S.inp} placeholder="Enter Master Passkey..." value={passInput} onChange={e => setPassInput(e.target.value)} />
            <button style={{ ...S.gBtn, marginTop: 10, width: "100%" }} onClick={tryLogin}>Authenticate Token</button>
            <button style={{ ...S.oBtn, marginTop: 5, width: "100%" }} onClick={() => setAdminOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {adminOpen && adminAuth && <AdminPanel />}
    </div>
  );
}
"""

with open("/mnt/data/barAngel-nexus.jsx", "w", encoding="utf-8") as f:
    f.write(react_code)

print("File written.")

