import type { MenuItem } from './types';

const mains: MenuItem[] = [
  {
    id: 201,
    name: "Veggie Burger",
    description: "House‑made black bean patty on a whole‑grain bun with lettuce, tomato, and avocado spread.",
    price: 13.50,
    isVegan: true,
    isVegetarian: true,
    contains: ["Soy", "Gluten"],
    seasonal: false,
    nutrition: {
      calories: 420,
      protein: 18,
      fat: 12,
      carbs: 45,
      sugar: 6,
      fiber: 8,
      sodium: 680
    },
    flavorProfile: {
      sweet: 2,
      salty: 5,
      sour: 2,
      bitter: 1,
      umami: 8,
      spicy: 2,
      refreshing: 3,
      rich: 7
    },
    dynamicPairings: true,
    ingredients: [
      "Black Beans",
      "Brown Rice",
      "Whole Grain Bun",
      "Lettuce",
      "Tomato",
      "Fresh Avocado",
      "Red Onion",
      "Garlic",
      "Cumin",
      "Soy Sauce"
    ],
    pairingRecommendation: "Pairs well with Tomato Basil Soup or Cucumber Mint Spritzer.",
    sourceInfo: {
      local: true,
      organic: true,
      sources: [
        {name: "Red Hill Farm", location: "Local"},
        {name: "Green Valley Farms", location: "Local"}
      ]
    }
  },
  {
    id: 202,
    name: "Chickpea Stew",
    description: "Chickpeas cooked in a mild coconut curry sauce, served with basmati rice.",
    price: 14.25,
    isVegan: true,
    isVegetarian: true,
    contains: ["Coconut"],
    seasonal: false,
    nutrition: {
      calories: 480,
      protein: 14,
      fat: 14,
      carbs: 65,
      sugar: 8,
      fiber: 12,
      sodium: 420
    },
    flavorProfile: {
      sweet: 4,
      salty: 4,
      sour: 3,
      bitter: 1,
      umami: 7,
      spicy: 5,
      refreshing: 3,
      rich: 8
    },
    dynamicPairings: true,
    ingredients: [
      "Organic Chickpeas",
      "Coconut Milk",
      "Tomatoes",
      "Onion",
      "Garlic",
      "Ginger",
      "Curry Powder",
      "Turmeric",
      "Basmati Rice",
      "Fresh Cilantro"
    ],
    pairingRecommendation: "Pairs well with Avocado & Citrus Salad or Berry Bliss Kombucha.",
    sourceInfo: {
      local: true,
      organic: true,
      sources: [
        {name: "Green Valley Farms", location: "Local"}
      ]
    }
  },
  {
    id: 203,
    name: "Lentil Stew",
    description: "Hearty brown lentils simmered with carrots, potatoes, and herbs.",
    price: 12.95,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    nutrition: {
      calories: 360,
      protein: 16,
      fat: 8,
      carbs: 40,
      sugar: 5,
      fiber: 10,
      sodium: 380
    },
    flavorProfile: {
      sweet: 3,
      salty: 5,
      sour: 1,
      bitter: 1,
      umami: 7,
      spicy: 1,
      refreshing: 2,
      rich: 8
    },
    dynamicPairings: true,
    ingredients: [
      "Brown Lentils",
      "Carrots",
      "Potatoes",
      "Celery",
      "Onion",
      "Garlic",
      "Vegetable Broth",
      "Tomato Paste",
      "Bay Leaf",
      "Fresh Thyme"
    ],
    pairingRecommendation: "Pairs well with Kale Chips or Hibiscus Iced Tea."
  },
  {
    id: 204,
    name: "Stuffed Sweet Potato",
    description: "Baked sweet potato filled with black beans, corn, and salsa, topped with fresh cilantro.",
    price: 12.25,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: true,
    nutrition: {
      calories: 420,
      protein: 12,
      fat: 10,
      carbs: 60,
      sugar: 12,
      fiber: 9,
      sodium: 420
    },
    flavorProfile: {
      sweet: 6,
      salty: 4,
      sour: 3,
      bitter: 1,
      umami: 5,
      spicy: 4,
      refreshing: 4,
      rich: 6
    },
    dynamicPairings: true,
    ingredients: [
      "Sweet Potatoes",
      "Black Beans",
      "Corn",
      "Tomatoes",
      "Red Onion",
      "Jalapeño",
      "Local Lime",
      "Cilantro",
      "Cumin",
      "Smoked Paprika"
    ],
    pairingRecommendation: "Pairs well with Hummus Plate or Green Detox Smoothie.",
    sourceInfo: {
      local: true,
      organic: true,
      sources: [
        {name: "Hillside Root Farm", location: "Local"},
        {name: "Red Hill Farm", location: "Local"},
        {name: "Sunshine Citrus Groves", location: "Local"}
      ]
    }
  },
  {
    id: 205,
    name: "Veggie Stir Fry",
    description: "Stir‑fried mixed vegetables and tofu in a light soy‑ginger sauce, served over brown rice.",
    price: 14.75,
    isVegan: true,
    isVegetarian: true,
    contains: ["Soy", "Gluten"],
    seasonal: false,
    nutrition: {
      calories: 400,
      protein: 17,
      fat: 11,
      carbs: 55,
      sugar: 7,
      fiber: 8,
      sodium: 720
    },
    flavorProfile: {
      sweet: 3,
      salty: 6,
      sour: 3,
      bitter: 1,
      umami: 8,
      spicy: 4,
      refreshing: 3,
      rich: 7
    },
    dynamicPairings: true,
    ingredients: [
      "Organic Tofu",
      "Broccoli",
      "Carrots",
      "Bell Peppers",
      "Snow Peas",
      "Mushrooms",
      "Brown Rice",
      "Soy Sauce",
      "Ginger",
      "Garlic"
    ],
    pairingRecommendation: "Pairs well with Garlic Roasted Chickpeas or Cucumber Mint Spritzer.",
    sourceInfo: {
      local: true,
      organic: true,
      sources: [
        {name: "Soy Innovations", location: "Local"},
        {name: "Riverside Organic Farm", location: "Local"}
      ]
    }
  },
  {
    id: 206,
    name: "Sweet Potato Croquettes",
    description: "Crispy sweet potato croquettes, served with spicy mayonnaise.",
    price: 7.50,
    isVegan: true,
    isVegetarian: true,
    contains: ["Eggs"],
    seasonal: false,
    nutrition: {
      calories: 340,
      protein: 3,
      fat: 8,
      carbs: 35,
      sugar: 8,
      fiber: 4,
      sodium: 380
    },
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
    ingredients: [
      "Sweet Potatoes",
      "Breadcrumbs",
      "Fresh Herbs",
      "Garlic",
      "Vegan Mayonnaise",
      "Sriracha",
      "Local Lime",
      "Salt",
      "Pepper",
      "Smoked Paprika"
    ],
    pairingRecommendation: "Pairs well with Green Goddess Salad or Berry Lemonade.",
    sourceInfo: {
      local: true,
      organic: true,
      sources: [
        {name: "Hillside Root Farm", location: "Local"},
        {name: "Sunshine Citrus Groves", location: "Local"}
      ]
    }
  },
  {
    id: 207,
    name: "Quinoa Stuffed Bell Peppers",
    description: "Colorful bell peppers filled with a savory blend of quinoa, black beans, corn, and spices.",
    price: 14.95,
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    nutrition: {
      calories: 350,
      protein: 12,
      fat: 8,
      carbs: 45,
      sugar: 6,
      fiber: 10,
      sodium: 320
    },
    flavorProfile: {
      sweet: 4,
      salty: 3,
      sour: 2,
      bitter: 1,
      umami: 6,
      spicy: 3,
      refreshing: 4,
      rich: 5
    },
    dynamicPairings: true,
    ingredients: [
      "Bell Peppers",
      "Quinoa",
      "Black Beans",
      "Corn",
      "Tomatoes",
      "Onion",
      "Garlic",
      "Cumin",
      "Chili Powder",
      "Fresh Cilantro"
    ],
    pairingRecommendation: "Pairs well with Avocado & Citrus Salad or Charred Eggplant Bruschetta."
  },
  {
    id: 208,
    name: "Mushroom Rice Bowl",
    description: "Creamy arborio rice cooked with a medley of wild mushrooms, finished with truffle oil and fresh avocado.",
    price: 16.95,
    isVegan: false,
    isVegetarian: true,
    contains: ["Dairy"],
    seasonal: false,
    nutrition: {
      calories: 420,
      protein: 10,
      fat: 15,
      carbs: 60,
      sugar: 4,
      fiber: 6,
      sodium: 480
    },
    flavorProfile: {
      sweet: 2,
      salty: 5,
      sour: 1,
      bitter: 2,
      umami: 9,
      spicy: 0,
      refreshing: 1,
      rich: 9
    },
    dynamicPairings: true,
    ingredients: [
      "Arborio Rice",
      "Wild Mushrooms",
      "Truffle Oil",
      "Fresh Avocado"
    ],
    pairingRecommendation: "Pairs well with Avocado & Citrus Salad or Watermelon & Mint Skewers."
  },
  {
    id: 209,
    name: "Spiced Vegetable Tagine",
    description: "Moroccan‑spiced vegetables and chickpeas slow‑cooked with dried fruits and served with couscous.",
    price: 15.50,
    isVegan: false,
    isVegetarian: true,
    contains: ["Gluten"],
    seasonal: false,
    nutrition: {
      calories: 420,
      protein: 15,
      fat: 10,
      carbs: 60,
      sugar: 15,
      fiber: 12,
      sodium: 350
    },
    flavorProfile: {
      sweet: 5,
      salty: 4,
      sour: 3,
      bitter: 1,
      umami: 7,
      spicy: 4,
      refreshing: 3,
      rich: 7
    },
    dynamicPairings: true,
    ingredients: [
      "Chickpeas",
      "Carrots",
      "Zucchini",
      "Eggplant",
      "Sweet Potatoes",
      "Dried Apricots",
      "Tomatoes",
      "Couscous",
      "Cinnamon",
      "Cumin",
      "Coriander",
      "Harissa"
    ],
    pairingRecommendation: "Pairs well with Avocado & Citrus Salad or Watermelon & Mint Skewers."
  },
  {
    id: 210,
    name: "Neapolitan Eggplant",
    description: "Layers of crispy eggplant, house-made marinara, and melted mozzarella, topped with fresh basil.",
    price: 15.95,
    isVegan: false,
    isVegetarian: true,
    contains: ["Dairy"],
    seasonal: false,
    nutrition: {
      calories: 450,
      protein: 18,
      fat: 22,
      carbs: 40,
      sugar: 8,
      fiber: 7,
      sodium: 680
    },
    flavorProfile: {
      sweet: 4,
      salty: 6,
      sour: 3,
      bitter: 2,
      umami: 8,
      spicy: 1,
      refreshing: 2,
      rich: 8
    },
    dynamicPairings: true,
    ingredients: [
      "Eggplant",
      "House-Made Marinara",
      "Melted Mozzarella",
      "Fresh Basil"
    ],
    pairingRecommendation: "Pairs well with Avocado & Citrus Salad or Charred Eggplant Bruschetta."
  },
  {
    id: 211,
    name: "Pad Thai with Tofu",
    description: "Rice noodles wok‑fried with tofu, bean sprouts, and scallions in a tangy tamarind sauce.",
    price: 14.25,
    isVegan: true,
    isVegetarian: true,
    contains: ["Soy", "Nuts"],
    seasonal: true,
    nutrition: {
      calories: 450,
      protein: 16,
      fat: 14,
      carbs: 65,
      sugar: 10,
      fiber: 6,
      sodium: 680
    },
    flavorProfile: {
      sweet: 5,
      salty: 6,
      sour: 7,
      bitter: 2,
      umami: 8,
      spicy: 4,
      refreshing: 3,
      rich: 6
    },
    dynamicPairings: true,
    ingredients: [
      "Rice Noodles",
      "Tofu",
      "Bean Sprouts",
      "Scallions",
      "Carrots",
      "Tamarind Paste",
      "Lime",
      "Peanuts",
      "Garlic",
      "Soy Sauce",
      "Cilantro"
    ],
    pairingRecommendation: "Pairs well with Avocado & Citrus Salad or Crispy Polenta Bites."
  },
  {
    id: 212,
    name: "Mediterranean Flatbread",
    description: "Whole wheat flatbread topped with hummus, roasted vegetables, and a balsamic drizzle.",
    price: 13.75,
    isVegan: false,
    isVegetarian: true,
    contains: ["Gluten"],
    seasonal: false,
    nutrition: {
      calories: 380,
      protein: 12,
      fat: 12,
      carbs: 48,
      sugar: 8,
      fiber: 7,
      sodium: 580
    },
    flavorProfile: {
      sweet: 3,
      salty: 5,
      sour: 4,
      bitter: 2,
      umami: 7,
      spicy: 2,
      refreshing: 4,
      rich: 6
    },
    dynamicPairings: true,
    ingredients: [
      "Whole Wheat Flatbread",
      "Hummus",
      "Zucchini",
      "Eggplant",
      "Red Bell Peppers",
      "Red Onion",
      "Feta Cheese",
      "Balsamic Glaze",
      "Olive Oil",
      "Fresh Basil"
    ],
    pairingRecommendation: "Pairs well with Avocado & Citrus Salad or Charred Eggplant Bruschetta."
  },
  {
    id: 213,
    name: "Southwest Bowl",
    description: "Black beans, roasted corn, avocado, and pico de gallo over brown rice with chipotle lime dressing.",
    price: 15.25,
    isVegan: true,
    isVegetarian: true,
    contains: ["Soy"],
    seasonal: false,
    nutrition: {
      calories: 520,
      protein: 18,
      fat: 15,
      carbs: 70,
      sugar: 7,
      fiber: 15,
      sodium: 480
    },
    flavorProfile: {
      sweet: 3,
      salty: 5,
      sour: 4,
      bitter: 1,
      umami: 7,
      spicy: 6,
      refreshing: 5,
      rich: 6
    },
    dynamicPairings: true,
    ingredients: [
      "Brown Rice",
      "Black Beans",
      "Roasted Corn",
      "Avocado",
      "Tomatoes",
      "Red Onion",
      "Jalapeño",
      "Lime Juice",
      "Chipotle Pepper",
      "Cilantro",
      "Cumin"
    ],
    dietarySuitability: {
      glutenFree: true
    },
    pairingRecommendation: "Pairs well with Avocado & Citrus Salad or Charred Eggplant Bruschetta."
  }
];

export default mains;
