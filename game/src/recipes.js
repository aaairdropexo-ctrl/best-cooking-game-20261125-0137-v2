// Recipes: the six ingredients and the five dishes of the noodle bar.
// Every ingredient has a preparation path; every dish combines them in a
// different way, so no two orders play the same.

// Preparation a raw ingredient needs before it can go on a plate.
// 'none'  -> straight from the crate to the plate.
// 'chop'  -> chop board, then it is ready.
// 'cook'  -> wok, then it is ready.
// 'chop+cook' -> chop board first, then the wok.
NB.INGREDIENTS = [
  { id: 'noodles', name: 'Noodles', prep: 'cook', color: '#ffd166', key: '1', blurb: 'Wok-fried' },
  { id: 'broth', name: 'Broth', prep: 'none', color: '#e07b39', key: '2', blurb: 'Ladled hot' },
  { id: 'chicken', name: 'Chicken', prep: 'chop+cook', color: '#c97b4a', key: '3', blurb: 'Chop, then wok' },
  { id: 'egg', name: 'Egg', prep: 'cook', color: '#fff7d6', key: '4', blurb: 'Wok-fried' },
  { id: 'chili', name: 'Chili', prep: 'chop', color: '#e5383b', key: '5', blurb: 'Chopped fine' },
  { id: 'greens', name: 'Greens', prep: 'chop', color: '#52b788', key: '6', blurb: 'Chopped fresh' }
];

NB.ingredientById = function (id) {
  for (const ing of NB.INGREDIENTS) if (ing.id === id) return ing;
  return null;
};

// The prep state an ingredient must reach to satisfy a dish slot.
NB.finalPrep = function (ingId) {
  const ing = NB.ingredientById(ingId);
  if (!ing) return 'raw';
  if (ing.prep === 'none') return 'raw';
  if (ing.prep === 'chop') return 'chopped';
  return 'cooked';
};

// A carried item: { ing, prep } where prep is raw | chopped | cooked | burnt.
NB.makeItem = function (ingId) {
  return { ing: ingId, prep: 'raw' };
};

NB.itemLabel = function (item) {
  const ing = NB.ingredientById(item.ing);
  if (!ing) return '?';
  if (item.prep === 'burnt') return 'Burnt ' + ing.name;
  if (item.prep === 'raw') return ing.name;
  if (item.prep === 'chopped') return 'Chopped ' + ing.name;
  return 'Cooked ' + ing.name;
};

// The five dishes. Coins grow with component count; patience bonus and
// combo multiply them at serve time.
NB.DISHES = [
  {
    id: 'broth-bowl',
    name: 'Golden Broth Bowl',
    coins: 14,
    needs: [
      { ing: 'noodles', prep: 'cooked' },
      { ing: 'broth', prep: 'raw' }
    ]
  },
  {
    id: 'midnight-noodles',
    name: 'Midnight Noodles',
    coins: 22,
    needs: [
      { ing: 'noodles', prep: 'cooked' },
      { ing: 'chicken', prep: 'cooked' },
      { ing: 'chili', prep: 'chopped' }
    ]
  },
  {
    id: 'garden-noodles',
    name: 'Garden Noodles',
    coins: 22,
    needs: [
      { ing: 'noodles', prep: 'cooked' },
      { ing: 'greens', prep: 'chopped' },
      { ing: 'egg', prep: 'cooked' }
    ]
  },
  {
    id: 'ember-chicken',
    name: 'Ember Chicken Bowl',
    coins: 28,
    needs: [
      { ing: 'noodles', prep: 'cooked' },
      { ing: 'chicken', prep: 'cooked' },
      { ing: 'egg', prep: 'cooked' },
      { ing: 'chili', prep: 'chopped' }
    ]
  },
  {
    id: 'house-special',
    name: 'House Special',
    coins: 28,
    needs: [
      { ing: 'noodles', prep: 'cooked' },
      { ing: 'broth', prep: 'raw' },
      { ing: 'chicken', prep: 'cooked' },
      { ing: 'greens', prep: 'chopped' }
    ]
  }
];

NB.dishById = function (id) {
  for (const dish of NB.DISHES) if (dish.id === id) return dish;
  return null;
};
