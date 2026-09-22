import { builder } from './builder';

export const MeasurementBasis = builder.enumType('MeasurementBasis', {
  description: 'A ratio without a basis is a bug. Butter to oil is 1:0.8 by weight and something else by volume.',
  values: ['WEIGHT', 'VOLUME'] as const,
});

export const Reliability = builder.enumType('Reliability', {
  description:
    'Deliberately an enum rather than a confidence float. There is no model behind a number like 0.91, so publishing one would be fake precision.',
  values: ['ESTABLISHED', 'SITUATIONAL', 'CONTESTED'] as const,
});

export const CulinaryRole = builder.enumType('CulinaryRole', {
  description: 'What an ingredient does in a dish. A substitution is judged by which of these it keeps and which it drops.',
  values: [
    'FAT', 'FLAVOUR', 'DAIRY_FLAVOUR', 'WATER_CONTENT', 'CREAMED_AIR',
    'LAMINATION_PLASTICITY', 'HIGH_HEAT_TOLERANCE', 'MOISTURE', 'TENDERISER',
    'BINDER', 'LEAVENER', 'STRUCTURE', 'RICHNESS', 'FOAMING', 'FOAM_STABILITY',
    'BROWNING', 'GLOSS', 'SET', 'ACID', 'VISCOSITY', 'CLING',
    'EMULSION_STABILITY', 'LIQUID', 'THICKENER', 'ROUX_FLAVOUR',
    'HEAT_STABILITY', 'BULK', 'GLUTEN_STRUCTURE', 'UMAMI', 'SALT',
    'FERMENTED_FUNK', 'CITRUS_AROMA', 'SWEETENER', 'CRYSTAL_STRUCTURE', 'SPREAD',
  ] as const,
});

export const Technique = builder.enumType('Technique', {
  values: [
    'CREAMING', 'RUBBING_IN', 'LAMINATION', 'PAN_FRYING', 'SAUTEING',
    'HIGH_HEAT_SEARING', 'WHIPPING', 'GLAZING', 'BRINING', 'THICKENING',
    'ROUX', 'PROLONGED_SIMMER', 'PAN_SAUCE_WITH_WINE', 'CARAMELISATION',
  ] as const,
});

export const DishType = builder.enumType('DishType', {
  values: [
    'CAKE', 'SPONGE_CAKE', 'COOKIE', 'MUFFIN', 'QUICK_BREAD', 'BREAD',
    'CROISSANT', 'PUFF_PASTRY', 'SHORTCRUST', 'BUTTERCREAM', 'MERINGUE',
    'MOUSSE', 'CUSTARD', 'SWEET_CUSTARD', 'QUICHE', 'PANCAKE', 'SODA_BREAD',
    'FRIED_CHICKEN', 'CURRY', 'BECHAMEL', 'FRUIT_SAUCE', 'DAIRY_SAUCE',
    'DIPPING_SAUCE', 'VINAIGRETTE',
  ] as const,
});

export const DietaryConstraint = builder.enumType('DietaryConstraint', {
  values: ['VEGAN', 'DAIRY_FREE', 'EGG_FREE', 'GLUTEN_FREE', 'FISH_FREE', 'SHELLFISH_FREE'] as const,
});

export const Allergen = builder.enumType('Allergen', {
  values: ['MILK', 'EGG', 'GLUTEN', 'TREE_NUT', 'COCONUT', 'SOY', 'FISH'] as const,
});

export const EffectDimension = builder.enumType('EffectDimension', {
  values: ['FLAVOUR', 'TEXTURE', 'MOISTURE', 'BROWNING', 'RISE', 'SET', 'COLOUR'] as const,
});

export const EffectDirection = builder.enumType('EffectDirection', {
  description: 'Ordinal, not numeric. "browning: -1" would be meaningless because there is no unit.',
  values: ['MUCH_LESS', 'LESS', 'SAME', 'MORE', 'MUCH_MORE'] as const,
});

export const AdjustmentAction = builder.enumType('AdjustmentAction', {
  description: 'The compensating action a cook must take. This is the difference between a lookup and advice.',
  values: [
    'ADD_LIQUID', 'REDUCE_LIQUID', 'LOWER_TEMP', 'REST_LONGER', 'ADD_ACID',
    'ADD_BINDER', 'ADD_LEAVENER', 'CHILL_FIRST',
  ] as const,
});
