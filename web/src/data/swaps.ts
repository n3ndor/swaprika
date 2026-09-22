/**
 * The whole dataset. It ships inside the page, so there is nothing to fetch and
 * nothing to host. Common kitchen knowledge, written by hand, so that every swap
 * says where it works and, just as usefully, where it does not.
 */

export type Rel = 'ESTABLISHED' | 'SITUATIONAL' | 'CONTESTED';

export interface Ingredient {
  id: string;
  name: string;
  group: string;
  roles: string[];
}

export interface Swap {
  from: string;
  to: string;
  amount: number;
  basis: 'WEIGHT' | 'VOLUME';
  note?: string;
  rel: Rel;
  keeps: string[];
  loses: string[];
  /** Situation codes where this swap works. */
  ok: string[];
  /** Situation codes where this swap is known to fail. */
  no: string[];
  /** [dimension, direction, note] */
  eff?: [string, string, string?][];
  /** [what to do, detail] */
  adj?: [string, string][];
}

export const SITUATIONS: { g: string; items: [string, string][] }[] = [
  { g: 'Anywhere', items: [['ANY', 'anywhere']] },
  {
    g: 'Baking',
    items: [
      ['CAKE', 'a cake'], ['COOKIE', 'cookies'], ['BROWNIES', 'brownies'], ['MUFFIN', 'muffins'],
      ['QUICK_BREAD', 'a quick bread'], ['BREAD', 'a yeast bread'], ['PIZZA', 'pizza dough'],
      ['PANCAKE', 'pancakes'], ['PIE_CRUST', 'a pie crust'], ['CROISSANT', 'a croissant'],
      ['SODA_BREAD', 'soda bread'],
    ],
  },
  {
    g: 'Desserts',
    items: [
      ['MERINGUE', 'a meringue'], ['MOUSSE', 'a mousse'], ['CUSTARD', 'a custard'],
      ['CHEESECAKE', 'a cheesecake'], ['SET_DESSERT', 'a panna cotta or jelly'],
      ['BUTTERCREAM', 'buttercream'],
    ],
  },
  {
    g: 'Savoury',
    items: [
      ['SOUP', 'a soup'], ['STEW', 'a stew or braise'], ['CURRY', 'a curry'], ['STIR_FRY', 'a stir fry'],
      ['PASTA_SAUCE', 'a pasta sauce'], ['QUICHE', 'a quiche'], ['MEATBALLS', 'meatballs'],
      ['FRIED_CHICKEN', 'fried chicken'], ['SUSHI_RICE', 'sushi rice'],
    ],
  },
  {
    g: 'Sauces and dressings',
    items: [
      ['PESTO', 'a pesto'], ['BECHAMEL', 'a bechamel'], ['MARINADE', 'a marinade'],
      ['VINAIGRETTE', 'a vinaigrette'], ['SALAD', 'a creamy salad'], ['DIPPING_SAUCE', 'a dipping sauce'],
      ['FRUIT_SAUCE', 'a fruit sauce'],
    ],
  },
  {
    g: 'Technique',
    items: [
      ['CREAMING', 'creaming'], ['RUBBING_IN', 'rubbing in'], ['WHIPPING', 'whipping'],
      ['THICKENING', 'thickening'], ['EMULSIFYING', 'emulsifying'], ['PAN_FRYING', 'pan frying'],
      ['DEEP_FRYING', 'deep frying'], ['BREADING', 'breading'], ['LAMINATION', 'laminating'],
      ['GLAZING', 'glazing'], ['BRINING', 'brining'], ['CARAMELISATION', 'caramelising'],
    ],
  },
];

const DAIRY = 'Dairy and eggs';
const FLOUR = 'Flour, starch and rising';
const SWEET = 'Sugar and sweet things';
const FATS = 'Fats, oils and spreads';
const SAUCE = 'Sauces, stocks and acids';
const AROMA = 'Herbs, aromatics and nuts';

/** Cooking order within each family, most common first. */
export const INGREDIENTS: Ingredient[] = [
  { id: 'butter', name: 'Butter', group: DAIRY, roles: ['fat', 'tenderiser', 'flavour'] },
  { id: 'egg', name: 'Egg', group: DAIRY, roles: ['binder', 'leavener', 'structure'] },
  { id: 'egg-white', name: 'Egg white', group: DAIRY, roles: ['foaming', 'structure'] },
  { id: 'egg-yolk', name: 'Egg yolk', group: DAIRY, roles: ['emulsifier', 'richness', 'colour'] },
  { id: 'milk', name: 'Milk', group: DAIRY, roles: ['liquid', 'browning'] },
  { id: 'buttermilk', name: 'Buttermilk', group: DAIRY, roles: ['acid', 'tenderiser'] },
  { id: 'heavy-cream', name: 'Heavy cream', group: DAIRY, roles: ['fat', 'richness'] },
  { id: 'sour-cream', name: 'Sour cream', group: DAIRY, roles: ['acid', 'richness'] },
  { id: 'cream-cheese', name: 'Cream cheese', group: DAIRY, roles: ['richness', 'acid', 'body'] },
  { id: 'ricotta', name: 'Ricotta', group: DAIRY, roles: ['moisture', 'body'] },
  { id: 'parmesan', name: 'Parmesan', group: DAIRY, roles: ['salt', 'umami'] },

  { id: 'wheat-flour', name: 'Wheat flour', group: FLOUR, roles: ['structure', 'thickener'] },
  { id: 'cake-flour', name: 'Cake flour', group: FLOUR, roles: ['tenderness', 'structure'] },
  { id: 'bread-flour', name: 'Bread flour', group: FLOUR, roles: ['structure', 'chew'] },
  { id: 'self-raising-flour', name: 'Self raising flour', group: FLOUR, roles: ['structure', 'leavener'] },
  { id: 'cornstarch', name: 'Cornstarch', group: FLOUR, roles: ['thickener', 'crispness'] },
  { id: 'baking-powder', name: 'Baking powder', group: FLOUR, roles: ['leavener'] },
  { id: 'baking-soda', name: 'Baking soda', group: FLOUR, roles: ['leavener', 'browning'] },
  { id: 'yeast', name: 'Active dry yeast', group: FLOUR, roles: ['leavener', 'flavour'] },
  { id: 'gelatin', name: 'Gelatin', group: FLOUR, roles: ['set'] },
  { id: 'breadcrumbs', name: 'Breadcrumbs', group: FLOUR, roles: ['binder', 'crunch'] },

  { id: 'sugar', name: 'Granulated sugar', group: SWEET, roles: ['sweetener', 'browning', 'tenderiser'] },
  { id: 'brown-sugar', name: 'Brown sugar', group: SWEET, roles: ['sweetener', 'moisture'] },
  { id: 'powdered-sugar', name: 'Powdered sugar', group: SWEET, roles: ['sweetener', 'smoothness'] },
  { id: 'honey', name: 'Honey', group: SWEET, roles: ['sweetener', 'moisture'] },
  { id: 'corn-syrup', name: 'Corn syrup', group: SWEET, roles: ['sweetener', 'smoothness'] },
  { id: 'molasses', name: 'Molasses', group: SWEET, roles: ['sweetener', 'colour', 'moisture'] },
  { id: 'cocoa-powder', name: 'Cocoa powder', group: SWEET, roles: ['flavour', 'colour'] },
  { id: 'dark-chocolate', name: 'Dark chocolate', group: SWEET, roles: ['flavour', 'fat', 'set'] },
  { id: 'vanilla-extract', name: 'Vanilla extract', group: SWEET, roles: ['aroma'] },

  { id: 'vegetable-oil', name: 'Vegetable oil', group: FATS, roles: ['fat', 'moisture'] },
  { id: 'mayonnaise', name: 'Mayonnaise', group: FATS, roles: ['fat', 'emulsifier'] },
  { id: 'peanut-butter', name: 'Peanut butter', group: FATS, roles: ['fat', 'flavour', 'binder'] },

  { id: 'soy-sauce', name: 'Soy sauce', group: SAUCE, roles: ['salt', 'umami'] },
  { id: 'fish-sauce', name: 'Fish sauce', group: SAUCE, roles: ['umami', 'salt'] },
  { id: 'worcestershire', name: 'Worcestershire sauce', group: SAUCE, roles: ['umami', 'acid'] },
  { id: 'tomato-paste', name: 'Tomato paste', group: SAUCE, roles: ['umami', 'colour'] },
  { id: 'dijon-mustard', name: 'Dijon mustard', group: SAUCE, roles: ['emulsifier', 'heat'] },
  { id: 'chicken-stock', name: 'Chicken stock', group: SAUCE, roles: ['liquid', 'umami'] },
  { id: 'coconut-milk', name: 'Coconut milk', group: SAUCE, roles: ['fat', 'liquid', 'flavour'] },
  { id: 'white-wine', name: 'White wine', group: SAUCE, roles: ['acid', 'aroma'] },
  { id: 'red-wine', name: 'Red wine', group: SAUCE, roles: ['acid', 'colour', 'aroma'] },
  { id: 'lemon-juice', name: 'Lemon juice', group: SAUCE, roles: ['acid', 'aroma'] },
  { id: 'rice-vinegar', name: 'Rice vinegar', group: SAUCE, roles: ['acid', 'aroma'] },

  { id: 'fresh-herbs', name: 'Fresh herbs', group: AROMA, roles: ['aroma', 'colour'] },
  { id: 'garlic', name: 'Fresh garlic', group: AROMA, roles: ['aroma', 'bite'] },
  { id: 'onion', name: 'Onion', group: AROMA, roles: ['sweetness', 'aroma'] },
  { id: 'ginger', name: 'Fresh ginger', group: AROMA, roles: ['aroma', 'heat'] },
  { id: 'pine-nuts', name: 'Pine nuts', group: AROMA, roles: ['fat', 'flavour'] },
];

