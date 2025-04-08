<script lang="ts">
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
    };
  };
  
  // Change to export const to fix the warning
  export const index = 0;

  let isClicked = false;

  function handleClick() {
    isClicked = true;
    setTimeout(() => {
      isClicked = false;
    }, 200);
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
</div>

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
  font-family: "Inter 24pt Regular", sans-serif; // Changed from "DynaPuff Regular" to normal body font
  font-size: 1.1rem;
  color: #333;
  margin: 0;
  font-weight: 600; // Increased from 500 to 600 for better visibility
  
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
    display: none; /* Hide description on mobile */
  }
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto; // Push to bottom of flex container
  
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
    border-radius: 3px; // Slightly less rounded corners
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
    color: white;
    border: 1.5px solid rgba(0, 0, 0, 0.08); // Simple border
    position: relative;
    
    @media (max-width: 767px) {
      width: 18px;
      height: 18px;
      font-size: 0.65rem;
    }
  }

  .vegan { 
    color: v.$tertiary; // Simple solid color
    border-color: v.$tertiary; // Simple solid color
  }
  
  .vegetarian { 
    color: v.$secondary; // Simple solid color
    border-color: v.$secondary; // Simple solid color
  }
  
  .seasonal { 
    color: v.$primary; // Simple solid color
    border-color: v.$primary; // Simple solid color
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
</style>
