// Flavor profiles and pairing logic
export interface FlavorProfile {
  sweet: number;       // 0-10 scale
  salty: number;       // 0-10 scale
  sour: number;        // 0-10 scale
  bitter: number;      // 0-10 scale
  umami: number;       // 0-10 scale
  spicy: number;       // 0-10 scale
  refreshing: number;  // 0-10 scale
  rich: number;        // 0-10 scale
}

export interface PairingItem {
  id: number;
  name: string;
  category: 'appetizer' | 'main' | 'drink' | 'dessert';
  flavorProfile: FlavorProfile;
  isVegan: boolean;
  isVegetarian: boolean;
  seasonal: boolean;
  contains: string[];
  pairingStrength?: number;
}

// Enhanced complementary pairs with more nuanced weights
const complementaryPairs = [
  { flavor1: 'sweet', flavor2: 'sour', weight: 1.5 },
  { flavor1: 'sweet', flavor2: 'bitter', weight: 1.2 },
  { flavor1: 'salty', flavor2: 'sweet', weight: 1.3 },
  { flavor1: 'salty', flavor2: 'sour', weight: 1.2 },
  { flavor1: 'umami', flavor2: 'salty', weight: 1.5 },
  { flavor1: 'refreshing', flavor2: 'rich', weight: 1.7 },
  { flavor1: 'refreshing', flavor2: 'spicy', weight: 1.8 },
  { flavor1: 'spicy', flavor2: 'sweet', weight: 1.4 },
  { flavor1: 'bitter', flavor2: 'sweet', weight: 1.3 },
  { flavor1: 'rich', flavor2: 'refreshing', weight: 1.6 }
];

// Enhanced clashing pairs with more nuanced weights
const clashingPairs = [
  { flavor1: 'bitter', flavor2: 'bitter', weight: 0.5 },
  { flavor1: 'spicy', flavor2: 'spicy', weight: 0.5 },
  { flavor1: 'sour', flavor2: 'sour', weight: 0.6 },
  { flavor1: 'rich', flavor2: 'rich', weight: 0.7 }
];

type MenuCategory = 'appetizer' | 'main' | 'drink' | 'dessert';

// Category-specific pairing rules
const categoryPairingRules: Record<MenuCategory, Record<MenuCategory, number>> = {
  appetizer: {
    appetizer: 0.8,  // Don't pair appetizers with appetizers
    main: 1.2,       // Appetizers pair well with mains
    drink: 1.1,      // Appetizers pair well with drinks
    dessert: 0.8     // Appetizers don't typically pair with desserts
  },
  main: {
    appetizer: 1.2,
    main: 0.8,       // Don't pair mains with mains
    drink: 1.3,      // Mains pair very well with drinks
    dessert: 1.1     // Mains can pair with desserts
  },
  drink: {
    appetizer: 1.1,
    main: 1.3,
    drink: 0.8,      // Don't pair drinks with drinks
    dessert: 1.2     // Drinks pair well with desserts
  },
  dessert: {
    appetizer: 0.8,
    main: 1.1,
    drink: 1.2,
    dessert: 0.8     // Don't pair desserts with desserts
  }
};

export function calculatePairingStrength(item1: PairingItem, item2: PairingItem): number {
  let score = 0;
  
  // Apply category-specific pairing rules
  const categoryMultiplier = categoryPairingRules[item1.category][item2.category] || 1;
  
  // Process complementary pairs in both directions
  for (const pair of complementaryPairs) {
    const value1 = item1.flavorProfile[pair.flavor1 as keyof FlavorProfile] as number;
    const value2 = item2.flavorProfile[pair.flavor2 as keyof FlavorProfile] as number;
    
    // Calculate complementary score with diminishing returns
    const complementScore = Math.min(value1, value2) * pair.weight;
    score += complementScore;
    
    // Add reverse direction
    const reverseScore = Math.min(
      item2.flavorProfile[pair.flavor1 as keyof FlavorProfile] as number,
      item1.flavorProfile[pair.flavor2 as keyof FlavorProfile] as number
    ) * pair.weight;
    score += reverseScore;
  }
  
  // Process clashing pairs
  for (const pair of clashingPairs) {
    const clashScore = Math.min(
      item1.flavorProfile[pair.flavor1 as keyof FlavorProfile] as number,
      item2.flavorProfile[pair.flavor2 as keyof FlavorProfile] as number
    ) * pair.weight;
    score -= clashScore;
  }
  
  // Consider dietary compatibility
  if (item1.isVegan && !item2.isVegan) {
    score *= 0.8; // Penalize non-vegan pairings for vegan items
  }
  
  // Consider seasonal compatibility
  if (item1.seasonal && item2.seasonal) {
    score *= 1.2; // Bonus for seasonal pairings
  }
  
  // Apply category multiplier
  score *= categoryMultiplier;
  
  // Normalize to 0-10 scale with bounds checking
  return Math.max(0, Math.min(10, score / 5));
}

