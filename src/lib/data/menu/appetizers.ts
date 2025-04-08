import type { MenuItem } from './types';

const appetizers: MenuItem[] = [
  {
    id: 101,
    name: "Avocado & Citrus Salad",
    description: "Fresh avocado slices, orange and lime segments on a bed of mixed greens, drizzled with extra virgin olive oil.",
    price: "$7.95",
    isVegan: true,
    isVegetarian: true,
    contains: [], // Using contains instead of containsAllergens
    seasonal: true, // Using seasonal instead of isSeasonal
    nutrition: {
      calories: 220,
      protein: 4,
      fat: 15,
      carbs: 18
    }
  },
  {
    id: 102,
    name: "Charred Eggplant Bruschetta",
    description: "Smoky charred eggplant spread on toasted sourdough, topped with pomegranate seeds and a drizzle of tahini.",
    price: "$8.50",
    isVegan: true,
    isVegetarian: true,
    contains: ["Gluten", "Sesame"], // Using contains instead of containsAllergens
    seasonal: false, // Using seasonal instead of isSeasonal
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
    price: "$7.95",
    isVegan: true,
    isVegetarian: true,
    contains: [], // Using contains instead of containsAllergens
    seasonal: false, // Using seasonal instead of isSeasonal
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
    price: "$9.95",
    isVegan: false,
    isVegetarian: true,
    contains: ["Eggs", "Gluten"], // Using contains instead of containsAllergens
    seasonal: true, // Using seasonal instead of isSeasonal
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
    price: "$8.25",
    isVegan: true,
    isVegetarian: true,
    contains: ["Gluten"], // Using contains instead of containsAllergens
    seasonal: false, // Using seasonal instead of isSeasonal
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
    price: "$8.95",
    isVegan: false,
    isVegetarian: true,
    contains: ["Dairy"], // Using contains instead of containsAllergens
    seasonal: false, // Using seasonal instead of isSeasonal
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
    price: "$6.95",
    isVegan: true,
    isVegetarian: true,
    contains: [], // Using contains instead of containsAllergens
    seasonal: true, // Using seasonal instead of isSeasonal
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
    price: "$7.50",
    isVegan: true,
    isVegetarian: true,
    contains: [], // Using contains instead of containsAllergens
    seasonal: false, // Using seasonal instead of isSeasonal
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
    price: "$9.25",
    isVegan: true,
    isVegetarian: true,
    contains: ["Gluten"], // Using contains instead of containsAllergens
    seasonal: false, // Using seasonal instead of isSeasonal
    nutrition: {
      calories: 260,
      protein: 5,
      fat: 12,
      carbs: 30
    }
  }
];

export default appetizers;
