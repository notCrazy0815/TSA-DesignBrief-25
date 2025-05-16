<script lang="ts">
  import { onMount, tick } from "svelte";
  import NavBar from "$lib/components/NavBar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { gsap } from "gsap";
  import FilterMenu from "$lib/components/FilterMenu.svelte";
  import MenuHeader from "../../lib/components/MenuHeader.svelte";
  import MenuCategory from "$lib/components/MenuCategory.svelte";
  import type { MenuItem as MenuItemType } from "$lib/data/menu/types";
  import DietaryLegend from "$lib/components/DietaryLegend.svelte";
  import GuidedMenuSelection from "$lib/components/GuidedMenuSelection.svelte";
  
  import menuItems, { menuCategories } from "$lib/data/menu";

  const cards = menuCategories.map((category) => ({
    id: category.id,
    title: category.title,
    text: category.description
  }));
  
  const cardRotations: number[] = [-5, 4, 10, -6];
  
  let activeCardId: number | null = null;
  let cardsContainer: HTMLElement | null = null;
  let menuSection: HTMLElement | null = null;
  let menuContentEl: HTMLElement | null = null;

  function scrollToActiveCard(): void {
    const activeCard = document.querySelector('.card.active') as HTMLElement | null;
    if (activeCard) {
      const rect = activeCard.getBoundingClientRect();
      const offset = window.innerWidth < 768 ? 60 : 100;
      const targetScroll = window.scrollY + rect.top - offset;
      gsap.to(window, { 
        duration: 0.5, 
        scrollTo: { y: targetScroll }, 
        ease: "power2.out" 
      });
    }
  }

  function closeActiveCard(): void {
    if (activeCardId !== null) {
      activeCardId = null;
      setTimeout(() => {
        (document.activeElement as HTMLElement | null)?.blur();
      }, 50);
      resetContainerHeight();
    }
  }

  async function openCard(cardId: number): Promise<void> {
    if (activeCardId === cardId) {
      closeActiveCard();
    } else {
      activeCardId = cardId;
    }
    
    await tick();

    if (activeCardId !== null) {
      const activeCardElement = document.querySelector('.card.active') as HTMLElement | null;
      if (activeCardElement && cardsContainer) {
        gsap.timeline({
          onComplete: scrollToActiveCard
        }).to(cardsContainer, {
          duration: 0.3,
          height: activeCardElement.offsetHeight + 100,
          ease: "power2.out"
        });
        
        if (window.innerWidth < 768) {
          const cards = gsap.utils.toArray('.card:not(.active)');
          gsap.to(cards, {
            opacity: 0,
            x: '100vw',
            stagger: 0.05,
            duration: 0.5,
            ease: "power2.inOut"
          });
        }
      } else {
        scrollToActiveCard();
      }
    } else {
      resetContainerHeight();
      
      if (window.innerWidth < 768) {
        const cards = gsap.utils.toArray('.card');
        gsap.to(cards, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "all"
        });
      }
    }
  }
  
  function resetContainerHeight(): void {
    if (cardsContainer) {
      if (window.innerWidth < 768) {
        const cardWidth = window.innerWidth * 0.9;
        const cardHeight = cardWidth * (2/3);
        const numCards = cards.length;
        const topOfLastCard = 10 + (numCards - 1) * (cardHeight + 20);
        const containerHeight = topOfLastCard + cardHeight;
        cardsContainer.style.height = `${containerHeight}px`;
      } else {
        cardsContainer.style.height = '80vw';
      }
    }
  }
  
  function getRotation(index: number): number {
    return cardRotations[index % cardRotations.length];
  }

  function getCardClasses(cardId: number): string {
    return activeCardId === null ? '' : activeCardId === cardId ? 'active' : 'fly-out';
  }

  let touchStartY = 0;
  let touchEndY = 0;
  let touchThreshold = 10;
  let isScrolling = false;

  function handleTouchStart(e: TouchEvent) {
    touchStartY = e.touches[0].clientY;
    isScrolling = false;
  }

  function handleTouchMove(e: TouchEvent) {
    touchEndY = e.touches[0].clientY;
    if (Math.abs(touchEndY - touchStartY) > touchThreshold) {
      isScrolling = true;
    }
  }

  function handleTouchEnd(e: TouchEvent, cardId: number) {
    if (!isScrolling) {
      openCard(cardId);
    }
    isScrolling = false;
  }
  
  onMount(() => {
    const initializePlugins = async () => {
      const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
      gsap.registerPlugin(ScrollToPlugin);
      
      cardsContainer = document.querySelector('.menu-category-cards') as HTMLElement;
      resetContainerHeight();
      window.addEventListener('resize', resetContainerHeight);
    };
    
    initializePlugins();
    
    return () => {
      window.removeEventListener('resize', resetContainerHeight);
    };
  });

  let activeFilters: Record<string, boolean> = {
    vegetarian: true,
    vegan: false,
    gluten: false,
    dairy: false,
    nuts: false,
    soy: false,
    eggs: false,
    shellfish: false,
    fish: false,
    sesame: false,
    seasonal: false,
    spicy: false
  };
  
  $: filteredItems = activeCardId ? filterMenuItems(menuItems[activeCardId], activeFilters) : [];
  
  function handleFilterChange(event: CustomEvent<Record<string, boolean>>): void {
    activeFilters = event.detail;
  }
  
  function filterMenuItems(items: MenuItemType[], filters: Record<string, boolean>): MenuItemType[] {
    if (!Object.values(filters).some(Boolean)) {
      return items;
    }

    return items.filter((item: MenuItemType) => {
      if (filters.vegan && !item.isVegan) return false;
      if (filters.vegetarian && !item.isVegetarian) return false;

      if (filters.gluten && item.contains.some(i => i.toLowerCase().includes('gluten'))) return false;
      if (filters.dairy && item.contains.some(i => i.toLowerCase().includes('dairy'))) return false;
      if (filters.nuts && item.contains.some(i => i.toLowerCase().includes('nut'))) return false;
      if (filters.soy && item.contains.some(i => i.toLowerCase().includes('soy'))) return false;
      if (filters.eggs && item.contains.some(i => i.toLowerCase().includes('egg'))) return false;
      if (filters.shellfish && item.contains.some(i => i.toLowerCase().includes('shellfish'))) return false;
      if (filters.fish && item.contains.some(i => i.toLowerCase().includes('fish'))) return false;
      if (filters.sesame && item.contains.some(i => i.toLowerCase().includes('sesame'))) return false;
      
      if (filters.seasonal && !item.seasonal) return false;
      if (filters.spicy && (item.flavorProfile?.spicy || 0) < 5) return false;
      
      return true;
    });
  }
  
  function resetFilters(): void {
    activeFilters = {
      vegetarian: true,
      vegan: false,
      gluten: false,
      dairy: false,
      nuts: false,
      soy: false,
      eggs: false,
      shellfish: false,
      fish: false,
      sesame: false,
      seasonal: false,
      spicy: false
    };
  }
  
  let wizardVisible = false;
  
  function toggleWizard(): void {
    wizardVisible = !wizardVisible;
  }
  
  function handleWizardClose(): void {
    wizardVisible = false;
  }
