<script>
  import { tick, onMount, onDestroy } from "svelte";  // Add onDestroy import
  import { fly, fade } from "svelte/transition";
  import NavBar from "$lib/components/NavBar.svelte";
  import MenuItemModal from "$lib/components/MenuItemModal.svelte";
  import { writable } from 'svelte/store';
  import Footer from "$lib/components/Footer.svelte";

  const activeFilters = writable({
    dietary: new Set(['all']),
    features: new Set(),
    allergens: new Set(),
    price: null
  });

  let activeCard = null;
  let isTransitioning = false;
  let scrollPosition = 0;
  let menuElement;
  let containerHeight;
  let menuCategoryCardsElement;
  let scrollDownElement;
  let lastScrollY = 0;
  let lastResize = 0;
  let activeTab = 'diet';  // Add this for the filter tabs
  let totalItemsCount = 0;
  let filteredItemsCount = 0;

  const originalRotations = [-5, 4, 10, -6];

  const cards = [
    { id: 1, title: "Appetizers", text: "Kick off your culinary journey with our delightful plant-based appetizers, featuring fresh, innovative bites that tease your taste buds with vibrant flavors and sustainable ingredients." },
    { id: 2, title: "Main", text: "Enjoy exquisite vegan and vegetarian main courses crafted with passion and precision. Our mains blend traditional flavors with modern twists, using farm-fresh produce to create memorable plant-based dishes." },
    { id: 3, title: "Drinks", text: "Refresh yourself with our curated selection of organic, plant-based beverages and handcrafted cocktails. From fruit-infused creations to botanical blends, each sip complements your sustainable dining experience." },
    { id: 4, title: "Desserts", text: "End your dining experience on a sweet note with our decadent vegan desserts. Classic indulgence meets modern creativity with plant-based ingredients that prove sustainable eating never compromises on taste." }
  ];

  const menus = {
    Appetizers: [
      { category: "Cold Starters", items: [
        { name: "Bruschetta with Heirloom Tomatoes", price: "7.95", tags: ["vegan", "contains-gluten"], detailed: {
          description: "Our signature bruschetta features locally sourced heirloom tomatoes, fresh basil from our greenhouse, and aged balsamic reduction drizzled over artisanal sourdough bread toasted to perfection.",
          ingredients: ["Heirloom tomatoes", "Fresh basil", "Organic garlic", "Extra-virgin olive oil", "Aged balsamic reduction", "Artisanal sourdough bread", "Sea salt", "Cracked black pepper"],
          nutrition: {
            calories: 215,
            protein: "4g",
            carbs: "28g",
            fat: "10g"
          },
          allergens: ["Gluten"],
          image: "/images/menu/bruschetta.jpg",
          pairings: ["Elderflower Fizz", "Sparkling Botanical Water"]
        }},
        { name: "Heritage Caprese Salad", price: "9.50", tags: ["vegetarian", "gluten-free", "contains-lactose"], detailed: {
          description: "Our modern take on the classic caprese features locally-produced heritage tomatoes, house-made plant mozzarella, and fresh basil from our own garden, drizzled with our signature aged balsamic reduction.",
          ingredients: ["Heritage tomatoes", "House-made fresh mozzarella", "Organic basil", "Extra-virgin olive oil", "Aged balsamic reduction", "Sea salt", "Freshly ground black pepper"],
          nutrition: {
            calories: 245,
            protein: "12g",
            carbs: "8g",
            fat: "18g"
          },
          allergens: ["Lactose"],
          image: "/images/menu/caprese.jpg",
          pairings: ["Cold-Brewed Hibiscus Tea", "Berry-Infused Sparkler"]
        }},
        { name: "House-Marinated Olives", price: "6.25", tags: ["vegan", "gluten-free", "keto"] },
        { name: "Watermelon Gazpacho", price: "8.95", tags: ["vegan", "gluten-free", "seasonal", "raw"], isNew: true },
        { name: "Grilled Peach & Arugula Salad", price: "10.50", tags: ["vegan", "gluten-free", "seasonal"], isNew: true },
        { name: "Quinoa-Stuffed Peppers", price: "8.95", tags: ["vegan", "gluten-free"] },
        { name: "Cucumber Bites with Cashew Cream", price: "7.50", tags: ["vegan", "gluten-free", "raw"] },
        { name: "Signature Hummus Trio", price: "9.75", tags: ["vegan", "contains-gluten"] },
        { name: "Sundried Tomato Tapenade", price: "6.95", tags: ["vegan", "gluten-free"] },
        { name: "Grilled Artichoke Hearts", price: "9.95", tags: ["vegan", "gluten-free"] },
        { name: "Chilled Gazpacho Shooters", price: "5.95", tags: ["vegan", "gluten-free"] },
        { name: "Rainbow Veggie Sushi Rolls", price: "10.75", tags: ["vegan", "gluten-free", "raw"] }
      ]},
      { category: "Hot Starters", items: [
        { name: "Truffle-Stuffed Mushrooms", price: "10.95", tags: ["vegetarian", "gluten-free", "contains-lactose"] },
        { name: "Grilled Zucchini with Lemon Herb Oil", price: "8.50", tags: ["vegan", "gluten-free", "keto"] },
        { name: "Crispy Veggie Spring Rolls", price: "9.25", tags: ["vegan", "contains-gluten"] },
        { name: "Buffalo Cauliflower Bites", price: "8.95", tags: ["vegan", "contains-gluten"] },
        { name: "Spicy Sesame Tofu Skewers", price: "9.95", tags: ["vegan", "gluten-free"] },
        { name: "Wild Mushroom Quesadillas", price: "11.50", tags: ["vegetarian", "contains-gluten", "contains-lactose"] },
        { name: "Seasonal Tempura Vegetables", price: "10.75", tags: ["vegetarian", "contains-gluten", "seasonal"] }
      ]}
    ],
    Main: [
      { category: "Pasta & Risotto", items: [
        { name: "Artisanal Mushroom Risotto", price: "16.95", tags: ["vegetarian", "gluten-free", "contains-lactose", "seasonal"], isNew: true },
        { name: "Penne Arrabiata with Fresh Chili", price: "14.95", tags: ["vegan", "contains-gluten"] },
        { name: "Spaghetti Aglio e Olio with Seasonal Greens", price: "13.50", tags: ["vegan", "contains-gluten", "seasonal"] },
        { name: "Garden Vegetable Lasagna", price: "16.95", tags: ["vegetarian", "contains-gluten", "contains-lactose"] },
        { name: "Sundried Tomato & Basil Fusilli", price: "15.25", tags: ["vegan", "contains-gluten"] },
        { name: "Creamy Mushroom Carbonara", price: "15.95", tags: ["vegetarian", "contains-gluten", "contains-lactose"] },
        { name: "Zucchini Spirals with Walnut Pesto", price: "14.50", tags: ["vegan", "gluten-free", "keto", "raw"] },
        { name: "Truffle Mac and 'Cheese'", price: "17.95", tags: ["vegan", "contains-gluten"] }
      ]},
      { category: "Hearty Mains", items: [
        { name: "Rainbow Buddha Bowl", price: "14.95", tags: ["vegan", "gluten-free", "high-protein"], isNew: true },
        { name: "Jackfruit Tacos", price: "15.50", tags: ["vegan", "gluten-free", "spicy"], isNew: true },
        { name: "Jackfruit Carnitas", price: "16.50", tags: ["vegan", "gluten-free", "spicy"], isNew: true },
        { name: "Jackfruit 'Pulled Pork' Burger", price: "15.95", tags: ["vegan", "contains-gluten"] },
        { name: "Portobello Mushroom Steak", price: "16.95", tags: ["vegan", "gluten-free", "keto"] },
        { name: "Lentil & Root Vegetable Shepherd's Pie", price: "14.75", tags: ["vegan", "gluten-free", "high-protein"] },
        { name: "Stuffed Bell Peppers with Ancient Grains", price: "15.50", tags: ["vegan", "gluten-free", "high-protein"] },
        { name: "Chickpea & Vegetable Tagine", price: "14.95", tags: ["vegan", "gluten-free"] }
      ]},
      { category: "Artisan Pizza", items: [
        { name: "Classic Margherita with Cashew Mozzarella", price: "13.95", tags: ["vegan", "contains-gluten"] },
        { name: "Garden Harvest Special", price: "15.95", tags: ["vegan", "contains-gluten"] },
        { name: "Wild Mushroom & Truffle", price: "16.95", tags: ["vegetarian", "contains-gluten", "contains-lactose"] },
        { name: "Mediterranean Vegetable Medley", price: "14.95", tags: ["vegan", "contains-gluten"] },
        { name: "Roasted Veggie & Pesto Delight", price: "15.95", tags: ["vegetarian", "contains-gluten", "contains-lactose"] }
      ]}
    ],
    Drinks: [
      { category: "Signature Mocktails", items: [
        { name: "Cucumber Basil Refresher", price: "6.95", tags: ["vegan", "gluten-free"], detailed: {
          description: "A cooling blend of muddled cucumber, fresh basil, hint of lime, and sparkling water. This signature refresher is the perfect palate cleanser between courses or complement to our lighter dishes.",
          ingredients: ["Organic cucumbers", "Fresh basil", "Lime juice", "Simple syrup", "Sparkling water", "Basil and cucumber garnish"],
          nutrition: {
            calories: 85,
            sugar: "8g",
            carbs: "12g"
          },
          allergens: [],
          image: "/images/menu/cucumber-refresher.jpg",
          recommended: ["Pairs wonderfully with our Heritage Caprese Salad or Grilled Artichoke Hearts"]
        }},
        { name: "Spicy Ginger Lemonade", price: "6.50", tags: ["vegan", "gluten-free", "spicy"] },
        { name: "Elderflower Fizz", price: "6.95", tags: ["vegan", "gluten-free"] },
        { name: "Rosemary Citrus Splash", price: "6.50", tags: ["vegan", "gluten-free"] },
        { name: "Berry-Infused Sparkler", price: "7.95", tags: ["vegan", "gluten-free"] },
        { name: "Lavender Lemonade", price: "5.50", tags: ["vegan", "gluten-free"] },
        { name: "Garden Herb Spritzer", price: "6.50", tags: ["vegan", "gluten-free"] }
      ]},
      { category: "Fresh Smoothies", items: [
        { name: "Green Vitality Detox", price: "7.95", tags: ["vegan", "gluten-free"] },
        { name: "Mixed Berry Antioxidant Blast", price: "7.50", tags: ["vegan", "gluten-free"] },
        { name: "Tropical Sunshine Paradise", price: "7.95", tags: ["vegan", "gluten-free"] },
        { name: "Golden Mango Turmeric", price: "7.50", tags: ["vegan", "gluten-free"] },
        { name: "Peachy Morning Glow", price: "6.95", tags: ["vegan", "gluten-free"] },
        { name: "Creamy Avocado Spinach", price: "8.50", tags: ["vegan", "gluten-free"] },
        { name: "Apple Kale Refresh", price: "6.95", tags: ["vegan", "gluten-free"] }
      ]},
      { category: "Specialty Teas & Infusions", items: [
        { name: "Ceremonial Grade Matcha", price: "5.50", tags: ["vegan", "gluten-free"] },
        { name: "Beetroot & Ginger Infusion", price: "5.95", tags: ["vegan", "gluten-free"] },
        { name: "Cold-Brewed Hibiscus Tea", price: "4.95", tags: ["vegan", "gluten-free"] },
        { name: "Blue Butterfly Pea Flower Tea", price: "5.95", tags: ["vegan", "gluten-free"] },
        { name: "Seasonal Kombucha", price: "6.50", tags: ["vegan", "gluten-free", "seasonal"] },
        { name: "Rose & Cardamom Latte", price: "5.95", tags: ["vegan", "gluten-free"] },
        { name: "Masala Chai with Plant Milk", price: "4.95", tags: ["vegan", "gluten-free"] }
      ]},
      { category: "Artisan Cold Beverages", items: [
        { name: "House-Made Fruit Sodas", price: "4.50", tags: ["vegan", "gluten-free", "seasonal"] },
        { name: "Sparkling Botanical Water", price: "3.95", tags: ["vegan", "gluten-free"] },
        { name: "Fresh-Pressed Juice of the Day", price: "5.95", tags: ["vegan", "gluten-free", "seasonal"] },
        { name: "Coconut Water with Lime", price: "4.95", tags: ["vegan", "gluten-free"] },
        { name: "Chilled Almond Horchata", price: "5.50", tags: ["vegan", "gluten-free"] }
      ]}
    ],
    Desserts: [
      { category: "Frozen Delights", items: [
        { name: "Seasonal Fruit Sorbet Selection", price: "6.95", tags: ["vegan", "gluten-free", "seasonal"], detailed: {
          description: "A rotating selection of our house-made seasonal fruit sorbets. Current selection includes: Wild Berry, Meyer Lemon, and Tennessee Peach. Each scoop is garnished with an appropriate fresh herb or edible flower.",
          ingredients: ["Organic seasonal fruits", "Organic cane sugar", "Filtered water", "Fresh herbs", "Edible flowers"],
          nutrition: {
            calories: 110,
            sugar: "22g",
            carbs: "26g",
            fat: "0g"
          },
          allergens: [],
          image: "/images/menu/sorbet.jpg",
          recommended: ["Enjoy with our Rose & Cardamom Latte for a delightful finish to your meal"]
        }},
        { name: "Artisanal Coconut Milk Gelato", price: "7.50", tags: ["vegan", "gluten-free"] },
        { name: "Banana Date Nice Cream", price: "7.95", tags: ["vegan", "gluten-free"] },
        { name: "Cardamom Mango Lassi Ice Cream", price: "8.50", tags: ["vegetarian", "gluten-free", "contains-lactose"] },
        { name: "Wild Strawberry Freeze", price: "7.50", tags: ["vegan", "gluten-free"] },
        { name: "Chocolate Avocado Ice Cream", price: "8.95", tags: ["vegan", "gluten-free"] }
      ]},
      { category: "Sweet Bites", items: [
        { name: "Raw Cacao Energy Truffles", price: "5.95", tags: ["vegan", "gluten-free", "raw"] },
        { name: "Chia Seed Pudding Parfait", price: "6.50", tags: ["vegan", "gluten-free"] },
        { name: "Caramelized Banana Split", price: "9.95", tags: ["vegan", "gluten-free"] },
        { name: "Warm Apple Crumble", price: "8.50", tags: ["vegetarian", "contains-gluten", "contains-lactose"] },
        { name: "Seasonal Fruit Crème Brûlée", price: "10.50", tags: ["vegetarian", "gluten-free", "contains-lactose", "seasonal"] }
      ]}
    ]
  };

  function getUniqueDrinkRecommendations(count = 4) {
    const allDrinks = [];
    
    if (menus.Drinks) {
      for (const section of menus.Drinks) {
        for (const item of section.items) {
          allDrinks.push(item);
        }
      }
    }
    
    const shuffled = [...allDrinks].sort(() => 0.5 - Math.random());
    
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }
  
  const beveragePairings = getUniqueDrinkRecommendations(4).map(drink => {
    return {
      name: drink.name,
      origin: drink.detailed?.origin || "House-made", 
      description: drink.detailed?.shortDescription || 
        `A refreshing ${drink.name.toLowerCase()} that pairs perfectly with our dishes.`,
      price: drink.price
    };
  });

  const allergens = [
    { code: "G", name: "Gluten" },
    { code: "L", name: "Lactose" },
    { code: "N", name: "Nuts" },
    { code: "S", name: "Soy" },
    { code: "M", name: "Mustard" },
    { code: "SS", name: "Sesame Seeds" }
  ];

  let selectedMenuItem = null;

  function showItemDetails(item) {
    if (!item) return;
    selectedMenuItem = item;
  }

  function closeItemDetails() {
    selectedMenuItem = null;
  }

  function toggleFilter(category, filter) {
    console.log(`Toggle ${category}:${filter}`);
    
    // Create a copy of the current filters
    const newFilters = { ...$activeFilters };
    
    if (category === 'dietary') {
      if (filter === 'all') {
        // If 'all' is selected, clear other diet filters
        newFilters.dietary = new Set(['all']);
      } else {
        // Create a new Set for the dietary filters
        const newDietary = new Set([...newFilters.dietary]);
        
        // Remove 'all' when selecting a specific diet
        newDietary.delete('all');
        
        // Toggle the selected diet
        if (newDietary.has(filter)) {
          newDietary.delete(filter);
          
          // If removing vegan, check if we should also remove vegetarian
          if (filter === 'vegan' && !newDietary.has('vegetarian')) {
            // Keep vegetarian if it was explicitly selected
          }
          
          // If no specific diets selected, go back to 'all'
          if (newDietary.size === 0) {
            newDietary.add('all');
          }
        } else {
          newDietary.add(filter);
          
          // If adding vegan, automatically add vegetarian
          if (filter === 'vegan') {
            newDietary.add('vegetarian');
          }
        }
        
        newFilters.dietary = newDietary;
      }
    } 
    else if (category === 'features' || category === 'allergens') {
      const newSet = new Set([...newFilters[category]]);
      
      if (newSet.has(filter)) {
        newSet.delete(filter);
      } else {
        newSet.add(filter);
      }
      
      newFilters[category] = newSet;
    } else if (category === 'price') {
      newFilters.price = newFilters.price === filter ? null : filter;
    }
    
    activeFilters.set(newFilters);
    
    setTimeout(announceFilterChange, 10);
    updateFilteredCounts();
  }

  function updateFilteredCounts() {
    if (activeCard && menus[activeCard.title]) {
      totalItemsCount = 0;
      let filteredCount = 0;
      
      for (const section of menus[activeCard.title]) {
        if (section.items && Array.isArray(section.items)) {
          totalItemsCount += section.items.length;
          filteredCount += filterItems(section.items).length;
        }
      }
      
      filteredItemsCount = filteredCount;
    }
  }
  
  const unsubscribe = activeFilters.subscribe(() => {
    updateFilteredCounts();
  });
  
  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  function debugFilterClick(category, filter) {
    console.log(`Clicking ${category}:${filter}`);
    toggleFilter(category, filter);
  }

  function announceFilterChange() {
    // Implementation for accessibility - announce filter changes
    const announcement = document.getElementById('filter-announcement');
    if (announcement) {
      const dietaryFilters = Array.from($activeFilters.dietary).join(', ');
      const featureFilters = Array.from($activeFilters.features).join(', ');
      const allergenFilters = Array.from($activeFilters.allergens).join(', ');
      
      announcement.textContent = `Filters applied: ${dietaryFilters} ${featureFilters} ${allergenFilters}`;
    }
  }
  
  function isFilterActive(category, filter) {
    if (!$activeFilters) return false;
    
    if (category === 'price') {
      return $activeFilters.price === filter;
    }
    
    return $activeFilters[category]?.has(filter) || false;
  }
  
  function clearAllFilters() {
    activeFilters.update(filters => {
      filters.dietary = new Set(['all']);
      filters.features = new Set();
      filters.allergens = new Set();
      filters.price = null;
      return filters;
    });
    
    // Announce cleared filters to screen readers
    const announcement = document.getElementById('filter-announcement');
    if (announcement) {
      announcement.textContent = 'All filters cleared';
    }
  }
  
  function filterItems(items) {
    if (!items || !Array.isArray(items)) return [];
    
    if ($activeFilters.dietary.has('all') && 
        $activeFilters.features.size === 0 && 
        $activeFilters.allergens.size === 0 && 
        $activeFilters.price === null) {
      return items;
    }
    
    return items.filter(item => {
      if (!item) return false;
      
      let passesBasicFilter = false;
      if ($activeFilters.dietary.has('all')) {
        passesBasicFilter = true;
      } else {
        if ($activeFilters.dietary.has('vegan')) {
          passesBasicFilter = item.tags && Array.isArray(item.tags) && item.tags.includes('vegan');
        } else {
          passesBasicFilter = Array.from($activeFilters.dietary).some(filter => 
            item.tags && Array.isArray(item.tags) && item.tags.includes(filter)
          );
        }
      }
      
      let passesFeatureFilters = true;
      if ($activeFilters.features.size > 0) {
        passesFeatureFilters = Array.from($activeFilters.features).every(feature => 
          item.tags && Array.isArray(item.tags) && item.tags.includes(feature)
        );
      }
      
      // Allergen filter check
      let passesAllergenFilters = true;
      if ($activeFilters.allergens.size > 0) {
        passesAllergenFilters = Array.from($activeFilters.allergens).every(allergen => {
          // If allergen is selected, the item should NOT have this allergen
          return !(item.tags && Array.isArray(item.tags) && 
                  item.tags.includes(`contains-${allergen.toLowerCase()}`));
        });
      }
      
      // Price filter check
      let passesPriceFilter = true;
      if ($activeFilters.price !== null) {
        const itemPrice = parseFloat(item.price);
        
        if ($activeFilters.price === 'under10' && itemPrice >= 10) {
          passesPriceFilter = false;
        } else if ($activeFilters.price === '10to15' && (itemPrice < 10 || itemPrice > 15)) {
          passesPriceFilter = false;
        } else if ($activeFilters.price === 'over15' && itemPrice <= 15) {
          passesPriceFilter = false;
        }
      }
      
      return passesBasicFilter && passesFeatureFilters && passesAllergenFilters && passesPriceFilter;
    });
  }
  
  function countAllMenuItems() {
    let count = 0;
    
    for (const category in menus) {
      for (const section of menus[category]) {
        if (section.items && Array.isArray(section.items)) {
          count += section.items.length;
        }
      }
    }
    
    return count;
  }
  
  // Update filtered counts when activeFilters changes
  $: {
    if (activeCard && menus[activeCard.title]) {
      let filteredCount = 0;
      totalItemsCount = 0;
      
      for (const section of menus[activeCard.title]) {
        if (section.items && Array.isArray(section.items)) {
          totalItemsCount += section.items.length;
          filteredCount += filterItems(section.items).length;
        }
      }
      
      filteredItemsCount = filteredCount;
    }
  }

  function handleCardClick(event, card) {
    if (!event || !card || isTransitioning) return;
    
    event.stopPropagation();
    
    if (activeCard && activeCard.id === card.id) {
      closeCardExplicit(event);
    } else {
      openCard(card);
    }
  }

  async function openCard(card) {
    isTransitioning = true;
    scrollPosition = window.scrollY;
    
    activeCard = card;
    
    await tick();
    
    const activeCardElement = document.querySelector('.card.active');
    if (activeCardElement) {
      const activeCardHeight = activeCardElement.offsetHeight;
      
      if (menuCategoryCardsElement) {
        menuCategoryCardsElement.style.height = `${activeCardHeight + 40}px`;
        
        // Mobile-specific styling is handled by CSS
      }
      
      if (scrollDownElement) {
        scrollDownElement.style.opacity = '1';
        scrollDownElement.style.position = 'relative';
        scrollDownElement.style.top = 'auto';
        scrollDownElement.style.bottom = '-40px';
      }
      
      const topPadding = 0; 
      const menuCategoryRect = menuCategoryCardsElement.getBoundingClientRect();
      const elementTop = window.scrollY + menuCategoryRect.top;
      const targetScroll = elementTop + topPadding;
      
      window.scrollTo({ 
        top: targetScroll, 
        behavior: 'smooth' 
      });
    }
    
    await tick();
    setTimeout(() => {
      isTransitioning = false;
    }, 700);
  }

  function closeCardExplicit(event) {
    event.stopPropagation();
    if (isTransitioning) return;
    closeCardLogic();
  }

  function closeCard() {
    if (isTransitioning) return;
    closeCardLogic();
  }

  function closeCardLogic() {
    isTransitioning = true;
    
    activeCard = null;
    
    if (menuCategoryCardsElement) {
      if (window.innerWidth < 768) {
        menuCategoryCardsElement.style.transition = 'none';
        menuCategoryCardsElement.style.height = '80vw';
      } else {
        menuCategoryCardsElement.style.transition = 'none';
        menuCategoryCardsElement.style.height = '80vw';
        
        void menuCategoryCardsElement.offsetHeight;
        menuCategoryCardsElement.style.transition = 'height 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      }
    }
    
    resetAllCards();
    window.scrollTo({ top: scrollPosition, behavior: window.innerWidth < 768 ? 'auto' : 'smooth' });
    

    const timeoutDuration = window.innerWidth < 768 ? 300 : 700;
    setTimeout(() => {
      forceContainerHeight();
      isTransitioning = false;
    }, timeoutDuration);
  }

  function resetAllCards() {
    cards.forEach((card, i) => {
      const cardElement = document.querySelector(`.card[data-id="${card.id}"]`);
      if (!cardElement) return;
      
      cardElement.removeAttribute('style');
      
      const isMobileView = window.innerWidth < 768;
      
      if (isMobileView) {
        const cardWidth = '90vw';
        const cardHeight = `${Math.round(parseInt(cardWidth) * (2/3))}vw`;
        
        
        
        Object.assign(cardElement.style, {
          position: 'absolute',
          left: '50%',
          top: top,
          transform: `translate3d(-50%, -50%, 0) rotateZ(${getRotation(i)}deg)`,
          opacity: '1',
          zIndex: `${4 - i}`,
          pointerEvents: 'auto',
          width: cardWidth,
          height: cardHeight
        });
      } else {
        const left = i % 2 === 0 ? '33%' : '67%';
        const top = `${25 + (i * 10)}vw`;
        const cardWidth = '60vw';
        const cardHeight = `${Math.round(parseInt(cardWidth) * (2/3))}vw`;
        
        Object.assign(cardElement.style, {
          position: 'absolute',
          left: left,
          top: top,
          transform: `translate3d(-50%, -50%, 0) rotateZ(${getRotation(i)}deg)`,
          opacity: '1',
          zIndex: `${4 - i}`,
          pointerEvents: 'auto',
          width: cardWidth,
          height: cardHeight
        });
      }
      
      cardElement.classList.remove('active');
      
      const titleEl = cardElement.querySelector('.title');
      const textEl = cardElement.querySelector('.text');
      if (titleEl) titleEl.style.width = isMobileView ? '100%' : '40%';
      if (textEl) textEl.style.width = isMobileView ? '100%' : '55%';
    });
  }

  function forceContainerHeight() {
    if (!menuCategoryCardsElement) return;
    
    if (window.innerWidth < 768) {
      const cardHeight = Math.floor(window.innerWidth * 0.9 * 2/3);
      const spacing = 0;
      const totalHeight = (cards.length * (cardHeight + spacing)) - spacing;
      menuCategoryCardsElement.style.height = `${totalHeight}px`;
    } else {
      menuCategoryCardsElement.style.height = '80vw';
    }
  }

  function getCardClass(card) {
    if (!activeCard || !card) return "";
    
    if (activeCard.id === card.id) return "active";
    
    const activeIndex = cards.findIndex(c => c && c.id === activeCard.id);
    if (activeIndex === -1) return "";
    
    const cardIndex = cards.findIndex(c => c && c.id === card.id);
    return `fly-out ${cardIndex < activeIndex ? "left" : "right"}`;
  }

  function getRotation(index) {
    return originalRotations[index % originalRotations.length] || (index % 2 === 0 ? -5 : 5);
  }

  function handleScroll() {
    if (!activeCard || !document.querySelector('.card.active')) return;
    
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    
    const activeCardElement = document.querySelector('.card.active');
    if (activeCardElement) {
      if (scrollDelta > 0 && currentScrollY > scrollPosition) {
        activeCardElement.style.transform = 'translate3d(-50%, -50%, 0) rotateZ(0deg)';
      } else if (currentScrollY <= scrollPosition) {
        activeCardElement.style.transform = 'translate3d(-50%, -50%, 0) rotateZ(0deg)';
      }
    }
    
    lastScrollY = currentScrollY;
  }

  function handleResize() {
    const now = Date.now();
    if (now - lastResize < 100) return;
    lastResize = now;
    
    if (activeCard) {
      const activeCardElement = document.querySelector('.card.active');
      if (activeCardElement && menuCategoryCardsElement) {
        const activeCardHeight = activeCardElement.offsetHeight;
        menuCategoryCardsElement.style.height = `${activeCardHeight + 40}px`;
      }
    } else if (menuCategoryCardsElement) {
      forceContainerHeight();
      
      setTimeout(() => {
        resetAllCards();
      }, 150);
      
      document.querySelectorAll('.card').forEach(c => {
        c.style.opacity = '1';
        c.style.pointerEvents = 'auto';
      });
    }
  }
  
  function findMenuItemByName(name) {
    const normalize = (str) => str.toLowerCase().trim();
    const searchName = normalize(name);
    
    for (const category in menus) {
      for (const section of menus[category]) {
        for (const item of section.items) {
          if (normalize(item.name) === searchName) {
            return item;
          }
        }
      }
    }
    
    for (const section of menus.Drinks) {
      for (const item of section.items) {
        if (normalize(item.name).includes(searchName) || 
            searchName.includes(normalize(item.name))) {
          return item;
        }
      }
    }
    
    return null;
  }
  
  onMount(() => {
    menuCategoryCardsElement = document.querySelector('.menu-category-cards');
    scrollDownElement = document.querySelector('.scroll-down-elegant');
    
    if (menuCategoryCardsElement) {
      menuCategoryCardsElement.style.height = '80vw';
    }
    
    setTimeout(() => {
      forceContainerHeight();
      resetAllCards();
    }, 200);
    
    window.addEventListener('resize', handleResize);
    
    const handlePairingClick = (event) => {
      const pairingName = event.detail.pairingName;
      const pairedItem = findMenuItemByName(pairingName);
      
      if (pairedItem) {
        selectedMenuItem = null;
        
        setTimeout(() => {
          selectedMenuItem = pairedItem;
        }, 300);
      }
    };
    
    document.addEventListener('pairingClick', handlePairingClick);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('pairingClick', handlePairingClick);
    };
  });

  // Update the menus data structure to include source information for selected items
  const menuWithSourceInfo = {
    Appetizers: [
      { category: "Cold Starters", items: [
        { name: "Bruschetta with Heirloom Tomatoes", price: "7.95", tags: ["vegan", "contains-gluten"], detailed: {
          description: "Our signature bruschetta features locally sourced heirloom tomatoes, fresh basil from our greenhouse, and aged balsamic reduction drizzled over artisanal sourdough bread toasted to perfection.",
          ingredients: ["Heirloom tomatoes", "Fresh basil", "Organic garlic", "Extra-virgin olive oil", "Aged balsamic reduction", "Artisanal sourdough bread", "Sea salt", "Cracked black pepper"],
          ingredientSources: [
            {
              name: "Heirloom tomatoes",
              farm: "Green Door Gourmet",
              distance: 9,
              farmSince: 2007,
              market: "Nashville Farmers' Market",
              organic: true,
              nonGMO: true,
              season: "June through September",
              latestHarvest: "2023-09-05",
              farmDescription: "Green Door Gourmet is a 350-acre USDA Certified Organic farm and agritourism destination located just 12 minutes from downtown Nashville. They focus on sustainable growing practices and provide the community with seasonal produce, flowers, and herbs.",
              farmerName: "Sylvia Ganier",
              farmerPhoto: "/images/ingredients/sylvia-ganier.jpg",
              farmerBio: "Sylvia Ganier, owner of Green Door Gourmet, is a chef-turned-farmer dedicated to sustainable agriculture and connecting the community with local food systems. Her background in culinary arts informs her approach to growing exceptional produce.",
              coordinates: { x: 70, y: 45 },
              description: "These vibrant, flavorful heirloom tomatoes are grown using traditional methods. Each variety is selected for its exceptional taste and texture, with seeds carefully preserved from previous harvests to maintain heritage varieties unique to Tennessee.",
              image: "/images/ingredients/heirloom-tomatoes.jpg",
              peakSeason: "Mid-July through late August",
              harvestMethods: "Hand-picked at peak ripeness to ensure maximum flavor and nutrition. Each tomato is harvested in the early morning when temperatures are cooler to preserve freshness.",
              storageInfo: "Store at room temperature away from direct sunlight. Never refrigerate as it diminishes flavor and alters texture.",
              shelfLife: "5-7 days after harvest when stored properly",
              freshnessTips: "Look for firm fruits with vibrant color and earthy aroma. The stem should be fresh and green if still attached.",
              nutritionDescription: "Heirloom tomatoes contain higher levels of antioxidants and micronutrients compared to conventional varieties. They're rich in vitamins A, C, and K, and contain lycopene, a powerful antioxidant.",
              nutritionComparison: {
                "Vitamin C": { local: 38, conventional: 18, max: 40 },
                "Lycopene": { local: 25, conventional: 12, max: 25 },
                "Antioxidants": { local: 32, conventional: 15, max: 35 },
                "Flavor Compounds": { local: 28, conventional: 10, max: 30 }
              },
              nutritionBenefits: [
                { 
                  name: "Lycopene-Rich", 
                  description: "Contains up to 40% more lycopene than conventional tomatoes, supporting heart and skin health", 
                  icon: "L" 
                },
                { 
                  name: "Vitamin C", 
                  description: "Excellent source of vitamin C, boosting immune function and collagen production", 
                  icon: "C" 
                },
                { 
                  name: "Potassium", 
                  description: "High in potassium, helping to maintain healthy blood pressure", 
                  icon: "K" 
                }
              ],
              seasonalData: [
                { month: "Jan", availability: 0 },
                { month: "Feb", availability: 0 },
                { month: "Mar", availability: 0 },
                { month: "Apr", availability: 0 },
                { month: "May", availability: 15 },
                { month: "Jun", availability: 70 },
                { month: "Jul", availability: 100 },
                { month: "Aug", availability: 95 },
                { month: "Sep", availability: 60 },
                { month: "Oct", availability: 10 },
                { month: "Nov", availability: 0 },
                { month: "Dec", availability: 0 }
              ],
              environmentalImpact: "Organic farming practices at Green Door Gourmet promote soil health, biodiversity, and water conservation. Growing heirloom varieties helps preserve genetic diversity in our food system.",
              carbonFootprint: {
                local: "0.5 kg CO₂e per pound",
                conventional: "5.3 kg CO₂e per pound",
                savings: 90
              },
              communityImpact: "Green Door Gourmet employs local workers year-round and provides educational programs for schools and community groups to learn about sustainable agriculture.",
              jobsSupported: 32,
              farmVisit: "Green Door Gourmet welcomes visitors Thursday through Sunday, 9am-5pm. You can take a self-guided tour, participate in U-pick events (seasonal), or shop at their on-farm market.",
              practices: [
                { name: "Non-GMO", icon: "N", description: "Preserves heirloom varieties with no genetic modification" },
                { name: "Sustainable Watering", icon: "W", description: "Drip irrigation systems reduce water usage by 60%" },
                { name: "Pesticide-Free", icon: "P", description: "Uses natural pest management techniques instead of synthetic chemicals" },
                { name: "Soil Stewardship", icon: "S", description: "Builds healthy soil through cover cropping and composting" }
              ]
            },
            {
              name: "Artisanal sourdough bread",
              farm: "Dozen Bakery",
              distance: 3,
              farmSince: 2015,
              market: null,
              organic: false,
              nonGMO: true,
              description: "Our sourdough bread is baked fresh daily by Dozen Bakery, a local Nashville artisan bakery known for their traditional bread-making techniques and commitment to quality ingredients.",
              image: "/images/ingredients/sourdough-bread.jpg",
              peakSeason: "Available year-round",
              harvestMethods: "Baked fresh daily using traditional fermentation techniques with a 15-year-old sourdough starter.",
              nutritionDescription: "Traditional sourdough fermentation increases the bioavailability of nutrients and makes gluten easier to digest for many people.",
              environmentalImpact: "Dozen Bakery sources local organic flour whenever possible, reducing transportation emissions and supporting regional grain farmers.",
              carbonFootprint: {
                local: "0.7 kg CO₂e per loaf",
                conventional: "2.2 kg CO₂e per loaf",
                savings: 68
              },
              nutritionBenefits: [
                { 
                  name: "Digestibility", 
                  description: "Traditional fermentation breaks down gluten and phytic acid for easier digestion", 
                  icon: "D" 
                },
                { 
                  name: "Probiotic", 
                  description: "Contains beneficial bacteria that support gut health", 
                  icon: "P" 
                }
              ],
              practices: [
                { name: "Traditional Methods", icon: "T", description: "24-hour slow fermentation process" },
                { name: "Local Grain", icon: "L", description: "Uses flour from small-scale regional mills" },
                { name: "Zero Waste", icon: "Z", description: "Day-old bread is repurposed or composted" }
              ]
            }
          ],
          nutrition: {
            calories: 215,
            protein: "4g",
            carbs: "28g",
            fat: "10g"
          },
          allergens: ["Gluten"],
          image: "/images/menu/bruschetta.jpg",
          pairings: ["Elderflower Fizz", "Sparkling Botanical Water"]
        }},
        // ...other items remain the same
      ]},
      // ...other categories remain the same
    ],
    Main: [
      { category: "Pasta & Risotto", items: [
        { name: "Artisanal Mushroom Risotto", price: "16.95", tags: ["vegetarian", "gluten-free", "contains-lactose", "seasonal"], isNew: true, detailed: {
          description: "A creamy arborio rice dish featuring locally foraged mushrooms, house-made vegetable stock, and a touch of our plant-based parmesan. Each bite is a celebration of seasonal Tennessee flavors.",
          ingredients: ["Arborio rice", "Seasonal mushrooms", "Vegetable stock", "Plant-based parmesan", "Organic herbs", "Cold-pressed olive oil", "White wine reduction"],
          ingredientSources: [
            {
              name: "Seasonal mushrooms",
              farm: "Possum Creek Mushroom Farm",
              distance: 17,
              farmSince: 2012,
              market: "East Nashville Farmers Market",
              organic: true,
              nonGMO: true,
              season: "Year-round (varieties change by season)",
              latestHarvest: "2023-09-12",
              farmDescription: "Possum Creek specializes in gourmet and medicinal mushrooms grown in controlled indoor environments and on hardwood logs outdoors. Their facility uses cutting-edge technology to create perfect growing conditions while maintaining sustainable practices.",
              farmerName: "Marcus Johnson",
              farmerBio: "Marcus Johnson founded Possum Creek after discovering the fascinating world of mycology in college. With a background in biology and ecology, he applies scientific principles to mushroom cultivation while maintaining a deep respect for natural ecosystems.",
              coordinates: { x: 25, y: 65 },
              description: "These gourmet mushrooms are grown in a controlled environment. They cultivate their mushrooms on sustainable hardwood logs and organic substrates derived from agricultural by-products.",
              image: "/images/ingredients/local-mushrooms.jpg",
              harvestMethods: "Each mushroom variety is harvested at its optimal development stage to ensure perfect texture and flavor. Indoor varieties are available year-round, while outdoor log-grown varieties follow seasonal cycles.",
              storageInfo: "Store in a paper bag in the refrigerator; never wash until ready to use.",
              shelfLife: "5-7 days when properly stored",
              freshnessTips: "Look for firm caps with vibrant color. Avoid slimy or dried-out specimens.",
              nutritionDescription: "Fresh, local mushrooms retain more nutrients than commercially-grown varieties that may sit in distribution chains for days. They're rich in B vitamins, selenium, copper, and contain immune-supporting beta-glucans.",
              nutritionComparison: {
                "Beta-glucans": { local: 32, conventional: 18, max: 35 },
                "B Vitamins": { local: 28, conventional: 15, max: 30 },
                "Selenium": { local: 26, conventional: 12, max: 30 },
                "Protein": { local: 22, conventional: 20, max: 25 }
              },
              nutritionBenefits: [
                { 
                  name: "Immune Support", 
                  description: "Beta-glucans in mushrooms help regulate the immune system", 
                  icon: "I" 
                },
                { 
                  name: "Vitamin D", 
                  description: "One of the few plant sources of vitamin D when exposed to light", 
                  icon: "D" 
                }
              ],
              seasonalData: [
                { month: "Jan", availability: 60 },
                { month: "Feb", availability: 60 },
                { month: "Mar", availability: 70 },
                { month: "Apr", availability: 85 },
                { month: "May", availability: 90 },
                { month: "Jun", availability: 75 },
                { month: "Jul", availability: 60 },
                { month: "Aug", availability: 60 },
                { month: "Sep", availability: 85 },
                { month: "Oct", availability: 100 },
                { month: "Nov", availability: 95 },
                { month: "Dec", availability: 70 }
              ],
              environmentalImpact: "Mushroom cultivation is incredibly sustainable, requiring minimal water and space while capable of converting agricultural waste into nutrient-dense food. Possum Creek operates a near zero-waste facility.",
              carbonFootprint: {
                local: "0.3 kg CO₂e per pound",
                conventional: "2.8 kg CO₂e per pound",
                savings: 89
              },
              communityImpact: "Possum Creek offers monthly workshops on mycology, medicinal mushrooms, and sustainable growing techniques for home gardeners and aspiring farmers.",
              jobsSupported: 8,
              farmVisit: "Possum Creek offers guided tours of their indoor growing facilities on the first Saturday of each month. Advance booking required through their website.",
              practices: [
                { name: "Sustainable Growing", icon: "S", description: "Uses agricultural by-products as growing substrate" },
                { name: "Zero Waste", icon: "Z", description: "Spent substrate becomes compost for local gardens" },
                { name: "Organic Certified", icon: "O", description: "USDA certified organic growing methods" },
                { name: "Energy Efficient", icon: "E", description: "Growing facilities powered by solar energy" }
              ]
            },
            {
              name: "Organic herbs",
              farm: "Bloomsbury Farm",
              distance: 25,
              farmSince: 2009,
              market: "12 South Farmers Market",
              organic: true,
              nonGMO: true,
              season: "March through October",
              latestHarvest: "2023-09-10",
              description: "Our herbs come from Bloomsbury Farm, a certified organic farm in Smyrna, TN. Their herbs are grown without pesticides and harvested by hand to ensure the highest quality and flavor.",
              image: "/images/ingredients/organic-herbs.jpg",
              freshnessTips: "Fresh herbs should have vibrant color and aroma, with no wilting or browning.",
              environmentalImpact: "Bloomsbury Farm's herb gardens support native pollinators and beneficial insects, creating habitat for biodiversity.",
              practices: [
                { name: "Organic Certified", icon: "O", description: "USDA certified organic growing methods" },
                { name: "Sustainable Farming", icon: "S", description: "Employs companion planting and integrated pest management" },
                { name: "Hand Harvested", icon: "H", description: "Carefully harvested by hand for minimal damage" }
              ]
            }
          ],
          nutrition: {
            calories: 320,
            protein: "8g",
            carbs: "45g",
            fat: "12g"
          },
          allergens: ["Lactose"],
          image: "/images/menu/mushroom-risotto.jpg",
          pairings: ["Beetroot & Ginger Infusion", "Chilled Almond Horchata"]
        }}
        // ...other items remain the same
      ]},
      // ...other categories remain the same
    ],
    // ...other menu sections remain the same
  };
  
  // Merge the source info into the main menus object
  function mergeSourceInfo() {
    // For Bruschetta
    if (menus.Appetizers && 
        menus.Appetizers[0].items && 
        menus.Appetizers[0].items[0] && 
        menus.Appetizers[0].items[0].name === "Bruschetta with Heirloom Tomatoes") {
      menus.Appetizers[0].items[0].detailed.ingredientSources = 
        menuWithSourceInfo.Appetizers[0].items[0].detailed.ingredientSources;
    }
    
    // For Mushroom Risotto
    if (menus.Main && 
        menus.Main[0].items && 
        menus.Main[0].items[0] && 
        menus.Main[0].items[0].name === "Artisanal Mushroom Risotto") {
      menus.Main[0].items[0].detailed = {
        ...menus.Main[0].items[0].detailed,
        ingredientSources: menuWithSourceInfo.Main[0].items[0].detailed.ingredientSources,
        ingredients: menuWithSourceInfo.Main[0].items[0].detailed.ingredients,
        description: menuWithSourceInfo.Main[0].items[0].detailed.description
      };
    }
  }
  
  onMount(() => {
    // ...existing onMount code...
    
    // Add the source information
    mergeSourceInfo();
  });
