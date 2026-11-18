// src/Pages/Portfolio.jsx
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun, faMoon, faCode, faDownload, faEnvelope, faMobileAlt, faTools,
  faExternalLinkAlt, faBars, faXmark, faRobot, faUsers, faArrowRight,
  faGraduationCap, faCheckCircle, faBriefcase, faFire, faDatabase,
  faPlug, faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp, faGithub, faLinkedin, faReact, faAndroid, faJava, faNodeJs,
  faGitAlt, faPython, faJs, faMicrosoft,
} from "@fortawesome/free-brands-svg-icons";
import TechStrip from "../components/TechStrip.jsx";
import CVSection from "../components/CVSection.jsx";

/* ---------- 3D tech network data (static, computed once) — UNCHANGED ---------- */
const TECH = [
  { n: "React", i: faReact }, { n: "Kotlin", t: "K" }, { n: "Java", i: faJava },
  { n: "Android", i: faAndroid }, { n: "React Native", i: faMobileAlt },
  { n: "TypeScript", t: "TS" }, { n: "Node.js", i: faNodeJs }, { n: ".NET", i: faMicrosoft },
  { n: "Firebase", i: faFire }, { n: "Python", i: faPython }, { n: "Git", i: faGitAlt },
  { n: "Oracle", i: faDatabase }, { n: "JavaScript", i: faJs }, { n: "REST APIs", i: faPlug },
];
const N = 76;
const NODES = Array.from({ length: N }, (_, i) => {
  const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = i * 2.39996;
  return { x: Math.cos(t) * r, y, z: Math.sin(t) * r };
});
const TILE_IDX = TECH.map((_, k) => Math.floor((k * N) / TECH.length) + 2);
const EDGES = [];
for (let i = 0; i < N; i++)
  for (let j = i + 1; j < N; j++) {
    const a = NODES[i], b = NODES[j];
    if (Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < 0.52) EDGES.push([i, j]);
  }

const SKILLS = [
  ["Java", 95], ["Kotlin", 90], ["Android", 90], ["React Native", 85], ["React.js", 85],
  ["Firebase", 85], ["ASP.NET Core", 82], ["MySQL / SQLite", 80], ["TypeScript", 80],
];

/* ---------- Projects ----------
   apk  = direct download link (shows "Download APK")
   live = website link (shows "Live site"). Leave "" until you have the URL —
          the button is hidden automatically when empty.                      */
const drive = (id) => `https://drive.usercontent.google.com/download?id=${id}&export=download`;

const MOBILE_APPS = [
  { mono: "CM", cat: "Mobile app", title: "Crypto Market Analysis", desc: "Real-time crypto data, AI price predictions, communities, watchlist and demo trading.", tech: ["React Native", "TypeScript", "Python", "TensorFlow"], github: "https://github.com/ahsan589/react-native-crypto-market-analysis", apk: drive("1Ks9RTwb2tq2cp4ulKa2chsi8IGHF-qNh") },
  { mono: "PS", cat: "Mobile app", title: "PlaySpot", desc: "Role-based booking for players, owners and admins with Google Maps and payment proof uploads.", tech: ["React Native", "Firebase", "Google Maps"], github: "https://github.com/ahsan589/PlaySpot---Smart-Sports-Gaming-Ground-Booking-App", apk: drive("1aDT8gbbk2LJVrZ4UslRpP68aDf6rpE4Y") },
  { mono: "PC", cat: "Mobile app", title: "PrintCatalog", desc: "Digital catalog app for printing businesses with Admin and User roles.", tech: ["React Native", "Firebase"], github: "https://github.com/ahsan589/Printify-Hub", apk: drive("1OjX5DXgb8tPzvoWV2iSgxEkvLBAycmsT"), isNew: true },
  { mono: "MT", cat: "Mobile app", title: "MoodTunes", desc: "Detects your mood from your face and recommends songs through the Deezer API.", tech: ["React Native", "OpenCV", "TF Lite"], github: "https://github.com/ahsan589/MoodTunes-App", apk: "" },
  { mono: "JC", cat: "Mobile app", title: "JobConnect", desc: "Job portal with auth, search filters, job posting and application tracking.", tech: ["React Native", "Expo", "Firebase"], github: "https://github.com/ahsan589/Job-Portal-Mobile-App", apk: "" },
  { mono: "NR", cat: "Android", title: "News Reader App", desc: "Jetpack Compose news app with MVVM, DataStore favorites and Lottie animations.", tech: ["Kotlin", "Compose", "Retrofit"], github: "https://github.com/ahsan589/News-Reader-app", apk: "" },
  { mono: "CA", cat: "Android", title: "Crypto Market App", desc: "Native Android cryptocurrency tracker with real-time APIs and Material Design.", tech: ["Java", "REST APIs", "Material"], github: "https://github.com/ahsan589/cryptomarket-android-app", apk: "" },
  { mono: "UR", cat: "Android", title: "Urdu Speech to Text", desc: "Converts Urdu audio and video to text with automatic audio extraction.", tech: ["Java", "FFmpeg", "Speech API"], github: "https://github.com/ahsan589/UrduSpeechtotext", apk: "" },
];

