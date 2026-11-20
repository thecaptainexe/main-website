import { useEffect, useMemo, useState } from "react";
import { categories, themes } from "./themeData";

function Icon({ name }) {
  if (name === "grid") return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" /></svg>
  );
  if (name === "shuffle") return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3h4v4M3 7h4c5 0 5 10 10 10h4M17 17h4v4M3 17h4c2 0 3-2 4-4M14 10c1-2 2-3 4-3h3" /></svg>
  );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Zm8 14 .7 2.3L23 19l-2.3.7L20 22l-.7-2.3L17 19l2.3-.7L20 16Z" /></svg>
  );
}

const dedicatedScenes = {
  "cyberpunk-neon-noir": ["city", "#ff2bd6", "#1ae9ff"], "y2k-retro-futurism": ["chrome", "#bdeaff", "#ff69c8"],
  "90s-dial-up-nostalgia": ["computer", "#57f287", "#ff4fca"], "brutalist-web-design": ["blocks", "#f0f0eb", "#ff3b30"],
  "vaporwave-dream": ["statue", "#b9a4ff", "#69d7cf"], "dark-academia": ["library", "#caa66b", "#5a3325"],
  "cottagecore-picnic": ["picnic", "#ffb7b7", "#86ad65"], "solarpunk-eco-utopia": ["greenhouse", "#52d18b", "#ffd166"],
  "goth-victorian": ["castle", "#b34c61", "#2a102c"], "bubblegum-pop": ["candy", "#ff67d0", "#72eaff"],
  "synthwave-sunset": ["sunset", "#ff3cac", "#784ba0"], "lo-fi-study-beats": ["desk", "#ffc857", "#7a4e36"],
  "dreamcore-surrealism": ["pool", "#a7d8d8", "#dbcfe5"], "matrix-terminal": ["matrix", "#66ff99", "#003d1b"],
  "retro-arcade-machine": ["arcade", "#ff4da6", "#42d7ff"], "nasa-control-room": ["nasa", "#65a8ff", "#f3f6ff"],
  "hacker-command-line": ["terminal", "#65ff99", "#101810"], "sci-fi-spaceship-hud": ["spaceship", "#68d2ff", "#071d38"],
  "dos-prompt-622": ["terminal", "#d8e4ff", "#1a57c4"], "glitch-art-central": ["glitch", "#ff2b6d", "#29e7ff"],
  "blueprint-engineering": ["blueprint", "#dbeeff", "#2c78b5"], "circuit-board-motherboard": ["circuit", "#67ef9a", "#062a20"],
  "retro-macintosh-system-1": ["computer", "#ece7d7", "#3f3f3f"], "windows-xp-bliss": ["windows", "#75bdff", "#4e9f32"],
  "windows-95-classic": ["windows95", "#dfdfdf", "#108080"], "bsod-blue-screen-of-death": ["terminal", "#eff7ff", "#0069be"],
  "cassette-tape-mixtape": ["cassette", "#ffb45c", "#ef476f"], "vcr-home-video": ["vcr", "#a7e8bd", "#2a2a36"],
  "stranger-things-upside-down": ["forest", "#e36b63", "#18253a"], "minecraft-inventory-ui": ["minecraft", "#6ead45", "#a66a45"],
  "among-us-spaceship": ["among", "#ff6262", "#54b7ff"], "pokemon-pokecenter": ["pokemon", "#ff9bb2", "#72d8f4"],
  "portal-aperture-science": ["portal", "#ff9c55", "#58baff"], "fallout-pip-boy-3000": ["pipboy", "#62ff9a", "#102318"],
  "tron-grid": ["gridcar", "#5feaff", "#fe4ee8"], "blade-runner-los-angeles": ["city", "#ff67bd", "#39b4de"],
  "cozy-coffee-shop": ["coffee", "#efb366", "#70462f"], "late-night-diner": ["diner", "#ff7a66", "#7f1f27"],
  "japanese-ramen-bar": ["ramen", "#f7a35c", "#b52d32"], "boba-tea-haven": ["boba", "#ddb2ff", "#8c67bb"],
  "pizzeria-slice-joint": ["pizza", "#ffd166", "#d94732"], "ice-cream-parlor-pastel": ["icecream", "#ffc8dd", "#78c8ad"],
  "candy-store-wonderland": ["candy", "#ff69b4", "#72e3ff"], "deep-fried-meme": ["meme", "#ffea00", "#ff3c00"],
  "cat-cafe-takeover": ["cat", "#ffc3a5", "#6b4c74"], "duck-pond-chaos": ["duck", "#ffe59a", "#63a86d"],
  "error-404-found": ["error", "#ececec", "#454545"], "infinite-scroll-abyss": ["abyss", "#a58cff", "#09091a"],
  "safari-expedition": ["safari", "#cdb66b", "#58784f"], "deep-sea-trench": ["ocean", "#2ce3b0", "#07172f"],
  "mount-everest-base-camp": ["mountain", "#effaff", "#6e9eb7"], "tropical-island-resort": ["island", "#ffe49b", "#40b9ae"],
  "tokyo-neon-alleyway": ["city", "#ff48b8", "#35c5ff"], "wild-west-frontier": ["west", "#ffc66d", "#9a4f2d"],
  "new-york-city-subway": ["subway", "#ffe34a", "#1d6fa5"], "great-barrier-reef": ["reef", "#ff96b8", "#38c5aa"],
  "retro-roller-rink": ["roller", "#ff65b6", "#6bdbf1"], "chess-grandmaster-arena": ["chess", "#efe7d2", "#744b31"],
  "vinyl-record-collector": ["vinyl", "#ff8a6b", "#321c26"], "camping-wilderness-tent": ["camp", "#ffc36a", "#385d50"],
  "astronomy-stargazing-observatory": ["space", "#c7afff", "#070d32"], "comic-book-strip-panel": ["comic", "#ffd447", "#e83b3b"],
  "tarot-card-divination": ["tarot", "#d3a4ff", "#4b2470"], "graffiti-street-mural": ["graffiti", "#ff5178", "#39d5a1"],
  "blizzard-snowstorm": ["snow", "#ecfbff", "#5c9dca"], "spring-cherry-blossom-bloom": ["blossom", "#ffcad4", "#67a66c"],
  "thunderstorm-lightning-strike": ["storm", "#d6dfef", "#655f88"], "solar-eclipse-corona": ["eclipse", "#fff1b5", "#10101d"],
  "meteor-shower-night": ["space", "#c2c8ff", "#161a50"], "aurora-borealis-northern-lights": ["aurora", "#75ffc7", "#ba78ff"],
  "monsoon-rain-season": ["rain", "#9bc8e8", "#354a60"], "starlit-desert-night": ["desert", "#9b91d8", "#d6a266"],
  "dmv-waiting-line-ticket": ["dmv", "#ffd166", "#aa5b39"], "bureaucratic-government-form": ["form", "#e5dcbe", "#77776b"],
  "wizard-s-tower-library": ["wizard", "#7fd9ad", "#4a356d"], "dragon-s-hoard-treasury": ["dragon", "#ffd447", "#b62f36"],
  "fairy-forest-glade": ["fairy", "#91df8e", "#cf86dc"], "ghostly-haunted-mansion": ["ghost", "#dad9ff", "#35405b"],
  "knight-s-medieval-armory": ["knight", "#c5ccd3", "#7d4f32"], "true-black-oled": ["oled", "#ffffff", "#000000"],
  "microwave-oven-interior": ["microwave", "#fff16b", "#8a8a8a"], "lava-lamp-flow": ["lavalamp", "#ff5f6d", "#7a3cff"],
  "edm-rave-laser-show": ["lasers", "#ff39c7", "#42f0ff"], "jazz-club-smoke-brass": ["jazz", "#e0ad63", "#49312e"],
  "vaporwave-mall-1993": ["mall", "#f3a6ff", "#60d1dd"], "frutiger-aero-2006": ["aero", "#87dfff", "#74ca62"],
  "discord-dark-mode-ux": ["discord", "#99aaff", "#5865f2"], "the-ultimate-randomizer": ["random", "#ff70b5", "#63efcb"],
  "shrek-s-swamp": ["swamp", "#86a83f", "#56351f"],
  "spongebob-squarepants-bikini-bot": ["bikini", "#ffdf45", "#58c4de"],
  "nicolas-cage-collage": ["portrait", "#f5ca5b", "#30303a"],
  "comic-sans-maximum": ["comic", "#ff70c9", "#56b7ff"],
  "papyrus-ancient-egypt": ["egypt", "#d6ad65", "#5e472c"],
  "floor-is-lava": ["lava", "#ff5d20", "#841400"],
  "magic-8-ball-oracle": ["oracle", "#76dfff", "#171424"],
  "bubble-wrap-popping": ["bubble", "#a9efff", "#7282d7"],
  "elevator-muzak": ["elevator", "#d9d7cf", "#737681"],
  "infinite-loading-spinner": ["loading", "#ffffff", "#6a36ca"],
  "instructions-unclear": ["comic", "#ffcf33", "#e84c3d"],
  "anime-night-sakura": ["anime", "#ffabd2", "#7b82d8"],
  "cat-caf-takeover": ["cat", "#ffc3a5", "#6b4c74"],
};

