import type { MenuItem } from './types';

const desserts: MenuItem[] = [
  {
    id: 401,
    name: "Chia Pudding with Berries",
    description: "Creamy chia pudding made with coconut milk, topped with a medley of fresh berries and a drizzle of agave.",
    price: 6.95,
    isVegan: true,
    isVegetarian: true,
    contains: ["Coconut"],
    seasonal: false,
    nutrition: {
      calories: 200,
      protein: 6,
      fat: 10,
      carbs: 25,
      sugar: 15,
      fiber: 8,
      sodium: 45
    },
    flavorProfile: {
      sweet: 7,
      salty: 0,
      sour: 3,
      bitter: 0,
      umami: 0,
      spicy: 0,
      refreshing: 5,
      rich: 6
    },
    dynamicPairings: true,
    ingredients: [
      "Chia Seeds",
      "Coconut Milk",
      "Mixed Berries",
      "Agave Syrup",
      "Vanilla Extract",
      "Lemon Zest"
    ],
    pairingRecommendation: "Pairs well with Pad Thai with Tofu or Avocado & Citrus Salad."
  },
  {
    id: 402,
    name: "Dark Chocolate Avocado Mousse",
    description: "Silky smooth chocolate mousse made with ripe avocados and fair-trade dark chocolate, topped with coconut whip.",
    price: 7.50,
    isVegan: true,
    isVegetarian: true,
    contains: ["Coconut"],
    seasonal: false,
    nutrition: {
      calories: 250,
      protein: 4,
      fat: 18,
      carbs: 20,
      sugar: 12,
      fiber: 6,
      sodium: 35
    },
    flavorProfile: {
      sweet: 5,
      salty: 1,
      sour: 0,
      bitter: 4,
      umami: 3,
      spicy: 0,
      refreshing: 3,
      rich: 9
    },
    dynamicPairings: true,
    ingredients: [
      "Ripe Avocados",
      "Fair-Trade Dark Chocolate",
      "Coconut Cream",
      "Maple Syrup",
      "Vanilla Extract",
      "Sea Salt",
      "Cacao Nibs"
    ],
    pairingRecommendation: "Pairs well with Pad Thai with Tofu or Avocado & Citrus Salad."
  },
  {
    id: 403,
    name: "Lavender Shortbread with Berry Compote",
    description: "Buttery shortbread cookies infused with lavender, served with a warm mixed berry compote.",
    price: 7.25,
    isVegan: false,
    isVegetarian: true,
    contains: ["Dairy", "Gluten"],
    seasonal: false,
    nutrition: {
      calories: 280,
      protein: 3,
      fat: 14,
      carbs: 35,
      sugar: 18,
      fiber: 2,
      sodium: 180
    },
    flavorProfile: {
      sweet: 6,
      salty: 2,
      sour: 4,
      bitter: 1,
      umami: 0,
      spicy: 0,
      refreshing: 3,
      rich: 7
    },
    dynamicPairings: true,
    ingredients: [
      "Butter",
      "All-Purpose Flour",
      "Powdered Sugar",
      "Culinary Lavender",
      "Mixed Berries",
      "Lemon Juice",
      "Honey"
    ],
    pairingRecommendation: "Pairs well with Pad Thai with Tofu or Avocado & Citrus Salad."
  },
  {
    id: 404,
    name: "Maple-Glazed Roasted Fig",
    description: "Warm roasted figs drizzled with maple syrup and topped with a dollop of vanilla bean cashew cream.",
    price: 7.95,
    isVegan: true,
    isVegetarian: true,
    contains: ["Nuts"],
    seasonal: true,
    nutrition: {
      calories: 230,
      protein: 3,
      fat: 9,
      carbs: 40,
      sugar: 25,
      fiber: 5,
      sodium: 25
    },
    flavorProfile: {
      sweet: 8,
      salty: 0,
      sour: 1,
      bitter: 0,
      umami: 1,
      spicy: 0,
      refreshing: 2,
      rich: 7
    },
    dynamicPairings: true,
    ingredients: [
      "Fresh Figs",
      "Maple Syrup",
      "Cashews",
      "Vanilla Bean",
      "Lemon Juice",
      "Cinnamon",
      "Fresh Thyme"
    ],
    pairingRecommendation: "Pairs well with Pad Thai with Tofu or Avocado & Citrus Salad."
  },
  {
    id: 405,
    name: "Oatmeal Cookie",
    description: "Soft‑baked oatmeal cookie with raisins.",
    price: 3.25,
    isVegan: true,
    isVegetarian: true,
    contains: ["Gluten"],
    seasonal: false,
    nutrition: {
      calories: 190,
      protein: 3,
      fat: 7,
      carbs: 24,
      sugar: 12,
      fiber: 2,
      sodium: 150
    },
    flavorProfile: {
      sweet: 7,
      salty: 2,
      sour: 1,
      bitter: 1,
      umami: 0,
      spicy: 0,
      refreshing: 2,
      rich: 5
    },
    dynamicPairings: true,
    ingredients: [
      "Rolled Oats",
      "Whole Wheat Flour",
      "Coconut Oil",
      "Brown Sugar",
      "Flax Egg",
      "Cinnamon",
      "Raisins",
      "Vanilla Extract"
    ],
    pairingRecommendation: "Pairs well with Almond Milk Latte or Carrot Orange Juice."
  },
  {
    id: 406,
    name: "Banana Ice Cream",
    description: "Frozen blended bananas with a hint of vanilla, topped with crushed peanuts.",
    price: 5.95,
    isVegan: true,
    isVegetarian: true,
    contains: ["Nuts"],
    seasonal: false,
    nutrition: {
      calories: 210,
      protein: 3,
      fat: 5,
      carbs: 30,
      sugar: 20,
      fiber: 3,
      sodium: 35
    },
    flavorProfile: {
      sweet: 8,
      salty: 1,
      sour: 1,
      bitter: 0,
      umami: 1,
      spicy: 0,
      refreshing: 6,
      rich: 4
    },
    dynamicPairings: true,
    ingredients: [
      "Frozen Bananas",
      "Vanilla Extract",
      "Almond Milk",
      "Crushed Peanuts",
      "Cinnamon",
      "Maple Syrup"
    ],
    pairingRecommendation: "Pairs well with Hibiscus Iced Tea or Lemon Ginger Water."
  },
  {
    id: 407,
    name: "Apple Crumble",
    description: "Warm baked apples topped with oat crumble and cinnamon.",
    price: 6.50,
    isVegan: true,
    isVegetarian: true,
    contains: ["Gluten"],
    seasonal: true,
    nutrition: {
      calories: 280,
      protein: 4,
      fat: 9,
      carbs: 42,
      sugar: 25,
      fiber: 5,
      sodium: 120
    },
    flavorProfile: {
      sweet: 7,
      salty: 1,
      sour: 2,
      bitter: 0,
      umami: 0,
      spicy: 2,
      refreshing: 3,
      rich: 6
    },
    dynamicPairings: true,
    ingredients: [
      "Fresh Apples",
      "Rolled Oats",
      "Coconut Oil",
      "Brown Sugar",
      "Cinnamon",
      "Nutmeg",
      "Lemon Juice",
      "Vanilla Extract"
    ],
    pairingRecommendation: "Pairs well with Almond Milk Latte or Berry Bliss Kombucha."
  }
];

export default desserts;
