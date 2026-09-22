import { useState } from 'react';
import { INGREDIENTS, SITUATIONS, SWAPS } from '../data/swaps';
import { REL, SwapCard } from './SwapCard';

type Try = (sit: string, ing: string) => void;

const worksFor = (sit: string, ing: string) =>
  SWAPS.filter((s) => s.from === ing && s.ok.includes(sit)).length;

const labelOf = (code: string) => SITUATIONS.flatMap((g) => g.items).find((x) => x[0] === code)?.[1] ?? code;

const TryBtn = ({ sit, ing, onTry, children }: { sit: string; ing: string; onTry: Try; children: string }) => (
  <button type="button" className="trybtn" onClick={() => onTry(sit, ing)}>
    {children} &rarr;
  </button>
);

/** Every fact opens a case where the swap works, so the link always lands on cards. */
export const FACTS: { text: string; sit: string; ing: string }[] = [
  { text: 'Sunflower seed butter can turn the inside of a cookie green when it meets baking soda. It is harmless, and a squeeze of lemon stops it.', sit: 'COOKIE', ing: 'peanut-butter' },
  { text: 'Honey browns much faster than sugar. Swap it in and drop the oven by about 15 C, or the outside burns before the middle sets.', sit: 'CAKE', ing: 'sugar' },
  { text: 'Agar only sets after a full boil. Gelatin is the opposite: boil it and it stops setting.', sit: 'SET_DESSERT', ing: 'gelatin' },
  { text: 'Fresh yeast is used at about two and a half times the weight of dry yeast.', sit: 'BREAD', ing: 'yeast' },
  { text: 'Cornstarch thickens twice as hard as flour, but thins out again if it boils for too long.', sit: 'THICKENING', ing: 'wheat-flour' },
  { text: 'Dried herbs are used at a third of the fresh amount, and they go in early. Fresh ones go in at the end.', sit: 'SOUP', ing: 'fresh-herbs' },
  { text: 'Butter is about 16 percent water. Swap it for oil and you have to put that water back.', sit: 'CAKE', ing: 'butter' },
  { text: 'Melted coconut oil works in place of vegetable oil in a cake, but it sets below about 24 C, so keep everything at room temperature.', sit: 'CAKE', ing: 'vegetable-oil' },
];

/** Every "Show me" target on this page, so a check can prove each one lands on cards. */
export const HOW_TARGETS: [string, string][] = [
  ['PANCAKE', 'buttermilk'], ['CROISSANT', 'yeast'], ['FRIED_CHICKEN', 'buttermilk'],
  ['THICKENING', 'wheat-flour'], ['DEEP_FRYING', 'wheat-flour'],
  ...FACTS.map((f): [string, string] => [f.sit, f.ing]),
];