function SceneArt({ kind, colors, title, category }) {
  const [primary, secondary] = colors;
  if (kind === "city") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><g fill={secondary} opacity=".8"><rect x="40" y="190" width="70" height="150"/><rect x="125" y="145" width="92" height="195"/><rect x="235" y="205" width="65" height="135"/><rect x="320" y="120" width="110" height="220"/><rect x="445" y="170" width="115" height="170"/></g><g fill={primary}><rect x="52" y="210" width="8" height="14"/><rect x="80" y="210" width="8" height="14"/><rect x="145" y="168" width="10" height="12"/><rect x="180" y="168" width="10" height="12"/><rect x="347" y="145" width="12" height="15"/><rect x="386" y="145" width="12" height="15"/><rect x="470" y="195" width="11" height="13"/></g><path d="M0 320C130 270 470 370 600 300V340H0Z" fill="#090516"/><path d="M300 340V95" stroke={primary} strokeWidth="4" opacity=".35"/><circle cx="300" cy="94" r="42" fill="none" stroke={primary} strokeWidth="3"/></svg>;
  if (kind === "statue") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><defs><linearGradient id="statue-bg"><stop stopColor={secondary}/><stop offset="1" stopColor={primary}/></linearGradient></defs><rect width="600" height="340" fill="url(#statue-bg)" opacity=".35"/><path d="M300 70c-55 0-85 35-78 92l18 103h120l18-103c7-57-23-92-78-92Z" fill="#ddd3ca"/><circle cx="300" cy="66" r="48" fill="#e9e1d8"/><path d="M253 60c18-45 76-45 94 0-26 12-68 12-94 0Z" fill="#bbb1aa"/><path d="M245 170l55 28 55-28M300 198v67" stroke="#aaa09a" strokeWidth="8"/><g fill={primary}><rect x="70" y="250" width="100" height="12"/><rect x="430" y="250" width="100" height="12"/></g></svg>;
  if (kind === "matrix") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#020804"/><g fill={primary} fontFamily="monospace" fontSize="22" opacity=".8"><text x="70" y="60">101101</text><text x="160" y="120">011001</text><text x="280" y="45">11010</text><text x="390" y="95">001011</text><text x="500" y="155">10110</text><text x="105" y="210">0 1 1 0</text><text x="330" y="250">1 0 1 1</text></g><g stroke={primary} opacity=".28"><path d="M80 0v340M150 0v340M220 0v340M290 0v340M360 0v340M430 0v340M500 0v340"/></g></svg>;
  if (kind === "terminal") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill={secondary}/><rect x="60" y="55" width="480" height="230" rx="5" fill="#090b09" stroke={primary} strokeWidth="4"/><g fill={primary} fontFamily="monospace" fontSize="20"><text x="85" y="100">C:\CAPTAIN&gt; run_theme.exe</text><text x="85" y="145">LOADING {kind.toUpperCase()}...</text><text x="85" y="190">STATUS: VERY OFFICIAL</text><text x="85" y="235">C:\CAPTAIN&gt; <tspan fill="#fff">_</tspan></text></g></svg>;
  if (kind === "arcade") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect x="155" y="35" width="290" height="305" rx="18" fill="#17131d" stroke={primary} strokeWidth="7"/><rect x="185" y="65" width="230" height="145" rx="8" fill="#081b30" stroke={secondary} strokeWidth="5"/><path d="M215 185l45-65 35 35 35-70 55 100Z" fill={primary}/><rect x="210" y="225" width="180" height="12" rx="6" fill={secondary}/><circle cx="250" cy="270" r="18" fill={primary}/><circle cx="350" cy="270" r="18" fill={secondary}/><text x="300" y="318" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800">INSERT COIN</text></svg>;
  if (kind === "dmv") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#f1ead6"/><rect x="75" y="60" width="450" height="220" rx="8" fill="#1a1a18" stroke="#111" strokeWidth="10"/><rect x="110" y="95" width="380" height="75" fill="#e49a45"/><text x="300" y="145" textAnchor="middle" fill="#24180b" fontFamily="monospace" fontSize="38" fontWeight="900">A184</text><text x="300" y="205" textAnchor="middle" fill={primary} fontFamily="monospace" fontSize="24">NOW SERVING</text><text x="300" y="250" textAnchor="middle" fill="#eee" fontFamily="monospace" fontSize="19">YOUR NUMBER B927 - 4 HRS</text></svg>;
  if (kind === "duck") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#74bee0"/><path d="M0 220c130-35 220 35 330 0s210 10 270 0v120H0Z" fill="#72bf79"/><g fill="#fff" opacity=".9"><ellipse cx="300" cy="275" rx="185" ry="38"/><ellipse cx="300" cy="270" rx="150" ry="28"/></g><g className="duck-art"><ellipse cx="300" cy="230" rx="62" ry="38" fill="#ffd84d"/><circle cx="350" cy="195" r="31" fill="#ffd84d"/><path d="M375 190l48 14-48 13Z" fill="#ef7d32"/><circle cx="358" cy="188" r="5" fill="#1a1a1a"/></g><g className="duck-art duck-two"><ellipse cx="145" cy="285" rx="38" ry="24" fill="#ffd84d"/><circle cx="174" cy="265" r="20" fill="#ffd84d"/><path d="M190 263l28 8-28 9Z" fill="#ef7d32"/></g></svg>;
  if (kind === "city") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#090516"/><g fill={secondary}><rect x="40" y="170" width="70" height="170"/><rect x="125" y="130" width="90" height="210"/><rect x="235" y="210" width="65" height="130"/><rect x="320" y="115" width="110" height="225"/><rect x="445" y="160" width="115" height="180"/></g><g fill={primary}><rect x="55" y="190" width="10" height="14"/><rect x="145" y="155" width="12" height="14"/><rect x="345" y="140" width="13" height="16"/><rect x="468" y="185" width="12" height="14"/></g><path d="M0 315C120 260 480 365 600 295V340H0Z" fill="#05030b"/><g stroke={primary} strokeWidth="2" opacity=".7"><path d="M75 300l110-190M490 300l-95-220"/></g></svg>;
  if (kind === "desk") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#201821"/><rect x="65" y="220" width="470" height="20" fill="#8c6547"/><rect x="170" y="240" width="22" height="100" fill="#5d402e"/><rect x="410" y="240" width="22" height="100" fill="#5d402e"/><rect x="220" y="70" width="160" height="125" rx="8" fill="#18232d" stroke={primary} strokeWidth="5"/><path d="M245 125h110M245 150h75" stroke={secondary} strokeWidth="6"/><circle cx="420" cy="190" r="31" fill={primary}/><path d="M420 160v-18M420 220v18" stroke={primary} strokeWidth="5"/><g fill={primary}><circle cx="95" cy="195" r="18"/><path d="M95 177v-50c0-20 40-20 40 0v50" stroke={primary} strokeWidth="8"/></g></svg>;
  if (kind === "cat") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#f5cdbd"/><g fill="#6c4d70"><path d="M210 230c0-80 55-132 125-132s125 52 125 132v110H210Z"/><path d="M242 125l15-78 64 54M428 125l-15-78-64 54" /></g><g fill="#f5a88b"><ellipse cx="280" cy="170" rx="15" ry="20"/><ellipse cx="390" cy="170" rx="15" ry="20"/></g><path d="M326 200l24 0-12 13Z" fill="#563e58"/><g stroke="#563e58" strokeWidth="4"><path d="M305 214l-70-12M305 222l-82 18M365 214l70-12M365 222l82 18"/></g><g fill="#d8b56b" stroke="#d8b56b" strokeWidth="8"><path d="M180 300c-70-20-70-100-10-125"/><path d="M490 300c70-20 70-100 10-125"/></g></svg>;
  if (kind === "ocean") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><defs><linearGradient id="ocean-bg" x2="0" y2="1"><stop stopColor="#07172f"/><stop offset="1" stopColor="#0b4d68"/></linearGradient></defs><rect width="600" height="340" fill="url(#ocean-bg)"/><g fill={primary} opacity=".85"><circle cx="120" cy="230" r="24"/><circle cx="110" cy="210" r="8"/><circle cx="450" cy="155" r="34"/><circle cx="470" cy="130" r="10"/><circle cx="340" cy="280" r="18"/></g><g stroke={secondary} strokeWidth="3" fill="none"><path d="M80 270c40-40 80-40 120 0M390 210c40-40 80-40 120 0"/></g></svg>;
  if (kind === "island") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#62cad2"/><circle cx="490" cy="72" r="44" fill={primary}/><path d="M0 220c180-35 420 35 600 0v120H0Z" fill="#53bfa8"/><path d="M0 260c180-35 420 35 600 0v80H0Z" fill="#e7d093"/><path d="M250 280c0-95 38-175 75-220" stroke="#744b32" strokeWidth="18"/><g fill="#56a85b"><path d="M325 62c-62-35-112-5-135 18 68-5 106 25 135-18Z"/><path d="M325 62c55-45 109-20 135 8-68 2-105 29-135-8Z"/></g></svg>;
  if (kind === "space") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#060919"/><g fill="#fff"><circle cx="60" cy="60" r="2"/><circle cx="120" cy="140" r="3"/><circle cx="240" cy="70" r="2"/><circle cx="360" cy="120" r="3"/><circle cx="520" cy="55" r="2"/><circle cx="470" cy="220" r="2"/><circle cx="220" cy="260" r="3"/></g><circle cx="300" cy="170" r="95" fill={secondary} opacity=".85"/><ellipse cx="300" cy="170" rx="145" ry="32" fill="none" stroke={primary} strokeWidth="8"/><circle cx="300" cy="170" r="74" fill="#0a0d20"/></svg>;
  if (kind === "asteroid") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#090b1d"/><g fill="#fff"><circle cx="90" cy="70" r="2"/><circle cx="190" cy="120" r="2"/><circle cx="490" cy="80" r="3"/></g><path d="M90 250c130-180 300-110 430-210" stroke={primary} strokeWidth="5" strokeDasharray="12 18"/><circle cx="395" cy="105" r="38" fill={secondary}/><g fill="#7d6f64"><circle cx="385" cy="95" r="7"/><circle cx="410" cy="115" r="10"/></g></svg>;
  if (kind === "coffee") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#51382d"/><rect x="0" y="260" width="600" height="80" fill="#2a1b16"/><g fill="#fff" opacity=".12"><rect x="40" y="60" width="130" height="100"/><rect x="430" y="60" width="130" height="100"/></g><path d="M220 180h160v100c0 35-160 35-160 0Z" fill="#efddc6"/><path d="M380 205h38c35 0 35 55 0 55h-38" fill="none" stroke="#efddc6" strokeWidth="18"/><g fill="none" stroke={primary} strokeWidth="8" opacity=".8"><path d="M270 155c-35-35 35-55 0-90"/><path d="M330 155c35-35-35-55 0-90"/></g></svg>;
  if (kind === "pizza") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#f8dfb5"/><path d="M300 300 105 82c95-74 295-74 390 0Z" fill="#efb53e" stroke="#c58431" strokeWidth="8"/><path d="M300 300 105 82c95-74 295-74 390 0Z" fill="#f8c94c" opacity=".5"/><g fill="#d94d3f"><circle cx="210" cy="125" r="24"/><circle cx="355" cy="115" r="25"/><circle cx="300" cy="210" r="25"/><circle cx="415" cy="170" r="20"/></g><g fill="#78a84a"><circle cx="260" cy="175" r="11"/><circle cx="385" cy="210" r="11"/><circle cx="155" cy="130" r="10"/></g></svg>;
  if (kind === "candy") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#68c9d9"/><g fill={primary}><circle cx="120" cy="210" r="58"/><circle cx="300" cy="145" r="72"/><circle cx="490" cy="225" r="50"/></g><g fill={secondary}><circle cx="120" cy="210" r="22"/><circle cx="300" cy="145" r="28"/><circle cx="490" cy="225" r="18"/></g><g stroke="#fff" strokeWidth="9" opacity=".8"><path d="M70 210h100M250 145h100M445 225h90"/></g></svg>;
  if (kind === "dmv") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#e7e1d1"/><rect x="55" y="55" width="490" height="230" rx="6" fill="#1b1b1b" stroke="#0a0a0a" strokeWidth="10"/><text x="300" y="135" textAnchor="middle" fill={primary} fontFamily="monospace" fontSize="48" fontWeight="900">A184</text><text x="300" y="195" textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="22">NOW SERVING</text><text x="300" y="235" textAnchor="middle" fill={primary} fontFamily="monospace" fontSize="18">YOUR NUMBER B927 - 4 HOURS</text></svg>;
  if (kind === "mountain") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#b6d8e8"/><path d="M0 290 170 90l110 130 90-150 230 220Z" fill={secondary}/><g fill="#fff"><path d="M170 90l45 54-35-8-20 30-30-20Z"/><path d="M370 70l58 91-45-20-28 32-40-42Z"/></g><path d="M0 280c160-40 340 45 600-10v70H0Z" fill="#e5f5f8"/></svg>;
  if (kind === "forest") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#101927"/><g fill={secondary}><path d="M110 300V130l-55 75h35l-45 55h130l-45-55h35Z"/><path d="M300 300V90l-75 100h48l-65 75h184l-65-75h48Z"/><path d="M500 300V145l-50 70h34l-42 55h116l-42-55h34Z"/></g><g fill={primary}><circle cx="120" cy="170" r="5"/><circle cx="330" cy="160" r="4"/><circle cx="500" cy="190" r="5"/></g></svg>;
  if (kind === "spaceship") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#071321"/><g stroke={primary} fill="none" strokeWidth="3" opacity=".8"><circle cx="300" cy="170" r="75"/><circle cx="300" cy="170" r="130"/><path d="M300 40v260M170 170h260"/><path d="M210 80l180 180M390 80L210 260"/></g><circle cx="300" cy="170" r="18" fill={secondary}/><g fill={primary}><circle cx="100" cy="80" r="4"/><circle cx="520" cy="240" r="4"/></g></svg>;
  if (kind === "chess") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#17120d"/><g transform="translate(120 20)"><rect width="360" height="300" fill="#eee2c9"/><g fill="#5f4935"><rect x="0" y="0" width="45" height="37.5"/><rect x="90" y="0" width="45" height="37.5"/><rect x="180" y="0" width="45" height="37.5"/><rect x="270" y="0" width="45" height="37.5"/><rect x="45" y="37.5" width="45" height="37.5"/><rect x="135" y="37.5" width="45" height="37.5"/><rect x="225" y="37.5" width="45" height="37.5"/><rect x="315" y="37.5" width="45" height="37.5"/></g></g><g fill={primary}><circle cx="205" cy="270" r="24"/><circle cx="300" cy="270" r="24"/><circle cx="395" cy="270" r="24"/></g></svg>;
  if (kind === "comic") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#fff"/><g fill={primary}><circle cx="190" cy="170" r="100"/><circle cx="410" cy="170" r="100"/></g><g fill={secondary}><circle cx="190" cy="170" r="55"/><circle cx="410" cy="170" r="55"/></g><path d="M300 50l25 95 95 25-95 25-25 95-25-95-95-25 95-25Z" fill="#ff4d4d" stroke="#111" strokeWidth="8"/><text x="300" y="205" textAnchor="middle" fill="#111" fontSize="44" fontWeight="900">POW!</text></svg>;
  if (kind === "dragon") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#24101a"/><g fill={primary}><ellipse cx="300" cy="215" rx="175" ry="95"/><circle cx="430" cy="155" r="75"/><path d="M380 105l35-85 35 85M455 105l55-65-5 100"/></g><g fill={secondary}><circle cx="454" cy="150" r="8"/><path d="M475 180l55 20-55 20Z"/></g><g fill="#ffb347"><circle cx="145" cy="270" r="8"/><circle cx="180" cy="250" r="6"/><circle cx="220" cy="280" r="7"/></g></svg>;
  if (kind === "lavalamp") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#17151d"/><path d="M225 40h150l25 260H200Z" fill="#5c3e70" stroke="#aaa" strokeWidth="8"/><ellipse cx="300" cy="55" rx="85" ry="18" fill="#bcb8c7"/><ellipse cx="300" cy="300" rx="100" ry="22" fill="#bcb8c7"/><g fill={primary}><circle cx="300" cy="105" r="35"/><circle cx="280" cy="205" r="48"/><circle cx="325" cy="265" r="25"/></g><g fill={secondary} opacity=".7"><circle cx="305" cy="150" r="18"/><circle cx="275" cy="270" r="18"/></g></svg>;
  if (kind === "lasers") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#050612"/><g strokeWidth="8" opacity=".9"><path d="M300 300L80 40" stroke={primary}/><path d="M300 300L520 40" stroke={secondary}/><path d="M300 300L300 20" stroke="#fff"/><path d="M300 300L40 180" stroke={secondary}/><path d="M300 300L560 170" stroke={primary}/></g><g fill="#fff"><circle cx="300" cy="300" r="18"/><circle cx="300" cy="300" r="48" fill="none" stroke="#fff" strokeWidth="3"/></g></svg>;
  if (kind === "discord") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#313338"/><rect x="0" y="0" width="90" height="340" fill="#232428"/><g fill={secondary}><circle cx="45" cy="60" r="25"/><circle cx="45" cy="125" r="25"/><circle cx="45" cy="190" r="25"/></g><rect x="90" y="0" width="150" height="340" fill="#2b2d31"/><g fill="#aaa"><rect x="115" y="55" width="95" height="12"/><rect x="115" y="90" width="75" height="12"/><rect x="115" y="125" width="105" height="12"/></g><rect x="240" y="0" width="360" height="340" fill="#313338"/><g fill={primary}><circle cx="300" cy="95" r="25"/><circle cx="300" cy="160" r="25"/><circle cx="300" cy="225" r="25"/></g><g fill="#ddd"><rect x="340" y="85" width="190" height="12"/><rect x="340" y="150" width="150" height="12"/><rect x="340" y="215" width="210" height="12"/></g></svg>;
  if (kind === "random") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#111"/><g opacity=".9"><circle cx="120" cy="100" r="70" fill={primary}/><rect x="250" y="55" width="140" height="140" rx="20" fill={secondary}/><path d="M430 60l95 120-95 120Z" fill="#ffd166"/><path d="M140 240l75-35 75 35-75 35Z" fill="#69db7c"/><circle cx="430" cy="250" r="50" fill="#d7b9ff"/></g></svg>;
  if (kind === "anime") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#ec8eb8"/><g fill="#fff" opacity=".75"><circle cx="70" cy="80" r="12"/><circle cx="500" cy="60" r="8"/><circle cx="540" cy="170" r="13"/><circle cx="120" cy="220" r="7"/></g><g fill="#4a3b72"><circle cx="300" cy="155" r="92"/><path d="M218 130c20-105 145-105 164 0l-28-42-38 28-42-28Z"/></g><ellipse cx="300" cy="160" rx="75" ry="88" fill="#f3c6a6"/><g fill="#3a3048"><ellipse cx="270" cy="160" rx="9" ry="14"/><ellipse cx="330" cy="160" rx="9" ry="14"/></g><g fill="#fff"><ellipse cx="273" cy="157" rx="3" ry="5"/><ellipse cx="333" cy="157" rx="3" ry="5"/></g><path d="M285 205c10 9 20 9 30 0" fill="none" stroke="#b86a77" strokeWidth="5"/><path d="M225 220c20 90 130 90 150 0Z" fill={primary}/><g fill="#537cbd"><rect x="70" y="270" width="460" height="10"/><rect x="90" y="290" width="420" height="8"/></g><g fill="#ffb6d0"><circle cx="95" cy="58" r="14"/><circle cx="510" cy="100" r="11"/><circle cx="440" cy="275" r="9"/></g></svg>;
  if (kind === "swamp") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#91a84d"/><path d="M0 250c150-35 420 35 600-10v100H0Z" fill="#527037"/><path d="M120 280c30-70 70-110 120-125l20 125Z" fill="#6e4a2d"/><rect x="330" y="165" width="150" height="115" rx="8" fill="#5c3d27"/><path d="M315 165l90-75 90 75Z" fill="#6f4a2d"/><rect x="390" y="205" width="38" height="75" fill="#36271d"/><g fill="#86a83f"><circle cx="320" cy="165" r="28"/><circle cx="470" cy="150" r="35"/></g><g fill="#d5df9a" className="duck-art"><ellipse cx="245" cy="265" rx="38" ry="24"/><circle cx="275" cy="245" r="18"/><path d="M290 243l25 8-25 8Z" fill="#e99b35"/></g></svg>;
  if (kind === "portrait") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#20202a"/><g fill={primary} opacity=".9"><rect x="40" y="40" width="150" height="260"/><rect x="225" y="40" width="150" height="260"/><rect x="410" y="40" width="150" height="260"/></g><g fill="#c99a72"><ellipse cx="115" cy="145" rx="48" ry="60"/><ellipse cx="300" cy="145" rx="48" ry="60"/><ellipse cx="485" cy="145" rx="48" ry="60"/></g><g fill="#1d1d24"><path d="M70 125c10-60 80-60 92 0-30-18-62-18-92 0Z"/><path d="M255 125c10-60 80-60 92 0-30-18-62-18-92 0Z"/><path d="M440 125c10-60 80-60 92 0-30-18-62-18-92 0Z"/></g><g fill="#111"><circle cx="100" cy="150" r="5"/><circle cx="130" cy="150" r="5"/><circle cx="285" cy="150" r="5"/><circle cx="315" cy="150" r="5"/><circle cx="470" cy="150" r="5"/><circle cx="500" cy="150" r="5"/></g><g fill="#e6c0a1"><path d="M90 195c15 20 35 20 50 0Z"/><path d="M275 195c15 20 35 20 50 0Z"/><path d="M460 195c15 20 35 20 50 0Z"/></g></svg>;
  if (kind === "bikini") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#58c4de"/><g fill="#fff" opacity=".85"><circle cx="80" cy="100" r="28"/><circle cx="110" cy="90" r="35"/><circle cx="500" cy="80" r="24"/></g><path d="M0 250c140-30 420 30 600-5v95H0Z" fill="#eacb76"/><g transform="translate(220 115)" className="duck-art"><rect x="0" y="0" width="160" height="160" rx="18" fill="#ffdf45" stroke="#c5a12d" strokeWidth="8"/><rect x="20" y="20" width="120" height="120" rx="12" fill="#fff1a1"/><circle cx="80" cy="80" r="24" fill="#7a5a35"/><circle cx="70" cy="73" r="4" fill="#111"/><circle cx="90" cy="73" r="4" fill="#111"/><path d="M65 92c10 12 20 12 30 0" fill="none" stroke="#111" strokeWidth="4"/></g><g fill="#f58d75"><circle cx="100" cy="230" r="12"/><circle cx="480" cy="235" r="9"/></g></svg>;
  if (kind === "egypt") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#d8b56c"/><path d="M120 300 300 55l180 245Z" fill="#ba8d48"/><path d="M300 55v245" stroke="#edce87" strokeWidth="8"/><g fill="#5e472c"><rect x="245" y="210" width="110" height="90"/><circle cx="300" cy="205" r="45"/><path d="M270 205c0-32 60-32 60 0Z"/></g><g fill="#e8ca86"><circle cx="125" cy="120" r="38"/><circle cx="475" cy="120" r="38"/></g></svg>;
  if (kind === "lava") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#241010"/><path d="M0 250c100-45 200 45 300 0s200-45 300 0v90H0Z" fill="#ff3b12"/><g fill="#ffb21a" className="lava-bubbles"><circle cx="100" cy="260" r="28"/><circle cx="300" cy="270" r="38"/><circle cx="500" cy="255" r="30"/></g><g stroke="#ffcf5a" strokeWidth="10"><path d="M125 230l35-70M300 235l-15-110M475 230l45-90"/></g></svg>;
  if (kind === "oracle") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#171424"/><circle cx="300" cy="170" r="120" fill="#090911" stroke="#76dfff" strokeWidth="10"/><circle cx="300" cy="170" r="78" fill="#1d1a35"/><path d="M245 170c35-55 75-55 110 0-35 55-75 55-110 0Z" fill="#76dfff" opacity=".38"/><circle cx="300" cy="170" r="28" fill="#e6f9ff"/><text x="300" y="178" textAnchor="middle" fill="#171424" fontSize="24" fontWeight="900">?</text><rect x="245" y="285" width="110" height="18" rx="9" fill="#76dfff"/></svg>;
  if (kind === "bubble") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#dff8ff"/><g fill="#a9efff" stroke="#7282d7" strokeWidth="4"><circle cx="100" cy="100" r="50"/><circle cx="220" cy="170" r="50"/><circle cx="340" cy="90" r="50"/><circle cx="470" cy="190" r="50"/><circle cx="520" cy="75" r="35"/></g><g fill="#fff" opacity=".8"><circle cx="82" cy="82" r="12"/><circle cx="202" cy="152" r="12"/><circle cx="322" cy="72" r="12"/><circle cx="452" cy="172" r="12"/></g></svg>;
  if (kind === "elevator") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#d9d7cf"/><rect x="155" y="30" width="290" height="310" rx="5" fill="#aaa9a2" stroke="#62636a" strokeWidth="10"/><rect x="180" y="55" width="240" height="285" fill="#27272d"/><g transform="translate(390 75)" fill="#c8c9c3"><rect width="34" height="230" rx="4"/><g fill="#f1cf4b"><circle cx="17" cy="34" r="8"/><circle cx="17" cy="70" r="8"/><circle cx="17" cy="106" r="8"/><circle cx="17" cy="142" r="8"/><circle cx="17" cy="178" r="8"/><circle cx="17" cy="214" r="8"/></g></g><path d="M300 55v285" stroke="#a9aaa6" strokeWidth="8"/><text x="300" y="335" textAnchor="middle" fill="#5f6068" fontSize="16">PLEASE HOLD</text></svg>;
  if (kind === "loading") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#09090c"/><circle cx="300" cy="170" r="82" fill="none" stroke="#2c2c38" strokeWidth="18"/><path d="M300 88a82 82 0 0 1 82 82" fill="none" stroke={primary} strokeWidth="18" strokeLinecap="round" className="loading-ring"/><text x="300" y="230" textAnchor="middle" fill="#aaa" fontSize="18" letterSpacing="4">PLEASE WAIT</text></svg>;
  if (kind === "picnic") return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#b9df91"/><g fill="#fff" opacity=".9"><circle cx="100" cy="70" r="25"/><circle cx="130" cy="60" r="32"/><circle cx="500" cy="90" r="28"/></g><path d="M100 250h400l-45 90H145Z" fill="#f5b0b0"/><g fill="#fff"><rect x="100" y="250" width="50" height="45"/><rect x="200" y="250" width="50" height="45"/><rect x="300" y="250" width="50" height="45"/><rect x="400" y="250" width="50" height="45"/><rect x="150" y="295" width="50" height="45"/><rect x="250" y="295" width="50" height="45"/><rect x="350" y="295" width="50" height="45"/></g><g fill="#8a5d3b"><ellipse cx="300" cy="180" rx="60" ry="18"/><path d="M300 162c-30-45 30-45 0 0Z"/></g></svg>;
  if (kind === "collage") {
    const artSets = {
      "Tech": ["CRT","FLOPPY","CHIP","CABLE","CD-ROM","HACKER","ROBOT","DIAL-UP","ROUTER","PIXEL","TERMINAL","GAME BOY","PAGER","NEON","HUD","DISK","BROWSER","LASER"],
      "Pop Culture": ["MOVIE","TV","COMIC","SWORD","SHIP","MAP","MASK","POSTER","CREATURE","MAGIC","COSTUME","CAR","CASTLE","SWORD","SIGN","TICKET","LOGO","PROP"],
      "Food": ["COFFEE","NOODLES","TACO","PIZZA","SUSHI","BOBA","CHEF","MENU","CAKE","CANDLE","TRAY","SODA","CHERRY","WAFFLE","CHOPSTICKS","CUP","PAN","SIGN"],
      "Odd": ["DUCK","RUBBER DUCK","SIGN","PIRATE HAT","SUNGASSES","CAPTAIN","LILY PAD","FROG","BUBBLE","BANNER","CAT","YARN","CAKE","VHS","SPINNER","TAPE","POP","GHOST"],
      "Travel": ["MAP","COMPASS","TRAIN","PALM","CAMERA","MOUNTAIN","PASSPORT","SIGN","SUITCASE","TICKET","CAB","SHIP","CACTUS","CAMP","GLIDER","BRIDGE","COAST","SOUVENIR"],
      "Sports": ["BALL","COURT","SKATE","RACKET","BIKE","TROPHY","WHISTLE","NET","HOOP","PAD","GLOVE","CLEAT","SCORE","FLAG","JERSEY","BOARD","CAP","MEDAL"],
      "Creative": ["BRUSH","PALETTE","QUILL","CANVAS","INK","CLAY","YARN","CAMERA","SCISSORS","FRAME","STAMP","PAPER","GOLD","CRAYON","TYPE","PENCIL","EASEL","SCROLL"],
      "Weather": ["CLOUD","LIGHTNING","TORNADO","RADAR","SATELLITE","RAIN","SNOW","SUN","WIND","FLOOD","EMBER","ICE","GAUGE","CLOUD","BOLT","MAP","ALARM","RAIN"],
      "Office": ["FORM","STAMP","LEDGER","FAX","PHONE","VAULT","FILE","TICKET","BADGE","SIGN","CALCULATOR","DESK","CLOCK","PAPER","PEN","MAIL","LOCK","COPY"],
      "Fantasy": ["SWORD","SHIELD","POTION","DRAGON","CRYSTAL","CANDLE","SCROLL","RUNE","CROWN","STAFF","ORB","CHEST","CASTLE","MOON","BOOK","WING","GEM","MAP"],
      "Minimal": ["GRID","CARD","LABEL","TYPE","SWATCH","LINE","ICON","BUTTON","PAPER","FRAME","CODE","DOT","RULER","BOX","NOTE","TILE","TABLE","STAMP"],
      "Niche": ["MICROWAVE","TOASTER","ELEVATOR","PINBALL","VENDING","JUKEBOX","HOURGLASS","BUBBLE","CRADLE","PLASMA","POOL FLOAT","8-BALL","SPIROGRAPH","ETCH SKETCH","MOOD RING","CLAW","SAND","MACHINE"],
      "Music": ["VINYL","MIC","TAPE","TRUMPET","AMPLIFIER","SPEAKER","PIANO","DRUM","GUITAR","LASER","NOTE","HEADPHONE","MIXER","DISCO","KEYBOARD","TICKET","VINYL","CAB"],
      "History": ["MAP","TABLET","POTTERY","MANUSCRIPT","COMPASS","VASE","SWORD","SCROLL","COIN","RUNE","COLUMN","QUILL","CLOCK","HELMet","CROWN","CHART","SEAL","BOOK"],
      "Dimensions": ["PORTAL","ROVER","PLANET","SHIP","ALIEN","ROBOT","TELESCOPE","RIFT","GEAR","MOON","STAR","CORE","SATELLITE","CAPSULE","HOLOGRAM","MAP","LENS","TIME"],
      "Internet": ["WINDOW","CURSOR","EMOTICON","CHAT","SERVER","MAIL","PROFILE","BLOG","GIF","BROWSER","GLITTER","ICON","MOUSE","DISCORD","REDDIT","LIKE","TOP 8","CCD"],
      "Wild Cards": ["GHOST","CLAW","POLICE TAPE","SPELLBOOK","CARNIVAL","PERISCOPE","CHAINSAW","CAVE","CRYSTAL","MAGIC","LIGHT","CAMERA","DOOR","SIGN","MASK","LANTERN","SWORD","BALLOON"],
      "Vibe": ["SUNSET","STATUE","CHROME","TEXTURE","NEON","CACTUS","WINDOW","TAPE","PLASTIC","FLOWER","POLAROID","POSTER","CANDLE","BOOK","DESK","SKY","MUSIC","GLASS"]
    };
    const set = artSets[category] || artSets.Vibe;
    const positions = [
      [48,42],[148,32],[248,48],[348,30],[448,42],[548,32],
      [92,118],[192,108],[292,120],[392,112],[492,118],
      [48,210],[148,198],[248,214],[348,198],[448,210],[548,198],
      [92,286],[292,278],[492,286]
    ];
    return <svg className="scene-art collage-art" viewBox="0 0 600 340" aria-hidden="true">
      <rect width="600" height="340" fill="#17151f"/>
      <rect x="12" y="12" width="576" height="316" rx="8" fill={colors[1]} opacity=".12"/>
      {positions.map(([x,y], index) => (
        <g key={`${set[index % set.length]}-${index}`} transform={`translate(${x} ${y}) rotate(${[-7,5,-4,8,0,-6][index % 6]} 38 38)`}>
          <rect x="-38" y="-28" width="76" height="56" rx="7" fill="#f3eee2" stroke="#17151f" strokeWidth="5"/>
          <rect x="-32" y="-22" width="64" height="44" rx="3" fill={index % 3 === 0 ? colors[0] : index % 3 === 1 ? colors[1] : "#e7e4dc"}/>
          <text x="0" y="5" textAnchor="middle" fill={index % 3 === 2 ? "#17151f" : "#fff"} fontSize="8" fontWeight="900">{set[index % set.length]}</text>
        </g>
      ))}
      <rect x="18" y="294" width="564" height="30" fill="#17151f" opacity=".92"/>
      <text x="300" y="315" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="900" letterSpacing="2">{title.toUpperCase()}</text>
    </svg>;
  }
  return <svg className="scene-art" viewBox="0 0 600 340" aria-hidden="true"><rect width="600" height="340" fill="#17151f"/></svg>;
}

