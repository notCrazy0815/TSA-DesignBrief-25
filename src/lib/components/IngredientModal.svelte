<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { faInfoCircle, faTimes, faMapMarkerAlt, faLeaf } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { Chart, registerables } from 'chart.js';
  import type { MenuItem, Ingredient } from '$lib/data/menu/types';

  // Register all Chart.js components
  Chart.register(...registerables);

  // Define a more specific type for the ingredient
  interface IngredientDetail {
    name: string;
    description?: string;
    sourceInfo?: {
      supplier?: string;
      origin?: string;
      local?: boolean;
      organic?: boolean;
    };
    dietaryInfo?: {
      isVegan?: boolean;
    };
    flavorProfile?: Record<string, number>;
    nutritionalValue?: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      fiber?: number;
      sugar?: number;
    };
    healthBenefits?: string[];
    seasonality?: {
      peakSeason?: string[];
    };
    storageInfo?: string;
    shelfLife?: string;
    freshnessTips?: string;
    harvestMethods?: string;
  }

  export let ingredient: IngredientDetail;
  export let parentItem: MenuItem;
  export let isOpen: boolean = false;
  
  const dispatch = createEventDispatcher();

  let activeTab = 'overview';
  let seasonalityChart: Chart | null = null;
  let seasonalityChartCanvas: HTMLCanvasElement;

  function closeModal() {
    dispatch('close');
  }
  
  function stopPropagation(event: Event) {
    event.stopPropagation();
  }
  
  function setActiveTab(tab: string) {
    activeTab = tab;
    
    if (tab === 'seasonality' && ingredient?.seasonality) {
      initSeasonalityChart();
    }
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

  function initSeasonalityChart() {
    // Wait for next tick to ensure the canvas is in the DOM
    setTimeout(() => {
      if (!seasonalityChartCanvas || !ingredient?.seasonality) return;
      
      // Destroy previous chart if it exists
      if (seasonalityChart) {
        seasonalityChart.destroy();
      }

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonthIndex = new Date().getMonth();
      
      // Generate smoother data with more natural curve
      const isPeakSeason = months.map((month, index) => {
        let isPeak = false;
        let seasonName = '';
        
        // First determine if it's peak season and which season
        if (ingredient.seasonality?.peakSeason?.some((season: string) => {
          if (season === 'Spring' && index >= 2 && index <= 4) {
            seasonName = 'Spring';
            isPeak = true;
            return true;
          }
          if (season === 'Summer' && index >= 5 && index <= 7) {
            seasonName = 'Summer';
            isPeak = true;
            return true;
          }
          if (season === 'Fall' && index >= 8 && index <= 10) {
            seasonName = 'Fall';
            isPeak = true;
            return true;
          }
          if (season === 'Winter' && (index === 11 || index <= 1)) {
            seasonName = 'Winter';
            isPeak = true;
            return true;
          }
          return false;
        })) {
          // Create a more natural curve for peak seasons
          // Higher values for center of season, tapered at edges
          if (seasonName === 'Spring' && (index === 3)) return 90;
          if (seasonName === 'Spring' && (index === 2 || index === 4)) return 80;
          if (seasonName === 'Summer' && (index === 6)) return 90;
          if (seasonName === 'Summer' && (index === 5 || index === 7)) return 80;
          if (seasonName === 'Fall' && (index === 9)) return 90;
          if (seasonName === 'Fall' && (index === 8 || index === 10)) return 80;
          if (seasonName === 'Winter' && (index === 0 || index === 11)) return 80;
          return 70; // Other peak season months
        }
        
        // Create a more natural availability curve
        // Smooth transition to/from peak season
        const nearPeak = months.findIndex((_, i) => {
          return ingredient.seasonality?.peakSeason?.some((season: string) => {
            if (season === 'Spring' && (Math.abs(i - index) === 1) && (i >= 2 && i <= 4)) return true;
            if (season === 'Summer' && (Math.abs(i - index) === 1) && (i >= 5 && i <= 7)) return true;
            if (season === 'Fall' && (Math.abs(i - index) === 1) && (i >= 8 && i <= 10)) return true;
            if (season === 'Winter' && (Math.abs(i - index) === 1) && (i === 11 || i <= 1)) return true;
            return false;
          });
        });
        
        if (nearPeak !== -1) return 50; // Transition months (good availability)
        return 30; // Limited availability
      });

      // Create a color gradient function for the chart line based on availability level
      const getColor = (value: number) => {
        if (value >= 70) return '#025c48'; // Peak - tertiary color (green)
        if (value >= 45) return 'rgba(2, 92, 72, 0.5)'; // Good availability
        return 'rgba(2, 92, 72, 0.2)'; // Limited availability
      };

      seasonalityChart = new Chart(seasonalityChartCanvas, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Seasonal Availability',
              data: isPeakSeason,
              backgroundColor: 'rgba(2, 92, 72, 0.1)',
              borderColor: '#025c48', // Tertiary color (green)
              pointBackgroundColor: months.map((_, i) => i === currentMonthIndex ? '#fc6234' : getColor(isPeakSeason[i])),
              pointBorderColor: months.map((_, i) => i === currentMonthIndex ? '#fc6234' : getColor(isPeakSeason[i])),
              pointRadius: months.map((_, i) => i === currentMonthIndex ? 6 : 4),
              pointHoverRadius: months.map((_, i) => i === currentMonthIndex ? 8 : 6),
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw as number;
                  const isCurrentMonth = context.dataIndex === currentMonthIndex;
                  let availabilityText = '';
                  
                  if (value > 70) availabilityText = 'Peak Season';
                  else if (value > 45) availabilityText = 'Good Availability';
                  else availabilityText = 'Limited Availability';
                  
                  if (isCurrentMonth) {
                    return `Current Month (${months[currentMonthIndex]}) - ${availabilityText}`;
                  }
                  return availabilityText;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              display: false,
              max: 100
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: months.map((_, i) => i === currentMonthIndex ? '#fc6234' : undefined)
              }
            }
          }
        }
      });
    }, 50);
  }

  onMount(() => {
    if (activeTab === 'seasonality' && ingredient?.seasonality) {
      initSeasonalityChart();
    }

    return () => {
      if (seasonalityChart) {
        seasonalityChart.destroy();
      }
    };
  });

  $: if (activeTab === 'seasonality' && ingredient?.seasonality && isOpen) {
    initSeasonalityChart();
  }

  // Helper function to check if an ingredient is an allergen
  function isAllergen(ingredientName: string): boolean {
    // Check if parentItem has a contains property (from MenuItem interface)
    if (parentItem?.contains) {
      return parentItem.contains.some(
        (allergen: string) => allergen.toLowerCase() === ingredientName.toLowerCase()
      );
    }
    return false;
  }
