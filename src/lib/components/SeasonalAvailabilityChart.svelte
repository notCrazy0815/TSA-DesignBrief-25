<script lang="ts">
  import { onMount } from "svelte";
  
  export let seasonalData: Array<{month: string, availability: number}> = [];
  export let ingredientName: string = "";
  export let peakMonths: string[] = [];
  export let height: string = "120px";
  export let showLabels: boolean = true;
  export let showTitle: boolean = true;
  export let darkMode: boolean = false;
  
  let chartElement: HTMLElement;
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
  
  // Funktion zur Bestimmung von Farben basierend auf der Verfügbarkeit
  function getBarColor(availability: number, isPeak: boolean) {
    if (darkMode) {
      // Dunklere Farben für Dark Mode
      if (isPeak) return "#fc6234"; // Primary-Farbe für Spitzenzeit
      if (availability > 70) return "#fc7d57";
      if (availability > 40) return "#fc9879";
      if (availability > 10) return "#fcb39c";
      if (availability > 0) return "#fccebe";
      return "#494949";
    } else {
      // Normale Farben
      if (isPeak) return "#fc6234"; // Primary-Farbe für Spitzenzeit
      if (availability > 70) return "#fc7d57";
      if (availability > 40) return "#fc9879";
      if (availability > 10) return "#fcb39c";
      if (availability > 0) return "#fccebe";
      return "#e0e0e0";
    }
  }
  
  // Höchstverfügbarkeit für die Skalierung
  $: maxAvailability = Math.max(...seasonalData.map(d => d.availability), 100);
  
  // Prüfen, ob ein Monat ein Spitzenmonat ist
  function isPeakMonth(month: string): boolean {
    return peakMonths.includes(month);
  }
</script>

<div class="seasonal-chart-container" style:height={height} class:dark-mode={darkMode}>
  {#if showTitle}
    <h3 class="chart-title">
      Saisonale Verfügbarkeit: {ingredientName}
    </h3>
  {/if}
  
  <div class="chart-wrapper" bind:this={chartElement}>
    {#if seasonalData.length > 0 && mounted}
      <div class="chart-grid">
        <div class="chart-grid-line" style="bottom: 25%"></div>
        <div class="chart-grid-line" style="bottom: 50%"></div>
        <div class="chart-grid-line" style="bottom: 75%"></div>
        <div class="chart-grid-line" style="bottom: 100%"></div>
        
        {#if showLabels}
          <div class="chart-labels">
            <span class="chart-label" style="bottom: 25%">25%</span>
            <span class="chart-label" style="bottom: 50%">50%</span>
            <span class="chart-label" style="bottom: 75%">75%</span>
            <span class="chart-label" style="bottom: 100%">100%</span>
          </div>
        {/if}
      </div>
      
      <div class="chart-bars">
        {#each seasonalData as data, i}
          <div class="chart-bar-container" data-month={data.month}>
            <div 
              class="chart-bar" 
              style:height="{(data.availability / maxAvailability) * 100}%" 
              style:background-color={getBarColor(data.availability, isPeakMonth(data.month))}
              class:peak-month={isPeakMonth(data.month)}
              data-value={data.availability}
            >
              {#if data.availability > 0}
                <span class="tooltip">{data.availability}%</span>
              {/if}
            </div>
            {#if showLabels}
              <span class="month-label">{data.month}</span>
            {/if}
          </div>
        {/each}
      </div>
    {:else}
      <div class="no-data-message">
        Keine Daten verfügbar
      </div>
    {/if}
  </div>
  
  {#if peakMonths.length > 0}
    <div class="peak-indicator">
      <span class="peak-dot"></span>
      <span class="peak-text">Spitzenzeit</span>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "../../styles/variables" as v;
  
  .seasonal-chart-container {
    width: 100%;
    background-color: rgba(v.$background-color-light, 0.5);
    border-radius: 8px;
    padding: 1rem;
    position: relative;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(v.$tertiary-light, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    &.dark-mode {
      background-color: v.$background-color-dark;
      border-color: rgba(255, 255, 255, 0.1);
      color: v.$font-color-light;
      
      .chart-title, .month-label, .chart-label, .peak-text {
        color: v.$font-color-light;
      }
      
      .chart-grid-line {
        border-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
  
  .chart-title {
    font-family: "DynaPuff Regular", cursive;
    font-size: 1rem;
    margin: 0 0 0.8rem;
    color: v.$tertiary;
    text-align: center;
  }
  
  .chart-wrapper {
    height: calc(100% - 30px);
    position: relative;
    display: flex;
    align-items: flex-end;
    padding-bottom: 25px;
  }
  
  .chart-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 25px;
    z-index: 1;
  }
  
  .chart-grid-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    border-top: 1px dashed rgba(v.$tertiary-light, 0.2);
  }
  
  .chart-labels {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 30px;
  }
  
  .chart-label {
    position: absolute;
    left: 0;
    transform: translateY(50%);
    font-size: 0.65rem;
    color: #888;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .chart-bars {
    display: flex;
    width: 100%;
    height: 100%;
    padding-left: 30px;
    position: relative;
    z-index: 2;
  }
  
  .chart-bar-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 0 2px;
    height: 100%;
    position: relative;
  }
  
  .chart-bar {
    width: 100%;
    max-width: 30px;
    border-radius: 4px 4px 0 0;
    transition: all 0.3s ease;
    position: relative;
    min-height: 1px;
    
    &:hover {
      transform: scaleY(1.05);
      
      .tooltip {
        opacity: 1;
        transform: translateY(-5px);
      }
    }
    
    &.peak-month {
      position: relative;
      
      &::after {
        content: "";
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 8px;
        background-color: v.$primary;
        border-radius: 50%;
      }
    }
    
    .tooltip {
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%) translateY(0);
      background-color: rgba(v.$tertiary-dark, 0.8);
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.7rem;
      opacity: 0;
      transition: all 0.2s ease;
      pointer-events: none;
      white-space: nowrap;
      z-index: 10;
      font-family: "Inter 24pt Regular", sans-serif;
      
      &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 4px;
        border-style: solid;
        border-color: rgba(v.$tertiary-dark, 0.8) transparent transparent transparent;
      }
    }
  }
  
  .month-label {
    font-size: 0.75rem;
    margin-top: 5px;
    color: #666;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .no-data-message {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-style: italic;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .peak-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    
    .peak-dot {
      width: 8px;
      height: 8px;
      background-color: v.$primary;
      border-radius: 50%;
      margin-right: 5px;
    }
    
    .peak-text {
      font-family: "Inter 24pt Regular", sans-serif;
      color: #666;
    }
  }
  
  @media screen and (max-width: 600px) {
    .chart-bars {
      padding-left: 25px;
    }
    
    .chart-bar {
      max-width: 20px;
    }
    
    .month-label {
      font-size: 0.65rem;
      transform: rotate(-45deg);
      transform-origin: center;
      margin-top: 8px;
    }
    
    .chart-label {
      font-size: 0.6rem;
    }
    
    .chart-labels {
      width: 25px;
    }
  }
</style> 