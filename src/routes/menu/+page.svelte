<script>
  import { tick } from "svelte";
  import { fly, fade } from "svelte/transition";
  import NavBar from "$lib/components/NavBar.svelte";
  import { onMount } from 'svelte';

  let activeCard = null;
  let isTransitioning = false;
  let scrollPosition = 0;
  let menuElement;
  let containerHeight;
  let cardDimensions = { width: 0, height: 0 };
  const originalRotations = [-5, 4, 10, -6];

  const cards = [
    { id: 1, title: "Appetizers", text: "Kick off your culinary journey with our delightful plant-based appetizers, featuring fresh, innovative bites that tease your taste buds with vibrant flavors and sustainable ingredients." },
    { id: 2, title: "Main", text: "Enjoy exquisite vegan and vegetarian main courses crafted with passion and precision. Our mains blend traditional flavors with modern twists, using farm-fresh produce to create memorable plant-based dishes." },
    { id: 3, title: "Drinks", text: "Refresh yourself with our curated selection of organic, plant-based beverages and handcrafted cocktails. From fruit-infused creations to botanical blends, each sip complements your sustainable dining experience." },
    { id: 4, title: "Desserts", text: "End your dining experience on a sweet note with our decadent vegan desserts. Classic indulgence meets modern creativity with plant-based ingredients that prove sustainable eating never compromises on taste." }
  ];

  // Add dietary options tracking
  let activeFilter = "all";
  
  // Enhanced menu items with price and dietary tags
  const menus = {
    Appetizers: [
      { category: "Cold Starters", items: [
        { name: "Bruschetta with Heirloom Tomatoes", price: "9.95", dietary: "vegan" },
        { name: "Heritage Caprese Salad", price: "12.50", dietary: "vegetarian" },
        { name: "House-Marinated Olives", price: "8.25", dietary: "vegan" },
        { name: "Quinoa-Stuffed Peppers", price: "10.95", dietary: "vegan" },
        { name: "Cucumber Bites with Cashew Cream", price: "9.50", dietary: "vegan" },
        { name: "Signature Hummus Trio", price: "11.75", dietary: "vegan" },
        { name: "Sundried Tomato Tapenade", price: "8.95", dietary: "vegan" },
        { name: "Grilled Artichoke Hearts", price: "12.95", dietary: "vegan" },
        { name: "Chilled Gazpacho Shooters", price: "7.95", dietary: "vegan" },
        { name: "Rainbow Veggie Sushi Rolls", price: "13.75", dietary: "vegan" }
      ]},
      { category: "Hot Starters", items: [
        { name: "Truffle-Stuffed Mushrooms", price: "12.95", dietary: "vegetarian" },
        { name: "Grilled Zucchini with Lemon Herb Oil", price: "10.50", dietary: "vegan" },
        { name: "Crispy Veggie Spring Rolls", price: "11.25", dietary: "vegan" },
        { name: "Buffalo Cauliflower Bites", price: "10.95", dietary: "vegan" },
        { name: "Spicy Sesame Tofu Skewers", price: "11.95", dietary: "vegan" },
        { name: "Wild Mushroom Quesadillas", price: "13.50", dietary: "vegetarian" },
        { name: "Seasonal Tempura Vegetables", price: "12.75", dietary: "vegetarian" }
      ]}
    ],
    Main: [
      { category: "Pasta & Risotto", items: [
        { name: "Penne Arrabiata with Fresh Chili", price: "16.95", dietary: "vegan" },
        { name: "Spaghetti Aglio e Olio with Seasonal Greens", price: "15.50", dietary: "vegan" },
        { name: "Garden Vegetable Lasagna", price: "18.95", dietary: "vegetarian" },
        { name: "Sundried Tomato & Basil Fusilli", price: "17.25", dietary: "vegan" },
        { name: "Creamy Mushroom Carbonara", price: "17.95", dietary: "vegetarian" },
        { name: "Zucchini Spirals with Walnut Pesto", price: "16.50", dietary: "vegan" },
        { name: "Truffle Mac and 'Cheese'", price: "19.95", dietary: "vegan" }
      ]},
      { category: "Hearty Mains", items: [
        { name: "Jackfruit 'Pulled Pork' Burger", price: "17.95", dietary: "vegan" },
        { name: "Portobello Mushroom Steak", price: "18.95", dietary: "vegan" },
        { name: "Lentil & Root Vegetable Shepherd's Pie", price: "16.75", dietary: "vegan" },
        { name: "Stuffed Bell Peppers with Ancient Grains", price: "17.50", dietary: "vegan" },
        { name: "Chickpea & Vegetable Tagine", price: "16.95", dietary: "vegan" }
      ]},
      { category: "Artisan Pizza", items: [
        { name: "Classic Margherita with Cashew Mozzarella", price: "15.95", dietary: "vegan" },
        { name: "Garden Harvest Special", price: "17.95", dietary: "vegan" },
        { name: "Wild Mushroom & Truffle", price: "18.95", dietary: "vegetarian" },
        { name: "Mediterranean Vegetable Medley", price: "16.95", dietary: "vegan" },
        { name: "Roasted Veggie & Pesto Delight", price: "17.95", dietary: "vegetarian" }
      ]}
    ],
    Drinks: [
      { category: "Signature Cocktails", items: [
        { name: "Cucumber Basil Mojito", price: "12.95", dietary: "vegan" },
        { name: "Spicy Ginger Margarita", price: "13.50", dietary: "vegan" },
        { name: "Elderflower Cooler", price: "11.95", dietary: "vegan" },
        { name: "Rosemary Citrus Spritz", price: "12.50", dietary: "vegan" },
        { name: "Berry-Infused Sangria", price: "13.95", dietary: "vegan" },
        { name: "Lavender Lemonade Fizz", price: "11.50", dietary: "vegan" },
        { name: "Garden Herb G&T", price: "14.50", dietary: "vegan" }
      ]},
      { category: "Fresh Smoothies", items: [
        { name: "Green Vitality Detox", price: "9.95", dietary: "vegan" },
        { name: "Mixed Berry Antioxidant Blast", price: "10.50", dietary: "vegan" },
        { name: "Tropical Sunshine Paradise", price: "10.95", dietary: "vegan" },
        { name: "Golden Mango Turmeric", price: "10.50", dietary: "vegan" },
        { name: "Peachy Morning Glow", price: "9.95", dietary: "vegan" },
        { name: "Creamy Avocado Spinach", price: "11.50", dietary: "vegan" },
        { name: "Apple Kale Refresh", price: "9.95", dietary: "vegan" }
      ]},
      { category: "Wellness Tonics", items: [
        { name: "Immunity Booster Shot", price: "7.50", dietary: "vegan" },
        { name: "Beetroot & Ginger Energizer", price: "8.50", dietary: "vegan" },
        { name: "Activated Charcoal Lemonade", price: "7.95", dietary: "vegan" },
        { name: "Blue Spirulina Elixir", price: "8.95", dietary: "vegan" },
        { name: "Probiotic Kombucha (Seasonal Flavors)", price: "8.50", dietary: "vegan" }
      ]}
    ],
    Desserts: [
      { category: "Decadent Cakes", items: [
        { name: "Espresso-Soaked Vegan Tiramisu", price: "10.95", dietary: "vegan" },
        { name: "Triple Layer Chocolate Cake", price: "11.50", dietary: "vegan" },
        { name: "Zesty Lemon Drizzle", price: "9.95", dietary: "vegan" },
        { name: "Spiced Carrot Cake", price: "10.50", dietary: "vegetarian" },
        { name: "Coconut Cream Layer Cake", price: "11.95", dietary: "vegan" },
        { name: "Beetroot Red Velvet", price: "12.50", dietary: "vegetarian" },
        { name: "Gluten-Free Almond Flour Cake", price: "11.50", dietary: "vegetarian" }
      ]},
      { category: "Frozen Delights", items: [
        { name: "Seasonal Fruit Sorbet Selection", price: "8.95", dietary: "vegan" },
        { name: "Artisanal Coconut Milk Gelato", price: "9.50", dietary: "vegan" },
        { name: "Banana Date Nice Cream", price: "9.95", dietary: "vegan" },
        { name: "Cardamom Mango Lassi Ice Cream", price: "10.50", dietary: "vegetarian" },
        { name: "Wild Strawberry Freeze", price: "9.50", dietary: "vegan" },
        { name: "Chocolate Avocado Ice Cream", price: "10.95", dietary: "vegan" }
      ]},
      { category: "Sweet Bites", items: [
        { name: "Raw Cacao Energy Truffles", price: "7.95", dietary: "vegan" },
        { name: "Chia Seed Pudding Parfait", price: "8.50", dietary: "vegan" },
        { name: "Caramelized Banana Split", price: "11.95", dietary: "vegan" },
        { name: "Warm Apple Crumble", price: "10.50", dietary: "vegetarian" },
        { name: "Seasonal Fruit Crème Brûlée", price: "12.50", dietary: "vegetarian" }
      ]}
    ]
  };
  
  function setFilter(filter) {
    activeFilter = filter;
  }
  
  function filterItems(items) {
    if (activeFilter === "all") return items;
    return items.filter(item => item.dietary === activeFilter);
  }

  let isMobile = false;
  let predictionCardsElement;
  let scrollDownElement;

  function handleCardClick(event, card) {
    event.stopPropagation();
    
    if (isTransitioning) return;
    
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
      
      if (predictionCardsElement) {
        predictionCardsElement.style.height = `${containerHeight}px`;
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
    
    if (predictionCardsElement) {
      predictionCardsElement.style.transition = 'none';
      if (isMobile) {
        predictionCardsElement.style.height = `${calculateMobileContainerHeight()}px`;
      } else {
        predictionCardsElement.style.height = '80vw';
      }
      
      void predictionCardsElement.offsetHeight;
      predictionCardsElement.style.transition = 'height 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    }
    
    resetAllCards();
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    
    setTimeout(() => {
      forceContainerHeight();
      isTransitioning = false;
    }, 700);
  }

  function resetAllCards() {
    cards.forEach((card, i) => {
      const cardElement = document.querySelector(`.card[data-id="${card.id}"]`);
      if (!cardElement) return;
      
      cardElement.removeAttribute('style');
      
      if (isMobile) {
        const cardHeight = window.innerWidth * 0.9 * (2/3);
        const spacing = 40;
        const topPosition = i * (cardHeight + spacing);
        
        Object.assign(cardElement.style, {
          position: 'absolute',
          top: `${topPosition}px`,
          left: '50%',
          transform: `translateX(-50%) rotateZ(${getOriginalRotation(i)}deg)`,
          opacity: '1',
          zIndex: `${4 - i}`,
          pointerEvents: 'auto',
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
    if (!predictionCardsElement) return;
    
    if (isMobile) {
      const height = calculateMobileContainerHeight();
      predictionCardsElement.style.height = `${height}px`;
      
      setTimeout(() => {
        if (!activeCard && predictionCardsElement) {
          predictionCardsElement.style.height = `${calculateMobileContainerHeight()}px`;
        }
      }, 50);
    } else {
      predictionCardsElement.style.height = '80vw';
    }
  }

  function getCardClass(card, i) {
    if (!activeCard) return "";
    if (activeCard.id === card.id) return "active";
    
    const activeIndex = cards.findIndex(c => c.id === activeCard.id);
    return `fly-out ${i < activeIndex ? "left" : "right"}`;
  }

  function getOriginalRotation(index) {
    return index % 2 === 0 ? -5 : 5;
  }

  function getCardSizeClass() {
    if (!activeCard) return "";
    return window.innerWidth < 768 ? "mobile-active" : "desktop-active";
  }

  let lastScrollY = 0;
  
  function handleScroll() {
    if (!activeCard || !document.querySelector('.card.active')) return;
    
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    
    const activeCardElement = document.querySelector('.card.active');
    if (activeCardElement) {
      const currentTransform = getComputedStyle(activeCardElement).transform;
      const matrix = new DOMMatrix(currentTransform);
      
      if (scrollDelta > 0 && currentScrollY > scrollPosition) {
        activeCardElement.style.transform = `translate3d(-50%, calc(-50% - ${(currentScrollY - scrollPosition) * 0.5}px), 0) rotateZ(0deg)`;
      } else if (currentScrollY <= scrollPosition) {
        activeCardElement.style.transform = `translate3d(-50%, -50%, 0) rotateZ(0deg)`;
      }
    }
    
    lastScrollY = currentScrollY;
  }

  let lastResize = 0;
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
          
          if (predictionCardsElement) {
            predictionCardsElement.style.height = `${containerHeight}px`;
          }
        } else {
          containerHeight = activeRect.height + 40;
          if (predictionCardsElement) {
            predictionCardsElement.style.height = `${containerHeight}px`;
          }
        }
      }
    } else if (predictionCardsElement) {
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
    predictionCardsElement = document.querySelector('.prediction-cards');
    scrollDownElement = document.querySelector('.scroll-down');
    
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
  <section id="predictions">
    <div class="section-header">
      <h2 class="title-font">Explore Our Menu</h2>
      <p>Click any category to discover our plant-based offerings</p>
    </div>
    <div class="prediction-cards" bind:this={predictionCardsElement}>
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
          <div class="click-me">Click me!</div>
        </div>
      {/each}
    </div>
    {#if activeCard}
    <div class="scroll-down-elegant" bind:this={scrollDownElement}>
      <span class="arrow-elegant"></span>
      <span class="hint-elegant">Menu Below</span>
    </div>
    {/if}
  </section>

  {#if activeCard}
    <div class="menu-container" in:fade={{ duration: 400, delay: 300 }} out:fade={{ duration: 200 }}>
      <div class="menu-text" bind:this={menuElement}>
        <div class="menu-header">
          <h2>{activeCard.title} Menu</h2>
          <button class="close-button" on:click={closeCard}>Close</button>
        </div>
        
        <div class="dietary-filter">
          <span class="filter-label">Filter:</span>
          <div class="filter-buttons">
            <button 
              class="filter-btn {activeFilter === 'all' ? 'active' : ''}" 
              on:click={() => setFilter('all')}
            >
              All
            </button>
            <button 
              class="filter-btn vegan-btn {activeFilter === 'vegan' ? 'active' : ''}" 
              on:click={() => setFilter('vegan')}
            >
              <span class="icon">🌱</span> Vegan
            </button>
            <button 
              class="filter-btn vegetarian-btn {activeFilter === 'vegetarian' ? 'active' : ''}" 
              on:click={() => setFilter('vegetarian')}
            >
              <span class="icon">🥕</span> Vegetarian
            </button>
          </div>
        </div>
        
        <div class="menu-content">
          {#each menus[activeCard.title] as section}
            <div class="menu-section">
              <h3>{section.category}</h3>
              <ul>
                {#each filterItems(section.items) as item}
                  <li class="menu-item {item.dietary}">
                    <div class="item-details">
                      <span class="item-name">{item.name}</span>
                      {#if item.dietary === "vegan"}
                        <span class="dietary-tag vegan">🌱</span>
                      {:else if item.dietary === "vegetarian"}
                        <span class="dietary-tag vegetarian">🥕</span>
                      {/if}
                    </div>
                    <span class="item-price">${item.price}</span>
                  </li>
                {/each}
                
                {#if filterItems(section.items).length === 0}
                  <li class="no-items">No {activeFilter} options in this category</li>
                {/if}
              </ul>
            </div>
          {/each}
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

  section#hero {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/hero-vegetables.jpg');
    background-size: cover;
    background-position: center;
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
  }

  .hero-content {
    max-width: 800px;
    padding: 0 20px;
  }

  .hero-content h1 {
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    margin-bottom: 20px;
    font-weight: 300;
    line-height: 1.2;
  }

  .hero-content p {
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    max-width: 700px;
    margin: 0 auto;
    font-weight: 300;
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

  .section-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .section-header h2 {
    font-size: 2.8rem;
    font-weight: 500;
    color: v.$tertiary-dark;
    margin-bottom: 10px;
  }
  
  .title-font {
    font-family: "DynaPuff Regular", cursive;
    text-transform: none;
    position: relative;
    display: inline-block;
    
    &::after {
      content: "";
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 3px;
      background-color: v.$primary;
      border-radius: 3px;
    }
  }

  .section-header p {
    font-size: 1.2rem;
    color: v.$tertiary;
    font-weight: 300;
    margin-top: 1.2rem;
  }

  section#predictions {
    padding: 80px 0;
    background-color: v.$background-color-light;
    position: relative;
    overflow: visible;
    z-index: 1;
  }

  section#predictions .prediction-cards {
    position: relative;
    transition: height 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    margin-bottom: 60px;
    overflow: visible;
    min-height: 0;
    will-change: height;
    box-sizing: border-box !important;
  }
  
  .prediction-cards .card .click-me {
    position: absolute;
    top: 32px;
    right: 32px;
    background-color: v.$primary;
    color: white;
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 1.1rem;
    cursor: pointer;
    animation: pulse 1.5s infinite;
    box-shadow: 0 3px 8px rgba(252, 98, 52, 0.3);
    transition: transform 0.3s ease, background-color 0.3s ease;
    
    &::after {
      content: "→";
      margin-left: 5px;
      font-size: 1.1em;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 3px 8px rgba(252, 98, 52, 0.3);
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(252, 98, 52, 0.5);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 3px 8px rgba(252, 98, 52, 0.3);
    }
  }

  @media screen and (max-width: 767px) {
    .prediction-cards .card .click-me {
      display: none;
    }
  }

  .scroll-down-elegant {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    margin-top: 20px;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    transition: all 0.3s ease-out;
  }

  .arrow-elegant {
    display: block;
    width: 24px;
    height: 24px;
    border-left: 3px solid v.$primary;
    border-bottom: 3px solid v.$primary;
    transform: rotate(-45deg);
    animation: bounce 2s infinite;
    margin-bottom: 10px;
    filter: drop-shadow(0 2px 3px rgba(252, 98, 52, 0.2));
  }

  .hint-elegant {
    font-size: 0.95rem;
    color: #333;
    font-weight: 500;
    letter-spacing: 0.5px;
    animation: fadeInOut 2s infinite;
    font-family: "Inter 24pt Regular", sans-serif;
    
    &::before, &::after {
      content: "•";
      color: v.$primary;
      margin: 0 5px;
      font-size: 1.2rem;
    }
  }

  @keyframes fadeInOut {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0) rotate(-45deg);
    }
    40% {
      transform: translateY(-10px) rotate(-45deg);
    }
    60% {
      transform: translateY(-5px) rotate(-45deg);
    }
  }

  @media screen and (min-width: 768px) {
    .scroll-down {
      bottom: -50px;
    }
  }
  
  @media screen and (max-width: 767px) {
    .scroll-down {
      margin-top: 10px;
      padding: 8px;
    }
  }

  section#predictions .prediction-cards .card {
    background-color: #fff;
    cursor: pointer;
    padding: 32px;
    box-sizing: border-box;
    border: 1px solid #e9decf;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    transform-origin: center center;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), 
                opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                width 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                height 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                background-color 0.4s ease;
    border-left: 4px solid transparent;
    
    &:hover {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
      transform: translate3d(-50%, calc(-50% - 5px), 0) rotateZ(0.5deg) !important;
      transition: all 0.3s ease;
    }
    
    &:hover .click-me {
      background-color: darken(v.$primary, 5%);
      transform: scale(1.05);
    }
  }
  
  section#predictions .prediction-cards .card:nth-child(1) {
    border-left-color: v.$primary;
  }
  
  section#predictions .prediction-cards .card:nth-child(2) {
    border-left-color: v.$tertiary;
  }
  
  section#predictions .prediction-cards .card:nth-child(3) {
    border-left-color: v.$secondary;
  }
  
  section#predictions .prediction-cards .card:nth-child(4) {
    border-left-color: v.$quaternary;
  }
  
  section#predictions .prediction-cards .card .title {
    width: 40%;
  }
  
  section#predictions .prediction-cards .card .title h3 {
    font-weight: 300;
    line-height: 1;
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    position: relative;
    color: v.$tertiary-dark;
  }
  
  section#predictions .prediction-cards .card:nth-child(1) .title h3 {
    color: v.$primary;
  }
  
  section#predictions .prediction-cards .card:nth-child(2) .title h3 {
    color: v.$tertiary;
  }
  
  section#predictions .prediction-cards .card:nth-child(3) .title h3 {
    color: v.$secondary;
  }
  
  section#predictions .prediction-cards .card:nth-child(4) .title h3 {
    color: v.$quaternary;
  }
  
  section#predictions .prediction-cards .card .text {
    width: 55%;
  }
  
  section#predictions .prediction-cards .card .text p {
    font-weight: 300;
    font-size: clamp(1rem, 1.2vw, 1.25rem);
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transition: all 650ms ease;
    color: transparent;
  }
  
  section#predictions .prediction-cards .card.active .text p {
    text-shadow: none;
    color: v.$font-color-dark;
  }
  
  @media screen and (min-width: 768px) {
    .prediction-cards {
      position: relative;
    }
    
    .prediction-cards .card {
      width: 60vw;
      height: 40vw;
      position: absolute;
      transform-origin: top center;
      transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), 
                  opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                  width 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                  height 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }
    
    .prediction-cards .card:nth-child(1) {
      left: 33%;
      top: 25vw;
      z-index: 4;
    }
    
    .prediction-cards .card:nth-child(2) {
      left: 67%;
      top: 35vw;
      z-index: 3;
    }
    
    .prediction-cards .card:nth-child(3) {
      left: 33%;
      top: 45vw;
      z-index: 2;
    }
    
    .prediction-cards .card:nth-child(4) {
      left: 67%;
      top: 55vw;
      z-index: 1;
    }

    .predictions{
      padding: 20px;
      margin: 20px;
    }
    
    .prediction-cards .card.active {
      z-index: 10;
      left: 50% !important;
      top: 50% !important;
      transform: translate3d(-50%, -50%, 0) rotateZ(0deg) !important;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
      background-color: v.$font-color-light;
      border-left-width: 6px;
    }
    
    .prediction-cards .card.desktop-active {
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
    .prediction-cards {
      padding: 20px 0;
      position: relative !important;
      min-height: calc(90vw * (2/3));
   }
    
    .prediction-cards .card {
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
    }
    
    .prediction-cards .card:nth-child(1) {
      top: 0;
    }
    
    .prediction-cards .card:nth-child(2) {
      top: calc(90vw * (2/3) + 40px);
    }
    
    .prediction-cards .card:nth-child(3) {
      top: calc((90vw * (2/3) + 40px) * 2);
    }
    
    .prediction-cards .card:nth-child(4) {
      top: calc((90vw * (2/3) + 40px) * 3);
    }
    
    .prediction-cards .card.active {
      z-index: 10;
      left: 50% !important;
      top: 50% !important;
      transform: translate3d(-50%, -50%, 0) rotateZ(0deg) !important;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
      background-color: v.$font-color-light;
      height: auto !important;
      min-height: calc(60vw) !important;
    }
    
    .prediction-cards .card.mobile-active {
      width: 92vw;
      height: auto;
      min-height: calc(92vw * (2 / 3));
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .prediction-cards .card.mobile-active .title,
    .prediction-cards .card.mobile-active .text {
      width: 100%;
      text-align: center;
      margin-bottom: 20px;
    }

    .prediction-cards .card .title h3 {
      font-size: clamp(1.5rem, 8vw, 2.5rem);
    }
    
    .prediction-cards .card .text p {
      font-size: clamp(0.9rem, 3vw, 1.1rem);
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      transition: all 650ms ease;
      color: transparent;
    }
    
    .prediction-cards .card.active .text p {
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
  }
  
  .card.fly-out.left {
    transform: translateX(-150vw) !important;
    opacity: 0;
  }
  .card.fly-out.right {
    transform: translateX(150vw) !important;
    opacity: 0;
  }
  
  .menu-container {
    position: relative;
    z-index: 5;
    background: linear-gradient(180deg, rgba(228, 219, 210, 0) 0%, rgba(228, 219, 210, 1) 15%);
    padding: 60px 0;
    margin-top: -20px;
    margin-bottom: -80px;
  }

  .menu-text {
    background: white;
    margin: 0 auto;
    width: 85%;
    max-width: 1200px;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  .dietary-filter {
    margin: 20px 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 2px dotted #e9decf;
  }
  
  .filter-label {
    font-family: "DynaPuff Regular", cursive;
    color: v.$tertiary-dark;
    font-size: 1.1rem;
    margin-right: 10px;
  }
  
  .filter-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .filter-btn {
    background: #f7f3ee;
    border: 2px solid #e9decf;
    border-radius: 20px;
    padding: 6px 14px;
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 5px;
    color: #555;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
    }
    
    &.active {
      background: v.$tertiary-light;
      border-color: v.$tertiary;
      color: white;
      font-weight: 500;
    }
    
    &.vegan-btn.active {
      background: #4CAF50;
      border-color: #3d8b40;
    }
    
    &.vegetarian-btn.active {
      background: #FF9800;
      border-color: #d17d00;
    }
    
    .icon {
      font-size: 1.1rem;
    }
  }
  
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0e6da;
    font-size: 1.1rem;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba(v.$primary, 0.05);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .item-details {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .item-name {
    font-weight: 400;
  }
  
  .dietary-tag {
    padding: 3px;
    border-radius: 50%;
    font-size: 0.8rem;
    display: inline-flex;
    margin-left: 5px;
    
    &.vegan {
      color: #4CAF50;
    }
    
    &.vegetarian {
      color: #FF9800;
    }
  }
  
  .item-price {
    font-weight: 500;
    color: v.$primary;
    font-family: "DynaPuff Regular", cursive;
    font-size: 1rem;
  }
  
  .no-items {
    padding: 10px;
    text-align: center;
    color: #999;
    font-style: italic;
    background-color: #f9f6f3;
    border-radius: 8px;
  }

  /* Mobile optimizations */
  @media screen and (max-width: 767px) {
    .dietary-filter {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .filter-buttons {
      width: 100%;
      justify-content: space-between;
    }
    
    .menu-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
      
      .item-price {
        align-self: flex-end;
      }
    }
  }

  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e9decf;
    padding-bottom: 15px;
    margin-bottom: 25px;
  }

  .menu-header h2 {
    font-size: 2.5rem;
    margin: 0;
    font-weight: 300;
    color: v.$tertiary-dark;
    font-family: "DynaPuff Regular", serif;
    position: relative;
    display: inline-block;
    
    &::after {
      content: "";
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 40%;
      height: 3px;
      background-color: v.$primary;
      border-radius: 3px;
    }
  }

  .close-button {
    background: #f0e6da;
    border: 1px solid #e9decf;
    font-size: 1rem;
    cursor: pointer;
    padding: 10px 18px;
    border-radius: 5px;
    transition: all 0.3s ease;
    color: v.$tertiary-dark;
    font-weight: 500;
    
    &:hover {
      background: v.$primary;
      color: white;
      box-shadow: 0 3px 8px rgba(252, 98, 52, 0.3);
    }
  }

  .menu-content {
    font-family: "Garamond", serif;
    color: #4a2e2e;
    line-height: 1.5;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
  }

  .menu-section {
    margin-bottom: 20px;
  }

  .menu-section h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    border-bottom: 1px solid #e9decf;
    padding-bottom: 8px;
    font-weight: 400;
  }

  .menu-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .menu-section li {
    padding: 8px 0;
    border-bottom: 1px solid #f0e6da;
    font-size: 1.1rem;
  }

  .menu-section li:last-child {
    border-bottom: none;
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
</style>