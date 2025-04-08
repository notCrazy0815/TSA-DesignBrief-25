<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  
  export let title: string;
  export let subtitle: string = '';
  
  let headerEl: HTMLElement; // Added proper typing
  
  onMount(() => {
    gsap.from(headerEl, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
    
    gsap.from(".ornament", {
      scale: 0,
      opacity: 0, 
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
      stagger: 0.2,
      delay: 0.3
    });
  });
</script>

<div class="italian-menu-header" bind:this={headerEl}>
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
  
  .italian-menu-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    
    @media (max-width: 767px) {
      padding: 20px 0;
      flex-direction: column;
      gap: 15px;
    }
  }
  
  .header-content {
    text-align: center;
    margin: 0 40px;
    
    @media (max-width: 767px) {
      margin: 0 20px;
    }
  }
  
  .menu-title {
    font-family: "DynaPuff Regular", cursive;
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    color: #4a3525;
    margin: 0;
    font-weight: 900;
    letter-spacing: -0.5px;
    line-height: 1.1;
  }
  
  .menu-subtitle {
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: clamp(1.3rem, 2.5vw, 1.8rem);
    color: v.$primary;
    margin-top: 5px;
    font-style: italic;
  }
  
  .ornament {
    position: relative;
    width: 100px;
    height: 40px;
    
    &::before, &::after {
      content: '';
      position: absolute;
      height: 2px;
      background-color: v.$primary;
      top: 50%;
      transform: translateY(-50%);
    }
    
    &::before {
      width: 60px;
      left: 0;
    }
    
    &::after {
      width: 20px;
      left: 70px;
    }
    
    &.right {
      transform: rotate(180deg);
    }
    
    @media (max-width: 767px) {
      width: 70px;
      height: 30px;
      
      &::before {
        width: 40px;
      }
      
      &::after {
        width: 15px;
        left: 50px;
      }
    }
  }
</style>
