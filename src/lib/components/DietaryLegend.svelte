<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  let legendEl: HTMLElement;
  
  function handleMouseMove(e: MouseEvent) {
    const rect = legendEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    legendEl.style.setProperty('--mouse-x', `${x}px`);
    legendEl.style.setProperty('--mouse-y', `${y}px`);
  }
  
  onMount(() => {
    // Subtle fade & slight scale entrance
    gsap.from(legendEl, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      delay: 0.2
    });
    // Removed complex spotlight animations for simplicity
  });
</script>

<div role="region" class="dietary-legend" bind:this={legendEl} on:mousemove={handleMouseMove}>
  <div class="legend-symbols">
    <div class="legend-item" title="Vegan - Contains no animal products">
      <span class="badge vegan">V</span>
      <span class="label">Vegan</span>
    </div>
    <div class="legend-item" title="Vegetarian - Contains no meat products">
      <span class="badge vegetarian">VG</span>
      <span class="label">Vegetarian</span>
    </div>
    <div class="legend-item" title="Seasonal - Made with in‑season ingredients">
      <span class="badge seasonal">S</span>
      <span class="label">Seasonal</span>
    </div>
  </div>
</div>

<style lang="scss">
  @use "../../lib/styles/variables" as v;

  .dietary-legend {
    background-color: white; // Changed from light beige to white
    border: 1px solid rgba(160, 147, 125, 0.2);
    border-radius: 4px; // Keep angular shape
    padding: 14px 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(106, 89, 72, 0.05);
    max-width: 400px;
    margin: 0 auto 25px;
  }
  
  .legend-symbols {
    display: flex;
    align-items: center;
    gap: 25px;
    justify-content: center;
    width: 100%;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s ease;
    
    &:hover { 
      transform: translateY(-2px);
    }
    
    .badge {
      width: 24px;
      height: 24px;
      border-radius: 3px; // Slightly less rounded corners
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.75rem;
      font-weight: bold;
      color: white;
      border: 1.5px solid rgba(0, 0, 0, 0.08); // Simple border
      transition: transform 0.2s ease;
    }
    
    &:hover .badge {
      transform: scale(1.1);
    }
    
    .label {
      font-family: 'Inter 24pt Regular', sans-serif;
      font-size: 0.85rem;
      color: #4a3c31;
      font-weight: 500;
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
  
  @media (max-width: 480px) {
    .dietary-legend {
      padding: 10px 15px;
    }
    
    .legend-symbols {
      gap: 15px;
    }
    
    .legend-item {
      .label {
        font-size: 0.75rem;
      }
      
      .badge {
        width: 20px;
        height: 20px;
        font-size: 0.65rem;
      }
    }
  }
</style>
