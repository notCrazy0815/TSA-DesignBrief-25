<script lang="ts">
  import { onMount, tick } from "svelte";
  import NavBar from "$lib/components/NavBar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { gsap } from "gsap";
  import { ScrollToPlugin } from "gsap/ScrollToPlugin";
  gsap.registerPlugin(ScrollToPlugin);

  const cards = [
    { id: 1, title: "Appetizers", text: "Kick off your culinary journey with our delightful plant-based appetizers, featuring fresh, innovative bites that tease your taste buds with vibrant flavors and sustainable ingredients." },
    { id: 2, title: "Main", text: "Enjoy exquisite vegan and vegetarian main courses crafted with passion and precision. Our mains blend traditional flavors with modern twists, using farm-fresh produce to create memorable plant-based dishes." },
    { id: 3, title: "Drinks", text: "Refresh yourself with our curated selection of organic, plant-based beverages and handcrafted cocktails. From fruit-infused creations to botanical blends, each sip complements your sustainable dining experience." },
    { id: 4, title: "Desserts", text: "End your dining experience on a sweet note with our decadent vegan desserts. Classic indulgence meets modern creativity with plant-based ingredients that prove sustainable eating never compromises on taste." }
  ];
  
  const cardRotations: number[] = [-5, 4, 10, -6];
  
  let activeCardId: number | null = null;
  let cardsContainer: HTMLElement | null = null;
  
  const FIXED_MENU_OFFSET = 120;
  const EXTRA_OFFSET = 60;

  function scrollToActiveCard(): void {
    const activeCard = document.querySelector('.card.active') as HTMLElement | null;
    if (activeCard) {
      const rect = activeCard.getBoundingClientRect();
      const targetScroll = window.scrollY + rect.top - (FIXED_MENU_OFFSET + EXTRA_OFFSET);
      gsap.to(window, { duration: 0.5, scrollTo: { y: targetScroll }, ease: "power2.out" });
    }
  }

  async function openCard(cardId: number): Promise<void> {
    if (activeCardId === cardId) {
      activeCardId = null;
      setTimeout(() => {
        (document.activeElement as HTMLElement | null)?.blur();
      }, 50);
    } else {
      activeCardId = cardId;
    }
    
    await tick();

    if (activeCardId !== null) {
      const activeCardElement = document.querySelector('.card.active') as HTMLElement | null;
      if (activeCardElement && cardsContainer) {
        gsap.timeline({
          onComplete: scrollToActiveCard
        }).to(cardsContainer, {
          duration: 0.3,
          height: activeCardElement.offsetHeight + 100,
          ease: "power2.out"
        });
      } else {
        scrollToActiveCard();
      }
    } else {
      resetContainerHeight();
    }
  }
  
  function calculateMobileCardHeight(): number {
    if (window.innerWidth <= 767) {
      const cardWidth = window.innerWidth * 0.9;
      const cardHeight = cardWidth * (2/3);
      return cardHeight;
    }
    return 0;
  }

  function resetContainerHeight(): void {
    if (cardsContainer) {
      if (window.innerWidth < 768) {
        const cardWidth = window.innerWidth * 0.9;
        const cardHeight = cardWidth * (2/3);
        const numCards = cards.length;
        const topOfLastCard = 10 + (numCards - 1) * (cardHeight + 20);
        const containerHeight = topOfLastCard + cardHeight;
        cardsContainer.style.height = `${containerHeight}px`;
      } else {
        cardsContainer.style.height = '80vw';
      }
    }
  }
  
  function getRotation(index: number): number {
    return cardRotations[index % cardRotations.length];
  }

  function getCardClasses(cardId: number): string {
    return activeCardId === null ? '' : activeCardId === cardId ? 'active' : 'fly-out';
  }
  
  onMount(() => {
    cardsContainer = document.querySelector('.menu-category-cards') as HTMLElement;
    resetContainerHeight();
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
  @use "../../lib/styles/global" as g;
  
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
    border: 1px solid rgba(160, 147, 125, 0.2);
    box-shadow: 0 5px 20px rgba(106, 89, 72, 0.08);
    display: grid; 
    grid-template-columns: 40% 60%;
    grid-template-rows: 1fr auto;
    align-items: end;
    align-content: end;
    transform-origin: center center;
    transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1), border 0.3s ease;
    border-radius: 12px;
    width: 60vw;
    aspect-ratio: 3/2;
    position: absolute;
    text-align: left;
    overflow: hidden;
    
    &:not(.active) {
      border: 1px solid rgba(160, 147, 125, 0.2);
      box-shadow: 0 5px 20px rgba(106, 89, 72, 0.08);
    }
    
    &.active {
    }
    
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
        display: none;
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
        white-space: normal;
        word-wrap: break-word;
        overflow-wrap: break-word;
        overflow: visible;
      }
    }
    
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
  }
  
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
        overflow: visible;
      }
    }
    
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
      padding-bottom: 30px;
      
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
      }
    }
    
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

    .menu-category-cards .card {
      transform: translate3d(-50%, 0, 0) !important;
      box-shadow: none !important;
    }
  }

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
      font-size: 0.9rem;
    }
  }
  
  @media screen and (max-width: 767px) {
    .card.active {
      z-index: 10;
      left: 50% !important;
      top: 0 !important;
      transform: translate3d(-50%, 0, 0) rotateZ(0deg) !important;
      width: 90vw;
      height: auto !important;
      aspect-ratio: 3/2 !important;
    }
  }

  @media screen and (min-width: 768px) {
    .card.active {
      z-index: 10;
      left: 50% !important;
      top: 50% !important;
      transform: translate3d(-50%, -50%, 0) rotateZ(0deg) !important;
      width: 60vw !important;
      aspect-ratio: 3/2;
      height: calc(60vw * 2/3) !important;
      overflow: hidden;
    }
    .card.fly-out {
      opacity: 0;
      pointer-events: none;
      transform: translateX(100vw) !important;
    }
  }
</style>