function ThemeVisual({ theme, compact = false }) {
  const scene = dedicatedScenes[theme.slug];
  const fallbackColors = theme.category === "Weather"
    ? ["#73aee8", "#dcecff"]
    : theme.category === "Odd"
      ? ["#ff70b5", "#63efcb"]
      : ["#c18fff", "#5f3c98"];
  return (
    <div className={`theme-visual visual-${theme.slug} ${scene ? "dedicated-theme" : "fallback-theme"} ${compact ? "is-compact" : ""}`}
      style={scene ? { "--theme-primary": scene[1], "--theme-secondary": scene[2] } : undefined}>
      {scene
        ? <SceneArt kind={scene[0]} colors={[scene[1], scene[2]]} title={theme.title} category={theme.category} />
        : <SceneArt kind="collage" colors={fallbackColors} title={theme.title} category={theme.category} />}
      <span className="visual-chip">LIVE / {theme.category.toUpperCase()}</span>
      <div className="visual-copy">
        <span>CAPTAIN.EXE / THEME PREVIEW</span>
        <strong>{theme.title}</strong>
        {!compact && <small>{theme.description}</small>}
      </div>
      {theme.slug === "duck-pond-chaos" && (
        <div className="ducks" aria-hidden="true">
          <span>DUCK</span><span>DUCK ☀</span><span>PIRATE DUCK</span><span>DUCK 🕶</span><span>WIZARD DUCK</span><span>ASTRO DUCK</span>
          <span>FROG</span><span>LILY PAD</span><span>FROG</span><span>DUCK</span><span>CATTAIL</span><span>DUCK</span>
        </div>
      )}
      {theme.slug === "dmv-waiting-line-ticket" && (
        <div className="dmv-scene" aria-label="DMV waiting line scene">
          <div className="dmv-board"><b>NOW SERVING A184</b><span>YOUR NUMBER B927</span><small>EST. WAIT 4 HOURS</small></div>
          <div className="dmv-queue" aria-hidden="true">
            {["FORM","PEN","CLOCK","QUEUE","CHAIR","CHAIR","CLIPBOARD","SEAL","STAMP","APPOINTMENT"].map((item, index) => (
              <span key={`${item}-${index}`}><i>{String(index + 1).padStart(2,"0")}</i>{item}</span>
            ))}
          </div>
        </div>
      )}
      {theme.slug === "matrix-terminal" && (
        <div className="matrix-rain" aria-hidden="true">101011<br />00110<br />11001<br />01010<br />10011</div>
      )}
      {theme.slug === "floor-is-lava" && (
        <div className="lava-lake" aria-hidden="true"><i /><i /><i /></div>
      )}
    </div>
  );
}

