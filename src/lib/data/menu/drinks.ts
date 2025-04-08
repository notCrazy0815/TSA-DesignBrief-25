import type { MenuItem } from './types';

const drinks: MenuItem[] = [
  {
    id: 301,
    name: "Green Detox Smoothie",
    description: "A refreshing blend of spinach, kale, green apple, lemon and a hint of ginger.",
    price: "$5.50",
    isVegan: true,
    isVegetarian: true,
    contains: ["Spinach", "Kale", "Green Apple", "Lemon", "Ginger"], // Using contains as defined in the interface
    seasonal: true, // Using seasonal as defined in the interface
    nutrition: {
      calories: 180,
      protein: 5,
      fat: 2,
      carbs: 35
    }
  }
];

export default drinks;
