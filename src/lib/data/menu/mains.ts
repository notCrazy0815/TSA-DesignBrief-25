import type { MenuItem } from './types';

const mains: MenuItem[] = [
  {
    id: 201,
    name: "Quinoa Stuffed Bell Peppers",
    description: "Colorful bell peppers filled with a savory blend of quinoa, black beans, corn, and spices.",
    price: "$14.95",
    isVegan: true,
    isVegetarian: true,
    contains: [], // Using contains as defined in the interface
    seasonal: false, // Using seasonal as defined in the interface
    nutrition: {
      calories: 350,
      protein: 12,
      fat: 8,
      carbs: 55
    }
  }
];

export default mains;