const WEB_APPS = [
  { mono: "GB", cat: "Enterprise web", title: "GBTI Credit Portal", desc: "ASP.NET Core portal for credit data: extraction, processing, analytics, interactive dashboards and integrations with CIB, Datacheck and Tasdeeq services.", tech: ["ASP.NET Core", "Dashboards", "REST APIs", "Oracle"], github: "https://github.com/ahsan589/GBTI-Credit-Portal-.net-core", live: "", isNew: true, featured: true },
  { mono: "FM", cat: "Web app", title: "Fee Management System", desc: "Admissions, fee challans and financial reports with role-based access for Admin and Accountant.", tech: ["React 19", "MUI", "Firebase", "Chart.js"], github: "https://github.com/ahsan589/fee_management_system", live: "" },
  { mono: "PW", cat: "Web app", title: "PrintCatalog Website", desc: "React storefront showing cards, mugs, shirts and custom bundles.", tech: ["React", "Firebase"], github: "https://github.com/ahsan589/Printify-Hub", live: "", isNew: true },
  { mono: "DW", cat: "Web app", title: "DreamWeaver", desc: "Dream journal with mood tracking, tagging and Chart.js analysis.", tech: ["React", "Chart.js"], github: "https://github.com/ahsan589/DreamWeaver-dream-journal-analyzer", live: "" },
  { mono: "CP", cat: "AI backend", title: "Crypto Price Predictor", desc: "Flask REST API with an LSTM model for price forecasts, risk scores and recommendations.", tech: ["Flask", "TensorFlow", "Keras"], github: "https://github.com/ahsan589/AI-Based-Cryptocurrency-Price-Predictor", live: "" },
];

const SERVICES = [
  { icon: faAndroid, title: "Android Development", desc: "Native Android apps with Java or Kotlin, Material Design and Firebase." },
  { icon: faMobileAlt, title: "React Native", desc: "Cross-platform apps with TypeScript, Expo and native performance." },
  { icon: faReact, title: "Web Development", desc: "React.js applications with clean architecture and responsive UI." },
  { icon: faUsers, title: "Web Portals", desc: "ASP.NET Core role-based portals with reporting and enterprise integrations." },
  { icon: faTools, title: "Maintenance and Support", desc: "Bug fixes, performance optimization and ongoing feature work." },
];

const EXPERIENCE = [
  {
    date: "Dec 2025 – present", role: "Software Engineer", org: "NRSP, Islamabad",
    pts: ["Develop mobile apps, ASP.NET Core MVC portals and REST APIs for field monitoring operations", "Integrate Oracle-backed workflows and reporting into enterprise applications", "Work with on-site teams to ship stable updates"],
  },
  {
    date: "Jul 2025 – Nov 2025", role: "Mobile Application Developer Intern", org: "THE NIXUS Pvt Ltd (NASTP), Rawalpindi",
    pts: ["Built and maintained mobile applications", "Testing, debugging and performance work", "Code reviews, documentation and agile delivery"],
  },
];

const NAV = [
  ["About", "about"], ["Experience", "experience"], ["CV", "cv"], ["Mobile apps", "mobile"],
  ["Web apps", "web"], ["Services", "services"], ["Contact", "contact"],
];

