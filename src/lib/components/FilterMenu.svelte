<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { fade } from 'svelte/transition';

  export let category: string;
  const dispatch = createEventDispatcher();

  let filterMenuEl: HTMLElement;

  // Set default filters - vegetarian is standard selected
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
    sesame: false, // Add sesame filter
    seasonal: false,
    spicy: false
  };

  // Updated allergen items with more descriptive labels
  const filterGroups: {
    id: string;
    label: string;
    icon: string;
    helpText: string;
    exclusive?: boolean;
    items?: {id: string, label: string, description?: string}[];
  }[] = [
    {
      id: 'allergies',
      label: 'Allergen-Free',
      icon: 'A',
      helpText: 'Select allergens you want to exclude',
      items: [
        { id: 'gluten', label: 'Gluten', description: 'Wheat, barley, rye' },
        { id: 'dairy', label: 'Dairy', description: 'Milk, cheese, yogurt' },
        { id: 'nuts', label: 'Nuts', description: 'Tree nuts, peanuts' },
        { id: 'soy', label: 'Soy', description: 'Soybeans, tofu' },
        { id: 'eggs', label: 'Eggs', description: 'All egg products' },
        { id: 'shellfish', label: 'Shellfish', description: 'Shrimp, crab, lobster' },
        { id: 'fish', label: 'Fish', description: 'Salmon, tuna, cod' },
        { id: 'sesame', label: 'Sesame', description: 'Seeds, tahini, oil' } // Add sesame to the allergen list
      ]
    },
    {
      id: 'special',
      label: 'Special',
      icon: 'S',
      helpText: 'Additional filters',
      items: [
        { id: 'seasonal', label: 'Seasonal' },
        { id: 'spicy', label: 'Spicy' }
      ]
    }
  ];

  let expandedGroup: string | null = null;

  // Toggle for diet preference
  function toggleDiet(type: 'vegetarian' | 'vegan'): void {
    activeFilters.vegetarian = type === 'vegetarian';
    activeFilters.vegan = type === 'vegan';
    
    dispatch('filterChange', activeFilters);
  }

  // Regular filter toggles
  function toggleFilter(groupId: string, itemId: string): void {
    if (filterGroups.find(g => g.id === groupId)?.exclusive) {
      Object.keys(activeFilters).forEach(key => {
        if (key.startsWith(groupId)) {
          activeFilters[key] = (key === itemId);
        }
      });
    } else {
      activeFilters[itemId] = !activeFilters[itemId];
    }
    
    dispatch('filterChange', activeFilters);
  }

  function clearFilters(): void {
    Object.keys(activeFilters).forEach(key => {
      activeFilters[key] = key === 'vegetarian';
    });
    
    dispatch('filterChange', activeFilters);
  }

  function toggleGroup(groupId: string): void {
    expandedGroup = expandedGroup === groupId ? null : groupId;
  }

  onMount(() => {
    // Simple animation on mount - no scroll tracking
    gsap.from('.filter-group', { 
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4,
      ease: "power2.out"
    });
  });
</script>

