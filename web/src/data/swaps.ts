/**
 * The whole dataset. It ships inside the page, so there is nothing to fetch and
 * nothing to host. Common kitchen knowledge, written so every swap says where it
 * works and, just as usefully, where it does not.
 */

export type Rel = 'ESTABLISHED' | 'SITUATIONAL' | 'CONTESTED';

export interface Ingredient {
  id: string;
  name: string;
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
      ['QUICK_BREAD', 'a quick bread'], ['BREAD', 'a yeast bread'], ['PANCAKE', 'pancakes'],
      ['PIE_CRUST', 'a pie crust'], ['CROISSANT', 'a croissant'], ['MERINGUE', 'a meringue'],
      ['BUTTERCREAM', 'buttercream'], ['SODA_BREAD', 'soda bread'], ['MOUSSE', 'a mousse'],
    ],
  },
  {
    g: 'Savoury and sauces',
    items: [
      ['SOUP', 'a soup'], ['CURRY', 'a curry'], ['STIR_FRY', 'a stir fry'],
      ['PASTA_SAUCE', 'a pasta sauce'], ['BECHAMEL', 'a bechamel'], ['QUICHE', 'a quiche'],
      ['MEATBALLS', 'meatballs'], ['FRIED_CHICKEN', 'fried chicken'], ['MARINADE', 'a marinade'],
      ['VINAIGRETTE', 'a vinaigrette'], ['DIPPING_SAUCE', 'a dipping sauce'],
      ['FRUIT_SAUCE', 'a fruit sauce'],
    ],
  },
  {
    g: 'Technique',
    items: [
      ['CREAMING', 'creaming'], ['RUBBING_IN', 'rubbing in'], ['WHIPPING', 'whipping'],
      ['THICKENING', 'thickening'], ['PAN_FRYING', 'pan frying'], ['DEEP_FRYING', 'deep frying'],
      ['BREADING', 'breading'], ['LAMINATION', 'laminating'], ['GLAZING', 'glazing'],
      ['BRINING', 'brining'], ['CARAMELISATION', 'caramelising'],
    ],
  },
];

/** Cooking order, not alphabetical. Butter first because it is the common case. */
export const INGREDIENTS: Ingredient[] = [
  { id: 'butter', name: 'Butter', roles: ['fat', 'tenderiser', 'flavour'] },
  { id: 'egg', name: 'Egg', roles: ['binder', 'leavener', 'structure'] },
  { id: 'egg-white', name: 'Egg white', roles: ['foaming', 'structure'] },
  { id: 'milk', name: 'Milk', roles: ['liquid', 'browning'] },
  { id: 'buttermilk', name: 'Buttermilk', roles: ['acid', 'tenderiser'] },
  { id: 'heavy-cream', name: 'Heavy cream', roles: ['fat', 'richness'] },
  { id: 'sour-cream', name: 'Sour cream', roles: ['acid', 'richness'] },
  { id: 'wheat-flour', name: 'Wheat flour', roles: ['structure', 'thickener'] },
  { id: 'cornstarch', name: 'Cornstarch', roles: ['thickener', 'crispness'] },
  { id: 'baking-powder', name: 'Baking powder', roles: ['leavener'] },
  { id: 'baking-soda', name: 'Baking soda', roles: ['leavener', 'browning'] },
  { id: 'sugar', name: 'Granulated sugar', roles: ['sweetener', 'browning', 'tenderiser'] },
  { id: 'brown-sugar', name: 'Brown sugar', roles: ['sweetener', 'moisture'] },
  { id: 'honey', name: 'Honey', roles: ['sweetener', 'moisture'] },
  { id: 'vegetable-oil', name: 'Vegetable oil', roles: ['fat', 'moisture'] },
  { id: 'lemon-juice', name: 'Lemon juice', roles: ['acid', 'aroma'] },
  { id: 'white-wine', name: 'White wine', roles: ['acid', 'aroma'] },
  { id: 'soy-sauce', name: 'Soy sauce', roles: ['salt', 'umami'] },
  { id: 'fish-sauce', name: 'Fish sauce', roles: ['umami', 'salt'] },
  { id: 'breadcrumbs', name: 'Breadcrumbs', roles: ['binder', 'crunch'] },
  { id: 'fresh-herbs', name: 'Fresh herbs', roles: ['aroma', 'colour'] },
  { id: 'parmesan', name: 'Parmesan', roles: ['salt', 'umami'] },
];

