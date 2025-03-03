<script>
  import { tick, onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import NavBar from "$lib/components/NavBar.svelte";
  import { writable } from 'svelte/store';

  const activeFilters = writable({
    dietary: new Set(['all']),
    features: new Set()
  });

  let activeCard = null;
  let isTransitioning = false;
  let scrollPosition = 0;
  let menuElement;
  let containerHeight;
  let cardDimensions = { width: 0, height: 0 };
  const originalRotations = [-5, 4, 10, -6];
  let isMobile = false;
  let menuCategoryCardsElement;
  let scrollDownElement;
  let lastScrollY = 0;
  let lastResize = 0;

  const cards = [
    { id: 1, title: "Appetizers", text: "Kick off your culinary journey with our delightful plant-based appetizers, featuring fresh, innovative bites that tease your taste buds with vibrant flavors and sustainable ingredients." },
    { id: 2, title: "Main", text: "Enjoy exquisite vegan and vegetarian main courses crafted with passion and precision. Our mains blend traditional flavors with modern twists, using farm-fresh produce to create memorable plant-based dishes." },
    { id: 3, title: "Drinks", text: "Refresh yourself with our curated selection of organic, plant-based beverages and handcrafted cocktails. From fruit-infused creations to botanical blends, each sip complements your sustainable dining experience." },
    { id: 4, title: "Desserts", text: "End your dining experience on a sweet note with our decadent vegan desserts. Classic indulgence meets modern creativity with plant-based ingredients that prove sustainable eating never compromises on taste." }
  ];

  const menus = {
    Appetizers: [
      { category: "Cold Starters", items: [
        { name: "Bruschetta with Heirloom Tomatoes", price: "7.95", tags: ["vegan", "contains-gluten"] },
        { name: "Heritage Caprese Salad", price: "9.50", tags: ["vegetarian", "gluten-free", "contains-lactose"] },
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
        { name: "Cucumber Basil Refresher", price: "6.95", tags: ["vegan", "gluten-free"] },
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
        { name: "Seasonal Fruit Sorbet Selection", price: "6.95", tags: ["vegan", "gluten-free", "seasonal"] },
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

  const chefsSpecials = [
    {
      name: "Seasonal Truffle Risotto",
      description: "Our chef's special risotto with local forest truffles and seasonal vegetables",
      price: "18.95",
      tags: ["vegetarian", "gluten-free"],
      image: "/images/menu/truffle-risotto.jpg"
    },
    {
      name: "Plant-Based Wellington",
      description: "A delicate pastry filled with roasted mushrooms, walnuts, and seasonal vegetables",
      price: "19.50",
      tags: ["vegan"],
      image: "/images/menu/wellington.jpg"
    },
    {
      name: "Artisanal Tasting Platter",
      description: "A selection of our finest house-made vegan cheeses, fermented vegetables, and sourdough bread",
      price: "22.95",
      tags: ["vegan"],
      image: "/images/menu/tasting-platter.jpg"
    }
  ];

  const specialtyDrinkRecommendations = [
    { 
      name: "Organic Elderflower Sparkler", 
      origin: "House-made", 
      description: "Crisp and vibrant with notes of citrus and subtle floral aromas. Perfect with salads and light starters.",
      glass: "6.50",
      carafe: "16.00"
    },
    { 
      name: "Premium Berry Kombucha",  
      origin: "Local Brewery", 
      description: "Complex with aromas of red berries and earthy undertones. Pairs well with mushroom dishes.",
      glass: "7.00",
      carafe: "18.00"
    },
    { 
      name: "Golden Turmeric Elixir", 
      origin: "House-made", 
      description: "Warm notes of turmeric, ginger and citrus. Complements our creamy vegetable dishes.",
      glass: "6.50",
      carafe: "16.00"
    }
  ];
  
  const allergens = [
    { code: "G", name: "Gluten" },
    { code: "L", name: "Lactose" },
    { code: "N", name: "Nuts" },
    { code: "S", name: "Soy" },
    { code: "M", name: "Mustard" },
    { code: "SS", name: "Sesame Seeds" }
  ];

  const beveragePairings = [
    { 
      name: "Sparkling Elderflower Tonic", 
      origin: "House-made", 
      description: "A refreshing blend of elderflower, sparkling water, and citrus. Perfect with our lighter appetizers and salads.",
      price: "6.50" 
    },
    { 
      name: "Blackberry Sage Spritzer",  
      origin: "Nashville Craft Beverage Co.", 
      description: "Rich berry notes with herbaceous undertones. Complements our mushroom and truffle dishes beautifully.",
      price: "5.95" 
    },
    { 
      name: "Hibiscus Ginger Cooler", 
      origin: "House-made", 
      description: "Tart hibiscus balanced with warming ginger and a touch of sweetness. Cuts through rich, creamy dishes.",
      price: "5.50" 
    },
    {
      name: "Tennessee Cherry Soda",
      origin: "Local Craft Soda",
      description: "Made with cherries from Tennessee orchards, this locally-crafted soda pairs perfectly with our heartier main courses.",
      price: "4.95"
    }
  ];

  function toggleFilter(category, filter) {
    activeFilters.update(filters => {
      if (category === 'dietary' && filter === 'all') {
        filters.dietary = new Set(['all']);
      } else if (category === 'dietary') {
        filters.dietary.delete('all');
        
        if (filters.dietary.has(filter)) {
          filters.dietary.delete(filter);
          if (filters.dietary.size === 0) {
            filters.dietary.add('all');
          }
        } else {
          filters.dietary.add(filter);
        }
      } else if (category === 'features') {
        if (filters.features.has(filter)) {
          filters.features.delete(filter);
        } else {
          filters.features.add(filter);
        }
      }
      
      return filters;
    });
  }
  
  function isFilterActive(category, filter) {
    return $activeFilters[category].has(filter);
  }
  
  function filterItems(items) {
    if (!items || !Array.isArray(items)) return [];
    
    if ($activeFilters.dietary.has('all') && $activeFilters.features.size === 0) {
      return items;
    }
    
    return items.filter(item => {
      if (!item) return false;
      
      let passesBasicFilter = false;
      
      if ($activeFilters.dietary.has('all')) {
        passesBasicFilter = true;
      } else {
        passesBasicFilter = Array.from($activeFilters.dietary).some(filter => 
          item.tags && Array.isArray(item.tags) && item.tags.includes(filter)
        );
      }
      
      let passesFeatureFilters = true;
      if ($activeFilters.features.size > 0) {
        passesFeatureFilters = Array.from($activeFilters.features).every(feature => 
          item.tags && Array.isArray(item.tags) && item.tags.includes(feature)
        );
      }
      
      return passesBasicFilter && passesFeatureFilters;
    });
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
      const activeRect = activeCardElement.getBoundingClientRect();
      
      if (isMobile) {
        containerHeight = activeRect.height + 60;
        document.querySelectorAll('.card:not(.active)').forEach(c => {
          c.style.opacity = '0';
          c.style.pointerEvents = 'none';
        });
      } else {
        containerHeight = activeRect.height + 40;
      }
      
      if (menuCategoryCardsElement) {
        menuCategoryCardsElement.style.height = `${containerHeight}px`;
      }
      
      if (scrollDownElement) {
        scrollDownElement.style.opacity = '1';
        scrollDownElement.style.top = 'auto';
        scrollDownElement.style.bottom = '-40px';
        scrollDownElement.style.position = 'relative';
      }
      
      const targetScroll = window.scrollY + activeRect.top - (isMobile ? 60 : 100);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
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
      menuCategoryCardsElement.style.transition = 'none';
      if (isMobile) {
        menuCategoryCardsElement.style.height = `${calculateMobileContainerHeight()}px`;
      } else {
        menuCategoryCardsElement.style.height = '80vw';
      }
      
      void menuCategoryCardsElement.offsetHeight;
      menuCategoryCardsElement.style.transition = 'height 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    }
    
    resetAllCards();
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    
    setTimeout(() => {
      forceContainerHeight();
      isTransitioning = false;
    }, 700);
  }

  function calculateCardHeight(width) {
    return width * (2/3);
  }

  function resetAllCards() {
    cards.forEach((card, i) => {
      const cardElement = document.querySelector(`.card[data-id="${card.id}"]`);
      if (!cardElement) return;
      
      cardElement.removeAttribute('style');
      
      if (isMobile) {
        const cardWidth = window.innerWidth * 0.9;
        const cardHeight = calculateCardHeight(cardWidth);
        const spacing = 40;
        const topPosition = i * (cardHeight + spacing);
        
        Object.assign(cardElement.style, {
          position: 'absolute',
          height: `${cardHeight}px`,
          width: '90vw',
          display: 'flex'
        });
      } else {
        const left = i % 2 === 0 ? '33%' : '67%';
        const top = `${25 + (i * 10)}vw`;
        
        Object.assign(cardElement.style, {
          position: 'absolute',
          left: left,
          top: top,
          transform: `rotateZ(${getOriginalRotation(i)}deg)`,
          opacity: '1',
          zIndex: `${4 - i}`,
          pointerEvents: 'auto',
          width: '60vw',
          height: '40vw'
        });
      }
      
      cardElement.classList.remove('active', 'mobile-active', 'desktop-active');
      
      const titleEl = cardElement.querySelector('.title');
      const textEl = cardElement.querySelector('.text');
      if (titleEl) titleEl.style.width = '40%';
      if (textEl) textEl.style.width = '55%';
    });
  }

  function calculateMobileContainerHeight() {
    const cardHeight = window.innerWidth * 0.9 * (2/3);
    const spacing = 40;
    return (cardHeight * cards.length) + (spacing * (cards.length - 1)) + 150;
  }

  function forceContainerHeight() {
    if (!menuCategoryCardsElement) return;
    
    if (isMobile) {
      const height = calculateMobileContainerHeight();
      menuCategoryCardsElement.style.height = `${height}px`;
      
      setTimeout(() => {
        if (!activeCard && menuCategoryCardsElement) {
          menuCategoryCardsElement.style.height = `${calculateMobileContainerHeight()}px`;
        }
      }, 50);
    } else {
      menuCategoryCardsElement.style.height = '80vw';
    }
  }

  function getCardClass(card, i) {
    if (!card || !activeCard) return "";
    if (activeCard.id === card.id) return "active";
    
    const activeIndex = cards.findIndex(c => c && c.id === activeCard.id);
    if (activeIndex === -1) return "";
    
    return `fly-out ${i < activeIndex ? "left" : "right"}`;
  }

  function getOriginalRotation(index) {
    return index % 2 === 0 ? -5 : 5;
  }

  function getCardSizeClass() {
    if (!activeCard) return "";
    return window.innerWidth < 768 ? "mobile-active" : "desktop-active";
  }

  function handleScroll() {
    if (!activeCard || !document.querySelector('.card.active')) return;
    
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    
    const activeCardElement = document.querySelector('.card.active');
    if (activeCardElement) {
      if (scrollDelta > 0 && currentScrollY > scrollPosition) {
        const offset = Math.min((currentScrollY - scrollPosition) * 0.5, 150); 
        activeCardElement.style.transform = `translate3d(-50%, calc(-50% - ${offset}px), 0) rotateZ(0deg)`;
      } else if (currentScrollY <= scrollPosition) {
        activeCardElement.style.transform = `translate3d(-50%, -50%, 0) rotateZ(0deg)`;
      }
    }
    
    lastScrollY = currentScrollY;
  }

  function handleResize() {
    const now = Date.now();
    if (now - lastResize < 100) return;
    lastResize = now;
    
    isMobile = window.innerWidth < 768;
    
    if (activeCard) {
      const activeCardElement = document.querySelector('.card.active');
      if (activeCardElement) {
        const activeRect = activeCardElement.getBoundingClientRect();
        
        if (isMobile) {
          containerHeight = activeRect.height + 80;
          activeCardElement.style.transform = 'translate3d(-50%, -50%, 0) rotateZ(0deg)';
          activeCardElement.style.top = '50%';
          
          if (menuCategoryCardsElement) {
            menuCategoryCardsElement.style.height = `${containerHeight}px`;
          }
        } else {
          containerHeight = activeRect.height + 40;
          if (menuCategoryCardsElement) {
            menuCategoryCardsElement.style.height = `${containerHeight}px`;
          }
        }
      }
    } else if (menuCategoryCardsElement) {
      forceContainerHeight();
      
      setTimeout(() => {
        if (isMobile) resetAllCards();
      }, 150);
      
      document.querySelectorAll('.card').forEach(c => {
        c.style.opacity = '1';
        c.style.pointerEvents = 'auto';
      });
    }
  }
  
  onMount(() => {
    menuCategoryCardsElement = document.querySelector('.menu-category-cards');
    scrollDownElement = document.querySelector('.scroll-down-elegant');
    
    isMobile = window.innerWidth <= 767;
    
    setTimeout(() => {
      forceContainerHeight();
      if (isMobile) resetAllCards();
    }, 200);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    
    <div class="menu-category-cards" bind:this={menuCategoryCardsElement}>
      {#each cards as card, i (card.id)}
        <div 
          class="card {getCardClass(card, i)} {getCardSizeClass()}"
          data-id={card.id}
          on:click={(event) => handleCardClick(event, card)}
          in:fly={{ y: 50, duration: 800, delay: i * 100 }}
          style={activeCard ? '' : `transform: translate3d(-50%, -50%, 0) rotateZ(${getOriginalRotation(i)}deg)`}
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
            <h3 class="filter-section-title">Dietary Preferences</h3>
            <p class="filter-description">Select your dietary preferences to personalize our menu</p>
          </div>
          
          <div class="filter-group">
            <h4 class="filter-group-title">Select Diet</h4>
            <div class="filter-chips">
              <button 
                class="filter-chip {isFilterActive('dietary', 'all') ? 'active' : ''}" 
                on:click={() => toggleFilter('dietary', 'all')}
              >
                <span class="filter-icon">✓</span>
                <span>All Options</span>
              </button>
              <button 
                class="filter-chip {isFilterActive('dietary', 'vegan') ? 'active vegan' : ''}" 
                on:click={() => toggleFilter('dietary', 'vegan')}
              >
                <span class="filter-icon">●</span>
                <span>Vegan</span>
              </button>
              <button 
                class="filter-chip {isFilterActive('dietary', 'vegetarian') ? 'active vegetarian' : ''}" 
                on:click={() => toggleFilter('dietary', 'vegetarian')}
              >
                <span class="filter-icon">●</span>
                <span>Vegetarian</span>
              </button>
            </div>
          </div>
          
          <div class="filter-group">
            <h4 class="filter-group-title">Additional Requirements</h4>
            <div class="filter-chips">
              <button 
                class="filter-chip {isFilterActive('features', 'gluten-free') ? 'active gluten-free' : ''}" 
                on:click={() => toggleFilter('features', 'gluten-free')}
              >
                <span class="filter-icon">◯</span>
                <span>Gluten-Free</span>
              </button>
              <button 
                class="filter-chip {isFilterActive('features', 'seasonal') ? 'active seasonal' : ''}" 
                on:click={() => toggleFilter('features', 'seasonal')}
              >
                <span class="filter-icon">◯</span>
                <span>Seasonal</span>
              </button>
              <button 
                class="filter-chip {isFilterActive('features', 'raw') ? 'active raw' : ''}" 
                on:click={() => toggleFilter('features', 'raw')}
              >
                <span class="filter-icon">◯</span>
                <span>Raw</span>
              </button>
              <button 
                class="filter-chip {isFilterActive('features', 'high-protein') ? 'active protein' : ''}" 
                on:click={() => toggleFilter('features', 'high-protein')}
              >
                <span class="filter-icon">◯</span>
                <span>High-Protein</span>
              </button>
            </div>
          </div>
          
          <div class="dietary-legend">
            <div class="legend-items">
              <div class="legend-item"><span class="diet-symbol vegan">V</span> Vegan</div>
              <div class="legend-item"><span class="diet-symbol vegetarian">VG</span> Vegetarian</div>
              <div class="legend-item"><span class="diet-symbol gluten-free">GF</span> Gluten-Free</div>
              <div class="legend-item"><span class="diet-symbol seasonal">S</span> Seasonal</div>
              <div class="legend-item"><span class="new-tag">NEW</span> Chef's Special</div>
              <div class="legend-item"><span class="diet-symbol spicy">🌶️</span> Spicy</div>
            </div>
          </div>
        </div>
        
        <div class="chefs-specials">
          <h2 class="special-heading">Chef's Specials</h2>
          <p class="special-tagline">Our chef's handcrafted seasonal creations</p>
          
          <div class="specials-grid">
            {#each chefsSpecials as special}
              <div class="special-card">
                {#if special.image}
                  <div class="special-image" style="background-image: url('{special.image || '/images/menu/placeholder.jpg'}')"></div>
                {/if}
                <div class="special-content">
                  <h3>{special.name}</h3>
                  <p>{special.description}</p>
                  <div class="special-footer">
                    <div class="special-tags">
                      {#each special.tags as tag}
                        <span class="special-tag {tag}">{tag === 'vegan' ? 'V' : tag === 'vegetarian' ? 'VG' : tag}</span>
                      {/each}
                    </div>
                    <span class="special-price">${special.price}</span>
                  </div>
                </div>
              </div>
            {/each}
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
                      <li class="menu-item">
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
                                <span class="diet-symbol spicy" title="Spicy">🌶️</span>
                              {/if}
                            {/if}
                            {#if item.isNew}
                              <span class="new-tag">NEW</span>
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
                    <p>{beverage.description}</p>
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
</main>

<style lang="scss">
  @use "../../lib/styles/variables" as v;
  @use "../../lib/styles/global" as g;

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
    transition: height 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    margin-bottom: 60px;
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
    
    &:hover {
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
      transform: translate3d(-50%, calc(-50% - 5px), 0) rotateZ(0.5deg) !important;
      transition: all 0.3s ease;
      
      .click-me {
        background-color: v.$primary;
        transform: scale(1.05);
      }
    }
    
    .title h3 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      letter-spacing: 0.5px;
    }
    
    .text p {
      font-weight: 300;
      font-size: clamp(1rem, 1.2vw, 1.25rem);
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      transition: all 650ms ease;
      color: transparent;
      backdrop-filter: blur(4px);
      line-height: 1.7;
    }
    
    &.active .text p {
      text-shadow: none;
      color: v.$font-color-dark;
      backdrop-filter: none;
    }

    &.fly-out.left {
      transform: translateX(-150vw) !important;
      opacity: 0;
    }
    
    &.fly-out.right {
      transform: translateX(150vw) !important;
      opacity: 0;
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

  .scroll-down-elegant {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    margin-top: 28px;
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
      font-family: "DynaPuff Regular", serif;
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
    background-color: #f9f6f3;
    border-radius: 8px;
    padding: 25px 30px;
    margin: 30px 0 40px;
    border-left: 3px solid v.$tertiary-light;
  }
  
  .filter-header {
    margin-bottom: 22px;
  }

  .filter-section-title {
    font-family: "DynaPuff Regular", serif;
    color: v.$tertiary-dark;
    font-size: 1.4rem;
    margin: 0 0 8px;
    font-weight: 400;
  }
  
  .filter-description {
    color: #777;
    font-size: 0.95rem;
    font-style: italic;
    margin: 0;
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
    font-family: "Inter 24pt Regular", sans-serif;
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
      box-shadow: 0 2px 6px rgba(2, 92, 72, 0.25);
      
      &.vegan {
        background: #4CAF50;
        border-color: #3d8b40;
      }
      
      &.vegetarian {
        background: #FF9800;
        border-color: #d17d00;
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
    padding: 15px 20px;
    border-radius: 6px;
    border: 1px solid #e9decf;
    
    .legend-items {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.85rem;
        color: #555;
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
      border: none;
      font-size: 0.9rem;
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

  .chefs-specials {
    padding: 20px 0 40px;
    border-bottom: 1px solid #e9decf;
    margin-bottom: 40px;
  }
  
  .special-heading {
    font-family: "DynaPuff Regular", serif;
    font-size: 2.2rem;
    color: v.$tertiary-dark;
    text-align: center;
    margin-bottom: 8px;
  }
  
  .special-tagline {
    text-align: center;
    font-style: italic;
    color: #777;
    margin-bottom: 30px;
  }
  
  .specials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 25px;
  }
  
  .special-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
      
      .special-image {
        transform: scale(1.05);
      }
    }
    
    .special-image {
      height: 180px;
      background-size: cover;
      background-position: center;
      transition: transform 0.5s ease;
    }
    
    .special-content {
      padding: 20px;
      
      h3 {
        font-family: "DynaPuff Regular", serif;
        color: v.$tertiary-dark;
        font-size: 1.4rem;
        margin-bottom: 8px;
      }
      
      p {
        color: #555;
        line-height: 1.5;
        margin-bottom: 15px;
      }
    }
  }
  
  .special-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .special-tags {
      display: flex;
      gap: 6px;
    }
    
    .special-tag {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      &.vegan {
        background-color: rgba(76, 175, 80, 0.15);
        color: #3d8b40;
      }
      
      &.vegetarian {
        background-color: rgba(255, 152, 0, 0.15);
        color: #e67e00;
      }
      
      &.gluten-free {
        background-color: rgba(141, 110, 99, 0.15);
        color: #6D4C41;
      }
    }
    
    .special-price {
      font-family: "DynaPuff Regular", serif;
      font-size: 1.3rem;
      color: v.$primary;
    }
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
  }

  .menu-section h3 {
    font-size: 1.6rem;
    margin-bottom: 18px;
    padding-bottom: 10px;
    font-weight: 400;
    font-family: "DynaPuff Regular", serif;
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

  .menu-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 14px 8px;
    border-bottom: 1px dotted #f0e6da;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba(249, 246, 243, 0.7);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .item-details {
    flex: 1;
    padding-right: 15px;
  }
  
  .item-name {
    font-weight: 500;
    font-family: "Inter 24pt Regular", sans-serif;
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
    font-family: "Inter 24pt Regular", sans-serif;
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
  
  .menu-footer {
    text-align: center;
    
    .filter-chip {
      padding: 6px 12px;
      font-size: 0.85rem;
      flex-grow: 0;
    }
    
    .legend-items {
      justify-content: space-around;
    }
    
    .menu-content {
      grid-template-columns: 1fr;
      gap: 25px;
    }
    
    .menu-section h3 {
      font-size: 1.4rem;
    }
    
    .item-name {
      font-size: 1rem;
    }
  }

  section#philosophy {
    padding: 100px 20px;
    background-color: v.$background-color-light;
    min-height: 100vh;
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
  }

  .philosophy-text h2 {
    font-size: 2.5rem;
    margin-bottom: 30px;
    font-weight: 300;
    color: v.$tertiary-dark;
  }

  .philosophy-text p {
    font-size: 1.2rem;
    line-height: 1.7;
    margin-bottom: 20px;
    color: v.$font-color-dark;
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
  }

  .highlight h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: v.$tertiary-dark;
    font-weight: 400;
  }

  .highlight p {
    font-size: 1.1rem;
    line-height: 1.5;
    color: v.$font-color-dark;
  }

  section#testimonials {
    padding: 100px 20px;
    background-color: #f4efe8;
  }

  .testimonials-container {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }

  .testimonials-container h2 {
    font-size: 2.5rem;
    margin-bottom: 50px;
    font-weight: 300;
    color: #4a2e2e;
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
  }

  .testimonial .quote {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 20px;
    font-style: italic;
    color: #333;
  }

  .testimonial .author {
    font-weight: 500;
    color: #4a2e2e;
  }

  @media screen and (min-width: 768px) {
    .menu-category-cards {
      position: relative;
    }
    
    .menu-category-cards .card {
      width: 60vw;
      height: 40vw;
      position: absolute;
      transform-origin: top center;
      transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), 
                  opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                  width 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                  height 0.5s cubic-bezier(0.22, 1, 0.36, 1);
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

    .predictions{
      padding: 20px;
      margin: 20px;
    }
    
    .menu-category-cards .card.active {
      z-index: 10;
      left: 50% !important;
      top: 50% !important;
      transform: translate3d(-50%, -50%, 0) rotateZ(0deg) !important;
    }
    
    .menu-category-cards .card.desktop-active {
      width: 60vw;
      min-height: 40vw;
      max-width: 1200px;
    }
    
    .menu-container {
      position: relative;
      z-index: 5;
      margin-top: 0;
    }

    .scroll-down {
      bottom: -50px;
    }
  }
  
  @media screen and (max-width: 767px) {
    .menu-category-cards {
      padding: 20px 0;
      position: relative !important;
      min-height: calc(90vw * (2/3));
   }
    
    .menu-category-cards .card {
      width: 90vw;
      height: calc(90vw * (2 / 3));
      position: absolute;
      left: 50%;
      transform-origin: center center;
      will-change: transform, opacity;
      transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), 
                 opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                 width 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                 height 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      padding: 25px;
    }
    
    .menu-category-cards .card:nth-child(1) {
      top: 0;
    }
    
    .menu-category-cards .card:nth-child(2) {
      top: calc(90vw * (2/3) + 40px);
    }
    
    .menu-category-cards .card:nth-child(3) {
      top: calc((90vw * (2/3) + 40px) * 2);
    }
    
    .menu-category-cards .card:nth-child(4) {
      top: calc((90vw * (2/3) + 40px) * 3);
    }
    
    .menu-category-cards .card.active {
      z-index: 10;
      left: 50% !important;
      top: 50% !important;
      transform: translate3d(-50%, -50%, 0) rotateZ(0deg) !important;
      height: auto !important;
      min-height: calc(60vw) !important;
    }
    
    .menu-category-cards .card.mobile-active {
      width: 92vw;
      height: auto;
      min-height: calc(92vw * (2 / 3));
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .title {
        margin-bottom: 15px;
      }
    }
    
    .menu-category-cards .card.mobile-active .title,
    .menu-category-cards .card.mobile-active .text {
      width: 100%;
      text-align: center;
      margin-bottom: 20px;
    }

    .menu-category-cards .card .title h3 {
      font-size: clamp(1.5rem, 8vw, 2.5rem);
    }
    
    .menu-category-cards .card .text p {
      font-size: clamp(0.9rem, 3vw, 1.1rem);
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      transition: all 650ms ease;
      color: transparent;
    }

    .menu-category-cards .card.active .text p {
      text-shadow: none;
      color: v.$font-color-dark;
    }
    
    .menu-container {
      position: relative;
      z-index: 5;
      padding: 40px 0 60px;
      margin-top: 0;
    }
    
    .scroll-down {
      top: auto;
      bottom: -40px;
    }
    
    .specials-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .wine-item {
      flex-direction: column;
      
      .wine-pricing {
        margin-top: 15px;
        flex-direction: row;
        justify-content: flex-start;
        gap: 20px;
      }
    }
    
    .allergen-grid {
      gap: 12px;
    }
    
    .allergen-item {
      width: calc(50% - 6px);
    }

    .beverage-item {
      flex-direction: column;
      
      .beverage-details h3 {
        margin-bottom: 6px;
      }
      
      .beverage-pricing {
        margin-top: 15px;
        justify-content: flex-start;
        text-align: left;
      }
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
      font-family: "DynaPuff Regular", serif;
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
    font-family: "DynaPuff Regular", serif;
  }

  .allergen-information {
    background-color: #f9f6f3;
    padding: 25px;
    border-radius: 8px;
    margin: 40px 0 30px;
    
    h3 {
      font-family: "DynaPuff Regular", serif;
      font-size: 1.2rem;
      color: v.$tertiary-dark;
      margin-bottom: 10px;
    }
    
    p {
      margin-bottom: 15px;
      font-size: 0.95rem;
    }
  }
  
  .allergen-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
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

  .menu-error {
    padding: 40px 20px;
    text-align: center;
    background-color: #f9f6f3;
    border-radius: 8px;
    margin: 20px 0;
    
    p {
      color: #888;
      font-style: italic;
      margin-bottom: 10px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  @media screen and (max-width: 767px) {
    .menu-text {
      width: 95%;
      padding: 30px 20px;
    }
    
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
        font-size: 2.2rem;
      }
    }
    
    .dietary-filters {
      padding: 20px 15px;
      margin: 20px 0 30px;
    }
    
    .beverage-pairings {
      padding: 20px 15px;
    }
    
    .beverage-item {
      flex-direction: column;
      
      .beverage-pricing {
        margin-top: 15px;
        justify-content: flex-start;
      }
    }
  }
</style>