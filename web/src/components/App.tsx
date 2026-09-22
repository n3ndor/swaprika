import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pepper } from './Pepper';
import { EM, MIDDOT, SwapCard, sentence } from './SwapCard';
import HowItWorks from './HowItWorks';
import { INGREDIENTS, INGREDIENT_GROUPS, SITUATIONS, SWAPS, type Swap } from '../data/swaps';

type Screen = 'home' | 'browse' | 'how';

const SITS = SITUATIONS;
const TECHNIQUE_GROUP = SITS.findIndex((g) => g.g === 'Technique');
const DISHES = SITS.reduce((n, g) => n + g.items.length, 0) - 1;

const WORD: [string, string][] = [
  ['S', 'ugar'], ['w', 'heat flour'], ['a', 'quafaba'], ['p', 'aprika'],
  ['r', 'icotta'], ['i', 'ce water'], ['k', 'efir'], ['a', 'pplesauce'],
];

interface Ing {
  id: string;
  name: string;
  group: string;
  roles: string[];
  subs: Swap[];
}

/** Built once at load. The whole dataset ships with the page, so nothing is fetched. */
const PANTRY: Ing[] = INGREDIENTS.map((i) => ({ ...i, subs: SWAPS.filter((s) => s.from === i.id) }));
const TOTAL_SWAPS = SWAPS.length;

const labelOf = (code: string) => {
  for (const g of SITS) for (const it of g.items) if (it[0] === code) return it[1];
  return '';
};
const groupOf = (code: string) => SITS.findIndex((g) => g.items.some((x) => x[0] === code));

/** A situation phrased the way a cook would say it: "Making a cake", "Whipping". */
const making = (code: string) =>
  groupOf(code) === TECHNIQUE_GROUP ? sentence(labelOf(code)) : `Making ${labelOf(code)}`;

