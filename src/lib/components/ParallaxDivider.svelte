<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  export let tag: string = 'explore more';
  
  // Removed unused divider binding - if you need it later, add proper typing

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Create parallax effect on scroll
    gsap.to(".shape", {
      y: (_, el) => (1 - parseFloat(el.getAttribute('data-speed') || '0')) * 
                    ScrollTrigger.maxScroll(window) * 0.1, // Fixed usage of parameters
      ease: "none",
      scrollTrigger: {
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
    
    // Animate shapes on load
    gsap.from(".shape", {
      scale: 0,
      opacity: 0, 
      duration: 1.5,
      ease: "elastic.out(1, 0.5)",
      stagger: 0.1
    });
  });
</script>

<div class="parallax-divider">
  <div class="shape circle" data-speed="0.5" style="--size: 60px; --left: 15%; --top: 20%; --color: var(--tertiary-color);"></div>
  <div class="shape square" data-speed="0.8" style="--size: 40px; --left: 25%; --top: 60%; --color: var(--primary-color);"></div>
  <div class="shape triangle" data-speed="0.3" style="--size: 50px; --left: 65%; --top: 30%; --color: var(--secondary-color);"></div>
  <div class="shape circle" data-speed="0.6" style="--size: 30px; --left: 85%; --top: 70%; --color: var(--quaternary-color);"></div>
  
  <div class="divider-content">
    <div class="tag">{tag}</div>
  </div>
</div>

<style lang="scss">
  @use "../../lib/styles/variables" as v;

  .parallax-divider {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    --primary-color: #{v.$primary};
    --secondary-color: #{v.$secondary};
    --tertiary-color: #{v.$tertiary};
    --quaternary-color: #{v.$quaternary};
  }
  
  .shape {
    position: absolute;
    width: var(--size);
    height: var(--size);
    left: var(--left);
    top: var(--top);
    opacity: 0.2;
    filter: blur(2px);
    will-change: transform;
    
    &.circle {
      border-radius: 50%;
      background-color: var(--color);
    }
    
    &.square {
      border-radius: 8px;
      background-color: var(--color);
      transform: rotate(45deg);
    }
    
    &.triangle {
      width: 0;
      height: 0;
      background: transparent;
      border-left: calc(var(--size) / 2) solid transparent;
      border-right: calc(var(--size) / 2) solid transparent;
      border-bottom: var(--size) solid var(--color);
    }
  }
  
  .divider-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
  
  .tag {
    font-family: "DynaPuff Regular", cursive;
    font-size: 1.4rem;
    color: v.$tertiary-dark;
    position: relative;
    
    &::before, &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 50px;
      height: 1px;
      background-color: v.$tertiary-light;
    }
    
    &::before {
      left: -70px;
    }
    
    &::after {
      right: -70px;
    }
  }
</style>
