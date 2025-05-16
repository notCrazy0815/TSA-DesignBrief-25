import type { MenuItem } from './types';

const appetizers: MenuItem[] = [
  {
    id: 101,
    name: "Avocado & Citrus Salad",
    description: "Fresh avocado slices, orange and lime segments on a bed of mixed greens, drizzled with extra virgin olive oil.",
    price: 7.95,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: true,
    nutrition: {
      calories: 220,
      protein: 4,
      fat: 15,
      carbs: 18,
      sugar: 8,
      fiber: 6,
      sodium: 120
    },
    flavorProfile: {
      sweet: 6,    // Orange segments provide natural sweetness
      salty: 2,    // Light salt seasoning
      sour: 7,     // Lime provides citrus acidity
      bitter: 3,   // Slight bitterness from greens
      umami: 4,    // Avocado provides some umami
      spicy: 0,    // No spiciness
      refreshing: 9, // Very refreshing dish
      rich: 5      // Avocado provides richness balanced by citrus
    },
    dynamicPairings: true, // Use the dynamic pairing system
    ingredients: [
      "Fresh Avocado",
      "Organic Valencia Oranges",
      "Local Lime",
      "Organic Mixed Greens",
      "Extra Virgin Olive Oil",
      "Sea Salt",
      "Cracked Black Pepper"
    ],
    preparation: "Our citrus salad is freshly prepared to order. The avocados are sliced moments before serving to maintain optimal freshness and color.",
    pairingRecommendation: "Pairs beautifully with our Green Detox Smoothie or a glass of our house-made mint-infused water.",
    sourceInfo: {
      local: true,
      organic: true,
      sources: [
        {name: "Green Valley Farms", location: "15 miles from restaurant"},
        {name: "Sunshine Citrus Groves", location: "Southern California"}
      ]
    },
    dietarySuitability: {
      glutenFree: true,
      dairyFree: true,
      nutFree: true,
      lowCarb: true,
      keto: true,
      paleo: true
    }
  },
  {
    id: 102,
    name: "Charred Eggplant Bruschetta",
    description: "Smoky charred eggplant spread on toasted sourdough, topped with pomegranate seeds and a drizzle of tahini.",
    price: 8.50,
    isVegan: true,
    isVegetarian: true,
    contains: ["Gluten", "Sesame"],
    seasonal: false,
    flavorProfile: {
      sweet: 4,    // Pomegranate adds some sweetness
      salty: 3,    // Light salt in bread and eggplant
      sour: 3,     // Slight tartness from pomegranate
      bitter: 2,   // Minimal bitterness
      umami: 8,    // Strong umami from charred eggplant
      spicy: 1,    // Very mild spice
      refreshing: 2, // Not particularly refreshing
      rich: 7      // Tahini and eggplant create richness
    },
    dynamicPairings: true,
    nutrition: {
      calories: 250,
      protein: 6,
      fat: 10,
      carbs: 30
    }
  },
  {
    id: 103,
    name: "Crispy Polenta Bites",
    description: "Golden polenta squares served with a tangy tomato-basil dipping sauce.",
    price: 7.95,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    flavorProfile: {
      sweet: 2,
      salty: 4,
      sour: 3,
      bitter: 1,
      umami: 5,
      spicy: 0,
      refreshing: 3,
      rich: 6
    },
    dynamicPairings: true,
    nutrition: {
      calories: 200,
      protein: 4,
      fat: 8,
      carbs: 28
    }
  },
  {
    id: 104,
    name: "Zucchini Blossom Tempura",
    description: "Delicate zucchini blossoms lightly battered and fried, served with a lemon-herb aioli.",
    price: 9.95,
    isVegan: false,
    isVegetarian: true,
    contains: ["Eggs", "Gluten"],
    seasonal: true,
    flavorProfile: {
      sweet: 1,
      salty: 5,
      sour: 4,
      bitter: 2,
      umami: 6,
      spicy: 0,
      refreshing: 4,
      rich: 7
    },
    dynamicPairings: true,
    nutrition: {
      calories: 280,
      protein: 5,
      fat: 15,
      carbs: 30
    }
  },
  {
    id: 105,
    name: "Beet Tartare",
    description: "Finely diced roasted beets with capers, shallots, and a hint of Dijon, served with crispy rye crackers.",
    price: 8.25,
    isVegan: true,
    isVegetarian: true,
    contains: ["Gluten"],
    seasonal: false,
    flavorProfile: {
      sweet: 5,
      salty: 3,
      sour: 2,
      bitter: 3,
      umami: 4,
      spicy: 0,
      refreshing: 5,
      rich: 4
    },
    dynamicPairings: true,
    nutrition: {
      calories: 180,
      protein: 3,
      fat: 6,
      carbs: 25
    }
  },
  {
    id: 106,
    name: "Spiced Cauliflower Wings",
    description: "Crispy cauliflower florets tossed in a smoky paprika glaze, served with a cooling cucumber-yogurt dip.",
    price: 8.95,
    isVegan: false,
    isVegetarian: true,
    contains: ["Dairy"],
    seasonal: false,
    flavorProfile: {
      sweet: 2,
      salty: 4,
      sour: 3,
      bitter: 2,
      umami: 5,
      spicy: 6,
      refreshing: 3,
      rich: 6
    },
    dynamicPairings: true,
    nutrition: {
      calories: 220,
      protein: 4,
      fat: 10,
      carbs: 28
    }
  },
  {
    id: 107,
    name: "Watermelon & Mint Skewers",
    description: "Refreshing watermelon cubes paired with vegan feta and fresh mint leaves, drizzled with balsamic reduction.",
    price: 6.95,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: true,
    flavorProfile: {
      sweet: 7,
      salty: 2,
      sour: 3,
      bitter: 1,
      umami: 2,
      spicy: 0,
      refreshing: 9,
      rich: 3
    },
    dynamicPairings: true,
    nutrition: {
      calories: 120,
      protein: 2,
      fat: 4,
      carbs: 18
    }
  },
  {
    id: 108,
    name: "Sweet Potato Croquettes",
    description: "Crispy sweet potato croquettes with a hint of smoked paprika, served with a maple-mustard dipping sauce.",
    price: 7.50,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    flavorProfile: {
      sweet: 5,
      salty: 3,
      sour: 2,
      bitter: 1,
      umami: 4,
      spicy: 2,
      refreshing: 3,
      rich: 6
    },
    dynamicPairings: true,
    nutrition: {
      calories: 240,
      protein: 3,
      fat: 8,
      carbs: 35
    }
  },
  {
    id: 109,
    name: "Herbed Mushroom Pâté",
    description: "Rich and creamy mushroom pâté infused with thyme and garlic, served with toasted baguette slices.",
    price: 9.25,
    isVegan: true,
    isVegetarian: true,
    contains: ["Gluten"],
    seasonal: false,
    flavorProfile: {
      sweet: 1,
      salty: 4,
      sour: 2,
      bitter: 3,
      umami: 8,
      spicy: 0,
      refreshing: 2,
      rich: 7
    },
    dynamicPairings: true,
    nutrition: {
      calories: 260,
      protein: 5,
      fat: 12,
      carbs: 30
    }
  }
];

export default appetizers;
