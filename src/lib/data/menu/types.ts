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
  nutrition: NutritionInfo;
  // New field for flavor profiles
  flavorProfile?: FlavorProfile;
  // Other optional fields
  ingredients?: string[];
  preparation?: string;
  pairingRecommendation?: string;
  dynamicPairings?: boolean; // Flag to use dynamic pairing system
  sourceInfo?: {
    local?: boolean;
    organic?: boolean;
    sources?: {name: string, location: string}[];
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