export default function HowItWorks({ onTry, dishes }: { onTry: Try; dishes: number }) {
  const sample = SWAPS.find((s) => s.from === 'butter' && s.to === 'Neutral oil')!;
  const [flipped, setFlipped] = useState(true);

  return (
    <div className="how">
      <div className="head-sm how-head">
        <p className="kicker">How it works</p>
        <h1>The right swap depends on the dish.</h1>
        <p>
          Most substitution lists give one answer for every recipe, and that is exactly where
          cooking goes wrong. Oil saves a cake and ruins a croissant. Yogurt rescues pancakes and
          splits in a hot sauce. Swaprika starts from what you are making, so the answer fits the
          dish in front of you.
        </p>
      </div>

      <section className="how-section">
        <h2>Three steps</h2>
        <div className="steps3">
          <div className="step3">
            <span className="stepnum">1</span>
            <h3>Say what you are making</h3>
            <p>A cake, a stir fry, a custard, or a technique such as whipping or deep frying.</p>
          </div>
          <div className="step3">
            <span className="stepnum">2</span>
            <h3>Say what is missing</h3>
            <p>Only the ingredients that have a swap for that dish are offered. The number on each one is how many swaps work there.</p>
          </div>
          <div className="step3">
            <span className="stepnum">3</span>
            <h3>Read the card</h3>
            <p>What to use, how much, what changes, and what to adjust. Tap the arrow to flip between what you had and what to use.</p>
          </div>
        </div>
      </section>

      <section className="how-section">
        <h2>How to read a card</h2>
        <div className="anatomy">
          <div className="anatomy-card">
            <SwapCard swap={sample} fromName="Butter" flipped={flipped} onFlip={() => setFlipped((f) => !f)} annotate
              avoid={sample.no.map(labelOf)} />
          </div>
          <ol className="anatomy-list">
            <li><b>The flip.</b> What you had on one side, what to use on the other. The arrow turns it back and forth.</li>
            <li><b>The amount.</b> How much of the new ingredient for each unit of the old, and whether you weigh it or measure it. 0.8 by weight is not the same as 0.8 by volume.</li>
            <li>
              <b>How reliable it is.</b>{' '}
              <span className="rel established">{REL.ESTABLISHED.label}</span> {REL.ESTABLISHED.hint}{' '}
              <span className="rel situational">{REL.SITUATIONAL.label}</span> {REL.SITUATIONAL.hint}{' '}
              <span className="rel contested">{REL.CONTESTED.label}</span> {REL.CONTESTED.hint}
            </li>
            <li><b>What it keeps and loses.</b> Every ingredient does jobs in a dish. This shows which jobs survive the swap. The loses list is usually the one that matters. Underneath, <b>Not for</b> lists dishes where you should not use this swap.</li>
            <li><b>What changes.</b> Flavour, texture, rise, browning and colour, described in words rather than scores.</li>
            <li><b>What to adjust.</b> The fix that makes the swap work, such as putting water back or lowering the oven.</li>
          </ol>
        </div>
      </section>

      <section className="how-section">
        <h2>Only what works is shown</h2>
        <p className="how-say">
          Every card on the page is a swap you can actually use for the dish you picked. If an
          ingredient has no good swap there, it is simply not offered, instead of handing you
          something that looks right and ruins the recipe.
        </p>
        <div className="answers">
          <div className="answer works">
            <h3>Pancakes without buttermilk</h3>
            <p>{worksFor('PANCAKE', 'buttermilk')} swaps that hold up, from kefir to milk with a spoon of lemon.</p>
            <TryBtn sit="PANCAKE" ing="buttermilk" onTry={onTry}>Show me</TryBtn>
          </div>
          <div className="answer works">
            <h3>A croissant</h3>
            <p>
              Only the yeast can be swapped. Nothing replaces the butter in laminated dough, so butter
              is not even offered.
            </p>
            <TryBtn sit="CROISSANT" ing="yeast" onTry={onTry}>Show me</TryBtn>
          </div>
        </div>
      </section>

      <section className="how-section">
        <h2>Same two ingredients, different answers</h2>
        <p className="how-say">
          A swap is not a fixed pair. The same two ingredients can be right in one dish and wrong in
          the next, because the ingredient is doing a different job.
        </p>
        <div className="pairs">
          <div className="pair">
            <h3>Buttermilk to milk with lemon</h3>
            <p>In pancakes the acid has to react with baking soda to lift the batter. In a fried chicken brine the same acid tenderises the meat, and the thin milk clings less to the coating.</p>
            <div className="pair-tries">
              <TryBtn sit="PANCAKE" ing="buttermilk" onTry={onTry}>In pancakes</TryBtn>
              <TryBtn sit="FRIED_CHICKEN" ing="buttermilk" onTry={onTry}>In fried chicken</TryBtn>
            </div>
          </div>
          <div className="pair">
            <h3>Flour to cornstarch</h3>
            <p>To thicken a sauce you need only half as much, and it must not boil for long. As a coating you use the same amount, and it fries crisper than flour ever does.</p>
            <div className="pair-tries">
              <TryBtn sit="THICKENING" ing="wheat-flour" onTry={onTry}>Thickening</TryBtn>
              <TryBtn sit="DEEP_FRYING" ing="wheat-flour" onTry={onTry}>Deep frying</TryBtn>
            </div>
          </div>
        </div>
      </section>

      <section className="how-section">
        <h2>Things you learn from the pantry</h2>
        <div className="facts-grid">
          {FACTS.map((f) => (
            <div key={f.text} className="factcard">
              <p>{f.text}</p>
              <TryBtn sit={f.sit} ing={f.ing} onTry={onTry}>See the swap</TryBtn>
            </div>
          ))}
        </div>
      </section>

      <section className="how-section">
        <h2>Where this comes from</h2>
        <p className="how-say">
          Every swap is written by hand from common, well established kitchen knowledge, the kind of
          advice you find in a good cookbook, and then tied to the dishes it suits. None of it has
          been lab tested. Taste as you go. If you are cooking for someone with an allergy, read
          every label: a swap that removes dairy can bring in soy or nuts.
        </p>
        <div className="stats stats3">
          <div><b>{INGREDIENTS.length}</b><span>ingredients</span></div>
          <div><b>{SWAPS.length}</b><span>swaps</span></div>
          <div><b>{dishes}</b><span>dishes and techniques</span></div>
        </div>
      </section>
    </div>
  );
}
