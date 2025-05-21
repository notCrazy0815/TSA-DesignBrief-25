<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { gsap } from 'gsap';
  import { fade, slide } from 'svelte/transition';
  import menuItems from '$lib/data/menu';
  import type { MenuItem } from '$lib/data/menu/types';
  import { basket } from '$lib/stores/basketStore';
  import { formatPrice } from '$lib/utils/formatPrice';
  
  const dispatch = createEventDispatcher();
  
  // Guided selection state
  let currentStep = 0;
  let showResults = false;
  let wizardVisible = true;
  
  // Selection choices
  let preferences = {
    dietary: 'any', // 'any', 'vegetarian', 'vegan'
    spiceLevel: 'medium', // 'mild', 'medium', 'spicy'
    allergies: [] as string[], // No allergens selected by default
    coursePreference: 'full', // 'full', 'light', 'main-only'
    flavorPreference: 'balanced' // 'sweet', 'savory', 'balanced', 'refreshing'
  };
  
  // Selected menu items
  let selectedMeal = {
    appetizer: null as MenuItem | null,
    main: null as MenuItem | null,
    drink: null as MenuItem | null,
    dessert: null as MenuItem | null
  };
  
  // Wizard steps configuration
  const steps = [
    {
      title: "Dietary Preference",
      question: "Do you have any dietary preferences?",
      options: [
        { id: 'any', label: 'No special preference' },
        { id: 'vegetarian', label: 'Vegetarian' },
        { id: 'vegan', label: 'Vegan' }
      ]
    },
    {
      title: "Allergies & Restrictions",
      question: "Do you have any allergies or dietary restrictions?",
      multiSelect: true,
      options: [
        { id: 'gluten', label: 'Gluten' },
        { id: 'dairy', label: 'Dairy' },
        { id: 'nuts', label: 'Nuts' },
        { id: 'soy', label: 'Soy' },
        { id: 'shellfish', label: 'Shellfish' },
        { id: 'none', label: 'No allergies' }
      ]
    },
    {
      title: "Flavor Profile",
      question: "What kind of flavors do you enjoy most?",
      options: [
        { id: 'balanced', label: 'Balanced & Harmonious' },
        { id: 'sweet', label: 'Sweet & Fruity' },
        { id: 'savory', label: 'Rich & Savory' },
        { id: 'refreshing', label: 'Light & Refreshing' },
        { id: 'spicy', label: 'Bold & Spicy' }
      ]
    },
    {
      title: "Course Preference",
      question: "What kind of meal are you looking for?",
      options: [
        { id: 'full', label: 'Full meal experience (appetizer, main, drink, dessert)' },
        { id: 'light', label: 'Light meal (appetizer, main, drink)' },
        { id: 'main-only', label: 'Main dish only' }
      ]
    }
  ];
  
  // Select an option from the current step
  function selectOption(optionId: string) {
    const currentStepConfig = steps[currentStep];
    
    if (currentStepConfig.multiSelect) {
      // For multi-select steps (like allergies)
      if (optionId === 'none') {
        // If "No allergies" is clicked, deselect all other allergies
        preferences.allergies = preferences.allergies.includes('none') ? [] : ['none'];
      } else {
        // If a specific allergy is clicked and "No allergies" was selected, remove it
        if (preferences.allergies.includes('none')) {
          preferences.allergies = preferences.allergies.filter(id => id !== 'none');
        }
        
        // Toggle the selected allergy
        if (preferences.allergies.includes(optionId)) {
          preferences.allergies = preferences.allergies.filter(id => id !== optionId);
        } else {
          preferences.allergies = [...preferences.allergies, optionId];
        }
      }
    } else {
      // For single select steps
      switch (currentStep) {
        case 0: // Dietary preference
          preferences.dietary = optionId;
          break;
        case 2: // Flavor preference
          preferences.flavorPreference = optionId;
          break;
        case 3: // Course preference
          preferences.coursePreference = optionId;
          break;
      }
    }
  }
  
  // Check if an option is selected
  function isOptionSelected(optionId: string): boolean {
    const currentStepConfig = steps[currentStep];
    
    if (currentStepConfig.multiSelect) {
      return preferences.allergies.includes(optionId);
    } else {
      switch (currentStep) {
        case 0: // Dietary preference
          return preferences.dietary === optionId;
        case 2: // Flavor preference
          return preferences.flavorPreference === optionId;
        case 3: // Course preference
          return preferences.coursePreference === optionId;
        default:
          return false;
      }
    }
  }
  
  // Go to next step
  function nextStep() {
    // If allergen step and nothing selected, select 'none' by default
    if (steps[currentStep].multiSelect && preferences.allergies.length === 0) {
      preferences.allergies = ['none'];
    }
    
    if (currentStep < steps.length - 1) {
      currentStep++;
    } else {
      // Final step - generate recommendation
      generateRecommendation();
    }
  }
  
  // Go to previous step
  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
    } else {
      // Exit wizard if on first step and go back
      closeWizard();
    }
  }
  
  // Generate personalized menu recommendations based on preferences
  function generateRecommendation() {
    const appetizers = menuItems[1]; // appetizers
    const mains = menuItems[2]; // mains  
    const drinks = menuItems[3]; // drinks
    const desserts = menuItems[4]; // desserts
    
    // Filter based on dietary preferences
    const dietaryFilter = (item: MenuItem) => {
      if (preferences.dietary === 'vegan') return item.isVegan;
      if (preferences.dietary === 'vegetarian') return item.isVegetarian;
      return true;
    };
    
    // Filter based on allergies
    const allergyFilter = (item: MenuItem) => {
      if (preferences.allergies.includes('none')) return true;
      
      for (const allergy of preferences.allergies) {
        if (item.contains.some(ingredient => ingredient.toLowerCase().includes(allergy.toLowerCase()))) {
          return false;
        }
      }
      return true;
    };
    
    // Apply flavor profile matching
    const flavorFilter = (item: MenuItem) => {
      if (!item.flavorProfile) return true;
      
      switch (preferences.flavorPreference) {
        case 'sweet':
          return item.flavorProfile.sweet > 5;
        case 'savory':
          return item.flavorProfile.umami > 5 || item.flavorProfile.rich > 5;
        case 'refreshing':
          return item.flavorProfile.refreshing > 5;
        case 'spicy':
          return item.flavorProfile.spicy > 4;
        case 'balanced':
        default:
          return true; // Accept any flavor profile for balanced
      }
    };
    
    // Filter all menu items
    const filteredAppetizers = appetizers.filter(item => dietaryFilter(item) && allergyFilter(item) && flavorFilter(item));
    const filteredMains = mains.filter(item => dietaryFilter(item) && allergyFilter(item) && flavorFilter(item));
    const filteredDrinks = drinks.filter(item => dietaryFilter(item) && allergyFilter(item) && flavorFilter(item));
    const filteredDesserts = desserts.filter(item => dietaryFilter(item) && allergyFilter(item) && flavorFilter(item));
    
    // Select one item from each category
    // For more sophisticated selection, we could analyze pairing compatibility
    // between dishes using the pairing algorithm
    selectedMeal = {
      appetizer: filteredAppetizers.length > 0 ? filteredAppetizers[Math.floor(Math.random() * filteredAppetizers.length)] : null,
      main: filteredMains.length > 0 ? filteredMains[Math.floor(Math.random() * filteredMains.length)] : null,
      drink: filteredDrinks.length > 0 ? filteredDrinks[Math.floor(Math.random() * filteredDrinks.length)] : null,
      dessert: filteredDesserts.length > 0 ? filteredDesserts[Math.floor(Math.random() * filteredDesserts.length)] : null
    };
    
    // Show results
    showResults = true;
  }
  
  // Add all meal items to basket
  function addEntireMealToBasket() {
    // Add each item to the basket individually if it exists
    if (selectedMeal.appetizer) {
      basket.addToBasket(selectedMeal.appetizer);
    }
    if (selectedMeal.main) {
      basket.addToBasket(selectedMeal.main);
    }
    if (selectedMeal.drink) {
      basket.addToBasket(selectedMeal.drink);
    }
    if (selectedMeal.dessert) {
      basket.addToBasket(selectedMeal.dessert);
    }
    
    // Show success message briefly
    showSuccessMessage();
  }
  
  // Add individual item to basket
  function addItemToBasket(item: MenuItem) {
    if (item) {
      basket.addToBasket(item);
      showSuccessMessage();
    }
  }
  
  let successMessageVisible = false;
  
  function showSuccessMessage() {
    successMessageVisible = true;
    setTimeout(() => {
      successMessageVisible = false;
    }, 3000);
  }
  
  // Restart the wizard
  function restartWizard() {
    currentStep = 0;
    showResults = false;
    preferences = {
      dietary: 'any',
      spiceLevel: 'medium',
      allergies: [],
      coursePreference: 'full',
      flavorPreference: 'balanced'
    };
  }
  
  // Close the wizard
  function closeWizard() {
    wizardVisible = false;
    dispatch('close');
  }
  
  // Animation references
  let wizardElement: HTMLElement;
  
  onMount(() => {
    // Animate wizard entrance
    gsap.from(wizardElement, {
      y: 50,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    });
  });
