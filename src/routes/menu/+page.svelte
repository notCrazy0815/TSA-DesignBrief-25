<script>
  import { onMount } from "svelte";
  import NavBar from "$lib/components/NavBar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  // Menu cards as a simple array
  const cards = [
    { id: 1, title: "Appetizers", text: "Kick off your culinary journey with our delightful plant-based appetizers, featuring fresh, innovative bites that tease your taste buds with vibrant flavors and sustainable ingredients." },
    { id: 2, title: "Main", text: "Enjoy exquisite vegan and vegetarian main courses crafted with passion and precision. Our mains blend traditional flavors with modern twists, using farm-fresh produce to create memorable plant-based dishes." },
    { id: 3, title: "Drinks", text: "Refresh yourself with our curated selection of organic, plant-based beverages and handcrafted cocktails. From fruit-infused creations to botanical blends, each sip complements your sustainable dining experience." },
    { id: 4, title: "Desserts", text: "End your dining experience on a sweet note with our decadent vegan desserts. Classic indulgence meets modern creativity with plant-based ingredients that prove sustainable eating never compromises on taste." }
  ];
  
  // Basic rotation for cards
  const cardRotations = [-5, 4, 10, -6];
  
  // Active state
  let activeCardId = null;
  let cardsContainer;
  
  // Open card
  function openCard(cardId) {
    activeCardId = activeCardId === cardId ? null : cardId;
    
    // Adjust container height when a card is opened
    if (activeCardId !== null) {
      setTimeout(() => {
        const activeCardElement = document.querySelector('.card.active');
        if (activeCardElement && cardsContainer) {
          const cardHeight = activeCardElement.offsetHeight;
          cardsContainer.style.height = `${cardHeight + 40}px`;
          
          // Scroll to active element
          const rect = cardsContainer.getBoundingClientRect();
          const topPos = window.scrollY + rect.top;
          window.scrollTo({ 
            top: topPos,
            behavior: 'smooth' 
          });
        }
      }, 50);
    } else {
      // Reset container height when no card is opened
      resetContainerHeight();
    }
  }
  
  // Mobile card height adjustment function
  function calculateMobileCardHeight() {
    if (window.innerWidth <= 767) {
      const cardWidth = window.innerWidth * 0.9; // 90vw
      const cardHeight = cardWidth * (2/3); // 3:2 aspect ratio
      return cardHeight;
    }
    return null;
  }

  // Reset container height
  function resetContainerHeight() {
    if (cardsContainer) {
      if (window.innerWidth < 768) {
        const mobileCardHeight = calculateMobileCardHeight();
        const spacing = 20;
        const mobileHeight = cards.length * (mobileCardHeight + spacing);
        cardsContainer.style.height = `${mobileHeight}px`;
      } else {
        cardsContainer.style.height = '80vw';
      }
    }
  }
  
  // Return rotation for a card
  function getRotation(index) {
    return cardRotations[index % cardRotations.length];
  }
  
  // Return CSS classes for a card
  function getCardClasses(cardId) {
    return activeCardId === null ? '' : 
           activeCardId === cardId ? 'active' : 
           'fly-out';
  }
  
  // Initialize card view
  onMount(() => {
    cardsContainer = document.querySelector('.menu-category-cards');
    resetContainerHeight();
    
    // Event listener for screen size changes
    window.addEventListener('resize', resetContainerHeight);
    
    return () => {
      window.removeEventListener('resize', resetContainerHeight);
    };
  });
</script>

<svelte:window on:resize={() => activeCardId === null && resetContainerHeight()}/>

<NavBar active="menu" />

