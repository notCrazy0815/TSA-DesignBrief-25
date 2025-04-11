<script lang="ts">
  import { fade } from 'svelte/transition';
  import MenuItemModal from './MenuItemModal.svelte';
  import { basket } from '$lib/stores/basketStore';
  
  export let item: {
    id: number;
    name: string;
    description: string;
    price: string;
    isVegan: boolean;
    isVegetarian: boolean;
    contains: string[];
    seasonal: boolean;
    nutrition: {
      calories: number;
      protein: number;
      fat: number;
      carbs: number;
      sugar?: number;
      fiber?: number;
      sodium?: number;
    };
    ingredients?: string[];
    preparation?: string;
    pairingRecommendation?: string;
    sourceInfo?: {
      local?: boolean;
      organic?: boolean;
      sources?: {name: string, location: string}[];
    };
    dietarySuitability?: {
      glutenFree?: boolean;
      dairyFree?: boolean;
      nutFree?: boolean;
      lowCarb?: boolean;
      keto?: boolean;
      paleo?: boolean;
    };
  };
  
  export const index = 0;

  let isClicked = false;
  let isModalOpen = false;

  $: basketItem = $basket.find(basketItem => basketItem.id === item.id);
  $: isInBasket = !!basketItem;
  $: basketQuantity = basketItem?.quantity || 0;

  function handleClick() {
    isClicked = true;
    setTimeout(() => {
      isClicked = false;
      openModal();
    }, 200);
  }

  function addToBasket(event: MouseEvent) {
    event.stopPropagation();
    basket.addToBasket(item);
  }
  
  function removeFromBasket(event: MouseEvent) {
    event.stopPropagation();
    basket.removeFromBasket(item.id);
  }

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }
</script>

<div 
  class="menu-item {isClicked ? 'clicked' : ''}" 
  on:click={handleClick}
  on:keydown={handleKeyDown}
  tabindex="0"
  role="button"
  aria-label="Menu item: {item.name}"
>
  <div class="item-header">
    <h3 class="item-name">{item.name}</h3>
    <div class="item-price">{item.price}</div>
  </div>
  
  <p class="item-description">{item.description}</p>
  
  <div class="item-footer">
    {#if item.isVegan || item.isVegetarian || item.seasonal}
      <div class="badges">
        {#if item.isVegan}
          <span class="badge vegan">V</span>
        {/if}
        {#if item.isVegetarian && !item.isVegan}
          <span class="badge vegetarian">VG</span>
        {/if}
        {#if item.seasonal}
          <span class="badge seasonal">S</span>
        {/if}
      </div>
    {/if}
    {#if item.contains?.length > 0}
      <div class="allergen-info">
        <span class="allergen-label">Contains:</span> 
        <span class="allergens">{item.contains.join(', ')}</span>
      </div>
    {/if}
  </div>
  
  <div class="item-actions">
    <button class="view-details-btn" on:click|stopPropagation={openModal}>
      View Details
    </button>
    
    <div class="basket-controls">
      {#if isInBasket}
        <button 
          class="basket-btn remove-btn" 
          on:click|stopPropagation={removeFromBasket}
          aria-label="Remove from basket"
        >
          <span class="btn-icon">−</span>
        </button>
        
        <span class="basket-quantity-display">{basketQuantity}</span>
      {/if}
      
      <button 
        class="basket-btn add-btn" 
        on:click|stopPropagation={addToBasket}
        aria-label="Add to basket"
      >
        <span class="btn-icon">+</span>
      </button>
    </div>
  </div>
</div>

<MenuItemModal {item} isOpen={isModalOpen} on:close={closeModal} />

<style lang="scss">
@use "../../lib/styles/variables" as v;

.menu-item {
  padding: 20px;
  position: relative;
  background-color: #fbf9f6;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  @media (max-width: 767px) {
    padding: 12px 15px;
    gap: 4px;
  }
  
  &:hover {
    background-color: transparent;
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    .item-name {
      color: v.$tertiary;
    }
    
    .view-details-btn {
      opacity: 1;
    }
  }
  
  &.clicked {
    transform: scale(0.95);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.item-name {
  font-family: "Inter 24pt Regular", sans-serif;
  font-size: 1.1rem;
  color: #333;
  margin: 0;
  font-weight: 600;
  
  @media (max-width: 767px) {
    font-size: 0.95rem;
  }
}

.item-price {
  font-family: "Inter 24pt Regular", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: v.$tertiary;
  
  @media (max-width: 767px) {
    font-size: 0.9rem;
  }
}

.item-description {
  font-family: "Inter 24pt Regular", sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #333;
  margin: 0 0 8px;

  @media (max-width: 767px) {
    display: none;
  }
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  
  @media (max-width: 767px) {
    margin-top: 4px;
  }
}

.badges {
  display: flex;
  gap: 8px;

  .badge {
    width: 22px;
    height: 22px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
    color: white;
    border: 1.5px solid rgba(0, 0, 0, 0.08);
    position: relative;
    
    @media (max-width: 767px) {
      width: 18px;
      height: 18px;
      font-size: 0.65rem;
    }
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
}

.allergen-info {
  font-family: "Inter 24pt Regular", sans-serif;
  font-size: 0.8rem;
  color: #666;
  
  @media (max-width: 767px) {
    font-size: 0.7rem;
  }

  .allergen-label {
    font-weight: 600;
    color: #444;
  }

  .allergens {
    font-style: italic;
    color: #333;
  }
}

.view-details-btn {
  margin-top: 10px;
  align-self: center;
  background-color: transparent;
  border: 1px solid v.$tertiary;
  color: v.$tertiary;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  
  &:hover {
    background-color: v.$tertiary;
    color: white;
  }
  
  @media (max-width: 767px) {
    opacity: 1;
    margin-top: 8px;
    width: 100%;
    padding: 8px;
    background-color: rgba(2, 92, 72, 0.05);
  }
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  gap: 12px;
}

.basket-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  
  .basket-quantity-display {
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    width: 24px;
    text-align: center;
  }
}

.basket-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter 24pt Regular", sans-serif;
  font-size: 1.2rem;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    transform: scale(0);
    transition: transform 0.3s ease;
    border-radius: 50%;
    z-index: 0;
  }
  
  &:active::before {
    transform: scale(1.5);
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .btn-icon {
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 1;
    z-index: 1;
    position: relative;
    transition: transform 0.2s ease;
  }
  
  &:hover {
    .btn-icon {
      transform: scale(1.2);
    }
  }
}

.add-btn {
  background-color: v.$tertiary;
  
  &:hover {
    background-color: darken(v.$tertiary, 5%);
  }
}

.remove-btn {
  background-color: #e74c3c;
  
  &:hover {
    background-color: darken(#e74c3c, 5%);
  }
}
</style>
