// src/components/CVSection.jsx
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faForward, faRotateRight } from "@fortawesome/free-solid-svg-icons";

/* ---------- CV content (from Ahsan_CV_2.pdf). k = line style ---------- */
const LINES = [
  { s: "profile", k: "name", t: "Ahsan Hajvari" },
  { s: "profile", k: "meta", t: "Software engineer · Islamabad, Pakistan" },
  { s: "profile", k: "meta", t: "ahsam72642@gmail.com · +92 321 3486272" },
  { s: "profile", k: "h", t: "About" },
  { s: "profile", k: "p", t: "IT graduate skilled in software, mobile and web development, databases, networking and cloud." },
  { s: "profile", k: "p", t: "Experienced in React Native, Android (Java/Kotlin), ASP.NET Core and Firebase. Learning AI and cybersecurity." },

  { s: "experience", k: "h", t: "Experience" },
  { s: "experience", k: "role", t: "Software Engineer · NRSP, Islamabad" },
  { s: "experience", k: "meta", t: "1 Dec 2025 – present" },
  { s: "experience", k: "b", t: "Build mobile apps, ASP.NET Core MVC portals and REST APIs for field monitoring." },
  { s: "experience", k: "b", t: "Integrate Oracle-backed workflows and reporting into enterprise apps." },
  { s: "experience", k: "role", t: "Mobile Application Developer Intern · THE NIXUS (NASTP)" },
  { s: "experience", k: "meta", t: "10 Jul 2025 – 9 Nov 2025 · Rawalpindi" },
  { s: "experience", k: "b", t: "Built and maintained apps, tested and debugged, joined code reviews." },

  { s: "education", k: "h", t: "Education" },
  { s: "education", k: "role", t: "BS Information Technology · University of Education, Lahore" },
  { s: "education", k: "meta", t: "2021 – 2025 · GPA 3.66 · EQF level 6" },
  { s: "education", k: "b", t: "RACSIT-2024 international conference: poster sessions, Mar 2024." },

  { s: "projects", k: "h", t: "Projects" },
  { s: "projects", k: "b", t: "GBTI Credit Portal: ASP.NET Core dashboards, CIB, Datacheck and Tasdeeq APIs." },
  { s: "projects", k: "b", t: "PrintCatalog: React Native app and React site on Firebase." },
  { s: "projects", k: "b", t: "Fee Management System: React 19, MUI, Firebase, Chart.js." },
  { s: "projects", k: "b", t: "PlaySpot: sports ground booking with Google Maps and payment proofs." },
  { s: "projects", k: "b", t: "Crypto Market Analysis: React Native with LSTM price predictions." },
  { s: "projects", k: "b", t: "MoodTunes: emotion detection with OpenCV and Deezer recommendations." },
  { s: "projects", k: "b", t: "JobConnect, News Reader, Urdu Speech to Text, Crypto Price Predictor." },

  { s: "skills", k: "h", t: "Skills" },
  { s: "skills", k: "p", t: "React Native · TypeScript · JavaScript · Java · Kotlin · Jetpack Compose" },
  { s: "skills", k: "p", t: "ASP.NET Core · .NET API · Oracle · MySQL · SQLite · Firebase · REST APIs" },
  { s: "skills", k: "p", t: "Languages: Urdu (C2), English (C1)" },
];

const SECTIONS = [
  ["profile", "Profile"],
  ["experience", "Experience"],
  ["education", "Education"],
  ["projects", "Projects"],
  ["skills", "Skills"],
];

