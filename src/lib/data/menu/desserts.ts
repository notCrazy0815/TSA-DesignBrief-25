import type { MenuItem } from './types';

const desserts: MenuItem[] = [
  {
    id: 401,
    name: "Chia Pudding with Berries",
    description: "Creamy chia pudding made with coconut milk, topped with a medley of fresh berries and a drizzle of agave.",
    price: "$6.95",
    isVegan: true,
    isVegetarian: true,
    contains: ["Coconut"], // Using contains as defined in the interface
    seasonal: false, // Using seasonal as defined in the interface
    nutrition: {
      calories: 200,
      protein: 6,
      fat: 10,
      carbs: 25
    }
  }
];

export default desserts;