</script>

{#if wizardVisible}
<div class="guided-menu-overlay" transition:fade={{ duration: 200 }}>
  <div class="guided-menu-wizard" bind:this={wizardElement}>
    <button class="close-button" on:click={closeWizard} aria-label="Close wizard">×</button>
    
    {#if !showResults}
      <!-- Wizard Steps -->
      <div class="wizard-header">
        <h2>Guided Menu Selection</h2>
        <div class="progress-bar">
          {#each steps as _, index}
            <div class="progress-step" class:active={index <= currentStep}></div>
          {/each}
        </div>
      </div>
      
      <div class="wizard-content">
        <h3>{steps[currentStep].title}</h3>
        <p class="question">{steps[currentStep].question}</p>
        
        <div class="options-container">
          {#each steps[currentStep].options as option}
            <button 
              class="option-button" 
              class:selected={isOptionSelected(option.id)}
              on:click={() => selectOption(option.id)}
              data-option-id={option.id}
            >
              <span class="option-label">{option.label}</span>
              {#if isOptionSelected(option.id)}
                <span class="check-icon">✓</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>
      
      <div class="wizard-footer">
        <button class="nav-button back" on:click={prevStep}>
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </button>
        <button class="nav-button next" on:click={nextStep}>
          {currentStep === steps.length - 1 ? 'Show Recommendations' : 'Next'}
        </button>
      </div>
    {:else}
      <!-- Recommendation Results -->
      <div class="results-header">
        <h2>Your Personalized Menu</h2>
        <p>Based on your preferences, we've selected these dishes just for you:</p>
      </div>
      
      <div class="results-content">
        {#if preferences.coursePreference !== 'main-only'}
          {#if selectedMeal.appetizer}
            {@const itemInBasket = $basket.some(bItem => bItem.id === selectedMeal.appetizer?.id)}
            <div class="meal-item">
              <div class="meal-item-header">
                <h3>Appetizer</h3>
                <button 
                  class="add-item-button"
                  class:added={itemInBasket}
                  on:click={() => !itemInBasket && selectedMeal.appetizer && addItemToBasket(selectedMeal.appetizer)}
                  disabled={itemInBasket}
                >
                  {#if itemInBasket}
                    Added ✓
                  {:else}
                    Add +
                  {/if}
                </button>
              </div>
              <div class="meal-item-details">
                <h4>{selectedMeal.appetizer.name}</h4>
                <p>{selectedMeal.appetizer.description}</p>
                <div class="meal-item-price">{formatPrice(selectedMeal.appetizer.price)}</div>
              </div>
            </div>
          {:else}
            <div class="meal-item no-match">
              <h3>Appetizer</h3>
              <p>No matching appetizers found for your preferences.</p>
            </div>
          {/if}
        {/if}
        
        {#if selectedMeal.main}
          {@const itemInBasket = $basket.some(bItem => bItem.id === selectedMeal.main?.id)}
          <div class="meal-item main">
            <div class="meal-item-header">
              <h3>Main Course</h3>
              <button 
                class="add-item-button"
                class:added={itemInBasket}
                on:click={() => !itemInBasket && selectedMeal.main && addItemToBasket(selectedMeal.main)}
                disabled={itemInBasket}
              >
                {#if itemInBasket}
                  Added ✓
                {:else}
                  Add +
                {/if}
              </button>
            </div>
            <div class="meal-item-details">
              <h4>{selectedMeal.main.name}</h4>
              <p>{selectedMeal.main.description}</p>
              <div class="meal-item-price">{formatPrice(selectedMeal.main.price)}</div>
            </div>
          </div>
        {:else}
          <div class="meal-item no-match">
            <h3>Main Course</h3>
            <p>No matching main courses found for your preferences.</p>
          </div>
        {/if}
        
        {#if preferences.coursePreference !== 'main-only'}
          {#if selectedMeal.drink}
            {@const itemInBasket = $basket.some(bItem => bItem.id === selectedMeal.drink?.id)}
            <div class="meal-item">
              <div class="meal-item-header">
                <h3>Drink</h3>
                <button 
                  class="add-item-button"
                  class:added={itemInBasket}
                  on:click={() => !itemInBasket && selectedMeal.drink && addItemToBasket(selectedMeal.drink)}
                  disabled={itemInBasket}
                >
                  {#if itemInBasket}
                    Added ✓
                  {:else}
                    Add +
                  {/if}
                </button>
              </div>
              <div class="meal-item-details">
                <h4>{selectedMeal.drink.name}</h4>
                <p>{selectedMeal.drink.description}</p>
                <div class="meal-item-price">{formatPrice(selectedMeal.drink.price)}</div>
              </div>
            </div>
          {:else}
            <div class="meal-item no-match">
              <h3>Drink</h3>
              <p>No matching drinks found for your preferences.</p>
            </div>
          {/if}
        {/if}
        
        {#if preferences.coursePreference === 'full'}
          {#if selectedMeal.dessert}
            {@const itemInBasket = $basket.some(bItem => bItem.id === selectedMeal.dessert?.id)}
            <div class="meal-item">
              <div class="meal-item-header">
                <h3>Dessert</h3>
                <button 
                  class="add-item-button"
                  class:added={itemInBasket}
                  on:click={() => !itemInBasket && selectedMeal.dessert && addItemToBasket(selectedMeal.dessert)}
                  disabled={itemInBasket}
                >
                  {#if itemInBasket}
                    Added ✓
                  {:else}
                    Add +
                  {/if}
                </button>
              </div>
              <div class="meal-item-details">
                <h4>{selectedMeal.dessert.name}</h4>
                <p>{selectedMeal.dessert.description}</p>
                <div class="meal-item-price">{formatPrice(selectedMeal.dessert.price)}</div>
              </div>
            </div>
          {:else}
            <div class="meal-item no-match">
              <h3>Dessert</h3>
              <p>No matching desserts found for your preferences.</p>
            </div>
          {/if}
        {/if}
      </div>
      
      <div class="results-actions">
        <button class="action-button add-all" on:click={addEntireMealToBasket}>
          Add Entire Meal to Basket
        </button>
        <button class="action-button restart" on:click={restartWizard}>
          Try Different Preferences
        </button>
      </div>
    {/if}
    
    {#if successMessageVisible}
      <div class="success-message" transition:fade>
        <span class="success-icon">✓</span>
        <span>Added to your basket!</span>
      </div>
    {/if}
  </div>
</div>
{/if}

<style lang="scss">
  @use "../styles/variables" as v;

  .guided-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(v.$font-color-dark, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000; // High z-index to be on top
    padding: 15px; // Reduced padding for very small screens
    box-sizing: border-box; // Ensure overlay's padding is within its 100% width

    @media (max-width: 700px) {
        padding: 20px; // Original padding for general mobile
    }
  }

  .guided-menu-wizard {
    background-color: v.$background-color-light;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(v.$font-color-dark, 0.15);
    padding: 30px 35px;
    width: 100%;
    max-width: 680px; // Max width for the modal
    position: relative;
    font-family: "Inter", sans-serif;
    color: v.$font-color-dark;
    max-height: 90vh; // Max height
    display: flex;
    flex-direction: column;
    box-sizing: border-box; // Ensure padding and border are inside the width

    @media (max-width: 700px) {
      padding: 25px 20px;
      max-height: calc(100vh - 30px); // Adjusted for less padding on overlay
      border-radius: 12px;
    }
    @media (max-width: 480px) {
      padding: 20px 15px;
    }
  }

  .close-button {
    position: absolute;
    top: 18px;
    right: 20px;
    background: none;
    border: none;
    font-size: 2.2rem;
    color: rgba(v.$font-color-dark, 0.5);
    cursor: pointer;
    line-height: 1;
    padding: 5px;
    transition: color 0.2s ease;

    &:hover {
      color: v.$primary;
    }
    @media (max-width: 700px) {
      top: 12px;
      right: 12px;
      font-size: 2rem;
    }
  }

  .wizard-header, .results-header {
    text-align: center;
    margin-bottom: 25px;
    padding-right: 30px; // Space for close button

    h2 {
      font-family: "DynaPuff Regular", cursive;
      color: v.$tertiary-dark;
      font-size: 1.9rem;
      margin: 0 0 15px;
      line-height: 1.3;
    }
    p {
      font-size: 1rem;
      color: rgba(v.$font-color-dark, 0.8);
      margin: 0;
      line-height: 1.6;
    }
    @media (max-width: 700px) {
      margin-bottom: 20px;
      padding-right: 20px; // Reduced space for close button
      h2 { 
        font-size: 1.6rem; 
        margin-bottom: 10px;
      }
      p { font-size: 0.9rem; }
    }
    @media (max-width: 480px) {
      h2 { font-size: 1.4rem; }
      p { font-size: 0.85rem; }
    }
  }

  .progress-bar {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 15px;

    .progress-step {
      width: 30px;
      height: 6px;
      background-color: rgba(v.$font-color-dark, 0.15);
      border-radius: 3px;
      transition: background-color 0.3s ease;

      &.active {
        background-color: v.$primary;
      }
    }
    @media (max-width: 700px) {
      gap: 6px;
      margin-top: 10px;
      .progress-step {
        width: 25px;
        height: 5px;
      }
    }
  }

  .wizard-content, .results-content {
    margin-bottom: 30px;
    overflow-y: auto; // Allow content to scroll if modal is too short
    flex-grow: 1; // Allow content to take available space
    padding-right: 10px; // For scrollbar spacing
    margin-right: -10px; // Counteract padding for scrollbar
     @media (max-width: 700px) {
        margin-bottom: 20px;
        padding-right: 5px; 
        margin-right: -5px;
    }
  }

  .wizard-content {
    h3 {
      font-family: "DynaPuff Regular", cursive;
      color: v.$font-color-dark;
      font-size: 1.4rem;
      margin: 0 0 8px;
      text-align: center;
    }
    .question {
      font-size: 1rem;
      color: rgba(v.$font-color-dark, 0.9);
      margin-bottom: 25px;
      text-align: center;
      line-height: 1.6;
    }
    @media (max-width: 700px) {
      h3 { 
        font-size: 1.2rem; 
        margin-bottom: 6px;
      }
      .question { 
        font-size: 0.9rem; 
        margin-bottom: 20px; 
      }
    }
     @media (max-width: 480px) {
      h3 { font-size: 1.1rem; }
      .question { font-size: 0.85rem; margin-bottom: 15px; }
    }
  }

  .options-container {
    display: grid;
    grid-template-columns: 1fr; // Single column by default
    gap: 12px;

    @media (max-width: 700px) {
      gap: 10px;
    }
  }

  .option-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 14px 18px;
    background-color: rgba(v.$font-color-dark, 0.03);
    border: 1px solid rgba(v.$font-color-dark, 0.1);
    border-radius: 8px;
    text-align: left;
    font-size: 0.95rem;
    font-family: "Inter", sans-serif;
    color: v.$font-color-dark;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

    .option-label {
      flex-grow: 1;
    }

    .check-icon {
      font-size: 1.2rem;
      color: v.$primary;
      margin-left: 10px;
    }

    &:hover {
      background-color: rgba(v.$font-color-dark, 0.06);
      border-color: rgba(v.$font-color-dark, 0.2);
    }

    &.selected {
      background-color: rgba(v.$primary, 0.1);
      border-color: v.$primary;
      color: v.$primary;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(v.$primary, 0.1);
    }
    
    &[data-option-id="none"] {
      border-width: 2px;
      background-color: rgba(v.$tertiary, 0.05);
      border-color: rgba(v.$tertiary, 0.3);
      color: v.$tertiary;
      font-weight: 500;
      
      &.selected {
        background-color: rgba(v.$tertiary, 0.15);
        border-color: v.$tertiary;
        color: v.$tertiary;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(v.$tertiary, 0.2);
        
        .check-icon {
          color: v.$tertiary;
        }
      }
      
      &:hover {
        background-color: rgba(v.$tertiary, 0.1);
        border-color: rgba(v.$tertiary, 0.5);
      }
    }

    @media (max-width: 700px) {
      padding: 12px 15px;
      font-size: 0.9rem;
      .check-icon {
        font-size: 1.1rem;
      }
    }
    @media (max-width: 480px) {
      padding: 10px 12px;
      font-size: 0.85rem;
    }
  }

  .wizard-footer, .results-actions {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    border-top: 1px solid rgba(v.$font-color-dark, 0.1);
    gap: 15px;
    @media (max-width: 700px) {
      padding-top: 15px;
      gap: 10px;
    }
  }
  
  .results-actions {
    flex-direction: column; // Stack action buttons in results view
    gap: 12px;
     @media (max-width: 700px) {
      gap: 10px;
    }
  }

  .nav-button, .action-button {
    padding: 12px 25px;
    border: none;
    border-radius: 8px;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
    flex-grow: 1; // Allow buttons to grow

    &.next, &.add-all {
      background-color: v.$primary;
      color: v.$font-color-light;
      box-shadow: 0 4px 10px rgba(v.$primary, 0.15);
      &:hover {
        background-color: darken(v.$primary, 7%);
        box-shadow: 0 5px 12px rgba(v.$primary, 0.2);
        transform: translateY(-1px);
      }
    }

    &.back, &.restart {
      background-color: rgba(v.$font-color-dark, 0.08);
      color: v.$font-color-dark;
      &:hover {
        background-color: rgba(v.$font-color-dark, 0.12);
        transform: translateY(-1px);
      }
    }
    @media (min-width: 500px) {
        flex-grow: 0;
    }
    @media (max-width: 700px) {
      padding: 10px 15px;
      font-size: 0.9rem;
    }
    @media (max-width: 480px) {
      padding: 10px 12px;
      font-size: 0.85rem;
    }
  }
  
  .results-actions .action-button {
      width: 100%; // Make action buttons full width in their column
  }

  // Results View Specifics
  .results-content {
    gap: 20px;
    display: flex;
    flex-direction: column;
    @media (max-width: 700px) {
      gap: 15px;
    }
  }

  .meal-item {
    background-color: rgba(v.$font-color-dark, 0.025);
    border: 1px solid rgba(v.$font-color-dark, 0.08);
    border-radius: 10px;
    padding: 18px;

    &.no-match p {
      font-style: italic;
      color: rgba(v.$font-color-dark, 0.6);
    }

    .meal-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      h3 {
        font-family: "DynaPuff Regular", cursive;
        color: v.$tertiary-dark;
        font-size: 1.2rem;
        margin: 0;
      }
    }

    .add-item-button {
      background-color: v.$primary;
      color: v.$font-color-light;
      border: none;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease, opacity 0.2s ease;
      
      &:hover {
        background-color: darken(v.$primary, 8%);
      }

      &.added {
        background-color: v.$tertiary;
        color: v.$font-color-light;
        cursor: default;
        opacity: 0.8;
        &:hover {
          background-color: v.$tertiary;
        }
      }
    }

    .meal-item-details {
      h4 {
        font-family: "Inter", sans-serif;
        font-weight: 600;
        font-size: 1.05rem;
        color: v.$font-color-dark;
        margin: 0 0 6px;
      }
      p {
        font-size: 0.9rem;
        color: rgba(v.$font-color-dark, 0.8);
        line-height: 1.5;
        margin: 0 0 8px;
      }
      .meal-item-price {
        font-size: 0.95rem;
        font-weight: 600;
        color: v.$tertiary;
        text-align: right;
      }
    }
    @media (max-width: 700px) {
      padding: 15px;
      border-radius: 8px;
      .meal-item-header {
        margin-bottom: 10px;
        h3 { font-size: 1.1rem; }
      }
      .add-item-button {
        padding: 5px 10px;
        font-size: 0.75rem;
        &.added {
            padding: 5px 10px;
            font-size: 0.75rem;
        }
      }
      .meal-item-details {
        h4 { font-size: 1rem; margin-bottom: 4px; }
        p { font-size: 0.85rem; margin-bottom: 6px; }
        .meal-item-price { font-size: 0.9rem; }
      }
    }
    @media (max-width: 480px) {
       padding: 12px;
      .meal-item-header h3 { font-size: 1rem; }
      .meal-item-details h4 { font-size: 0.9rem; }
      .meal-item-details p { font-size: 0.8rem; }
    }
  }

  .success-message {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: v.$tertiary-dark; // Or v.$success if defined
    color: v.$font-color-light;
    padding: 12px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(v.$font-color-dark, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 10005; // Above wizard overlay content potentially
    font-size: 0.95rem;

    .success-icon {
      font-size: 1.2rem;
    }
    @media (max-width: 700px) {
      padding: 10px 20px;
      font-size: 0.9rem;
      bottom: 20px;
      width: calc(100% - 40px);
      max-width: 350px;
      .success-icon {
        font-size: 1.1rem;
      }
    }
  }

</style>