</script>

<svelte:window on:scroll={handleScroll} on:resize={handleResize}/>

<NavBar active="menu" />

<main>
  <section id="menu-categories">
    <div class="section-header">
      <h2 class="title-font">Our Seasonal Menu</h2>
      <p class="subtitle">Featuring locally-sourced produce and sustainable ingredients</p>
      <div class="decorative-element">
        <span class="line"></span>
        <span class="icon">✧</span>
        <span class="line"></span>
      </div>
    </div>
    
    <div class="menu-category-cards {activeCard ? 'with-active-card' : ''}" bind:this={menuCategoryCardsElement}>
      {#each cards as card, i (card.id)}
        <div 
          class="card {getCardClass(card)}"
          data-id={card.id}
          on:click={(event) => handleCardClick(event, card)}
          in:fly={{ y: 50, duration: 800, delay: i * 100 }}
          style={activeCard ? '' : `transform: translate3d(-50%, -50%, 0) rotateZ(${getRotation(i)}deg)`}
        >
          <div class="title">
            <h3>{card.title}</h3>
          </div>
          <div class="text">
            <p>{card.text}</p>
          </div>
          <div class="click-me">View menu</div>
        </div>
      {/each}
    </div>
    
    {#if activeCard}
      <div class="scroll-down-elegant" bind:this={scrollDownElement}>
        <span class="arrow-elegant"></span>
        <span class="hint-elegant">View Selections</span>
      </div>
    {/if}
  </section>

  {#if activeCard}
    <div class="menu-container" in:fade={{ duration: 400, delay: 300 }} out:fade={{ duration: 200 }}>
      <div class="menu-text" bind:this={menuElement}>
        <div class="menu-header">
          <div class="menu-header-content">
            <h2>{activeCard.title || 'Menu'}</h2>
            <div class="menu-divider">
              <span class="divider-line"></span>
              <span class="divider-icon">✧</span>
              <span class="divider-line"></span>
            </div>
          </div>
          <button class="close-button" on:click={closeCard}>
            <span class="close-icon">×</span>
            <span class="close-text">Close</span>
          </button>
        </div>
        
        <div class="dietary-filters">
  <div class="filter-header">
    <h3 class="filter-section-title">Customize Your Menu</h3>
    <p class="filter-description">Select your preferences to personalize our offerings</p>
    
    {#if $activeFilters.dietary.size > 0 && !($activeFilters.dietary.size === 1 && $activeFilters.dietary.has('all')) || 
        $activeFilters.features.size > 0 || 
        $activeFilters.allergens.size > 0 ||
        $activeFilters.price !== null}
      <div class="filter-summary">
        <div class="active-filters">
          <div class="count-badge">
            <span class="count">{filteredItemsCount}</span> of {totalItemsCount} items shown
          </div>
          
          <div class="applied-filters">
            {#if !$activeFilters.dietary.has('all')}
              {#each Array.from($activeFilters.dietary) as diet}
                {#if !(diet === 'vegetarian' && $activeFilters.dietary.has('vegan'))}
                  <span class="filter-tag diet {diet}">
                    {diet === 'vegan' ? 'Vegan' : diet === 'vegetarian' ? 'Vegetarian' : diet}
                    <button on:click={() => toggleFilter('dietary', diet)} aria-label={`Remove ${diet} filter`}>×</button>
                  </span>
                {/if}
              {/each}
            {/if}
            
            {#each Array.from($activeFilters.features) as feature}
              <span class="filter-tag feature">
                {feature === 'high-protein' ? 'High Protein' : 
                  feature === 'gluten-free' ? 'Gluten-Free' : 
                  feature.charAt(0).toUpperCase() + feature.slice(1)}
                <button on:click={() => toggleFilter('features', feature)} aria-label={`Remove ${feature} filter`}>×</button>
              </span>
            {/each}
            
            {#each Array.from($activeFilters.allergens) as allergen}
              <span class="filter-tag allergen">
                No {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                <button on:click={() => toggleFilter('allergens', allergen)} aria-label={`Remove ${allergen} filter`}>×</button>
              </span>
            {/each}
            
            {#if $activeFilters.price}
              <span class="filter-tag price">
                {$activeFilters.price === 'under10' ? 'Under $10' : 
                  $activeFilters.price === '10to15' ? '$10-$15' : 'Over $15'}
                <button on:click={() => toggleFilter('price', $activeFilters.price)} aria-label="Remove price filter">×</button>
              </span>
            {/if}
          </div>
        </div>
        
        <button class="reset-filters" on:click={clearAllFilters}>
          <span class="reset-icon">↺</span>
          <span>Reset All</span>
        </button>
      </div>
    {/if}
  </div>
  
  <!-- Enhanced tab UI with more elegant styling -->
  <div class="filter-tabs">
  <div class="tab-buttons">
    <button 
      class="tab-button {activeTab === 'diet' ? 'active' : ''}" 
      on:click={() => activeTab = 'diet'}>
      <span class="tab-icon diet-icon">D</span>
      Dietary
    </button>
    <button 
      class="tab-button {activeTab === 'features' ? 'active' : ''}" 
      on:click={() => activeTab = 'features'}>
      <span class="tab-icon feature-icon">F</span>
      Features
    </button>
    <button 
      class="tab-button {activeTab === 'allergens' ? 'active' : ''}" 
      on:click={() => activeTab = 'allergens'}>
      <span class="tab-icon allergen-icon">A</span>
      Allergens
    </button>
    <button 
      class="tab-button {activeTab === 'price' ? 'active' : ''}" 
      on:click={() => activeTab = 'price'}>
      <span class="tab-icon price-icon">$</span>
      Price
    </button>
  </div>

  <div class="tab-content">
    <!-- Diet tab with improved visualization -->
    {#if activeTab === 'diet'}
      <div class="filter-group diet-options" transition:fade={{ duration: 150 }}>
        <div class="dietary-info">
          {#if $activeFilters.dietary.has('vegan')}
            <div class="info-bubble">
              <span class="info-icon">i</span>
              <span>When selecting Vegan, Vegetarian is automatically included as all vegan dishes are vegetarian</span>
            </div>
          {/if}
        </div>
        <div class="filter-buttons">
          <button 
            class="filter-option-button {isFilterActive('dietary', 'all') ? 'active' : ''}" 
            on:click={() => toggleFilter('dietary', 'all')}
            aria-pressed={isFilterActive('dietary', 'all')}>
            <span class="check-icon">✓</span>
            <span>All Diets</span>
          </button>
          <button 
            class="filter-option-button vegan {isFilterActive('dietary', 'vegan') ? 'active' : ''}" 
            on:click={() => toggleFilter('dietary', 'vegan')}
            aria-pressed={isFilterActive('dietary', 'vegan')}>
            <span class="check-icon vegan-icon">V</span>
            <span>Vegan</span>
          </button>
          <button 
            class="filter-option-button vegetarian {isFilterActive('dietary', 'vegetarian') ? 'active' : ''} {isFilterActive('dietary', 'vegan') ? 'implicit' : ''}" 
            on:click={() => toggleFilter('dietary', 'vegetarian')}
            aria-pressed={isFilterActive('dietary', 'vegetarian')}>
            <span class="check-icon vegetarian-icon">VG</span>
            <span>Vegetarian</span>
            {#if isFilterActive('dietary', 'vegan') && isFilterActive('dietary', 'vegetarian')}
              <span class="auto-selected-badge">Auto</span>
            {/if}
          </button>
        </div>
      </div>
    {/if}

    <!-- Features tab with toggle switches -->
    {#if activeTab === 'features'}
      <div class="filter-group feature-options" transition:fade={{ duration: 150 }}>
        <div class="feature-checkbox-group">
          <label class="feature-toggle">
            <input 
              type="checkbox" 
              checked={isFilterActive('features', 'seasonal')}
              on:change={() => toggleFilter('features', 'seasonal')}
            />
            <span class="toggle-slider"></span>
            <span class="toggle-text">Seasonal</span>
            <span class="feature-icon seasonal-icon">S</span>
          </label>
          
          <label class="feature-toggle">
            <input 
              type="checkbox" 
              checked={isFilterActive('features', 'raw')}
              on:change={() => toggleFilter('features', 'raw')}
            />
            <span class="toggle-slider"></span>
            <span class="toggle-text">Raw Food</span>
            <span class="feature-icon raw-icon">R</span>
          </label>
          
          <label class="feature-toggle">
            <input 
              type="checkbox" 
              checked={isFilterActive('features', 'high-protein')}
              on:change={() => toggleFilter('features', 'high-protein')}
            />
            <span class="toggle-slider"></span>
            <span class="toggle-text">High Protein</span>
            <span class="feature-icon protein-icon">P</span>
          </label>
          
          <label class="feature-toggle">
            <input 
              type="checkbox" 
              checked={isFilterActive('features', 'gluten-free')}
              on:change={() => toggleFilter('features', 'gluten-free')}
            />
            <span class="toggle-slider"></span>
            <span class="toggle-text">Gluten-Free</span>
            <span class="feature-icon gf-icon">GF</span>
          </label>
        </div>
      </div>
    {/if}

    <!-- Allergens tab with toggles -->
    {#if activeTab === 'allergens'}
      <div class="filter-group allergen-options" transition:fade={{ duration: 150 }}>
        <div class="allergen-checkbox-group">
          <label class="allergen-toggle">
            <input 
              type="checkbox" 
              checked={isFilterActive('allergens', 'gluten')}
              on:change={() => toggleFilter('allergens', 'gluten')}
            />
            <span class="toggle-slider"></span>
            <span class="toggle-text">Exclude Gluten</span>
            <span class="allergen-icon gluten-icon">G</span>
          </label>
          
          <label class="allergen-toggle">
            <input 
              type="checkbox" 
              checked={isFilterActive('allergens', 'lactose')}
              on:change={() => toggleFilter('allergens', 'lactose')}
            />
            <span class="toggle-slider"></span>
            <span class="toggle-text">Exclude Lactose</span>
            <span class="allergen-icon lactose-icon">L</span>
          </label>
          
          <label class="allergen-toggle">
            <input 
              type="checkbox" 
              checked={isFilterActive('allergens', 'nuts')}
              on:change={() => toggleFilter('allergens', 'nuts')}
            />
            <span class="toggle-slider"></span>
            <span class="toggle-text">Exclude Nuts</span>
            <span class="allergen-icon nuts-icon">N</span>
          </label>
        </div>
      </div>
    {/if}

    <!-- Price tab with radio buttons -->
    {#if activeTab === 'price'}
      <div class="filter-group price-options" transition:fade={{ duration: 150 }}>
        <div class="price-radio-group">
          <label class="price-option">
            <input 
              type="radio" 
              name="price-range" 
              value="under10" 
              checked={isFilterActive('price', 'under10')}
              on:change={() => toggleFilter('price', 'under10')}
            />
            <span class="radio-label">Under $10</span>
            <span class="price-tag">$</span>
          </label>
          
          <label class="price-option">
            <input 
              type="radio" 
              name="price-range" 
              value="10to15" 
              checked={isFilterActive('price', '10to15')}
              on:change={() => toggleFilter('price', '10to15')}
            />
            <span class="radio-label">$10 - $15</span>
            <span class="price-tag">$$</span>
          </label>
          
          <label class="price-option">
            <input 
              type="radio" 
              name="price-range" 
              value="over15" 
              checked={isFilterActive('price', 'over15')}
              on:change={() => toggleFilter('price', 'over15')}
            />
            <span class="radio-label">Over $15</span>
            <span class="price-tag">$$$</span>
          </label>
          
          {#if $activeFilters.price}
            <button 
              class="clear-price" 
              on:click={() => toggleFilter('price', $activeFilters.price)}
            >
              <span>Clear price filter</span>
            </button>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

  <div class="dietary-legend">
    <h4 class="legend-title">Key to Symbols</h4>
    <div class="legend-items">
      <div class="legend-item"><span class="diet-symbol vegan">V</span> Vegan</div>
      <div class="legend-item"><span class="diet-symbol vegetarian">VG</span> Vegetarian</div>
      <div class="legend-item"><span class="diet-symbol gluten-free">GF</span> Gluten-Free</div>
      <div class="legend-item"><span class="diet-symbol seasonal">S</span> Seasonal</div>
      <div class="legend-item"><span class="new-tag">NEW</span> New Item</div>
      <div class="legend-item"><span class="diet-symbol spicy"><span class="spicy-text">SP</span></span> Spicy</div>
    </div>
  </div>
</div>

        <div class="menu-content">
          {#if menus[activeCard.title] && Array.isArray(menus[activeCard.title])}
            {#each menus[activeCard.title] as section}
              <div class="menu-section">
                <h3>{section.category || 'Menu Items'}</h3>
                <ul>
                  {#if section.items && Array.isArray(section.items)}
                    {#each filterItems(section.items) as item}
                      <li class="menu-item" on:click={() => showItemDetails(item)} class:has-details={item.detailed}>
                        <div class="item-details">
                          <span class="item-name">{item.name || 'Untitled Item'}</span>
                          <div class="item-tags">
                            {#if item.tags && Array.isArray(item.tags)}
                              {#if item.tags.includes('vegan')}
                                <span class="diet-symbol vegan" title="Vegan">V</span>
                              {:else if item.tags.includes('vegetarian')}
                                <span class="diet-symbol vegetarian" title="Vegetarian">VG</span>
                              {/if}
                              {#if item.tags.includes('gluten-free')}
                                <span class="diet-symbol gluten-free" title="Gluten-Free">GF</span>
                              {/if}
                              {#if item.tags.includes('seasonal')}
                                <span class="diet-symbol seasonal" title="Seasonal">S</span>
                              {/if}
                              {#if item.tags.includes('spicy')}
                                <span class="diet-symbol spicy" title="Spicy"><span class="spicy-text">SP</span></span>
                              {/if}
                            {/if}
                            {#if item.isNew}
                              <span class="new-tag">NEW</span>
                            {/if}
                            {#if item.detailed}
                              <span class="info-tag">INFO</span>
                            {/if}
                          </div>
                        </div>
                        <span class="item-price">${item.price || '0.00'}</span>
                      </li>
                    {/each}
                    
                    {#if !section.items.length || filterItems(section.items).length === 0}
                      <li class="no-items">No items match your dietary preferences</li>
                    {/if}
                  {:else}
                    <li class="no-items">No items available in this section</li>
                  {/if}
                </ul>
              </div>
            {/each}
          {:else}
            <div class="menu-error">
              <p>Sorry, the menu for "{activeCard.title}" is currently unavailable.</p>
              <p>Please try another category or check back later.</p>
            </div>
          {/if}
        </div>
        
        {#if activeCard.title && ['Main', 'Mains', 'main'].includes(activeCard.title)}
          <div class="beverage-pairings">
            <h2 class="special-heading">Beverage Pairing Suggestions</h2>
            <p class="special-tagline">Handcrafted non-alcoholic options to enhance your dining experience</p>
            
            <div class="beverage-list">
              {#each beveragePairings as beverage}
                <div class="beverage-item">
                  <div class="beverage-details">
                    <h3>{beverage.name}</h3>
                    <span class="beverage-origin">{beverage.origin}</span>
                    <p>{beverage.detailed?.description || "A perfect complement to our main courses."}</p>
                  </div>
                  <div class="beverage-pricing">
                    <div class="beverage-price">${beverage.price}</div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
        <div class="allergen-information">
          <h3>Allergen Information</h3>
          <p>We are committed to accommodating all dietary requirements. Please inform your server of any allergies or restrictions.</p>
          
          <div class="allergen-grid">
            {#each allergens as allergen}
              <div class="allergen-item">
                <span class="allergen-code">{allergen.code}</span>
                <span class="allergen-name">{allergen.name}</span>
              </div>
            {/each}
          </div>
        </div>
        
        <div class="menu-footer">
          <p class="allergens-note">Please inform your server of any allergies or dietary requirements</p>
          <p class="source-note">Our ingredients are sourced from local Tennessee farms and sustainable suppliers</p>
          
          <div class="reservation-info">
            <p>For reservations, call <a href="tel:+16151234567">(615) 123-4567</a> or book online at <a href="https://verdantia-nashville.com/reservations">verdantia-nashville.com</a></p>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if selectedMenuItem}
    <MenuItemModal 
      item={selectedMenuItem} 
      onClose={closeItemDetails} 
      onPairingClick={(pairingName) => {
        console.log("Drink clicked:", pairingName);
        const pairedItem = findMenuItemByName(pairingName);
        console.log("Found pairing:", pairedItem);
        
        if (pairedItem) {
          const currentItem = selectedMenuItem;
          selectedMenuItem = null;
          
          setTimeout(() => {
            console.log("Opening new modal for:", pairingName);
            selectedMenuItem = pairedItem;
          }, 300);
        } else {
          console.warn("Pairing item not found:", pairingName);
        }
      }}
    />
  {/if}

  <section id="philosophy">
    <div class="philosophy-container">
      <div class="philosophy-text">
        <h2>Our Preparation Methods</h2>
        <p>In our kitchen, we combine traditional cooking techniques with modern preparation methods. Each dish is prepared with the utmost care to preserve the authentic flavors and nutrients of the ingredients.</p>
        <p>From slow cooking methods to gentle steam preparation - we focus on techniques that highlight the natural taste of ingredients while preserving their valuable nutrients.</p>
      </div>
      <div class="philosophy-highlights">
        <div class="highlight">
          <h3>Gentle Cooking Processes</h3>
          <p>We use low-temperature and steam cooking methods to optimally preserve flavors and nutrients, perfecting the texture of each ingredient.</p>
        </div>
        <div class="highlight">
          <h3>Homemade Foundations</h3>
          <p>From vegetable stocks to fermented products - we create all the foundations of our dishes ourselves for maximum control over flavor and quality.</p>
        </div>
        <div class="highlight">
          <h3>Experimental Techniques</h3>
          <p>With modern methods like fermentation, dehydration, and molecular gastronomy, we expand the possibilities of plant-based ingredients for intense flavor experiences.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="testimonials">
    <div class="testimonials-container">
      <h2>What Our Guests Say</h2>
      <div class="testimonials-grid">
        <div class="testimonial">
          <div class="quote">"I never knew vegan food could be this flavorful. The attention to detail and creative combinations have completely changed my perspective on plant-based dining."</div>
          <div class="author">— Emma S., Food Blogger</div>
        </div>
        <div class="testimonial">
          <div class="quote">"As someone with dietary restrictions, finding a restaurant that takes plant-based cooking seriously is refreshing. Every dish tells a story of thoughtfulness and innovation."</div>
          <div class="author">— Michael T., Longtime Customer</div>
        </div>
        <div class="testimonial">
          <div class="quote">"The seasonal menu keeps me coming back to discover new flavors. Their commitment to freshness is evident in every bite - you can truly taste the difference."</div>
          <div class="author">— Sarah L., Culinary Enthusiast</div>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</main>

<!-- Accessibility announcement element for screen readers -->
<div id="filter-announcement" class="sr-only" role="status" aria-live="polite"></div>

<style lang="scss">
  @use "../../lib/styles/variables" as v;
  @use "../../lib/styles/global" as g;

  h1, h2, h3, h4, .title-font, .special-heading, .filter-section-title, .menu-header h2 {
    font-family: "DynaPuff Regular", cursive;
  }
  
  p, a, span, button, .subtitle, li, .item-name, .item-price, .filter-chip,
  .beverage-origin, .allergen-name, .allergen-code, .click-me, .hint-elegant {
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  main {
    width: 100%;
    overflow-x: hidden;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 60px;
    
    h2 {
      font-size: 3rem;
      font-weight: 500;
      color: v.$tertiary-dark;
      margin-bottom: 10px;
      letter-spacing: 1px;
    }
  }
  
  .title-font {
    font-family: "DynaPuff Regular", cursive;
    text-transform: none;
    position: relative;
    display: inline-block;
  }

  .subtitle {
    font-size: 1.2rem;
    color: v.$tertiary;
    font-weight: 300;
    margin-top: 0.5rem;
    font-style: italic;
  }
  
  .decorative-element {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto;
    max-width: 300px;
    
    .line {
      height: 1px;
      background-color: v.$tertiary;
      flex-grow: 1;
      opacity: 0.6;
    }
    
    .icon {
      font-size: 1rem;
      color: v.$primary;
      margin: 0 15px;
    }
  }

  section#menu-categories {
    padding: 80px 0;
    background-color: v.$background-color-light;
    position: relative;
    overflow: visible;
    z-index: 1;
  }

  .menu-category-cards {
    position: relative;
    height: 80vw;
    transition: height 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    margin-bottom: 0;
    overflow: visible;
    min-height: 0;
    will-change: height;
    box-sizing: border-box !important;
  }
  
  .card {
    background-color: #fff;
    cursor: pointer;
    padding: 38px;
    box-sizing: border-box;
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    transform-origin: center center;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), 
                opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                width 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                height 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                box-shadow 0.4s ease;
    border-left: 6px solid transparent;
    border-radius: 6px;
    width: 60vw;
    height: calc(60vw * 2/3);
    position: absolute;
    
    &:hover {
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
      transform: translate3d(-50%, -55%, 0) rotateZ(0.5deg) !important;
      transition: all 0.3s ease;
      
      .click-me {
        background-color: v.$primary;
        transform: scale(1.05);
      }
    }
    
    .title {
      width: 40%;
      
      h3 {
        font-size: clamp(2.5rem, 5vw, 4rem);
        letter-spacing: 0.5px;
      }
    }
    
    .text {
      width: 55%;
      
      p {
        font-weight: 300;
        font-size: clamp(1rem, 1.2vw, 1.25rem);
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        transition: all 650ms ease;
        color: transparent;
        backdrop-filter: blur(4px);
        line-height: 1.7;
      }
    }
    
    &.active .text p {
      text-shadow: none;
      color: v.$font-color-dark;
      backdrop-filter: none;
    }

    &.fly-out.left {
      transform: translateX(-150vw) !important;
      opacity: 0;
      pointer-events: none;
    }
    
    &.fly-out.right {
      transform: translateX(150vw) !important;
      opacity: 0;
      pointer-events: none;
    }

    &.active {
      z-index: 10;
      left: 50% !important;
      top: 50% !important;
      transform: translate3d(-50%, -50%, 0) rotateZ(0deg) !important;
      width: 60vw;
      min-height: 40vw;
      max-width: 1200px;
    }
  }
  
  .click-me {
    position: absolute;
    top: 28px;
    right: 28px;
    background-color: rgba(v.$primary, 0.85);
    color: white;
    padding: 10px 16px;
    border-radius: 30px;
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(252, 98, 52, 0.3);
    transition: all 0.3s ease;
    
    &::after {
      content: "→";
      margin-left: 8px;
      font-size: 1.1em;
    }
  }

  .menu-category-cards .card:nth-child(1) {
    left: 33%;
    top: 25vw;
    z-index: 4;
  }
  
  .menu-category-cards .card:nth-child(2) {
    left: 67%;
    top: 35vw;
    z-index: 3;
  }
  
  .menu-category-cards .card:nth-child(3) {
    left: 33%;
    top: 45vw;
    z-index: 2;
  }
  
  .menu-category-cards .card:nth-child(4) {
    left: 67%;
    top: 55vw;
    z-index: 1;
  }

  .scroll-down-elegant {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    transition: all 0.3s ease-out;
    
    .arrow-elegant {
      display: block;
      width: 20px;
      height: 20px;
      border-left: 2px solid v.$tertiary;
      border-bottom: 2px solid v.$tertiary;
      transform: rotate(-45deg);
      animation: bounce 2s infinite;
      margin-bottom: 12px;
      filter: drop-shadow(0 2px 3px rgba(2, 92, 72, 0.1));
    }
    
    .hint-elegant {
      font-size: 0.9rem;
      color: v.$tertiary-dark;
      font-weight: 500;
      letter-spacing: 0.5px;
      font-style: italic;
    }
  }

  .menu-container {
    position: relative;
    z-index: 5;
    background: linear-gradient(180deg, rgba(228, 219, 210, 0) 0%, rgba(228, 219, 210, 0.8) 15%);
    padding: 60px 0;
    margin-top: -20px;
    margin-bottom: -80px;
  }

  .menu-text {
    background: white;
    margin: 0 auto;
    width: 85%;
    max-width: 1200px;
    padding: 45px;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border: none;
    position: relative;
    
    &::before {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      border: 1px solid rgba(v.$tertiary, 0.15);
      border-radius: 8px;
      pointer-events: none;
    }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: rotate(-45deg) translateY(0);
    }
    40% {
      transform: rotate(-45deg) translateY(-10px);
    }
    60% {
      transform: rotate(-45deg) translateY(-5px);
    }
  }
  
  @media screen and (max-width: 1200px) {
    .card .title h3 {
      font-size: clamp(2rem, 4vw, 3.5rem);
    }
    
    .card .text p {
      font-size: clamp(0.9rem, 1vw, 1.1rem);
    }
  }

  @media screen and (max-width: 900px) {
    .card {
      padding: 30px;
    }
    
    .click-me {
      top: 20px;
      right: 20px;
      padding: 8px 14px;
      font-size: 0.9rem;
    }
  }

  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 35px;
    
    &-content {
      text-align: center;
    }
    
    h2 {
      font-size: 2.8rem;
      margin: 0;
      font-weight: 400;
      color: v.$tertiary-dark;
      letter-spacing: 1px;
    }
  }
  
  .menu-divider {
    display: flex;
    align-items: center;
    margin: 15px 0;
    
    .divider-line {
      flex-grow: 1;
      height: 1px;
      background-color: #e9decf;
    }
    
    .divider-icon {
      margin: 0 15px;
      color: v.$primary;
      font-size: 0.9rem;
    }
  }

  .close-button {
    background: none;
    border: 1px solid #e9decf;
    font-size: 1rem;
    cursor: pointer;
    padding: 10px 18px;
    border-radius: 5px;
    transition: all 0.3s ease;
    color: v.$tertiary-dark;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    
    &:hover {
      background: #f9f6f3;
      border-color: #e0d4c5;
    }
    
    .close-icon {
      font-size: 1.3rem;
      line-height: 1;
    }
  }

  .dietary-filters {
    background: linear-gradient(to right, #f9f6f3 0%, #ffffff 100%);
    border-radius: 12px;
    padding: 30px;
    margin: 35px 0 45px;
    border-left: 4px solid v.$tertiary-light;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  }
  
  .filter-header {
    margin-bottom: 25px;
  }

  .filter-section-title {
    color: v.$tertiary-dark;
    font-size: 1.5rem;
    margin: 0 0 10px;
    font-weight: 400;
    letter-spacing: 0.3px;
  }
  
  .filter-description {
    color: #666;
    font-size: 1rem;
    font-style: italic;
    margin: 0;
    line-height: 1.5;
  }

  .filter-group {
    margin-bottom: 22px;
    
    &-title {
      font-size: 1.05rem;
      color: v.$tertiary;
      margin: 0 0 12px;
      font-family: "Inter 24pt Regular", sans-serif;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
  }

  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
  }

  .filter-chip {
    background: white;
    border: 1px solid #e9decf;
    border-radius: 50px;
    padding: 8px 16px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #555;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
    }
    
    &.active {
      background: v.$tertiary-light;
      border-color: v.$tertiary;
      color: white;
      font-weight: 500;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      
      &.vegan {
        background: #4CAF50;
        border-color: #3d8b40;
      }
      
      &.vegetarian {
        background: #FF9800;
        border-color: #d17d00;
      }
      
      &.allergen {
        background: #E91E63;
        border-color: darken(#E91E63, 10%);
      }
      
      &.price {
        background: #673AB7;
        border-color: darken(#673AB7, 10%);
      }
      
      .filter-icon {
        color: white;
      }
    }
    
    .filter-icon {
      font-size: 0.8rem;
      color: #aaa;
    }
  }

  .dietary-legend {
    background-color: white;
    padding: 18px 22px;
    border-radius: 8px;
    border: 1px solid #e9decf;
    margin-top: 25px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    
    .legend-title {
      font-size: 1rem;
      color: v.$tertiary;
      margin: 0 0 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    
    .legend-items {
      display: flex;
      flex-wrap: wrap;
      gap: 22px;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9rem;
        color: #444;
      }
    }
  }
  
  .diet-symbol {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 3px;
    font-size: 0.65rem;
    font-weight: 600;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid currentColor;
    
    &.vegan { 
      color: #4CAF50; 
    }
    &.vegetarian { 
      color: #FF9800; 
      width: 24px;
      border-radius: 4px;
    }
    &.gluten-free { 
      color: #8D6E63; 
      width: 24px;
      border-radius: 4px;
    }
    &.seasonal { 
      color: #FF5722; 
    }
    &.spicy { 
      color: #F44336; 
      display: flex;
      align-items: center;
      justify-content: center;
      
      .spicy-text {
        font-size: 0.6rem;
      }
    }
  }

  .new-tag {
    background-color: v.$primary;
    color: white;
    font-size: 0.65rem;
    padding: 3px 6px;
    border-radius: 3px;
    font-weight: bold;
    letter-spacing: 0.5px;
    margin-left: 6px;
  }

  .menu-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 40px;
    margin-bottom: 35px;
  }

  .menu-section {
    margin-bottom: 25px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    h3 {
      font-size: 1.6rem;
      margin-bottom: 18px;
      padding-bottom: 10px;
      font-weight: 400;
      color: v.$tertiary;
      position: relative;
      
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 60px;
        height: 2px;
        background-color: #e9decf;
      }
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  }

  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 14px 8px;
    border-bottom: 1px dotted #f0e6da;
    transition: all 0.2s ease;
    cursor: pointer;
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(249, 246, 243, 0.9);
      transform: translateY(-2px);
    }
    
    &:last-child {
      border-bottom: none;
    }

    &.has-details {
      position: relative;
      
      &::after {
        content: "i";
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 14px;
        right: -25px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: #e0d4c5;
        color: v.$tertiary-dark;
        font-size: 0.7rem;
        font-style: italic;
        font-weight: bold;
        opacity: 0.7;
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
      
      &:hover::after {
        opacity: 1;
        transform: scale(1.1);
      }
    }
  }
  
  .item-details {
    flex: 1;
    padding-right: 15px;
  }
  
  .item-name {
    font-weight: 500;
    font-size: 1.05rem;
    color: #333;
    display: block;
    margin-bottom: 4px;
  }
  
  .item-tags {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }
  
  .item-price {
    font-weight: 600;
    color: #333;
    font-size: 1.05rem;
    white-space: nowrap;
    margin-top: 2px;
  }
  
  .no-items {
    padding: 25px 15px;
    text-align: center;
    color: #999;
    font-style: italic;
    background-color: #f9f6f3;
    border-radius: 6px;
    margin: 15px 0;
  }

  .info-tag {
    background-color: #e0d4c5;
    color: v.$tertiary-dark;
    font-size: 0.65rem;
    padding: 2px 5px;
    border-radius: 3px;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .beverage-pairings {
    margin: 40px 0;
    padding: 30px;
    background-color: rgba(v.$tertiary-light, 0.04);
    border-radius: 8px;
    border-top: 1px solid #e9decf;
  }
  
  .beverage-list {
    display: grid;
    gap: 20px;
    margin-top: 25px;
  }
  
  .beverage-item {
    display: flex;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    border-left: 3px solid v.$secondary;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
    
    &:hover {
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }
  }
  
  .beverage-details {
    flex: 1;
    
    h3 {
      font-size: 1.3rem;
      margin-bottom: 4px;
      color: v.$secondary;
    }
    
    .beverage-origin {
      display: block;
      font-style: italic;
      font-size: 0.9rem;
      color: #777;
      margin-bottom: 10px;
    }
    
    p {
      line-height: 1.5;
      color: #555;
      font-size: 0.95rem;
    }
  }
  
  .beverage-pricing {
    min-width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .beverage-price {
    text-align: right;
    font-size: 1.3rem;
    font-weight: 500;
    color: v.$tertiary;
  }

  .allergen-information {
    margin: 30px 0;
    
    h3 {
      font-size: 1.4rem;
      margin-bottom: 15px;
      color: v.$tertiary-dark;
    }
    
    p {
      margin-bottom: 15px;
      color: #555;
      line-height: 1.5;
    }
  }

  .allergen-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 20px;
  }
  
  .allergen-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .allergen-code {
    background-color: #e9decf;
    color: #6D4C41;
    font-weight: 600;
    font-size: 0.7rem;
    padding: 3px 6px;
    border-radius: 4px;
  }
  
  .allergen-name {
    font-size: 0.85rem;
  }

  .menu-footer {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #e9decf;
    margin-top: 30px;
    
    p {
      margin-bottom: 10px;
      font-size: 0.9rem;
      color: #777;
    }
    
    .reservation-info {
      margin-top: 20px;
      font-size: 0.95rem;
      
      a {
        color: v.$primary;
        text-decoration: none;
        border-bottom: 1px dotted;
        
        &:hover {
          color: darken(v.$primary, 10%);
        }
      }
    }
  }

  section#philosophy {
    padding: 100px 20px;
    background-color: v.$background-color-light;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .philosophy-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .philosophy-text {
    max-width: 800px;
    margin: 0 auto 60px;
    text-align: center;
    
    h2 {
      font-size: 2.5rem;
      margin-bottom: 30px;
      font-weight: 300;
      color: v.$tertiary-dark;
    }
    
    p {
      font-size: 1.2rem;
      line-height: 1.7;
      margin-bottom: 20px;
      color: v.$font-color-dark;
    }
  }

  .philosophy-highlights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }

  .highlight {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
    border-top: 4px solid v.$tertiary;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
    
    h3 {
      font-size: 1.5rem;
      margin-bottom: 15px;
      color: v.$tertiary-dark;
      font-weight: 400;
    }
    
    p {
      font-size: 1.1rem;
      line-height: 1.5;
      color: v.$font-color-dark;
    }
  }

  section#testimonials {
    padding: 100px 20px;
    background-color: #f4efe8;
  }

  .testimonials-container {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    
    h2 {
      font-size: 2.5rem;
      margin-bottom: 50px;
      font-weight: 300;
      color: #4a2e2e;
    }
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }

  .testimonial {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: left;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .quote {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 20px;
      font-style: italic;
      color: #333;
      position: relative;
      
      &::before {
        content: "\"";
        font-size: 3rem;
        color: rgba(v.$tertiary-light, 0.2);
        position: absolute;
        top: -25px;
        left: -15px;
        font-family: serif;
      }
    }
    
    .author {
      font-weight: 500;
      color: #4a2e2e;
    }
  }
  
  @media screen and (max-width: 1200px) {
    .menu-text {
      width: 90%;
      padding: 35px;
    }
    
    .testimonial .quote {
      font-size: 1rem;
    }
  }
  
  @media screen and (max-width: 900px) {
    .menu-text {
      padding: 30px;
    }
    
    .menu-content {
      grid-template-columns: 1fr;
      gap: 30px;
    }
    
    .beverage-item {
      flex-direction: column;
      
      .beverage-pricing {
        margin-top: 15px;
        text-align: left;
        justify-content: flex-start;
      }
    }
    
    .special-heading, .philosophy-text h2, .testimonials-container h2 {
      font-size: 2rem;
    }
    
    .filter-chips {
      gap: 8px;
    }
    
    .filter-chip {
      padding: 6px 12px;
      font-size: 0.85rem;
    }
  }
  
  /* Media query for mobile devices */
  @media screen and (max-width: 767px) {
    .menu-category-cards {
      min-height: 300px; /* Reduce minimum height */
      /* Remove smooth transition on mobile for faster response */
      transition: none !important;
    }
    
    /* When active card is present, still use transition but make it much faster */
    .menu-category-cards.with-active-card {
      transition: height 0.2s linear !important;
    }
    
    .card {
      width: 90vw !important;
      height: calc(90vw * 2/3) !important; /* Maintain 2:3 ratio */
      flex-direction: column !important;
      align-items: flex-start;
      position: absolute;
      left: 50% !important;
      pointer-events: auto;
    }
    
    .card .title {
      width: 100% !important;
      margin-bottom: 15px;
      
      h3 {
        font-size: 2rem !important;
      }
    }
    
    .card .text {
      width: 100% !important;
      
      p {
        font-size: 3vw !important;
      }
    }
    
    .menu-category-cards .card:nth-child(1) {
      left: 50% !important;
      z-index: 4;
    }
    
    .menu-category-cards .card:nth-child(2) {
      top: calc((90vw * 2/3) + 100px);
      left: 50% !important;
      z-index: 3;
    }
    
    .menu-category-cards .card:nth-child(3) {
      top: calc((90vw * 2/3 * 2) + 100px);
      left: 50% !important;
      z-index: 2;
    }
    
    .menu-category-cards .card:nth-child(4) {
      top: calc((90vw * 2/3 * 3) + 70px);
      left: 50% !important;
      z-index: 1;
    }
    
    .card.active {
      height: auto !important;
      min-height: 60vw !important;
      top: 0 !important; /* Ensure the card is at the top of container */
      transform: translate3d(-50%, 0, 0) rotateZ(0deg) !important; /* Translate X only, not Y */
      position: relative !important; /* Position relative to container */
    }
    
    .click-me {
      top: 20px;
      right: 20px;
      padding: 8px 14px;
      font-size: 0.9rem;
    }
    
    .filters-container {
      grid-template-columns: 1fr;
      gap: 15px;
    }
    
    .filter-chips {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    .filter-chip {
      justify-content: center;
      width: 100%;
    }
    
    .filter-actions {
      flex-direction: column;
      gap: 10px;
      
      .filter-count {
        width: 100%;
        text-align: center;
      }
      
      .reset-filters {
        width: 100%;
        justify-content: center;
      }
    }
  }

  /* Fix for smaller mobile screens */
  @media screen and (max-width: 600px) {
    .menu-header {
      flex-direction: column;
      gap: 15px;
      
      .menu-header-content {
        width: 100%;
      }
      
      .close-button {
        align-self: flex-end;
      }
      
      h2 {
        font-size: 2rem;
      }
    }
    
    .dietary-filters {
      padding: 20px;
    }
    
    .dietary-legend .legend-items {
      justify-content: center;
      gap: 15px 10px;
    }
    
    .menu-section h3 {
      font-size: 1.4rem;
    }
    
    .item-name, .item-price {
      font-size: 0.95rem;
    }
    
    .allergen-grid {
      justify-content: center;
    }
    
    .philosophy-text p {
      font-size: 1rem;
    }
    
    .highlight {
      padding: 25px 20px;
    }
    
    section#philosophy, section#testimonials {
      padding: 70px 20px;
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  .filter-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px dashed rgba(v.$tertiary-light, 0.2);
  }
  
  .filter-count {
    font-size: 0.9rem;
    color: v.$tertiary;
    background: rgba(v.$tertiary-light, 0.05);
    padding: 5px 12px;
    border-radius: 20px;
    border: 1px solid rgba(v.$tertiary-light, 0.1);
  }
  
  .reset-filters {
    background: none;
    border: none;
    color: v.$primary;
    cursor: pointer;
    font-size: 0.9rem;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s ease;
    
    &:hover {
      color: darken(v.$primary, 10%);
      text-decoration: underline;
    }
    
    .reset-icon {
      font-size: 1.2rem;
      line-height: 1;
    }
  }
  
  /* New styles for improved filter UI */
  .filter-hint {
    font-size: 0.75rem;
    font-weight: normal;
    color: #666;
    font-style: italic;
    margin-left: 8px;
  }
  
  .filter-group-title {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(v.$tertiary-light, 0.1);
    padding-bottom: 8px;
    margin-bottom: 14px;
  }
  
  .filter-chip {
    position: relative;
    overflow: hidden;
    transition: all 0.25s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.1) 50%);
      z-index: 0;
      transition: all 0.3s ease;
      opacity: 0;
    }
    
    &:hover::before {
      opacity: 1;
    }
    
    &.active::before {
      opacity: 1;
      background: linear-gradient(45deg, transparent 50%, rgba(0,0,0,0.1) 50%);
    }
    
    .vegan-icon {
      color: #4CAF50;
    }
    
    .vegetarian-icon {
      color: #FF9800;
    }
  }
  
  .legend-title {
    font-size: 0.9rem;
    color: v.$tertiary;
    margin: 0 0 10px;
    font-family: "Inter 24pt Regular", sans-serif;
    font-weight: 600;
  }
  
  // New filter system styles
  .filter-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 18px;
    background: white;
    border-radius: 8px;
    padding: 12px 18px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(v.$tertiary-light, 0.1);
  }
  
  .active-filters {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }
  
  .count-badge {
    font-size: 0.95rem;
    color: v.$tertiary-dark;
    
    .count {
      font-weight: 700;
      color: v.$primary;
    }
  }
  
  .applied-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }
  
  .filter-tag {
    display: inline-flex;
    align-items: center;
    font-size: 0.85rem;
    padding: 4px 10px;
    border-radius: 50px;
    background: #f6f6f6;
    color: #555;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
    }
    
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      width: 20px;
      height: 20px;
      margin-left: 6px;
      border-radius: 50%;
      font-size: 1.1rem;
      cursor: pointer;
      padding: 0;
      color: #777;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(0,0,0,0.1);
        color: #333;
      }
    }
    
    &.diet {
      background: rgba(76, 175, 80, 0.1);
      color: #2E7D32;
      font-weight: 500;
      
      &.vegan {
        background: rgba(76, 175, 80, 0.15);
        color: #1B5E20;
        border: 1px solid rgba(76, 175, 80, 0.2);
      }
      
      &.vegetarian {
        background: rgba(255, 152, 0, 0.15);
        color: #E65100;
        border: 1px solid rgba(255, 152, 0, 0.2);
      }
      
      button:hover {
        background: rgba(76, 175, 80, 0.2);
      }
    }
    
    &.feature {
      background: rgba(3, 169, 244, 0.1);
      color: #0277BD;
      font-weight: 500;
      
      button:hover {
        background: rgba(3, 169, 244, 0.2);
      }
    }
    
    &.allergen {
      background: rgba(244, 67, 54, 0.1);
      color: #C62828;
      font-weight: 500;
      
      button:hover {
        background: rgba(244, 67, 54, 0.2);
      }
    }
    
    &.price {
      background: rgba(156, 39, 176, 0.1);
      color: #7B1FA2;
      font-weight: 500;
      
      button:hover {
        background: rgba(156, 39, 176, 0.2);
      }
    }
  }
  
  .reset-filters {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(v.$tertiary-light, 0.04);
    border: 1px solid rgba(v.$tertiary-light, 0.15);
    color: v.$tertiary-dark;
    padding: 8px 14px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(v.$tertiary-light, 0.08);
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
    }
    
    .reset-icon {
      font-size: 1.2rem;
    }
  }
  
  .tab-buttons {
    display: flex;
    border-bottom: 1px solid #e0d4c5;
    margin-bottom: 20px;
    gap: 5px;
  }
  
  .tab-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 18px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    font-size: 1rem;
    font-weight: 500;
    color: #777;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    
    .tab-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: rgba(v.$tertiary-light, 0.1);
      border-radius: 50%;
      font-size: 0.8rem;
      font-weight: 600;
      opacity: 0.8;
      transition: all 0.3s ease;
      
      &.diet-icon {
        color: #43A047;
        background: rgba(67, 160, 71, 0.1);
      }
      
      &.feature-icon {
        color: #2196F3;
        background: rgba(33, 150, 243, 0.1);
      }
      
      &.allergen-icon {
        color: #E91E63;
        background: rgba(233, 30, 99, 0.1);
      }
      
      &.price-icon {
        color: #9C27B0;
        background: rgba(156, 39, 176, 0.1);
      }
    }
    
    &:hover {
      color: v.$tertiary;
      
      .tab-icon {
        opacity: 1;
        transform: scale(1.1);
      }
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 50%;
      width: 0;
      height: 3px;
      background-color: v.$primary;
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }
    
    &.active {
      color: v.$tertiary-dark;
      
      .tab-icon {
        opacity: 1;
        
        &.diet-icon {
          background: rgba(67, 160, 71, 0.2);
        }
        
        &.feature-icon {
          background: rgba(33, 150, 243, 0.2);
        }
        
        &.allergen-icon {
          background: rgba(233, 30, 99, 0.2);
        }
        
        &.price-icon {
          background: rgba(156, 39, 176, 0.2);
        }
      }
      
      &::after {
        width: 100%;
      }
    }
  }
  
  .tab-content {
    min-height: 120px;
    position: relative;
    padding: 5px;
  }
  
  .filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .filter-option-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 8px;
    border: 1px solid #e0d4c5;
    background: white;
    font-size: 1.05rem;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    
    .check-icon {
      opacity: 0.4;
      transition: all 0.25s ease;
      font-size: 1.1rem;
    }
    
    &:hover {
      background: #f9f6f3;
      border-color: #d5c7b7;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    
    &.active {
      background: v.$tertiary-light;
      border-color: v.$tertiary;
      color: white;
      box-shadow: 0 4px 10px rgba(v.$tertiary-light, 0.3);
      
      .check-icon {
        opacity: 1;
      }
    }
    
    &.vegan.active {
      background: #43A047;
      border-color: #2E7D32;
      box-shadow: 0 4px 10px rgba(67, 160, 71, 0.3);
    }
    
    &.vegetarian.active {
      background: #F57C00;
      border-color: #E65100;
      box-shadow: 0 4px 10px rgba(245, 124, 0, 0.3);
    }
    
    &.implicit {
      border-style: dashed;
    }
  }
  
  .auto-selected-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 20px;
    letter-spacing: 0.5px;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .dietary-info {
    margin-bottom: 15px;
  }
  
  .info-bubble {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(3, 169, 244, 0.08);
    border: 1px solid rgba(3, 169, 244, 0.2);
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #0277BD;
    margin-bottom: 15px;
    
    .info-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background: rgba(3, 169, 244, 0.15);
      border-radius: 50%;
      font-size: 0.9rem;
      font-weight: 700;
      font-style: italic;
      color: #0277BD;
    }
  }
  
  .feature-checkbox-group, .allergen-checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 18px;
  }
  
  .feature-toggle, .allergen-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #e9decf;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
      border-color: #d5c7b7;
    }
    
    input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      height: 0;
      width: 0;
    }
    
    .toggle-slider {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
      background-color: #e0d4c5;
      border-radius: 24px;
      transition: all 0.3s ease;
      
      &:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        border-radius: 50%;
        transition: all 0.3s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
      }
    }
    
    input:checked + .toggle-slider {
      background-color: v.$tertiary;
    }
    
    input:checked + .toggle-slider:before {
      transform: translateX(20px);
    }
    
    .toggle-text {
      font-size: 1rem;
      color: #333;
      font-weight: 500;
      flex: 1;
    }
    
    .feature-icon, .allergen-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: 600;
      
      &.seasonal-icon {
        background: rgba(255, 87, 34, 0.1);
        color: #FF5722;
      }
      
      &.raw-icon {
        background: rgba(76, 175, 80, 0.1);
        color: #4CAF50;
      }
      
      &.protein-icon {
        background: rgba(0, 150, 136, 0.1);
        color: #00796B;
      }
      
      &.gf-icon {
        background: rgba(121, 85, 72, 0.1);
        color: #795548;
        font-size: 0.65rem;
      }
      
      &.gluten-icon, &.lactose-icon, &.nuts-icon {
        background: rgba(233, 30, 99, 0.1);
        color: #C2185B;
      }
    }
  }
  
  .allergen-toggle input:checked + .toggle-slider {
    background-color: #E91E63;
  }
  
  .price-radio-group {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  
  .price-option {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #e9decf;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
      border-color: #d5c7b7;
    }
    
    input[type="radio"] {
      appearance: none;
      width: 22px;
      height: 22px;
      border: 2px solid #e0d4c5;
      border-radius: 50%;
      outline: none;
      transition: all 0.3s ease;
      
      &:checked {
        border-color: v.$tertiary;
        background: white;
        box-shadow: inset 0 0 0 6px v.$tertiary;
      }
    }
    
    .radio-label {
      font-size: 1rem;
      color: #333;
      font-weight: 500;
      flex: 1;
    }
    
    .price-tag {
      color: #9C27B0;
      font-weight: 600;
      font-size: 1.1rem;
    }
  }
  
  .clear-price {
    margin-top: 5px;
    background: rgba(v.$primary, 0.05);
    border: 1px solid rgba(v.$primary, 0.1);
    color: v.$primary;
    font-size: 0.9rem;
    cursor: pointer;
    align-self: flex-start;
    padding: 8px 14px;
    border-radius: 6px;
    transition: all 0.2s ease;
    font-weight: 500;
    margin-left: auto;
    
    &:hover {
      background: rgba(v.$primary, 0.1);
      transform: translateY(-1px);
    }
  }
  
  @media screen and (max-width: 768px) {
    .filter-summary {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    
    .reset-filters {
      align-self: flex-end;
      margin-top: 5px;
    }
    
    .feature-checkbox-group, .allergen-checkbox-group {
      grid-template-columns: 1fr;
    }
    
    .tab-buttons {
      overflow-x: auto;
      padding-bottom: 5px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
    
    .tab-button {
      white-space: nowrap;
      flex-shrink: 0;
    }
  }
</style>