export const SWAPS: Swap[] = [
  // Butter
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
    from: 'butter', to: 'Olive oil', amount: 0.8, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['fat'], loses: ['dairy flavour', 'browning'],
    ok: ['PAN_FRYING', 'PASTA_SAUCE', 'SOUP'], no: ['BUTTERCREAM', 'PIE_CRUST', 'LAMINATION'],
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

  // Egg
  {
    from: 'egg', to: 'Flax egg', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'One egg equals one tablespoon of ground flaxseed plus three tablespoons of water.',
    keeps: ['binder'], loses: ['leavener', 'structure', 'richness'],
    ok: ['MUFFIN', 'COOKIE', 'QUICK_BREAD', 'BROWNIES', 'PANCAKE', 'MEATBALLS'], no: ['MERINGUE', 'MOUSSE', 'QUICHE'],
    eff: [['texture', 'less', 'Denser and slightly gummy.'], ['colour', 'more', 'Visible brown flecks.']],
    adj: [['rest longer', 'Ten minutes before use, so the flaxseed can gel.']],
  },
  {
    from: 'egg', to: 'Aquafaba', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'About three tablespoons of chickpea cooking liquid per egg.',
    keeps: ['binder', 'leavener'], loses: ['richness'],
    ok: ['COOKIE', 'CAKE', 'MUFFIN', 'BROWNIES', 'BREADING'], no: ['QUICHE'],
    eff: [['texture', 'less', 'A little less tender, since there is no yolk fat.']],
  },
  {
    from: 'egg', to: 'Mashed banana', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'About 60 g, a quarter cup, of very ripe banana per egg.',
    keeps: ['binder', 'moisture'], loses: ['leavener', 'structure'],
    ok: ['MUFFIN', 'QUICK_BREAD', 'PANCAKE', 'BROWNIES'], no: ['MERINGUE', 'QUICHE'],
    eff: [['flavour', 'more', 'It will taste of banana.'], ['moisture', 'more', 'Denser and moister.']],
  },
  {
    from: 'egg', to: 'Baking powder, oil and water', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'One teaspoon of baking powder, one tablespoon of oil and two tablespoons of water per egg. Rise only, not a general egg replacement.',
    keeps: ['leavener'], loses: ['binder', 'structure', 'richness'],
    ok: ['CAKE', 'MUFFIN'], no: ['QUICHE', 'MERINGUE'],
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
    ok: ['QUICHE'], no: ['MERINGUE'],
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

  // Egg white
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

  // Milk
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
    ok: ['CAKE', 'MUFFIN', 'PANCAKE', 'QUICK_BREAD', 'BREAD', 'BECHAMEL', 'SOUP', 'QUICHE'], no: [],
  },
  {
    from: 'milk', to: 'Water', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'It works, but milk was doing more than adding liquid.',
    keeps: ['liquid'], loses: ['browning', 'richness'],
    ok: ['BREAD', 'PANCAKE'], no: ['BECHAMEL', 'QUICHE'],
    eff: [['browning', 'less', 'A paler crust.'], ['texture', 'less', 'Leaner and a little drier.']],
    adj: [['add fat', 'About a tablespoon of butter or oil per cup of water brings some richness back.']],
  },
  {
    from: 'milk', to: 'Evaporated milk and water', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Half evaporated milk, half water.',
    keeps: ['liquid', 'browning', 'richness'], loses: [],
    ok: ['CAKE', 'MUFFIN', 'PANCAKE', 'BECHAMEL', 'SOUP', 'QUICHE', 'BREAD'], no: [],
    eff: [['flavour', 'more', 'Faintly caramel, from the canning.']],
  },

  // Buttermilk: the same pair appears twice, because the acid does two different jobs.
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
    ok: ['PANCAKE', 'SODA_BREAD', 'CAKE', 'MUFFIN', 'FRIED_CHICKEN', 'MARINADE', 'BRINING'], no: [],
    eff: [['texture', 'same', 'Keeps the thickness that milk and lemon lose.']],
  },
  {
    from: 'buttermilk', to: 'Kefir', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['acid', 'viscosity'], loses: [],
    ok: ['PANCAKE', 'SODA_BREAD', 'CAKE', 'MUFFIN', 'FRIED_CHICKEN', 'MARINADE', 'BRINING'], no: [],
    eff: [['flavour', 'more', 'Slightly more sour.']],
  },

  // Heavy cream
  {
    from: 'heavy-cream', to: 'Coconut cream', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Chill the can overnight and use only the solid top if you want to whip it.',
    keeps: ['fat'], loses: ['emulsion stability'],
    ok: ['CURRY', 'WHIPPING', 'SOUP', 'MOUSSE'], no: ['PASTA_SAUCE', 'BECHAMEL'],
    eff: [['flavour', 'more', 'Distinctly coconut.']],
  },
  {
    from: 'heavy-cream', to: 'Milk and melted butter', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Three parts milk to one part melted butter.',
    keeps: ['fat', 'liquid'], loses: ['whipping'],
    ok: ['SOUP', 'PASTA_SAUCE', 'BECHAMEL', 'QUICHE', 'CAKE'], no: ['WHIPPING', 'MOUSSE'],
    eff: [['texture', 'less', 'Will never whip. The fat is not held the way it is in cream.']],
  },
  {
    from: 'heavy-cream', to: 'Crème fraîche', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['fat', 'richness'], loses: [],
    ok: ['PASTA_SAUCE', 'SOUP', 'CURRY', 'DIPPING_SAUCE'], no: [],
    eff: [['flavour', 'more', 'Lightly tangy.'], ['texture', 'same', 'Handles boiling and acid without splitting.']],
  },
  {
    from: 'heavy-cream', to: 'Evaporated milk', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Lighter, and fine anywhere the cream is only adding body.',
    keeps: ['liquid', 'richness'], loses: ['whipping', 'fat'],
    ok: ['SOUP', 'PASTA_SAUCE', 'QUICHE'], no: ['WHIPPING', 'MOUSSE'],
    eff: [['flavour', 'more', 'Faintly caramel.']],
  },

  // Sour cream
  {
    from: 'sour-cream', to: 'Greek yogurt', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['acid', 'richness'], loses: ['heat stability'],
    ok: ['DIPPING_SAUCE', 'CAKE', 'MUFFIN', 'QUICK_BREAD', 'MARINADE'], no: [],
    adj: [['add off the heat', 'Yogurt splits if it boils, so stir it in at the end.']],
  },
  {
    from: 'sour-cream', to: 'Crème fraîche', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['acid', 'richness'], loses: [],
    ok: ['SOUP', 'PASTA_SAUCE', 'DIPPING_SAUCE', 'CAKE'], no: [],
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

  // Wheat flour: cornstarch appears twice, as a thickener and as a coating.
  {
    from: 'wheat-flour', to: 'Cornstarch', amount: 0.5, basis: 'WEIGHT', rel: 'ESTABLISHED',
    note: 'Cornstarch has roughly twice the thickening power of flour.',
    keeps: ['thickener'], loses: ['roux flavour', 'heat stability'],
    ok: ['THICKENING', 'SOUP', 'STIR_FRY', 'FRUIT_SAUCE'], no: ['BECHAMEL'],
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
    ok: ['CAKE', 'COOKIE', 'BROWNIES'], no: ['BREAD', 'LAMINATION', 'CROISSANT'],
    eff: [['rise', 'much less', 'No gluten network, so nothing holds the gas.']],
    adj: [['add binder', 'One egg or 5 g of psyllium per 100 g of flour, to stand in for the gluten.']],
  },
  {
    from: 'wheat-flour', to: 'Gluten free flour blend', amount: 1, basis: 'WEIGHT', rel: 'SITUATIONAL',
    note: 'A cup for cup blend works best in tender bakes where gluten is not the point.',
    keeps: ['bulk'], loses: ['gluten structure'],
    ok: ['CAKE', 'COOKIE', 'MUFFIN', 'PANCAKE', 'BROWNIES', 'QUICK_BREAD', 'BREADING', 'THICKENING'], no: ['BREAD', 'CROISSANT', 'LAMINATION'],
    adj: [['add binder', 'About half a teaspoon of xanthan gum per 120 g of flour, if the blend has none.']],
  },

  // Cornstarch
  {
    from: 'cornstarch', to: 'Arrowroot', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['thickener'], loses: [],
    ok: ['FRUIT_SAUCE', 'THICKENING', 'STIR_FRY'], no: ['BECHAMEL'],
    eff: [['texture', 'same', 'Holds up better against acid than cornstarch does, but turns slimy with dairy.']],
  },
  {
    from: 'cornstarch', to: 'Wheat flour', amount: 2, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['thickener'], loses: ['clarity', 'gloss'],
    ok: ['SOUP', 'THICKENING', 'BECHAMEL'], no: ['FRUIT_SAUCE'],
    eff: [['colour', 'less', 'Sets opaque instead of clear.']],
    adj: [['cook longer', 'A few more minutes, to cook out the raw flour taste.']],
  },
  {
    from: 'cornstarch', to: 'Potato starch', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['thickener', 'crispness'], loses: ['heat stability'],
    ok: ['THICKENING', 'SOUP', 'FRUIT_SAUCE', 'DEEP_FRYING', 'BREADING', 'FRIED_CHICKEN', 'STIR_FRY'], no: [],
    eff: [['texture', 'more', 'Very crisp as a coating.']],
    adj: [['add at the end', 'It thins out if it boils for long, so add it last.']],
  },

  // Leaveners
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

  // Sugar
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

  // Brown sugar
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

  // Honey
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

  // Vegetable oil
  {
    from: 'vegetable-oil', to: 'Melted butter', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    keeps: ['fat'], loses: ['heat tolerance'],
    ok: ['CAKE', 'MUFFIN', 'BROWNIES', 'QUICK_BREAD', 'PANCAKE'], no: ['DEEP_FRYING', 'STIR_FRY'],
    eff: [['flavour', 'more', 'Buttery.'], ['moisture', 'less', 'Firms up as it cools, so the crumb feels drier the next day.']],
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

  // Acids and wine
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
    from: 'white-wine', to: 'Stock and a splash of vinegar', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'One tablespoon of white wine vinegar per cup of stock.',
    keeps: ['liquid', 'acid'], loses: ['aroma'],
    ok: ['PASTA_SAUCE', 'SOUP', 'PAN_FRYING'], no: [],
    eff: [['flavour', 'less', 'Clean, but flatter than wine.']],
  },
  {
    from: 'white-wine', to: 'Dry vermouth', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Keeps for months once opened, which wine does not.',
    keeps: ['acid', 'aroma'], loses: [],
    ok: ['PASTA_SAUCE', 'SOUP', 'PAN_FRYING'], no: [],
    eff: [['flavour', 'more', 'A little more herbal.']],
  },

  // Salty and savoury
  {
    from: 'soy-sauce', to: 'Tamari', amount: 1, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'Usually brewed without wheat. Check the label if gluten is the reason you are swapping.',
    keeps: ['salt', 'umami'], loses: [],
    ok: ['STIR_FRY', 'MARINADE', 'DIPPING_SAUCE', 'SOUP', 'CURRY'], no: [],
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
    from: 'parmesan', to: 'Pecorino romano', amount: 1, basis: 'WEIGHT', rel: 'ESTABLISHED',
    keeps: ['salt', 'umami'], loses: [],
    ok: ['PASTA_SAUCE', 'SOUP', 'VINAIGRETTE'], no: [],
    eff: [['flavour', 'more', 'Saltier and sharper.']],
    adj: [['reduce salt', 'Taste before you salt the dish.']],
  },
  {
    from: 'parmesan', to: 'Nutritional yeast', amount: 0.5, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'A vegan way to get the savoury note.',
    keeps: ['umami'], loses: ['melt', 'salt'],
    ok: ['PASTA_SAUCE', 'SOUP'], no: [],
    eff: [['texture', 'less', 'Does not melt or brown.']],
    adj: [['add salt', 'A pinch, since it carries almost none.']],
  },

  // Crumbs and herbs
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
    from: 'breadcrumbs', to: 'Rolled oats', amount: 1, basis: 'VOLUME', rel: 'SITUATIONAL',
    note: 'Pulse them briefly in a blender first.',
    keeps: ['binder'], loses: ['crunch'],
    ok: ['MEATBALLS'], no: ['BREADING', 'DEEP_FRYING'],
    eff: [['texture', 'less', 'Softer, and it will not fry crisp.']],
  },
  {
    from: 'fresh-herbs', to: 'Dried herbs', amount: 0.33, basis: 'VOLUME', rel: 'ESTABLISHED',
    note: 'One part dried for three parts fresh, because drying concentrates the flavour.',
    keeps: ['aroma'], loses: ['colour', 'brightness'],
    ok: ['SOUP', 'PASTA_SAUCE', 'CURRY', 'MARINADE', 'MEATBALLS'], no: ['VINAIGRETTE', 'DIPPING_SAUCE'],
    eff: [['colour', 'less', 'No green.']],
    adj: [['add early', 'Dried herbs need time in the heat to open up. Fresh ones go in at the end.']],
  },
];
