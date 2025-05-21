export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  // Additional optional nutrition data
  sugar?: number;
  fiber?: number;
  sodium?: number;
}

export interface FlavorProfile {
  sweet: number;       // 0-10 scale
  salty: number;       // 0-10 scale
  sour: number;       // 0-10 scale
  bitter: number;      // 0-10 scale
  umami: number;       // 0-10 scale
  spicy: number;       // 0-10 scale
  refreshing: number;  // 0-10 scale
  rich: number;        // 0-10 scale
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  isVegan: boolean;
  isVegetarian: boolean;
  contains: string[];
  seasonal: boolean;
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    sugar?: number;
    fiber?: number;
    sodium?: number;
  };
  flavorProfile: {
    sweet: number;
    salty: number;
    sour: number;
    bitter: number;
    umami: number;
    spicy: number;
    refreshing: number;
    rich: number;
  };
  dynamicPairings: boolean;
  ingredients: string[];
  preparation?: string;
  pairingRecommendation?: string;
  sourceInfo?: {
    local: boolean;
    organic: boolean;
    sources: Array<{
      name: string;
      location: string;
    }>;
  };
  dietarySuitability?: {
    glutenFree?: boolean;
    dairyFree?: boolean;
    nutFree?: boolean;
    lowCarb?: boolean;
    keto?: boolean;
    paleo?: boolean;
  };
}

export interface MenuCategory {
  id: number;
  title: string;
  text?: string; // Make optional to handle both text and description
  description: string; // Add description to match usage in index.ts
}

export interface Ingredient {
  name: string;
  description: string;
  nutritionalValue?: {
    calories?: number;
    protein?: number;
    fat?: number;
    carbs?: number;
    fiber?: number;
    sugar?: number;
  };
  flavorProfile?: {
    sweet?: number;
    salty?: number;
    sour?: number;
    bitter?: number;
    umami?: number;
    spicy?: number;
  };
  dietaryInfo?: {
    isVegan: boolean;
    isVegetarian: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
    isNutFree: boolean;
  };
  sourceInfo?: {
    local: boolean;
    organic: boolean;
    supplier?: string;
    origin?: string;
    ingredientSource?: any; // Reference to detailed ingredient source information
  };
  healthBenefits?: string[];
  storageInfo?: string;
  seasonality?: {
    isSeasonal: boolean;
    peakSeason?: string[];
  };
}
