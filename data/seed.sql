-- Swaprika seed data
-- Licence: CC BY-NC-SA 4.0. See LICENSE-DATA.
--
-- These are hand built edges chosen because CONTEXT CHANGES THE ANSWER.
-- A flat "butter to coconut oil 1:1" list is what every competitor already has.

INSERT INTO ingredients (id, canonical_name, parent_id) VALUES
  ('food',        'Food',            NULL),
  ('fat',         'Fat',             'food'),
  ('dairy-fat',   'Dairy fat',       'fat'),
  ('plant-oil',   'Plant oil',       'fat'),
  ('fat-blend',   'Fat blend',       'fat'),
  ('dairy',       'Dairy',           'food'),
  ('plant-milk',  'Plant milk',      'food'),
  ('egg-product', 'Egg product',     'food'),
  ('egg-replacer','Egg replacer',    'food'),
  ('flour',       'Flour',           'food'),
  ('starch',      'Starch',          'food'),
  ('sweetener',   'Sweetener',       'food'),
  ('acid',        'Acid',            'food'),
  ('seasoning',   'Seasoning',       'food'),
  ('fruit-puree', 'Fruit puree',     'food');

INSERT INTO ingredients (id, canonical_name, parent_id) VALUES
  ('butter',            'Butter',             'dairy-fat'),
  ('coconut-oil',       'Coconut oil',        'plant-oil'),
  ('neutral-oil',       'Neutral oil',        'plant-oil'),
  ('olive-oil',         'Olive oil',          'plant-oil'),
  ('vegan-butter-block','Vegan butter block', 'fat-blend'),
  ('applesauce',        'Applesauce',         'fruit-puree'),
  ('egg',               'Egg',                'egg-product'),
  ('egg-white',         'Egg white',          'egg-product'),
  ('flax-egg',          'Flax egg',           'egg-replacer'),
  ('aquafaba',          'Aquafaba',           'egg-replacer'),
  ('baking-powder-mix', 'Baking powder, oil and water', 'egg-replacer'),
  ('silken-tofu',       'Silken tofu',        'egg-replacer'),
  ('plant-milk-glaze',  'Plant milk and maple glaze', 'plant-milk'),
  ('buttermilk',        'Buttermilk',         'dairy'),
  ('milk',              'Milk',               'dairy'),
  ('milk-plus-acid',    'Milk with added acid','dairy'),
  ('heavy-cream',       'Heavy cream',        'dairy'),
  ('coconut-cream',     'Coconut cream',      'plant-milk'),
  ('oat-milk',          'Oat milk',           'plant-milk'),
  ('wheat-flour',       'Wheat flour',        'flour'),
  ('almond-flour',      'Almond flour',       'flour'),
  ('cornstarch',        'Cornstarch',         'starch'),
  ('arrowroot',         'Arrowroot',          'starch'),
  ('sugar',             'Granulated sugar',   'sweetener'),
  ('honey',             'Honey',              'sweetener'),
  ('erythritol',        'Erythritol',         'sweetener'),
  ('lemon-juice',       'Lemon juice',        'acid'),
  ('vinegar',           'Vinegar',            'acid'),
  ('fish-sauce',        'Fish sauce',         'seasoning'),
  ('soy-seaweed',       'Soy sauce with seaweed', 'seasoning');

-- The ajvar / lecso / sofrito problem: one entity, many regional names.
INSERT INTO ingredient_names (ingredient_id, locale, value) VALUES
  ('cornstarch','en-US','cornstarch'),
  ('cornstarch','en-GB','cornflour'),
  ('cornstarch','de','Speisestaerke'),
  ('neutral-oil','en-US','vegetable oil'),
  ('neutral-oil','en-GB','sunflower oil'),
  ('heavy-cream','en-US','heavy cream'),
  ('heavy-cream','en-GB','double cream'),
  ('butter','en-US','butter'),
  ('butter','de','Butter'),
  ('butter','es','mantequilla'),
  ('egg','en-US','egg'),
  ('sugar','en-US','sugar'),
  ('aquafaba','en-US','aquafaba'),
  ('aquafaba','en-GB','chickpea water');

