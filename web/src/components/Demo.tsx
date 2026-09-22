import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Mascot, type Mood } from './Mascot';

type Plan = 'FREE' | 'DEVELOPER';

interface Preset {
  label: string;
  technique?: string;
  dishType?: string;
  hint?: string;
}

const INGREDIENTS = [
  { id: 'butter', label: 'Butter' },
  { id: 'egg', label: 'Egg' },
  { id: 'egg-white', label: 'Egg white' },
  { id: 'sugar', label: 'Sugar' },
  { id: 'wheat-flour', label: 'Wheat flour' },
  { id: 'buttermilk', label: 'Buttermilk' },
  { id: 'cornstarch', label: 'Cornstarch' },
  { id: 'heavy-cream', label: 'Heavy cream' },
  { id: 'fish-sauce', label: 'Fish sauce' },
];

const PRESETS: Preset[] = [
  { label: 'anywhere' },
  { label: 'in a cake', dishType: 'CAKE' },
  { label: 'in a cookie', dishType: 'COOKIE' },
  { label: 'in a croissant', technique: 'LAMINATION', hint: 'lamination' },
  { label: 'pan frying', technique: 'PAN_FRYING' },
  { label: 'whipping', technique: 'WHIPPING' },
  { label: 'thickening a sauce', technique: 'THICKENING' },
  { label: 'in a curry', dishType: 'CURRY' },
];

interface Edge {
  node: { canonicalName: string };
  ratio: { amount: number; basis: string; note: string | null };
  preservesRoles: string[];
  losesRoles: string[];
  validFor?: { excludedTechniques: string[]; excludedDishTypes: string[] } | null;
  effects?: { dimension: string; direction: string; note: string | null }[] | null;
  adjustments?: { action: string; amount: string | null; reason: string | null }[] | null;
  reliability?: string | null;
}

function buildQuery(id: string, preset: Preset, vegan: boolean, plan: Plan): string {
  const ctx: string[] = [];
  if (preset.technique) ctx.push(`technique: ${preset.technique}`);
  if (preset.dishType) ctx.push(`dishType: ${preset.dishType}`);
  if (vegan) ctx.push('requires: [VEGAN]');
  const arg = ctx.length ? `(context: { ${ctx.join(', ')} })` : '';

  const paidFields =
    plan === 'DEVELOPER'
      ? `
        validFor { excludedTechniques excludedDishTypes }
        effects { dimension direction note }
        adjustments { action amount reason }
        reliability`
      : '';

  return `query {
  ingredient(id: "${id}") {
    canonicalName
    substitutions${arg} {
      edges {
        node { canonicalName }
        ratio { amount basis note }
        preservesRoles
        losesRoles${paidFields}
      }
    }
  }
}`;
}

const humanise = (s: string) => s.toLowerCase().replace(/_/g, ' ');