const WA = "https://wa.me/923213486272";
const CV = "/Ahsan_Hajvari_CV%20(1).pdf";
const REDUCE = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ---------- Card hover FX: cursor spotlight + soft 3D tilt (mouse/pen only) ---------- */
const cardMove = (e) => {
  if (e.pointerType === "touch") return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${y}px`);
  if (!REDUCE) {
    el.style.setProperty("--rx", `${((y / r.height) - 0.5) * -5}deg`);
    el.style.setProperty("--ry", `${((x / r.width) - 0.5) * 5}deg`);
  }
};
const cardLeave = (e) => {
  const el = e.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
};
const fx = { onPointerMove: cardMove, onPointerLeave: cardLeave };

function Section({ id, label, title, sub, alt, children }) {
  return (
    <section id={id} className={`band ${alt ? "alt" : ""}`}>
      <div className="wrap">
        <header className="sec-head reveal">
          <span className="tag">{label}</span>
          <h2>{title}</h2>
          {sub && <p className="sub">{sub}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

function ProjectCard({ p, i }) {
  const primary = p.apk
    ? { href: p.apk, label: "Download APK", icon: faDownload, dl: true }
    : p.live
    ? { href: p.live, label: "Live site", icon: faGlobe }
    : null;
  return (
    <article
      className={`card pc reveal ${p.featured ? "wide" : ""}`}
      style={{ transitionDelay: `${(i % 3) * 70}ms` }}
      {...fx}
    >
      <div className="pc-top">
        <div className="mono-ico">{p.mono}</div>
        <div className="pc-tags">
          {p.isNew && <span className="new">NEW</span>}
          <span className="meta">{p.cat}</span>
        </div>
      </div>
      <h3>{p.title}</h3>
      <p>{p.desc}</p>
      {p.featured && (
        <div className="viz" aria-hidden="true">
          {[40, 65, 50, 85, 60, 95, 75, 55, 80].map((h, k) => <i key={k} style={{ height: `${h}%`, animationDelay: `${k * 60}ms` }} />)}
        </div>
      )}
      <div className="chips">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>
      <div className="pf">
        <a className="lb" href={p.github} target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faGithub} /> GitHub
        </a>
        {primary ? (
          <a className="lb solid" href={primary.href} target={primary.dl ? undefined : "_blank"} rel="noreferrer" download={primary.dl ? true : undefined}>
            <FontAwesomeIcon icon={primary.icon} /> {primary.label}
          </a>
        ) : (
          <a className="lb solid" href={`${WA}?text=${encodeURIComponent(`Hi Ahsan! Interested in ${p.title}`)}`} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} /> Discuss
          </a>
        )}
        {primary && p.live && p.apk && (
          <a className="lb" href={p.live} target="_blank" rel="noreferrer" aria-label="Live site"><FontAwesomeIcon icon={faExternalLinkAlt} /></a>
        )}
      </div>
    </article>
  );
}

function Portfolio() {
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [hoverName, setHoverName] = useState("");
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const tileEls = useRef([]);
  const hoverRef = useRef(-1);
  const colRef = useRef({ fg: "#DCE2F0", mut: "#50586C" });

  /* theme + canvas colours */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const s = getComputedStyle(document.documentElement);
    colRef.current = { fg: s.getPropertyValue("--fg").trim(), mut: s.getPropertyValue("--slate").trim() };
  }, [theme]);

  useEffect(() => {
    if (!certOpen) return;
    const esc = (e) => e.key === "Escape" && setCertOpen(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [certOpen]);

  /* scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll(".portfolio .reveal");
    if (REDUCE || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ---------- 3D rotating tech network — UNCHANGED ---------- */
  useEffect(() => {
    const cv = canvasRef.current, stage = stageRef.current, ctx = cv.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf, ry = 0, rx = 0.25, vy = 0, tx = 0.25, drag = false, lx = 0, tm = 0;
    const pulses = [], P = [];

    const size = () => {
      const r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height; cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    const ro = new ResizeObserver(size);
    ro.observe(cv); size();

    const down = (e) => { drag = true; lx = e.clientX; stage.setPointerCapture?.(e.pointerId); };
    const up = () => { drag = false; };
    const move = (e) => {
      const r = stage.getBoundingClientRect();
      if (drag) { vy = (e.clientX - lx) * 0.004; ry += vy; lx = e.clientX; }
      tx = 0.25 + ((e.clientY - r.top) / r.height - 0.5) * 0.6;
    };
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointermove", move);

    const rot = (n) => {
      const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      const x1 = n.x * cy + n.z * sy, z1 = -n.x * sy + n.z * cy;
      return [x1, n.y * cx - z1 * sx, n.y * sx + z1 * cx];
    };
    const ring = (fn, R) => {
      ctx.beginPath();
      for (let k = 0; k <= 96; k++) {
        const [x, y, z] = rot(fn((k / 96) * Math.PI * 2)), p = 1 + z * 0.28;
        const px = W / 2 + x * R * p * 1.1, py = H / 2 + y * R * p * 1.1;
        k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.stroke();
    };

    const frame = () => {
      tm++;
      const { fg, mut } = colRef.current, hover = hoverRef.current;
      if (!reduce) { if (!drag) { vy *= 0.94; ry += 0.0035 + vy; } rx += (tx - rx) * 0.05; }
      ctx.clearRect(0, 0, W, H);
      const R = Math.min(W, H) * 0.34;
      NODES.forEach((n, i) => {
        const [x, y, z] = rot(n), p = 1 + z * 0.28;
        P[i] = { x: W / 2 + x * R * p, y: H / 2 + y * R * p, z, p };
      });
      ctx.lineWidth = 1; ctx.strokeStyle = mut; ctx.globalAlpha = 0.6;
      ctx.setLineDash([3, 7]); ctx.lineDashOffset = -tm * 0.3;
      ring((a) => ({ x: Math.cos(a), y: 0, z: Math.sin(a) }), R);
      ring((a) => ({ x: Math.cos(a), y: Math.sin(a), z: 0 }), R);
      ring((a) => ({ x: 0, y: Math.cos(a), z: Math.sin(a) }), R);
      ctx.setLineDash([]);
      EDGES.forEach(([a, b]) => {
        const A = P[a], B = P[b], lit = hover === a || hover === b;
        ctx.globalAlpha = lit ? 0.95 : 0.1 + (0.3 * ((A.z + B.z) / 2 + 1)) / 2;
        ctx.strokeStyle = lit ? fg : mut;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      });
      if (!reduce && Math.random() < 0.2)
        pulses.push({ e: EDGES[(Math.random() * EDGES.length) | 0], t: 0, s: 0.02 + Math.random() * 0.02, r: Math.random() < 0.5 });
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]; p.t += p.s;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        const A = P[p.e[0]], B = P[p.e[1]], t = p.r ? 1 - p.t : p.t;
        const x = A.x + (B.x - A.x) * t, y = A.y + (B.y - A.y) * t;
        ctx.globalAlpha = 0.9 * (1 - Math.abs(p.t - 0.5) * 1.2); ctx.fillStyle = fg;
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 7); ctx.fill();
        ctx.globalAlpha *= 0.25; ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill();
      }
      const tiled = new Set(TILE_IDX);
      NODES.forEach((_, i) => {
        if (tiled.has(i)) return;
        const o = P[i];
        ctx.globalAlpha = 0.25 + (0.5 * (o.z + 1)) / 2; ctx.fillStyle = fg;
        ctx.beginPath(); ctx.arc(o.x, o.y, 1.6 * o.p, 0, 7); ctx.fill();
      });
      TILE_IDX.forEach((idx, k) => {
        const el = tileEls.current[k], o = P[idx];
        if (!el) return;
        el.style.transform = `translate(${o.x}px,${o.y}px) translate(-50%,-50%) scale(${(o.p * (idx === hover ? 1.2 : 1)).toFixed(3)})`;
        el.style.opacity = (0.45 + (0.55 * (o.z + 1)) / 2).toFixed(2);
        el.style.zIndex = o.z >= 0 ? 20 + Math.round(o.z * 10) : 5;
        el.style.filter = o.z < -0.45 ? "blur(1.2px)" : "none";
        el.classList.toggle("on", idx === hover);
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointermove", move);
    };
  }, []);

  const goAIChat = () => {
    window.location.hash = "#/ai-chat";
    setMenuOpen(false);
  };

  const wa = (text) => `${WA}?text=${encodeURIComponent(text)}`;

  return (
    <div className="portfolio">
      <div className="bg-grid" aria-hidden="true" />

      {/* Floating nav */}
      <div className="wrap navwrap">
        <nav className="nav">
          <a href="#" className="logo"><span className="mark">AH</span><span className="logo-name">Ahsan Hajvari</span></a>
          <div className={`links ${menuOpen ? "open" : ""}`}>
            {NAV.map(([n, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{n}</a>
            ))}
            <a href="#/ai-chat" onClick={(e) => { e.preventDefault(); goAIChat(); }}>AI Chat</a>
          </div>
          <div className="acts">
            <button className="ib" onClick={goAIChat} aria-label="AI Chat"><FontAwesomeIcon icon={faRobot} /></button>
            <button className="ib" onClick={() => setTheme((p) => (p === "dark" ? "light" : "dark"))} aria-label="Toggle theme">
              <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
            </button>
            <a className="ib hi" href={WA} target="_blank" rel="noreferrer" aria-label="WhatsApp"><FontAwesomeIcon icon={faWhatsapp} /></a>
            <button className="ib menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
            </button>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <section className="hero wrap">
        <div>
          <div className="status"><i />Open to remote projects from Pakistan</div>
          <h1>Ahsan Hajvari<em>Mobile and software developer</em></h1>
          <p className="lead">
            I build Android, React Native, React.js and ASP.NET Core products, from crypto
            trackers to credit-data portals running at a bank.
          </p>
          <div className="btns">
            <a href="#mobile" className="btn p">View projects <FontAwesomeIcon icon={faArrowRight} /></a>
            <a href="#contact" className="btn">Hire me</a>
            <a href={CV} download="Ahsan_Hajvari_CV.pdf" className="btn">
              <FontAwesomeIcon icon={faDownload} /> CV
            </a>
          </div>
          <div className="stats">
            <div><b>12</b>shipped projects</div>
            <div><b>3.66</b>GPA, BS IT</div>
            <div><b>2</b>industry roles</div>
          </div>
        </div>

        <div className="stage" ref={stageRef}>
          <div className="halo" />
          <canvas ref={canvasRef} />
          <div className="core"><FontAwesomeIcon icon={faCode} /></div>
          {TECH.map((t, k) => (
            <div
              key={t.n}
              className="tile"
              data-n={t.n}
              ref={(el) => (tileEls.current[k] = el)}
              onPointerEnter={() => { hoverRef.current = TILE_IDX[k]; setHoverName(t.n); }}
              onPointerLeave={() => { hoverRef.current = -1; setHoverName(""); }}
            >
              {t.i ? <FontAwesomeIcon icon={t.i} /> : <b>{t.t}</b>}
            </div>
          ))}
          <div className="hud" style={{ left: "4%", bottom: "3%" }}>drag to rotate</div>
          <div className="hud" style={{ right: "4%", bottom: "3%" }}>
            {hoverName ? <>focus <b>{hoverName}</b></> : "hover an icon"}
          </div>
        </div>
      </section>

      {/* Animated tech stack grid (replaces the old sliding marquee) */}
      <TechStrip />

      {/* About */}
      <Section id="about" label="About" title="About me" sub="Mobile, web and enterprise software, built to last.">
        <div className="two">
          <div className="card reveal" {...fx}>
            <div className="about-top">
              <img src="/w.jpeg" alt="Ahsan Hajvari" />
              <div>
                <h3>Information Technology graduate</h3>
                <p>
                  Skilled in software, mobile and web development, databases and cloud. Experienced
                  in React Native, Android (Java/Kotlin), ASP.NET Core and Firebase, and learning AI
                  and cybersecurity to build smart, reliable solutions.
                </p>
              </div>
            </div>
            <div className="social">
              <a href="https://github.com/ahsan589" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faGithub} /> GitHub</a>
              <a href="https://www.linkedin.com/in/ahsan-hajvari-934527366" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedin} /> LinkedIn</a>
            </div>
          </div>
          <div className="card reveal" style={{ transitionDelay: "80ms" }} {...fx}>
            <h3>Skills</h3>
            <div className="skills">
              {SKILLS.map(([name, pct], i) => (
                <div key={name}>
                  <div className="sk"><span>{name}</span><span>{pct}%</span></div>
                  <div className="bar"><u style={{ width: `${pct}%`, animationDelay: `${i * 80}ms` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Experience */}
      <Section id="experience" alt label="Experience" title="Where I’ve worked" sub="Two industry roles since 2025.">
        <div className="two">
          {EXPERIENCE.map((x, i) => (
            <div className="card reveal" key={x.role} style={{ transitionDelay: `${i * 80}ms` }} {...fx}>
              <div className="ico"><FontAwesomeIcon icon={faBriefcase} /></div>
              <div className="tl">
                <div className="meta">{x.date}</div>
                <strong>{x.role}</strong>
                <p>{x.org}</p>
                <ul>{x.pts.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Education */}
      <Section id="education" label="Education" title="Education and certifications" sub="Degree, conference and training.">
        <div className="grid3">
          <div className="card reveal" {...fx}>
            <div className="ico"><FontAwesomeIcon icon={faGraduationCap} /></div>
            <h3>BS Information Technology</h3>
            <div className="meta">University of Education, Lahore · 2021 – 2025</div>
            <p>GPA 3.66 · EQF level 6</p>
          </div>
          <div className="card reveal" style={{ transitionDelay: "70ms" }} {...fx}>
            <div className="ico"><FontAwesomeIcon icon={faUsers} /></div>
            <h3>RACSIT-2024</h3>
            <div className="meta">Mar 2024 · University of Education, Lahore</div>
            <p>2nd International Conference on Recent Advances in Computer Science and IT. Poster presentation sessions.</p>
          </div>
          <div className="card clickable reveal" role="button" tabIndex={0} style={{ transitionDelay: "140ms" }} {...fx}
            onClick={() => setCertOpen(true)}
            onKeyDown={(e) => e.key === "Enter" && setCertOpen(true)}>
            <div className="ico"><FontAwesomeIcon icon={faCheckCircle} /></div>
            <h3>Generative AI Training</h3>
            <div className="meta">Pak Angels – HEC · Top Performer</div>
            <p>Professional certification. Click to preview the certificate.</p>
          </div>
        </div>
      </Section>

      {/* CV: live-typed document */}
      <CVSection cv={CV} />

      {certOpen && (
        <div className="modal-backdrop" onClick={() => setCertOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCertOpen(false)} aria-label="Close"><FontAwesomeIcon icon={faXmark} /></button>
            <img src="/cer.jpeg" alt="Certificate" />
          </div>
        </div>
      )}

      {/* Mobile apps */}
      <Section id="mobile" alt label="Mobile apps" title="Mobile apps" sub="Android and React Native apps. Download the APK or browse the code.">
        <div className="grid3">
          {MOBILE_APPS.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
        </div>
      </Section>

      {/* Web apps */}
      <Section id="web" label="Web apps" title="Web and enterprise apps" sub="Websites and portals. Open the live site or browse the code.">
        <div className="grid3">
          {WEB_APPS.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
        </div>
        <div className="center">
          <a href="https://github.com/ahsan589" target="_blank" rel="noreferrer" className="btn">
            <FontAwesomeIcon icon={faGithub} /> View all on GitHub
          </a>
        </div>
      </Section>

      {/* Services */}
      <Section id="services" alt label="Services" title="What I offer" sub="Pick a service and send a message.">
        <div className="grid3">
          {SERVICES.map((s, i) => (
            <div className="card reveal" key={s.title} style={{ transitionDelay: `${(i % 3) * 70}ms` }} {...fx}>
              <div className="ico"><FontAwesomeIcon icon={s.icon} /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" label="Contact" title="Let’s work together" sub="Available for freelance work and collaborations worldwide.">
        <div className="grid4">
          {[
            [faWhatsapp, "WhatsApp", "+92 321 3486272", WA],
            [faEnvelope, "Email", "ahsam72642@gmail.com", "mailto:ahsam72642@gmail.com"],
            [faLinkedin, "LinkedIn", "Ahsan Hajvari", "https://www.linkedin.com/in/ahsan-hajvari-934527366"],
            [faGithub, "GitHub", "ahsan589", "https://github.com/ahsan589"],
          ].map(([icon, title, text, href], i) => (
            <a key={title} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
              className="card contact reveal" style={{ transitionDelay: `${i * 60}ms` }} {...fx}>
              <div className="ico"><FontAwesomeIcon icon={icon} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </a>
          ))}
        </div>
        <div className="cta reveal">
          <h2>Ready to start?</h2>
          <div className="btns" style={{ justifyContent: "center" }}>
            <a href={wa("Hi Ahsan! I have a project.")} target="_blank" rel="noreferrer" className="btn">
              <FontAwesomeIcon icon={faWhatsapp} /> Get a free quote
            </a>
            <a href={CV} download className="btn">
              <FontAwesomeIcon icon={faDownload} /> Download CV
            </a>
          </div>
        </div>
      </Section>

      <footer>
        <div className="wrap foot">
          <span className="logo"><span className="mark">AH</span>Ahsan Hajvari · Mobile and software developer</span>
          <p>© {new Date().getFullYear()} Ahsan Hajvari. All rights reserved.</p>
        </div>
      </footer>

      <style jsx="true">{`
        html { scroll-behavior: smooth; scroll-padding-top: 90px; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .portfolio { font-family: "Inter", system-ui, sans-serif; background: var(--bg); color: var(--fg); line-height: 1.6; overflow-x: hidden; min-height: 100vh; transition: background .4s, color .4s; }
        .portfolio a { color: inherit; text-decoration: none; }
        .portfolio button { font: inherit; color: inherit; cursor: pointer; }
        .portfolio a:focus-visible, .portfolio button:focus-visible, .card:focus-visible { outline: 2px solid var(--fg); outline-offset: 3px; }
        .wrap { max-width: 1160px; margin: 0 auto; padding: 0 1.5rem; position: relative; }
        .bg-grid { position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
          background-size: 44px 44px;
          -webkit-mask-image: radial-gradient(ellipse 80% 55% at 70% 25%, #000, transparent 75%);
          mask-image: radial-gradient(ellipse 80% 55% at 70% 25%, #000, transparent 75%); }

        /* Nav */
        .navwrap { position: sticky; top: 12px; z-index: 100; max-width: 1100px; padding: 0 1rem; margin-top: 12px; }
        .nav { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .55rem .6rem .55rem 1rem; border: 1px solid var(--line); border-radius: 999px; background: var(--tile); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); position: relative; }
        .logo { display: flex; align-items: center; gap: .6rem; font-weight: 600; font-size: .95rem; }
        .mark { width: 32px; height: 32px; border-radius: 50%; background: var(--accent); color: var(--on); display: grid; place-items: center; font-weight: 800; font-size: .75rem; flex-shrink: 0; }
        .links { display: none; gap: .2rem; font-size: .88rem; color: var(--muted); }
        .links a { padding: .45rem .85rem; border-radius: 999px; transition: background .2s, color .2s; }
        .links a:hover { background: var(--surface); color: var(--fg); }
        .links.open { display: flex; flex-direction: column; position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: var(--solid); border: 1px solid var(--line); border-radius: 22px; padding: .6rem; }
        .links.open a { padding: .75rem 1rem; }
        @media (min-width: 900px) { .links { display: flex; } .menu-btn { display: none !important; } }
        @media (max-width: 480px) { .logo-name { display: none; } }
        .acts { display: flex; gap: .4rem; }
        .ib { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--line); background: transparent; display: grid; place-items: center; transition: background .2s, transform .2s; }
        .ib:hover { background: var(--surface); transform: translateY(-1px); }
        .ib.hi { background: var(--accent); color: var(--on) !important; border-color: transparent; }

        /* Hero */
        .hero { display: grid; gap: 1rem; align-items: center; padding: 3rem 1.5rem 4rem; z-index: 2; }
        @media (min-width: 960px) { .hero { grid-template-columns: 1fr 1.15fr; min-height: calc(100vh - 90px); } }
        .status { display: inline-flex; align-items: center; gap: .55rem; border: 1px solid var(--line); background: var(--surface); border-radius: 999px; padding: .35rem .9rem; font-size: .82rem; color: var(--muted); margin-bottom: 1.4rem; }
        .status i { width: 8px; height: 8px; border-radius: 50%; background: var(--fg); animation: blink 2s infinite; }
        @keyframes blink { 50% { opacity: .25; } }
        .hero h1 { font-size: clamp(2.8rem, 6.5vw, 4.8rem); font-weight: 800; letter-spacing: -.05em; line-height: 1; }
        .hero h1 em { display: block; font-style: normal; font-weight: 500; color: var(--muted); font-size: .42em; letter-spacing: -.02em; margin-top: .9rem; }
        .lead { color: var(--muted); max-width: 30rem; margin: 1.3rem 0 2rem; font-size: 1.05rem; }
        .btns { display: flex; flex-wrap: wrap; gap: .7rem; }
        .btn { border-radius: 999px; min-height: 48px; padding: 0 1.5rem; font-weight: 600; font-size: .95rem; border: 1px solid var(--line); background: var(--surface); display: inline-flex; gap: .5rem; align-items: center; transition: transform .2s, border-color .2s; }
        .btn:hover { transform: translateY(-2px); border-color: var(--fg); }
        .btn.p { background: var(--accent); color: var(--on) !important; border-color: transparent; }
        .stats { display: flex; gap: 2.2rem; margin-top: 2.4rem; color: var(--muted); font-size: .85rem; flex-wrap: wrap; }
        .stats b { display: block; font-size: 1.7rem; color: var(--fg); letter-spacing: -.03em; }

        /* 3D stage — UNCHANGED */
        .stage { position: relative; aspect-ratio: 1/1; width: 100%; max-width: 620px; margin: 0 auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; }
        .halo { position: absolute; inset: 6%; border-radius: 50%; background: radial-gradient(circle, rgba(80,88,108,.55), transparent 68%); filter: blur(10px); }
        [data-theme="light"] .halo { background: radial-gradient(circle, rgba(80,88,108,.28), transparent 68%); }
        .stage canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; cursor: grab; }
        .stage canvas:active { cursor: grabbing; }
        .tile { position: absolute; left: 0; top: 0; width: 54px; height: 54px; border-radius: 16px; display: grid; place-items: center; font-size: 1.55rem; background: var(--tile); border: 1px solid var(--line); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 0 10px 30px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.12); will-change: transform; cursor: pointer; color: var(--fg); }
        .tile b { font: 800 1.05rem "Inter", sans-serif; letter-spacing: -.04em; }
        .tile.on { border-color: var(--fg); box-shadow: 0 0 0 4px var(--line), 0 14px 40px rgba(0,0,0,.35); }
        .tile::after { content: attr(data-n); position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: var(--accent); color: var(--on); font: 500 .68rem "JetBrains Mono", monospace; padding: .2rem .55rem; border-radius: 7px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .15s; }
        .tile.on::after { opacity: 1; }
        .core { position: absolute; left: 50%; top: 50%; width: 84px; height: 84px; margin: -42px; border-radius: 50%; background: var(--accent); color: var(--on); display: grid; place-items: center; font-size: 1.7rem; z-index: 10; box-shadow: 0 0 60px rgba(220,226,240,.28); }
        [data-theme="light"] .core { box-shadow: 0 0 50px rgba(80,88,108,.4); }
        .core::before, .core::after { content: ""; position: absolute; border-radius: 50%; border: 1.5px solid var(--fg); opacity: .5; }
        .core::before { inset: -12px; border-style: dashed; animation: spin 14s linear infinite; }
        .core::after { inset: -26px; opacity: .25; border-style: dotted; animation: spin 22s linear infinite reverse; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .hud { position: absolute; font: 500 .72rem "JetBrains Mono", monospace; color: var(--muted); pointer-events: none; z-index: 30; }
        .hud b { color: var(--fg); font-weight: 500; }
        @media (max-width: 520px) {
          .tile { width: 44px; height: 44px; font-size: 1.25rem; border-radius: 13px; }
          .core { width: 64px; height: 64px; margin: -32px; font-size: 1.3rem; }
        }

        /* Section bands: every section is its own block */
        .band { position: relative; z-index: 2; padding: 5.5rem 0; border-top: 1px solid var(--line); background: var(--bg); }
        .band.alt { background: color-mix(in srgb, var(--fg) 3%, var(--bg)); }
        @media (max-width: 700px) { .band { padding: 3.5rem 0; } }
        .sec-head { margin-bottom: 2.2rem; }
        .tag { display: inline-block; border: 1px solid var(--line); border-radius: 999px; padding: .2rem .9rem; font: 500 .74rem "JetBrains Mono", monospace; color: var(--muted); margin-bottom: .9rem; }
        .band h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); letter-spacing: -.04em; line-height: 1.1; margin-bottom: .6rem; }
        .sub { color: var(--muted); max-width: 36rem; }
        .center { text-align: center; margin-top: 2.2rem; }

        /* Grids */
        .two, .grid3, .grid4 { display: grid; gap: 1.2rem; grid-template-columns: 1fr; }
        @media (min-width: 700px) { .grid3, .grid4 { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 900px) {
          .two { grid-template-columns: 1fr 1fr; }
          .grid3 { grid-template-columns: repeat(3, 1fr); }
          .grid4 { grid-template-columns: repeat(4, 1fr); }
          .pc.wide { grid-column: span 2; }
        }

        /* Cards + hover animation */
        .card { --mx: 50%; --my: 0%; --rx: 0deg; --ry: 0deg;
          position: relative; overflow: hidden; display: block; min-width: 0; overflow-wrap: break-word;
          background: var(--surface); border: 1px solid var(--line); border-radius: 24px; padding: 1.6rem;
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform .25s ease-out, border-color .3s, box-shadow .3s, opacity .7s, translate .7s; }
        .card > * { position: relative; z-index: 2; }
        .card::before { content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: 0; transition: opacity .3s;
          background: radial-gradient(360px circle at var(--mx) var(--my), color-mix(in srgb, var(--fg) 15%, transparent), transparent 62%); }
        .card::after { content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none; transform: translateX(-130%);
          background: linear-gradient(115deg, transparent 40%, color-mix(in srgb, var(--fg) 9%, transparent) 50%, transparent 60%); }
        .card:hover { border-color: var(--fg); box-shadow: 0 24px 50px rgba(0,0,0,.35); translate: 0 -6px; }
        .card:hover::before { opacity: 1; }
        .card:hover::after { transform: translateX(130%); transition: transform .9s ease; }
        .card.clickable { cursor: pointer; }
        .card h3 { font-size: 1.15rem; letter-spacing: -.02em; margin-bottom: .4rem; }
        .card p { color: var(--muted); font-size: .92rem; }
        .ico { width: 46px; height: 46px; border-radius: 14px; background: var(--accent); color: var(--on); display: grid; place-items: center; font-size: 1.15rem; margin-bottom: 1rem; transition: transform .35s cubic-bezier(.2,.8,.2,1); }
        .card:hover .ico, .card:hover .mono-ico { transform: rotate(-8deg) scale(1.1); }
        .meta { font: 500 .74rem "JetBrains Mono", monospace; color: var(--muted); margin-bottom: .3rem; }

        /* Project cards */
        .pc { display: flex !important; flex-direction: column; gap: .15rem; }
        .pc p { flex-grow: 1; }
        .pc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: .8rem; }
        .pc-tags { display: flex; align-items: center; gap: .5rem; }
        .pc-tags .meta { margin: 0; }
        .mono-ico { width: 46px; height: 46px; border-radius: 14px; background: var(--accent); color: var(--on); display: grid; place-items: center; font: 800 .95rem "Inter", sans-serif; transition: transform .35s cubic-bezier(.2,.8,.2,1); }
        .new { background: var(--accent); color: var(--on); border-radius: 999px; padding: .1rem .6rem; font: 700 .68rem "Inter", sans-serif; }
        .chips { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: 1rem; }
        .chips span { font-size: .75rem; border: 1px solid var(--line); border-radius: 999px; padding: .2rem .7rem; color: var(--muted); transition: transform .3s, border-color .3s, color .3s; }
        .card:hover .chips span { transform: translateY(-3px); border-color: var(--fg); color: var(--fg); }
        .card:hover .chips span:nth-child(2) { transition-delay: 40ms; }
        .card:hover .chips span:nth-child(3) { transition-delay: 80ms; }
        .card:hover .chips span:nth-child(4) { transition-delay: 120ms; }
        .viz { display: flex; align-items: flex-end; gap: 6px; height: 54px; margin-top: 1rem; }
        .viz i { flex: 1; background: var(--fg); opacity: .35; border-radius: 4px; transform-origin: bottom; animation: rise 1.2s cubic-bezier(.2,.8,.2,1) both; transition: opacity .3s; }
        .card:hover .viz i { opacity: .8; }
        @keyframes rise { from { transform: scaleY(0); } }
        .pf { display: flex; gap: .6rem; margin-top: 1.1rem; padding-top: 1rem; border-top: 1px solid var(--line); }
        .lb { flex: 1; min-height: 44px; padding: 0 .9rem; border-radius: 999px; border: 1px solid var(--line); display: inline-flex; align-items: center; justify-content: center; gap: .45rem; font-size: .86rem; font-weight: 600; white-space: nowrap; transition: background .2s, transform .2s, border-color .2s; }
        .lb:hover { transform: translateY(-2px); border-color: var(--fg); background: var(--surface); }
        .lb.solid { background: var(--accent); color: var(--on) !important; border-color: transparent; }
        .lb.solid:hover { background: var(--accent); filter: brightness(1.08); }
        .lb[aria-label] { flex: 0 0 44px; padding: 0; }

        /* About / experience */
        .about-top { display: grid; gap: 1.2rem; }
        @media (min-width: 600px) { .about-top { grid-template-columns: 130px 1fr; align-items: start; } }
        .about-top img { width: 130px; height: 130px; object-fit: cover; border-radius: 20px; border: 1px solid var(--line); }
        .social { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.2rem; }
        .social a { display: inline-flex; gap: .4rem; align-items: center; min-height: 40px; font-size: .85rem; font-weight: 500; border: 1px solid var(--line); border-radius: 999px; padding: 0 1rem; transition: background .2s, transform .2s; }
        .social a:hover { background: var(--surface); transform: translateY(-2px); }
        .skills { display: grid; gap: .9rem; margin-top: 1.2rem; }
        @media (min-width: 600px) { .skills { grid-template-columns: 1fr 1fr; gap: .9rem 2rem; } }
        .sk { display: flex; justify-content: space-between; font-size: .85rem; }
        .sk span:last-child { color: var(--muted); }
        .bar { height: 5px; border-radius: 9px; background: var(--line); margin-top: .35rem; overflow: hidden; }
        .bar u { display: block; height: 100%; background: var(--accent); border-radius: 9px; animation: grow 1.4s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes grow { from { width: 0 !important; } }
        .tl { border-left: 2px solid var(--line); padding-left: 1.1rem; }
        .tl strong { display: block; font-size: 1.05rem; letter-spacing: -.01em; }
        .tl p { margin: .1rem 0 .5rem; font-size: .9rem; }
        .tl ul { padding-left: 1.1rem; color: var(--muted); font-size: .9rem; }
        .tl li { margin-bottom: .3rem; }

        .contact { text-align: center; }
        .contact .ico { margin: 0 auto 1rem; }
        .cta { text-align: center; padding: 3rem 1.5rem; margin-top: 1.6rem; border-radius: 28px; background: var(--accent); color: var(--on); }
        .band .cta h2 { margin-bottom: 1.4rem; }
        .cta .btn { background: var(--on); color: var(--accent); border-color: transparent; }

        /* Scroll reveal */
        .reveal { opacity: 0; translate: 0 24px; }
        .reveal.in { opacity: 1; translate: 0 0; }
        .card.reveal { transition: transform .25s ease-out, border-color .3s, box-shadow .3s, opacity .7s, translate .7s cubic-bezier(.2,.8,.2,1); }
        .card.reveal.in:hover { translate: 0 -6px; }
        .sec-head.reveal { transition: opacity .7s, translate .7s cubic-bezier(.2,.8,.2,1); }
        .cta.reveal { transition: opacity .7s, translate .7s; }

        /* Modal */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(26,31,43,.85); backdrop-filter: blur(10px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal { position: relative; max-width: 860px; width: 100%; background: var(--solid); border-radius: 20px; border: 1px solid var(--line); padding: .7rem; }
        .modal img { width: 100%; border-radius: 12px; display: block; }
        .modal-close { position: absolute; top: .9rem; right: .9rem; width: 40px; height: 40px; border-radius: 50%; border: none; background: var(--accent); color: var(--on); display: grid; place-items: center; }

        /* Footer */
        footer { border-top: 1px solid var(--line); padding: 2rem 0; position: relative; z-index: 2; background: color-mix(in srgb, var(--fg) 3%, var(--bg)); }
        .foot { display: flex; flex-direction: column; align-items: center; gap: .7rem; text-align: center; color: var(--muted); font-size: .88rem; }
        .foot .logo { color: var(--fg); }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
          .reveal { opacity: 1; translate: 0 0; }
          .card, .card:hover { transform: none; translate: 0 0; }
        }
      `}</style>
    </div>
  );
}

export default Portfolio;