INSERT INTO ingredient_roles (ingredient_id, role) VALUES
  ('butter','FAT'),('butter','TENDERISER'),('butter','FLAVOUR'),
  ('egg','BINDER'),('egg','LEAVENER'),('egg','STRUCTURE'),('egg','RICHNESS'),
  ('wheat-flour','STRUCTURE'),('wheat-flour','THICKENER'),
  ('cornstarch','THICKENER'),
  ('sugar','SWEETENER'),('sugar','BROWNING'),('sugar','TENDERISER'),
  ('lemon-juice','ACID'),('fish-sauce','UMAMI'),('fish-sauce','SALT'),
  -- Needed so the pantry screen can describe every ingredient from the API
  -- rather than from a hardcoded list in the front end.
  ('egg-white','FOAMING'),
  ('buttermilk','ACID'),('buttermilk','CLING'),
  ('milk','LIQUID'),
  ('heavy-cream','FAT'),('heavy-cream','EMULSION_STABILITY');

INSERT INTO ingredient_allergens (ingredient_id, allergen) VALUES
  ('butter','MILK'),('buttermilk','MILK'),('milk','MILK'),('heavy-cream','MILK'),
  ('egg','EGG'),('egg-white','EGG'),
  ('wheat-flour','GLUTEN'),('almond-flour','TREE_NUT'),
  ('coconut-oil','COCONUT'),('coconut-cream','COCONUT'),
  ('silken-tofu','SOY'),('soy-seaweed','SOY'),('vegan-butter-block','SOY'),
  ('fish-sauce','FISH');

-- ---------------------------------------------------------------------------
-- Substitutions. Note sub-11a and sub-11b: the SAME pair, two different facts.
-- That is why a substitution has its own identity instead of being an edge
-- property.
-- ---------------------------------------------------------------------------
INSERT INTO substitutions (id, from_id, to_id, ratio_amount, ratio_basis, ratio_note, reliability) VALUES
  ('sub-01','butter','coconut-oil',       1.0,  'WEIGHT', NULL, 'ESTABLISHED'),
  ('sub-02','butter','neutral-oil',       0.8,  'WEIGHT', 'Butter is roughly 80 percent fat and 16 percent water. Match the fat, then put the water back.', 'ESTABLISHED'),
  ('sub-03','butter','vegan-butter-block',1.0,  'WEIGHT', NULL, 'ESTABLISHED'),
  ('sub-04','butter','olive-oil',         0.8,  'WEIGHT', NULL, 'ESTABLISHED'),
  ('sub-05','butter','applesauce',        0.5,  'WEIGHT', 'Replace at most half. Full replacement turns the crumb rubbery.', 'SITUATIONAL'),
  ('sub-06','egg','flax-egg',             1.0,  'VOLUME', 'One egg equals one tablespoon ground flaxseed plus three tablespoons water.', 'ESTABLISHED'),
  ('sub-07','egg-white','aquafaba',       1.0,  'WEIGHT', 'One egg white equals about 30 g aquafaba.', 'ESTABLISHED'),
  ('sub-08','egg','baking-powder-mix',    1.0,  'VOLUME', 'Rise only. Not a general egg replacement.', 'SITUATIONAL'),
  ('sub-09','egg','plant-milk-glaze',     1.0,  'VOLUME', 'Surface glaze only.', 'ESTABLISHED'),
  ('sub-10','egg','silken-tofu',          1.0,  'WEIGHT', 'One egg equals about 60 g blended silken tofu.', 'SITUATIONAL'),
  ('sub-11a','buttermilk','milk-plus-acid',1.0, 'VOLUME', 'Acid as a leavening reagent. It must react with baking soda.', 'ESTABLISHED'),
  ('sub-11b','buttermilk','milk-plus-acid',1.0, 'VOLUME', 'Acid as a tenderiser in a brine. Different job, same swap.', 'SITUATIONAL'),
  ('sub-12','heavy-cream','coconut-cream', 1.0, 'VOLUME', NULL, 'SITUATIONAL'),
  ('sub-13','milk','oat-milk',             1.0, 'VOLUME', NULL, 'ESTABLISHED'),
  ('sub-14','wheat-flour','cornstarch',    0.5, 'WEIGHT', 'Cornstarch has roughly twice the thickening power of flour.', 'ESTABLISHED'),
  ('sub-15','wheat-flour','almond-flour',  0.9, 'WEIGHT', 'Never a straight swap. There is no gluten to build structure.', 'CONTESTED'),
  ('sub-16','cornstarch','arrowroot',      1.0, 'WEIGHT', NULL, 'ESTABLISHED'),
  ('sub-17','fish-sauce','soy-seaweed',    1.0, 'VOLUME', NULL, 'SITUATIONAL'),
  ('sub-18','lemon-juice','vinegar',       1.0, 'VOLUME', NULL, 'SITUATIONAL'),
  ('sub-19','sugar','honey',               0.75,'WEIGHT', NULL, 'ESTABLISHED'),
  ('sub-20','sugar','erythritol',          1.0, 'WEIGHT', NULL, 'SITUATIONAL');

