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
      sweet: 6,
      salty: 2,
      sour: 7,
      bitter: 3,
      umami: 4,
      spicy: 0,
      refreshing: 9,
      rich: 5
    },
    dynamicPairings: true,
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
    pairingRecommendation: "Pairs beautifully with Quinoa Stuffed Bell Peppers or Spiced Vegetable Tagine.",
    sourceInfo: {
      local: true,
      organic: true,
      sources: [
        {name: "Green Valley Farms", location: "Local"},
        {name: "Sunshine Citrus Groves", location: "Local"},
        {name: "Riverside Organic Farm", location: "Local"}
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
    nutrition: {
      calories: 250,
      protein: 6,
      fat: 10,
      carbs: 30,
      sugar: 5,
      fiber: 4,
      sodium: 280
    },
    flavorProfile: {
      sweet: 4,
      salty: 3,
      sour: 3,
      bitter: 2,
      umami: 8,
      spicy: 1,
      refreshing: 2,
      rich: 7
    },
    dynamicPairings: true,
    ingredients: [
      "Local Eggplant",
      "Sourdough Bread",
      "Pomegranate Seeds",
      "Tahini",
      "Extra Virgin Olive Oil",
      "Garlic",
      "Local Lime",
      "Sea Salt",
      "Fresh Herbs"
    ],
    pairingRecommendation: "Pairs well with Quinoa Stuffed Bell Peppers or Pad Thai with Tofu.",
    sourceInfo: {
      local: true,
      organic: true,
      sources: [
        {name: "Riverbank Gardens", location: "Local"},
        {name: "Sunshine Citrus Groves", location: "Local"}
      ]
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
    nutrition: {
      calories: 200,
      protein: 4,
      fat: 8,
      carbs: 28,
      sugar: 3,
      fiber: 2,
      sodium: 320
    },
    flavorProfile: {
      sweet: 2,
      salty: 4,
      sour: 3,
      bitter: 1,
      umami: 5,
      spicy: 3,
      refreshing: 3,
      rich: 6
    },
    dynamicPairings: true,
    ingredients: [
      "Polenta",
      "Tomatoes",
      "Fresh Basil",
      "Garlic",
      "Olive Oil",
      "Oregano",
      "Vegetable Broth",
      "Sea Salt",
      "Black Pepper"
    ],
    pairingRecommendation: "Pairs well with Quinoa Stuffed Bell Peppers or Spiced Vegetable Tagine."
  },
  {
    id: 104,
    name: "Fried Squash Blossoms",
    description: "Delicate fried squash blossoms, served with a lemon-herb aioli.",
    price: 9.95,
    isVegan: false,
    isVegetarian: true,
    contains: ["Gluten", "Eggs"],
    seasonal: true,
    nutrition: {
      calories: 280,
      protein: 5,
      fat: 15,
      carbs: 30,
      sugar: 2,
      fiber: 3,
      sodium: 380
    },
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
    ingredients: [
      "Squash Blossoms",
      "All-Purpose Flour",
      "Eggs",
      "Lemon",
      "Fresh Herbs",
      "Garlic",
      "Olive Oil",
      "Sea Salt",
      "Black Pepper"
    ],
    pairingRecommendation: "Pairs well with Quinoa Stuffed Bell Peppers or Spiced Vegetable Tagine."
  },
  {
    id: 105,
    name: "Roasted Beet Tartare",
    description: "Finely diced roasted beets with feta, balsamic vinegar and spicy candied walnuts served on fresh arugula.",
    price: 8.25,
    isVegan: false,
    isVegetarian: true,
    contains: ["Nuts", "Dairy"],
    seasonal: false,
    nutrition: {
      calories: 225,
      protein: 5,
      fat: 17,
      carbs: 13,
      sugar: 10,
      fiber: 4,
      sodium: 322
    },
    flavorProfile: {
      sweet: 7,
      salty: 3,
      sour: 4,
      bitter: 1,
      umami: 3,
      spicy: 3,
      refreshing: 6,
      rich: 4
    },
    dynamicPairings: true,
    ingredients: [
      "Fresh Beets",
      "Feta Cheese",
      "Balsamic Vinegar",
      "Walnuts",
      "Honey",
      "Cayenne Pepper",
      "Organic Mixed Greens",
      "Extra Virgin Olive Oil",
      "Sea Salt",
      "Black Pepper"
    ],
    pairingRecommendation: "Pairs well with Quinoa Stuffed Bell Peppers or Spiced Vegetable Tagine.",
    sourceInfo: {
      local: true,
      organic: true,
      sources: [
        {name: "Hillside Root Farm", location: "Local"},
        {name: "Meadow Creek Dairy", location: "Local"},
        {name: "Riverside Organic Farm", location: "Local"}
      ]
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
    nutrition: {
      calories: 220,
      protein: 4,
      fat: 10,
      carbs: 28,
      sugar: 6,
      fiber: 5,
      sodium: 450
    },
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
    ingredients: [
      "Cauliflower",
      "Breadcrumbs",
      "Smoked Paprika",
      "Garlic Powder",
      "Olive Oil",
      "Greek Yogurt",
      "Cucumber",
      "Fresh Dill",
      "Lemon Juice",
      "Sea Salt"
    ],
    pairingRecommendation: "Pairs well with Quinoa Stuffed Bell Peppers or Spiced Vegetable Tagine."
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
    nutrition: {
      calories: 120,
      protein: 2,
      fat: 4,
      carbs: 18,
      sugar: 12,
      fiber: 2,
      sodium: 85
    },
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
    ingredients: [
      "Fresh Watermelon",
      "Vegan Feta",
      "Fresh Mint Leaves",
      "Balsamic Reduction",
      "Olive Oil",
      "Sea Salt",
      "Black Pepper"
    ],
    pairingRecommendation: "Pairs well with Quinoa Stuffed Bell Peppers or Spiced Vegetable Tagine."
  },
  {
    id: 108,
    name: "Herbed Mushroom Pâté",
    description: "Rich and creamy mushroom pâté infused with thyme and garlic, served with toasted baguette slices.",
    price: 9.25,
    isVegan: true,
    isVegetarian: true,
    contains: ["Gluten"],
    seasonal: false,
    nutrition: {
      calories: 260,
      protein: 5,
      fat: 12,
      carbs: 20,
      sugar: 3,
      fiber: 4,
      sodium: 380
    },
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
    ingredients: [
      "Cremini Mushrooms",
      "Shiitake Mushrooms",
      "Garlic",
      "Fresh Thyme",
      "Olive Oil",
      "Baguette",
      "Vegetable Broth",
      "Walnuts",
      "Lemon Juice",
      "Sea Salt"
    ],
    pairingRecommendation: "Pairs well with Quinoa Stuffed Bell Peppers or Pad Thai with Tofu."
  },
  {
    id: 109,
    name: "Tomato Basil Soup",
    description: "Slow‑simmered tomato soup with fresh basil, served warm.",
    price: 5.95,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: true,
    nutrition: {
      calories: 140,
      protein: 3,
      fat: 4,
      carbs: 22,
      sugar: 8,
      fiber: 3,
      sodium: 420
    },
    flavorProfile: {
      sweet: 4,
      salty: 4,
      sour: 4,
      bitter: 1,
      umami: 6,
      spicy: 0,
      refreshing: 3,
      rich: 4
    },
    dynamicPairings: true,
    ingredients: [
      "Roma Tomatoes",
      "Fresh Basil",
      "Garlic",
      "Onion",
      "Vegetable Broth",
      "Olive Oil",
      "Bay Leaf",
      "Sea Salt",
      "Black Pepper"
    ],
    pairingRecommendation: "Pairs well with Veggie Burger or Cucumber Mint Spritzer."
  },
  {
    id: 110,
    name: "Hummus Plate",
    description: "Classic chickpea hummus topped with olive oil and paprika, served with carrot sticks and pita.",
    price: 6.50,
    isVegan: true,
    isVegetarian: true,
    contains: ["Gluten"],
    seasonal: false,
    nutrition: {
      calories: 220,
      protein: 6,
      fat: 10,
      carbs: 28,
      sugar: 4,
      fiber: 6,
      sodium: 380
    },
    flavorProfile: {
      sweet: 2,
      salty: 4,
      sour: 3,
      bitter: 1,
      umami: 5,
      spicy: 1,
      refreshing: 4,
      rich: 5
    },
    dynamicPairings: true,
    ingredients: [
      "Chickpeas",
      "Tahini",
      "Lemon Juice",
      "Garlic",
      "Olive Oil",
      "Paprika",
      "Fresh Carrots",
      "Pita Bread",
      "Sea Salt",
      "Cumin"
    ],
    pairingRecommendation: "Pairs well with Stuffed Sweet Potato or Carrot Orange Juice."
  },
  {
    id: 111,
    name: "Garlic Roasted Chickpeas",
    description: "Crispy oven-roasted chickpeas tossed in garlic and sea salt.",
    price: 4.95,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    nutrition: {
      calories: 150,
      protein: 6,
      fat: 5,
      carbs: 18,
      sugar: 3,
      fiber: 5,
      sodium: 280
    },
    flavorProfile: {
      sweet: 1,
      salty: 5,
      sour: 1,
      bitter: 1,
      umami: 5,
      spicy: 2,
      refreshing: 2,
      rich: 4
    },
    dynamicPairings: true,
    ingredients: [
      "Chickpeas",
      "Garlic",
      "Olive Oil",
      "Sea Salt",
      "Black Pepper",
      "Dried Herbs"
    ],
    pairingRecommendation: "Pairs well with Tomato Basil Soup or Berry Bliss Kombucha."
  },
  {
    id: 112,
    name: "Kale Chips",
    description: "Baked kale leaves seasoned with nutritional yeast and sea salt.",
    price: 4.50,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    nutrition: {
      calories: 80,
      protein: 4,
      fat: 4,
      carbs: 9,
      sugar: 1,
      fiber: 3,
      sodium: 180
    },
    flavorProfile: {
      sweet: 1,
      salty: 4,
      sour: 1,
      bitter: 4,
      umami: 4,
      spicy: 0,
      refreshing: 2,
      rich: 3
    },
    dynamicPairings: true,
    ingredients: [
      "Fresh Kale",
      "Olive Oil",
      "Nutritional Yeast",
      "Sea Salt", 
      "Black Pepper",
      "Garlic Powder"
    ],
    dietarySuitability: {
      lowCarb: true
    },
    pairingRecommendation: "Pairs well with Green Detox Smoothie or Lentil Stew."
  }
];

export default appetizers;
