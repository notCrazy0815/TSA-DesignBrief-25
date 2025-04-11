<script>
  import { fly, fade } from "svelte/transition";
  import IngredientSourceModal from "./IngredientSourceModal.svelte";
  
  export let item = null;
  export let onClose = () => {};
  export let onPairingClick = null;
  
  let selectedIngredient = null;
  
  function handlePairingClick(pairingName) {
    console.log(`Pairing clicked: ${pairingName}`);
    
    if (typeof onPairingClick === 'function') {
      onPairingClick(pairingName);
    }
  }
  
  function getUniquePairings() {
    if (!item?.detailed?.pairings || !Array.isArray(item.detailed.pairings)) 
      return [];
      
    return [...new Set(item.detailed.pairings)];
  }
  
  function handleIngredientClick(ingredientSource) {
    if (ingredientSource) {
      selectedIngredient = ingredientSource;
    }
  }
  
  function closeIngredientModal() {
    selectedIngredient = null;
  }
  
  function hasSourceInfo(ingredientName) {
    if (!item?.detailed?.ingredientSources) return false;
    
    return item.detailed.ingredientSources.some(src => 
      src.name.toLowerCase() === ingredientName.toLowerCase());
  }
  
  function getSourceInfo(ingredientName) {
    if (!item?.detailed?.ingredientSources) return null;
    
    return item.detailed.ingredientSources.find(src => 
      src.name.toLowerCase() === ingredientName.toLowerCase());
  }
</script>

