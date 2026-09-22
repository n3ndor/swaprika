/**
 * Why a swap fails where it is recorded as failing. Keyed by "from>to".
 * One sentence per swap is enough, because a swap's failures almost always
 * share one cause: oil fails in pastry, frosting and creaming for the same
 * reason, it is liquid. Every swap with a non empty `no` list must have one.
 */
export const FAIL_WHY: Record<string, string> = {
  'butter>Coconut oil': 'It is brittle when cold and melts fast when warm, so it cannot be rolled into layers or beaten into a stable frosting.',
  'butter>Neutral oil': 'It is liquid, so it cannot trap air, hold layers or make flaky pastry. Anything that needs solid fat fails.',
  'butter>Vegan butter block': 'Everyday vegan blocks soften and smear when folded, so the layers merge. Only special laminating blocks hold up.',
  'butter>Lard': 'Its savoury taste comes through in sweet, butter led recipes like frosting and sponge.',
  'butter>Olive oil': 'It is liquid and strongly flavoured, so it cannot give flaky pastry, layers or a sweet, stable frosting.',
  'butter>Ghee': 'It has no water and a soft, grainy texture, so it will not cream into light batters or smooth frosting.',
  'butter>Applesauce': 'It adds water, not fat, so crisp and flaky bakes turn soft and cakey.',
  'butter>Greek yogurt': 'It adds water and acid instead of fat, so crisp or rich bakes lose their texture.',

  'egg>Flax egg': 'It binds, but it cannot foam or set, so anything built on whipped eggs or a baked set fails.',
  'egg>Aquafaba': 'It has no yolk proteins, so it cannot set a custard or a quiche filling.',
  'egg>Mashed banana': 'It cannot foam or set, and it would make a savoury filling taste of banana.',
  'egg>Yogurt': 'It cannot foam, and it will not set a filling the way eggs do.',
  'egg>Baking powder, oil and water': 'It only makes gas. There is nothing in it that can set or foam.',
  'egg>Plant milk and maple glaze': 'It is a surface glaze only. Inside a batter or filling it does nothing.',
  'egg>Silken tofu': 'It sets savoury fillings well, but it cannot foam, and its taste shows in a sweet custard.',
  'egg>Breadcrumbs soaked in milk': 'Soaked bread binds minced meat. In a batter it just turns it soggy.',
  'egg>Buttermilk': 'It helps crumbs stick, but it cannot bind or set anything.',

  'egg-yolk>Mustard': 'It holds a dressing together, but it cannot thicken or set a custard.',
  'egg-yolk>Cornstarch': 'It thickens, but it cannot hold oil and water together.',

  'milk>Almond milk': 'It is too thin and too low in protein to set a custard.',
  'milk>Water': 'These dishes rely on milk for body and flavour. Water leaves them thin and bland.',

  'heavy-cream>Coconut cream': 'Its coconut flavour clashes with Italian and French cream sauces.',
  'heavy-cream>Milk and melted butter': 'The fat is not structured the way it is in cream, so it will never whip.',
  'heavy-cream>Evaporated milk': 'It has far too little fat to whip.',
  'heavy-cream>Cashew cream': 'It thickens, but there is no fat structure to whip.',

  'sour-cream>Cashew cream': 'It lacks the acid and dairy protein a cake batter is built around.',

  'cream-cheese>Strained Greek yogurt': 'Too wet and too lean, so the frosting turns runny.',
  'cream-cheese>Blended cottage cheese': 'Too wet and too lean, so the frosting turns runny.',
  'ricotta>Silken tofu and lemon': 'It will not bake into the dense, creamy set of a cheesecake.',

  'wheat-flour>Cornstarch': 'A bechamel needs a flour roux, and in a long simmer cornstarch breaks down and the sauce thins again.',
  'wheat-flour>Almond flour': 'There is no gluten, so nothing can stretch, rise and hold its shape.',
  'wheat-flour>Gluten free flour blend': 'Without gluten a yeast dough cannot stretch or hold the gas.',
  'wheat-flour>Oat flour': 'Without gluten a yeast dough cannot stretch or hold the gas.',
  'cake-flour>All purpose flour and cornstarch': 'Far too little protein for a chewy, well risen dough.',
  'self-raising-flour>All purpose flour, baking powder and salt': 'Baking powder has no place in a yeast dough, and the added salt throws the recipe off.',

  'cornstarch>Arrowroot': 'It turns slimy when it is cooked with dairy.',
  'cornstarch>Wheat flour': 'It turns a clear, glossy fruit sauce cloudy and dull.',
  'cornstarch>Potato starch': 'It breaks down during a long simmer, and the stew thins out.',
  'gelatin>Agar agar': 'It sets firm and brittle, so a mousse turns rubbery instead of airy.',

  'baking-soda>Baking powder': 'Cookies need soda to spread and brown. With powder they puff up and turn cakey.',

  'sugar>Honey': 'It burns before it caramelises cleanly, and its water collapses a meringue.',
  'sugar>Maple syrup': 'It is liquid, so it deflates a meringue and makes frosting runny.',
  'sugar>Brown sugar': 'Its moisture and acidity stop a meringue from getting stiff and dry.',
  'sugar>Coconut sugar': 'It burns quickly and will not whip into a stable meringue.',
  'sugar>Erythritol': 'It does not melt and caramelise the way sugar does.',
  'corn-syrup>Honey': 'It scorches before the caramel is ready.',

  'dark-chocolate>Cocoa, sugar and butter': 'Without cocoa butter it will not set firm or shine.',
  'dark-chocolate>Milk chocolate': 'It sets too softly for a mousse to hold its shape.',
  'vanilla-extract>Bourbon or dark rum': 'Nothing bakes the alcohol off in a frosting, so it tastes raw.',

  'vegetable-oil>Melted butter': 'Its milk solids burn at frying heat.',
  'vegetable-oil>Melted coconut oil': 'It turns solid below about 24 C, so it seizes into lumps in a cold dressing.',
  'vegetable-oil>Applesauce': 'It is not a fat. You cannot fry in it, and cookies go soft.',
  'mayonnaise>Greek yogurt': 'It is not an emulsion, so it cannot stand in where you need one.',
  'mayonnaise>Mashed avocado': 'It cannot hold oil and water together.',

  'soy-sauce>Miso thinned with water': 'It turns a thin dipping sauce cloudy and pasty.',
  'fish-sauce>Anchovy paste': 'It is a paste, so a thin dipping sauce turns gritty.',
  'tomato-paste>Ketchup': 'Its sugar and vinegar are far too obvious in a tomato pasta sauce.',
  'lemon-juice>White wine vinegar': 'These dishes depend on the lemon aroma, not just the sourness.',
  'rice-vinegar>Lime juice': 'Sushi rice needs a mellow vinegar. Lime tastes sharp and out of place.',

  'fresh-herbs>Dried herbs': 'Uncooked, dried herbs taste dusty, and a pesto is made of fresh leaves.',
  'garlic>Garlic powder': 'It burns within seconds in hot oil.',
  'onion>Onion powder': 'There is nothing to fry, so the sweetness of a browned onion never develops.',
  'ginger>Ground ginger': 'It scorches in a hot wok and has none of the fresh zing a stir fry needs.',
  'breadcrumbs>Crushed cornflakes': 'They go soggy and sweet inside the meat.',
  'breadcrumbs>Rolled oats': 'They will not fry crisp.',
};

export const whyKey = (from: string, to: string) => `${from}>${to}`;