<div class="smart-filter" bind:this={filterMenuEl}>
  <div class="filter-header">
    <h3>Filter {category}</h3>
    <button class="clear-button" on:click={clearFilters}>
      <span class="reset-icon">↺</span>
      Reset
    </button>
  </div>

  <div class="diet-toggle">
    <div class="diet-heading">Diet Preference</div>
    <div class="toggle-buttons">
      <button 
        class="diet-button" 
        class:active={activeFilters.vegetarian} 
        on:click={() => toggleDiet('vegetarian')}
      >
        Vegetarian
      </button>
      <button 
        class="diet-button" 
        class:active={activeFilters.vegan} 
        on:click={() => toggleDiet('vegan')}
      >
        Vegan
      </button>
    </div>
    
    <div class="info-box">
      <span class="info-icon">i</span>
      <p>Vegan dishes are included when Vegetarian is selected</p>
    </div>
  </div>

  <div class="filter-groups">
    {#each filterGroups as group}
      <div class="filter-group">
        <button 
          class="group-header" 
          on:click={() => toggleGroup(group.id)}
          aria-expanded={expandedGroup === group.id}
        >
          <span class="group-icon">{group.icon}</span>
          <span class="group-label">{group.label}</span>
          <span class="expand-icon">{expandedGroup === group.id ? '−' : '+'}</span>
        </button>

        {#if expandedGroup === group.id}
          <div class="group-options" transition:fade={{duration: 150}}>
            <p class="help-text">{group.helpText}</p>
            
            {#if group.items}
              <div class="option-buttons">
                {#each group.items as item}
                  <button 
                    class="filter-chip" 
                    class:active={activeFilters[item.id]} 
                    on:click={() => toggleFilter(group.id, item.id)}
                    title={item.description || ''}
                  >
                    {item.label}
                  </button>
                {/each}
              </div>
            {:else}
              <div class="toggle-switch">
                <label class="switch">
                  <input 
                    type="checkbox" 
                    checked={activeFilters[group.id]} 
                    on:change={() => toggleFilter('', group.id)}
                  >
                  <span class="slider"></span>
                </label>
              </div>
            {/if}
          </div>
        {/if}
        
        {#if expandedGroup !== group.id && group.items?.some(item => activeFilters[item.id])}
          <div class="active-indicators">
            {#each group.items.filter(item => activeFilters[item.id]) as activeItem}
              <span class="active-pill">{activeItem.label}</span>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @use "../../lib/styles/variables" as v;

  .smart-filter {
    position: relative;
    background-color: white;
    border: 1px solid rgba(160, 147, 125, 0.2);
    border-radius: 4px;
    padding: 22px 20px;
    box-shadow: 0 6px 16px rgba(106, 89, 72, 0.05);
    
    z-index: 10;
    
    @media (min-width: 992px) {
      position: sticky;
      top: 120px; // Simple sticky positioning without complex scroll logic
      align-self: flex-start;
      border-left: 3px solid v.$tertiary;
    }
    
    @media (max-width: 991px) {
      padding: 18px 15px;
      
    }
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(160, 147, 125, 0.2);
    
    h3 {
      font-family: "DynaPuff Regular", cursive;
      color: #4a3c31;
      font-size: 1.4rem;
      font-weight: 500;
      margin: 0;
      
      @media (min-width: 992px) {
        font-size: 1.2rem;
      }
    }
    
    .clear-button {
      background: none;
      border: 1px solid v.$tertiary;
      color: v.$tertiary;
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 0.9rem;
      cursor: pointer;
      padding: 6px 14px;
      border-radius: 4px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      
      .reset-icon {
        font-size: 1.1rem;
      }
      
      &:hover {
        background-color: v.$tertiary-light-low-opacity;
        color: v.$tertiary-dark;
      }
    }
  }
  
  .diet-toggle {
    margin-bottom: 22px;
    
    .diet-heading {
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      color: #4a3c31;
      margin-bottom: 12px;
    }
    
    .toggle-buttons {
      display: flex;
      gap: 15px;
      
      @media (min-width: 992px) {
        flex-direction: column;
        gap: 10px;
      }
      
      @media (min-width: 768px) and (max-width: 991px) {
        flex-direction: row;
      }
      
      @media (max-width: 767px), (min-width: 992px) {
        flex-direction: column;
        gap: 10px;
      }
      
      .diet-button {
        flex: 1;
        background: white;
        border: 1px solid rgba(160, 147, 125, 0.3); 
        border-radius: 4px;
        padding: 12px;
        font-family: "Inter 24pt Regular", sans-serif;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #4a3c31;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          border-color: v.$tertiary;
        }
        
        &.active {
          background-color: v.$tertiary;
          color: white;
          border-color: v.$tertiary;
        }
      }
    }
    
    .info-box {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 12px;
      padding: 10px 12px;
      border-radius: 2px;
      background-color: rgba(160, 147, 125, 0.1);
      
      .info-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 20px;
        height: 20px;
        border-radius: 2px;
        background-color: rgba(2, 92, 72, 0.1);
        color: v.$tertiary;
        font-family: serif;
        font-style: italic;
        font-weight: bold;
        font-size: 0.8rem;
      }
      
      p {
        margin: 0;
        font-family: "Inter 24pt Regular", sans-serif;
        font-size: 0.8rem;
        color: #4a3c31;
        line-height: 1.4;
      }
    }
  }
  
  .filter-groups {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    @media (min-width: 992px) {
      padding-right: 5px;
      margin-top: 5px;
      
      // Don't set a fixed max-height as we'll control this with JS
      
      // Improved scrollbar styling for content
      &::-webkit-scrollbar {
        width: 4px;
      }
      
      &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 10px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(160, 147, 125, 0.3);
        border-radius: 10px;
      }
      
      &::-webkit-scrollbar-thumb:hover {
        background: rgba(160, 147, 125, 0.5);
      }
    }
    
    @media (min-width: 768px) and (max-width: 991px) {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      max-width: 100%;
    }
    
    @media (max-width: 767px) {
      flex-direction: column;
    }
  }
  
  .filter-group {
    border: 1px solid rgba(160, 147, 125, 0.2);
    border-radius: 4px;
    overflow: hidden;
    
    .group-header {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 15px;
      border: none;
      background-color: rgba(160, 147, 125, 0.05);
      cursor: pointer;
      text-align: left;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: rgba(160, 147, 125, 0.1);
      }
      
      .group-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 2px;
        background-color: v.$tertiary;
        color: white;
        font-weight: 500;
        margin-right: 15px;
      }
      
      .group-label {
        font-family: "Inter 24pt Regular", sans-serif;
        font-weight: 500;
        flex-grow: 1;
        color: #4a3c31;
      }
      
      .expand-icon {
        font-size: 1.2rem;
        color: #4a3c31;
        opacity: 0.6;
      }
    }
    
    .group-options {
      padding: 5px 15px 15px;
      
      .help-text {
        font-family: "Inter 24pt Regular", sans-serif;
        font-size: 0.8rem;
        color: #695a4e;
        margin: 0 0 12px;
        font-style: italic;
        opacity: 0.8;
      }
      
      .option-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .filter-chip {
        background-color: #fff;
        border: 1px solid rgba(160, 147, 125, 0.3);
        border-radius: 4px;
        padding: 7px 14px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
        font-family: "Inter 24pt Regular", sans-serif;
        color: #4a3c31;
        position: relative;
        
        &:hover {
          border-color: v.$tertiary;
        }
        
        &.active {
          background-color: v.$tertiary;
          border-color: v.$tertiary;
          color: white;
          box-shadow: 0 2px 4px rgba(2, 92, 72, 0.2);
        }

        &:hover::after {
          content: attr(title);
          position: absolute;
          bottom: calc(100% + 5px);
          left: 50%;
          transform: translateX(-50%);
          padding: 5px 8px;
          background: rgba(0,0,0,0.7);
          color: white;
          border-radius: 4px;
          font-size: 0.75rem;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0.9;
          z-index: 100;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
      }
    }
    
    .active-indicators {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 15px 12px;
      
      .active-pill {
        font-family: "Inter 24pt Regular", sans-serif;
        font-size: 0.75rem;
        background-color: rgba(2, 92, 72, 0.1);
        color: v.$tertiary;
        border-radius: 4px;
        padding: 3px 10px;
      }
    }
  }

  @media (max-width: 767px) {
    .smart-filter {
      padding: 18px ;
    }
    
    .filter-header h3 {
      font-size: 1.2rem;
    }
    
    .diet-toggle .toggle-buttons {
      flex-direction: column;
      gap: 10px;
    }
    
    .filter-group .group-header {
      padding: 12px;
      
      .group-icon {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
      
      .group-label {
        font-size: 0.9rem;
      }
    }
    
    .filter-chip {
      padding: 6px 12px;
      font-size: 0.8rem;
    }
  }
  
  @media (min-width: 992px) {
    .diet-toggle .toggle-buttons {
      flex-direction: column;
      gap: 10px;
    }
    
    .filter-chip {
      font-size: 0.8rem;
      padding: 6px 12px;
    }
    
    .filter-group {
      margin-bottom: 8px;
    }
  }
  
  @media (min-width: 768px) and (max-width: 991px) {
    .filter-group {
      margin-bottom: 10px;
    }
    
    .option-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }
  }
</style>