{#if item}
  <div class="menu-item-modal" in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
    <div class="modal-backdrop" on:click={onClose}></div>
    <div class="modal-content" in:fly={{ y: 20, duration: 400 }}>
      <button class="modal-close" on:click={onClose} aria-label="Close details">
        <span>×</span>
      </button>
      
      <div class="modal-layout">
        {#if item.detailed?.image}
          <div class="modal-image" style="background-image: url('{item.detailed.image}')">
            <div class="image-overlay"></div>
          </div>
        {/if}
        
        <div class="modal-header">
          <h3>{item.name}</h3>
          <div class="modal-tags">
            {#if item.tags?.includes('vegan')}
              <span class="diet-symbol vegan" title="Vegan">V</span>
            {:else if item.tags?.includes('vegetarian')}
              <span class="diet-symbol vegetarian" title="Vegetarian">VG</span>
            {/if}
            {#if item.tags?.includes('gluten-free')}
              <span class="diet-symbol gluten-free" title="Gluten-Free">GF</span>
            {/if}
            {#if item.isNew}
              <span class="new-tag">NEW</span>
            {/if}
          </div>
          <div class="price-tag">${item.price}</div>
        </div>
        
        {#if item.detailed}
          <div class="modal-description">
            <p>{item.detailed.description}</p>
          </div>
          
          <div class="modal-info-grid">
            {#if item.detailed.ingredients?.length > 0}
              <div class="modal-info-section">
                <h4>
                  Ingredients
                  {#if item.detailed.ingredientSources?.length > 0}
                    <span class="farm-to-table-badge">Farm to Table</span>
                  {/if}
                </h4>
                <ul class="ingredients-list">
                  {#each item.detailed.ingredients as ingredient}
                    {#if hasSourceInfo(ingredient)}
                      <li 
                        class="ingredient-item traceable" 
                        on:click={() => handleIngredientClick(getSourceInfo(ingredient))}
                        title="Click to see source information"
                      >
                        <span class="ingredient-name">{ingredient}</span>
                        <span class="source-icon">
                          <span class="icon-text">TN</span>
                        </span>
                      </li>
                    {:else}
                      <li>{ingredient}</li>
                    {/if}
                  {/each}
                </ul>
              </div>
            {/if}
            
            {#if item.detailed.nutrition}
              <div class="modal-info-section">
                <h4>Nutrition</h4>
                <div class="nutrition-info">
                  {#if item.detailed.nutrition.calories}
                    <div class="nutrition-item">
                      <span class="nutrition-label">Calories</span>
                      <span class="nutrition-value">{item.detailed.nutrition.calories}</span>
                    </div>
                  {/if}
                  {#if item.detailed.nutrition.protein}
                    <div class="nutrition-item">
                      <span class="nutrition-label">Protein</span>
                      <span class="nutrition-value">{item.detailed.nutrition.protein}</span>
                    </div>
                  {/if}
                  {#if item.detailed.nutrition.carbs}
                    <div class="nutrition-item">
                      <span class="nutrition-label">Carbs</span>
                      <span class="nutrition-value">{item.detailed.nutrition.carbs}</span>
                    </div>
                  {/if}
                  {#if item.detailed.nutrition.fat}
                    <div class="nutrition-item">
                      <span class="nutrition-label">Fat</span>
                      <span class="nutrition-value">{item.detailed.nutrition.fat}</span>
                    </div>
                  {/if}
                  {#if item.detailed.nutrition.sugar}
                    <div class="nutrition-item">
                      <span class="nutrition-label">Sugar</span>
                      <span class="nutrition-value">{item.detailed.nutrition.sugar}</span>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
          
          {#if item.detailed.allergens?.length > 0}
            <div class="modal-allergens">
              <h4>Allergens</h4>
              <div class="allergen-chips">
                {#each item.detailed.allergens as allergen}
                  <span class="allergen-chip">{allergen}</span>
                {/each}
              </div>
            </div>
          {/if}
          
          {#if item.detailed.pairings?.length > 0}
            <div class="modal-pairings">
              <h4>Recommended Pairings</h4>
              <div class="pairings-list">
                {#each getUniquePairings() as pairing}
                  <button 
                    class="pairing-item" 
                    on:click|stopPropagation={() => handlePairingClick(pairing)}
                    type="button"
                  >
                    <span class="pairing-name">{pairing}</span>
                    <span class="pairing-view">View</span>
                  </button>
                {/each}
              </div>
            </div>
          {:else if item.detailed.recommended}
            <div class="modal-pairings">
              <h4>Chef Recommends</h4>
              <div class="pairings-list">
                <p class="pairing-note">{item.detailed.recommended}</p>
              </div>
            </div>
          {/if}
          
          {#if item.detailed.ingredientSources?.length > 0}
            <div class="farm-to-table-section">
              <h4>Our Farm-to-Table Commitment</h4>
              <p class="farm-to-table-description">
                We pride ourselves on sourcing ingredients locally from sustainable farms around Nashville. 
                Click on highlighted ingredients to learn about their origins and our partners.
              </p>
              <div class="local-sources-badge">
                <span class="badge-percentage">{Math.round((item.detailed.ingredientSources.length / item.detailed.ingredients.length) * 100)}%</span> 
                locally sourced ingredients
              </div>
            </div>
          {/if}
        {:else}
          <div class="modal-description">
            <p>We're working on adding more information about this item. Please ask your server for details.</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

{#if selectedIngredient}
  <IngredientSourceModal 
    ingredient={selectedIngredient} 
    onClose={closeIngredientModal} 
  />
{/if}

<style lang="scss">
  @use "../styles/variables" as v;
  
  .menu-item-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(v.$font-color-dark, 0.75);
      backdrop-filter: blur(5px);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .modal-content {
      position: relative;
      width: 90%;
      max-width: 800px;
      max-height: 85vh;
      background-color: white;
      border-radius: 10px;
      box-shadow: 
        0 10px 35px rgba(0, 0, 0, 0.12),
        0 2px 15px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      z-index: 1001;
      
      &::before {
        content: "";
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        bottom: 1px;
        border-radius: 9px;
        border: 1px solid rgba(v.$tertiary, 0.08);
        pointer-events: none;
      }
    }
    
    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: white;
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: all 0.2s ease;
      
      span {
        font-size: 1.7rem;
        line-height: 0;
        margin-top: -2px;
        color: #666;
        transition: all 0.2s ease;
        font-family: "Inter 24pt Regular", sans-serif;
      }
      
      &:hover {
        background-color: v.$tertiary;
        transform: scale(1.05) rotate(90deg);
        
        span {
          color: white;
        }
      }
    }
  }
  
  .modal-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(v.$tertiary-light, 0.03);
      border-radius: 0 10px 10px 0;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(v.$tertiary, 0.15);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: rgba(v.$tertiary, 0.25);
    }
  }
  
  .modal-image {
    width: 100%;
    height: 240px;
    background-size: cover;
    background-position: center;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    position: relative;
    
    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100px;
      background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.6));
      z-index: 1;
    }
  }
  
  .modal-header {
    padding: 26px 28px 16px;
    border-bottom: 1px solid rgba(v.$tertiary-light, 0.1);
    position: relative;
    
    h3 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.8rem;
      color: v.$tertiary-dark;
      margin: 0 0 8px;
      padding-right: 80px;
      line-height: 1.3;
    }
    
    .price-tag {
      position: absolute;
      top: 26px;
      right: 28px;
      background: v.$primary;
      color: white;
      font-size: 1.1rem;
      font-weight: 600;
      padding: 8px 15px;
      border-radius: 6px;
      font-family: "Inter 24pt Regular", sans-serif;
      box-shadow: 0 2px 8px rgba(v.$primary, 0.25);
      letter-spacing: 0.5px;
    }
  }
  
  .modal-tags {
    display: flex;
    gap: 8px;
    margin: 5px 0 10px;
  }
  
  .diet-symbol {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 3px;
    font-size: 0.65rem;
    font-weight: 600;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    font-family: "Inter 24pt Regular", sans-serif;
    background-color: rgba(v.$tertiary-light, 0.08);
    color: v.$tertiary;
    
    &.vegan { 
      background-color: rgba(76, 175, 80, 0.08);
      color: #4CAF50; 
    }
    &.vegetarian { 
      background-color: rgba(255, 152, 0, 0.08);
      color: #FF9800; 
    }
    &.gluten-free { 
      background-color: rgba(141, 110, 99, 0.08);
      color: #8D6E63; 
    }
    &.seasonal { 
      background-color: rgba(255, 87, 34, 0.08);
      color: #FF5722;
    }
    &.spicy { 
      background-color: rgba(244, 67, 54, 0.08);
      color: #F44336;
      font-size: 0.8rem;
    }
  }

  .new-tag {
    background-color: v.$primary;
    color: white;
    font-size: 0.65rem;
    padding: 2px 6px;
    border-radius: 2px;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-left: 6px;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .modal-description {
    padding: 22px 28px;
    background-color: rgba(v.$tertiary-light, 0.02);
    border-bottom: 1px solid rgba(v.$tertiary-light, 0.05);
    
    p {
      font-size: 1rem;
      line-height: 1.6;
      color: #444;
      margin: 0;
      font-weight: 300;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .modal-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    padding: 22px 28px;
    background-color: white;
  }
  
  .modal-info-section {
    h4 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.2rem;
      color: v.$tertiary;
      margin: 0 0 14px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(v.$tertiary-light, 0.15);
      position: relative;
    }
  }
  
  .ingredients-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    li {
      background-color: rgba(v.$tertiary-light, 0.03);
      border: 1px solid rgba(v.$tertiary-light, 0.1);
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 0.9rem;
      color: #555;
      transition: all 0.15s ease;
      font-family: "Inter 24pt Regular", sans-serif;
      
      &:hover {
        background-color: rgba(v.$tertiary-light, 0.06);
        transform: translateY(-1px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
      }
    }
    
    .ingredient-item.traceable {
      position: relative;
      cursor: pointer;
      border: 1px solid rgba(67, 160, 71, 0.2);
      background-color: rgba(67, 160, 71, 0.05);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      &:hover {
        background-color: rgba(67, 160, 71, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
      }
      
      .source-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        background-color: #43A047;
        border-radius: 50%;
        margin-left: 8px;
        
        .icon-text {
          color: white;
          font-size: 0.6rem;
          font-weight: bold;
          font-family: "Inter 24pt Regular", sans-serif;
        }
      }
    }
  }
  
  .nutrition-info {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
  }
  
  .nutrition-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 14px 10px;
    background-color: rgba(v.$tertiary-light, 0.02);
    border-radius: 6px;
    text-align: center;
    border: 1px solid rgba(v.$tertiary-light, 0.08);
    transition: transform 0.15s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 8px rgba(v.$tertiary-light, 0.1);
    }
    
    .nutrition-label {
      font-size: 0.75rem;
      color: #777;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .nutrition-value {
      font-size: 1.2rem;
      font-weight: 600;
      color: v.$tertiary-dark;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .modal-allergens {
    padding: 0 28px 24px;
    
    h4 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.2rem;
      color: v.$tertiary;
      margin: 0 0 14px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(v.$tertiary-light, 0.15);
      position: relative;
    }
  }
  
  .allergen-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .allergen-chip {
    background-color: #FFF3E0;
    border: 1px solid rgba(230, 81, 0, 0.1);
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 0.85rem;
    color: #E65100;
    font-weight: 500;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .modal-pairings {
    padding: 20px 28px 28px;
    background-color: rgba(v.$secondary, 0.03);
    border-top: 1px solid rgba(v.$secondary, 0.1);
    
    h4 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.2rem;
      color: v.$secondary;
      margin: 0 0 14px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(v.$secondary, 0.15);
      position: relative;
    }
  }
  
  .pairings-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 14px;
  }
  
  .pairing-item {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    background-color: rgba(v.$secondary, 0.02);
    border-radius: 3px;
    border-left: 3px solid v.$secondary;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    transition: all 0.15s ease;
    cursor: pointer;
    position: relative;
    justify-content: space-between;
    width: 100%;
    text-align: left;
    border: none;
    border-left: 3px solid v.$secondary; 
    font-family: inherit;
    outline: none;
    
    &:hover {
      background-color: rgba(v.$secondary, 0.05);
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      
      .pairing-view {
        opacity: 1;
      }
    }
    
    &:active {
      background-color: rgba(v.$secondary, 0.08);
    }
    
    .pairing-name {
      font-size: 0.95rem;
      color: #444;
      font-weight: 400;
      font-family: "Inter 24pt Regular", sans-serif;
      flex-grow: 1;
    }
    
    .pairing-view {
      font-size: 0.75rem;
      font-weight: 500;
      color: v.$secondary;
      background-color: rgba(v.$secondary, 0.08);
      padding: 2px 8px;
      border-radius: 3px;
      opacity: 0.7;
      transition: all 0.2s ease;
      
      &::after {
        content: "→";
        margin-left: 4px;
        font-size: 0.9em;
      }
    }
  }
  
  .pairing-note {
    font-style: italic;
    color: #555;
    padding: 16px;
    background-color: white;
    border-left: 2px solid v.$secondary;
    border-radius: 4px;
    line-height: 1.6;
    margin: 0;
    box-shadow: 0 2px 8px rgba(v.$secondary, 0.05);
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .farm-to-table-badge {
    display: inline-block;
    font-size: 0.7rem;
    background-color: #43A047;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: 8px;
    font-weight: bold;
    letter-spacing: 0.5px;
    vertical-align: middle;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .farm-to-table-section {
    padding: 20px 28px 28px;
    background-color: rgba(67, 160, 71, 0.05);
    border-top: 1px solid rgba(67, 160, 71, 0.1);
    
    h4 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.2rem;
      color: #2E7D32;
      margin: 0 0 12px;
    }
    
    .farm-to-table-description {
      line-height: 1.6;
      color: #444;
      margin-bottom: 15px;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .local-sources-badge {
      display: inline-block;
      font-size: 0.85rem;
      background-color: white;
      color: #2E7D32;
      padding: 8px 14px;
      border-radius: 6px;
      font-weight: 500;
      border: 1px solid rgba(67, 160, 71, 0.2);
      font-family: "Inter 24pt Regular", sans-serif;
      
      .badge-percentage {
        font-weight: bold;
        font-size: 1.1rem;
      }
    }
  }

  @media screen and (max-width: 600px) {
    .modal-content {
      width: 95%;
      max-height: 90vh;
      border-radius: 8px;
    }
    
    .modal-image {
      height: 160px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    
    .modal-header {
      padding: 20px 22px 14px;
      
      h3 {
        font-size: 1.5rem;
      }
      
      .price-tag {
        top: 20px;
        right: 22px;
        padding: 6px 12px;
        font-size: 1rem;
      }
    }
    
    .modal-close {
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      
      span {
        font-size: 1.5rem;
      }
    }
    
    .modal-info-grid {
      grid-template-columns: 1fr;
      padding: 18px 22px;
      gap: 22px;
    }
    
    .modal-description {
      padding: 18px 22px;
      
      p {
        font-size: 0.95rem;
      }
    }
    
    .modal-allergens, .modal-pairings {
      padding: 0 22px 22px;
    }
    
    .nutrition-info {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .nutrition-item {
      padding: 10px 8px;
    }
  }
</style>
