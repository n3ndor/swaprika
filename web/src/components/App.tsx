import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pepper } from './Pepper';
import { DOCS, DOC_GROUPS, type Doc } from '../data/docs';

/** The design sets copy with em dashes; repo style bans the literal glyph. */
const EM = String.fromCharCode(0x2014);
const MIDDOT = String.fromCharCode(0x00b7);

type Screen = 'home' | 'browse' | 'docs' | 'doc';
type Dim = 'DISH_TYPE' | 'TECHNIQUE' | null;

/**
 * The situation picker. Grouped for humans, but each entry still resolves to a
 * real schema enum, so the UI never invents a context the API cannot answer.
 */
const SITS: { g: string; dim: Dim; items: [string, string][] }[] = [
  { g: 'Anywhere', dim: null, items: [['ANY', 'anywhere']] },
  {
    g: 'Baking',
    dim: 'DISH_TYPE',
    items: [
      ['CAKE', 'a cake'], ['COOKIE', 'cookies'], ['MUFFIN', 'muffins'],
      ['QUICK_BREAD', 'a quick bread'], ['PANCAKE', 'pancakes'], ['CROISSANT', 'a croissant'],
      ['MERINGUE', 'a meringue'], ['BUTTERCREAM', 'buttercream'], ['SODA_BREAD', 'soda bread'],
      ['MOUSSE', 'a mousse'],
    ],
  },
  {
    g: 'Savoury and sauces',
    dim: 'DISH_TYPE',
    items: [
      ['CURRY', 'a curry'], ['BECHAMEL', 'a bechamel'], ['FRIED_CHICKEN', 'fried chicken'],
      ['QUICHE', 'a quiche'], ['FRUIT_SAUCE', 'a fruit sauce'], ['VINAIGRETTE', 'a vinaigrette'],
      ['DIPPING_SAUCE', 'a dipping sauce'],
    ],
  },
  {
    g: 'Technique',
    dim: 'TECHNIQUE',
    items: [
      ['CREAMING', 'creaming'], ['RUBBING_IN', 'rubbing in'], ['WHIPPING', 'whipping'],
      ['THICKENING', 'thickening'], ['PAN_FRYING', 'pan frying'], ['LAMINATION', 'laminating'],
      ['GLAZING', 'glazing'], ['BRINING', 'brining'], ['CARAMELISATION', 'caramelising'],
    ],
  },
];

/** Cooking order, not alphabetical. Butter first because it is the common case. */
const ORDER = [
  'butter', 'egg', 'egg-white', 'buttermilk', 'milk', 'heavy-cream',
  'wheat-flour', 'cornstarch', 'sugar', 'lemon-juice', 'fish-sauce',
];

const WORD: [string, string][] = [
  ['S', 'ugar'], ['w', 'heat flour'], ['a', 'quafaba'], ['p', 'aprika'],
  ['r', 'icotta'], ['i', 'ce water'], ['k', 'efir'], ['a', 'pplesauce'],
];

const PANTRY_QUERY = `query Pantry {
  ingredients {
    id
    canonicalName
    roles
    substitutions {
      edges {
        node { canonicalName }
        ratio { amount basis note }
        preservesRoles
        losesRoles
        validFor { techniques excludedTechniques dishTypes excludedDishTypes }
        effects { dimension direction note }
        adjustments { action amount reason }
        reliability
      }
    }
  }
}`;

interface Sub {
  to: string;
  amount: number;
  basis: string;
  note: string | null;
  keeps: string[];
  loses: string[];
  ok: string[];
  no: string[];
  eff: { dimension: string; direction: string; note: string | null }[];
  adj: { action: string; amount: string | null; reason: string | null }[];
  rel: string;
}
interface Ing {
  id: string;
  name: string;
  roles: string[];
  subs: Sub[];
}

