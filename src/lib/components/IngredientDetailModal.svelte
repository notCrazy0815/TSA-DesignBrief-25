<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import type { IngredientSource } from "../data/menuData";
  import SeasonalAvailabilityChart from "./SeasonalAvailabilityChart.svelte";
  
  export let ingredient: IngredientSource | null = null;
  export let onClose = () => {};
  
  let activeTab = 'origin'; // 'origin', 'nutrition', 'sustainability'
  
  function setActiveTab(tab: string) {
    activeTab = tab;
  }
  
  // Extrahiere die Spitzenzeitmonate aus den Saisondaten
  $: peakMonths = ingredient?.seasonalData
    ? ingredient.seasonalData
        .filter(d => d.availability > 90)
        .map(d => d.month)
    : [];
</script>

{#if ingredient}
  <div class="ingredient-modal" in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
    <div class="modal-backdrop" on:click={onClose}></div>
    <div class="modal-content" in:fly={{ y: 20, duration: 400 }}>
      <button class="modal-close" on:click={onClose} aria-label="Schließen">
        <span>×</span>
      </button>
      
      <div class="modal-header">
        <div class="ingredient-farm-badge">Farm to Table</div>
        <h2>{ingredient.name}</h2>
        <div class="farm-info">
          <span class="from">aus</span>
          <span class="farm-name">{ingredient.farm}</span>
          <span class="distance">({ingredient.distance} km entfernt)</span>
        </div>
      </div>
      
      {#if ingredient.image}
        <div class="ingredient-image-container">
          <img 
            src={ingredient.image} 
            alt={ingredient.name} 
            class="ingredient-image"
          />
          <div class="image-overlay"></div>
          {#if ingredient.organic}
            <div class="organic-badge">Bio</div>
          {/if}
        </div>
      {/if}
      
      <div class="modal-tabs">
        <button 
          class="tab-button" 
          class:active={activeTab === 'origin'} 
          on:click={() => setActiveTab('origin')}
        >
          <span class="tab-icon">🌱</span>
          Herkunft
        </button>
        <button 
          class="tab-button" 
          class:active={activeTab === 'nutrition'} 
          on:click={() => setActiveTab('nutrition')}
        >
          <span class="tab-icon">🥗</span>
          Nährwert
        </button>
        <button 
          class="tab-button" 
          class:active={activeTab === 'sustainability'} 
          on:click={() => setActiveTab('sustainability')}
        >
          <span class="tab-icon">♻️</span>
          Nachhaltigkeit
        </button>
      </div>
      
      <div class="tab-content">
        {#if activeTab === 'origin'}
          <div class="origin-tab" transition:fade={{ duration: 150 }}>
            <div class="description-section">
              <p>{ingredient.description}</p>
            </div>
            
            <div class="seasonal-section">
              <h3>Saisonalität</h3>
              <SeasonalAvailabilityChart 
                seasonalData={ingredient.seasonalData} 
                ingredientName={ingredient.name} 
                peakMonths={peakMonths}
                height="180px" 
              />
              
              <div class="seasonal-details">
                <div class="detail-item">
                  <span class="detail-label">Saison:</span>
                  <span class="detail-value">{ingredient.season}</span>
                </div>
                {#if ingredient.peakSeason}
                  <div class="detail-item">
                    <span class="detail-label">Beste Zeit:</span>
                    <span class="detail-value">{ingredient.peakSeason}</span>
                  </div>
                {/if}
                {#if ingredient.latestHarvest}
                  <div class="detail-item">
                    <span class="detail-label">Letzte Ernte:</span>
                    <span class="detail-value">{new Date(ingredient.latestHarvest).toLocaleDateString('de-DE', {year: 'numeric', month: 'long', day: 'numeric'})}</span>
                  </div>
                {/if}
              </div>
            </div>
            
            <div class="farm-section">
              <h3>Über {ingredient.farm}</h3>
              <p>{ingredient.farmDescription}</p>
              
              {#if ingredient.harvestMethods}
                <div class="harvest-methods">
                  <h4>Erntemethode</h4>
                  <p>{ingredient.harvestMethods}</p>
                </div>
              {/if}
              
              {#if ingredient.storageInfo}
                <div class="storage-info">
                  <h4>Lagerung & Frische</h4>
                  <p>{ingredient.storageInfo}</p>
                  {#if ingredient.freshnessTips}
                    <p class="freshness-tips"><strong>Tipp:</strong> {ingredient.freshnessTips}</p>
                  {/if}
                </div>
              {/if}
              
              {#if ingredient.farmerName}
                <div class="farmer-info">
                  <h4>Der Landwirt</h4>
                  <div class="farmer-profile">
                    {#if ingredient.farmerPhoto}
                      <img 
                        src={ingredient.farmerPhoto} 
                        alt={ingredient.farmerName} 
                        class="farmer-photo"
                      />
                    {/if}
                    <div class="farmer-details">
                      <p class="farmer-name">{ingredient.farmerName}</p>
                      {#if ingredient.farmerBio}
                        <p class="farmer-bio">{ingredient.farmerBio}</p>
                      {/if}
                    </div>
                  </div>
                </div>
              {/if}
              
              {#if ingredient.farmVisit}
                <div class="visit-info">
                  <h4>Besuche den Hof</h4>
                  <p>{ingredient.farmVisit}</p>
                </div>
              {/if}
            </div>
          </div>
        {/if}
        
        {#if activeTab === 'nutrition'}
          <div class="nutrition-tab" transition:fade={{ duration: 150 }}>
            {#if ingredient.nutritionDescription}
              <p class="nutrition-description">{ingredient.nutritionDescription}</p>
            {/if}
            
            {#if ingredient.nutritionComparison}
              <div class="nutrition-comparison">
                <h3>Nährwertvergleich</h3>
                <p class="comparison-intro">Vergleich zwischen lokal angebauten {ingredient.name} und konventionellen Produkten:</p>
                
                <div class="comparison-charts">
                  {#each Object.entries(ingredient.nutritionComparison) as [nutrient, values]}
                    <div class="comparison-item">
                      <div class="comparison-header">{nutrient}</div>
                      <div class="comparison-bars">
                        <div class="bar-container">
                          <div class="bar-label">Lokal</div>
                          <div class="bar-track">
                            <div
                              class="bar local-bar"
                              style="width: {(values.local / values.max * 100)}%"
                            ></div>
                          </div>
                          <div class="bar-value">{values.local}%</div>
                        </div>
                        <div class="bar-container">
                          <div class="bar-label">Konventionell</div>
                          <div class="bar-track">
                            <div
                              class="bar conventional-bar"
                              style="width: {(values.conventional / values.max * 100)}%"
                            ></div>
                          </div>
                          <div class="bar-value">{values.conventional}%</div>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
            
            {#if ingredient.nutritionBenefits && ingredient.nutritionBenefits.length > 0}
              <div class="nutrition-benefits">
                <h3>Gesundheitliche Vorteile</h3>
                <div class="benefits-list">
                  {#each ingredient.nutritionBenefits as benefit}
                    <div class="benefit-item">
                      <div class="benefit-icon">{benefit.icon}</div>
                      <div class="benefit-content">
                        <div class="benefit-name">{benefit.name}</div>
                        <div class="benefit-description">{benefit.description}</div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}
        
        {#if activeTab === 'sustainability'}
          <div class="sustainability-tab" transition:fade={{ duration: 150 }}>
            {#if ingredient.environmentalImpact}
              <div class="environmental-impact">
                <h3>Umweltauswirkungen</h3>
                <p>{ingredient.environmentalImpact}</p>
              </div>
            {/if}
            
            {#if ingredient.carbonFootprint}
              <div class="carbon-footprint">
                <h3>CO₂-Fußabdruck</h3>
                <div class="footprint-comparison">
                  <div class="footprint-item local">
                    <div class="footprint-value">{ingredient.carbonFootprint.local}</div>
                    <div class="footprint-label">Lokal angebaut</div>
                  </div>
                  <div class="footprint-vs">vs</div>
                  <div class="footprint-item conventional">
                    <div class="footprint-value">{ingredient.carbonFootprint.conventional}</div>
                    <div class="footprint-label">Konventionelle Lieferkette</div>
                  </div>
                </div>
                <div class="savings-indicator">
                  <div class="savings-value">{ingredient.carbonFootprint.savings}%</div>
                  <div class="savings-label">CO₂-Einsparung durch lokalen Anbau</div>
                </div>
              </div>
            {/if}
            
            {#if ingredient.communityImpact}
              <div class="community-impact">
                <h3>Gemeinschaftlicher Einfluss</h3>
                <p>{ingredient.communityImpact}</p>
                {#if ingredient.jobsSupported}
                  <div class="jobs-supported">
                    <span class="jobs-icon">👥</span>
                    <span class="jobs-number">{ingredient.jobsSupported}</span>
                    <span class="jobs-text">unterstützte Arbeitsplätze</span>
                  </div>
                {/if}
              </div>
            {/if}
            
            {#if ingredient.practices && ingredient.practices.length > 0}
              <div class="farming-practices">
                <h3>Nachhaltige Praktiken</h3>
                <div class="practices-grid">
                  {#each ingredient.practices as practice}
                    <div class="practice-item">
                      <div class="practice-icon">{practice.icon}</div>
                      <div class="practice-name">{practice.name}</div>
                      <div class="practice-description">{practice.description}</div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
            
            <div class="certifications">
              <div class="certification-badges">
                {#if ingredient.organic}
                  <div class="certification-badge organic">Bio-Zertifiziert</div>
                {/if}
                {#if ingredient.nonGMO}
                  <div class="certification-badge non-gmo">Nicht-GVO</div>
                {/if}
              </div>
            </div>
          </div>
        {/if}
      </div>
      
      <div class="modal-footer">
        <div class="footer-tagline">Teil unserer Farm-to-Table-Initiative</div>
        <button class="close-button" on:click={onClose}>Schließen</button>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "../../styles/variables" as v;
  
  .ingredient-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1100; // Höher als das MenuItemModal
    display: flex;
    align-items: center;
    justify-content: center;
    
    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(v.$font-color-dark, 0.8);
      backdrop-filter: blur(5px);
      cursor: pointer;
    }
    
    .modal-content {
      position: relative;
      width: 90%;
      max-width: 900px;
      max-height: 90vh;
      background-color: white;
      border-radius: 12px;
      box-shadow: 
        0 10px 40px rgba(0, 0, 0, 0.18),
        0 5px 15px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      z-index: 1101;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
    }
    
    &:hover {
      background-color: v.$tertiary;
      transform: scale(1.05) rotate(90deg);
      
      span {
        color: white;
      }
    }
  }
  
  .modal-header {
    padding: 24px 28px;
    background-color: rgba(v.$tertiary-light, 0.05);
    position: relative;
    border-bottom: 1px solid rgba(v.$tertiary-light, 0.1);
    
    h2 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 2rem;
      color: v.$tertiary-dark;
      margin: 0 0 8px;
      padding-right: 40px;
      line-height: 1.3;
    }
    
    .farm-info {
      font-family: "Inter 24pt Regular", sans-serif;
      color: v.$tertiary;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;
      
      .from {
        opacity: 0.8;
      }
      
      .farm-name {
        font-weight: 600;
      }
      
      .distance {
        opacity: 0.7;
        font-style: italic;
      }
    }
  }
  
  .ingredient-farm-badge {
    display: inline-block;
    background-color: #3d8b40;
    color: white;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 4px;
    margin-bottom: 12px;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .ingredient-image-container {
    width: 100%;
    height: 300px;
    position: relative;
    overflow: hidden;
    
    .ingredient-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
      
      &:hover {
        transform: scale(1.03);
      }
    }
    
    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100px;
      background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.5));
      z-index: 1;
    }
    
    .organic-badge {
      position: absolute;
      top: 20px;
      right: 20px;
      background-color: #4CAF50;
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      z-index: 2;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .modal-tabs {
    display: flex;
    padding: 5px;
    background-color: #f8f5f2;
    border-bottom: 1px solid rgba(v.$tertiary-light, 0.1);
    
    .tab-button {
      flex: 1;
      border: none;
      background: none;
      padding: 15px 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 8px;
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 0.95rem;
      color: #555;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      
      &:hover {
        background-color: rgba(v.$tertiary-light, 0.05);
        color: v.$tertiary-dark;
      }
      
      &.active {
        background-color: white;
        color: v.$tertiary-dark;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
      
      .tab-icon {
        font-size: 1.1rem;
      }
    }
  }
  
  .tab-content {
    flex: 1;
    overflow-y: auto;
    padding: 30px;
    
    h3 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.5rem;
      color: v.$tertiary;
      margin: 0 0 18px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(v.$tertiary-light, 0.15);
    }
    
    h4 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.1rem;
      color: v.$tertiary-dark;
      margin: 22px 0 8px;
    }
    
    p {
      margin: 0 0 15px;
      line-height: 1.6;
      color: #444;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .description-section {
      margin-bottom: 30px;
      
      p {
        font-size: 1.05rem;
      }
    }
  }
  
  .seasonal-section, .farm-section, .environmental-impact, 
  .carbon-footprint, .community-impact, .farming-practices,
  .nutrition-comparison, .nutrition-benefits {
    margin-bottom: 35px;
  }
  
  .seasonal-details {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    background-color: rgba(v.$tertiary-light, 0.02);
    padding: 15px;
    border-radius: 8px;
    border: 1px solid rgba(v.$tertiary-light, 0.1);
    
    .detail-item {
      display: flex;
      flex-direction: column;
      
      .detail-label {
        font-size: 0.85rem;
        color: #777;
        margin-bottom: 3px;
        font-family: "Inter 24pt Regular", sans-serif;
      }
      
      .detail-value {
        font-size: 1rem;
        color: v.$tertiary-dark;
        font-weight: 500;
        font-family: "Inter 24pt Regular", sans-serif;
      }
    }
  }
  
  .farmer-profile {
    display: flex;
    gap: 20px;
    margin-top: 15px;
    background-color: #f9f6f3;
    padding: 20px;
    border-radius: 8px;
    
    .farmer-photo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .farmer-details {
      flex: 1;
      
      .farmer-name {
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 8px;
        color: v.$tertiary-dark;
        font-family: "Inter 24pt Regular", sans-serif;
      }
      
      .farmer-bio {
        margin: 0;
        font-size: 0.95rem;
        font-family: "Inter 24pt Regular", sans-serif;
      }
    }
  }
  
  .freshness-tips {
    font-style: italic;
    padding-left: 10px;
    border-left: 3px solid v.$primary;
  }
  
  .visit-info {
    background-color: rgba(v.$tertiary-light, 0.04);
    padding: 15px 20px;
    border-radius: 8px;
    border: 1px dashed rgba(v.$tertiary-light, 0.3);
    margin-top: 20px;
    
    h4 {
      margin-top: 0;
    }
    
    p {
      margin-bottom: 0;
    }
  }
  
  // Nutrition tab
  .nutrition-description {
    font-size: 1.05rem;
    margin-bottom: 25px;
  }
  
  .comparison-intro {
    margin-bottom: 20px;
  }
  
  .comparison-charts {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .comparison-item {
    border: 1px solid rgba(v.$tertiary-light, 0.1);
    border-radius: 8px;
    padding: 15px;
    background-color: #f9f8f6;
  }
  
  .comparison-header {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 15px;
    color: v.$tertiary-dark;
    text-align: center;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .comparison-bars {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .bar-container {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .bar-label {
      width: 100px;
      font-size: 0.9rem;
      color: #555;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .bar-track {
      flex: 1;
      height: 10px;
      background-color: #e0e0e0;
      border-radius: 5px;
      overflow: hidden;
    }
    
    .bar {
      height: 100%;
      border-radius: 5px;
      transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      
      &.local-bar {
        background-color: v.$primary;
      }
      
      &.conventional-bar {
        background-color: #aaa;
      }
    }
    
    .bar-value {
      width: 50px;
      font-size: 0.9rem;
      font-weight: 600;
      text-align: right;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .benefits-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .benefit-item {
    display: flex;
    align-items: flex-start;
    padding: 15px;
    background-color: #f9f8f6;
    border-radius: 8px;
    border: 1px solid rgba(v.$tertiary-light, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    
    .benefit-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: v.$tertiary-light;
      color: white;
      border-radius: 50%;
      margin-right: 15px;
      font-size: 1.1rem;
      font-weight: 600;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .benefit-content {
      flex: 1;
      
      .benefit-name {
        font-weight: 600;
        margin-bottom: 5px;
        color: v.$tertiary-dark;
        font-family: "Inter 24pt Regular", sans-serif;
      }
      
      .benefit-description {
        font-size: 0.9rem;
        color: #666;
        line-height: 1.5;
        font-family: "Inter 24pt Regular", sans-serif;
      }
    }
  }
  
  // Sustainability tab
  .footprint-comparison {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 25px 0;
  }
  
  .footprint-item {
    text-align: center;
    width: 45%;
    padding: 20px;
    border-radius: 8px;
    
    &.local {
      background-color: rgba(v.$tertiary-light, 0.1);
      border: 1px solid rgba(v.$tertiary-light, 0.2);
    }
    
    &.conventional {
      background-color: rgba(#999, 0.1);
      border: 1px solid rgba(#999, 0.2);
    }
    
    .footprint-value {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: v.$tertiary-dark;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .footprint-label {
      font-size: 0.9rem;
      color: #555;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .footprint-vs {
    font-size: 1.2rem;
    font-weight: 600;
    color: #888;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .savings-indicator {
    background-color: #4CAF50;
    color: white;
    padding: 15px;
    text-align: center;
    border-radius: 8px;
    margin-bottom: 20px;
    
    .savings-value {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 5px;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .savings-label {
      font-size: 0.9rem;
      opacity: 0.9;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .jobs-supported {
    background-color: rgba(v.$tertiary-light, 0.05);
    padding: 15px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
    
    .jobs-icon {
      font-size: 1.2rem;
    }
    
    .jobs-number {
      font-size: 1.4rem;
      font-weight: 700;
      color: v.$tertiary-dark;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .jobs-text {
      font-size: 0.95rem;
      color: #555;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .practices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .practice-item {
    background-color: #f9f8f6;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid rgba(v.$tertiary-light, 0.1);
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    
    .practice-icon {
      font-size: 1.3rem;
      width: 40px;
      height: 40px;
      background-color: v.$tertiary-light;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin: 0 auto 12px;
      font-family: "Inter 24pt Regular", sans-serif;
      font-weight: 600;
    }
    
    .practice-name {
      text-align: center;
      font-weight: 600;
      margin-bottom: 8px;
      color: v.$tertiary-dark;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .practice-description {
      font-size: 0.9rem;
      color: #555;
      text-align: center;
      line-height: 1.5;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .certifications {
    margin-top: 30px;
  }
  
  .certification-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }
  
  .certification-badge {
    padding: 8px 15px;
    border-radius: 30px;
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: "Inter 24pt Regular", sans-serif;
    
    &.organic {
      background-color: rgba(76, 175, 80, 0.1);
      color: #2E7D32;
      border: 1px solid rgba(76, 175, 80, 0.3);
      
      &::before {
        content: "✓";
        font-weight: bold;
      }
    }
    
    &.non-gmo {
      background-color: rgba(66, 165, 245, 0.1);
      color: #1976D2;
      border: 1px solid rgba(66, 165, 245, 0.3);
      
      &::before {
        content: "✓";
        font-weight: bold;
      }
    }
  }
  
  .modal-footer {
    padding: 20px;
    background-color: #f8f5f2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(v.$tertiary-light, 0.1);
    
    .footer-tagline {
      font-style: italic;
      color: #777;
      font-size: 0.9rem;
      font-family: "Inter 24pt Regular", sans-serif;
    }
    
    .close-button {
      background-color: white;
      border: 1px solid rgba(v.$tertiary-light, 0.2);
      padding: 8px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.95rem;
      color: v.$tertiary-dark;
      transition: all 0.2s ease;
      font-family: "Inter 24pt Regular", sans-serif;
      
      &:hover {
        background-color: v.$tertiary;
        color: white;
        border-color: v.$tertiary;
      }
    }
  }
  
  @media screen and (max-width: 768px) {
    .modal-content {
      width: 95%;
      max-height: 95vh;
    }
    
    .modal-header {
      padding: 20px;
      
      h2 {
        font-size: 1.6rem;
      }
    }
    
    .ingredient-image-container {
      height: 200px;
    }
    
    .modal-tabs {
      overflow-x: auto;
      justify-content: flex-start;
      padding: 5px 0;
      
      .tab-button {
        min-width: 110px;
        font-size: 0.85rem;
        padding: 12px 8px;
        white-space: nowrap;
      }
    }
    
    .tab-content {
      padding: 20px;
    }
    
    .farmer-profile {
      flex-direction: column;
      align-items: center;
      text-align: center;
      
      .farmer-photo {
        margin-bottom: 15px;
      }
    }
    
    .footprint-comparison {
      flex-direction: column;
      gap: 15px;
      
      .footprint-item {
        width: 100%;
      }
      
      .footprint-vs {
        margin: 5px 0;
      }
    }
    
    .modal-footer {
      flex-direction: column;
      gap: 15px;
      text-align: center;
      
      .close-button {
        width: 100%;
      }
    }
  }
</style> 