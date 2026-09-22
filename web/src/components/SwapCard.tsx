import type { CSSProperties } from 'react';
import type { Rel, Swap } from '../data/swaps';

/** The design sets copy with em dashes; repo style bans the literal glyph. */
export const EM = String.fromCharCode(0x2014);
export const MIDDOT = String.fromCharCode(0x00b7);

export const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Plain words instead of internal codes, with a line saying what each means. */
export const REL: Record<Rel, { label: string; hint: string; cls: string }> = {
  ESTABLISHED: { label: 'reliable', hint: 'Widely used and dependable.', cls: 'established' },
  SITUATIONAL: { label: 'works with care', hint: 'It works, as long as you follow the notes.', cls: 'situational' },
  CONTESTED: { label: 'risky', hint: 'Cooks disagree. Try a small batch first.', cls: 'contested' },
};

const Mark = ({ n, on }: { n: number; on?: boolean }) =>
  on ? <span className="mark" aria-hidden="true">{n}</span> : null;

export function SwapCard({
  swap,
  fromName,
  flipped,
  delay = '0ms',
  onFlip,
  annotate = false,
  style,
}: {
  swap: Swap;
  fromName: string;
  flipped: boolean;
  delay?: string;
  onFlip: () => void;
  /** Numbered markers for the How it works page. */
  annotate?: boolean;
  style?: CSSProperties;
}) {
  const rel = REL[swap.rel];
  return (
    <article className="swap" style={style}>
      <div className="strip-outer">
        <Mark n={1} on={annotate} />
        <div className="strip" style={{ transform: `rotateX(${flipped ? -180 : 0}deg)`, transitionDelay: delay }}>
          <div className="face face-a">
            <small>you had</small>
            <strong>{fromName}</strong>
          </div>
          <div className="face face-b">
            <small>use instead</small>
            <strong>{swap.to}</strong>
          </div>
        </div>
        <button
          type="button"
          className="swapbadge"
          aria-pressed={flipped}
          aria-label={flipped ? `Show ${fromName} again` : `Show ${swap.to}`}
          title="Flip the card"
          onClick={onFlip}
          style={{
            background: flipped ? 'rgba(251,234,222,.22)' : 'var(--paprika)',
            color: flipped ? 'var(--curtain-ink)' : '#fff',
            transform: `rotate(${flipped ? 180 : 0}deg)`,
            transitionDelay: delay,
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 3h5v5" /><path d="M21 3 9 15" /><path d="M8 21H3v-5" /><path d="M3 21 15 9" />
          </svg>
        </button>
      </div>

      <div className="swap-body">
        <div className="ratio-row">
          <Mark n={2} on={annotate} />
          <span className="ratio-n">{swap.amount}&times;</span>
          <span className="ratio-b">{swap.basis === 'WEIGHT' ? 'by weight' : 'by volume'}</span>
          <span className={`rel ${rel.cls}`} title={rel.hint}>
            {annotate && <span className="mark inline" aria-hidden="true">3</span>}
            {rel.label}
          </span>
        </div>
        {swap.note && <p className="swap-note">{swap.note}</p>}
        <div className="roletags">
          <Mark n={4} on={annotate} />
          {swap.keeps.map((k) => <span key={k} className="roletag keeps">keeps {k}</span>)}
          {swap.loses.map((l) => <span key={l} className="roletag loses">loses {l}</span>)}
        </div>
        {(swap.eff ?? []).map(([dim, dir, note], i) => (
          <p key={dim} className="eff">
            {i === 0 && <Mark n={5} on={annotate} />}
            <b>{sentence(dim)} {dir}{note ? ` ${EM}` : ''}</b> {note}
          </p>
        ))}
        {(swap.adj ?? []).map(([what, detail], i) => (
          <p key={what} className="adj">
            {i === 0 && <Mark n={6} on={annotate} />}
            <b>{sentence(what)} {EM} </b>{detail}
          </p>
        ))}
      </div>
    </article>
  );
}
