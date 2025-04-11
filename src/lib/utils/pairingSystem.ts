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

export function calculatePairingStrength(item1: FlavorProfile, item2: FlavorProfile): number {
  const complementaryPairs = [
    { flavor1: 'sweet', flavor2: 'sour', weight: 1.5 },
    { flavor1: 'sweet', flavor2: 'bitter', weight: 1.2 },
    { flavor1: 'salty', flavor2: 'sweet', weight: 1.3 },
    { flavor1: 'salty', flavor2: 'sour', weight: 1.2 },
    { flavor1: 'umami', flavor2: 'salty', weight: 1.5 },
    { flavor1: 'refreshing', flavor2: 'rich', weight: 1.7 },
    { flavor1: 'refreshing', flavor2: 'spicy', weight: 1.8 }
  ];
  
  const clashingPairs = [
    { flavor1: 'bitter', flavor2: 'bitter', weight: 0.5 },
    { flavor1: 'spicy', flavor2: 'spicy', weight: 0.5 }
  ];
  
  let score = 0;
  
  // Process complementary pairs in both directions
  for (const pair of complementaryPairs) {
    // Check pairing in both directions (e.g. sweet+sour and sour+sweet)
    score += Math.min(item1[pair.flavor1 as keyof FlavorProfile] as number, 
                    item2[pair.flavor2 as keyof FlavorProfile] as number) * pair.weight;
    
    score += Math.min(item2[pair.flavor1 as keyof FlavorProfile] as number, 
                    item1[pair.flavor2 as keyof FlavorProfile] as number) * pair.weight;
  }
  
  // Process clashing pairs
  for (const pair of clashingPairs) {
    score -= Math.min(item1[pair.flavor1 as keyof FlavorProfile] as number, 
                    item2[pair.flavor2 as keyof FlavorProfile] as number) * pair.weight;
  }
  
  // Contrasting intensity (middle scores are better)
  score += (10 - Math.abs(item1.rich - item2.rich)) * 0.3;
  
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
    const strength = calculatePairingStrength(menuItem.flavorProfile, item.flavorProfile);
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