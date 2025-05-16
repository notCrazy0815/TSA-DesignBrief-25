<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { fade, fly, scale, slide } from 'svelte/transition';
  import { cubicIn, cubicOut } from 'svelte/easing';
  import type { MenuItem } from '$lib/data/menu/types';
  import { findBestPairings, generatePairingRecommendation, type PairingItem } from '$lib/utils/pairingSystem';
  import menuItems from '$lib/data/menu';

  export let item: MenuItem;
  export let isOpen: boolean = false;

  const dispatch = createEventDispatcher();
  let modalElement: HTMLElement;
  let dynamicRecommendation: string = '';
  let topPairings: PairingItem[] = [];
  let pairingsGenerated = false;
  let isClosing = false;
  
  let expandedSections = {
    flavorProfile: false,
    nutrition: true,
    ingredients: true,
    allergens: true,
    sourcing: true
  };

  function formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  function toggleSection(section: keyof typeof expandedSections) {
    expandedSections[section] = !expandedSections[section];
  }

  function toPairingItem(menuItem: MenuItem, category: 'appetizer' | 'main' | 'drink' | 'dessert'): PairingItem {
    return {
      id: menuItem.id,
      name: menuItem.name,
      category: category,
      flavorProfile: menuItem.flavorProfile || {
        sweet: 0, salty: 0, sour: 0, bitter: 0, 
        umami: 0, spicy: 0, refreshing: 0, rich: 0
      },
      isVegan: menuItem.isVegan,
      isVegetarian: menuItem.isVegetarian,
      seasonal: menuItem.seasonal,
      contains: menuItem.contains
    };
  }

  function generateDynamicPairings() {
    if (pairingsGenerated || !item.dynamicPairings || !item.flavorProfile) return;
    
    const allItems: MenuItem[] = [
      ...menuItems[1],
      ...menuItems[2],
      ...menuItems[3],
      ...menuItems[4]
    ];

    const pairingItems: PairingItem[] = [
      ...menuItems[1].map(item => toPairingItem(item, 'appetizer')),
      ...menuItems[2].map(item => toPairingItem(item, 'main')),
      ...menuItems[3].map(item => toPairingItem(item, 'drink')),
      ...menuItems[4].map(item => toPairingItem(item, 'dessert'))
    ];
    
    const dietaryFilter = item.isVegan ? 'vegan' : 
                         item.isVegetarian ? 'vegetarian' : undefined;
    
    const currentCategory = 
      item.id >= 100 && item.id < 200 ? 'appetizer' :
      item.id >= 200 && item.id < 300 ? 'main' :
      item.id >= 300 && item.id < 400 ? 'drink' : 'dessert';
    
    const currentPairingItem = toPairingItem(item, currentCategory);
    
    topPairings = findBestPairings(currentPairingItem, pairingItems, 3, dietaryFilter);
    
    dynamicRecommendation = generatePairingRecommendation(currentPairingItem, topPairings);
    pairingsGenerated = true;
  }

  function closeModal() {
    isClosing = true;
    setTimeout(() => {
      dispatch('close');
      isClosing = false;
    }, 300);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function stopPropagation(event: Event) {
    event.stopPropagation();
  }

  function getFlavorColor(flavor: string): string {
    switch (flavor.toLowerCase()) {
      case 'sweet': return '#fc6234';
      case 'salty': return '#5d5ca8';
      case 'sour': return '#025c48';
      case 'bitter': return '#8e7cc3';
      case 'umami': return '#6fa8dc';
      case 'spicy': return '#e06666';
      case 'refreshing': return '#93c47d';
      case 'rich': return '#5AB1BB';
      default: return '#ccc';
    }
  }

  $: if (item && item.id) {
    pairingsGenerated = false;
  }

  onMount(() => {
    if (isOpen && modalElement) {
      gsap.from(modalElement, {
        y: 30,
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: "back.out(1.2)"
      });
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });

  $: if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';
    generateDynamicPairings();
  } else {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'auto';
  }
</script>

{#if isOpen}
  <div 
    class="modal-overlay" 
    on:click={closeModal}
    on:keydown={(e) => e.key === 'Enter' && closeModal()}
    role="button"
    tabindex="0"
    aria-label="Close modal"
    transition:fade={{ duration: 250 }}
  >
    <button 
      class="close-button" 
      on:click={closeModal} 
      aria-label="Close"
      in:scale={{delay: 200, duration: 200, start: 0.8}}
      out:scale={{duration: 150}}
    >
      ×
    </button>
    
    <div 
      class="modal-content" 
      class:closing={isClosing}
      bind:this={modalElement}
      on:click={stopPropagation}
      on:keydown={(e) => e.key === 'Enter' && stopPropagation(e)}
      role="dialog"
      aria-labelledby="modal-title"
      in:fly={{ y: 30, duration: 350, easing: cubicOut }}
      out:fly={{ y: 20, duration: 250, easing: cubicIn }}
    >
      <div class="modal-header">
        <h2 class="item-name">{item.name}</h2>
        <div class="item-price">{formatPrice(item.price)}</div>
      </div>

      <div class="item-badges">
        {#if item.isVegan}
          <span class="badge vegan">Vegan</span>
        {:else if item.isVegetarian}
          <span class="badge vegetarian">Vegetarian</span>
        {/if}
        {#if item.seasonal}
          <span class="badge seasonal">Seasonal</span>
        {/if}
        {#if item.dietarySuitability?.glutenFree}
          <span class="badge gluten-free">Gluten-Free</span>
        {/if}
        {#if item.dietarySuitability?.dairyFree}
          <span class="badge dairy-free">Dairy-Free</span>
        {/if}
      </div>

      <div class="modal-body">
        <div class="description-section">
          <p class="item-description">{item.description}</p>
          
          {#if item.preparation}
            <div class="detail-section">
              <h3>Preparation</h3>
              <p>{item.preparation}</p>
            </div>
          {/if}

          {#if dynamicRecommendation || item.pairingRecommendation}
            <div class="detail-section pairing-section">
              <h3>Perfect Pairing</h3>
              <p>{dynamicRecommendation || item.pairingRecommendation}</p>
              
              {#if topPairings.length > 0}
                <div class="pairing-suggestions">
                  {#each topPairings.slice(0, 2) as pairing}
                    <div class="pairing-item">
                      <span class="pairing-name">{pairing.name}</span>
                      <span class="pairing-strength" style="width: {(pairing.pairingStrength || 0) * 10}%"></span>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
          
          {#if item.flavorProfile}
            <div class="collapsible-section">
              <button 
                class="section-toggle" 
                on:click={() => toggleSection('flavorProfile')}
                on:keydown={(e) => e.key === 'Enter' && toggleSection('flavorProfile')}
                aria-expanded={expandedSections.flavorProfile}
              >
                <h3>Flavor Profile</h3>
                <span class="toggle-icon">{expandedSections.flavorProfile ? '−' : '+'}</span>
              </button>
              
              {#if expandedSections.flavorProfile}
                <div class="section-content flavor-profile-section" transition:slide={{duration: 300}}>
                  <div class="flavor-bars">
                    {#each Object.entries(item.flavorProfile) as [flavor, intensity], index}
                      <div class="flavor-bar">
                        <span class="flavor-name">{flavor.charAt(0).toUpperCase() + flavor.slice(1)}</span>
                        <div class="intensity-bar">
                          <div 
                            class="intensity-fill" 
                            style="width: {intensity * 10}%; background-color: {getFlavorColor(flavor)};"
                          ></div>
                        </div>
                      </div>
                    {/each}
                  </div>
                  
                  <div class="flavor-profile-explainer">
                    <p>Our flavor profiles help you understand the taste characteristics of each dish on a scale of 0-10.</p>
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <div class="details-section">
          {#if item.ingredients && item.ingredients.length > 0}
            <div class="collapsible-section">
              <button 
                class="section-toggle" 
                on:click={() => toggleSection('ingredients')}
                on:keydown={(e) => e.key === 'Enter' && toggleSection('ingredients')}
                aria-expanded={expandedSections.ingredients}
              >
                <h3>Ingredients</h3>
                <span class="toggle-icon">{expandedSections.ingredients ? '−' : '+'}</span>
              </button>
              
              {#if expandedSections.ingredients}
                <div class="section-content ingredients-section" transition:slide={{duration: 300}}>
                  <ul class="ingredients-list">
                    {#each item.ingredients as ingredient}
                      <li>{ingredient}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </div>
          {/if}

          {#if item.contains && item.contains.length > 0}
            <div class="collapsible-section">
              <button 
                class="section-toggle" 
                on:click={() => toggleSection('allergens')}
                on:keydown={(e) => e.key === 'Enter' && toggleSection('allergens')}
                aria-expanded={expandedSections.allergens}
              >
                <h3>Contains</h3>
                <span class="toggle-icon">{expandedSections.allergens ? '−' : '+'}</span>
              </button>
              
              {#if expandedSections.allergens}
                <div class="section-content allergens-section" transition:slide={{duration: 300}}>
                  <div class="allergens">
                    {#each item.contains as allergen}
                      <span class="allergen-pill">{allergen}</span>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/if}

          <div class="collapsible-section">
            <button 
              class="section-toggle" 
              on:click={() => toggleSection('nutrition')}
              on:keydown={(e) => e.key === 'Enter' && toggleSection('nutrition')}
              aria-expanded={expandedSections.nutrition}
            >
              <h3>Nutrition Information</h3>
              <span class="toggle-icon">{expandedSections.nutrition ? '−' : '+'}</span>
            </button>
            
            {#if expandedSections.nutrition}
              <div class="section-content nutrition-section" transition:slide={{duration: 300}}>
                <div class="nutrition-grid">
                  <div class="nutrition-item">
                    <span class="nutrition-value">{item.nutrition.calories}</span>
                    <span class="nutrition-label">Calories</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="nutrition-value">{item.nutrition.protein}g</span>
                    <span class="nutrition-label">Protein</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="nutrition-value">{item.nutrition.fat}g</span>
                    <span class="nutrition-label">Fat</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="nutrition-value">{item.nutrition.carbs}g</span>
                    <span class="nutrition-label">Carbs</span>
                  </div>
                  {#if item.nutrition.sugar !== undefined}
                    <div class="nutrition-item">
                      <span class="nutrition-value">{item.nutrition.sugar}g</span>
                      <span class="nutrition-label">Sugar</span>
                    </div>
                  {/if}
                  {#if item.nutrition.fiber !== undefined}
                    <div class="nutrition-item">
                      <span class="nutrition-value">{item.nutrition.fiber}g</span>
                      <span class="nutrition-label">Fiber</span>
                    </div>
                  {/if}
                  {#if item.nutrition.sodium !== undefined}
                    <div class="nutrition-item">
                      <span class="nutrition-value">{item.nutrition.sodium}mg</span>
                      <span class="nutrition-label">Sodium</span>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>

          {#if item.sourceInfo?.sources && item.sourceInfo.sources.length > 0}
            <div class="collapsible-section">
              <button 
                class="section-toggle" 
                on:click={() => toggleSection('sourcing')}
                on:keydown={(e) => e.key === 'Enter' && toggleSection('sourcing')}
                aria-expanded={expandedSections.sourcing}
              >
                <h3>Sourcing Information</h3>
                <span class="toggle-icon">{expandedSections.sourcing ? '−' : '+'}</span>
              </button>
              
              {#if expandedSections.sourcing}
                <div class="section-content sourcing-section" transition:slide={{duration: 300}}>
                  {#if item.sourceInfo.local || item.sourceInfo.organic}
                    <div class="source-tags">
                      {#if item.sourceInfo.local}
                        <span class="source-tag local">Locally Sourced</span>
                      {/if}
                      {#if item.sourceInfo.organic}
                        <span class="source-tag organic">Organic</span>
                      {/if}
                    </div>
                  {/if}
                  <ul class="source-list">
                    {#each item.sourceInfo.sources as source}
                      <li>
                        <span class="source-name">{source.name}</span>
                        <span class="source-location">{source.location}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "../../lib/styles/variables" as v;

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
    backdrop-filter: blur(3px);
  }

  .modal-content {
    background-color: white;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    border-radius: 8px;
    padding: 30px;
    position: relative;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    transform-origin: center;
    transition: transform 0.3s ease, opacity 0.3s ease;

    &.closing {
      transform: scale(0.98);
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      padding: 20px;
      max-height: 80vh;
    }
  }

  .close-button {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    font-size: 22px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: v.$tertiary;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 20;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    font-weight: 300;

    &:hover {
      background-color: v.$tertiary;
      color: white;
      transform: rotate(90deg) scale(1.1);
    }

    &:active {
      transform: rotate(90deg) scale(0.95);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(160, 147, 125, 0.2);
    padding-bottom: 15px;
    padding-right: 20px;
  }

  .item-name {
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: 1.8rem;
    font-weight: 600;
    color: v.$tertiary;
    margin: 0;
  }

  .item-price {
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: v.$tertiary;
  }

  .item-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;

    .badge {
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
      color: white;
    }

    .vegan {
      background-color: v.$tertiary;
    }

    .vegetarian {
      background-color: v.$secondary;
    }

    .seasonal {
      background-color: v.$primary;
    }

    .gluten-free {
      background-color: #8e7cc3;
    }

    .dairy-free {
      background-color: #6fa8dc;
    }
  }

  .modal-body {
    display: flex;
    gap: 30px;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .description-section {
    flex: 1;
  }

  .details-section {
    flex: 1;
    background-color: #f9f7f4;
    padding: 20px;
    border-radius: 8px;
  }

  .item-description {
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: 1.1rem;
    line-height: 1.6;
    color: #333;
    margin-bottom: 20px;
  }

  .detail-section {
    margin-bottom: 20px;

    h3 {
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      color: v.$tertiary;
      margin-bottom: 8px;
    }

    p {
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 1rem;
      line-height: 1.5;
      color: #444;
    }
  }
  
  .collapsible-section {
    margin-bottom: 15px;
    background-color: white;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    
    .section-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 12px 15px;
      background-color: white;
      border: 1px solid rgba(160, 147, 125, 0.15);
      border-radius: 6px;
      cursor: pointer;
      text-align: left;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: rgba(160, 147, 125, 0.05);
      }
      
      h3 {
        font-family: "Inter 24pt Regular", sans-serif;
        font-size: 1rem;
        font-weight: 600;
        color: v.$tertiary;
        margin: 0;
      }
      
      .toggle-icon {
        font-size: 1.2rem;
        color: v.$tertiary;
        font-weight: 300;
      }
    }
    
    .section-content {
      padding: 15px;
      border: 1px solid rgba(160, 147, 125, 0.15);
      border-top: none;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }

  .ingredients-list {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 0.95rem;
      color: #444;
      padding: 5px 0;
      position: relative;
      padding-left: 20px;

      &:before {
        content: "•";
        position: absolute;
        left: 0;
        color: v.$tertiary;
      }
    }
  }

  .allergens {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .allergen-pill {
      background-color: rgba(160, 147, 125, 0.1);
      color: #695a4e;
      padding: 4px 10px;
      border-radius: 30px;
      font-size: 0.85rem;
      font-weight: 500;
    }
  }

  .nutrition-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;

    @media (max-width: 480px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .nutrition-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .nutrition-value {
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: v.$tertiary;
  }

  .nutrition-label {
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: 0.85rem;
    color: #695a4e;
    margin-top: 3px;
  }

  .source-tags {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;

    .source-tag {
      font-size: 0.85rem;
      padding: 4px 10px;
      border-radius: 30px;
      font-weight: 500;
    }

    .local {
      background-color: rgba(2, 92, 72, 0.1);
      color: v.$tertiary;
    }

    .organic {
      background-color: rgba(93, 92, 168, 0.1);
      color: v.$secondary;
    }
  }

  .source-list {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 0.95rem;
      color: #444;
      padding: 6px 0;
      border-bottom: 1px solid rgba(160, 147, 125, 0.1);

      &:last-child {
        border-bottom: none;
      }
    }

    .source-name {
      font-weight: 500;
    }

    .source-location {
      font-size: 0.85rem;
      color: #695a4e;
      font-style: italic;
    }
  }

  .pairing-section {
    background-color: rgba(2, 92, 72, 0.05);
    padding: 15px;
    border-radius: 8px;
    border-left: 3px solid v.$tertiary;
    margin-top: 25px;
    margin-bottom: 20px;
  }
  
  .pairing-suggestions {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .pairing-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .pairing-name {
      font-size: 0.9rem;
      font-weight: 500;
      color: #444;
    }
    
    .pairing-strength {
      height: 6px;
      background-color: v.$tertiary;
      border-radius: 3px;
      max-width: 100%;
      transition: width 0.5s ease;
    }
  }
  
  .flavor-profile-section {
    background-color: white;
  }
  
  .flavor-bars {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .flavor-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .flavor-name {
      width: 100px;
      font-size: 0.85rem;
      color: #444;
      font-weight: 500;
    }
    
    .intensity-bar {
      flex: 1;
      height: 8px;
      background-color: rgba(160, 147, 125, 0.1);
      border-radius: 4px;
      overflow: hidden;
      
      .intensity-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.5s ease;
      }
    }
  }
  
  .flavor-profile-explainer {
    background-color: rgba(160, 147, 125, 0.05);
    padding: 10px;
    border-radius: 4px;
    
    p {
      margin: 0;
      font-size: 0.8rem;
      color: #695a4e;
      font-style: italic;
    }
  }
</style>
