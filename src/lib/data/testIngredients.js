// Simple test script to verify ingredient data integration
import ingredients from './ingredients.js';
import appetizers from './menu/appetizers.js';
import mains from './menu/mains.js';
import ingredientSources from './ingredientSources.js';

console.log("=== Ingredients Database Test ===");

// Count ingredients
console.log(`Total ingredients in database: ${Object.keys(ingredients).length}`);

// Count ingredients with local sources
const localIngredients = Object.values(ingredients).filter(
  ingredient => ingredient.sourceInfo?.local === true
);
console.log(`Local ingredients: ${localIngredients.length}`);

// Count ingredients with detailed source information
const detailedIngredients = Object.values(ingredients).filter(
  ingredient => ingredient.sourceInfo?.ingredientSource !== undefined
);
console.log(`Ingredients with detailed source info: ${detailedIngredients.length}`);

// Check appetizers ingredients
console.log("\n=== Appetizers Menu Test ===");
let totalIngredientsInAppetizers = 0;
let localIngredientsInAppetizers = 0;

appetizers.forEach(item => {
  totalIngredientsInAppetizers += item.ingredients.length;
  
  item.ingredients.forEach(ingredientName => {
    if (ingredients[ingredientName]?.sourceInfo?.local) {
      localIngredientsInAppetizers++;
    }
  });
});

console.log(`Total ingredients in appetizers: ${totalIngredientsInAppetizers}`);
console.log(`Local ingredients in appetizers: ${localIngredientsInAppetizers}`);
console.log(`Local ingredient percentage: ${Math.round((localIngredientsInAppetizers / totalIngredientsInAppetizers) * 100)}%`);

// Check mains ingredients
console.log("\n=== Mains Menu Test ===");
let totalIngredientsInMains = 0;
let localIngredientsInMains = 0;

mains.forEach(item => {
  totalIngredientsInMains += item.ingredients.length;
  
  item.ingredients.forEach(ingredientName => {
    if (ingredients[ingredientName]?.sourceInfo?.local) {
      localIngredientsInMains++;
    }
  });
});

console.log(`Total ingredients in mains: ${totalIngredientsInMains}`);
console.log(`Local ingredients in mains: ${localIngredientsInMains}`);
console.log(`Local ingredient percentage: ${Math.round((localIngredientsInMains / totalIngredientsInMains) * 100)}%`);

// Verify detailed sources
console.log("\n=== Detailed Source Information Test ===");
Object.entries(ingredientSources).forEach(([name, source]) => {
  console.log(`- ${name}: from ${source.farm}, distance: ${source.distance}km`);
  console.log(`  Peak Season: ${source.peakSeason}`);
  if (source.carbonFootprint) {
    console.log(`  Carbon Footprint: ${source.carbonFootprint.local} (${source.carbonFootprint.savings}% savings vs. conventional)`);
  }
});

console.log("\nTest completed successfully!"); 