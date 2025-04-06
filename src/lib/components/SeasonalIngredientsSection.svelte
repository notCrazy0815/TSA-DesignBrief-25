<script lang="ts">
  import { onMount } from "svelte";
  import type { SeasonalIngredient } from "../data/menuData";
  import SeasonalAvailabilityChart from "./SeasonalAvailabilityChart.svelte";
  
  export let seasonalIngredients: SeasonalIngredient[] = [];
  export let title: string = "Saisonale Verfügbarkeit unserer Zutaten";
  export let description: string = "Wir servieren unsere Gerichte entsprechend der saisonalen Verfügbarkeit lokaler Zutaten. Hier sehen Sie, wann unsere wichtigsten Zutaten am frischesten und geschmackvollsten sind.";
  
  let activeCategory: string = 'all';
  let mounted = false;
  let categories: string[] = [];
  let currentMonth: string = '';
  
  // Monate auf Deutsch
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  
  onMount(() => {
    mounted = true;
    
    // Extrahiere alle eindeutigen Kategorien
    if (seasonalIngredients && seasonalIngredients.length > 0) {
      const uniqueCategories = new Set(seasonalIngredients.map(ingredient => ingredient.category));
      categories = Array.from(uniqueCategories);
    }
    
    // Ermittle den aktuellen Monat
    const date = new Date();
    currentMonth = months[date.getMonth()];
  });
  
  function setActiveCategory(category: string) {
    activeCategory = category;
  }
  
  // Filtere Zutaten nach Kategorie
  $: filteredIngredients = activeCategory === 'all' 
    ? seasonalIngredients 
    : seasonalIngredients.filter(ingredient => ingredient.category === activeCategory);
  
  // Sortiere Zutaten nach Verfügbarkeit im aktuellen Monat
  $: sortedIngredients = [...filteredIngredients].sort((a, b) => {
    const aAvailability = a.availability[currentMonth] || 0;
    const bAvailability = b.availability[currentMonth] || 0;
    return bAvailability - aAvailability;
  });
  
  // Formattiere die Daten für das Diagramm
  function getChartData(ingredient: SeasonalIngredient) {
    return months.map(month => ({
      month,
      availability: ingredient.availability[month] || 0
    }));
  }
</script>

