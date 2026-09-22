/**
 * Ready made questions for the "Try one" row. A new random set is drawn on
 * every visit: seven that have working swaps and one that is known to fail,
 * so every set shows both kinds of answer.
 */
export interface Scenario {
  text: string;
  sit: string;
  ing: string;
}

export const WORKING: Scenario[] = [
  { text: 'Pancakes, but no buttermilk', sit: 'PANCAKE', ing: 'buttermilk' },
  { text: 'Pancakes, but no milk', sit: 'PANCAKE', ing: 'milk' },
  { text: 'Brownies, but no eggs', sit: 'BROWNIES', ing: 'egg' },
  { text: 'Brownies, but no cocoa', sit: 'BROWNIES', ing: 'cocoa-powder' },
  { text: 'Muffins, but no eggs', sit: 'MUFFIN', ing: 'egg' },
  { text: 'A cake, but no butter', sit: 'CAKE', ing: 'butter' },
  { text: 'A cake, but no cake flour', sit: 'CAKE', ing: 'cake-flour' },
  { text: 'Cookies, but no brown sugar', sit: 'COOKIE', ing: 'brown-sugar' },
  { text: 'Bread, but no bread flour', sit: 'BREAD', ing: 'bread-flour' },
  { text: 'Pizza dough, but no dry yeast', sit: 'PIZZA', ing: 'yeast' },
  { text: 'Cheesecake, but no cream cheese', sit: 'CHEESECAKE', ing: 'cream-cheese' },
  { text: 'Panna cotta, but no gelatin', sit: 'SET_DESSERT', ing: 'gelatin' },
  { text: 'A meringue, but no egg whites', sit: 'MERINGUE', ing: 'egg-white' },
  { text: 'A custard, but no egg yolks', sit: 'CUSTARD', ing: 'egg-yolk' },
  { text: 'Buttercream, but no powdered sugar', sit: 'BUTTERCREAM', ing: 'powdered-sugar' },
  { text: 'Pasta sauce, but no cream', sit: 'PASTA_SAUCE', ing: 'heavy-cream' },
  { text: 'A soup, but no cream', sit: 'SOUP', ing: 'heavy-cream' },
  { text: 'A curry, but no coconut milk', sit: 'CURRY', ing: 'coconut-milk' },
  { text: 'A stir fry, but no soy sauce', sit: 'STIR_FRY', ing: 'soy-sauce' },
  { text: 'A stew, but no red wine', sit: 'STEW', ing: 'red-wine' },
  { text: 'Pesto, but no pine nuts', sit: 'PESTO', ing: 'pine-nuts' },
  { text: 'Meatballs, but no breadcrumbs', sit: 'MEATBALLS', ing: 'breadcrumbs' },
  { text: 'Fried chicken, but no buttermilk', sit: 'FRIED_CHICKEN', ing: 'buttermilk' },
  { text: 'A vinaigrette, but no Dijon', sit: 'VINAIGRETTE', ing: 'dijon-mustard' },
  { text: 'A creamy salad, but no mayonnaise', sit: 'SALAD', ing: 'mayonnaise' },
  { text: 'A marinade, but no Worcestershire', sit: 'MARINADE', ing: 'worcestershire' },
  { text: 'A dipping sauce, but no fish sauce', sit: 'DIPPING_SAUCE', ing: 'fish-sauce' },
  { text: 'Sushi rice, but no rice vinegar', sit: 'SUSHI_RICE', ing: 'rice-vinegar' },
];

export const FAILING: Scenario[] = [
  { text: 'Croissants, but no butter', sit: 'CROISSANT', ing: 'butter' },
  { text: 'Caramel, but no sugar', sit: 'CARAMELISATION', ing: 'sugar' },
  { text: 'A meringue, but no sugar', sit: 'MERINGUE', ing: 'sugar' },
  { text: 'Pesto, but no fresh herbs', sit: 'PESTO', ing: 'fresh-herbs' },
  { text: 'A stir fry, but no fresh garlic', sit: 'STIR_FRY', ing: 'garlic' },
];

const shuffle = <T,>(xs: T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Fixed set for the server render, so the HTML is stable. */
export const DEFAULT_PICKS: Scenario[] = [...WORKING.slice(0, 7), FAILING[0]];

/** Seven working questions and one known failure, in random order. */
export const pickScenarios = (): Scenario[] =>
  shuffle([...shuffle(WORKING).slice(0, 7), shuffle(FAILING)[0]]);