<main>
  <section id="menu-categories">
    <div class="section-header">
      <h2 class="title-font">Our Seasonal Menu</h2>
      <p class="subtitle">Featuring locally-sourced produce and sustainable ingredients</p>
      <div class="decorative-element">
        <span class="line"></span>
        <span class="icon">✧</span>
        <span class="line"></span>
      </div>
    </div>
    
    <div class="menu-category-cards {activeCardId !== null ? 'with-active-card' : ''}" bind:this={cardsContainer}>
      {#each cards as card, i (card.id)}
        <button 
          class="card {getCardClasses(card.id)}"
          data-id={card.id}
          on:click={() => openCard(card.id)}
          aria-pressed={activeCardId === card.id}
          style={activeCardId === null ? `transform: translate3d(-50%, -50%, 0) rotateZ(${getRotation(i)}deg)` : ''}
        >
          <div class="title">
            <h3>{card.title}</h3>
          </div>
          <div class="text">
            <p>{card.text}</p>
          </div>
          <div class="card-pattern"></div>
        </button>
      {/each}
    </div>
    
    {#if activeCardId !== null}
      <div class="scroll-down-elegant">
        <span class="arrow-elegant"></span>
        <span class="hint-elegant">Category Selected</span>
      </div>
    {/if}
  </section>
</main>

<Footer />

<style lang="scss">
  @use "../../lib/styles/variables" as v;
  
  main {
    width: 100%;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 60px;
    
    h2 {
      font-size: 3rem;
      font-weight: 500;
      color: #4a3c31;
      margin-bottom: 10px;
      letter-spacing: 1px;
      font-family: "DynaPuff Regular", cursive;
    }
  }
  
  .title-font {
    font-family: "DynaPuff Regular", cursive;
    text-transform: none;
    position: relative;
    display: inline-block;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #695a4e;
    font-weight: 300;
    margin-top: 0.5rem;
    font-style: italic;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .decorative-element {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto;
    max-width: 300px;
    
    .line {
      height: 1px;
      background-color: #a0937d;
      flex-grow: 1;
      opacity: 0.6;
    }
    
    .icon {
      font-size: 1rem;
      color: #a0937d;
      margin: 0 15px;
    }
  }

  section#menu-categories {
    padding: 80px 0;
    background-color: v.$background-color-light;
    position: relative;
    overflow: clip;
    z-index: 1;
  }

  .menu-category-cards {
    position: relative;
    height: 80vw;
    transition: height 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    margin-bottom: 0;
    overflow: visible;
    min-height: 0;
    will-change: height;
    box-sizing: border-box !important;
  }
  
  .card {
    background-color: #fbf9f6;
    cursor: pointer;
    padding: 38px;
    box-sizing: border-box;
    border: none;
    box-shadow: 0 5px 20px rgba(106, 89, 72, 0.08);
    display: grid; 
    grid-template-columns: 40% 60%;
    grid-template-rows: 1fr auto;
    align-items: end;
    align-content: end;
    transform-origin: center center;
    transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1), border 0.3s ease;
    border: 1px solid rgba(160, 147, 125, 0.2);
    border-radius: 12px;
    width: 60vw;
    height: calc(60vw * 2/3);
    position: absolute;
    text-align: left;
    overflow: hidden;
    
    &:not(.active) {
      border: 1px solid rgba(160, 147, 125, 0.2) !important;
      box-shadow: 0 5px 20px rgba(106, 89, 72, 0.08) !important;
    }
    
    &.active {
      border: 2px solid rgba(160, 147, 125, 0.4);
      box-shadow: 0 15px 30px rgba(106, 89, 72, 0.15);
    }
    
    /* Card decoration elements */
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: linear-gradient(to right, #a0937d, #8c7b6b);
      opacity: 0.8;
      transition: height 0.3s ease;
    }
    
    /* Card hover effects */
    &:hover, &:focus {
      box-shadow: 0 15px 30px rgba(106, 89, 72, 0.15);
      transform: translate3d(-50%, -55%, 0) rotateZ(0.5deg) !important;
      transition: all 0.3s ease;
      outline: none;
      
      &::before {
        height: 8px;
      }
      
      .card-pattern {
        opacity: 0.07;
      }
    }
    
    /* Decorative pattern */
    .card-pattern {
      position: absolute;
      top: 0;
      right: 0;
      width: 150px;
      height: 150px;
      background-image: radial-gradient(circle, rgba(160, 147, 125, 0.2) 10%, transparent 10.5%);
      background-size: 20px 20px;
      opacity: 0.05;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: 0;
    }
    
    .title {
      width: 100%;
      padding-right: 25px;
      position: relative;
      
      &::after {
        display: none; /* Trennlinie zwischen Titel und Text ausblenden */
      }
      
      h3 {
        font-size: clamp(2.2rem, 4vw, 3.5rem);
        letter-spacing: 0.5px;
        font-family: "DynaPuff Regular", cursive;
        color: #4a3c31;
        line-height: 1.1;
        margin: 0;
        white-space: normal;
        overflow: visible;
        
      }
    }
    
    .text {
      width: 100%;
      padding-left: 25px;
      position: relative;
      overflow: hidden;
      
      /* Blur overlay remains unchanged */
      &::before {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        background-color: rgba(255, 255, 255, 0.2);
        opacity: 1;
        transition: opacity 500ms ease-out;
        z-index: 2;
        pointer-events: none;
        border-radius: 4px;
      }
      
      /* Base text styling forced in both states */
      p {
        font-weight: 300;
        font-size: clamp(1rem, 1.2vw, 1.25rem);
        color: #4a3c31;
        line-height: 1.7;
        font-family: "Inter 24pt Regular", sans-serif;
        margin: 0;
        padding: 0;
        position: relative;
        z-index: 1;
        display: block;
        opacity: 0.8;
        /* Force text wrapping */
        white-space: normal;
        word-wrap: break-word;
        overflow-wrap: break-word;
        overflow: visible;
      }
    }
    
    /* When active, only remove the blur overlay */
    &.active .text::before {
      opacity: 0;
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
    }

    &.fly-out {
      opacity: 0;
      pointer-events: none;
      transform: translateX(100vw) !important;
    }

    &.active {
      z-index: 10;
      left: 50% !important;
      top: 50% !important;
      transform: translate3d(-50%, -50%, 0) rotateZ(0deg) !important;
      width: 60vw;             // kept same as non-active
      height: calc(60vw * 2/3);  // set height equal to non-active card
      // ...removed min-height and max-width to keep size constant...
    }
  }
  
  /* Desktop positioning */
  .menu-category-cards .card:nth-child(1) {
    left: 33%;
    top: 25vw;
    z-index: 4;
  }
  
  .menu-category-cards .card:nth-child(2) {
    left: 67%;
    top: 35vw;
    z-index: 3;
  }
  
  .menu-category-cards .card:nth-child(3) {
    left: 33%;
    top: 45vw;
    z-index: 2;
  }
  
  .menu-category-cards .card:nth-child(4) {
    left: 67%;
    top: 55vw;
    z-index: 1;
  }

  .scroll-down-elegant {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 1;
    margin-top: 30px;
    transition: all 0.3s ease-out;
    
    .arrow-elegant {
      display: block;
      width: 20px;
      height: 20px;
      border-left: 2px solid v.$tertiary;
      border-bottom: 2px solid v.$tertiary;
      transform: rotate(-45deg);
      animation: bounce 2s infinite;
      margin-bottom: 12px;
      filter: drop-shadow(0 2px 3px rgba(2, 92, 72, 0.1));
    }
    
    .hint-elegant {
      font-size: 0.9rem;
      color: v.$tertiary-dark;
      font-weight: 500;
      letter-spacing: 0.5px;
      font-style: italic;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: rotate(-45deg) translateY(0);
    }
    40% {
      transform: rotate(-45deg) translateY(-10px);
    }
    60% {
      transform: rotate(-45deg) translateY(-5px);
    }
  }
  
  /* Responsive Styles */
  @media screen and (max-width: 1200px) {
    .card .title h3 {
      font-size: clamp(2rem, 4vw, 3.5rem);
    }
    
    .card .text p {
      font-size: clamp(0.9rem, 1vw, 1.1rem);
    }
  }
  
  @media screen and (max-width: 900px) {
    .card {
      padding: 30px;
      grid-template-columns: 45% 55%;
    }
  }

  /* Mobile view */
  @media screen and (max-width: 767px) {
    .menu-category-cards {
      min-height: 300px;
      transition: height 0.3s ease;
      padding: 0 15px; 
    }
    
    .card {
      width: 90vw !important;
      height: auto !important;
      aspect-ratio: 3/2 !important;
      flex-direction: column !important;
      align-items: flex-start;
      position: absolute;
      left: 50% !important;
      transform: translate3d(-50%, 0, 0) !important;
      pointer-events: auto;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      padding: 20px;
      border-radius: 16px;
      box-shadow: 0 8px 20px rgba(106, 89, 72, 0.12);
      display: flex;
      overflow: hidden;
      
      /* Mobile card decoration */
      &::before {
        height: 4px;
        transition: height 0.3s ease;
      }
      
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        right: 0;
        width: 70px;
        height: 70px;
        background-image: url('/static/favicon.png');
        background-size: contain;
        background-position: bottom right;
        background-repeat: no-repeat;
        opacity: 0.03;
        z-index: 0;
        pointer-events: none;
      }
      
      /* Improved hover/touch effects */
      &:hover, &:focus, &:active {
        transform: translate3d(-50%, -8px, 0) !important;
        box-shadow: 0 12px 25px rgba(106, 89, 72, 0.18);
        
        &::before {
          height: 8px;
        }
      }
    }
    
    .card .title {
      width: 100% !important;
      padding-right: 0;
      text-align: center;
      padding-bottom: 0;
      margin-bottom: 10px;
      
      h3 {
        font-size: clamp(1.8rem, 7vw, 2.2rem);
        text-align: center;
        margin: 0;
        padding: 0;
      }
    }
    
    .card .text {
      width: 100% !important;
      padding-left: 0;
      flex: 1;
      display: block;
      overflow: hidden;
      padding-bottom: 15px;
      position: relative;
      
      &::before {
        border-radius: 8px;
        background-color: rgba(251, 249, 246, 0.15);
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
      }
      
      p {
        font-size: 0.95rem;
        line-height: 1.5;
        padding: 4px 8px;
        width: 100%;
        font-weight: 300;
        font-family: "Inter 24pt Regular", sans-serif;
        margin: 0;
        color: #4a3c31;
        
        /* These properties need to be the same in both states */
        overflow: visible;
      }
    }
    
    /* Mobile positioning with proper spacing based on aspect ratio */
    .menu-category-cards .card:nth-child(1) {
      top: 10px;
      z-index: 4;
    }
    
    .menu-category-cards .card:nth-child(2) {
      top: calc(10px + (90vw * 2/3) + 20px);
      z-index: 3;
    }
    
    .menu-category-cards .card:nth-child(3) {
      top: calc(10px + (90vw * 4/3) + 40px);
      z-index: 2;
    }
    
    .menu-category-cards .card:nth-child(4) {
      top: calc(10px + (90vw * 6/3) + 60px);
      z-index: 1;
    }
    
    .card.active {
      aspect-ratio: auto !important;
      min-height: auto !important;
      height: auto !important;
      top: 0 !important;
      transform: translate3d(-50%, 0, 0) rotateZ(0deg) !important;
      position: relative !important;
      padding-bottom: 30px; /* Reduced from 60px since we removed the button */
      
      &::before {
        height: 6px;
        background: linear-gradient(to right, #8c7b6b, #a0937d);
      }
      
      .title h3 {
        color: #4a3c31;
      }
      
      .text {
        &::before {
          opacity: 0;
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
        }
        
        /* Remove all p styling from here - it should inherit from above */
      }
    }
    
    /* Add ripple effect on touch for better feedback */
    .card::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 5px;
      background: rgba(160, 147, 125, 0.3);
      opacity: 0;
      border-radius: 100%;
      transform: scale(1, 1) translate(-50%);
      transform-origin: 50% 50%;
    }
    
    .card:active::after {
      animation: ripple 0.6s ease-out;
    }
    
    @keyframes ripple {
      0% {
        transform: scale(0, 0);
        opacity: 0.5;
      }
      20% {
        transform: scale(25, 25);
        opacity: 0.3;
      }
      100% {
        opacity: 0;
        transform: scale(40, 40);
      }
    }
  }

  /* Smaller mobile view */
  @media screen and (max-width: 600px) {
    .section-header h2 {
        font-size: 2rem;
    }
    
    .subtitle {
      font-size: 1rem;
    }
    
    .card {
      padding: 22px;
      min-height: 200px !important;
      border-radius: 14px;
      
      /* Add highlighting effect for active state */
      &.active {
        border: 2px solid rgba(160, 147, 125, 0.4);
        box-shadow: 0 15px 30px rgba(106, 89, 72, 0.15);
      }
      
      .text::before {
        backdrop-filter: blur(2.5px);
        -webkit-backdrop-filter: blur(2.5px);
      }
      
      .text p {
        font-size: 0.9rem;
        padding: 4px 6px;
      }
      
      /* Remove any active state text styles */
    }
    
    .card-pattern {
      width: 100px;
      height: 100px;
    }
    
    .menu-category-cards .card:nth-child(2) {
      top: calc(10px + (90vw * 2/3) + 20px);
    }
    
    .menu-category-cards .card:nth-child(3) {
      top: calc(10px + (90vw * 4/3) + 40px);
    }
    
    .menu-category-cards .card:nth-child(4) {
      top: calc(10px + (90vw * 6/3) + 60px);
    }
    
    .card.active .text p {
      font-size: 0.9rem; /* Keep font size consistent */
    }
  }
  
  /* ...existing code in @media screen and (max-width: 767px) ... */
  .card.active {
    width: 90vw !important;
    height: calc(90vw * 2/3) !important;
    top: 0 !important;
    transform: translate3d(-50%, 0, 0) rotateZ(0deg) !important;
    position: relative !important;
    /* ...existing properties such as padding-bottom if needed... */
  }
  /* ...existing code... */
</style>