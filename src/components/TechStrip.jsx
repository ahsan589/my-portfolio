// src/components/TechStrip.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileAlt, faFire, faDatabase, faPlug, faServer } from "@fortawesome/free-solid-svg-icons";
import { faJava, faAndroid, faMicrosoft, faPython } from "@fortawesome/free-brands-svg-icons";

// [name, icon or text, proficiency %, group]
const STACK = [
  ["Java", faJava, 95, "Language"],
  ["Kotlin", "K", 90, "Language"],
  ["React Native", faMobileAlt, 85, "Mobile"],
  ["TypeScript", "TS", 80, "Language"],
  ["ASP.NET Core", faMicrosoft, 82, "Backend"],
  ["Oracle", faDatabase, 78, "Database"],
  ["Firebase", faFire, 85, "Cloud"],
  ["Jetpack Compose", faAndroid, 84, "Mobile"],
  ["TensorFlow", "TF", 70, "AI / ML"],
  ["REST APIs", faPlug, 88, "Backend"],
  ["MySQL", faServer, 80, "Database"],
  ["Flask", faPython, 72, "AI / ML"],
];
const GROUPS = ["All", ...Array.from(new Set(STACK.map((s) => s[3])))];

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function useCount(target, active, delay) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (reduced()) { setV(target); return; }
    let raf, start;
    const t0 = setTimeout(() => {
      const tick = (now) => {
        start = start || now;
        const p = Math.min((now - start) / 1000, 1);
        setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(t0); cancelAnimationFrame(raf); };
  }, [active, target, delay]);
  return v;
}

function Tile({ s, i, active, off }) {
  const [name, icon, pct, group] = s;
  const delay = i * 60;
  const n = useCount(pct, active, delay);
  const filled = Math.round(pct / 10);

  const move = (e) => {
    if (e.pointerType === "touch" || off) return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (!reduced()) {
      el.style.setProperty("--rx", `${(y / r.height - 0.5) * -9}deg`);
      el.style.setProperty("--ry", `${(x / r.width - 0.5) * 9}deg`);
    }
  };
  const leave = (e) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      className={`ts-tile ${active ? "in" : ""} ${off ? "off" : ""}`}
      style={{ transitionDelay: active && !off ? `${delay}ms` : "0ms" }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <div className="ts-row">
        <div className="ts-ico">
          {typeof icon === "string" ? <b>{icon}</b> : <FontAwesomeIcon icon={icon} />}
        </div>
        <div className="ts-pct"><b>{n}</b><span>%</span></div>
      </div>
      <div className="ts-name">{name}</div>
      <div className="ts-meter" aria-hidden="true">
        {Array.from({ length: 10 }, (_, k) => (
          <i key={k} className={k < filled ? "f" : ""} style={{ "--k": k, transitionDelay: `${delay + 200 + k * 70}ms` }} />
        ))}
      </div>
      <div className="ts-group">{group}</div>
    </div>
  );
}

