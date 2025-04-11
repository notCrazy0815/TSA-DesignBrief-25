<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  
  export let title: string;
  export let subtitle: string = '';
  
  let headerEl: HTMLElement;
  
  onMount(() => {
    gsap.from(headerEl, {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
    
    gsap.from(".ornament", {
      scale: 0,
      opacity: 0, 
      duration: 1,
      ease: "elastic.out(1, 0.5)",
      stagger: 0.2,
      delay: 0.3
    });
  });
</script>

<div class="menu-header" bind:this={headerEl}>
  <div class="ornament left"></div>
  <div class="header-content">
    <h1 class="menu-title">{title}</h1>
    {#if subtitle}
      <p class="menu-subtitle">{subtitle}</p>
    {/if}
  </div>
  <div class="ornament right"></div>
</div>

<style lang="scss">
  @use "../../lib/styles/variables" as v;
  
  .menu-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 25px 0;
    position: relative;
    background-color: white; // Changed from light beige to white
    border-radius: 4px; // Keep angular corners
    border: 1px solid rgba(160, 147, 125, 0.2);
    box-shadow: 0 6px 16px rgba(106, 89, 72, 0.05);
    margin-bottom: 25px;
    
    @media (max-width: 767px) {
      padding: 20px 10px;
      flex-direction: column;
      gap: 12px;
    }
  }
  
  .header-content {
    text-align: center;
    margin: 0 30px;
    
    @media (max-width: 767px) {
      margin: 0 15px;
    }
  }
  
  .menu-title {
    font-family: "DynaPuff Regular", cursive;
    font-size: clamp(2rem, 4vw, 2.8rem);
    color: #4a3c31;
    margin: 0;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: 1.1;
  }
  
  .menu-subtitle {
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: clamp(1rem, 2vw, 1.4rem);
    color: v.$tertiary; // Restored brand color
    margin-top: 6px;
    font-style: italic;
    font-weight: 300;
  }
  
  .ornament {
    position: relative;
    width: 80px;
    height: 30px;
    
    &::before, &::after {
      content: '';
      position: absolute;
      height: 2px;
      background-color: v.$tertiary; // Restored brand color
      top: 50%;
      transform: translateY(-50%);
    }
    
    &::before {
      width: 50px;
      left: 0;
    }
    
    &::after {
      width: 15px;
      left: 60px;
    }
    
    &.right {
      transform: rotate(180deg);
    }
    
    @media (max-width: 767px) {
      width: 60px;
      height: 20px;
      
      &::before {
        width: 35px;
      }
      
      &::after {
        width: 12px;
        left: 45px;
      }
    }
  }
</style>