function Navbar({ navigate }) {
  return (
    <nav className="navbar section-container" aria-label="Primary navigation">
      <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}>CAPTAIN<span>.</span></a>
      <div className="nav-links">
        <a href="/#about">About</a>
        <a href="/#projects">Projects</a>
        <a href="/themes" aria-current="page">Themes</a>
      </div>
      <a className="nav-contact" href="/contact" onClick={(event) => { event.preventDefault(); navigate("/contact"); }}>Contact</a>
    </nav>
  );
}

function useLocalClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

export default function ThemesPage({ navigate }) {
  const saved = useMemo(() => {
    try {
      return JSON.parse(window.localStorage.getItem("captain-themes") || "{}");
    } catch {
      return {};
    }
  }, []);
  const [selectedId, setSelectedId] = useState(1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [randomMode, setRandomMode] = useState(Boolean(saved.randomMode));
  const [interval, setInterval] = useState(saved.interval || "refresh");
  const [screensaver, setScreensaver] = useState(false);
  const clock = useLocalClock();

  const visible = themes.filter((theme) =>
    (category === "All" || theme.category === category) &&
    `${theme.title} ${theme.description}`.toLowerCase().includes(query.toLowerCase())
  );
  const selected = themes.find((theme) => theme.id === selectedId) || themes[0];

  useEffect(() => {
    window.localStorage.setItem("captain-themes", JSON.stringify({ randomMode, interval }));
  }, [randomMode, interval]);

  useEffect(() => {
    if (!randomMode || interval === "refresh") return undefined;
    const timer = window.setInterval(() => setSelectedId(Math.floor(Math.random() * themes.length) + 1), Number(interval));
    return () => window.clearInterval(timer);
  }, [randomMode, interval]);

  useEffect(() => {
    if (!screensaver) return undefined;
    const exit = (event) => {
      if (event.key === "Escape") setScreensaver(false);
    };
    window.addEventListener("keydown", exit);
    return () => window.removeEventListener("keydown", exit);
  }, [screensaver]);

  const surprise = () => setSelectedId(Math.floor(Math.random() * themes.length) + 1);
  const toggleRandomMode = () => {
    const nextRandomMode = !randomMode;
    setRandomMode(nextRandomMode);
    if (nextRandomMode) surprise();
  };

  return (
    <main className="themes-page">
      <Navbar navigate={navigate} />
      <section className="themes-shell section-container">
        <header className="themes-heading">
          <div>
            <p className="eyebrow">The internet&apos;s weird little wardrobe</p>
            <h1>Pick a vibe<span>.</span></h1>
            <p>Browse tiny worlds made for procrastinating beautifully. Leave one running like a screensaver, or let chaos pick for you.</p>
          </div>
          <div className="theme-count"><strong>{themes.length}</strong><span>visual experiments</span></div>
        </header>

        <div className="themes-layout">
          <aside className="theme-sidebar">
            <div className="sidebar-heading"><span>Theme index</span><b>{String(visible.length).padStart(3, "0")}</b></div>
            <label className="theme-search">
              <span className="sr-only">Search themes</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the weirdness..." />
              <span aria-hidden="true">⌕</span>
            </label>
            <div className="category-list">
              {categories.map((item) => (
                <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>
                  <span>{item}</span>
                  <small>{item === "All" ? themes.length : themes.filter((theme) => theme.category === item).length}</small>
                </button>
              ))}
            </div>
            <div className="sidebar-note"><Icon name="spark" /><span>Leave random mode running. Your monitor deserves some drama.</span></div>
          </aside>

          <div className="themes-main">
            <div className="themes-toolbar">
              <div className="mode-toggle" role="group" aria-label="Theme mode">
                <button className={!randomMode ? "active" : ""} onClick={() => setRandomMode(false)}><Icon name="grid" />Browse</button>
                <button className={randomMode ? "active" : ""} onClick={toggleRandomMode}><Icon name="shuffle" />Random mode</button>
              </div>
              <div className="toolbar-actions">
                {randomMode && (
                  <select value={interval} onChange={(event) => setInterval(event.target.value)} aria-label="Random interval">
                    <option value="refresh">Every refresh</option>
                    <option value="30000">Every 30 seconds</option>
                    <option value="60000">Every minute</option>
                  </select>
                )}
                <button className="screensaver-button" onClick={() => setScreensaver(true)}><Icon name="spark" />Screensaver</button>
              </div>
            </div>

            <div className="feature-preview">
              <ThemeVisual theme={selected} />
              <div className="feature-copy">
                <span className="feature-label">Currently viewing / {String(selected.id).padStart(3, "0")}</span>
                <h2>{selected.title}</h2>
                <p>{selected.description}</p>
                <button className="button button-primary" onClick={surprise}>Surprise me ↗</button>
              </div>
            </div>

            <div className="theme-grid">
              {visible.map((theme) => (
                <button className={`theme-card ${theme.id === selectedId ? "selected" : ""}`} onClick={() => setSelectedId(theme.id)} key={theme.id}>
                  <ThemeVisual theme={theme} compact />
                  <span className="theme-card-copy"><b>{theme.title}</b><small>{theme.description}</small></span>
                  <i>↗</i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {screensaver && (
        <div className="screensaver-overlay" role="dialog" aria-modal="true" aria-label="Theme screensaver">
          <ThemeVisual theme={selected} />
          <div className="screensaver-clock" aria-label="Current time and date">
            <time>{clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time>
            <span>{clock.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
          <div className="screensaver-hud">
            <span>CAPTAIN.EXE / SCREENSAVER</span>
            <strong>{selected.title}</strong>
            <small>Move the mouse or press Escape to exit</small>
          </div>
          <button onClick={() => setScreensaver(false)}>Exit ↗</button>
        </div>
      )}
    </main>
  );
}