</script>

<svelte:head>
</svelte:head>

<svelte:window on:resize={() => activeCardId === null && resetContainerHeight()}/>

<NavBar active="menu" />

<main>
  <section id="menu-categories">
    <div class="section-header">
      <h2 class="title-font">Our Seasonal Menu</h2>
      <p class="subtitle">Featuring locally-sourced produce and sustainable ingredients</p>
      <div class="decorative-element">
        <span class="line"></span>
        <span class="icon"></span>
        <span class="line"></span>
      </div>
    </div>
    
    <div class="menu-recommender-section">
      <div class="recommender-container">
        <div class="recommender-text-container">
          <h3 class="recommender-title">Not sure what to choose?</h3>
          <p class="recommender-text">
            Discover your perfect meal with our flavor profile algorithm that calculates harmonious taste combinations based on your <span class="highlight-word">preferences</span>.
          </p>
        </div>
        <div class="recommender-button-container">
          <button class="recommender-button" on:click={toggleWizard}>
            <span class="button-text">Find Your Perfect Dish</span>
            <span class="button-icon"></span>
          </button>
        </div>
      </div>
    </div>
    
    <div class="menu-category-cards {activeCardId !== null ? 'with-active-card' : ''}" bind:this={cardsContainer}>
      {#each cards as card, i (card.id)}
        <button 
          class="card {getCardClasses(card.id)}"
          data-id={card.id}
          on:click={() => {
            if (window.innerWidth >= 768) { // Desktop behavior
              openCard(card.id);
            }
          }}
          on:touchstart={handleTouchStart}
          on:touchmove={handleTouchMove}
          on:touchend={(e) => handleTouchEnd(e, card.id)}
          aria-pressed={activeCardId === card.id}
          style={activeCardId === null ? `transform: translate3d(-50%, -50%, 0) rotateZ(${getRotation(i)}deg)` : ''}
        >
          <div class="title">
            <h3>{card.title}</h3>
          </div>
          <div class="text">
            <p>{card.text}</p>
          </div>
          <div class="card-pattern"></div>
        </button>
      {/each}
    </div>
  </section>
  
  {#if activeCardId !== null}
    <div class="scroll-down-elegant">
      <div class="arrow-bounce">
        <div class="arrow-down"></div>
      </div>
      <span class="hint-elegant">Scroll Down for Menu</span>
    </div>
    
    <section class="menu-showcase">
      <div class="menu-container">
        <MenuHeader 
          title={cards.find(c => c.id === activeCardId)?.title || ''} 
          subtitle="Seasonal Selection" 
        />
        <DietaryLegend />
        
        <div class="menu-layout">
          <div class="filter-sidebar">
            <FilterMenu category={cards.find(c => c.id === activeCardId)?.title || ''} on:filterChange={handleFilterChange} />
          </div>
          
          <div class="menu-content" bind:this={menuContentEl}>
            {#if filteredItems.length > 0}
              <MenuCategory 
                title={cards.find(c => c.id === activeCardId)?.title || ''} 
                items={filteredItems} 
              />
            {:else}
              <div class="empty-state">
                <p>No items match your filter criteria.</p>
                <button class="reset-button" on:click={resetFilters}>Reset Filters</button>
              </div>
            {/if}
          </div>
        </div>
        
        <div class="menu-footer">
          <button class="back-to-menu" on:click={closeActiveCard}>
            Back to Menu Categories
          </button>
        </div>
      </div>
    </section>
  {/if}
</main>

<Footer />

{#if wizardVisible}
  <GuidedMenuSelection on:close={handleWizardClose} />
{/if}

<style lang="scss">
  @use "../../lib/styles/variables" as v;
  
  main {
    width: 100%;
    background-color: v.$background-color-light;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 60px;
    
    h2 {
      font-size: 3rem;
      font-weight: 500;
      color: #4a3c31;
      margin-bottom: 10px;
      letter-spacing: 1px;
      font-family: "DynaPuff Regular", cursive;
    }
    
    .title-font {
      font-family: "DynaPuff Regular", cursive;
      text-transform: none;
      position: relative;
      display: inline-block;
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: #695a4e;
      font-weight: 300;
      margin-top: 0.5rem;
      font-style: italic;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .decorative-element {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px auto;
      max-width: 300px;
      
      .line {
        height: 1px;
        background-color: #a0937d;
        flex-grow: 1;
        opacity: 0.6;
      }
      
      .icon {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #a0937d;
        margin: 0 15px;
      }
    }
  }
  
  section#menu-categories {
    padding: 80px 0;
    background-color: v.$background-color-light;
    position: relative;
    overflow: clip;
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
    background-color: #fbf9f6;
    cursor: pointer;
    padding: 38px;
    box-sizing: border-box;
    border: 1px solid rgba(160, 147, 125, 0.2);
    box-shadow: 0 8px 16px rgba(106, 89, 72, 0.06);
    display: grid;
    grid-template-columns: 40% 60%;
    grid-template-rows: 1fr auto;
    align-items: end;
    align-content: end;
    transform-origin: center center;
    transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1), border 0.3s ease;
    border-radius: 20px;
    width: 60vw;
    aspect-ratio: 3/2;
    position: absolute;
    text-align: left;
    overflow: hidden;
    
    &:not(.active) {
      border: 1px solid rgba(160, 147, 125, 0.2);
      box-shadow: 0 5px 20px rgba(106, 89, 72, 0.08);
    }
    
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: linear-gradient(to right, #a0937d, #8c7b6b);
      opacity: 0.8;
      transition: height 0.3s ease;
      border-radius: 8px 8px 0 0;
    }
    
    &:hover, &:focus {
      box-shadow: 0 12px 24px rgba(106, 89, 72, 0.10);
      transform: translate3d(-50%, -55%, 0) rotateZ(0.5deg) !important;
      transition: all 0.3s ease;
      outline: none;
      
      &::before {
        height: 8px;
      }
    }
    
    .card-pattern {
      position: absolute;
      top: 0;
      right: 0;
      width: 150px;
      height: 150px;
      background-image: radial-gradient(circle, rgba(160, 147, 125, 0.2) 10%, transparent 10.5%);
      background-size: 20px 20px;
      opacity: 0.05;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: 0;
    }
    
    .title {
      width: 100%;
      padding-right: 25px;
      position: relative;
      
      h3 {
        font-size: clamp(2.2rem, 4vw, 3.5rem);
        letter-spacing: 0.5px;
        font-family: "DynaPuff Regular", cursive;
        color: #4a3c31;
        line-height: 1.1;
        margin: 0;
        white-space: normal;
        overflow: visible;
      }
    }
    
    .text {
      width: 100%;
      padding-left: 25px;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        backdrop-filter: blur(0.5px); // Even lighter blur to make text more readable
        -webkit-backdrop-filter: blur(0.5px);
        background-color: rgba(255, 255, 255, 0.1); // Reduced opacity further
        opacity: 0.3; // Reduced opacity to make text more visible
        transition: opacity 500ms ease-out;
        z-index: 2;
        pointer-events: none;
        border-radius: 4px;
      }
      
      p {
        font-weight: 400; // Slightly bolder for better readability
        font-size: clamp(1.1rem, 1.3vw, 1.3rem); // Slightly larger font size
        color: #4a3c31;
        line-height: 1.5;
        font-family: "Inter 24pt Regular", sans-serif;
        margin: 0;
        padding: 0;
        position: relative;
        z-index: 1;
        display: block;
        opacity: 1; // Full opacity
        white-space: normal;
        word-wrap: break-word;
        overflow-wrap: break-word;
        overflow: visible;
      }
    }
    
    &.active .text::before {
      opacity: 0;
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
    }

    &.active .text p {
      opacity: 1;
      color: #4a3c31;
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
    opacity: 1;
    transition: all 0.3s ease-out;
    background-color: v.$background-color-light;
  }

  .arrow-bounce {
    padding: 8px;
    margin-bottom: 8px;
  }

  .arrow-down {
    width: 20px;
    height: 20px;
    border-right: 3px solid v.$tertiary;
    border-bottom: 3px solid v.$tertiary;
    transform: rotate(45deg);
    animation: bounce 2s infinite;
    
    @media (max-width: 767px) {
      width: 16px;
      height: 16px;
      border-width: 2px;
    }
  }
  
  .hint-elegant {
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: 0.9rem;
    color: v.$tertiary;
    margin-top: 5px;
    font-weight: 500;
    
    @media (max-width: 767px) {
      font-size: 0.8rem;
    }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: rotate(45deg) translateY(0);
    }
    40% {
      transform: rotate(45deg) translateY(-10px);
    }
    60% {
      transform: rotate(45deg) translateY(-5px);
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
      grid-template-columns: 45% 55%;
    }
  }
  
  @media screen and (max-width: 767px) {
    .menu-category-cards {
      min-height: 300px;
      transition: height 0.3s ease;
      padding: 0 15px;
      -webkit-overflow-scrolling: touch;
    }
    
    .card {
      width: 85vw !important;
      height: auto !important;
      aspect-ratio: 3/2 !important;
      flex-direction: column !important;
      align-items: flex-start;
      position: absolute;
      left: 50% !important;
      transform: translate3d(-50%, 0, 0) !important;
      pointer-events: auto;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      padding: 20px;
      border-radius: 16px;
      box-shadow: 0 8px 20px rgba(106, 89, 72, 0.12);
      display: flex;
      overflow: hidden;
      touch-action: pan-y; /* Allow vertical scrolling */
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      
      &::before {
        display: none; /* Entfernung des oberen Borders auf Mobile */
      }
      
      &:hover, &:focus, &:active {
        transform: translate3d(-50%, -8px, 0) !important;
        box-shadow: 0 12px 25px rgba(106, 89, 72, 0.18);
      }
      
      /* Kein visueller Hinweis mehr erforderlich */
      
      .title {
        width: 100% !important;
        padding-right: 0;
        text-align: center;
        padding-bottom: 0;
        margin-bottom: 10px;
        
        h3 {
          font-size: clamp(1.8rem, 7vw, 2.2rem);
          text-align: center;
          margin: 0;
          padding: 0;
        }
      }
      
      .text {
        width: 100% !important;
        padding-left: 0;
        flex: 1;
        display: block;
        overflow: visible;
        padding-bottom: 15px;
        position: relative;
        margin-top: 8px;
        
        &::before {
          opacity: 0.3;
          border-radius: 8px;
          background-color: rgba(251, 249, 246, 0.1);
          backdrop-filter: blur(0.5px);
          -webkit-backdrop-filter: blur(0.5px);
        }
        
        p {
          font-weight: 300;
          font-size: 0.95rem;
          line-height: 1.5;
          padding: 4px 8px;
          width: 100%;
          font-family: "Inter 24pt Regular", sans-serif;
          margin: 0;
          color: #4a3c31;
          overflow: visible;
          display: block;
          opacity: 1;
        }
      }
    }
    
    .menu-category-cards .card:nth-child(1) {
      top: 10px;
      z-index: 4;
    }
    
    .menu-category-cards .card:nth-child(2) {
      top: calc(10px + (85vw * 2/3) + 20px);
      z-index: 3;
    }
    
    .menu-category-cards .card:nth-child(3) {
      top: calc(10px + (85vw * 4/3) + 40px);
      z-index: 2;
    }
    
    .menu-category-cards .card:nth-child(4) {
      top: calc(10px + (85vw * 6/3) + 60px);
      z-index: 1;
    }
    
    .card.active {
      aspect-ratio: 3/2 !important;
      height: auto !important;
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      transform: translate3d(-50%, -50%, 0) rotateZ(0deg) !important;
      z-index: 10;
      width: 85vw !important;
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      
      .title {
        margin-bottom: 12px;
      }
      
      .text {
        &::before {
          opacity: 0;
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
        }
        
        p {
          opacity: 1;
          color: #4a3c31;
          font-size: 1rem;
          margin-bottom: 0;
        }
      }
    }
    
    .card.fly-out {
      opacity: 0;
      pointer-events: none;
      transform: translateX(100vw) !important;
    }
  }
  
  @media screen and (min-width: 768px) {
    .card.active {
      z-index: 10;
      left: 50% !important;
      top: 50% !important;
      transform: translate3d(-50%, -50%, 0) rotateZ(0deg) !important;
      width: 60vw !important;
      aspect-ratio: 3/2 !important;
      height: auto !important;
      overflow: hidden;
      
      .text {
        p {
          opacity: 1;
        }
      }
    }
    
    .card.fly-out {
      opacity: 0;
      pointer-events: none;
      transform: translateX(100vw) !important;
    }
  }
  
  .menu-content {
    margin-top: 40px;
    width: 100%;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
    
    @media (max-width: 767px) {
      padding: 0 15px;
      margin-top: 30px;
    }
  }
  
  .menu-items-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    width: 100%;
    
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
  
  .no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px 20px;
    background-color: #f7f5f2;
    border-radius: 12px;
    border: 1px dashed rgba(160, 147, 125, 0.3);
    
    p {
      font-family: "Inter 24pt Regular", sans-serif;
      color: #8c7b6b;
      font-style: italic;
      margin: 0;
    }
  }
  
  .menu-showcase {
    background: v.$background-color-light;
    padding: 60px 0 80px;
    position: relative;
    z-index: 30;
    
    @media (max-width: 767px) {
      padding: 40px 20px 60px;
    }
  }
  
  .menu-container {
    max-width: 1200px;
    margin: 0 auto;
    background-color: white;
    border-radius: 4px;
    box-shadow: 
      0 10px 30px rgba(106, 89, 72, 0.08),
      0 1px 3px rgba(106, 89, 72, 0.1);
    border: 1px solid rgba(160, 147, 125, 0.2);
    padding: 40px;
    position: relative;
    overflow: visible;
    
    @media (max-width: 767px) {
      padding: 30px 15px;
      border-radius: 4px;
      margin: 0 10px;
    }
  }

  .menu-layout {
    position: relative;
    width: 100%;
    margin: 30px 0;
    
    @media (max-width: 767px) {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    
    @media (min-width: 768px) and (max-width: 991px) {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    
    @media (min-width: 992px) {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 40px;
      align-items: start;
    }
    
    @media (min-width: 1200px) {
      grid-template-columns: 300px 1fr;
      gap: 50px;
    }
  }

  .filter-sidebar {
    width: 100%;
    
    @media (max-width: 991px) {
      max-width: 600px;
      margin: 0 auto 30px;
    }
    
    @media (min-width: 992px) {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding-left: 0;
    }
  }

  .menu-content {
    width: 100%;
    
    @media (max-width: 991px) {
      padding: 0;
    }
    
    @media (min-width: 992px) {
      width: 100%;
      margin: 0;
      padding: 0;
    }
  }
  
  .menu-footer {
    width: 100%;
    text-align: center;
    padding: 30px 0 10px;
    border-top: 1px solid rgba(160, 147, 125, 0.15);
    margin-top: 20px;
    position: relative;
    z-index: 1;
    
    &::before {
      content: "";
      position: absolute;
      left: 50%;
      top: -15px;
      transform: translateX(-50%) rotate(45deg);
      width: 30px;
      height: 30px;
      background: white;
      border: 1px solid rgba(160, 147, 125, 0.15);
      border-bottom: none;
      border-right: none;
      z-index: 0;
    }
    
    .back-to-menu {
      position: relative;
      z-index: 1;
      background: white;
      border: 2px solid v.$tertiary;
      color: v.$tertiary;
      padding: 12px 24px;
      border-radius: 4px;
      font-family: "DynaPuff Regular", cursive;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: v.$tertiary;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(2, 92, 72, 0.2);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }

  .item-description {
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #333;
    margin: 0 0 8px;

    @media (max-width: 767px) {
      display: block;
      font-size: 0.85rem;
    }
  }

  .guided-menu-button-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  
  .guided-menu-button {
    background-color: v.$tertiary;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 14px 28px;
    font-family: "DynaPuff Regular", cursive;
    font-size: 1.1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(2, 92, 72, 0.15);
    
    &:hover {
      background-color: darken(v.$tertiary, 5%);
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(2, 92, 72, 0.2);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    @media (max-width: 767px) {
      font-size: 1rem;
      padding: 12px 20px;
    }
  }

  /* Menu recommender section styles - IMPROVED STYLES */
  .menu-recommender-section {
    max-width: 850px;
    margin: 80px auto 100px;
    padding: 0 20px;
  }
  
  .recommender-container {
    border: 1px solid rgba(v.$primary, 0.15);
    border-radius: 16px;
    padding: 45px 40px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    box-shadow: 
      0 12px 30px rgba(v.$font-color-dark, 0.06),
      0 2px 8px rgba(v.$primary, 0.1);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      
      border-radius: 16px 16px 0 0;
    }
    
    &::after {
      content: "";
      position: absolute;
      top: -50px;
      right: -50px;
      width: 180px;
      height: 180px;
      background: radial-gradient(circle, rgba(v.$primary, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      z-index: 0;
    }
    
    @media (max-width: 767px) {
      padding: 35px 25px;
      gap: 25px;
    }
  }
  
  .recommender-text-container {
    text-align: center;
    position: relative;
    z-index: 1;
    
    .recommender-title {
      font-family: "DynaPuff Regular", cursive;
      color: v.$tertiary-dark;
      font-size: 1.9rem;
      font-weight: 600;
      margin: 0 0 15px;
      letter-spacing: 0.5px;
      
      @media (max-width: 767px) {
        font-size: 1.6rem;
      }
    }
    
    .recommender-text {
      font-family: "Inter", sans-serif;
      font-size: 1.15rem;
      line-height: 1.7;
      color: rgba(v.$font-color-dark, 0.75);
      margin: 0;
      padding: 0 15px;
      display: block;
      text-align: center;
      
      @media (max-width: 767px) {
        font-size: 1rem;
        padding: 0;
      }
    }
    
    .highlight-word {
      color: v.$primary;
      font-weight: 700;
      position: relative;
      
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 100%;
        height: 2px;
        background-color: v.$primary;
        opacity: 0.5;
      }
    }
  }
  
  .recommender-button-container {
    display: flex;
    justify-content: center;
    margin-top: 15px;
    position: relative;
    z-index: 1;
  }
  
  .recommender-button {
    background: linear-gradient(to right, v.$primary, darken(v.$primary, 8%));
    color: white;
    border: none;
    border-radius: 50px;
    padding: 14px 34px;
    font-family: "Inter", sans-serif;
    font-size: 1.05rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 
      0 4px 15px rgba(v.$primary, 0.3),
      0 2px 5px rgba(v.$primary, 0.2);
    overflow: hidden;
    
    .button-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-left: 10px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M8 5v14l11-7z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(v.$primary, 0.4);
      
      .button-icon {
        transform: translateX(3px);
      }
    }
    
    &:active {
      transform: translateY(0);
      background: linear-gradient(to right, darken(v.$primary, 5%), darken(v.$primary, 12%));
      box-shadow: 0 2px 8px rgba(v.$primary, 0.3);
    }
    
    @media (max-width: 767px) {
      font-size: 0.95rem;
      padding: 12px 30px;
    }
  }
</style>