const human = (s: string) => s.toLowerCase().replace(/_/g, ' ');
const sentence = (s: string) => {
  const t = human(s);
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [gone, setGone] = useState(false);
  const [sit, setSit] = useState('CAKE');
  const [tab, setTab] = useState(1);
  const [ing, setIng] = useState('butter');
  const [flipped, setFlipped] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);
  const [letter, setLetter] = useState(0);
  const [pantry, setPantry] = useState<Ing[]>([]);

  const resultsEl = useRef<HTMLElement | null>(null);
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Data. One request for the whole pantry: 21 edges is small enough that every
  // later interaction is instant, and the API stays the only source of truth.
  // Nothing about a swap is hardcoded in this file.
  useEffect(() => {
    let cancelled = false;
    fetch('/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': 'dev-key' },
      body: JSON.stringify({ query: PANTRY_QUERY }),
    })
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        type RawEdge = {
          node: { canonicalName: string };
          ratio: { amount: number; basis: string; note: string | null };
          preservesRoles: string[];
          losesRoles: string[];
          validFor: {
            techniques: string[]; excludedTechniques: string[];
            dishTypes: string[]; excludedDishTypes: string[];
          } | null;
          effects: Sub['eff'];
          adjustments: Sub['adj'];
          reliability: string;
        };
        type RawIng = {
          id: string; canonicalName: string; roles: string[];
          substitutions: { edges: RawEdge[] };
        };

        const rows: RawIng[] = j?.data?.ingredients ?? [];
        const mapped: Ing[] = rows.map((r) => ({
          id: r.id,
          name: r.canonicalName,
          roles: r.roles ?? [],
          subs: (r.substitutions?.edges ?? []).map((e) => ({
            to: e.node.canonicalName,
            amount: e.ratio.amount,
            basis: e.ratio.basis === 'WEIGHT' ? 'by weight' : 'by volume',
            note: e.ratio.note,
            keeps: e.preservesRoles ?? [],
            loses: e.losesRoles ?? [],
            ok: [...(e.validFor?.techniques ?? []), ...(e.validFor?.dishTypes ?? [])],
            no: [...(e.validFor?.excludedTechniques ?? []), ...(e.validFor?.excludedDishTypes ?? [])],
            eff: e.effects ?? [],
            adj: e.adjustments ?? [],
            rel: e.reliability,
          })),
        }));
        mapped.sort((a, b) => {
          const ia = ORDER.indexOf(a.id);
          const ib = ORDER.indexOf(b.id);
          return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
        });
        setPantry(mapped);
      })
      .catch(() => {
        if (!cancelled) setPantry([]);
      });
    return () => { cancelled = true; };
  }, []);

  // The wordmark letters swapping into ingredient names.
  useEffect(() => {
    const t = setInterval(() => setLetter((n) => (n + 1) % WORD.length), 1700);
    return () => clearInterval(t);
  }, []);

  // Deep links, so a shared document link skips the curtain.
  useEffect(() => {
    const h = window.location.hash.replace(/^#/, '');
    if (!h) return;
    setGone(true);
    if (h.startsWith('doc/')) {
      const id = h.slice(4);
      if (DOCS.some((d) => d.id === id)) {
        setDocId(id);
        setScreen('doc');
      }
    } else if (h === 'pantry') setScreen('browse');
    else if (h === 'docs') setScreen('docs');
  }, []);

  useEffect(() => {
    if (!gone) return;
    const h =
      screen === 'doc' && docId ? `#doc/${docId}`
      : screen === 'docs' ? '#docs'
      : screen === 'browse' ? '#pantry'
      : '#find';
    if (window.location.hash !== h) window.history.replaceState(null, '', h);
  }, [screen, docId, gone]);

  // The reveal: hold the "you had" face until the cards are actually on screen.
  const maybeStart = useCallback(() => {
    const el = resultsEl.current;
    if (!el || !gone) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    const vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    if (vis > 0 && vis >= Math.min(r.height, vh) * 0.4) {
      if (flipTimer.current) clearTimeout(flipTimer.current);
      flipTimer.current = setTimeout(() => setFlipped(true), 1200);
    }
  }, [gone]);

  const stage = useCallback(() => {
    if (flipTimer.current) clearTimeout(flipTimer.current);
    setFlipped(false);
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

  const current = useMemo(() => pantry.find((p) => p.id === ing), [pantry, ing]);
  const matches = useCallback((s: Sub) => sit === 'ANY' || s.ok.includes(sit), [sit]);
  const results = useMemo(() => (current?.subs ?? []).filter(matches), [current, matches]);

  const sitLabel = useMemo(() => {
    for (const g of SITS) for (const it of g.items) if (it[0] === sit) return it[1];
    return '';
  }, [sit]);
  const sitGroupIdx = useMemo(() => SITS.findIndex((g) => g.items.some((x) => x[0] === sit)), [sit]);
  const phrase = sit === 'ANY' ? 'anywhere' : (sitGroupIdx === 3 ? `when ${sitLabel}` : `in ${sitLabel}`);
  const failsHere = sit !== 'ANY' && (current?.subs ?? []).some((s) => s.no.includes(sit));
  const lowerName = (current?.name ?? '').toLowerCase();

  const enter = useCallback(() => {
    if (flipTimer.current) clearTimeout(flipTimer.current);
    setGone(true);
    setFlipped(false);
    setTimeout(maybeStart, 950);
  }, [maybeStart]);

  const toCover = useCallback(() => {
    setGone(false);
    setScreen('home');
    window.scrollTo(0, 0);
    stage();
  }, [stage]);

  const openDoc = (d: Doc) => { setDocId(d.id); setScreen('doc'); window.scrollTo(0, 0); };
  const activeDoc = DOCS.find((d) => d.id === docId) ?? DOCS[0];
  const nav = (k: Screen) => ({ 'aria-current': (screen === k ? 'page' : undefined) as 'page' | undefined });

  return (
    <div className="shell">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <header className="topbar">
          <div className="topbar-in">
            <button className="brandbtn" onClick={() => { setScreen('home'); stage(); }}>
              <Pepper size={24} wag />
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <span>swap</span><span className="rika">rika</span>
              </span>
            </button>
            <nav className="mainnav">
              <button className="navbtn" {...nav('home')} onClick={() => { setScreen('home'); stage(); }}>Find a swap</button>
              <button className="navbtn" {...nav('browse')} onClick={() => setScreen('browse')}>Ingredients</button>
              <button className="navbtn" {...nav('docs')} onClick={() => setScreen('docs')}>Documents</button>
              <a className="devlink" href="/graphql">For developers &#8599;</a>
              <span className="navsep" />
              <button className="coverbtn" title="Back to the cover" onClick={toCover}>&#8593; Cover</button>
              <button className="signin" title="Sign in is not built yet" aria-disabled="true">Sign in</button>
            </nav>
          </div>
        </header>

        {/* FIND A SWAP */}
        <main className={`wrap ${screen === 'home' ? '' : 'is-hidden'}`}>
          <div className="screen-head">
            <div className="blob blob-sage" style={{ right: -40, top: -70, width: 280, height: 280 }} />
            <Pepper size={120} wag shine className="deco" style={{ right: 30, top: -46, animation: 'sway 7s ease-in-out infinite' }} />
            <Pepper size={54} mono="var(--color-accent-2)" noLeaf className="deco" style={{ right: 190, top: 110, opacity: .28, animation: 'drift 19s ease-in-out infinite 3s' }} />
            <div className="inner">
              <p className="kicker">Start with the situation</p>
              <h1>A swap is only true somewhere.</h1>
              <p className="say">Butter becomes oil in a cake and ruins a croissant. Tell us where you are cooking, then what ran out.</p>
            </div>
          </div>

          <section className="stepcard">
            <div className="steprow">
              <span className="stepnum">1</span>
              <h2>Where are you cooking?</h2>
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
                  onClick={() => { setSit(code); stage(); }}>
                  {label}
                </button>
              ))}
            </div>

            <div className="steprow">
              <span className="stepnum">2</span>
              <h2>What ran out?</h2>
              <span className="stephint">
                {sit === 'ANY' ? 'anything in the pantry' : `the number is how many swaps hold up ${phrase}`}
              </span>
            </div>
            <div className="chiprow last">
              {pantry.map((p) => {
                const works = p.subs.filter((s) => sit === 'ANY' || s.ok.includes(sit)).length;
                const fails = sit !== 'ANY' && p.subs.some((s) => s.no.includes(sit));
                return (
                  <button key={p.id} className={`pill ing${works ? '' : ' dead'}`} aria-pressed={ing === p.id}
                    onClick={() => { setIng(p.id); stage(); }}>
                    {p.name}
                    <span className="hint">{works ? works : fails ? 'fails' : EM}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section ref={resultsEl}>
            <div className="results-head">
              <h2>
                {results.length
                  ? `Instead of ${lowerName}, ${phrase}`
                  : sit === 'ANY'
                    ? `Nothing recorded for ${lowerName}`
                    : `No ${lowerName} swap is verified ${phrase}`}
              </h2>
              <span className="results-count">{results.length} {results.length === 1 ? 'swap' : 'swaps'}</span>
            </div>

            {results.length > 0 ? (
              <div className="grid-cards">
                {results.map((r, i) => (
                  <article key={`${r.to}-${i}`} className="swap" style={{ animationDelay: `${i * 90}ms` }}>
                    <div className="strip-outer">
                      <div className="strip" style={{ transform: `rotateX(${flipped ? -180 : 0}deg)`, transitionDelay: `${i * 260}ms` }}>
                        <div className="face face-a">
                          <small>you had</small>
                          <strong>{current?.name}</strong>
                        </div>
                        <div className="face face-b">
                          <small>use instead</small>
                          <strong>{r.to}</strong>
                        </div>
                      </div>
                      <div className="swapbadge" style={{
                        background: flipped ? 'rgba(251,234,222,.22)' : 'var(--paprika)',
                        color: flipped ? 'var(--curtain-ink)' : '#fff',
                        transform: `rotate(${flipped ? 180 : 0}deg)`,
                        transitionDelay: `${i * 260}ms`,
                      }}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M16 3h5v5" /><path d="M21 3 9 15" /><path d="M8 21H3v-5" /><path d="M3 21 15 9" />
                        </svg>
                      </div>
                    </div>

                    <div className="swap-body">
                      <div className="ratio-row">
                        <span className="ratio-n">{r.amount}&times;</span>
                        <span className="ratio-b">{r.basis}</span>
                        <span className={`rel ${r.rel.toLowerCase()}`}>{r.rel.toLowerCase()}</span>
                      </div>
                      {r.note && <p className="swap-note">{r.note}</p>}
                      <div className="roletags">
                        {r.keeps.map((k) => <span key={k} className="roletag keeps">keeps {human(k)}</span>)}
                        {r.loses.map((l) => <span key={l} className="roletag loses">loses {human(l)}</span>)}
                      </div>
                      {r.eff.map((e) => (
                        <p key={e.dimension} className="eff">
                          <b>{sentence(e.dimension)} {human(e.direction)}{e.note ? ` ${EM}` : ''}</b> {e.note}
                        </p>
                      ))}
                      {r.adj.map((a) => (
                        <p key={a.action} className="adj">
                          <b>{sentence(a.action)} {EM} </b>
                          {[a.amount, a.reason].filter(Boolean).join(` ${EM} `)}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-mark">{EM}</div>
                <h3>{failsHere ? 'Known to fail here.' : 'No verified substitution.'}</h3>
                <p>
                  {failsHere
                    ? 'This is recorded as a failure, not a gap. Every other food API would still hand you an answer and ruin the dish.'
                    : 'We have not tested this combination. Saying nothing beats guessing.'}
                </p>
              </div>
            )}
          </section>
        </main>

        {/* INGREDIENTS */}
        <main className={`wrap ${screen === 'browse' ? '' : 'is-hidden'}`}>
          <div className="screen-head head-sm" style={{ maxWidth: '46ch' }}>
            <div className="blob blob-leaf" style={{ right: -300, top: -80, width: 260, height: 260 }} />
            <p className="kicker" style={{ position: 'relative', zIndex: 1 }}>The pantry</p>
            <h1>Eleven ingredients, twenty one verified swaps.</h1>
            <p>Every edge was written by hand because context changes the answer. Pick one to see where it can go.</p>
          </div>
          <div className="grid-pantry">
            {pantry.map((p) => (
              <button key={p.id} className="tile pantry"
                onClick={() => { setIng(p.id); setSit('ANY'); setTab(0); setScreen('home'); stage(); window.scrollTo(0, 0); }}>
                <span className="tile-name">
                  <Pepper size={17} style={{ flex: 'none' }} />
                  <strong>{p.name}</strong>
                </span>
                <span className="tile-role">{p.roles.slice(0, 3).map(human).join(` ${MIDDOT} `)}</span>
                <span className="tile-tos">
                  {[...new Set(p.subs.map((s) => s.to))].slice(0, 3).map((t) => <span key={t}>{t}</span>)}
                </span>
                <span className="tile-go">
                  {p.subs.length} {p.subs.length === 1 ? 'verified swap' : 'verified swaps'} &rarr;
                </span>
              </button>
            ))}
          </div>
        </main>

        {/* DOCUMENTS */}
        <main className={`wrap ${screen === 'docs' ? '' : 'is-hidden'}`}>
          <div className="head-sm" style={{ maxWidth: '46ch', marginBottom: 30 }}>
            <p className="kicker">Open by default</p>
            <h1>Every document, in the open.</h1>
            <p>The guide, the decisions behind the model, the schema and both licences. No account needed to read any of it.</p>
          </div>
          {DOC_GROUPS.map((g) => (
            <section key={g.name} style={{ marginBottom: 30 }}>
              <p className="group-label">{g.name}</p>
              <div className="grid-docs">
                {g.items.map((d) => (
                  <button key={d.id} className="tile doc" onClick={() => openDoc(d)}>
                    <span className="docmark">
                      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 7v14" />
                        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                      </svg>
                    </span>
                    <span className="doc-kicker">{d.kicker}</span>
                    <span className="doc-title">{d.title}</span>
                    <span className="doc-sum">{d.summary}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </main>

        {/* ONE DOCUMENT */}
        <main className={`wrap ${screen === 'doc' ? '' : 'is-hidden'}`} style={{ paddingTop: 34 }}>
          <button className="backlink" onClick={() => setScreen('docs')}>&larr; All documents</button>
          <article className="reader">
            <p className="kicker">{activeDoc.kicker}</p>
            <h1>{activeDoc.title}</h1>
            {activeDoc.blocks.map((b) => (
              <section key={b.h}>
                <h2>{b.h}</h2>
                {b.ps.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
                {b.code && <pre><code>{b.code}</code></pre>}
              </section>
            ))}
          </article>
        </main>

        <footer className="foot">
          <div className="foot-in">
            <button onClick={toCover}>&#8593; Back to the cover</button>
            <span>Swaprika {MIDDOT} context aware ingredient substitution</span>
            <span>
              Code MIT {MIDDOT} Data CC BY-NC-SA 4.0 {MIDDOT}{' '}
              <a href="https://github.com/n3ndor/swaprika">source</a>
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
            Twenty one substitutions that know where they work, and say nothing where they do not.
          </p>

          <div className="enter-wrap">
            <button className="enterbtn" onClick={enter}>
              Enter
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h13" /><path d="m12 5 7 7-7 7" />
              </svg>
            </button>
            <span className="enter-note">A sign in will live here later</span>
          </div>
        </div>
      </div>
    </div>
  );
}