INSERT INTO substitution_roles (substitution_id, kind, role) VALUES
  ('sub-01','PRESERVES','FAT'),('sub-01','LOSES','DAIRY_FLAVOUR'),
  ('sub-02','PRESERVES','FAT'),('sub-02','LOSES','WATER_CONTENT'),('sub-02','LOSES','CREAMED_AIR'),
  ('sub-03','PRESERVES','FAT'),('sub-03','LOSES','LAMINATION_PLASTICITY'),
  ('sub-04','PRESERVES','FAT'),('sub-04','LOSES','DAIRY_FLAVOUR'),('sub-04','LOSES','HIGH_HEAT_TOLERANCE'),
  ('sub-05','PRESERVES','MOISTURE'),('sub-05','LOSES','FAT'),('sub-05','LOSES','TENDERISER'),
  ('sub-06','PRESERVES','BINDER'),('sub-06','LOSES','LEAVENER'),('sub-06','LOSES','STRUCTURE'),('sub-06','LOSES','RICHNESS'),
  ('sub-07','PRESERVES','FOAMING'),('sub-07','LOSES','FOAM_STABILITY'),
  ('sub-08','PRESERVES','LEAVENER'),('sub-08','LOSES','BINDER'),('sub-08','LOSES','STRUCTURE'),('sub-08','LOSES','RICHNESS'),
  ('sub-09','PRESERVES','BROWNING'),('sub-09','LOSES','GLOSS'),
  ('sub-10','PRESERVES','SET'),('sub-10','LOSES','RICHNESS'),('sub-10','LOSES','LEAVENER'),
  ('sub-11a','PRESERVES','ACID'),('sub-11a','LOSES','VISCOSITY'),
  ('sub-11b','PRESERVES','ACID'),('sub-11b','LOSES','VISCOSITY'),('sub-11b','LOSES','CLING'),
  ('sub-12','PRESERVES','FAT'),('sub-12','LOSES','EMULSION_STABILITY'),
  ('sub-13','PRESERVES','LIQUID'),
  ('sub-14','PRESERVES','THICKENER'),('sub-14','LOSES','ROUX_FLAVOUR'),('sub-14','LOSES','HEAT_STABILITY'),
  ('sub-15','PRESERVES','BULK'),('sub-15','LOSES','GLUTEN_STRUCTURE'),
  ('sub-16','PRESERVES','THICKENER'),
  ('sub-17','PRESERVES','UMAMI'),('sub-17','PRESERVES','SALT'),('sub-17','LOSES','FERMENTED_FUNK'),
  ('sub-18','PRESERVES','ACID'),('sub-18','LOSES','CITRUS_AROMA'),
  ('sub-19','PRESERVES','SWEETENER'),('sub-19','LOSES','CRYSTAL_STRUCTURE'),
  ('sub-20','PRESERVES','SWEETENER'),('sub-20','LOSES','BROWNING'),('sub-20','LOSES','SPREAD');