/* Precompute where each line starts in the "typed characters" timeline */
let cursor = 0;
const LAYOUT = LINES.map((l) => {
  const pad = l.k === "h" || l.k === "role" ? 16 : 8; // short pause after a line
  const o = { ...l, start: cursor, len: l.t.length, pad };
  cursor += l.t.length + pad;
  return o;
});
const TOTAL = cursor;
const SECTION_START = Object.fromEntries(
  SECTIONS.map(([id]) => [id, LAYOUT.find((l) => l.s === id).start])
);

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function CVSection({ cv = "/Ahsan_Hajvari_CV.pdf" }) {
  const [pos, setPos] = useState(() => (reducedMotion() ? TOTAL : 0));
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const started = useRef(false);

  /* start once when the section scrolls into view */
  useEffect(() => {
    if (reducedMotion()) return;
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) { setPlaying(true); return; }
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting && !started.current) {
          started.current = true;
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* the typing engine */
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setPos((p) => {
        if (p >= TOTAL) { setPlaying(false); return TOTAL; }
        return Math.min(p + 4, TOTAL);
      });
    }, 16);
    return () => clearInterval(id);
  }, [playing]);

  /* keep the newest line in view while typing */
  useEffect(() => {
    const el = bodyRef.current;
    if (el && playing) el.scrollTop = el.scrollHeight;
  }, [pos, playing]);

  const done = pos >= TOTAL;
  const pct = Math.round((pos / TOTAL) * 100);
  const activeLine = [...LAYOUT].reverse().find((l) => l.start <= pos) || LAYOUT[0];
  const activeSection = activeLine.s;

  const replay = () => { started.current = true; setPos(0); setPlaying(true); };
  const skip = () => { setPos(TOTAL); setPlaying(false); };
  const jump = (id) => { setPos(SECTION_START[id]); setPlaying(true); };

  return (
    <section id="cv" className="band alt" ref={rootRef}>
      <div className="wrap">
        <header className="sec-head">
          <span className="tag">Résumé</span>
          <h2>My CV, written live</h2>
          <p className="sub">Watch it get written, jump to any part, or download the PDF.</p>
        </header>

        <div className="cvw">
          {/* Document window */}
          <div className="cvw-win">
            <div className="cvw-bar">
              <span className="cvw-dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="cvw-file">Ahsan_Hajvari_CV.pdf</span>
              <span className="cvw-status">{done ? "saved" : `writing… ${pct}%`}</span>
            </div>
            <div className="cvw-prog" aria-hidden="true"><u style={{ width: `${pct}%` }} /></div>

            <div className="cvw-body" ref={bodyRef} aria-live="off">
              {pos > 12 && <img className="cvw-photo" src="/w.jpeg" alt="" onError={(e) => (e.currentTarget.style.display = "none")} />}
              {LAYOUT.map((l, i) => {
                if (pos < l.start) return null;
                const vis = Math.min(Math.max(pos - l.start, 0), l.len);
                const typing = pos < l.start + l.len + l.pad && (pos < TOTAL || i === LAYOUT.length - 1);
                const complete = vis >= l.len;
                const isLast = i === LAYOUT.length - 1;
                return (
                  <div key={i} className={`cvw-l ${l.k} ${complete ? "done" : ""}`}>
                    {l.k === "b" && <span className="cvw-bul">▸</span>}
                    <span>{l.t.slice(0, vis)}</span>
                    {(typing || (done && isLast)) && <span className="cvw-caret" />}
                  </div>
                );
              })}
            </div>

            <div className="cvw-foot">
              <button type="button" onClick={replay}><FontAwesomeIcon icon={faRotateRight} /> Replay</button>
              <button type="button" onClick={skip} disabled={done}><FontAwesomeIcon icon={faForward} /> Skip</button>
              <a href={cv} download="Ahsan_Hajvari_CV.pdf" className="dl"><FontAwesomeIcon icon={faDownload} /> Download CV</a>
            </div>
          </div>

          {/* Section timeline */}
          <aside className="cvw-side" aria-label="CV sections">
            <ol>
              {SECTIONS.map(([id, label]) => {
                const idx = SECTIONS.findIndex((s) => s[0] === id);
                const activeIdx = SECTIONS.findIndex((s) => s[0] === activeSection);
                const state = done || idx < activeIdx ? "past" : idx === activeIdx ? "now" : "next";
                return (
                  <li key={id} className={state}>
                    <button type="button" onClick={() => jump(id)}>
                      <span className="dot" />
                      <span className="lbl">{label}</span>
                      <span className="st">{state === "past" ? "written" : state === "now" ? "writing" : ""}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="cvw-facts">
              <div><b>2</b>roles</div>
              <div><b>3.66</b>GPA</div>
              <div><b>10+</b>projects</div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx="true">{`
        .cvw { display: grid; gap: 1.4rem; grid-template-columns: 1fr; align-items: stretch; }
        @media (min-width: 960px) { .cvw { grid-template-columns: minmax(0, 1fr) 280px; } }

        .cvw-win { border: 1px solid var(--line); border-radius: 22px; background: var(--solid); overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,.25); }
        .cvw-bar { display: flex; align-items: center; gap: .8rem; padding: .75rem 1rem; border-bottom: 1px solid var(--line); background: var(--surface); }
        .cvw-dots { display: flex; gap: 6px; }
        .cvw-dots i { width: 11px; height: 11px; border-radius: 50%; background: var(--line); }
        .cvw-dots i:first-child { background: var(--muted); }
        .cvw-file { font: 500 .78rem "JetBrains Mono", monospace; color: var(--muted); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cvw-status { font: 500 .74rem "JetBrains Mono", monospace; color: var(--fg); border: 1px solid var(--line); border-radius: 999px; padding: .15rem .7rem; }
        .cvw-prog { height: 2px; background: var(--line); }
        .cvw-prog u { display: block; height: 100%; background: var(--fg); transition: width .1s linear; }

        .cvw-body { height: 480px; overflow-y: auto; padding: 1.6rem 1.8rem; scrollbar-width: thin; scrollbar-color: var(--line) transparent;
          background-image: radial-gradient(var(--line) 1px, transparent 1px); background-size: 20px 20px; background-position: 10px 10px; }
        .cvw-body::-webkit-scrollbar { width: 8px; }
        .cvw-body::-webkit-scrollbar-track { background: transparent; }
        .cvw-body::-webkit-scrollbar-thumb { background: var(--line); border-radius: 8px; }
        .cvw-body::-webkit-scrollbar-thumb:hover { background: var(--muted); }
        .cvw-photo { float: right; width: 88px; height: 88px; margin: 0 0 .8rem 1rem; border-radius: 22px; object-fit: cover; border: 1px solid var(--line); box-shadow: 0 10px 30px rgba(0,0,0,.3); animation: cvwPop .7s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes cvwPop { from { opacity: 0; transform: scale(.6) rotate(-8deg); } }
        @media (max-width: 600px) { .cvw-body { height: 420px; padding: 1.2rem; } }
        .cvw-l { line-height: 1.65; font-size: .93rem; color: var(--muted); margin-bottom: .35rem; overflow-wrap: anywhere; }
        .cvw-l.name { font-size: clamp(1.7rem, 4vw, 2.3rem); font-weight: 800; letter-spacing: -.04em; color: var(--fg); line-height: 1.15; }
        .cvw-l.meta { font: 500 .78rem "JetBrains Mono", monospace; color: var(--muted); }
        .cvw-l.h { position: relative; margin-top: 1.5rem; padding-bottom: .4rem; font-size: 1.05rem; font-weight: 700; letter-spacing: -.01em; color: var(--fg); }
        .cvw-l.h::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: var(--fg); transform: scaleX(0); transform-origin: left; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
        .cvw-l.h.done::after { transform: scaleX(1); }
        .cvw-l.role { margin-top: .8rem; font-weight: 600; color: var(--fg); }
        .cvw-l.p { color: var(--fg); opacity: .85; }
        .cvw-l.b { padding-left: 1.1rem; position: relative; color: var(--fg); opacity: .85; }
        .cvw-bul { position: absolute; left: 0; color: var(--muted); font-size: .75rem; top: .12rem; }
        .cvw-caret { display: inline-block; width: 8px; height: 1.05em; margin-left: 2px; vertical-align: text-bottom; background: var(--fg); animation: cvwBlink 1s steps(1) infinite; }
        @keyframes cvwBlink { 50% { opacity: 0; } }

        .cvw-foot { display: flex; flex-wrap: wrap; gap: .6rem; padding: .9rem 1rem; border-top: 1px solid var(--line); background: var(--surface); }
        .cvw-foot button, .cvw-foot a { min-height: 40px; padding: 0 1.1rem; border-radius: 999px; border: 1px solid var(--line); background: transparent; display: inline-flex; align-items: center; gap: .5rem; font-size: .86rem; font-weight: 600; transition: transform .2s, border-color .2s, background .2s; }
        .cvw-foot button:hover:not(:disabled), .cvw-foot a:hover { transform: translateY(-2px); border-color: var(--fg); }
        .cvw-foot button:disabled { opacity: .4; cursor: not-allowed; }
        .cvw-foot .dl { margin-left: auto; background: var(--accent); color: var(--on) !important; border-color: transparent; }

        .cvw-side { border: 1px solid var(--line); border-radius: 22px; background: var(--surface); padding: 1.2rem; display: flex; flex-direction: column; }
        .cvw-side ol { list-style: none; position: relative; display: grid; gap: .2rem; margin-bottom: 1.2rem; }
        .cvw-side ol::before { content: ""; position: absolute; left: 17px; top: 18px; bottom: 18px; width: 2px; background: var(--line); }
        .cvw-side li button { position: relative; width: 100%; display: flex; align-items: center; gap: .8rem; padding: .6rem .5rem; border: 0; background: transparent; border-radius: 12px; text-align: left; cursor: pointer; transition: background .2s; }
        .cvw-side li button:hover { background: var(--solid); }
        .cvw-side .dot { position: relative; z-index: 1; width: 12px; height: 12px; margin-left: 6px; border-radius: 50%; background: var(--surface); border: 2px solid var(--line); transition: background .3s, border-color .3s, box-shadow .3s; }
        .cvw-side .lbl { flex: 1; font-weight: 600; font-size: .92rem; color: var(--muted); transition: color .3s; }
        .cvw-side .st { font: 500 .68rem "JetBrains Mono", monospace; color: var(--muted); }
        .cvw-side li.past .dot { background: var(--fg); border-color: var(--fg); }
        .cvw-side li.past .lbl { color: var(--fg); }
        .cvw-side li.now .dot { background: var(--fg); border-color: var(--fg); box-shadow: 0 0 0 5px var(--line); animation: cvwPulse 1.4s ease-in-out infinite; }
        .cvw-side li.now .lbl { color: var(--fg); }
        @keyframes cvwPulse { 50% { box-shadow: 0 0 0 9px transparent; } }
        .cvw-facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: .5rem; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--line); text-align: center; font-size: .75rem; color: var(--muted); }
        .cvw-facts b { display: block; font-size: 1.3rem; letter-spacing: -.03em; color: var(--fg); }

        @media (prefers-reduced-motion: reduce) {
          .cvw-caret, .cvw-side li.now .dot { animation: none; }
          .cvw-l.h::after { transition: none; transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}