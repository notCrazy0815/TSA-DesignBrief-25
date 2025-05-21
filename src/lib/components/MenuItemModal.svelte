<script lang="ts">
  import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
  import { gsap } from 'gsap';
  import { fade, fly, scale, slide } from 'svelte/transition';
  import { cubicIn, cubicOut, quintOut } from 'svelte/easing';
  import type { MenuItem } from '$lib/data/menu/types';
  import { findBestPairings, generatePairingRecommendation, type PairingItem } from '$lib/utils/pairingSystem';
  import menuItems from '$lib/data/menu';
  import { faInfoCircle, faTimes, faChevronDown, faChevronUp, faLeaf, faMapMarkerAlt, faCalendarAlt, faHeartbeat, faUtensils } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import ingredients from '$lib/data/ingredients';
  import type { Ingredient } from '$lib/data/menu/types';
  import { Chart, registerables } from 'chart.js';
  import IngredientModal from './IngredientModal.svelte';

  // Register all Chart.js components
  Chart.register(...registerables);

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

  let selectedIngredient: string | null = null;
  let showIngredientModal = false;
  let activeTab = 'overview';
  let currentIngredient: any = null;
  
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

  function showIngredientDetails(ingredient: string) {
    if (ingredients[ingredient] && ingredients[ingredient]?.sourceInfo?.local) {
      selectedIngredient = ingredient;
      currentIngredient = ingredients[ingredient];
      showIngredientModal = true;
    }
  }
  
  function closeIngredientModal() {
    showIngredientModal = false;
    selectedIngredient = null;
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
      <FontAwesomeIcon icon={faTimes} />
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
          <span class="tag tag-vegan">
            <FontAwesomeIcon icon={faLeaf} />
            <span>Vegan</span>
          </span>
        {:else if item.isVegetarian}
          <span class="tag tag-vegetarian">
            <FontAwesomeIcon icon={faLeaf} />
            <span>Vegetarian</span>
          </span>
        {/if}
        {#if item.seasonal}
          <span class="tag tag-seasonal">
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>Seasonal</span>
          </span>
        {/if}
        {#if item.dietarySuitability?.glutenFree}
          <span class="tag tag-gluten-free">
            <span>Gluten-Free</span>
          </span>
        {/if}
        {#if item.dietarySuitability?.dairyFree}
          <span class="tag tag-dairy-free">
            <span>Dairy-Free</span>
          </span>
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
                <span class="toggle-icon">
                  {#if expandedSections.flavorProfile}
                    <FontAwesomeIcon icon={faChevronUp} />
                  {:else}
                    <FontAwesomeIcon icon={faChevronDown} />
                  {/if}
                </span>
              </button>
              
              {#if expandedSections.flavorProfile}
                <div class="section-content flavor-profile-section" transition:slide={{duration: 300}}>
                  <div class="flavor-bars">
                    {#each Object.entries(item.flavorProfile || {}) as [flavor, intensity], index}
                      {#if typeof intensity === 'number' && intensity > 0}
                        <div class="flavor-bar">
                          <span class="flavor-name">{flavor.charAt(0).toUpperCase() + flavor.slice(1)}</span>
                          <div class="intensity-bar">
                            <div 
                              class="intensity-fill" 
                              style="width: {intensity * 10}%; background-color: {getFlavorColor(flavor)};"
                            ></div>
                          </div>
                        </div>
                      {/if}
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
                <span class="toggle-icon">
                  {#if expandedSections.ingredients}
                    <FontAwesomeIcon icon={faChevronUp} />
                  {:else}
                    <FontAwesomeIcon icon={faChevronDown} />
                  {/if}
                </span>
              </button>
              
              {#if expandedSections.ingredients}
                <div class="section-content ingredients-section" transition:slide={{duration: 300}}>
                  <div class="ingredients-display">
                    {#each item.ingredients as ingredient}
                      {#if ingredients[ingredient] && ingredients[ingredient]?.sourceInfo?.local}
                        <button 
                          class="ingredient-card local-ingredient"
                          on:click={() => showIngredientDetails(ingredient)}
                          on:keydown={(e) => e.key === 'Enter' && showIngredientDetails(ingredient)}
                        >
                          <div class="ingredient-row">
                            <div class="ingredient-info">
                              <span class="ingredient-name">{ingredient}</span>
                              <div class="ingredient-badges">
                                {#if ingredients[ingredient]?.sourceInfo?.local}
                                  <span class="ingredient-badge local">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                    <span>Local</span>
                                  </span>
                                {/if}
                                {#if ingredients[ingredient]?.sourceInfo?.organic}
                                  <span class="ingredient-badge organic">
                                    <FontAwesomeIcon icon={faLeaf} />
                                    <span>Organic</span>
                                  </span>
                                {/if}
                              </div>
                            </div>
                          </div>
                          <div class="view-details-btn">
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <span>View Details</span>
                          </div>
                        </button>
                      {:else}
                        <div class="ingredient-card">
                          <div class="ingredient-info">
                            <span class="ingredient-name">{ingredient}</span>
                            {#if item.contains && item.contains.includes(ingredient)}
                              <span class="ingredient-badge allergen">⚠️ Allergen</span>
                            {/if}
                          </div>
                        </div>
                      {/if}
                    {/each}
                  </div>
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
                <h3>Allergens</h3>
                <span class="toggle-icon">
                  {#if expandedSections.allergens}
                    <FontAwesomeIcon icon={faChevronUp} />
                  {:else}
                    <FontAwesomeIcon icon={faChevronDown} />
                  {/if}
                </span>
              </button>
              
              {#if expandedSections.allergens}
                <div class="section-content allergens-section" transition:slide={{duration: 300}}>
                  <div class="allergens-container">
                    {#each item.contains as allergen}
                      <span class="tag tag-allergen allergen-pill">
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <span>{allergen}</span>
                      </span>
                    {/each}
                  </div>
                  <p class="allergen-note">Please inform our staff about any allergies or dietary restrictions before ordering.</p>
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
              <span class="toggle-icon">
                {#if expandedSections.nutrition}
                  <FontAwesomeIcon icon={faChevronUp} />
                {:else}
                  <FontAwesomeIcon icon={faChevronDown} />
                {/if}
              </span>
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
                <span class="toggle-icon">
                  {#if expandedSections.sourcing}
                    <FontAwesomeIcon icon={faChevronUp} />
                  {:else}
                    <FontAwesomeIcon icon={faChevronDown} />
                  {/if}
                </span>
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

{#if showIngredientModal && selectedIngredient && ingredients[selectedIngredient]}
  <IngredientModal 
    ingredient={currentIngredient} 
    parentItem={item}
    isOpen={showIngredientModal}
    on:close={closeIngredientModal}
  />
{/if}

<style lang="scss">
  @use "../../lib/styles/variables" as v;

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(36, 31, 33, 0.8);
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
    border-radius: 12px;
    padding: 25px 20px;
    position: relative;
    overflow-y: auto;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
    transform-origin: center;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.closing {
      transform: scale(0.98);
      opacity: 0.8;
    }

    @media (max-width: 480px) {
      padding: 15px;
      border-radius: 8px;
    }
  }

  .close-button {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(240, 229, 219, 0.95);
    border: none;
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
    
    svg {
      font-size: 1.2rem;
    }
    
    &:hover {
      background-color: v.$tertiary;
      color: v.$font-color-light;
      transform: rotate(90deg) scale(1.1);
    }
    
    &:active {
      transform: rotate(90deg) scale(0.95);
    }
  }

  .modal-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    border-bottom: 2px solid rgba(2, 92, 72, 0.1);
    padding-bottom: 20px;
    
    @media (min-width: 480px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: baseline;
    }
  }

  .item-name {
    font-family: "DynaPuff Regular", sans-serif;
    font-size: 2rem;
    font-weight: 600;
    color: v.$tertiary;
    margin: 0;
    line-height: 1.2;
    word-wrap: break-word;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  .item-price {
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: v.$tertiary;
    margin-top: 5px;
    
    @media (min-width: 480px) {
      margin-top: 0;
    }
  }

  .item-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
    gap: 5px;
    transition: all 0.2s ease;
    font-family: "Inter 24pt Regular", sans-serif;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    max-width: 100%;
    
    svg {
      font-size: 0.75rem;
      flex-shrink: 0;
    }
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    &.tag-vegan {
      background-color: rgba(2, 92, 72, 0.1);
      color: v.$tertiary;
      border: 1px solid rgba(2, 92, 72, 0.2);
    }
    
    &.tag-vegetarian {
      background-color: rgba(93, 92, 168, 0.1);
      color: v.$secondary;
      border: 1px solid rgba(93, 92, 168, 0.2);
    }
    
    &.tag-seasonal {
      background-color: rgba(252, 98, 52, 0.1);
      color: v.$primary;
      border: 1px solid rgba(252, 98, 52, 0.2);
    }
    
    &.tag-gluten-free {
      background-color: rgba(142, 124, 195, 0.1);
      color: #8e7cc3;
      border: 1px solid rgba(142, 124, 195, 0.2);
    }
    
    &.tag-dairy-free {
      background-color: rgba(111, 168, 220, 0.1);
      color: #6fa8dc;
      border: 1px solid rgba(111, 168, 220, 0.2);
    }
    
    &.tag-organic {
      background-color: rgba(93, 92, 168, 0.1);
      color: v.$secondary;
      border: 1px solid rgba(93, 92, 168, 0.2);
    }
    
    &.tag-local {
      background-color: rgba(2, 92, 72, 0.1);
      color: v.$tertiary;
      border: 1px solid rgba(2, 92, 72, 0.2);
    }
    
    &.tag-allergen {
      background-color: rgba(252, 98, 52, 0.1);
      color: v.$primary;
      border: 1px solid rgba(252, 98, 52, 0.2);
    }
  }

  .modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 35px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 25px;
    }
  }

  .description-section {
    .item-description {
      font-size: 1.1rem;
      line-height: 1.7;
      color: v.$font-color-dark;
      margin-bottom: 25px;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }

  .details-section {
    background-color: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    word-wrap: break-word;
    overflow-wrap: break-word;
    
    @media (max-width: 480px) {
      padding: 10px;
    }
  }

  .detail-section {
    margin-bottom: 20px;

    h3 {
      font-family: "DynaPuff Regular", sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      color: v.$tertiary;
      margin-bottom: 8px;
    }

    p {
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 1rem;
      line-height: 1.5;
      color: v.$font-color-dark;
    }
  }
  
  .collapsible-section {
    margin-bottom: 20px;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    
    .section-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 15px 20px;
      background-color: white;
      border: 1px solid rgba(2, 92, 72, 0.15);
      border-radius: 8px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: v.$tertiary-light-low-opacity;
        border-color: rgba(2, 92, 72, 0.3);
      }
      
      h3 {
        font-family: "DynaPuff Regular", sans-serif;
        font-size: 1.1rem;
        font-weight: 600;
        color: v.$tertiary;
        margin: 0;
      }
      
      .toggle-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: v.$tertiary;
        transition: transform 0.2s ease;
        
        svg {
          font-size: 1rem;
        }
        
        &:hover {
          transform: scale(1.2);
        }
      }
    }
    
    .section-content {
      padding: 20px;
      border: 1px solid rgba(2, 92, 72, 0.15);
      border-top: none;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      max-width: 100%;
      overflow: hidden;
    }
  }

  .ingredients-section {
    max-width: 100%;
    background-color: white;
    border-radius: 8px;
  }

  .ingredients-display {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
    gap: 12px;
    margin-top: 10px;
    
    @media (max-width: 480px) {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 8px;
    }
  }

  .ingredient-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background-color: white;
    border-radius: 8px;
    border: 1px solid rgba(v.$tertiary, 0.15);
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    
    &.local-ingredient {
      position: relative;
      background-color: white;
      border: 1px solid rgba(v.$tertiary, 0.2);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      
      .ingredient-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .view-details-btn {
        margin-top: 2px;
        width: 100%;
        padding: 5px 8px;
        background-color: rgba(v.$tertiary, 0.05);
        color: v.$tertiary;
        border: none;
        border-top: 1px solid rgba(v.$tertiary, 0.1);
        border-radius: 0 0 8px 8px;
        font-family: "Inter 24pt Regular", sans-serif;
        font-size: 0.75rem;
        font-weight: 500;
        transition: all 0.2s ease;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        
        svg {
          font-size: 0.75rem;
        }
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(v.$tertiary-dark, 0.1);
        border-color: v.$tertiary;
        
        .view-details-btn {
          background-color: rgba(v.$tertiary, 0.08);
          color: darken(v.$tertiary, 10%);
        }
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 1px 3px rgba(v.$tertiary-dark, 0.1);
      }
    }
    
    .ingredient-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .ingredient-name {
      font-family: "Inter 24pt Regular", sans-serif;
      font-weight: 500;
      color: v.$font-color-dark;
      font-size: 0.95rem;
    }
    
    .ingredient-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    
    .ingredient-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 6px;
      border-radius: 4px;
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 0.65rem;
      font-weight: 500;
      letter-spacing: 0.5px;
      white-space: nowrap;
      gap: 3px;
      
      svg {
        font-size: 0.7rem;
        flex-shrink: 0;
      }
      
      &.local {
        background-color: rgba(v.$tertiary, 0.1);
        color: v.$tertiary;
      }
      
      &.organic {
        background-color: rgba(v.$secondary, 0.1);
        color: v.$secondary;
      }
      
      &.allergen {
        background-color: rgba(v.$primary, 0.1);
        color: v.$primary;
      }
    }
  }
  
  .seasonality-chart-container {
    background-color: white;
    padding: 25px;
    border-radius: 12px;
    margin-top: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(v.$tertiary, 0.1);
    
    .chart-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .chart-title {
        font-weight: 600;
        color: v.$tertiary;
        font-family: "DynaPuff Regular", sans-serif;
        font-size: 1.1rem;
      }
      
      .chart-legend {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #666;
          font-family: "Inter 24pt Regular", sans-serif;
        }
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
          
          &.peak {
            background-color: v.$tertiary;
          }
          
          &.good {
            background-color: rgba(v.$tertiary, 0.5);
          }
          
          &.limited {
            background-color: rgba(v.$tertiary, 0.2);
          }
        }
      }
    }
    
    .current-month-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      padding: 8px 15px;
      background-color: rgba(v.$primary, 0.1);
      border-radius: 30px;
      width: fit-content;
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 0.9rem;
      color: v.$primary;
      border: 1px solid rgba(v.$primary, 0.2);
      
      .current-month-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: v.$primary;
      }
    }
    
    .chart-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 220px;
      margin-top: 15px;
      padding: 10px;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 8px;
    }
  }
  
  .source-info {
    background-color: rgba(v.$background-color-light, 0.5);
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
    
    p {
      margin: 8px 0;
      font-size: 0.95rem;
      line-height: 1.6;
      color: v.$font-color-dark;
      font-family: "Inter 24pt Regular", sans-serif;
      
      strong {
        color: v.$tertiary;
        font-weight: 600;
      }
    }
  }
  
  .nutrition-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-top: 12px;

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
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease;
    border: 1px solid rgba(v.$tertiary-light, 0.1);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-color: rgba(v.$tertiary-light, 0.3);
    }
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
    color: v.$font-color-dark;
    margin-top: 5px;
    opacity: 0.8;
  }
  
  .source-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 15px;
    
    .source-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: white;
      border: 1px solid rgba(v.$tertiary, 0.2);
      padding: 6px 12px;
      border-radius: 20px;
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 0.8rem;
      color: v.$font-color-dark;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
      transition: all 0.2s ease;
      
      &:hover {
        background-color: v.$tertiary-light-low-opacity;
        border-color: rgba(v.$tertiary, 0.4);
        transform: translateY(-2px);
      }
      
      .source-icon {
        color: v.$tertiary;
        font-size: 0.9rem;
      }
    }
  }

  .sustainability-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin: 25px 0;
    
    .metric-card {
      background-color: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      border: 1px solid rgba(v.$tertiary-light, 0.15);
      transition: all 0.25s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        border-color: rgba(v.$tertiary, 0.3);
      }
      
      .metric-value {
        font-family: "DynaPuff Regular", sans-serif;
        font-size: 2rem;
        font-weight: 700;
        color: v.$tertiary;
        margin-bottom: 10px;
      }
      
      .metric-label {
        font-family: "Inter 24pt Regular", sans-serif;
        font-size: 0.9rem;
        color: v.$font-color-dark;
        line-height: 1.4;
      }
    }
  }

  .allergens-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 15px;
  }

  .allergen-note {
    font-size: 0.85rem;
    color: #777;
    font-style: italic;
    margin-top: 12px;
    font-family: "Inter 24pt Regular", sans-serif;
    padding: 10px;
    background-color: rgba(252, 98, 52, 0.05);
    border-radius: 6px;
    border-left: 2px solid rgba(252, 98, 52, 0.3);
  }

  .tab-content {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