-- included = 0 rows are the ones nobody else has.
INSERT INTO substitution_scope (substitution_id, dimension, value, included) VALUES
  ('sub-01','TECHNIQUE','CREAMING',1),('sub-01','DISH_TYPE','CAKE',1),('sub-01','DISH_TYPE','COOKIE',1),('sub-01','DISH_TYPE','BUTTERCREAM',0),
  ('sub-02','DISH_TYPE','CAKE',1),('sub-02','DISH_TYPE','MUFFIN',1),('sub-02','TECHNIQUE','CREAMING',0),('sub-02','TECHNIQUE','LAMINATION',0),
  ('sub-03','TECHNIQUE','CREAMING',1),('sub-03','TECHNIQUE','RUBBING_IN',1),('sub-03','TECHNIQUE','LAMINATION',0),('sub-03','DISH_TYPE','CROISSANT',0),('sub-03','DISH_TYPE','PUFF_PASTRY',0),
  ('sub-04','TECHNIQUE','PAN_FRYING',1),('sub-04','TECHNIQUE','SAUTEING',1),('sub-04','TECHNIQUE','HIGH_HEAT_SEARING',0),('sub-04','DISH_TYPE','BUTTERCREAM',0),
  ('sub-05','DISH_TYPE','MUFFIN',1),('sub-05','DISH_TYPE','QUICK_BREAD',1),('sub-05','DISH_TYPE','SHORTCRUST',0),('sub-05','DISH_TYPE','COOKIE',0),
  ('sub-06','DISH_TYPE','MUFFIN',1),('sub-06','DISH_TYPE','COOKIE',1),('sub-06','DISH_TYPE','QUICK_BREAD',1),('sub-06','DISH_TYPE','SPONGE_CAKE',0),('sub-06','DISH_TYPE','MERINGUE',0),('sub-06','DISH_TYPE','CUSTARD',0),
  ('sub-07','TECHNIQUE','WHIPPING',1),('sub-07','DISH_TYPE','MERINGUE',1),('sub-07','DISH_TYPE','MOUSSE',1),
  ('sub-08','DISH_TYPE','CAKE',1),('sub-08','DISH_TYPE','CUSTARD',0),('sub-08','DISH_TYPE','MERINGUE',0),
  ('sub-09','TECHNIQUE','GLAZING',1),('sub-09','DISH_TYPE','CUSTARD',0),('sub-09','DISH_TYPE','CAKE',0),
  ('sub-10','DISH_TYPE','QUICHE',1),('sub-10','DISH_TYPE','SWEET_CUSTARD',0),
  ('sub-11a','DISH_TYPE','PANCAKE',1),('sub-11a','DISH_TYPE','SODA_BREAD',1),
  ('sub-11b','DISH_TYPE','FRIED_CHICKEN',1),('sub-11b','TECHNIQUE','BRINING',1),
  ('sub-12','DISH_TYPE','CURRY',1),('sub-12','TECHNIQUE','WHIPPING',1),('sub-12','TECHNIQUE','PAN_SAUCE_WITH_WINE',0),
  ('sub-13','DISH_TYPE','BECHAMEL',1),
  ('sub-14','TECHNIQUE','THICKENING',1),('sub-14','TECHNIQUE','ROUX',0),('sub-14','TECHNIQUE','PROLONGED_SIMMER',0),
  ('sub-15','DISH_TYPE','CAKE',1),('sub-15','DISH_TYPE','BREAD',0),('sub-15','TECHNIQUE','LAMINATION',0),
  ('sub-16','DISH_TYPE','FRUIT_SAUCE',1),('sub-16','DISH_TYPE','DAIRY_SAUCE',0),
  ('sub-17','DISH_TYPE','CURRY',1),('sub-17','DISH_TYPE','DIPPING_SAUCE',1),
  ('sub-18','DISH_TYPE','VINAIGRETTE',1),('sub-18','DISH_TYPE','DAIRY_SAUCE',0),
  ('sub-19','DISH_TYPE','CAKE',1),('sub-19','DISH_TYPE','COOKIE',1),('sub-19','TECHNIQUE','CARAMELISATION',0),
  ('sub-20','DISH_TYPE','COOKIE',1),('sub-20','TECHNIQUE','CARAMELISATION',0),('sub-20','DISH_TYPE','MERINGUE',0);

INSERT INTO substitution_dietary (substitution_id, kind, value) VALUES
  ('sub-01','SATISFIES','VEGAN'),('sub-01','SATISFIES','DAIRY_FREE'),('sub-01','INTRODUCES','COCONUT'),
  ('sub-02','SATISFIES','VEGAN'),('sub-02','SATISFIES','DAIRY_FREE'),
  ('sub-03','SATISFIES','VEGAN'),('sub-03','SATISFIES','DAIRY_FREE'),('sub-03','INTRODUCES','SOY'),
  ('sub-04','SATISFIES','VEGAN'),('sub-04','SATISFIES','DAIRY_FREE'),
  ('sub-06','SATISFIES','VEGAN'),('sub-06','SATISFIES','EGG_FREE'),
  ('sub-07','SATISFIES','VEGAN'),('sub-07','SATISFIES','EGG_FREE'),
  ('sub-08','SATISFIES','EGG_FREE'),
  ('sub-09','SATISFIES','VEGAN'),('sub-09','SATISFIES','EGG_FREE'),
  ('sub-10','SATISFIES','EGG_FREE'),('sub-10','INTRODUCES','SOY'),
  ('sub-12','SATISFIES','VEGAN'),('sub-12','SATISFIES','DAIRY_FREE'),('sub-12','INTRODUCES','COCONUT'),
  ('sub-13','SATISFIES','VEGAN'),('sub-13','SATISFIES','DAIRY_FREE'),
  ('sub-14','SATISFIES','GLUTEN_FREE'),
  ('sub-15','SATISFIES','GLUTEN_FREE'),('sub-15','INTRODUCES','TREE_NUT'),
  ('sub-17','SATISFIES','FISH_FREE'),('sub-17','SATISFIES','SHELLFISH_FREE'),('sub-17','INTRODUCES','SOY');