<section class="seasonal-section">
  <div class="section-header">
    <h2>{title}</h2>
    <p class="section-description">{description}</p>
    
    <div class="current-month-indicator">
      <div class="month-label">Aktueller Monat:</div>
      <div class="month-badge">{currentMonth}</div>
    </div>
  </div>
  
  <div class="category-tabs">
    <button 
      class="category-tab" 
      class:active={activeCategory === 'all'} 
      on:click={() => setActiveCategory('all')}
    >
      Alle
    </button>
    
    {#each categories as category}
      <button 
        class="category-tab" 
        class:active={activeCategory === category} 
        on:click={() => setActiveCategory(category)}
      >
        {category}
      </button>
    {/each}
  </div>
  
  <div class="ingredients-grid">
    {#if sortedIngredients.length === 0}
      <div class="no-ingredients">
        <p>Keine Zutaten in dieser Kategorie gefunden.</p>
      </div>
    {:else}
      {#each sortedIngredients as ingredient}
        <div class="ingredient-card" class:in-season={ingredient.availability[currentMonth] > 70}>
          <div class="ingredient-header">
            <h3>{ingredient.name}</h3>
            {#if ingredient.availability[currentMonth] > 90}
              <div class="peak-badge">Spitzenzeit</div>
            {:else if ingredient.availability[currentMonth] > 70}
              <div class="in-season-badge">Saison</div>
            {:else if ingredient.availability[currentMonth] > 20}
              <div class="limited-badge">Begrenzt</div>
            {:else}
              <div class="out-of-season-badge">Nicht in Saison</div>
            {/if}
          </div>
          
          <div class="chart-container">
            <SeasonalAvailabilityChart 
              seasonalData={getChartData(ingredient)} 
              ingredientName={ingredient.name} 
              peakMonths={ingredient.peak || []}
              height="120px"
              showTitle={false}
            />
          </div>
          
          <div class="ingredient-details">
            <div class="detail-item">
              <span class="detail-label">Kategorie:</span>
              <span class="detail-value">{ingredient.category}</span>
            </div>
            
            {#if ingredient.peak && ingredient.peak.length > 0}
              <div class="detail-item">
                <span class="detail-label">Beste Zeit:</span>
                <span class="detail-value">{ingredient.peak.join(', ')}</span>
              </div>
            {/if}
            
            {#if ingredient.localSource}
              <div class="detail-item source">
                <span class="detail-label">Quelle:</span>
                <span class="detail-value">{ingredient.localSource}</span>
              </div>
            {/if}
          </div>
          
          <div class="availability-indicator">
            <div class="availability-label">Aktuelle Verfügbarkeit:</div>
            <div class="availability-meter">
              <div 
                class="availability-bar" 
                style="width: {ingredient.availability[currentMonth]}%"
                class:high={ingredient.availability[currentMonth] > 70}
                class:medium={ingredient.availability[currentMonth] > 30 && ingredient.availability[currentMonth] <= 70}
                class:low={ingredient.availability[currentMonth] <= 30}
              ></div>
            </div>
            <div class="availability-value">{ingredient.availability[currentMonth] || 0}%</div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
  
  <div class="seasonal-legend">
    <div class="legend-title">Legende zur Verfügbarkeit:</div>
    <div class="legend-items">
      <div class="legend-item">
        <span class="legend-color peak"></span>
        <span class="legend-text">Spitzenzeit (90-100%): Optimale Qualität und Geschmack</span>
      </div>
      <div class="legend-item">
        <span class="legend-color high"></span>
        <span class="legend-text">Saison (70-89%): Ausgezeichnete Verfügbarkeit</span>
      </div>
      <div class="legend-item">
        <span class="legend-color medium"></span>
        <span class="legend-text">Begrenzt (30-69%): Begrenzte Verfügbarkeit</span>
      </div>
      <div class="legend-item">
        <span class="legend-color low"></span>
        <span class="legend-text">Außerhalb der Saison (0-29%): Niedrige oder keine Verfügbarkeit</span>
      </div>
    </div>
  </div>
  
  <div class="farm-to-table-note">
    <h3>Unser Farm-to-Table-Versprechen</h3>
    <p>
      Wir beziehen unsere Zutaten direkt von lokalen Bauern und Produzenten, was bedeutet, dass wir den natürlichen Rhythmus der Saisons respektieren. Dies garantiert nicht nur Frische und Geschmack, sondern reduziert auch unseren ökologischen Fußabdruck. Unsere Küche passt sich regelmäßig an, um das Beste zu bieten, was die aktuelle Saison zu bieten hat.
    </p>
  </div>
</section>

<style lang="scss">
  @use "../../styles/variables" as v;
  
  .seasonal-section {
    padding: 40px 0;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 40px;
    position: relative;
    
    h2 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 2.2rem;
      color: v.$tertiary-dark;
      margin-bottom: 15px;
    }
    
    .section-description {
      max-width: 800px;
      margin: 0 auto 20px;
      color: #555;
      line-height: 1.6;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .current-month-indicator {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    background-color: rgba(v.$tertiary-light, 0.05);
    border: 1px solid rgba(v.$tertiary-light, 0.1);
    border-radius: 30px;
    margin-top: 20px;
    
    .month-label {
      font-size: 0.9rem;
      color: #666;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .month-badge {
      background-color: v.$tertiary;
      color: white;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .category-tabs {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 30px;
    
    .category-tab {
      background: none;
      border: 1px solid rgba(v.$tertiary-light, 0.2);
      padding: 8px 18px;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 0.95rem;
      color: v.$tertiary;
      
      &:hover {
        background-color: rgba(v.$tertiary-light, 0.05);
        transform: translateY(-2px);
      }
      
      &.active {
        background-color: v.$tertiary;
        color: white;
        border-color: v.$tertiary;
        box-shadow: 0 2px 6px rgba(v.$tertiary-light, 0.3);
      }
    }
  }
  
  .ingredients-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
  }
  
  .ingredient-card {
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: 1px solid rgba(v.$tertiary-light, 0.1);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }
    
    &.in-season {
      border-top: 3px solid v.$primary;
    }
  }
  
  .ingredient-header {
    padding: 20px;
    background-color: rgba(v.$tertiary-light, 0.02);
    border-bottom: 1px solid rgba(v.$tertiary-light, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.4rem;
      color: v.$tertiary-dark;
      margin: 0;
    }
  }
  
  .peak-badge, .in-season-badge, .limited-badge, .out-of-season-badge {
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 600;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .peak-badge {
    background-color: v.$primary;
    color: white;
  }
  
  .in-season-badge {
    background-color: rgba(v.$primary, 0.15);
    color: darken(v.$primary, 10%);
  }
  
  .limited-badge {
    background-color: rgba(#ff9800, 0.1);
    color: #e65100;
  }
  
  .out-of-season-badge {
    background-color: rgba(#9e9e9e, 0.1);
    color: #616161;
  }
  
  .chart-container {
    padding: 15px 15px 0;
  }
  
  .ingredient-details {
    padding: 15px 20px;
    border-top: 1px solid rgba(v.$tertiary-light, 0.1);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    
    .detail-item {
      display: flex;
      flex-direction: column;
      
      &.source {
        grid-column: 1 / -1;
      }
      
      .detail-label {
        font-size: 0.75rem;
        color: #888;
        margin-bottom: 2px;
        font-family: "Inter 24pt Regular", sans-serif;
      }
      
      .detail-value {
        font-size: 0.9rem;
        color: v.$tertiary-dark;
        font-weight: 500;
        font-family: "Inter 24pt Regular", sans-serif;
      }
    }
  }
  
  .availability-indicator {
    padding: 15px 20px 20px;
    background-color: rgba(v.$tertiary-light, 0.02);
    
    .availability-label {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 8px;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .availability-meter {
      height: 12px;
      background-color: #e0e0e0;
      border-radius: 6px;
      overflow: hidden;
      position: relative;
      margin-bottom: 5px;
    }
    
    .availability-bar {
      height: 100%;
      border-radius: 6px;
      transition: width 0.5s ease;
      
      &.high {
        background-color: v.$primary;
      }
      
      &.medium {
        background-color: #ff9800;
      }
      
      &.low {
        background-color: #9e9e9e;
      }
    }
    
    .availability-value {
      text-align: right;
      font-size: 0.8rem;
      color: #555;
      font-weight: 600;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .no-ingredients {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    background-color: #f9f8f6;
    border-radius: 8px;
    
    p {
      color: #888;
      font-style: italic;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .seasonal-legend {
    background-color: rgba(v.$tertiary-light, 0.02);
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    border: 1px solid rgba(v.$tertiary-light, 0.1);
    
    .legend-title {
      font-weight: 600;
      margin-bottom: 15px;
      color: v.$tertiary-dark;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .legend-items {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      flex-shrink: 0;
      
      &.peak {
        background-color: v.$primary;
      }
      
      &.high {
        background-color: rgba(v.$primary, 0.6);
      }
      
      &.medium {
        background-color: #ff9800;
      }
      
      &.low {
        background-color: #9e9e9e;
      }
    }
    
    .legend-text {
      font-size: 0.85rem;
      color: #555;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .farm-to-table-note {
    background-color: #f9f8f6;
    padding: 30px;
    border-radius: 12px;
    border-left: 4px solid v.$primary;
    
    h3 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.5rem;
      color: v.$tertiary-dark;
      margin: 0 0 15px;
    }
    
    p {
      font-size: 1rem;
      line-height: 1.6;
      color: #444;
      margin: 0;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  @media screen and (max-width: 768px) {
    .section-header h2 {
      font-size: 1.8rem;
    }
    
    .ingredients-grid {
      grid-template-columns: 1fr;
    }
    
    .legend-items {
      grid-template-columns: 1fr;
    }
    
    .ingredient-details {
      grid-template-columns: 1fr;
    }
  }
</style> 