</script>

{#if isOpen && ingredient}
  <div 
    class="ingredient-modal-overlay"
    on:click={closeModal}
    on:keydown={(e) => e.key === 'Escape' && closeModal()}
    transition:fade={{ duration: 200 }}
  >
    <div 
      class="ingredient-modal"
      on:click|stopPropagation
      transition:scale={{ duration: 200, start: 0.95 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ingredient-title"
    >
      <button 
        class="ingredient-close-button"
        on:click={closeModal}
        aria-label="Close ingredient details"
        in:scale={{delay: 200, duration: 200, start: 0.8}}
        out:scale={{duration: 150}}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      
      <div class="ingredient-header">
        <h3 class="ingredient-title" id="ingredient-title">{ingredient.name}</h3>
        <div class="ingredient-source">
          {#if ingredient.sourceInfo?.supplier}
            <div class="source-farm">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>{ingredient.sourceInfo.supplier}</span>
            </div>
          {/if}
          
          <div class="ingredient-badges">
            {#if ingredient.sourceInfo?.local}
              <span class="badge local-badge">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>Local</span>
              </span>
            {/if}
            {#if ingredient.sourceInfo?.organic}
              <span class="badge organic-badge">
                <FontAwesomeIcon icon={faLeaf} />
                <span>Organic</span>
              </span>
            {/if}
            {#if ingredient.dietaryInfo?.isVegan}
              <span class="badge vegan-badge">
                <FontAwesomeIcon icon={faLeaf} />
                <span>Vegan</span>
              </span>
            {/if}
            {#if isAllergen(ingredient.name)}
              <span class="badge allergen-badge">
                <span>Allergen</span>
              </span>
            {/if}
          </div>
        </div>
      </div>
      
      <div class="ingredient-tabs" role="tablist">
        <button 
          class={`tab-button ${activeTab === 'overview' ? 'active' : ''}`} 
          on:click={() => setActiveTab('overview')}
          role="tab"
          id="tab-overview"
          aria-controls="panel-overview"
          aria-selected={activeTab === 'overview' ? 'true' : 'false'}
        >
          Overview
        </button>
        <button 
          class={`tab-button ${activeTab === 'nutrition' ? 'active' : ''}`} 
          on:click={() => setActiveTab('nutrition')}
          role="tab"
          id="tab-nutrition"
          aria-controls="panel-nutrition"
          aria-selected={activeTab === 'nutrition' ? 'true' : 'false'}
        >
          Nutrition
        </button>
        <button 
          class={`tab-button ${activeTab === 'seasonality' ? 'active' : ''}`} 
          on:click={() => setActiveTab('seasonality')}
          role="tab"
          id="tab-seasonality"
          aria-controls="panel-seasonality"
          aria-selected={activeTab === 'seasonality' ? 'true' : 'false'}
        >
          Seasonality
        </button>
        <button 
          class={`tab-button ${activeTab === 'benefits' ? 'active' : ''}`} 
          on:click={() => setActiveTab('benefits')}
          role="tab"
          id="tab-benefits"
          aria-controls="panel-benefits"
          aria-selected={activeTab === 'benefits' ? 'true' : 'false'}
        >
          Impact
        </button>
      </div>
      
      <div class="ingredient-content">
        {#if activeTab === 'overview'}
          <div 
            class="tab-content overview-tab" 
            role="tabpanel" 
            id="panel-overview" 
            aria-labelledby="tab-overview"
          >
            <div class="ingredient-description-card">
              <p class="ingredient-description">{ingredient.description}</p>
            </div>
            
            <div class="overview-grid">
              {#if ingredient.sourceInfo}
                <div class="overview-card">
                  <h4>
                    <FontAwesomeIcon icon={faMapMarkerAlt} class="card-icon" />
                    Origin
                  </h4>
                  <p>{ingredient.sourceInfo.origin || "Local"}</p>
                  
                  {#if ingredient.sourceInfo.supplier}
                    <div class="supplier-info">
                      <span class="supplier-label">Supplier:</span>
                      <span class="supplier-name">{ingredient.sourceInfo.supplier}</span>
                    </div>
                  {/if}
                </div>
              {/if}
              
              {#if ingredient.storageInfo}
                <div class="overview-card">
                  <h4>
                    <FontAwesomeIcon icon={faInfoCircle} class="card-icon" />
                    Storage Tips
                  </h4>
                  <p>{ingredient.storageInfo}</p>
                  
                  {#if ingredient.shelfLife}
                    <div class="shelf-life">
                      <span class="shelf-life-label">Shelf Life:</span>
                      <span class="shelf-life-value">{ingredient.shelfLife}</span>
                    </div>
                  {/if}
                </div>
              {/if}
              
              {#if ingredient.freshnessTips}
                <div class="overview-card">
                  <h4>
                    <FontAwesomeIcon icon={faLeaf} class="card-icon" />
                    Freshness Tips
                  </h4>
                  <p>{ingredient.freshnessTips}</p>
                </div>
              {/if}
              
              {#if ingredient.harvestMethods}
                <div class="overview-card">
                  <h4>
                    <FontAwesomeIcon icon={faLeaf} class="card-icon" />
                    Harvest Methods
                  </h4>
                  <p>{ingredient.harvestMethods}</p>
                </div>
              {/if}
            </div>
            
            {#if ingredient.flavorProfile}
              <div class="flavor-profile-section">
                <h4>Flavor Profile</h4>
                <div class="flavor-bars">
                  {#each Object.entries(ingredient.flavorProfile || {}) as [flavor, intensity], index}
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
              </div>
            {/if}
          </div>
        {:else if activeTab === 'nutrition'}
          <div 
            class="tab-content nutrition-tab" 
            role="tabpanel" 
            id="panel-nutrition" 
            aria-labelledby="tab-nutrition"
          >
            {#if ingredient.nutritionalValue}
              <div class="nutrition-details">
                <div class="nutrition-summary">
                  {#if ingredient.nutritionalValue.calories !== undefined}
                    <div class="nutrition-highlight">
                      <span class="value">{ingredient.nutritionalValue.calories}</span>
                      <span class="label">Calories</span>
                    </div>
                  {/if}
                </div>
                
                <div class="nutrition-grid">
                  {#if ingredient.nutritionalValue.protein !== undefined}
                    <div class="nutrition-item">
                      <div class="nutrition-bar-container">
                        <div class="nutrition-bar protein" style="width: {Math.min(ingredient.nutritionalValue.protein * 10, 100)}%"></div>
                      </div>
                      <div class="nutrition-info">
                        <span class="value">{ingredient.nutritionalValue.protein}g</span>
                        <span class="label">Protein</span>
                      </div>
                    </div>
                  {/if}
                  
                  {#if ingredient.nutritionalValue.carbs !== undefined}
                    <div class="nutrition-item">
                      <div class="nutrition-bar-container">
                        <div class="nutrition-bar carbs" style="width: {Math.min(ingredient.nutritionalValue.carbs * 3, 100)}%"></div>
                      </div>
                      <div class="nutrition-info">
                        <span class="value">{ingredient.nutritionalValue.carbs}g</span>
                        <span class="label">Carbs</span>
                      </div>
                    </div>
                  {/if}
                  
                  {#if ingredient.nutritionalValue.fat !== undefined}
                    <div class="nutrition-item">
                      <div class="nutrition-bar-container">
                        <div class="nutrition-bar fat" style="width: {Math.min(ingredient.nutritionalValue.fat * 5, 100)}%"></div>
                      </div>
                      <div class="nutrition-info">
                        <span class="value">{ingredient.nutritionalValue.fat}g</span>
                        <span class="label">Fat</span>
                      </div>
                    </div>
                  {/if}
                  
                  {#if ingredient.nutritionalValue.fiber !== undefined}
                    <div class="nutrition-item">
                      <div class="nutrition-bar-container">
                        <div class="nutrition-bar fiber" style="width: {Math.min(ingredient.nutritionalValue.fiber * 10, 100)}%"></div>
                      </div>
                      <div class="nutrition-info">
                        <span class="value">{ingredient.nutritionalValue.fiber}g</span>
                        <span class="label">Fiber</span>
                      </div>
                    </div>
                  {/if}
                  
                  {#if ingredient.nutritionalValue.sugar !== undefined}
                    <div class="nutrition-item">
                      <div class="nutrition-bar-container">
                        <div class="nutrition-bar sugar" style="width: {Math.min(ingredient.nutritionalValue.sugar * 5, 100)}%"></div>
                      </div>
                      <div class="nutrition-info">
                        <span class="value">{ingredient.nutritionalValue.sugar}g</span>
                        <span class="label">Sugar</span>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
              
              {#if isAllergen(ingredient.name)}
                <div class="allergen-info">
                  <h4>Allergen Information</h4>
                  <p>This ingredient is identified as an allergen. If you have allergies or dietary concerns, please consult with our staff for detailed information.</p>
                </div>
              {/if}
              
              {#if ingredient.healthBenefits}
                <div class="health-benefits">
                  <h4>Health Benefits</h4>
                  <ul class="benefits-list">
                    {#each ingredient.healthBenefits as benefit}
                      <li>
                        <span>{benefit}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}
            {/if}
          </div>
        {:else if activeTab === 'seasonality'}
          <div 
            class="tab-content" 
            role="tabpanel" 
            id="panel-seasonality" 
            aria-labelledby="tab-seasonality"
          >
            {#if ingredient.seasonality}
              <div class="ingredient-section">
                <h4>Peak Season</h4>
                {#if ingredient.seasonality.peakSeason}
                  <p class="season-info">{ingredient.seasonality.peakSeason.join(', ')}</p>
                {/if}
                
                <div class="seasonality-chart-container">
                  <div class="chart-heading">
                    <div class="chart-title">Seasonal Availability</div>
                    <div class="chart-legend">
                      <span class="legend-item">
                        <span class="legend-color peak"></span>
                        <span class="legend-label">Peak Season</span>
                      </span>
                      <span class="legend-item">
                        <span class="legend-color good"></span>
                        <span class="legend-label">Good Availability</span>
                      </span>
                      <span class="legend-item">
                        <span class="legend-color limited"></span>
                        <span class="legend-label">Limited Availability</span>
                      </span>
                    </div>
                  </div>

                  <div class="current-month-indicator">
                    <div class="current-month-dot"></div>
                    <span>Current Month ({['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date().getMonth()]})</span>
                  </div>
                  
                  <div class="chart-container">
                    <canvas bind:this={seasonalityChartCanvas} height="150"></canvas>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {:else if activeTab === 'benefits'}
          <div 
            class="tab-content" 
            role="tabpanel" 
            id="panel-benefits" 
            aria-labelledby="tab-benefits"
          >
            <div class="local-impact">
              <h4>Benefits of Local Sourcing</h4>
              <p>Choosing locally sourced ingredients like {ingredient.name.toLowerCase()} provides numerous benefits for our community, environment, and your dining experience.</p>
              
              <div class="impact-cards">
                <div class="impact-card">
                  <div class="impact-title">Environmental Impact</div>
                  <div class="impact-description">Reduces carbon footprint by approximately 25% compared to ingredients shipped from distant regions.</div>
                </div>
                
                <div class="impact-card">
                  <div class="impact-title">Freshness Guaranteed</div>
                  <div class="impact-description">Ingredients travel shorter distances, ensuring optimal flavor and nutritional value.</div>
                </div>
                
                <div class="impact-card">
                  <div class="impact-title">Community Support</div>
                  <div class="impact-description">Partnership with {ingredient.sourceInfo?.supplier || 'local suppliers'} helps sustain local farming communities.</div>
                </div>
                
                <div class="impact-card">
                  <div class="impact-title">Seasonal Variety</div>
                  <div class="impact-description">Promotes biodiversity and offers a rotating menu that reflects natural growing seasons.</div>
                </div>
              </div>
              
              <h4>Sustainability Practices</h4>
              <p>Our partnership with {ingredient.sourceInfo?.supplier || 'local suppliers'} ensures that this {ingredient.name.toLowerCase()} is grown using sustainable farming practices that preserve soil health and minimize water usage.</p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "../../lib/styles/variables" as v;

  /* Globale Typografie-Klassen für Konsistenz */
  .heading-font {
    font-family: inherit; /* Erbt von h1, h3 global */
  }
  
  .body-font {
    font-family: inherit; /* Erbt von p, a global */
  }

  .ingredient-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(v.$font-color-dark, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1100;
    padding: 15px;
    backdrop-filter: blur(4px);
    
    @media (max-width: 480px) {
      padding: 10px;
    }
  }
  
  .ingredient-modal {
    width: 95%;
    max-width: 700px;
    height: 85vh;
    max-height: 800px;
    background-color: white;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.15);
    
    @media (max-width: 768px) {
      width: 95%;
      height: 90vh;
      border-radius: 16px;
      max-height: none;
    }
    
    @media (max-width: 480px) {
      width: 96%;
      height: 94vh;
      border-radius: 10px 10px 0 0;
      position: absolute;
      bottom: 0;
      max-height: none;
    }
  }
  
  .ingredient-close-button {
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
    cursor: pointer;
    
    @media (max-width: 480px) {
      top: 15px;
      right: 15px;
      width: 36px;
      height: 36px;
    }
    
    svg {
      font-size: 1.2rem;
      
      @media (max-width: 480px) {
        font-size: 1rem;
      }
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
  
  .ingredient-header {
    background-color: v.$tertiary;
    color: white;
    padding: 20px 25px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    position: relative;
    
    @media (max-width: 480px) {
      padding: 15px 20px;
    }
    
    .ingredient-title {
      font-size: 1.8rem;
      margin: 0 0 15px 0;
      font-weight: 700;
      letter-spacing: 0.01em;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      @media (max-width: 480px) {
        font-size: 1.4rem;
        margin-bottom: 10px;
      }
    }
    
    .ingredient-source {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 15px;
      
      @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .source-farm {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: rgba(255, 255, 255, 0.25);
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        
        @media (max-width: 480px) {
          font-size: 0.85rem;
          padding: 5px 10px;
        }
      }
      
      .ingredient-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 5px;
        
        @media (max-width: 480px) {
          margin-top: 10px;
          width: 100%;
          justify-content: flex-start;
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.2s ease;
          white-space: nowrap;
          
          @media (max-width: 480px) {
            font-size: 0.75rem;
            padding: 4px 10px;
            flex-grow: 1;
          }
          
          svg {
            font-size: 0.75rem;
            flex-shrink: 0;
          }
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          &.local-badge {
            background-color: rgba(255, 255, 255, 0.25);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.4);
          }
          
          &.organic-badge {
            background-color: rgba(255, 255, 255, 0.25);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.4);
          }
          
          &.vegan-badge {
            background-color: rgba(255, 255, 255, 0.25);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.4);
          }
          
          &.allergen-badge {
            background-color: rgba(255, 255, 255, 0.25);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.4);
            font-weight: 700;
          }
        }
      }
    }
  }
  
  .ingredient-tabs {
    display: flex;
    border-bottom: 1px solid #eee;
    background-color: #fbfbfb;
    
    .tab-button {
      flex: 1;
      padding: 15px 5px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      font-weight: 600;
      color: v.$font-color-dark;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      
      @media (max-width: 480px) {
        font-size: 0.85rem;
        padding: 12px 5px;
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 3px;
        background-color: v.$tertiary;
        transition: all 0.3s ease;
        transform: translateX(-50%);
      }
      
      &:hover {
        color: v.$tertiary;
        
        &::after {
          width: 50%;
        }
      }
      
      &.active {
        color: v.$tertiary-dark;
        font-weight: 700;
        
        &::after {
          width: 70%;
          background-color: v.$tertiary;
        }
      }
    }
  }
  
  .ingredient-content {
    padding: 0;
    overflow-y: auto;
    flex: 1;
    
    /* Scrollbar-Styling für bessere Benutzererfahrung */
    scrollbar-width: thin;
    scrollbar-color: rgba(v.$tertiary, 0.3) transparent;
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(v.$tertiary, 0.3);
      border-radius: 8px;
    }
  }
  
  .tab-content {
    padding: 20px 15px 30px;
    height: auto;
    
    @media (max-width: 480px) {
      padding: 15px 10px 40px;
    }
  }
  
  .overview-tab {
    display: flex;
    flex-direction: column;
    gap: 25px;
    background-color: rgba(251, 249, 246, 0.7);
    border-radius: 20px;
    padding: 25px 20px;
    position: relative;
    overflow: hidden;
    animation: fadeSlideUp 0.6s ease-out;
    
    @media (max-width: 480px) {
      padding: 20px 15px;
      gap: 20px;
    }
  }
  
  @keyframes fadeSlideUp {
    0% { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    100% { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  .ingredient-description-card {
    background-color: rgba(252, 98, 52, 0.05);
    border-radius: 16px;
    padding: 24px 28px;
    margin-bottom: 5px;
    border-left: 4px solid v.$primary;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.03);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    transform-origin: top center;
    animation: scaleIn 0.4s ease-out 0.2s both;
    
    @media (max-width: 480px) {
      padding: 20px;
    }
    
    &::before {
      content: '"';
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 50px;
      color: rgba(252, 98, 52, 0.08);
      font-family: Georgia, serif;
      line-height: 1;
    }
    
    .ingredient-description {
      color: v.$font-color-dark;
      line-height: 1.7;
      font-size: 1.05rem;
      margin-bottom: 0;
      font-weight: 400;
      letter-spacing: 0.01em;
      position: relative;
      
      @media (max-width: 480px) {
        font-size: 0.95rem;
      }
    }
  }
  
  @keyframes scaleIn {
    0% { 
      opacity: 0; 
      transform: scale(0.98); 
    }
    100% { 
      opacity: 1; 
      transform: scale(1); 
    }
  }
  
  .overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 0;
    animation: fadeIn 0.4s ease-out 0.4s both;
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }
  
  @keyframes fadeIn {
    0% { 
      opacity: 0; 
    }
    100% { 
      opacity: 1; 
    }
  }
  
  .overview-card {
    background-color: white;
    border-radius: 16px;
    padding: 22px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(241, 241, 241, 0.7);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    transform: translateZ(0);
    
    @media (max-width: 480px) {
      padding: 18px;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background-color: darken(v.$tertiary, 10%);
      border-radius: 2px 0 0 2px;
    }
    
    &:hover {
      transform: translateY(-5px) translateZ(0);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    }
    
    h4 {
      font-size: 1.1rem;
      color: v.$font-color-dark;
      margin: 0 0 15px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: color 0.3s ease;
      
      @media (max-width: 480px) {
        font-size: 1rem;
      }
      
      .card-icon {
        color: darken(v.$tertiary, 10%);
        font-size: 1rem;
        background-color: rgba(v.$tertiary, 0.15);
        padding: 8px;
        border-radius: 50%;
        width: 1em;
        height: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }
    }
    
    p {
      color: v.$font-color-dark;
      line-height: 1.7;
      font-size: 0.95rem;
      margin-bottom: 15px;
      
      @media (max-width: 480px) {
        font-size: 0.9rem;
      }
    }
    
    .supplier-info, .shelf-life {
      padding-top: 12px;
      border-top: 1px solid rgba(238, 238, 238, 0.6);
      font-size: 0.9rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      @media (max-width: 480px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .supplier-label, .shelf-life-label {
        color: #777;
        font-weight: 500;
      }
      
      .supplier-name, .shelf-life-value {
        color: v.$tertiary-dark;
        font-weight: 600;
        padding: 5px 10px;
        background-color: rgba(v.$tertiary, 0.1);
        border-radius: 20px;
        font-size: 0.85rem;
        transition: all 0.3s ease;
      }
    }
  }
  
  .flavor-profile-section {
    background-color: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(241, 241, 241, 0.7);
    margin-top: 5px;
    animation: fadeIn 0.4s ease-out 0.6s both;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    @media (max-width: 480px) {
      padding: 20px;
    }
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
    }
    
    h4 {
      font-size: 1.15rem;
      color: v.$font-color-dark;
      margin: 0 0 22px 0;
      position: relative;
      display: inline-block;
      font-weight: 600;
      
      @media (max-width: 480px) {
        font-size: 1.05rem;
        margin-bottom: 18px;
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        right: 0;
        height: 3px;
        background-color: v.$tertiary;
        border-radius: 3px;
        transition: width 0.3s ease;
      }
    }
  }
  
  .flavor-bars {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    
    .flavor-bar {
      margin-bottom: 0;
      position: relative;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateX(5px);
        
        .flavor-name {
          color: v.$primary;
        }
        
        .intensity-bar {
          box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.08);
        }
        
        .intensity-fill {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }
      }
      
      .flavor-name {
        display: block;
        font-size: 0.9rem;
        margin-bottom: 8px;
        color: v.$font-color-dark;
        font-weight: 500;
        transition: color 0.3s ease;
      }
      
      .intensity-bar {
        height: 10px;
        background-color: rgba(241, 241, 241, 0.7);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        
        .intensity-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
        }
      }
    }
  }
  
  .nutrition-details {
    margin-bottom: 30px;
    
    .nutrition-summary {
      display: flex;
      justify-content: center;
      margin-bottom: 25px;
      
      .nutrition-highlight {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: v.$tertiary;
        color: white;
        border-radius: 50%;
        width: 110px;
        height: 110px;
        padding: 20px;
        justify-content: center;
        
        .value {
          font-size: 2rem;
          font-weight: 700;
        }
        
        .label {
          font-size: 0.9rem;
          text-transform: uppercase;
        }
      }
    }
    
    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      
      @media (max-width: 600px) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
      }
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      
      .nutrition-item {
        .nutrition-bar-container {
          height: 12px;
          background-color: #f1f1f1;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 8px;
          
          .nutrition-bar {
            height: 100%;
            
            &.protein {
              background-color: v.$tertiary;
            }
            
            &.carbs {
              background-color: v.$primary;
            }
            
            &.fat {
              background-color: #5d5ca8;
            }
            
            &.fiber {
              background-color: #93c47d;
            }
            
            &.sugar {
              background-color: #e06666;
            }
          }
        }
        
        .nutrition-info {
          display: flex;
          justify-content: space-between;
          
          .value {
            font-weight: 600;
          }
          
          .label {
            color: #666;
          }
        }
      }
    }
  }
  
  .health-benefits {
    margin-top: 25px;
    background-color: #f8f8f8;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #eee;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    
    @media (max-width: 480px) {
      padding: 15px;
      margin-top: 20px;
    }
    
    h4 {
      font-size: 1.15rem;
      font-weight: 600;
      color: v.$font-color-dark;
      margin: 0 0 15px 0;
      
      @media (max-width: 480px) {
        font-size: 1.05rem;
        margin-bottom: 12px;
      }
    }
    
    .benefits-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style: none;
      
      li {
        background-color: white;
        padding: 12px 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
        border-left: 3px solid v.$tertiary;
        transition: transform 0.2s ease;
        word-wrap: break-word;
        overflow-wrap: break-word;
        
        @media (max-width: 480px) {
          padding: 10px 12px;
        }
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        span {
          font-size: 0.95rem;
          line-height: 1.5;
          color: v.$font-color-dark;
          display: block;
          
          @media (max-width: 480px) {
            font-size: 0.9rem;
          }
        }
      }
    }
  }
  
  .local-impact {
    margin-top: 30px;
    background-color: #f8f8f8;
    padding: 25px;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    border-left: 5px solid v.$tertiary;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    
    @media (max-width: 480px) {
      padding: 20px;
    }
    
    h4 {
      margin-top: 20px;
      margin-bottom: 15px;
      color: v.$font-color-dark;
      font-size: 1.1rem;
      font-weight: 600;
      
      @media (max-width: 480px) {
        font-size: 1rem;
      }
      
      &:first-child {
        margin-top: 0;
      }
    }
    
    p {
      margin: 0 0 15px 0;
      font-size: 0.95rem;
      line-height: 1.7;
      color: v.$font-color-dark;
      
      @media (max-width: 480px) {
        font-size: 0.9rem;
      }
    }
    
    .impact-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
      
      .impact-card {
        background-color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
        border-top: 3px solid v.$tertiary;
        transition: transform 0.2s ease;
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .impact-title {
          font-weight: 600;
          font-size: 0.95rem;
          color: v.$tertiary-dark;
          margin-bottom: 8px;
        }
        
        .impact-description {
          font-size: 0.9rem;
          color: v.$font-color-dark;
          line-height: 1.5;
        }
      }
    }
  }
  
  .seasonality-chart-container {
    background-color: white;
    padding: 25px;
    border-radius: 12px;
    margin-top: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #f1f1f1;
    
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
        color: v.$primary;
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
      background-color: #f8f8f8;
      border-radius: 6px;
      width: fit-content;
      font-size: 0.9rem;
      color: v.$font-color-dark;
      
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
      background-color: white;
      border-radius: 8px;
      border: 1px solid #f1f1f1;
    }
  }

  /* Allergen Information Styling im Nutrition Tab */
  .allergen-info {
    margin-top: 25px;
    background-color: rgba(224, 102, 102, 0.1);
    padding: 18px 20px;
    border-radius: 12px;
    border-left: 4px solid #e06666;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: "⚠️";
      position: absolute;
      top: 5px;
      right: 10px;
      font-size: 28px;
      opacity: 0.15;
    }
    
    @media (max-width: 480px) {
      padding: 15px;
      margin-top: 20px;
    }
    
    h4 {
      color: v.$font-color-dark;
      margin: 0 0 10px 0;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 8px;
      
      @media (max-width: 480px) {
        font-size: 1rem;
      }
    }
    
    p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.6;
      color: #555;
      max-width: 100%;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      
      @media (max-width: 480px) {
        font-size: 0.9rem;
      }
    }
  }
</style> 