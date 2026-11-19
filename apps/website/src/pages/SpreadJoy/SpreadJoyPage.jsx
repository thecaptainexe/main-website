import { useEffect, useRef, useState } from "react";
import "./SpreadJoy.css";

const BASE_COUNT = 200000;
const STORAGE_KEY = "spreadjoy-movement-count";
const THEME_KEY = "spreadjoy-theme";

const themes = [
  ["auto", "Auto"],
  ["christmas", "Christmas"],
  ["easter", "Easter"],
  ["winter", "Winter"],
  ["fall", "Fall"],
  ["spring", "Spring"],
  ["summer", "Summer"],
  ["remembrance", "Remembrance"],
];

function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getAutomaticTheme(date) {
  const month = date.getMonth();
  const day = date.getDate();
  if (month === 10 && day === 11) return "remembrance";
  if ((month === 10 && day >= 20) || month === 11) return "christmas";

  const easter = easterSunday(date.getFullYear());
  const daysFromEaster = (date - easter) / 86400000;
  if (daysFromEaster >= -7 && daysFromEaster <= 7) return "easter";
  if (month === 11 || month === 0 || month === 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  return "fall";
}

function CountUp({ value }) {
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const start = performance.now();
    const from = value - 320;
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / 1100, 1);
      setShown(Math.round(from + (value - from) * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <strong>{shown.toLocaleString("en-CA")}</strong>;
}

function ThemeDecor({ theme }) {
  if (theme === "christmas") {
    return (
      <div className="theme-decor christmas-decor" aria-hidden="true">
        <div className="decor-banner">Happy Holidays</div>
        <img className="decor-svg decor-tree decor-tree-left" src="/assets/spreadjoy/christmas-tree.svg" alt="" />
        <img className="decor-svg decor-tree decor-tree-right" src="/assets/spreadjoy/christmas-tree.svg" alt="" />
        {Array.from({ length: 14 }, (_, i) => <span className={`snowflake flake-${i + 1}`} key={i}>✦</span>)}
      </div>
    );
  }

  const config = {
    easter: { image: "easter-egg.svg", className: "egg-decor", count: 8 },
    winter: { image: "snowflake.svg", className: "winter-decor", count: 13 },
    fall: { image: "fall-leaf.svg", className: "fall-decor", count: 12 },
    spring: { image: "spring-flower.svg", className: "spring-decor", count: 10 },
    summer: { image: "summer-sun.svg", className: "summer-decor", count: 7 },
    remembrance: { image: "remembrance-poppy.svg", className: "remembrance-decor", count: 8 },
  }[theme];

  if (!config) return null;
  return (
    <div className={`theme-decor ${config.className}`} aria-hidden="true">
      {Array.from({ length: config.count }, (_, i) => (
        <img
          className={`decor-svg floating-svg floating-svg-${i + 1}`}
          src={`/assets/spreadjoy/${config.image}`}
          alt=""
          key={i}
        />
      ))}
    </div>
  );
}

export default function SpreadJoyPage({ navigate }) {
  const counted = useRef(false);
  const [count, setCount] = useState(BASE_COUNT);
  const [selectedTheme, setSelectedTheme] = useState(() => localStorage.getItem(THEME_KEY) || "auto");

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    const previous = Number.parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    const increment = Number.isFinite(previous) ? previous + 1 : 1;
    localStorage.setItem(STORAGE_KEY, String(increment));
    setCount(BASE_COUNT + increment);
  }, []);

  useEffect(() => {
    document.title = "Spread Joy — CaptainEXE";
    return () => { document.title = "CaptainEXE — Developer, Builder, Creator"; };
  }, []);

  const activeTheme = selectedTheme === "auto" ? getAutomaticTheme(new Date()) : selectedTheme;

  const chooseTheme = (theme) => {
    setSelectedTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  };

  const downloadCards = () => {
    const link = document.createElement("a");
    link.href = "/assets/spreadjoy/spread-joy-cards.svg";
    link.download = "spread-joy-cards.svg";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <main className={`spreadjoy-page theme-${activeTheme}`}>
      <ThemeDecor theme={activeTheme} />

      <nav className="spreadjoy-nav" aria-label="Primary navigation">
        <a className="spreadjoy-brand" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}>
          CAPTAIN<span>EXE</span>
        </a>
        <a className="spreadjoy-back" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}>
          ← Back home
        </a>
      </nav>

      <section className="spreadjoy-hero">
        <div className="spreadjoy-copy">
          <p className="spreadjoy-kicker"><span /> The Spread Joy Movement</p>
          <h1>Make a stranger&apos;s<br /><em>day better.</em></h1>
          <p className="spreadjoy-lede">
            Print a few kind cards. Leave them somewhere unexpected. Watch a small gesture travel further than you ever will.
          </p>

          <div className="spreadjoy-actions">
            <button className="download-cards" type="button" onClick={downloadCards}>
              <span>Download the cards</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" /></svg>
            </button>
            <span className="card-format">SVG sheet · 8 cards · free</span>
          </div>
        </div>

        <div className="movement-card" aria-label="Movement member count">
          <div className="movement-card-top">
            <span>People moving kindness</span>
            <span className="live-dot">Live</span>
          </div>
          <CountUp value={count} />
          <p>and counting</p>
          <div className="movement-progress"><span /></div>
        </div>
      </section>

      <div className="theme-dock" role="group" aria-label="Choose page decoration">
        {themes.map(([value, label]) => (
          <button
            type="button"
            className={selectedTheme === value ? "active" : ""}
            aria-pressed={selectedTheme === value}
            onClick={() => chooseTheme(value)}
            key={value}
          >
            {label}
          </button>
        ))}
      </div>
    </main>
  );
}