export const INGREDIENT_GROUPS = [DAIRY, FLOUR, SWEET, FATS, SAUCE, AROMA];

export const SWAPS: Swap[] = [
  // ─── Butter ───────────────────────────────────────────────────────────────
  {
    from: 'butter', to: 'Coconut oil', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'Use refined coconut oil if you do not want it to taste of coconut.',
    keeps: ['fat'], loses: ['dairy flavour'],
    ok: ['CREAMING', 'CAKE', 'COOKIE', 'MUFFIN', 'BROWNIES'], no: ['BUTTERCREAM', 'LAMINATION', 'CROISSANT'],
    eff: [['flavour', 'more', 'A coconut note unless the oil is refined.'], ['texture', 'less', 'Sets harder when cold, so chill doughs for less time.']],
  },
  {
    from: 'butter', to: 'Neutral oil', amount: 0.8, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'Butter is roughly 80 percent fat and 16 percent water. Match the fat, then put the water back.',
    keeps: ['fat'], loses: ['water content', 'creamed air'],
    ok: ['CAKE', 'MUFFIN', 'QUICK_BREAD', 'BROWNIES', 'PAN_FRYING'], no: ['CREAMING', 'LAMINATION', 'CROISSANT', 'BUTTERCREAM', 'PIE_CRUST'],
    eff: [['moisture', 'more', 'Oil coats the flour more completely, so the crumb reads moister.'], ['rise', 'less', 'No air is beaten in, because oil cannot be creamed.']],
    adj: [['add liquid', 'About 15 percent of the butter weight, since butter carries water that oil does not.']],
  },
  {
    from: 'butter', to: 'Vegan butter block', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'A firm block, not a soft tub spread. Tubs carry too much water.',
    keeps: ['fat'], loses: ['lamination plasticity'],
    ok: ['CREAMING', 'RUBBING_IN', 'COOKIE', 'CAKE', 'PIE_CRUST', 'BUTTERCREAM'], no: ['LAMINATION', 'CROISSANT'],
    eff: [['texture', 'less', 'Will not hold separate layers through repeated folding.']],
  },
  {
    from: 'butter', to: 'Vegetable shortening', amount: 0.8, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'Shortening is pure fat, so you need less of it than butter.',
    keeps: ['fat', 'tenderiser'], loses: ['dairy flavour', 'water content'],
    ok: ['PIE_CRUST', 'RUBBING_IN', 'COOKIE', 'BUTTERCREAM'], no: [],
    eff: [['texture', 'more', 'A flakier, more tender crust.'], ['flavour', 'less', 'Tastes of very little. Butter was doing more than you think.']],
  },
  {
    from: 'butter', to: 'Lard', amount: 0.8, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'The old fashioned pastry fat. Not for vegetarians.',
    keeps: ['fat', 'tenderiser'], loses: ['dairy flavour'],
    ok: ['PIE_CRUST', 'RUBBING_IN', 'PAN_FRYING', 'DEEP_FRYING'], no: ['BUTTERCREAM', 'CAKE'],
    eff: [['texture', 'more', 'Exceptionally flaky pastry.'], ['flavour', 'more', 'Faintly savoury, which suits a meat pie better than a fruit tart.']],
  },
  {
    from: 'butter', to: 'Olive oil', amount: 0.8, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['fat'], loses: ['dairy flavour', 'browning'],
    ok: ['PAN_FRYING', 'PASTA_SAUCE', 'SOUP', 'STEW'], no: ['BUTTERCREAM', 'PIE_CRUST', 'LAMINATION'],
    eff: [['flavour', 'more', 'Peppery, and it carries into the finished dish.'], ['browning', 'less', 'No milk solids, so none of the nutty taste of browned butter.']],
  },
  {
    from: 'butter', to: 'Ghee', amount: 0.8, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'Ghee is butter with the water and milk solids cooked out, so it is almost pure fat.',
    keeps: ['fat', 'dairy flavour'], loses: ['water content'],
    ok: ['PAN_FRYING', 'CURRY', 'DEEP_FRYING'], no: ['BUTTERCREAM', 'CREAMING'],
    eff: [['flavour', 'more', 'Nutty and toasty.'], ['browning', 'same', 'Takes far more heat before it burns, because the milk solids are gone.']],
  },
  {
    from: 'butter', to: 'Applesauce', amount: 0.5, basis: 'WEIGHT', rel: 'SITUATIONAL',
    note: 'Replace at most half the butter. Full replacement turns the crumb rubbery.',
    keeps: ['moisture'], loses: ['fat', 'tenderiser'],
    ok: ['MUFFIN', 'QUICK_BREAD', 'BROWNIES'], no: ['PIE_CRUST', 'COOKIE', 'LAMINATION'],
    eff: [['texture', 'less', 'Rubbery if you replace more than half.'], ['browning', 'less']],
  },
  {
    from: 'butter', to: 'Greek yogurt', amount: 0.5, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Replace up to half the butter, using half as much yogurt as the butter you took out.',
    keeps: ['moisture', 'tenderiser'], loses: ['fat'],
    ok: ['MUFFIN', 'QUICK_BREAD', 'CAKE'], no: ['COOKIE', 'PIE_CRUST', 'BUTTERCREAM'],
    eff: [['flavour', 'more', 'A light tang.'], ['texture', 'more', 'Softer and more tender, but less rich.']],
  },

  // ─── Egg ──────────────────────────────────────────────────────────────────
  {
    from: 'egg', to: 'Flax egg', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'One egg equals one tablespoon of ground flaxseed plus three tablespoons of water.',
    keeps: ['binder'], loses: ['leavener', 'structure', 'richness'],
    ok: ['MUFFIN', 'COOKIE', 'QUICK_BREAD', 'BROWNIES', 'PANCAKE', 'MEATBALLS'], no: ['MERINGUE', 'MOUSSE', 'QUICHE', 'CUSTARD'],
    eff: [['texture', 'less', 'Denser and slightly gummy.'], ['colour', 'more', 'Visible brown flecks.']],
    adj: [['rest longer', 'Ten minutes before use, so the flaxseed can gel.']],
  },
  {
    from: 'egg', to: 'Aquafaba', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'About three tablespoons of chickpea cooking liquid per egg.',
    keeps: ['binder', 'leavener'], loses: ['richness'],
    ok: ['COOKIE', 'CAKE', 'MUFFIN', 'BROWNIES', 'BREADING'], no: ['QUICHE', 'CUSTARD'],
    eff: [['texture', 'less', 'A little less tender, since there is no yolk fat.']],
  },
  {
    from: 'egg', to: 'Mashed banana', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'About 60 g, a quarter cup, of very ripe banana per egg.',
    keeps: ['binder', 'moisture'], loses: ['leavener', 'structure'],
    ok: ['MUFFIN', 'QUICK_BREAD', 'PANCAKE', 'BROWNIES'], no: ['MERINGUE', 'QUICHE', 'CUSTARD'],
    eff: [['flavour', 'more', 'It will taste of banana.'], ['moisture', 'more', 'Denser and moister.']],
  },
  {
    from: 'egg', to: 'Yogurt', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'About a quarter cup of plain yogurt per egg.',
    keeps: ['binder', 'moisture'], loses: ['leavener', 'structure'],
    ok: ['MUFFIN', 'CAKE', 'QUICK_BREAD'], no: ['MERINGUE', 'QUICHE'],
    eff: [['texture', 'more', 'Very tender and a little dense.']],
    adj: [['add leavener', 'A quarter teaspoon of baking soda helps, since the egg was lifting the batter.']],
  },
  {
    from: 'egg', to: 'Baking powder, oil and water', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'One teaspoon of baking powder, one tablespoon of oil and two tablespoons of water per egg. Rise only, not a general egg replacement.',
    keeps: ['leavener'], loses: ['binder', 'structure', 'richness'],
    ok: ['CAKE', 'MUFFIN'], no: ['QUICHE', 'MERINGUE', 'CUSTARD'],
  },
  {
    from: 'egg', to: 'Plant milk and maple glaze', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Surface glaze only.',
    keeps: ['browning'], loses: ['gloss'],
    ok: ['GLAZING'], no: ['CAKE', 'QUICHE'],
    eff: [['colour', 'less', 'Browns, but with far less shine.']],
  },
  {
    from: 'egg', to: 'Silken tofu', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    note: 'About 60 g of blended silken tofu per egg.',
    keeps: ['set'], loses: ['richness', 'leavener'],
    ok: ['QUICHE'], no: ['MERINGUE', 'CUSTARD'],
    eff: [['flavour', 'less', 'Milder, so season more boldly.']],
  },
  {
    from: 'egg', to: 'Breadcrumbs soaked in milk', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'A panade: about a quarter cup of crumbs soaked in a few tablespoons of milk, per egg.',
    keeps: ['binder', 'moisture'], loses: ['richness'],
    ok: ['MEATBALLS'], no: ['CAKE', 'COOKIE'],
    eff: [['moisture', 'more', 'Softer and juicier than with egg alone.']],
  },
  {
    from: 'egg', to: 'Buttermilk', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Dip in buttermilk instead of beaten egg before the flour or crumbs.',
    keeps: ['cling'], loses: ['richness'],
    ok: ['BREADING', 'FRIED_CHICKEN'], no: ['CAKE', 'QUICHE'],
    eff: [['flavour', 'more', 'A mild tang, and it tenderises the surface.']],
  },

  // ─── Egg white and yolk ───────────────────────────────────────────────────
  {
    from: 'egg-white', to: 'Aquafaba', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'One egg white equals about 30 g of aquafaba.',
    keeps: ['foaming'], loses: ['foam stability'],
    ok: ['WHIPPING', 'MERINGUE', 'MOUSSE'], no: [],
    eff: [['set', 'less', 'The foam is less stable and weeps sooner.']],
    adj: [['add acid', 'A pinch of cream of tartar steadies the foam.'], ['whip longer', 'Two to three times as long to reach stiff peaks.']],
  },
  {
    from: 'egg-white', to: 'Meringue powder', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Two teaspoons of powder plus two tablespoons of water per egg white.',
    keeps: ['foaming', 'structure'], loses: [],
    ok: ['MERINGUE', 'BUTTERCREAM', 'GLAZING'], no: [],
    eff: [['set', 'more', 'More stable than fresh whites, which is why bakers use it for icing.']],
  },
  {
    from: 'egg-yolk', to: 'Mustard', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'A teaspoon of mustard holds a dressing together the way a yolk would.',
    keeps: ['emulsifier'], loses: ['richness', 'colour'],
    ok: ['VINAIGRETTE', 'EMULSIFYING'], no: ['CUSTARD'],
    eff: [['flavour', 'more', 'A little heat and tang.']],
  },
  {
    from: 'egg-yolk', to: 'Cornstarch', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'About a teaspoon of cornstarch per yolk, cooked until the custard thickens.',
    keeps: ['thickener'], loses: ['richness', 'colour'],
    ok: ['CUSTARD'], no: ['EMULSIFYING'],
    eff: [['colour', 'less', 'Paler, with none of the golden yolk colour.'], ['flavour', 'less', 'Leaner. A little extra butter at the end helps.']],
  },

  // ─── Milk ─────────────────────────────────────────────────────────────────
  {
    from: 'milk', to: 'Oat milk', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Use an unsweetened one.',
    keeps: ['liquid', 'browning'], loses: ['dairy flavour'],
    ok: ['BECHAMEL', 'PANCAKE', 'MUFFIN', 'CAKE', 'SOUP'], no: [],
    eff: [['texture', 'more', 'Thickens slightly more than dairy milk.']],
  },
  {
    from: 'milk', to: 'Soy milk', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'The closest plant milk to dairy for baking, because of its protein.',
    keeps: ['liquid', 'browning'], loses: ['dairy flavour'],
    ok: ['CAKE', 'MUFFIN', 'PANCAKE', 'QUICK_BREAD', 'BREAD', 'BECHAMEL', 'SOUP', 'QUICHE', 'CUSTARD'], no: [],
  },
  {
    from: 'milk', to: 'Almond milk', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Thin and low in protein, so it behaves more like water than milk.',
    keeps: ['liquid'], loses: ['browning', 'richness'],
    ok: ['PANCAKE', 'MUFFIN', 'SOUP'], no: ['CUSTARD'],
    eff: [['browning', 'less', 'Paler bakes.'], ['flavour', 'more', 'A faint nuttiness.']],
  },
  {
    from: 'milk', to: 'Water', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'It works, but milk was doing more than adding liquid.',
    keeps: ['liquid'], loses: ['browning', 'richness'],
    ok: ['BREAD', 'PIZZA', 'PANCAKE'], no: ['BECHAMEL', 'QUICHE', 'CUSTARD'],
    eff: [['browning', 'less', 'A paler crust.'], ['texture', 'less', 'Leaner and a little drier.']],
    adj: [['add fat', 'About a tablespoon of butter or oil per cup of water brings some richness back.']],
  },
  {
    from: 'milk', to: 'Evaporated milk and water', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Half evaporated milk, half water.',
    keeps: ['liquid', 'browning', 'richness'], loses: [],
    ok: ['CAKE', 'MUFFIN', 'PANCAKE', 'BECHAMEL', 'SOUP', 'QUICHE', 'BREAD', 'CUSTARD'], no: [],
    eff: [['flavour', 'more', 'Faintly caramel, from the canning.']],
  },

  // ─── Buttermilk: the same pair twice, because the acid does two jobs ──────
  {
    from: 'buttermilk', to: 'Milk with added acid', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'One tablespoon of lemon juice or vinegar per cup of milk. Here the acid raises the batter, so it has to meet the baking soda.',
    keeps: ['acid'], loses: ['viscosity'],
    ok: ['PANCAKE', 'SODA_BREAD', 'MUFFIN', 'CAKE'], no: [],
    adj: [['rest longer', 'Ten minutes, so the milk can curdle before you mix.']],
  },
  {
    from: 'buttermilk', to: 'Milk with added acid', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Same swap, different job. In a brine the acid tenderises the meat instead of raising a batter.',
    keeps: ['acid'], loses: ['viscosity', 'cling'],
    ok: ['FRIED_CHICKEN', 'BRINING', 'MARINADE'], no: [],
    eff: [['texture', 'less', 'The coating clings less, because thin milk runs off.']],
  },
  {
    from: 'buttermilk', to: 'Yogurt thinned with milk', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Three parts plain yogurt to one part milk.',
    keeps: ['acid', 'viscosity'], loses: [],
    ok: ['PANCAKE', 'SODA_BREAD', 'CAKE', 'MUFFIN', 'FRIED_CHICKEN', 'MARINADE', 'BRINING', 'SALAD'], no: [],
    eff: [['texture', 'same', 'Keeps the thickness that milk and lemon lose.']],
  },
  {
    from: 'buttermilk', to: 'Kefir', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['acid', 'viscosity'], loses: [],
    ok: ['PANCAKE', 'SODA_BREAD', 'CAKE', 'MUFFIN', 'FRIED_CHICKEN', 'MARINADE', 'BRINING'], no: [],
    eff: [['flavour', 'more', 'Slightly more sour.']],
  },

  // ─── Heavy cream ──────────────────────────────────────────────────────────
  {
    from: 'heavy-cream', to: 'Coconut cream', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Chill the can overnight and use only the solid top if you want to whip it.',
    keeps: ['fat'], loses: ['emulsion stability'],
    ok: ['CURRY', 'WHIPPING', 'SOUP', 'MOUSSE', 'SET_DESSERT'], no: ['PASTA_SAUCE', 'BECHAMEL'],
    eff: [['flavour', 'more', 'Distinctly coconut.']],
  },
  {
    from: 'heavy-cream', to: 'Milk and melted butter', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Three parts milk to one part melted butter.',
    keeps: ['fat', 'liquid'], loses: ['whipping'],
    ok: ['SOUP', 'PASTA_SAUCE', 'BECHAMEL', 'QUICHE', 'CAKE', 'CUSTARD'], no: ['WHIPPING', 'MOUSSE'],
    eff: [['texture', 'less', 'Will never whip. The fat is not held the way it is in cream.']],
  },
  {
    from: 'heavy-cream', to: 'Crème fraîche', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['fat', 'richness'], loses: [],
    ok: ['PASTA_SAUCE', 'SOUP', 'CURRY', 'DIPPING_SAUCE', 'STEW'], no: [],
    eff: [['flavour', 'more', 'Lightly tangy.'], ['texture', 'same', 'Handles boiling and acid without splitting.']],
  },
  {
    from: 'heavy-cream', to: 'Evaporated milk', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Lighter, and fine anywhere the cream is only adding body.',
    keeps: ['liquid', 'richness'], loses: ['whipping', 'fat'],
    ok: ['SOUP', 'PASTA_SAUCE', 'QUICHE'], no: ['WHIPPING', 'MOUSSE'],
    eff: [['flavour', 'more', 'Faintly caramel.']],
  },
  {
    from: 'heavy-cream', to: 'Cashew cream', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Soaked raw cashews blended with water until completely smooth.',
    keeps: ['richness', 'body'], loses: ['whipping', 'dairy flavour'],
    ok: ['SOUP', 'PASTA_SAUCE', 'CURRY'], no: ['WHIPPING'],
    eff: [['flavour', 'less', 'Mild and slightly sweet.']],
  },

  // ─── Sour cream ───────────────────────────────────────────────────────────
  {
    from: 'sour-cream', to: 'Greek yogurt', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['acid', 'richness'], loses: ['heat stability'],
    ok: ['DIPPING_SAUCE', 'CAKE', 'MUFFIN', 'QUICK_BREAD', 'MARINADE', 'SALAD'], no: [],
    adj: [['add off the heat', 'Yogurt splits if it boils, so stir it in at the end.']],
  },
  {
    from: 'sour-cream', to: 'Crème fraîche', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['acid', 'richness'], loses: [],
    ok: ['SOUP', 'STEW', 'PASTA_SAUCE', 'DIPPING_SAUCE', 'CAKE'], no: [],
    eff: [['texture', 'same', 'Boils without splitting, so it is the better choice for hot sauces.']],
  },
  {
    from: 'sour-cream', to: 'Cashew cream', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Soak raw cashews for four hours, then blend with a little lemon juice and water.',
    keeps: ['richness'], loses: ['dairy flavour'],
    ok: ['DIPPING_SAUCE', 'SOUP', 'CURRY'], no: ['CAKE'],
    eff: [['flavour', 'less', 'Milder. Add lemon until it tastes sour enough.']],
    adj: [['add acid', 'Lemon juice, a teaspoon at a time.']],
  },

  // ─── Soft cheeses and parmesan ────────────────────────────────────────────
  {
    from: 'cream-cheese', to: 'Mascarpone', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['richness', 'body'], loses: ['acid'],
    ok: ['CHEESECAKE', 'BUTTERCREAM', 'DIPPING_SAUCE'], no: [],
    eff: [['flavour', 'less', 'Sweeter and far less tangy.'], ['texture', 'more', 'Richer and silkier.']],
    adj: [['add acid', 'A teaspoon of lemon juice brings back the tang.']],
  },
  {
    from: 'cream-cheese', to: 'Strained Greek yogurt', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    note: 'Strain full fat yogurt in a cloth overnight until it is as thick as cream cheese.',
    keeps: ['acid', 'body'], loses: ['richness'],
    ok: ['DIPPING_SAUCE', 'CHEESECAKE'], no: ['BUTTERCREAM'],
    eff: [['texture', 'less', 'Lighter and looser.']],
  },
  {
    from: 'cream-cheese', to: 'Blended cottage cheese', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    note: 'Blend it until completely smooth, or the curds show.',
    keeps: ['acid', 'body'], loses: ['richness'],
    ok: ['CHEESECAKE', 'DIPPING_SAUCE'], no: ['BUTTERCREAM'],
    eff: [['texture', 'same', 'Smooth once blended, a little lighter in the mouth.']],
  },
  {
    from: 'ricotta', to: 'Cottage cheese', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'Drain it and pulse it briefly for a smoother, ricotta like curd.',
    keeps: ['moisture', 'body'], loses: [],
    ok: ['PASTA_SAUCE', 'QUICHE', 'CHEESECAKE'], no: [],
    eff: [['moisture', 'more', 'Wetter, so drain it well.'], ['flavour', 'more', 'A little saltier.']],
  },
  {
    from: 'ricotta', to: 'Silken tofu and lemon', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    note: 'Crumble firm silken tofu with a squeeze of lemon and a pinch of salt.',
    keeps: ['body'], loses: ['dairy flavour'],
    ok: ['PASTA_SAUCE'], no: ['CHEESECAKE'],
    eff: [['flavour', 'less', 'Neutral, so season it well.']],
  },
  {
    from: 'parmesan', to: 'Pecorino romano', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['salt', 'umami'], loses: [],
    ok: ['PASTA_SAUCE', 'SOUP', 'VINAIGRETTE', 'PESTO'], no: [],
    eff: [['flavour', 'more', 'Saltier and sharper.']],
    adj: [['reduce salt', 'Taste before you salt the dish.']],
  },
  {
    from: 'parmesan', to: 'Grana padano', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['salt', 'umami'], loses: [],
    ok: ['PASTA_SAUCE', 'SOUP', 'PESTO', 'VINAIGRETTE'], no: [],
    eff: [['flavour', 'less', 'Milder and a little sweeter, usually cheaper.']],
  },
  {
    from: 'parmesan', to: 'Nutritional yeast', amount: 0.5, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'A vegan way to get the savoury note.',
    keeps: ['umami'], loses: ['melt', 'salt'],
    ok: ['PASTA_SAUCE', 'SOUP', 'PESTO'], no: [],
    eff: [['texture', 'less', 'Does not melt or brown.']],
    adj: [['add salt', 'A pinch, since it carries almost none.']],
  },

  // ─── Wheat flour: cornstarch appears twice, as thickener and as coating ───
  {
    from: 'wheat-flour', to: 'Cornstarch', amount: 0.5, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'Cornstarch has roughly twice the thickening power of flour.',
    keeps: ['thickener'], loses: ['roux flavour', 'heat stability'],
    ok: ['THICKENING', 'SOUP', 'STIR_FRY', 'FRUIT_SAUCE'], no: ['BECHAMEL', 'STEW'],
    eff: [['flavour', 'less', 'No toasted roux flavour at all.'], ['colour', 'less', 'Sets clear and glossy rather than opaque.']],
    adj: [['add at the end', 'Mix it with cold water first, and do not boil it for long or it thins again.']],
  },
  {
    from: 'wheat-flour', to: 'Cornstarch', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'Same pair, different job. As a coating, cornstarch fries crisper than flour.',
    keeps: ['crispness'], loses: ['browning'],
    ok: ['DEEP_FRYING', 'FRIED_CHICKEN', 'BREADING'], no: [],
    eff: [['texture', 'more', 'A lighter, crisper crust.'], ['colour', 'less', 'Fries paler.']],
  },
  {
    from: 'wheat-flour', to: 'Almond flour', amount: 0.9, basis: 'WEIGHT', rel: 'CONTESTED',
    note: 'Never a straight swap. There is no gluten to build structure.',
    keeps: ['bulk'], loses: ['gluten structure'],
    ok: ['CAKE', 'COOKIE', 'BROWNIES'], no: ['BREAD', 'PIZZA', 'LAMINATION', 'CROISSANT'],
    eff: [['rise', 'much less', 'No gluten network, so nothing holds the gas.']],
    adj: [['add binder', 'One egg or 5 g of psyllium per 100 g of flour, to stand in for the gluten.']],
  },
  {
    from: 'wheat-flour', to: 'Gluten free flour blend', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    note: 'A cup for cup blend works best in tender bakes where gluten is not the point.',
    keeps: ['bulk'], loses: ['gluten structure'],
    ok: ['CAKE', 'COOKIE', 'MUFFIN', 'PANCAKE', 'BROWNIES', 'QUICK_BREAD', 'BREADING', 'THICKENING'], no: ['BREAD', 'PIZZA', 'CROISSANT', 'LAMINATION'],
    adj: [['add binder', 'About half a teaspoon of xanthan gum per 120 g of flour, if the blend has none.']],
  },
  {
    from: 'wheat-flour', to: 'Oat flour', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    note: 'Blend rolled oats until fine. Certified oats if gluten is the reason.',
    keeps: ['bulk'], loses: ['gluten structure'],
    ok: ['PANCAKE', 'MUFFIN', 'COOKIE', 'QUICK_BREAD'], no: ['BREAD', 'PIZZA', 'CROISSANT'],
    eff: [['texture', 'more', 'Tender and a little crumbly.'], ['flavour', 'more', 'Nutty and wholesome.']],
  },

  // ─── Specialty flours ─────────────────────────────────────────────────────
  {
    from: 'cake-flour', to: 'All purpose flour and cornstarch', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'For each cup: one cup of all purpose flour, take out two tablespoons, add two tablespoons of cornstarch. Sift it twice.',
    keeps: ['tenderness'], loses: [],
    ok: ['CAKE', 'MUFFIN', 'COOKIE'], no: ['BREAD', 'PIZZA'],
    eff: [['texture', 'same', 'Very close to the fine, soft crumb of real cake flour.']],
  },
  {
    from: 'cake-flour', to: 'All purpose flour', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    keeps: ['structure'], loses: ['tenderness'],
    ok: ['CAKE', 'MUFFIN'], no: [],
    eff: [['texture', 'less', 'A slightly tougher, denser crumb.']],
  },
  {
    from: 'self-raising-flour', to: 'All purpose flour, baking powder and salt', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'For each cup of flour, one and a half teaspoons of baking powder and a quarter teaspoon of salt.',
    keeps: ['structure', 'leavener'], loses: [],
    ok: ['CAKE', 'MUFFIN', 'PANCAKE', 'QUICK_BREAD'], no: ['BREAD', 'PIZZA'],
    eff: [['rise', 'same', 'Indistinguishable, as long as the powder is fresh.']],
  },
  {
    from: 'bread-flour', to: 'All purpose flour', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    keeps: ['structure'], loses: ['chew', 'gluten strength'],
    ok: ['BREAD', 'PIZZA'], no: [],
    eff: [['texture', 'less', 'A softer, less chewy crumb.']],
    adj: [['use less water', 'About a tablespoon less per cup, since all purpose flour absorbs less.']],
  },
  {
    from: 'bread-flour', to: 'All purpose flour and vital wheat gluten', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'About one teaspoon of vital wheat gluten per cup of all purpose flour.',
    keeps: ['structure', 'chew'], loses: [],
    ok: ['BREAD', 'PIZZA'], no: [],
    eff: [['texture', 'same', 'Close to real bread flour.']],
  },

  // ─── Starches and thickeners ──────────────────────────────────────────────
  {
    from: 'cornstarch', to: 'Arrowroot', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['thickener'], loses: [],
    ok: ['FRUIT_SAUCE', 'THICKENING', 'STIR_FRY'], no: ['BECHAMEL', 'CUSTARD'],
    eff: [['texture', 'same', 'Holds up better against acid than cornstarch does, but turns slimy with dairy.']],
  },
  {
    from: 'cornstarch', to: 'Wheat flour', amount: 2, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['thickener'], loses: ['clarity', 'gloss'],
    ok: ['SOUP', 'STEW', 'THICKENING', 'BECHAMEL'], no: ['FRUIT_SAUCE'],
    eff: [['colour', 'less', 'Sets opaque instead of clear.']],
    adj: [['cook longer', 'A few more minutes, to cook out the raw flour taste.']],
  },
  {
    from: 'cornstarch', to: 'Potato starch', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['thickener', 'crispness'], loses: ['heat stability'],
    ok: ['THICKENING', 'SOUP', 'FRUIT_SAUCE', 'DEEP_FRYING', 'BREADING', 'FRIED_CHICKEN', 'STIR_FRY'], no: ['STEW'],
    eff: [['texture', 'more', 'Very crisp as a coating.']],
    adj: [['add at the end', 'It thins out if it boils for long, so add it last.']],
  },
  {
    from: 'gelatin', to: 'Agar agar', amount: 0.33, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Roughly one teaspoon of agar powder for every tablespoon of gelatin. Vegan, and it sets at room temperature.',
    keeps: ['set'], loses: ['wobble'],
    ok: ['SET_DESSERT', 'CHEESECAKE'], no: ['MOUSSE'],
    eff: [['texture', 'more', 'Firmer and more brittle, it snaps rather than wobbles.']],
    adj: [['boil it', 'Agar only sets after a minute or two at a full boil. Gelatin must never boil.']],
  },

  // ─── Leaveners ────────────────────────────────────────────────────────────
  {
    from: 'baking-powder', to: 'Baking soda and cream of tartar', amount: 0.75, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'For each teaspoon of baking powder, a quarter teaspoon of baking soda and half a teaspoon of cream of tartar.',
    keeps: ['leavener'], loses: ['second rise'],
    ok: ['CAKE', 'MUFFIN', 'PANCAKE', 'COOKIE', 'QUICK_BREAD', 'SODA_BREAD', 'BROWNIES'], no: [],
    adj: [['bake at once', 'The home mix reacts only once, the moment it gets wet.']],
  },
  {
    from: 'baking-soda', to: 'Baking powder', amount: 3, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Use three times as much. Powder brings its own acid, so it cannot cancel out the acid already in the recipe.',
    keeps: ['leavener'], loses: ['browning', 'spread'],
    ok: ['CAKE', 'MUFFIN', 'PANCAKE', 'QUICK_BREAD', 'SODA_BREAD'], no: ['COOKIE'],
    eff: [['browning', 'less', 'Paler, because the soda is what drives browning.'], ['texture', 'more', 'Cookies turn cakey instead of spreading.']],
  },
  {
    from: 'yeast', to: 'Instant yeast', amount: 0.75, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'Use about a quarter less, and mix it straight into the flour.',
    keeps: ['leavener', 'flavour'], loses: [],
    ok: ['BREAD', 'PIZZA', 'CROISSANT'], no: [],
    eff: [['rise', 'more', 'Slightly faster first rise.']],
    adj: [['skip the bloom', 'No need to dissolve it in warm water first.']],
  },
  {
    from: 'yeast', to: 'Fresh yeast', amount: 2.5, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'Crumble it into the liquid. It keeps only about two weeks in the fridge.',
    keeps: ['leavener', 'flavour'], loses: [],
    ok: ['BREAD', 'PIZZA', 'CROISSANT'], no: [],
    eff: [['flavour', 'more', 'Bakers swear by the flavour, though few people can taste it.']],
  },
  {
    from: 'yeast', to: 'Sourdough starter', amount: 14, basis: 'WEIGHT', rel: 'SITUATIONAL',
    note: 'About 100 g of lively starter per 7 g packet of yeast. Take its flour and water out of the recipe.',
    keeps: ['leavener'], loses: ['speed'],
    ok: ['BREAD', 'PIZZA'], no: [],
    eff: [['flavour', 'more', 'Tangy and deeper.'], ['rise', 'less', 'Much slower. Hours, not one.']],
    adj: [['rise longer', 'Plan for a long rise, or an overnight one in the fridge.']],
  },

  // ─── Sugar ────────────────────────────────────────────────────────────────
  {
    from: 'sugar', to: 'Honey', amount: 0.75, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['sweetener'], loses: ['crystal structure'],
    ok: ['CAKE', 'COOKIE', 'MUFFIN', 'QUICK_BREAD', 'MARINADE', 'VINAIGRETTE'], no: ['CARAMELISATION', 'MERINGUE'],
    eff: [['browning', 'much more', 'Fructose browns much faster than sucrose.'], ['moisture', 'more', 'Honey holds water, so the crumb stays moist longer.']],
    adj: [['reduce liquid', 'About 60 ml less per 240 ml of honey, since honey is roughly 17 percent water.'], ['lower the oven', 'By about 15 C, or the outside burns before the centre sets.']],
  },
  {
    from: 'sugar', to: 'Maple syrup', amount: 0.75, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['sweetener'], loses: ['crystal structure'],
    ok: ['CAKE', 'MUFFIN', 'QUICK_BREAD', 'PANCAKE', 'MARINADE', 'GLAZING', 'VINAIGRETTE'], no: ['MERINGUE', 'BUTTERCREAM'],
    eff: [['flavour', 'more', 'Tastes of maple.'], ['browning', 'more', 'Browns faster.']],
    adj: [['reduce liquid', 'About three tablespoons less per cup of syrup.'], ['lower the oven', 'By about 15 C.']],
  },
  {
    from: 'sugar', to: 'Brown sugar', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['sweetener', 'browning'], loses: [],
    ok: ['COOKIE', 'CAKE', 'MUFFIN', 'BROWNIES', 'MARINADE', 'GLAZING'], no: ['MERINGUE'],
    eff: [['moisture', 'more', 'The molasses holds on to water.'], ['flavour', 'more', 'Caramel and toffee notes.'], ['texture', 'more', 'Chewier cookies.']],
  },
  {
    from: 'sugar', to: 'Coconut sugar', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    keeps: ['sweetener'], loses: [],
    ok: ['COOKIE', 'CAKE', 'MUFFIN', 'BROWNIES'], no: ['MERINGUE', 'CARAMELISATION'],
    eff: [['colour', 'more', 'Everything comes out darker.'], ['flavour', 'more', 'Deep caramel.']],
  },
  {
    from: 'sugar', to: 'Erythritol', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    keeps: ['sweetener'], loses: ['browning', 'spread'],
    ok: ['COOKIE'], no: ['CARAMELISATION', 'MERINGUE'],
    eff: [['browning', 'much less', 'Does not caramelise at all.'], ['texture', 'less', 'Cookies will not spread.'], ['flavour', 'less', 'A noticeable cooling sensation on the tongue.']],
  },
  {
    from: 'brown-sugar', to: 'Sugar and molasses', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'One tablespoon of molasses per cup of white sugar for light brown, two for dark.',
    keeps: ['sweetener', 'moisture'], loses: [],
    ok: ['COOKIE', 'CAKE', 'MUFFIN', 'BROWNIES', 'MARINADE', 'GLAZING'], no: [],
    eff: [['flavour', 'same', 'Indistinguishable once it is mixed in.']],
  },
  {
    from: 'brown-sugar', to: 'Granulated sugar', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    keeps: ['sweetener'], loses: ['moisture', 'caramel flavour'],
    ok: ['CAKE', 'MUFFIN', 'COOKIE', 'BROWNIES'], no: [],
    eff: [['texture', 'less', 'Cookies turn crisper and less chewy.']],
  },
  {
    from: 'powdered-sugar', to: 'Blended sugar and cornstarch', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Blend a cup of granulated sugar with a tablespoon of cornstarch until it is a fine powder.',
    keeps: ['sweetener', 'smoothness'], loses: [],
    ok: ['BUTTERCREAM', 'GLAZING', 'CHEESECAKE'], no: [],
    eff: [['texture', 'less', 'A touch grittier unless you blend it long enough.']],
  },
  {
    from: 'honey', to: 'Maple syrup', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['sweetener', 'moisture'], loses: ['floral notes'],
    ok: ['GLAZING', 'MARINADE', 'PANCAKE', 'DIPPING_SAUCE', 'VINAIGRETTE', 'CAKE', 'MUFFIN'], no: [],
    eff: [['flavour', 'more', 'Maple rather than floral.']],
  },
  {
    from: 'honey', to: 'Agave syrup', amount: 0.75, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Agave is sweeter, so use a little less.',
    keeps: ['sweetener', 'moisture'], loses: ['floral notes'],
    ok: ['VINAIGRETTE', 'MARINADE', 'DIPPING_SAUCE', 'GLAZING'], no: [],
    eff: [['flavour', 'less', 'Very neutral.']],
  },
  {
    from: 'corn-syrup', to: 'Golden syrup', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['sweetener', 'smoothness'], loses: [],
    ok: ['CARAMELISATION', 'GLAZING', 'BROWNIES'], no: [],
    eff: [['flavour', 'more', 'Buttery caramel notes.']],
  },
  {
    from: 'corn-syrup', to: 'Honey', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['sweetener'], loses: ['smoothness'],
    ok: ['GLAZING'], no: ['CARAMELISATION'],
    eff: [['flavour', 'more', 'Tastes of honey.'], ['browning', 'more', 'Browns and scorches sooner.']],
  },
  {
    from: 'molasses', to: 'Dark brown sugar', amount: 0.75, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Three quarters of a cup of dark brown sugar per cup of molasses, plus a quarter cup of extra liquid.',
    keeps: ['sweetener', 'colour'], loses: ['bitterness'],
    ok: ['COOKIE', 'CAKE', 'MARINADE'], no: [],
    eff: [['flavour', 'less', 'Milder, with less of the bitter depth.']],
    adj: [['add liquid', 'A quarter cup more water or milk.']],
  },
  {
    from: 'molasses', to: 'Maple syrup', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['sweetener', 'moisture'], loses: ['bitterness', 'colour'],
    ok: ['MARINADE', 'GLAZING', 'COOKIE'], no: [],
    eff: [['flavour', 'less', 'Much lighter. Gingerbread will not taste like gingerbread.']],
  },

  // ─── Chocolate and vanilla ────────────────────────────────────────────────
  {
    from: 'cocoa-powder', to: 'Unsweetened chocolate', amount: 1.9, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'About 28 g of unsweetened chocolate for every three tablespoons of cocoa.',
    keeps: ['flavour', 'colour'], loses: [],
    ok: ['BROWNIES', 'CAKE'], no: [],
    eff: [['texture', 'more', 'Fudgier, because chocolate brings fat.']],
    adj: [['reduce fat', 'Take a tablespoon of butter or oil out of the recipe.']],
  },
  {
    from: 'cocoa-powder', to: 'Carob powder', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Caffeine free, and naturally sweeter.',
    keeps: ['colour'], loses: ['bitterness', 'chocolate flavour'],
    ok: ['BROWNIES', 'CAKE', 'COOKIE'], no: [],
    eff: [['flavour', 'less', 'Pleasant, but it will not taste like chocolate.']],
    adj: [['reduce sugar', 'Cut the sugar by about a quarter.']],
  },
  {
    from: 'dark-chocolate', to: 'Cocoa, sugar and butter', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'For 28 g of dark chocolate: three tablespoons of cocoa, one of butter and one of sugar.',
    keeps: ['flavour', 'fat'], loses: ['set'],
    ok: ['BROWNIES', 'CAKE', 'COOKIE'], no: ['GLAZING', 'MOUSSE'],
    eff: [['texture', 'less', 'Fine in batters, but it will not set or snap like real chocolate.']],
  },
  {
    from: 'dark-chocolate', to: 'Milk chocolate', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    keeps: ['flavour', 'fat'], loses: ['bitterness', 'set'],
    ok: ['COOKIE', 'BROWNIES', 'CAKE'], no: ['MOUSSE'],
    eff: [['flavour', 'less', 'Sweeter and milder.'], ['set', 'less', 'Sets softer, which is why mousse fails.']],
    adj: [['reduce sugar', 'Take a spoonful of sugar out of the recipe.']],
  },
  {
    from: 'vanilla-extract', to: 'Vanilla bean', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'The seeds of one pod replace about a tablespoon of extract.',
    keeps: ['aroma'], loses: [],
    ok: ['CAKE', 'COOKIE', 'CUSTARD', 'BUTTERCREAM', 'CHEESECAKE', 'SET_DESSERT'], no: [],
    eff: [['flavour', 'more', 'Stronger and rounder, with visible flecks.']],
  },
  {
    from: 'vanilla-extract', to: 'Maple syrup', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['aroma'], loses: [],
    ok: ['CAKE', 'COOKIE', 'PANCAKE', 'MUFFIN'], no: [],
    eff: [['flavour', 'more', 'Warm and caramel, not quite vanilla.']],
  },
  {
    from: 'vanilla-extract', to: 'Bourbon or dark rum', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['aroma'], loses: [],
    ok: ['CAKE', 'COOKIE', 'BROWNIES'], no: ['BUTTERCREAM'],
    eff: [['flavour', 'more', 'Warm and a little boozy. Most of the alcohol bakes off, none of it does in frosting.']],
  },

  // ─── Oils and spreads ─────────────────────────────────────────────────────
  {
    from: 'vegetable-oil', to: 'Melted butter', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['fat'], loses: ['heat tolerance'],
    ok: ['CAKE', 'MUFFIN', 'BROWNIES', 'QUICK_BREAD', 'PANCAKE'], no: ['DEEP_FRYING', 'STIR_FRY'],
    eff: [['flavour', 'more', 'Buttery.'], ['moisture', 'less', 'Firms up as it cools, so the crumb feels drier the next day.']],
  },
  {
    from: 'vegetable-oil', to: 'Melted coconut oil', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['fat'], loses: ['liquid when cold'],
    ok: ['CAKE', 'MUFFIN', 'BROWNIES', 'PAN_FRYING'], no: ['VINAIGRETTE', 'SALAD'],
    eff: [['texture', 'less', 'Turns solid below about 24 C, so a cold dressing seizes into lumps.']],
    adj: [['warm the rest', 'Have the other ingredients at room temperature, or it sets in the bowl.']],
  },
  {
    from: 'vegetable-oil', to: 'Applesauce', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Replace up to half the oil.',
    keeps: ['moisture'], loses: ['fat', 'tenderiser'],
    ok: ['MUFFIN', 'QUICK_BREAD', 'BROWNIES', 'CAKE'], no: ['DEEP_FRYING', 'PAN_FRYING', 'COOKIE'],
    eff: [['texture', 'less', 'Denser, and a little rubbery past half.']],
  },
  {
    from: 'vegetable-oil', to: 'Peanut oil', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Check for peanut allergies before you cook with it for guests.',
    keeps: ['fat', 'heat tolerance'], loses: [],
    ok: ['DEEP_FRYING', 'STIR_FRY', 'PAN_FRYING'], no: [],
    eff: [['flavour', 'more', 'Slightly nutty.']],
  },
  {
    from: 'mayonnaise', to: 'Greek yogurt', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['body'], loses: ['fat', 'emulsion'],
    ok: ['SALAD', 'DIPPING_SAUCE'], no: ['EMULSIFYING'],
    eff: [['flavour', 'more', 'Tangier and lighter.'], ['texture', 'less', 'Thinner. Stir in a teaspoon of oil or mustard for body.']],
  },
  {
    from: 'mayonnaise', to: 'Aquafaba mayonnaise', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Blend three tablespoons of aquafaba with a teaspoon of mustard and some lemon, then stream in about 150 ml of oil.',
    keeps: ['fat', 'emulsion'], loses: [],
    ok: ['SALAD', 'DIPPING_SAUCE', 'EMULSIFYING'], no: [],
    eff: [['texture', 'same', 'Surprisingly close, and fully egg free.']],
  },
  {
    from: 'mayonnaise', to: 'Mashed avocado', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['fat', 'body'], loses: ['emulsion'],
    ok: ['SALAD', 'DIPPING_SAUCE'], no: ['EMULSIFYING'],
    eff: [['colour', 'more', 'Turns everything green, and browns within a few hours.']],
    adj: [['add acid', 'A squeeze of lime slows the browning.']],
  },
  {
    from: 'peanut-butter', to: 'Sunflower seed butter', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'The usual swap for peanut allergies.',
    keeps: ['fat', 'binder'], loses: [],
    ok: ['COOKIE', 'DIPPING_SAUCE', 'MARINADE', 'BROWNIES'], no: [],
    eff: [['colour', 'more', 'Can turn green inside a bake when it meets baking soda. Harmless, and a little lemon juice stops it.']],
  },
  {
    from: 'peanut-butter', to: 'Almond butter', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Still a tree nut, so it does not help with every nut allergy.',
    keeps: ['fat', 'binder'], loses: [],
    ok: ['COOKIE', 'DIPPING_SAUCE', 'BROWNIES', 'MARINADE'], no: [],
    eff: [['flavour', 'less', 'Milder and a little sweeter.']],
  },
  {
    from: 'peanut-butter', to: 'Tahini', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['fat', 'binder'], loses: ['sweetness'],
    ok: ['DIPPING_SAUCE', 'MARINADE', 'COOKIE'], no: [],
    eff: [['flavour', 'more', 'Savoury and slightly bitter.']],
    adj: [['add sweetness', 'A little honey or sugar if the recipe relied on sweet peanut butter.']],
  },

  // ─── Sauces, stocks and wine ──────────────────────────────────────────────
  {
    from: 'soy-sauce', to: 'Tamari', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Usually brewed without wheat. Check the label if gluten is the reason you are swapping.',
    keeps: ['salt', 'umami'], loses: [],
    ok: ['STIR_FRY', 'MARINADE', 'DIPPING_SAUCE', 'SOUP', 'CURRY', 'SUSHI_RICE'], no: [],
    eff: [['flavour', 'more', 'Richer and a little less sharp.']],
  },
  {
    from: 'soy-sauce', to: 'Coconut aminos', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Soy free, but much less salty and noticeably sweeter.',
    keeps: ['umami'], loses: ['salt'],
    ok: ['STIR_FRY', 'MARINADE', 'DIPPING_SAUCE'], no: [],
    adj: [['add salt', 'To taste, since it carries far less.']],
  },
  {
    from: 'soy-sauce', to: 'Miso thinned with water', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'One part miso to two parts water.',
    keeps: ['salt', 'umami'], loses: ['clarity'],
    ok: ['SOUP', 'MARINADE', 'STIR_FRY', 'STEW'], no: ['DIPPING_SAUCE'],
    eff: [['texture', 'more', 'Cloudy and a little thicker.'], ['flavour', 'more', 'Rounder and funkier.']],
  },
  {
    from: 'fish-sauce', to: 'Soy sauce with seaweed', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['umami', 'salt'], loses: ['fermented funk'],
    ok: ['CURRY', 'DIPPING_SAUCE', 'STIR_FRY', 'MARINADE'], no: [],
    eff: [['flavour', 'less', 'The salt and umami survive, the fermented funk does not.']],
  },
  {
    from: 'fish-sauce', to: 'Anchovy paste', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'About one mashed fillet per teaspoon of fish sauce.',
    keeps: ['umami', 'salt'], loses: ['liquid'],
    ok: ['PASTA_SAUCE', 'VINAIGRETTE', 'STIR_FRY'], no: ['DIPPING_SAUCE'],
    eff: [['texture', 'more', 'Thicker, so loosen it with a little water.']],
  },
  {
    from: 'worcestershire', to: 'Soy sauce, vinegar and sugar', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Equal parts soy sauce and vinegar, with a pinch of sugar.',
    keeps: ['umami', 'acid'], loses: ['depth'],
    ok: ['MARINADE', 'STEW', 'MEATBALLS', 'DIPPING_SAUCE'], no: [],
    eff: [['flavour', 'less', 'Close, but without the tamarind and anchovy depth.']],
  },
  {
    from: 'tomato-paste', to: 'Reduced passata', amount: 3, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Simmer about three tablespoons of passata down to one.',
    keeps: ['umami', 'colour'], loses: [],
    ok: ['PASTA_SAUCE', 'STEW', 'SOUP', 'CURRY'], no: [],
    eff: [['flavour', 'less', 'Brighter and less concentrated.']],
  },
  {
    from: 'tomato-paste', to: 'Ketchup', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['umami', 'colour'], loses: [],
    ok: ['STEW', 'MARINADE', 'MEATBALLS'], no: ['PASTA_SAUCE'],
    eff: [['flavour', 'more', 'Sweet and vinegary, which a pasta sauce will not forgive.']],
    adj: [['reduce sugar', 'Leave out any sugar the recipe asks for.']],
  },
  {
    from: 'dijon-mustard', to: 'Mustard powder and vinegar', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'A teaspoon of mustard powder, a teaspoon of white wine vinegar and a splash of water, per tablespoon of Dijon.',
    keeps: ['emulsifier', 'heat'], loses: [],
    ok: ['VINAIGRETTE', 'MARINADE', 'EMULSIFYING', 'SALAD'], no: [],
    adj: [['rest it', 'Let it stand for ten minutes so the heat develops.']],
  },
  {
    from: 'dijon-mustard', to: 'Yellow mustard', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['emulsifier'], loses: ['heat'],
    ok: ['VINAIGRETTE', 'SALAD', 'MARINADE'], no: [],
    eff: [['flavour', 'less', 'Milder and more vinegary.']],
  },
  {
    from: 'chicken-stock', to: 'Vegetable stock', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['liquid'], loses: ['body'],
    ok: ['SOUP', 'STEW', 'PASTA_SAUCE', 'CURRY'], no: [],
    eff: [['flavour', 'less', 'Lighter and a little sweeter.']],
  },
  {
    from: 'chicken-stock', to: 'Water, soy sauce and butter', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Per cup: a cup of water, a teaspoon of soy sauce and a knob of butter.',
    keeps: ['liquid', 'umami'], loses: ['body'],
    ok: ['SOUP', 'STEW', 'PAN_FRYING'], no: [],
    eff: [['flavour', 'less', 'Thinner, but far better than plain water.']],
  },
  {
    from: 'chicken-stock', to: 'Bouillon cube and water', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['liquid', 'umami'], loses: [],
    ok: ['SOUP', 'STEW', 'CURRY', 'PASTA_SAUCE'], no: [],
    adj: [['season at the end', 'Cubes are salty, so taste before you add any salt.']],
  },
  {
    from: 'coconut-milk', to: 'Cream thinned with water', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Half heavy cream, half water.',
    keeps: ['fat', 'liquid'], loses: ['coconut flavour'],
    ok: ['CURRY', 'SOUP'], no: [],
    eff: [['flavour', 'less', 'Rich, but it will not taste of coconut.']],
  },
  {
    from: 'coconut-milk', to: 'Cashew milk', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Blend soaked cashews with twice their volume of water.',
    keeps: ['fat', 'liquid'], loses: ['coconut flavour'],
    ok: ['CURRY', 'SOUP'], no: [],
    eff: [['flavour', 'less', 'Creamy and neutral.']],
  },
  {
    from: 'white-wine', to: 'Stock and a splash of vinegar', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'One tablespoon of white wine vinegar per cup of stock.',
    keeps: ['liquid', 'acid'], loses: ['aroma'],
    ok: ['PASTA_SAUCE', 'SOUP', 'STEW', 'PAN_FRYING'], no: [],
    eff: [['flavour', 'less', 'Clean, but flatter than wine.']],
  },
  {
    from: 'white-wine', to: 'Dry vermouth', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Keeps for months once opened, which wine does not.',
    keeps: ['acid', 'aroma'], loses: [],
    ok: ['PASTA_SAUCE', 'SOUP', 'STEW', 'PAN_FRYING'], no: [],
    eff: [['flavour', 'more', 'A little more herbal.']],
  },
  {
    from: 'red-wine', to: 'Stock and balsamic vinegar', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'One tablespoon of balsamic vinegar per cup of stock.',
    keeps: ['liquid', 'acid'], loses: ['tannin'],
    ok: ['STEW', 'PASTA_SAUCE', 'MARINADE'], no: [],
    eff: [['flavour', 'less', 'Rounder and less grippy.']],
  },
  {
    from: 'red-wine', to: 'Grape juice and vinegar', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'A tablespoon of red wine vinegar per cup of unsweetened grape juice.',
    keeps: ['acid', 'colour'], loses: ['tannin'],
    ok: ['STEW', 'MARINADE'], no: [],
    eff: [['flavour', 'more', 'Noticeably sweeter.']],
    adj: [['reduce sugar', 'Leave out any sugar the recipe calls for.']],
  },
  {
    from: 'lemon-juice', to: 'White wine vinegar', amount: 0.5, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Vinegar is sharper, so start with half and taste.',
    keeps: ['acid'], loses: ['citrus aroma'],
    ok: ['VINAIGRETTE', 'MARINADE', 'SOUP'], no: ['FRUIT_SAUCE', 'MOUSSE'],
    eff: [['flavour', 'less', 'Sour, but none of the lemon perfume.']],
  },
  {
    from: 'lemon-juice', to: 'Lime juice', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['acid', 'aroma'], loses: [],
    ok: ['VINAIGRETTE', 'MARINADE', 'CURRY', 'DIPPING_SAUCE', 'FRUIT_SAUCE', 'SOUP'], no: [],
    eff: [['flavour', 'more', 'More floral, and a touch more bitter.']],
  },
  {
    from: 'rice-vinegar', to: 'Cider vinegar and sugar', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'A pinch of sugar per tablespoon, since rice vinegar is milder and sweeter.',
    keeps: ['acid'], loses: [],
    ok: ['SUSHI_RICE', 'DIPPING_SAUCE', 'VINAIGRETTE', 'STIR_FRY', 'MARINADE'], no: [],
    eff: [['flavour', 'more', 'A faint apple note.']],
  },
  {
    from: 'rice-vinegar', to: 'Lime juice', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['acid'], loses: ['mellowness'],
    ok: ['DIPPING_SAUCE', 'VINAIGRETTE', 'STIR_FRY'], no: ['SUSHI_RICE'],
    eff: [['flavour', 'more', 'Brighter and sharper.']],
  },

  // ─── Herbs, aromatics and nuts ────────────────────────────────────────────
  {
    from: 'fresh-herbs', to: 'Dried herbs', amount: 0.33, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'One part dried for three parts fresh, because drying concentrates the flavour.',
    keeps: ['aroma'], loses: ['colour', 'brightness'],
    ok: ['SOUP', 'STEW', 'PASTA_SAUCE', 'CURRY', 'MARINADE', 'MEATBALLS'], no: ['VINAIGRETTE', 'DIPPING_SAUCE', 'PESTO'],
    eff: [['colour', 'less', 'No green.']],
    adj: [['add early', 'Dried herbs need time in the heat to open up. Fresh ones go in at the end.']],
  },
  {
    from: 'garlic', to: 'Garlic powder', amount: 0.25, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'An eighth of a teaspoon of powder per clove.',
    keeps: ['aroma'], loses: ['bite'],
    ok: ['SOUP', 'STEW', 'MARINADE', 'MEATBALLS', 'PASTA_SAUCE'], no: ['STIR_FRY'],
    eff: [['flavour', 'less', 'Rounder and sweeter, without the sharp bite.']],
    adj: [['add it to liquid', 'Stir it into the sauce. In hot oil it burns in seconds.']],
  },
  {
    from: 'onion', to: 'Shallot', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['sweetness', 'aroma'], loses: [],
    ok: ['SOUP', 'STEW', 'PASTA_SAUCE', 'VINAIGRETTE', 'MARINADE', 'CURRY', 'STIR_FRY'], no: [],
    eff: [['flavour', 'less', 'Milder and sweeter, lovely raw in a dressing.']],
  },
  {
    from: 'onion', to: 'Leek', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    keeps: ['sweetness'], loses: ['sharpness'],
    ok: ['SOUP', 'STEW', 'QUICHE'], no: [],
    eff: [['flavour', 'less', 'Gentle and grassy.']],
    adj: [['wash well', 'Grit hides between the layers.']],
  },
  {
    from: 'onion', to: 'Onion powder', amount: 0.1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'About a tablespoon of powder for a medium onion.',
    keeps: ['aroma'], loses: ['texture', 'sweetness'],
    ok: ['SOUP', 'STEW', 'MEATBALLS', 'MARINADE'], no: ['STIR_FRY', 'PAN_FRYING'],
    eff: [['flavour', 'less', 'None of the sweetness you get from browning a real onion.']],
  },
  {
    from: 'ginger', to: 'Ground ginger', amount: 0.25, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'A quarter teaspoon of ground ginger per tablespoon of fresh.',
    keeps: ['heat'], loses: ['brightness'],
    ok: ['CURRY', 'SOUP', 'STEW', 'MARINADE', 'CAKE', 'COOKIE'], no: ['STIR_FRY'],
    eff: [['flavour', 'less', 'Warmer and duller, none of the fresh zing.']],
  },
  {
    from: 'pine-nuts', to: 'Walnuts', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['fat', 'body'], loses: [],
    ok: ['PESTO'], no: [],
    eff: [['flavour', 'more', 'Earthier and slightly bitter.']],
    adj: [['toast them', 'A few minutes in a dry pan takes the bitterness off.']],
  },
  {
    from: 'pine-nuts', to: 'Sunflower seeds', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'The nut free option.',
    keeps: ['fat', 'body'], loses: [],
    ok: ['PESTO'], no: [],
    eff: [['flavour', 'less', 'Mild and a little grassy.']],
  },
  {
    from: 'pine-nuts', to: 'Almonds', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['fat', 'body'], loses: [],
    ok: ['PESTO'], no: [],
    eff: [['texture', 'more', 'Grainier. Blanched almonds blend smoothest.']],
  },
  {
    from: 'breadcrumbs', to: 'Panko', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['binder', 'crunch'], loses: [],
    ok: ['BREADING', 'DEEP_FRYING', 'FRIED_CHICKEN', 'MEATBALLS'], no: [],
    eff: [['texture', 'more', 'Lighter and crunchier.']],
  },
  {
    from: 'breadcrumbs', to: 'Crushed crackers', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['binder', 'crunch'], loses: [],
    ok: ['BREADING', 'MEATBALLS', 'FRIED_CHICKEN', 'DEEP_FRYING'], no: [],
    adj: [['reduce salt', 'Crackers are already salted.']],
  },
  {
    from: 'breadcrumbs', to: 'Crushed cornflakes', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['crunch'], loses: [],
    ok: ['BREADING', 'FRIED_CHICKEN'], no: ['MEATBALLS'],
    eff: [['texture', 'more', 'Extra crunchy, and it browns fast.']],
  },
  {
    from: 'breadcrumbs', to: 'Rolled oats', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Pulse them briefly in a blender first.',
    keeps: ['binder'], loses: ['crunch'],
    ok: ['MEATBALLS'], no: ['BREADING', 'DEEP_FRYING'],
    eff: [['texture', 'less', 'Softer, and it will not fry crisp.']],
  },
];
