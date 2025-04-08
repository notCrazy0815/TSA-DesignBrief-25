export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  isVegan: boolean;
  isVegetarian: boolean;
  contains: string[];
  seasonal: boolean;
  nutrition: NutritionInfo;
}

export interface MenuCategory {
  id: number;
  title: string;
  text?: string; // Make optional to handle both text and description
  description: string; // Add description to match usage in index.ts
}