export default function Demo() {
  const [ingredient, setIngredient] = useState('butter');
  const [presetIndex, setPresetIndex] = useState(1);
  const [vegan, setVegan] = useState(true);
  const [plan, setPlan] = useState<Plan>('DEVELOPER');

  const [edges, setEdges] = useState<Edge[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);

  const preset = PRESETS[presetIndex];
  const query = useMemo(
    () => buildQuery(ingredient, preset, vegan, plan),
    [ingredient, preset, vegan, plan],
  );

  const run = useCallback(async () => {
    setLoading(true);
    setErrored(false);
    try {
      const res = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': plan === 'DEVELOPER' ? 'dev-key' : 'free-key',
        },
        body: JSON.stringify({ query }),
      });
      const json = await res.json();
      setEdges(json?.data?.ingredient?.substitutions?.edges ?? []);
    } catch {
      setErrored(true);
      setEdges([]);
    } finally {
      setLoading(false);
    }
  }, [query, plan]);

  useEffect(() => {
    void run();
  }, [run]);

  const mood: Mood = loading
    ? 'thinking'
    : edges === null
      ? 'idle'
      : edges.length === 0
        ? 'sad'
        : 'happy';

  return (
    <div className="demo">
      <div className="demo-controls">
        <div className="sentence">
          <span>What can replace</span>
          <select value={ingredient} onChange={(e) => setIngredient(e.target.value)}>
            {INGREDIENTS.map((i) => (
              <option key={i.id} value={i.id}>{i.label}</option>
            ))}
          </select>
          <select value={presetIndex} onChange={(e) => setPresetIndex(Number(e.target.value))}>
            {PRESETS.map((p, i) => (
              <option key={p.label} value={i}>{p.label}</option>
            ))}
          </select>
          <span>?</span>
        </div>

        <div className="toggles">
          <button
            className={vegan ? 'chip on' : 'chip'}
            onClick={() => setVegan((v) => !v)}
            aria-pressed={vegan}
          >
            must be vegan
          </button>

          <div className="plan-switch" role="group" aria-label="Plan">
            {(['FREE', 'DEVELOPER'] as Plan[]).map((p) => (
              <button
                key={p}
                className={plan === p ? 'seg on' : 'seg'}
                onClick={() => setPlan(p)}
                aria-pressed={plan === p}
              >
                {p === 'FREE' ? 'Free key' : 'Paid key'}
              </button>
            ))}
          </div>
        </div>
        <p className="plan-note">
          {plan === 'FREE'
            ? 'A free key resolves the ratio and the roles. The rest is withheld by the schema itself.'
            : 'A paid key unlocks effects, adjustments, reliability and the exclusion lists.'}
        </p>
      </div>

      <div className="demo-body">
        <div className="demo-query">
          <div className="panel-label">the query actually being sent</div>
          <pre><code>{query}</code></pre>
        </div>

        <div className="demo-results">
          <div className="panel-label">
            {loading ? 'asking...' : `${edges?.length ?? 0} result${edges?.length === 1 ? '' : 's'}`}
          </div>

          <AnimatePresence mode="popLayout">
            {!loading && edges?.length === 0 && (
              <motion.div
                key="empty"
                className="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Mascot mood="sad" size={110} />
                <p>
                  {errored
                    ? 'The API did not answer. It may be waking up, try again.'
                    : 'Nothing verified for this one.'}
                </p>
                {!errored && (
                  <small>
                    Every other food API would still hand you an answer here. Returning
                    nothing is the honest result.
                  </small>
                )}
              </motion.div>
            )}

            {!loading &&
              edges?.map((e, i) => (
                <motion.article
                  key={e.node.canonicalName}
                  className="card"
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
                >
                  <header>
                    <h3>{e.node.canonicalName}</h3>
                    <span className="ratio">
                      {e.ratio.amount}&times; by {e.ratio.basis.toLowerCase()}
                    </span>
                  </header>

                  {e.ratio.note && <p className="note">{e.ratio.note}</p>}

                  <div className="roles">
                    {e.preservesRoles.map((r) => (
                      <span key={r} className="tag keeps">keeps {humanise(r)}</span>
                    ))}
                    {e.losesRoles.map((r) => (
                      <span key={r} className="tag loses">loses {humanise(r)}</span>
                    ))}
                  </div>

                  {plan === 'FREE' ? (
                    <div className="locked">
                      effects, adjustments and reliability withheld on a free key
                    </div>
                  ) : (
                    <>
                      {e.effects?.map((ef) => (
                        <p key={ef.dimension} className="effect">
                          <b>{humanise(ef.dimension)}</b> {humanise(ef.direction)}
                          {ef.note ? ` , ${ef.note}` : ''}
                        </p>
                      ))}
                      {e.adjustments?.map((a) => (
                        <p key={a.action} className="adjust">
                          <b>{humanise(a.action)}</b>
                          {a.amount ? `: ${a.amount}` : ''}
                          {a.reason ? ` (${a.reason})` : ''}
                        </p>
                      ))}
                      {e.reliability && (
                        <span className={`rel ${e.reliability.toLowerCase()}`}>
                          {e.reliability.toLowerCase()}
                        </span>
                      )}
                    </>
                  )}
                </motion.article>
              ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="demo-mascot">
        <Mascot mood={mood} size={120} />
      </div>
    </div>
  );
}
