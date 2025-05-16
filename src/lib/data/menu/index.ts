import type { MenuItem, MenuCategory } from './types';
import appetizersData from './appetizers';
import mainsData from './mains';
import drinksData from './drinks';
import dessertsData from './desserts';

// Function to process menu items
function processMenuItems(items: any[]): MenuItem[] {
  return items.map(item => {
    // Convert string price to number if needed
    let price = item.price;
    if (typeof price === 'string') {
      price = parseFloat(price.replace(/[^0-9.-]+/g, ""));
      if (isNaN(price)) price = 0;
    }
    
    return {
      ...item,
      price
    };
  });
}

const appetizers = processMenuItems(appetizersData);
const mains = processMenuItems(mainsData);
const drinks = processMenuItems(drinksData);
const desserts = processMenuItems(dessertsData);

const menuItems: Record<number, MenuItem[]> = {
  1: appetizers,
  2: mains,
  3: drinks,
  4: desserts
};

export const menuCategories: MenuCategory[] = [
  {
    id: 1,
    title: "Appetizers",
    description: "Kick off your culinary journey with our delightful, artfully crafted plant-based appetizers featuring a wide variety of flavors and textures designed to truly excite your palate from the very first bite."
  },
  {
    id: 2,
    title: "Main",
    description: "Enjoy exquisite vegan and vegetarian main courses crafted with passion and precision, using farm-fresh ingredients and timeless recipes that celebrate both tradition and innovation."
  },
  {
    id: 3,
    title: "Drinks",
    description: "Refresh yourself with our curated selection of organic beverages, handcrafted cocktails, and nutrient-rich smoothies that complement your sustainable dining experience."
  },
  {
    id: 4,
    title: "Desserts",
    description: "End your dining experience on a sweet note with our decadent, award-winning vegan desserts that merge classic indulgence with innovative, plant-based creativity."
  }
];

export default menuItems;
