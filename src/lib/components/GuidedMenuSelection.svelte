<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { gsap } from 'gsap';
  import { fade, slide } from 'svelte/transition';
  import menuItems from '$lib/data/menu';
  import type { MenuItem } from '$lib/data/menu/types';
  import { basket } from '$lib/stores/basketStore';
  
  const dispatch = createEventDispatcher();
  
  // Guided selection state
  let currentStep = 0;
  let showResults = false;
  let wizardVisible = true;
  
  // Selection choices
  let preferences = {
    dietary: 'any', // 'any', 'vegetarian', 'vegan'
    spiceLevel: 'medium', // 'mild', 'medium', 'spicy'
    allergies: [] as string[],
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
        preferences.allergies = []; // Clear allergies if 'none' selected
      } else {
        if (preferences.allergies.includes('none')) {
          // Remove 'none' if it was previously selected
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
    // If multi-select and nothing selected, select 'none' by default
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
            <div class="meal-item">
              <div class="meal-item-header">
                <h3>Appetizer</h3>
                <button class="add-item-button" on:click={() => addItemToBasket(selectedMeal.appetizer!)}>Add +</button>
              </div>
              <div class="meal-item-details">
                <h4>{selectedMeal.appetizer.name}</h4>
                <p>{selectedMeal.appetizer.description}</p>
                <div class="meal-item-price">{selectedMeal.appetizer.price}</div>
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
          <div class="meal-item main">
            <div class="meal-item-header">
              <h3>Main Course</h3>
              <button class="add-item-button" on:click={() => addItemToBasket(selectedMeal.main!)}>Add +</button>
            </div>
            <div class="meal-item-details">
              <h4>{selectedMeal.main.name}</h4>
              <p>{selectedMeal.main.description}</p>
              <div class="meal-item-price">{selectedMeal.main.price}</div>
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
            <div class="meal-item">
              <div class="meal-item-header">
                <h3>Drink</h3>
                <button class="add-item-button" on:click={() => addItemToBasket(selectedMeal.drink!)}>Add +</button>
              </div>
              <div class="meal-item-details">
                <h4>{selectedMeal.drink.name}</h4>
                <p>{selectedMeal.drink.description}</p>
                <div class="meal-item-price">{selectedMeal.drink.price}</div>
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
            <div class="meal-item">
              <div class="meal-item-header">
                <h3>Dessert</h3>
                <button class="add-item-button" on:click={() => addItemToBasket(selectedMeal.dessert!)}>Add +</button>
              </div>
              <div class="meal-item-details">
                <h4>{selectedMeal.dessert.name}</h4>
                <p>{selectedMeal.dessert.description}</p>
                <div class="meal-item-price">{selectedMeal.dessert.price}</div>
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
  @use "../../lib/styles/variables" as v;

  .guided-menu-overlay {
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

  .guided-menu-wizard {
    background-color: white;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    border-radius: 8px;
    padding: 30px;
    position: relative;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

    @media (max-width: 768px) {
      padding: 20px;
      max-height: 80vh;
    }
  }

  .close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #444;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  .wizard-header {
    margin-bottom: 25px;
    text-align: center;
    
    h2 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.8rem;
      color: v.$tertiary;
      margin: 0 0 15px;
    }
    
    .progress-bar {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 5px;
      
      .progress-step {
        width: 30px;
        height: 5px;
        background-color: rgba(160, 147, 125, 0.2);
        border-radius: 3px;
        transition: background-color 0.3s;
        
        &.active {
          background-color: v.$tertiary;
        }
      }
    }
  }

  .wizard-content {
    margin-bottom: 30px;
    
    h3 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.4rem;
      color: #4a3c31;
      margin: 0 0 5px;
    }
    
    .question {
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 1.1rem;
      color: #4a3c31;
      margin-bottom: 25px;
    }
    
    .options-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .option-button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        background-color: white;
        border: 1px solid rgba(160, 147, 125, 0.3);
        border-radius: 6px;
        padding: 15px 20px;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s;
        font-family: "Inter 24pt Regular", sans-serif;
        
        &:hover {
          border-color: v.$tertiary;
          background-color: rgba(2, 92, 72, 0.03);
        }
        
        &.selected {
          background-color: rgba(2, 92, 72, 0.08);
          border-color: v.$tertiary;
          
          .option-label {
            font-weight: 500;
            color: v.$tertiary-dark;
          }
        }
        
        .option-label {
          color: #4a3c31;
          font-size: 1rem;
        }
        
        .check-icon {
          color: v.$tertiary;
          font-weight: bold;
          font-size: 1.2rem;
        }
      }
    }
  }

  .wizard-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    
    .nav-button {
      padding: 12px 25px;
      border-radius: 6px;
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      
      &.back {
        background-color: white;
        border: 1px solid rgba(160, 147, 125, 0.3);
        color: #4a3c31;
        
        &:hover {
          background-color: rgba(160, 147, 125, 0.1);
        }
      }
      
      &.next {
        background-color: v.$tertiary;
        color: white;
        border: none;
        
        &:hover {
          background-color: v.$tertiary-dark;
        }
      }
    }
  }

  // Results styles
  .results-header {
    text-align: center;
    margin-bottom: 30px;
    
    h2 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.8rem;
      color: v.$tertiary;
      margin: 0 0 10px;
    }
    
    p {
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 1.1rem;
      color: #4a3c31;
    }
  }

  .results-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
    
    .meal-item {
      border: 1px solid rgba(160, 147, 125, 0.2);
      border-radius: 8px;
      overflow: hidden;
      
      &.main {
        border-left: 4px solid v.$tertiary;
      }
      
      &.no-match {
        padding: 20px;
        background-color: rgba(160, 147, 125, 0.05);
        border-left: 4px solid #ccc;
        
        h3 {
          font-family: "DynaPuff Regular", cursive;
          font-size: 1.2rem;
          color: #4a3c31;
          margin: 0 0 5px;
        }
        
        p {
          margin: 0;
          font-family: "Inter 24pt Regular", sans-serif;
          font-style: italic;
          color: #776a60;
        }
      }
      
      .meal-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgba(160, 147, 125, 0.08);
        padding: 10px 20px;
        
        h3 {
          font-family: "DynaPuff Regular", cursive;
          font-size: 1.1rem;
          margin: 0;
          color: #4a3c31;
        }
        
        .add-item-button {
          background-color: v.$tertiary;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 5px 15px;
          font-family: "Inter 24pt Regular", sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.2s;
          
          &:hover {
            background-color: v.$tertiary-dark;
          }
        }
      }
      
      .meal-item-details {
        padding: 15px 20px;
        
        h4 {
          font-family: "Inter 24pt Regular", sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: v.$tertiary;
          margin: 0 0 5px;
        }
        
        p {
          font-family: "Inter 24pt Regular", sans-serif;
          font-size: 0.95rem;
          color: #4a3c31;
          margin: 0 0 10px;
        }
        
        .meal-item-price {
          font-family: "Inter 24pt Regular", sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #4a3c31;
        }
      }
    }
  }

  .results-actions {
    display: flex;
    gap: 15px;
    
    @media (max-width: 767px) {
      flex-direction: column;
    }
    
    .action-button {
      flex: 1;
      padding: 15px;
      border-radius: 6px;
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 1rem;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
      
      &.add-all {
        background-color: v.$tertiary;
        color: white;
        border: none;
        
        &:hover {
          background-color: v.$tertiary-dark;
        }
      }
      
      &.restart {
        background-color: white;
        border: 1px solid rgba(160, 147, 125, 0.3);
        color: #4a3c31;
        
        &:hover {
          background-color: rgba(160, 147, 125, 0.1);
        }
      }
    }
  }

  .success-message {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: v.$tertiary;
    color: white;
    padding: 15px 25px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    font-family: "Inter 24pt Regular", sans-serif;
    
    .success-icon {
      font-weight: bold;
    }
  }

  @media (max-width: 767px) {
    .wizard-content .options-container .option-button {
      padding: 12px 15px;
      
      .option-label {
        font-size: 0.95rem;
      }
    }
    
    .wizard-footer .nav-button {
      padding: 10px 20px;
      font-size: 0.95rem;
    }
    
    .results-content .meal-item .meal-item-details {
      h4 {
        font-size: 1rem;
      }
      
      p {
        font-size: 0.9rem;
      }
    }
  }
</style>