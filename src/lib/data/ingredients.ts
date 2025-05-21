import type { Ingredient } from './menu/types';
import ingredientSources from './ingredientSources';

const ingredients: Record<string, Ingredient> = {
  "Fresh Avocado": {
    name: "Fresh Avocado",
    description: "Creamy, nutrient-rich fruit known for its healthy fats and smooth texture.",
    nutritionalValue: {
      calories: 160,
      protein: 2,
      fat: 15,
      carbs: 9,
      fiber: 7,
      sugar: 0.7
    },
    flavorProfile: {
      sweet: 1,
      salty: 0,
      sour: 0,
      bitter: 1,
      umami: 2,
      spicy: 0
    },
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true
    },
    sourceInfo: {
      local: true,
      organic: true,
      supplier: "Green Valley Farms",
      origin: "Local",
      ingredientSource: ingredientSources["Fresh Avocado"]
    },
    healthBenefits: [
      "Rich in healthy monounsaturated fats",
      "High in fiber",
      "Contains potassium and vitamin K",
      "Supports heart health"
    ],
    storageInfo: "Store at room temperature until ripe, then refrigerate to extend shelf life.",
    seasonality: {
      isSeasonal: true,
      peakSeason: ["Spring", "Summer"]
    }
  },
  "Organic Valencia Oranges": {
    name: "Organic Valencia Oranges",
    description: "Sweet and juicy citrus fruit, perfect for both eating and juicing.",
    nutritionalValue: {
      calories: 62,
      protein: 1,
      fat: 0.2,
      carbs: 15,
      fiber: 3,
      sugar: 12
    },
    flavorProfile: {
      sweet: 8,
      salty: 0,
      sour: 4,
      bitter: 1,
      umami: 0,
      spicy: 0
    },
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true
    },
    sourceInfo: {
      local: true,
      organic: true,
      supplier: "Sunshine Citrus Groves",
      origin: "Local"
    },
    healthBenefits: [
      "High in vitamin C",
      "Good source of fiber",
      "Contains antioxidants",
      "Supports immune system"
    ],
    storageInfo: "Store at room temperature for up to a week, or refrigerate for longer storage.",
    seasonality: {
      isSeasonal: true,
      peakSeason: ["Winter", "Spring"]
    }
  },
  "Local Lime": {
    name: "Local Lime",
    description: "Tangy citrus fruit that adds a bright, acidic note to dishes.",
    nutritionalValue: {
      calories: 20,
      protein: 0.5,
      fat: 0.1,
      carbs: 7,
      fiber: 1.9,
      sugar: 1.7
    },
    flavorProfile: {
      sweet: 1,
      salty: 0,
      sour: 9,
      bitter: 2,
      umami: 0,
      spicy: 0
    },
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true
    },
    sourceInfo: {
      local: true,
      organic: true,
      supplier: "Sunshine Citrus Groves",
      origin: "Local"
    },
    healthBenefits: [
      "Rich in vitamin C",
      "Contains antioxidants",
      "Supports digestion",
      "May help with iron absorption"
    ],
    storageInfo: "Store at room temperature for up to a week, or refrigerate for longer storage.",
    seasonality: {
      isSeasonal: true,
      peakSeason: ["Summer", "Fall"]
    }
  },
  "Organic Mixed Greens": {
    name: "Organic Mixed Greens",
    description: "A blend of fresh, tender leafy greens including spinach, arugula, and baby lettuce varieties.",
    nutritionalValue: {
      calories: 20,
      protein: 1.5,
      fat: 0.3,
      carbs: 3.5,
      fiber: 1.5,
      sugar: 0.5
    },
    flavorProfile: {
      sweet: 1,
      salty: 0,
      sour: 1,
      bitter: 3,
      umami: 1,
      spicy: 0
    },
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true
    },
    sourceInfo: {
      local: true,
      organic: true,
      supplier: "Riverside Organic Farm",
      origin: "Local"
    },
    healthBenefits: [
      "Rich in vitamins A, C, and K",
      "Good source of folate and iron",
      "Contains antioxidants",
      "Supports eye health"
    ],
    storageInfo: "Store refrigerated in a sealed container with a paper towel to absorb excess moisture. Best used within 3-5 days.",
    seasonality: {
      isSeasonal: true,
      peakSeason: ["Spring", "Fall"]
    }
  },
  "Extra Virgin Olive Oil": {
    name: "Extra Virgin Olive Oil",
    description: "Premium cold-pressed olive oil with fruity notes and a peppery finish.",
    nutritionalValue: {
      calories: 119,
      protein: 0,
      fat: 14,
      carbs: 0,
      fiber: 0,
      sugar: 0
    },
    flavorProfile: {
      sweet: 2,
      salty: 0,
      sour: 1,
      bitter: 3,
      umami: 1,
      spicy: 2
    },
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true
    },
    sourceInfo: {
      local: false,
      organic: true,
      supplier: "Mediterranean Imports",
      origin: "Italy"
    },
    healthBenefits: [
      "Rich in monounsaturated fats",
      "Contains antioxidants",
      "May reduce inflammation",
      "Supports heart health"
    ],
    storageInfo: "Store in a cool, dark place. Keep tightly sealed and away from heat sources.",
    seasonality: {
      isSeasonal: false,
      peakSeason: []
    }
  },
  "Fresh Beets": {
    name: "Fresh Beets",
    description: "Vibrant, earthy root vegetables with a natural sweetness that intensifies when roasted.",
    nutritionalValue: {
      calories: 44,
      protein: 1.7,
      fat: 0.2,
      carbs: 10,
      fiber: 2.8,
      sugar: 6.8
    },
    flavorProfile: {
      sweet: 7,
      salty: 0,
      sour: 1,
      bitter: 2,
      umami: 3,
      spicy: 0
    },
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true
    },
    sourceInfo: {
      local: true,
      organic: true,
      supplier: "Hillside Root Farm",
      origin: "Local"
    },
    healthBenefits: [
      "Rich in folate and manganese",
      "Contains nitrates that may lower blood pressure",
      "Good source of fiber",
      "High in antioxidants"
    ],
    storageInfo: "Remove greens if attached and store separately. Place beets in a perforated bag in the refrigerator crisper drawer for up to 3 weeks.",
    seasonality: {
      isSeasonal: true,
      peakSeason: ["Fall", "Winter"]
    }
  },
  "Feta Cheese": {
    name: "Feta Cheese",
    description: "Traditional Greek-style brined cheese made from sheep's milk with a tangy, salty flavor and crumbly texture.",
    nutritionalValue: {
      calories: 75,
      protein: 4,
      fat: 6,
      carbs: 1.2,
      fiber: 0,
      sugar: 0
    },
    flavorProfile: {
      sweet: 0,
      salty: 8,
      sour: 5,
      bitter: 1,
      umami: 4,
      spicy: 0
    },
    dietaryInfo: {
      isVegan: false,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: false,
      isNutFree: true
    },
    sourceInfo: {
      local: true,
      organic: true,
      supplier: "Meadow Creek Dairy",
      origin: "Local"
    },
    healthBenefits: [
      "Good source of calcium and phosphorus",
      "Contains beneficial probiotics",
      "Lower in fat than many other cheeses",
      "Provides B vitamins"
    ],
    storageInfo: "Store in brine in an airtight container in the refrigerator for up to 1 month. Do not freeze.",
    seasonality: {
      isSeasonal: false,
      peakSeason: []
    }
  },
  "Local Eggplant": {
    name: "Local Eggplant",
    description: "Glossy purple vegetables with a meaty texture and mild flavor that absorbs other flavors when cooked.",
    nutritionalValue: {
      calories: 20,
      protein: 0.8,
      fat: 0.2,
      carbs: 4.8,
      fiber: 2.5,
      sugar: 2.3
    },
    flavorProfile: {
      sweet: 2,
      salty: 0,
      sour: 0,
      bitter: 3,
      umami: 7,
      spicy: 0
    },
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true
    },
    sourceInfo: {
      local: true,
      organic: true,
      supplier: "Riverbank Gardens",
      origin: "Local"
    },
    healthBenefits: [
      "Good source of fiber",
      "Contains nasunin, a potent antioxidant",
      "Low in calories",
      "Contains small amounts of many vitamins and minerals"
    ],
    storageInfo: "Store at room temperature for 1-2 days or refrigerate for up to a week. Keep away from ethylene-producing fruits like bananas.",
    seasonality: {
      isSeasonal: true,
      peakSeason: ["Summer", "Fall"]
    }
  },
  "Black Beans": {
    name: "Black Beans",
    description: "Nutritious legumes with a dense, meaty texture and mild flavor, perfect for plant-based proteins.",
    nutritionalValue: {
      calories: 130,
      protein: 8,
      fat: 0.5,
      carbs: 23,
      fiber: 7.5,
      sugar: 0.6
    },
    flavorProfile: {
      sweet: 1,
      salty: 0,
      sour: 0,
      bitter: 1,
      umami: 7,
      spicy: 0
    },
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true
    },
    sourceInfo: {
      local: true,
      organic: true,
      supplier: "Red Hill Farm",
      origin: "Local"
    },
    healthBenefits: [
      "Excellent source of plant protein",
      "High in fiber",
      "Contains antioxidants",
      "Good source of folate and magnesium"
    ],
    storageInfo: "Store dried beans in an airtight container in a cool, dry place for up to 2 years. Cooked beans can be refrigerated for 3-5 days or frozen for up to 6 months.",
    seasonality: {
      isSeasonal: false,
      peakSeason: []
    }
  },
  "Sweet Potatoes": {
    name: "Sweet Potatoes",
    description: "Vibrant orange root vegetables with a naturally sweet flavor that intensifies when cooked.",
    nutritionalValue: {
      calories: 86,
      protein: 1.6,
      fat: 0.1,
      carbs: 20,
      fiber: 3,
      sugar: 4.2
    },
    flavorProfile: {
      sweet: 8,
      salty: 0,
      sour: 0,
      bitter: 0,
      umami: 2,
      spicy: 0
    },
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true
    },
    sourceInfo: {
      local: true,
      organic: true,
      supplier: "Hillside Root Farm",
      origin: "Local",
      ingredientSource: ingredientSources["Sweet Potatoes"]
    },
    healthBenefits: [
      "Excellent source of vitamin A",
      "Good source of vitamin C",
      "Contains manganese and potassium",
      "Rich in antioxidants"
    ],
    storageInfo: "Store in a cool, dark, well-ventilated place (not the refrigerator) for up to 2 weeks. Avoid storing near onions.",
    seasonality: {
      isSeasonal: true,
      peakSeason: ["Fall", "Winter"]
    }
  },
  "Organic Chickpeas": {
    name: "Organic Chickpeas",
    description: "Versatile legumes with a nutty flavor and firm texture, widely used in Mediterranean and Middle Eastern cuisines.",
    nutritionalValue: {
      calories: 120,
      protein: 6,
      fat: 2,
      carbs: 22,
      fiber: 6,
      sugar: 4
    },
    flavorProfile: {
      sweet: 2,
      salty: 0,
      sour: 0,
      bitter: 1,
      umami: 5,
      spicy: 0
    },
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true
    },
    sourceInfo: {
      local: true,
      organic: true,
      supplier: "Green Valley Farms",
      origin: "Local"
    },
    healthBenefits: [
      "Excellent source of plant protein",
      "Rich in fiber",
      "Contains folate and manganese",
      "Helps balance blood sugar"
    ],
    storageInfo: "Store dried chickpeas in an airtight container in a cool, dry place for up to 2 years. Cooked chickpeas can be refrigerated for 3-5 days or frozen for up to 6 months.",
    seasonality: {
      isSeasonal: false,
      peakSeason: []
    }
  },
  "Organic Tofu": {
    name: "Organic Tofu",
    description: "Plant-based protein made from soybeans, with a neutral flavor that absorbs other flavors when cooked.",
    nutritionalValue: {
      calories: 76,
      protein: 8,
      fat: 4.5,
      carbs: 2,
      fiber: 0.5,
      sugar: 0.5
    },
    flavorProfile: {
      sweet: 1,
      salty: 1,
      sour: 0,
      bitter: 0,
      umami: 4,
      spicy: 0
    },
    dietaryInfo: {
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true
    },
    sourceInfo: {
      local: true,
      organic: true,
      supplier: "Soy Innovations",
      origin: "Local"
    },
    healthBenefits: [
      "Excellent source of plant protein",
      "Contains all nine essential amino acids",
      "Good source of calcium and iron",
      "Contains isoflavones which may have health benefits"
    ],
    storageInfo: "Store in water in an airtight container in the refrigerator for up to 1 week, changing the water daily. Can be frozen for up to 5 months.",
    seasonality: {
      isSeasonal: false,
      peakSeason: []
    }
  }
};

export default ingredients; 