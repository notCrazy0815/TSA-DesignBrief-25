import type { MenuItem } from './types';

const drinks: MenuItem[] = [
  {
    id: 301,
    name: "Green Detox Smoothie",
    description: "A refreshing blend of spinach, kale, green apple, lemon and a hint of ginger.",
    price: "$5.50",
    isVegan: true,
    isVegetarian: true,
    contains: ["Spinach", "Kale", "Green Apple", "Lemon", "Ginger"],
    seasonal: true,
    flavorProfile: {
      sweet: 4,      // Sweetness from apple
      salty: 0,      // No salt
      sour: 6,       // Sourness from lemon and green apple
      bitter: 3,     // Some bitterness from greens
      umami: 0,      // No umami
      spicy: 2,      // Mild spice from ginger
      refreshing: 10,// Extremely refreshing
      rich: 2        // Not very rich
    },
    dynamicPairings: true,
    nutrition: {
      calories: 180,
      protein: 5,
      fat: 2,
      carbs: 35
    }
  },
  {
    id: 302,
    name: "Berry Bliss Kombucha",
    description: "House-brewed kombucha infused with mixed berries and a splash of hibiscus.",
    price: "$6.25",
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    flavorProfile: {
      sweet: 3,      // Mild sweetness
      salty: 0,      // No salt
      sour: 7,       // Quite sour from fermentation
      bitter: 2,     // Slight bitterness
      umami: 0,      // No umami
      spicy: 0,      // No spice
      refreshing: 9, // Very refreshing
      rich: 1        // Not rich
    },
    dynamicPairings: true,
    nutrition: {
      calories: 85,
      protein: 0,
      fat: 0,
      carbs: 20
    }
  },
  {
    id: 303,
    name: "Cucumber Mint Spritzer",
    description: "Sparkling water infused with fresh cucumber, mint, and a hint of lime.",
    price: "$4.95",
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: true,
    flavorProfile: {
      sweet: 1,      // Very little sweetness
      salty: 0,      // No salt
      sour: 3,       // Mild sourness from lime
      bitter: 1,     // Very slight bitterness
      umami: 0,      // No umami
      spicy: 0,      // No spice
      refreshing: 10,// Extremely refreshing
      rich: 0        // Not rich at all
    },
    dynamicPairings: true,
    nutrition: {
      calories: 45,
      protein: 0,
      fat: 0,
      carbs: 10
    }
  },
  {
    id: 304,
    name: "Golden Turmeric Latte",
    description: "Warming blend of turmeric, cinnamon, ginger, and your choice of oat or almond milk.",
    price: "$5.75",
    isVegan: true,
    isVegetarian: true,
    contains: ["Nuts"],
    seasonal: false,
    flavorProfile: {
      sweet: 5,      // Moderately sweet
      salty: 0,      // No salt
      sour: 1,       // Very little sourness
      bitter: 4,     // Some bitterness from turmeric
      umami: 0,      // No umami
      spicy: 3,      // Mild spice from ginger and cinnamon
      refreshing: 3, // Not particularly refreshing
      rich: 7        // Quite rich and creamy
    },
    dynamicPairings: true,
    nutrition: {
      calories: 150,
      protein: 3,
      fat: 7,
      carbs: 18
    }
  },
  {
    id: 305,
    name: "Hibiscus Iced Tea",
    description: "Caffeine-free hibiscus tea sweetened with a touch of agave and fresh orange.",
    price: "$4.50",
    isVegan: true,
    isVegetarian: true,
    contains: [],
    seasonal: false,
    flavorProfile: {
      sweet: 4,      // Moderately sweet from agave
      salty: 0,      // No salt
      sour: 5,       // Tanginess from hibiscus
      bitter: 2,     // Slight bitterness
      umami: 0,      // No umami
      spicy: 0,      // No spice
      refreshing: 9, // Very refreshing
      rich: 1        // Not rich
    },
    dynamicPairings: true,
    nutrition: {
      calories: 90,
      protein: 0,
      fat: 0,
      carbs: 22
    }
  }
];

export default drinks;