// Find the best pairings for a menu item
export function findBestPairings(
  menuItem: PairingItem, 
  allItems: PairingItem[], 
  count: number = 3, 
  dietaryFilter?: 'vegan' | 'vegetarian'
): PairingItem[] {
  // Don't pair with itself or items from the same category
  const potentialPairings = allItems.filter(item => 
    item.id !== menuItem.id && 
    item.category !== menuItem.category &&
    // Apply dietary restrictions if specified
    (!dietaryFilter || (dietaryFilter === 'vegan' ? item.isVegan : item.isVegetarian))
  );
  
  // Calculate pairing strength for each potential pairing
  const scoredPairings = potentialPairings.map(item => {
    const strength = calculatePairingStrength(menuItem, item);
    return { ...item, pairingStrength: strength };
  });
  
  // Sort by pairing strength and take the top results
  return scoredPairings
    .sort((a, b) => (b.pairingStrength || 0) - (a.pairingStrength || 0))
    .slice(0, count);
}

// Generate a natural language pairing recommendation with more context
export function generatePairingRecommendation(
  menuItem: PairingItem, 
  pairings: PairingItem[]
): string {
  if (!pairings.length) return '';
  
  const mainPairing = pairings[0];
  const strength = mainPairing.pairingStrength || 0;
  
  // More varied language descriptions based on pairing strength
  const strengthDescriptions = [
    { min: 8, phrases: ['perfectly complements', 'is an exceptional match with', 'creates a harmonious balance with'] },
    { min: 6, phrases: ['pairs beautifully with', 'is wonderfully enhanced by', 'creates a delightful combination with'] },
    { min: 4, phrases: ['goes well with', 'is nicely complemented by', 'makes an enjoyable pairing with'] },
    { min: 0, phrases: ['can be enjoyed with', 'offers a nice contrast to', 'provides an interesting pairing with'] }
  ];
  
  // Select a phrase based on pairing strength with randomization for variety
  const matchingStrength = strengthDescriptions.find(desc => strength >= desc.min);
  const phrases = matchingStrength?.phrases || strengthDescriptions[0].phrases;
  const description = phrases[Math.floor(Math.random() * phrases.length)];
  
  // Category-specific language
  const categoryDescriptors = {
    'appetizer': 'starter',
    'main': 'dish',
    'drink': 'beverage',
    'dessert': 'dessert'
  };
  
  // Build recommendation text
  let recommendation = `This ${categoryDescriptors[menuItem.category as keyof typeof categoryDescriptors]} ${description} our ${mainPairing.name}`;
  
  // Add second pairing if available with varied phrasing
  if (pairings.length > 1) {
    const secondPairing = pairings[1];
    const secondStrength = secondPairing.pairingStrength || 0;
    
    if (secondStrength > strength - 1) {
      recommendation += ` or equally with our ${secondPairing.name}`;
    } else {
      recommendation += `. Alternatively, try it with our ${secondPairing.name}`;
    }
  }
  
  // Add flavor profile insights if there's a clear pattern
  const mainFlavorProfile = getHighestFlavorAttributes(mainPairing.flavorProfile, 2);
  if (mainFlavorProfile.length) {
    recommendation += `, which ${mainFlavorProfile.length > 1 ? 'offers' : 'brings'} ${formatFlavorList(mainFlavorProfile)}`;
  }
  
  // Add seasonal note if applicable
  if (pairings.some(p => p.seasonal)) {
    recommendation += `. For the best experience, consider our seasonal offerings`;
  }
  
  return recommendation + '.';
}

// Helper to get the highest flavor attributes
function getHighestFlavorAttributes(profile: FlavorProfile, count: number = 2): string[] {
  return Object.entries(profile)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .filter(([, value]) => value >= 6) // Only include strong flavors
    .map(([key]) => key);
}

// Helper to format a list of flavors naturally
function formatFlavorList(flavors: string[]): string {
  if (flavors.length === 0) return '';
  if (flavors.length === 1) return `a ${flavors[0]} character`;
  
  return `both ${flavors[0]} and ${flavors[1]} notes`;
}