/** Ready made questions, so a first visit starts from a real situation. */
const SCENARIOS: { text: string; sit: string; ing: string }[] = [
  { text: 'Pancakes, but no buttermilk', sit: 'PANCAKE', ing: 'buttermilk' },
  { text: 'Brownies, but no eggs', sit: 'BROWNIES', ing: 'egg' },
  { text: 'Pasta sauce, but no cream', sit: 'PASTA_SAUCE', ing: 'heavy-cream' },
  { text: 'A curry, but no coconut milk', sit: 'CURRY', ing: 'coconut-milk' },
  { text: 'Pizza dough, but no dry yeast', sit: 'PIZZA', ing: 'yeast' },
  { text: 'Pesto, but no pine nuts', sit: 'PESTO', ing: 'pine-nuts' },
  { text: 'Cheesecake, but no cream cheese', sit: 'CHEESECAKE', ing: 'cream-cheese' },
  { text: 'A stir fry, but no soy sauce', sit: 'STIR_FRY', ing: 'soy-sauce' },
  { text: 'Croissants, but no butter', sit: 'CROISSANT', ing: 'butter' },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [gone, setGone] = useState(false);
  const [sit, setSit] = useState('CAKE');
  const [tab, setTab] = useState(1);
  const [ing, setIng] = useState('butter');
  const [showAll, setShowAll] = useState(false);
  // `revealed` is the automatic reveal that plays once the cards are on screen.
  // `manual` records every card the visitor has flipped by hand, and wins.
  const [revealed, setRevealed] = useState(false);
  const [manual, setManual] = useState<Record<number, boolean>>({});
  const [letter, setLetter] = useState(0);

  const resultsEl = useRef<HTMLElement | null>(null);
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The wordmark letters swapping into ingredient names.
  useEffect(() => {
    const t = setInterval(() => setLetter((n) => (n + 1) % WORD.length), 1700);
    return () => clearInterval(t);
  }, []);

  // A link to #find, #pantry or #how skips the curtain.
  useEffect(() => {
    const h = window.location.hash.replace(/^#/, '');
    if (h === 'find' || h === 'pantry' || h === 'how') {
      setGone(true);
      if (h === 'pantry') setScreen('browse');
      if (h === 'how') setScreen('how');
    }
  }, []);

  useEffect(() => {
    if (!gone) return;
    const h = screen === 'browse' ? '#pantry' : screen === 'how' ? '#how' : '#find';
    if (window.location.hash !== h) window.history.replaceState(null, '', h);
  }, [screen, gone]);

  // The reveal: hold the "you had" face until the cards are actually on screen.
  const maybeStart = useCallback(() => {
    const el = resultsEl.current;
    if (!el || !gone) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    const vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    if (vis > 0 && vis >= Math.min(r.height, vh) * 0.4) {
      if (flipTimer.current) clearTimeout(flipTimer.current);
      flipTimer.current = setTimeout(() => setRevealed(true), 1200);
    }
  }, [gone]);

  const stage = useCallback(() => {
    if (flipTimer.current) clearTimeout(flipTimer.current);
    setRevealed(false);
    setManual({});
    setTimeout(maybeStart, 60);
  }, [maybeStart]);

  useEffect(() => {
    const el = resultsEl.current;
    if (!el) return;
    const io = new IntersectionObserver(() => maybeStart(), { threshold: [0, 0.4, 0.8] });
    io.observe(el);
    return () => io.disconnect();
  }, [maybeStart]);

  useEffect(() => () => { if (flipTimer.current) clearTimeout(flipTimer.current); }, []);

  const current = useMemo(() => PANTRY.find((p) => p.id === ing), [ing]);
  const results = useMemo(
    () => (current?.subs ?? []).filter((s) => sit === 'ANY' || s.ok.includes(sit)),
    [current, sit],
  );
  const failing = useMemo(
    () => (sit === 'ANY' ? [] : (current?.subs ?? []).filter((s) => s.no.includes(sit))),
    [current, sit],
  );
  const lowerName = (current?.name ?? '').toLowerCase();
  const phrase = sit === 'ANY' ? '' : (groupOf(sit) === TECHNIQUE_GROUP ? `when ${labelOf(sit)}` : `in ${labelOf(sit)}`);

  // Step 2 shows only the ingredients that have something on file for this dish.
  const chips = useMemo(() => PANTRY.map((p) => ({
    p,
    works: p.subs.filter((s) => sit === 'ANY' || s.ok.includes(sit)).length,
    fails: sit !== 'ANY' && p.subs.some((s) => s.no.includes(sit)),
  })), [sit]);
  const relevant = chips.filter((c) => c.works || c.fails);
  const hidden = chips.filter((c) => !c.works && !c.fails);
  const visibleChips = showAll ? chips : [...relevant, ...hidden.filter((c) => c.p.id === ing)];

  const jump = useCallback((s: string, i: string) => {
    const g = groupOf(s);
    if (g >= 0) setTab(g);
    setSit(s);
    setIng(i);
    setShowAll(false);
    setScreen('home');
    stage();
    setTimeout(() => resultsEl.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }, [stage]);

  const enter = useCallback(() => {
    if (flipTimer.current) clearTimeout(flipTimer.current);
    setGone(true);
    setRevealed(false);
    setManual({});
    setTimeout(maybeStart, 950);
  }, [maybeStart]);

  const toCover = useCallback(() => {
    setGone(false);
    setScreen('home');
    window.scrollTo(0, 0);
    stage();
  }, [stage]);

  const go = (s: Screen) => { setScreen(s); window.scrollTo(0, 0); if (s === 'home') stage(); };

  const flippedAt = (i: number) => (i in manual ? manual[i] : revealed);
  // The staggered delay belongs to the automatic reveal only. A card flipped by
  // hand turns immediately, in both directions.
  const delayAt = (i: number) => (i in manual ? '0ms' : `${i * 260}ms`);
  const flip = (i: number) => setManual((m) => ({ ...m, [i]: !(i in m ? m[i] : revealed) }));

  const current_ = (s: Screen) => ({ 'aria-current': (screen === s ? 'page' : undefined) as 'page' | undefined });

  const heading = sit === 'ANY' ? `Out of ${lowerName}?` : `${making(sit)} without ${lowerName}`;
  const countText = results.length
    ? `${results.length} ${results.length === 1 ? 'swap works' : 'swaps work'}${phrase ? ` ${phrase}` : ''}`
    : failing.length ? 'nothing works here' : 'nothing on file';

  return (
    <div className="shell">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <header className="topbar">
          <div className="topbar-in">
            <button className="brandbtn" onClick={() => go('home')}>
              <Pepper size={24} wag />
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <span>swap</span><span className="rika">rika</span>
              </span>
            </button>
            <nav className="segnav" aria-label="Main">
              <button className="segbtn" {...current_('home')} onClick={() => go('home')}>Find a swap</button>
              <button className="segbtn" {...current_('browse')} onClick={() => go('browse')}>Ingredients</button>
            </nav>
            <div className="topactions">
              <button className="helpbtn" {...current_('how')} onClick={() => go('how')}>How it works</button>
              <button className="coverbtn" title="Back to the cover" onClick={toCover}>&#8593; Cover</button>
            </div>
          </div>
        </header>

        {/* FIND A SWAP */}
        <main className={`wrap ${screen === 'home' ? '' : 'is-hidden'}`}>
          <div className="screen-head">
            <div className="blob blob-sage" style={{ right: -40, top: -70, width: 280, height: 280 }} />
            {/* The pepper flies a slow loop. Its shadow runs on the same clocks with
                every direction inverted, so it always moves against the pepper and
                shrinks as the pepper climbs. */}
            <div className="hero-art deco" aria-hidden="true">
              <div className="shade"><div className="sx"><div className="sy"><div className="sb">
                <Pepper size={96} mono="var(--color-neutral-900)" noLeaf
                  style={{ filter: 'blur(7px)', transform: 'skewX(-14deg) scaleY(.86)' }} />
              </div></div></div></div>
              <div className="fly"><div className="ax"><div className="ay"><div className="ab"><div className="yaw">
                <Pepper size={120} wag shine />
              </div></div></div></div></div>
            </div>
            <div className="inner">
              <p className="kicker">Something ran out?</p>
              <h1>A swap is only true somewhere.</h1>
              <p className="say">
                Out of eggs halfway through the brownies? No buttermilk for the pancakes? Tell
                Swaprika what you are making and what is missing. It tells you what to use
                instead, how much of it, what will turn out different, and what to change so the
                dish still works. When nothing works, it says that too.
              </p>
            </div>
            <div className="tryrow">
              <span className="tryrow-label">Try one:</span>
              {SCENARIOS.map((s) => (
                <button key={s.text} className="scenario" onClick={() => jump(s.sit, s.ing)}>{s.text}</button>
              ))}
            </div>
          </div>

          <section className="stepcard">
            <div className="steprow">
              <span className="stepnum">1</span>
              <h2>What are you making?</h2>
            </div>
            <div className="tabstrip" role="tablist">
              {SITS.map((g, i) => (
                <button key={g.g} className="tab" role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>
                  {g.g}
                </button>
              ))}
            </div>
            <div className="chiprow">
              {SITS[tab].items.map(([code, label]) => (
                <button key={code} className="pill" aria-pressed={sit === code}
                  onClick={() => { setSit(code); setShowAll(false); stage(); }}>
                  {label}
                </button>
              ))}
            </div>

            <div className="steprow">
              <span className="stepnum">2</span>
              <h2>What is missing?</h2>
              <span className="stephint">
                {sit === 'ANY'
                  ? 'pick anything from the pantry'
                  : `showing the ${relevant.length} that matter ${phrase}, the number is how many swaps work`}
              </span>
            </div>
            <div className="chiprow last">
              {visibleChips.map(({ p, works, fails }) => (
                <button key={p.id} className={`pill ing${works ? '' : ' dead'}`} aria-pressed={ing === p.id}
                  onClick={() => { setIng(p.id); stage(); }}>
                  {p.name}
                  <span className="hint">{works ? works : fails ? 'fails' : EM}</span>
                </button>
              ))}
              {sit !== 'ANY' && hidden.length > 0 && (
                <button className="morebtn" onClick={() => setShowAll((v) => !v)}>
                  {showAll ? 'Show only what matters' : `+ ${hidden.length} more, nothing on file ${phrase}`}
                </button>
              )}
            </div>
          </section>

          <section ref={resultsEl} className="results">
            <div className="results-head">
              <h2>{heading}</h2>
              <span className="results-count">{countText}</span>
            </div>

            {results.length > 0 ? (
              <>
                <p className="results-tip">Tap the arrow on a card to flip between what you had and what to use.</p>
                <div className="grid-cards">
                  {results.map((r, i) => (
                    <SwapCard
                      key={`${ing}-${r.to}-${i}`}
                      swap={r}
                      fromName={current?.name ?? ''}
                      flipped={flippedAt(i)}
                      delay={delayAt(i)}
                      onFlip={() => flip(i)}
                      style={{ animationDelay: `${i * 90}ms` }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-mark">{EM}</div>
                <h3>{failing.length ? 'Known to fail here.' : 'Nothing on file.'}</h3>
                {failing.length ? (
                  <>
                    <p>
                      This is on record as a bad idea, not a gap. Most swap lists would still hand
                      you something here and ruin the dish. What fails, and why:
                    </p>
                    <ul className="fail-list">
                      {failing.map((s) => (
                        <li key={s.to}>
                          <b>{s.to}</b>{' '}
                          {s.loses.length ? `loses the ${s.loses.join(' and the ')}` : (s.eff?.[0]?.[2] ?? '')}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No swap for {lowerName} is recorded {phrase}. Saying nothing beats guessing.</p>
                )}
                <button className="trybtn" onClick={() => { setSit('ANY'); setTab(0); setShowAll(false); stage(); }}>
                  See every swap for {lowerName} &rarr;
                </button>
              </div>
            )}
          </section>
        </main>

        {/* INGREDIENTS */}
        <main className={`wrap ${screen === 'browse' ? '' : 'is-hidden'}`}>
          <div className="screen-head head-sm" style={{ maxWidth: '52ch' }}>
            <div className="blob blob-leaf" style={{ right: -300, top: -80, width: 260, height: 260 }} />
            <p className="kicker" style={{ position: 'relative', zIndex: 1 }}>The pantry</p>
            <h1>{PANTRY.length} ingredients, {TOTAL_SWAPS} swaps.</h1>
            <p>
              Pick anything you have run out of to see every swap on file for it, from the dishes
              where it works to the ones where it is known to fail.
            </p>
          </div>
          {INGREDIENT_GROUPS.map((g) => (
            <section key={g} className="pantry-group">
              <p className="group-label">{g}</p>
              <div className="grid-pantry">
                {PANTRY.filter((p) => p.group === g).map((p) => (
                  <button key={p.id} className="tile pantry" onClick={() => jump('ANY', p.id)}>
                    <span className="tile-name">
                      <Pepper size={17} style={{ flex: 'none' }} />
                      <strong>{p.name}</strong>
                    </span>
                    <span className="tile-role">{p.roles.slice(0, 3).join(` ${MIDDOT} `)}</span>
                    <span className="tile-tos">
                      {[...new Set(p.subs.map((s) => s.to))].slice(0, 3).map((t) => <span key={t}>{t}</span>)}
                    </span>
                    <span className="tile-go">
                      {p.subs.length} {p.subs.length === 1 ? 'swap' : 'swaps'} &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </main>

        {/* HOW IT WORKS */}
        <main className={`wrap ${screen === 'how' ? '' : 'is-hidden'}`}>
          <HowItWorks onTry={jump} />
        </main>

        <footer className="foot">
          <div className="foot-in">
            <button onClick={toCover}>&#8593; Back to the cover</button>
            <span>Swaprika {MIDDOT} what to use instead, and where it works</span>
            <span>
              A <a href="https://nagysolution.com" target="_blank" rel="noopener noreferrer">Nagy Solution</a> project {MIDDOT}{' '}
              <a href="https://github.com/n3ndor/swaprika" target="_blank" rel="noopener noreferrer">source</a>
            </span>
          </div>
        </footer>
      </div>

      {/* ENTER CURTAIN */}
      <div className="curtain" data-gone={gone ? '1' : '0'} aria-hidden={gone}>
        <div className="c-blob" style={{ width: 460, height: 460, background: '#a3351f', left: -150, top: -130, animation: 'swf 13s ease-in-out infinite' }} />
        <div className="c-blob" style={{ width: 330, height: 330, background: '#7a2415', right: -95, bottom: -115, animation: 'swf2 17s ease-in-out infinite' }} />
        <div className="c-blob" style={{ width: 170, height: 170, border: '1px solid rgba(251,234,222,.18)', right: '15%', top: '13%', animation: 'swf 11s ease-in-out infinite' }} />
        <Pepper size={64} mono="var(--curtain-ink)" style={{ position: 'absolute', left: '11%', bottom: '16%', opacity: .22, animation: 'drift 15s ease-in-out infinite' }} />
        <Pepper size={42} mono="var(--curtain-ink)" style={{ position: 'absolute', right: '24%', bottom: '22%', opacity: .16, animation: 'drift 21s ease-in-out infinite 2s' }} />
        <Pepper size={34} mono="var(--curtain-ink)" style={{ position: 'absolute', left: '26%', top: '15%', opacity: .14, animation: 'drift 18s ease-in-out infinite 5s' }} />

        <div className="curtain-in">
          <Pepper size={86} fill="#f04a34" wag shine
            style={{ display: 'block', margin: '0 auto 18px', animation: 'sway 5.5s ease-in-out infinite', filter: 'drop-shadow(0 14px 26px rgba(0,0,0,.28))' }} />
          <p className="curtain-tag">context aware ingredient substitution</p>

          <div className="wordmark">
            {WORD.map(([head, tail], i) => (
              <span key={head + tail}>
                {head}
                <span className="tail" style={{
                  maxWidth: letter === i ? `${tail.length * 0.72}em` : '0em',
                  opacity: letter === i ? 1 : 0,
                }}>{tail}</span>
              </span>
            ))}
          </div>

          <p className="curtain-line">
            Out of buttermilk for the pancakes? No eggs for the brownies? Pick the dish and what is
            missing, and get the swap that actually works for it.
          </p>
          <p className="curtain-stat">
            {TOTAL_SWAPS} swaps {MIDDOT} {PANTRY.length} ingredients {MIDDOT} {DISHES} dishes and techniques
          </p>

          <div className="enter-wrap">
            <button className="enterbtn" onClick={enter}>
              Enter
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h13" /><path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <a className="curtain-credit" href="https://nagysolution.com" target="_blank" rel="noopener noreferrer">
          A Nagy Solution project &#8599;
        </a>
      </div>
    </div>
  );
}
