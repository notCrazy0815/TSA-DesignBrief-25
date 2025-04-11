import type { MenuItem } from './types';

const desserts: MenuItem[] = [
  {
    id: 401,
    name: "Chia Pudding with Berries",
    description: "Creamy chia pudding made with coconut milk, topped with a medley of fresh berries and a drizzle of agave.",
    price: "$6.95",
    isVegan: true,
    isVegetarian: true,
    contains: ["Coconut"],
    seasonal: false,
    flavorProfile: {
      sweet: 7,      // Quite sweet from berries and agave
      salty: 0,      // No salt
      sour: 3,       // Slight sourness from berries
      bitter: 0,     // No bitterness
      umami: 0,      // No umami
      spicy: 0,      // No spice
      refreshing: 5, // Moderately refreshing
      rich: 6        // Creamy richness from coconut milk
    },
    dynamicPairings: true,
    nutrition: {
      calories: 200,
      protein: 6,
      fat: 10,
      carbs: 25
    }
  },
  {
    id: 402,
    name: "Dark Chocolate Avocado Mousse",
    description: "Silky smooth chocolate mousse made with ripe avocados and fair-trade dark chocolate, topped with coconut whip.",
    price: "$7.50",
    isVegan: true,
    isVegetarian: true,
    contains: ["Coconut"],
    seasonal: false,
    flavorProfile: {
      sweet: 5,      // Moderate sweetness
      salty: 1,      // Hint of salt to enhance chocolate
      sour: 0,       // No sourness
      bitter: 4,     // Bitterness from dark chocolate
      umami: 2,      // Slight umami from avocado
      spicy: 0,      // No spice
      refreshing: 2, // Not very refreshing
      rich: 9        // Very rich and decadent
    },
    dynamicPairings: true,
    nutrition: {
      calories: 250,
      protein: 4,
      fat: 18,
      carbs: 20
    }
  },
  {
    id: 403,
    name: "Poached Pear with Cinnamon Cashew Cream",
    description: "Elegant pear poached in spiced wine, served with a smooth cinnamon-infused cashew cream.",
    price: "$8.25",
    isVegan: true,
    isVegetarian: true,
    contains: ["Nuts", "Alcohol"],
    seasonal: true,
    flavorProfile: {
      sweet: 6,      // Sweet but not overpowering
      salty: 0,      // No salt
      sour: 2,       // Slight tartness from wine
      bitter: 1,     // Very slight bitterness
      umami: 0,      // No umami
      spicy: 3,      // Warmth from cinnamon and spices
      refreshing: 4, // Somewhat refreshing
      rich: 5        // Moderate richness
    },
    dynamicPairings: true,
    nutrition: {
      calories: 220,
      protein: 3,
      fat: 8,
      carbs: 35
    }
  },
  {
    id: 404,
    name: "Lavender Shortbread with Berry Compote",
    description: "Buttery shortbread cookies infused with lavender, served with a warm mixed berry compote.",
    price: "$7.25",
    isVegan: false,
    isVegetarian: true,
    contains: ["Dairy", "Gluten"],
    seasonal: false,
    flavorProfile: {
      sweet: 6,      // Quite sweet
      salty: 2,      // Light salt in the shortbread
      sour: 4,       // Sourness from berries
      bitter: 1,     // Very mild bitterness
      umami: 0,      // No umami
      spicy: 0,      // No spice
      refreshing: 3, // Somewhat refreshing from berries
      rich: 7        // Rich and buttery shortbread
    },
    dynamicPairings: true,
    nutrition: {
      calories: 280,
      protein: 3,
      fat: 14,
      carbs: 35
    }
  },
  {
    id: 405,
    name: "Maple-Glazed Roasted Figs",
    description: "Warm roasted figs drizzled with maple syrup and topped with a dollop of vanilla bean cashew cream.",
    price: "$7.95",
    isVegan: true,
    isVegetarian: true,
    contains: ["Nuts"],
    seasonal: true,
    flavorProfile: {
      sweet: 8,      // Very sweet from maple and figs
      salty: 0,      // No salt
      sour: 1,       // Minimal sourness
      bitter: 0,     // No bitterness
      umami: 1,      // Just a hint of umami
      spicy: 0,      // No spice
      refreshing: 2, // Not very refreshing
      rich: 7        // Quite rich
    },
    dynamicPairings: true,
    nutrition: {
      calories: 230,
      protein: 3,
      fat: 9,
      carbs: 40
    }
  }
];

export default desserts;
