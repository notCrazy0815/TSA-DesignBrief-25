import type { MenuItem } from './types';

const drinks: MenuItem[] = [
  {
    id: 301,
    name: "Carrot Orange Juice",
    description: "A vitamin-packed juice of fresh carrots and oranges, with a hint of ginger.",
    price: 5.95,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    nutrition: {
      calories: 120,
      protein: 2,
      fat: 0,
      carbs: 25,
      sugar: 18,
      fiber: 3,
      sodium: 40
    },
    flavorProfile: {
      sweet: 7,
      salty: 0,
      sour: 5,
      bitter: 0,
      umami: 0,
      spicy: 2,
      refreshing: 9,
      rich: 2
    },
    dynamicPairings: true,
    ingredients: [
      "Fresh Carrots",
      "Organic Oranges",
      "Ginger",
      "Filtered Water"
    ],
    preparation: "Freshly pressed to order using our cold-press juicer to maintain maximum nutrients and flavor.",
    pairingRecommendation: "Pairs well with Hummus Plate or Stuffed Sweet Potato.",
    sourceInfo: {
      local: true,
      organic: true,
      sources: [
        {name: "Green Valley Farms", location: "Local"},
        {name: "Sunshine Citrus Groves", location: "Local"}
      ]
    }
  },
  {
    id: 302,
    name: "Almond Milk",
    description: "Espresso with steamed almond milk.",
    price: 4.95,
    isVegan: true,
    isVegetarian: true,
    contains: ["Nuts"],
    seasonal: false,
    nutrition: {
      calories: 90,
      protein: 2,
      fat: 4,
      carbs: 8,
      sugar: 6,
      fiber: 1,
      sodium: 120
    },
    flavorProfile: {
      sweet: 2,
      salty: 0,
      sour: 1,
      bitter: 5,
      umami: 0,
      spicy: 0,
      refreshing: 2,
      rich: 5
    },
    dynamicPairings: true,
    ingredients: [
      "Espresso",
      "Almond Milk",
      "Optional Sweetener"
    ],
    dietarySuitability: {
      dairyFree: true
    },
    pairingRecommendation: "Pairs well with Oatmeal Cookie or Kale Chips."
  },
  {
    id: 303,
    name: "Lemon Ginger Water",
    description: "Chilled water infused with fresh lemon and ginger.",
    price: 2.95,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    nutrition: {
      calories: 10,
      protein: 0,
      fat: 0,
      carbs: 2,
      sugar: 1,
      fiber: 0,
      sodium: 5
    },
    flavorProfile: {
      sweet: 0,
      salty: 0,
      sour: 3,
      bitter: 0,
      umami: 0,
      spicy: 1,
      refreshing: 10,
      rich: 0
    },
    dynamicPairings: true,
    ingredients: [
      "Filtered Water",
      "Fresh Lemon",
      "Ginger",
      "Ice"
    ],
    sourceInfo: {
      local: true,
      organic: true,
      sources: [
        {name: "Green Valley Farms", location: "Local"},
        {name: "Sunshine Citrus Groves", location: "Local"}
      ]
    },
    pairingRecommendation: "Pairs well with Veggie Burger or Lentil Stew."
  },
  {
    id: 304,
    name: "Green Detox Smoothie",
    description: "A refreshing blend of spinach, kale, green apple, lemon and a hint of ginger.",
    price: 5.50,
    isVegan: true,
    isVegetarian: true,
    contains: ["Spinach", "Kale", "Green Apple", "Lemon", "Ginger"],
    seasonal: true,
    nutrition: {
      calories: 180,
      protein: 5,
      fat: 2,
      carbs: 25,
      sugar: 15,
      fiber: 6,
      sodium: 85
    },
    flavorProfile: {
      sweet: 4,
      salty: 0,
      sour: 6,
      bitter: 3,
      umami: 0,
      spicy: 2,
      refreshing: 10,
      rich: 2
    },
    dynamicPairings: true,
    ingredients: [
      "Fresh Spinach",
      "Organic Kale",
      "Green Apple",
      "Lemon",
      "Ginger",
      "Filtered Water",
      "Ice"
    ],
    pairingRecommendation: "Pairs well with Spiced Vegetable Tagine or Pad Thai with Tofu."
  },
  {
    id: 305,
    name: "Berry Bliss Kombucha",
    description: "House-brewed kombucha infused with mixed berries and a splash of hibiscus.",
    price: 6.25,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    nutrition: {
      calories: 85,
      protein: 0,
      fat: 0,
      carbs: 20,
      sugar: 12,
      fiber: 2,
      sodium: 15
    },
    flavorProfile: {
      sweet: 3,
      salty: 0,
      sour: 7,
      bitter: 2,
      umami: 0,
      spicy: 0,
      refreshing: 9,
      rich: 1
    },
    dynamicPairings: true,
    ingredients: [
      "House-brewed Kombucha",
      "Mixed Berries",
      "Hibiscus Flowers",
      "Raw Cane Sugar"
    ],
    pairingRecommendation: "Pairs well with Spiced Vegetable Tagine or Pad Thai with Tofu."
  },
  {
    id: 306,
    name: "Cucumber Mint Spritzer",
    description: "Sparkling water infused with fresh cucumber, mint, and a hint of lime.",
    price: 4.95,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: true,
    nutrition: {
      calories: 45,
      protein: 0,
      fat: 0,
      carbs: 10,
      sugar: 8,
      fiber: 1,
      sodium: 25
    },
    flavorProfile: {
      sweet: 1,
      salty: 0,
      sour: 3,
      bitter: 1,
      umami: 0,
      spicy: 0,
      refreshing: 10,
      rich: 0
    },
    dynamicPairings: true,
    ingredients: [
      "Sparkling Water",
      "Fresh Cucumber",
      "Fresh Mint Leaves",
      "Lime",
      "Agave Syrup",
      "Ice"
    ],
    pairingRecommendation: "Pairs well with Spiced Vegetable Tagine or Pad Thai with Tofu."
  },
  {
    id: 307,
    name: "Golden Turmeric Latte",
    description: "Warming blend of turmeric, cinnamon, ginger, and your choice of oat or almond milk.",
    price: 5.75,
    isVegan: true,
    isVegetarian: true,
    contains: ["Nuts"],
    seasonal: false,
    nutrition: {
      calories: 150,
      protein: 3,
      fat: 7,
      carbs: 18,
      sugar: 10,
      fiber: 2,
      sodium: 85
    },
    flavorProfile: {
      sweet: 5,
      salty: 0,
      sour: 1,
      bitter: 4,
      umami: 0,
      spicy: 3,
      refreshing: 3,
      rich: 7
    },
    dynamicPairings: true,
    ingredients: [
      "Turmeric",
      "Cinnamon",
      "Ginger",
      "Black Pepper",
      "Almond Milk",
      "Oat Milk",
      "Local Honey"
    ],
    pairingRecommendation: "Pairs well with Avocado & Citrus Salad or Pad Thai with Tofu."
  },
  {
    id: 308,
    name: "Hibiscus Iced Tea",
    description: "Floral hibiscus tea brewed fresh daily and served over ice.",
    price: 3.95,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    nutrition: {
      calories: 60,
      protein: 0,
      fat: 0,
      carbs: 15,
      sugar: 12,
      fiber: 0,
      sodium: 10
    },
    flavorProfile: {
      sweet: 2,
      salty: 0,
      sour: 6,
      bitter: 2,
      umami: 0,
      spicy: 0,
      refreshing: 9,
      rich: 0
    },
    dynamicPairings: true,
    ingredients: [
      "Dried Hibiscus Flowers",
      "Filtered Water",
      "Cane Sugar",
      "Mint Leaves",
      "Ice",
      "Lemon Slice"
    ],
    pairingRecommendation: "Pairs well with Spiced Vegetable Tagine or Pad Thai with Tofu."
  }
];

export default drinks;