export default function TechStrip() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setActive(true); return; }
    const io = new IntersectionObserver(
      ([en]) => { if (en.isIntersecting) { setActive(true); io.disconnect(); } },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shown = useMemo(() => STACK.filter((s) => filter === "All" || s[3] === filter), [filter]);
  const avg = Math.round(shown.reduce((a, s) => a + s[2], 0) / shown.length);

  return (
    <section className="ts" ref={ref} aria-label="Technology stack">
      <div className="ts-wrap">
        <div className="ts-head">
          <div>
            <h2>Tools I build with</h2>
            <p>Filter by area. Each meter shows how deep I go.</p>
          </div>
          <div className="ts-avg"><b>{shown.length}</b> shown <span>·</span> <b>{avg}%</b> average</div>
        </div>

        <div className="ts-filters" role="tablist" aria-label="Filter technologies">
          {GROUPS.map((g) => (
            <button key={g} type="button" role="tab" aria-selected={filter === g}
              className={filter === g ? "on" : ""} onClick={() => setFilter(g)}>{g}</button>
          ))}
        </div>

        <div className="ts-grid">
          <div className="ts-scan" aria-hidden="true" />
          {STACK.map((s, i) => (
            <Tile key={s[0]} s={s} i={i} active={active} off={filter !== "All" && s[3] !== filter} />
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .ts { position: relative; z-index: 2; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
          padding: 3.5rem 0; background: color-mix(in srgb, var(--fg) 3%, var(--bg)); }
        .ts-wrap { max-width: 1160px; margin: 0 auto; padding: 0 1.5rem; }
        .ts-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.2rem; }
        .ts-head h2 { font-size: clamp(1.5rem, 3vw, 2.1rem); letter-spacing: -.04em; line-height: 1.1; }
        .ts-head p { color: var(--muted); font-size: .92rem; margin-top: .35rem; }
        .ts-avg { font: 500 .8rem "JetBrains Mono", monospace; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: .4rem .95rem; }
        .ts-avg b { color: var(--fg); font-weight: 600; }

        .ts-filters { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.3rem; }
        .ts-filters button { min-height: 38px; padding: 0 1rem; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--muted); font-size: .84rem; font-weight: 600; cursor: pointer; transition: background .25s, color .25s, border-color .25s, transform .2s; }
        .ts-filters button:hover { color: var(--fg); border-color: var(--muted); transform: translateY(-1px); }
        .ts-filters button.on { background: var(--accent); color: var(--on); border-color: transparent; }

        .ts-grid { position: relative; display: grid; gap: .9rem; grid-template-columns: repeat(2, 1fr); border-radius: 24px; }
        @media (min-width: 640px) { .ts-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 960px) { .ts-grid { grid-template-columns: repeat(6, 1fr); } }

        .ts-scan { position: absolute; top: 0; bottom: 0; left: 0; width: 140px; z-index: 3; pointer-events: none; overflow: hidden;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--fg) 12%, transparent), transparent);
          transform: translateX(-160px); animation: tsScan 9s 1.5s ease-in-out infinite; }
        @keyframes tsScan { 0% { transform: translateX(-160px); } 22%, 100% { transform: translateX(120vw); } }

        .ts-tile { --mx: 50%; --my: 0%; --rx: 0deg; --ry: 0deg; --ty: 26px; --sc: 1;
          position: relative; overflow: hidden; display: flex; flex-direction: column; padding: 1rem 1rem .95rem; border-radius: 20px;
          background: var(--surface); border: 1px solid var(--line);
          opacity: 0; transform: perspective(700px) translateY(var(--ty)) scale(var(--sc)) rotateX(var(--rx)) rotateY(var(--ry));
          transition: opacity .6s, transform .35s ease-out, border-color .3s, box-shadow .3s, filter .4s; }
        .ts-tile.in { --ty: 0px; opacity: 1; }
        .ts-tile.off { --sc: .94; opacity: .22 !important; filter: grayscale(1); pointer-events: none; transition-delay: 0ms !important; }
        .ts-tile::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .3s;
          background: radial-gradient(180px circle at var(--mx) var(--my), color-mix(in srgb, var(--fg) 18%, transparent), transparent 65%); }
        .ts-tile:hover { border-color: var(--fg); box-shadow: 0 18px 40px rgba(0,0,0,.35); }
        .ts-tile:hover::before { opacity: 1; }
        .ts-tile > * { position: relative; }

        .ts-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: .9rem; }
        .ts-ico { width: 44px; height: 44px; border-radius: 14px; background: var(--accent); color: var(--on); display: grid; place-items: center; font-size: 1.2rem; transition: transform .4s cubic-bezier(.2,.8,.2,1); }
        .ts-ico b { font: 800 .9rem "Inter", sans-serif; letter-spacing: -.04em; }
        .ts-tile:hover .ts-ico { transform: rotate(-10deg) scale(1.12); }
        .ts-pct { font-family: "JetBrains Mono", monospace; color: var(--fg); line-height: 1; padding-top: .2rem; }
        .ts-pct b { font-size: 1.45rem; font-weight: 700; letter-spacing: -.04em; }
        .ts-pct span { font-size: .75rem; color: var(--muted); margin-left: 1px; }

        .ts-name { font-weight: 600; font-size: .95rem; letter-spacing: -.01em; margin-bottom: .6rem; }
        .ts-meter { display: grid; grid-template-columns: repeat(10, 1fr); gap: 3px; height: 14px; align-items: end; }
        .ts-meter i { height: 100%; border-radius: 2px; background: var(--line); transform-origin: bottom; transition: background .4s; }
        .ts-tile.in .ts-meter i.f { background: var(--fg); }
        .ts-tile:hover .ts-meter i.f { animation: tsWave .9s ease-in-out infinite; animation-delay: calc(var(--k) * 60ms); }
        @keyframes tsWave { 50% { transform: scaleY(.45); } }
        .ts-group { font: 500 .72rem "JetBrains Mono", monospace; color: var(--muted); margin-top: .65rem; }

        @media (prefers-reduced-motion: reduce) {
          .ts-scan { display: none; }
          .ts-tile { opacity: 1; transition: none; --ty: 0px; }
          .ts-meter i.f { background: var(--fg); }
          .ts-tile:hover .ts-meter i.f { animation: none; }
        }
      `}</style>
    </section>
  );
}