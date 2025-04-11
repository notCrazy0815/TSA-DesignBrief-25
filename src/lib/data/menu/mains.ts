import type { MenuItem } from './types';

const mains: MenuItem[] = [
  {
    id: 201,
    name: "Quinoa Stuffed Bell Peppers",
    description: "Colorful bell peppers filled with a savory blend of quinoa, black beans, corn, and spices.",
    price: "$14.95",
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    flavorProfile: {
      sweet: 3,    // Sweet notes from bell peppers and corn
      salty: 4,    // Moderate seasoning
      sour: 2,     // Slight acidity
      bitter: 1,   // Minimal bitterness
      umami: 7,    // Good umami from quinoa and beans
      spicy: 3,    // Mild spice from seasoning
      refreshing: 4, // Somewhat refreshing
      rich: 6      // Hearty and filling
    },
    dynamicPairings: true,
    nutrition: {
      calories: 350,
      protein: 12,
      fat: 8,
      carbs: 55
    }
  },
  {
    id: 202,
    name: "Mushroom Risotto",
    description: "Creamy arborio rice cooked with a medley of wild mushrooms, finished with truffle oil and parmesan.",
    price: "$16.95",
    isVegan: false,
    isVegetarian: true,
    contains: ["Dairy"],
    seasonal: false,
    flavorProfile: {
      sweet: 2,      // Mild sweetness
      salty: 5,      // Salt from parmesan
      sour: 1,       // Very little acidity
      bitter: 2,     // Slight bitterness
      umami: 9,      // Strong umami from mushrooms and truffle
      spicy: 0,      // No spice
      refreshing: 1, // Not refreshing
      rich: 9        // Very rich and creamy
    },
    dynamicPairings: true,
    nutrition: {
      calories: 420,
      protein: 10,
      fat: 15,
      carbs: 60
    }
  },
  {
    id: 203,
    name: "Roasted Vegetable Tagine",
    description: "Moroccan-spiced root vegetables slow-cooked with apricots and chickpeas, served with fluffy couscous.",
    price: "$15.50",
    isVegan: true,
    isVegetarian: true,
    contains: ["Gluten"],
    seasonal: true,
    flavorProfile: {
      sweet: 5,      // Sweetness from apricots and vegetables
      salty: 3,      // Moderate salt
      sour: 2,       // Slight acidity
      bitter: 1,     // Minimal bitterness
      umami: 6,      // Good umami depth
      spicy: 5,      // Medium spice from Moroccan seasoning
      refreshing: 3, // Not particularly refreshing
      rich: 7        // Rich and complex flavor
    },
    dynamicPairings: true,
    nutrition: {
      calories: 380,
      protein: 11,
      fat: 9,
      carbs: 65
    }
  },
  {
    id: 204,
    name: "Eggplant Parmesan",
    description: "Layers of crispy eggplant, house-made marinara, and melted mozzarella, topped with fresh basil.",
    price: "$15.95",
    isVegan: false,
    isVegetarian: true,
    contains: ["Dairy", "Gluten"],
    seasonal: false,
    flavorProfile: {
      sweet: 4,      // Sweetness from tomato sauce
      salty: 6,      // Salt from cheese and seasoning
      sour: 3,       // Acidity from tomatoes
      bitter: 2,     // Slight bitterness from eggplant
      umami: 8,      // Strong umami from cheese and tomatoes
      spicy: 1,      // Very mild spice
      refreshing: 2, // Not refreshing
      rich: 8        // Very rich and hearty
    },
    dynamicPairings: true,
    nutrition: {
      calories: 450,
      protein: 18,
      fat: 22,
      carbs: 40
    }
  },
  {
    id: 205,
    name: "Pad Thai with Tofu",
    description: "Rice noodles stir-fried with crispy tofu, bean sprouts, and our house-made tamarind sauce, topped with crushed peanuts.",
    price: "$14.50",
    isVegan: true,
    isVegetarian: true,
    contains: ["Nuts", "Soy"],
    seasonal: false,
    flavorProfile: {
      sweet: 6,      // Sweetness from tamarind sauce
      salty: 5,      // Salt from soy and fish sauce
      sour: 6,       // Tanginess from tamarind
      bitter: 1,     // Minimal bitterness
      umami: 7,      // Good umami from tofu and sauce
      spicy: 4,      // Medium spice
      refreshing: 5, // Somewhat refreshing from lime
      rich: 6        // Moderately rich
    },
    dynamicPairings: true,
    nutrition: {
      calories: 410,
      protein: 16,
      fat: 12,
      carbs: 58
    }
  }
];

export default mains;