INSERT INTO substitution_effects (substitution_id, dimension, direction, note) VALUES
  ('sub-01','FLAVOUR','MORE','Coconut note unless refined coconut oil is used.'),
  ('sub-01','TEXTURE','LESS','Sets harder when cold.'),
  ('sub-02','MOISTURE','MORE','Oil coats flour more completely, so the crumb reads moister.'),
  ('sub-02','RISE','LESS','No air is beaten in, because oil cannot be creamed.'),
  ('sub-03','TEXTURE','LESS','Will not hold discrete layers through folding.'),
  ('sub-04','FLAVOUR','MORE','Peppery, and it carries into the finished dish.'),
  ('sub-05','TEXTURE','LESS','Rubbery if you replace more than half.'),
  ('sub-05','BROWNING','LESS',NULL),
  ('sub-06','TEXTURE','LESS','Denser and slightly gummy.'),
  ('sub-06','COLOUR','MORE','Visible brown flecks.'),
  ('sub-07','SET','LESS','Foam is less stable and weeps sooner.'),
  ('sub-09','COLOUR','LESS','Browns, but with far less gloss.'),
  ('sub-12','FLAVOUR','MORE','Distinctly coconut.'),
  ('sub-13','TEXTURE','MORE','Thickens slightly more than dairy milk.'),
  ('sub-14','FLAVOUR','LESS','No toasted roux flavour at all.'),
  ('sub-14','COLOUR','LESS','Sets clear rather than opaque.'),
  ('sub-15','RISE','MUCH_LESS','No gluten network, so nothing holds the gas.'),
  ('sub-16','TEXTURE','SAME','Holds better against acid than cornstarch does.'),
  ('sub-17','FLAVOUR','LESS','Salt and umami survive, the fermented funk does not.'),
  ('sub-19','BROWNING','MUCH_MORE','Fructose browns much faster than sucrose.'),
  ('sub-19','MOISTURE','MORE','Honey is hygroscopic, the crumb stays moist longer.'),
  ('sub-20','BROWNING','MUCH_LESS','Does not caramelise at all.'),
  ('sub-20','TEXTURE','LESS','Cookies will not spread.'),
  ('sub-20','FLAVOUR','LESS','Noticeable cooling sensation on the palate.');

-- The compensating actions. No competitor exposes these.
INSERT INTO substitution_adjustments (substitution_id, action, amount, reason) VALUES
  ('sub-02','ADD_LIQUID','About 15 percent of the butter weight','Butter carries water that the oil does not.'),
  ('sub-04','LOWER_TEMP','Stay below the smoke point','Olive oil smokes well before clarified butter does.'),
  ('sub-06','REST_LONGER','10 minutes before use','The flaxseed needs time to gel.'),
  ('sub-07','ADD_ACID','A pinch of cream of tartar','Stabilises a foam that is weaker than egg white.'),
  ('sub-07','REST_LONGER','Whip two to three times longer','Aquafaba takes far longer to reach stiff peaks.'),
  ('sub-11a','REST_LONGER','10 minutes','Let the milk clabber before mixing.'),
  ('sub-15','ADD_BINDER','One egg or 5 g psyllium per 100 g flour','Something has to replace the gluten network.'),
  ('sub-19','REDUCE_LIQUID','About 60 ml per 240 ml of honey','Honey is roughly 17 percent water.'),
  ('sub-19','LOWER_TEMP','By about 15 C','Otherwise the outside burns before the centre sets.');

INSERT INTO substitution_sources (substitution_id, kind, citation) VALUES
  ('sub-02','REFERENCE','Butter composition, USDA FoodData Central'),
  ('sub-03','REFERENCE','Laminated dough requires a plastic fat with low water content'),
  ('sub-19','REFERENCE','Honey composition, USDA FoodData Central');
