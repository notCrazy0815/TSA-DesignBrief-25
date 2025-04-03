<script lang="ts">
     import NavBar from "$lib/components/NavBar.svelte";
     import HeroTitle from "$lib/components/HeroTitle.svelte";
     import HeroPlants from "$lib/components/HeroPlants.svelte";
     import { onMount } from "svelte";
     import { page } from "$app/stores";
     import HeroCta from "$lib/components/HeroCta.svelte";

     let keyAspectsSection: HTMLElement;
     let isAnimating = false;
     let scrollEnabled = false;
     let activeSection = 0;

     onMount(() => {
          window.scrollTo(0, 0);
          if ($page.url.pathname === "/") {
               document.body.style.overflow = "hidden";
               setTimeout(() => {
                    document.body.style.overflow = "auto";
                    scrollEnabled = true;
               }, 3000);
          }
     });

     let lastScrollY = 0;
     let scrollDirection = 0;

     function detectScrollDirection(event: WheelEvent | TouchEvent) {
          let currentScrollY = window.scrollY;

          if (event instanceof WheelEvent) {
               scrollDirection = event.deltaY > 0 ? 1 : -1;
          } else if (event instanceof TouchEvent) {
               if (event.touches.length > 0) {
                    let touchY = event.touches[0].clientY;
                    scrollDirection = touchY < lastScrollY ? 1 : -1;
                    lastScrollY = touchY;
               }
          }

          lastScrollY = currentScrollY;

          // if (scrollDirection === -1) {
          //      keyAspectsSection.style.transform = "translateY(-100vh)";
          // }
     }

     function handleScroll() {
          if (!scrollEnabled || isAnimating) return;

          const scrollPosition = window.scrollY;

          if (activeSection === 0 && scrollPosition >= 1) {
               isAnimating = true;
               document.body.style.overflow = "hidden";
               
               activeSection = 1;

               keyAspectsSection.style.transition = "transform 0.8s ease-in-out";
               keyAspectsSection.style.transform = `translateY(${-window.innerHeight + scrollPosition}px)`;

               setTimeout(() => {
                    keyAspectsSection.style.position = "fixed";
                    keyAspectsSection.style.top = "0";
                    keyAspectsSection.style.transition = "none";
                    keyAspectsSection.style.transform = "translateY(0)";
                    isAnimating = false;
               }, 800);
          }

          if (activeSection === 1) {
               isAnimating = true;
               document.body.style.overflow = "hidden";

               activeSection = 0;
               
          }

     }
</script>

<svelte:window on:scroll={handleScroll} on:wheel={detectScrollDirection} on:touchmove={detectScrollDirection} />

<NavBar />

<div class="content">
     <section class="hero-section">
          <HeroTitle />
     </section>
     <div class="hero-plants-container">
          <HeroPlants />
     </div>
     <div class="hero-cta-container">
          <HeroCta />
     </div>
     <div class="key-aspects-wrapper">
          <section class="key-aspects-section" bind:this={keyAspectsSection}>
               <h2>Key Aspects</h2>
          </section>
     </div>
</div>

<style lang="scss">
     @use "../lib/styles/variables" as v;
     @use "../lib/styles/global" as g;

     .hero-section {
          min-height: 75vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 1rem;
     }

     .hero-plants-container {
          display: flex;
          justify-content: center;
          align-items: end;

          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: -1;
     }

     .hero-cta-container {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: end;
          padding-bottom: 4rem;
          z-index: 2;
     }

     @keyframes moveIn {
          from {
               translate: 100% 0;
          }
          to {
               translate: 0 0;
          }
     }

     .key-aspects-wrapper {
          position: absolute;
          top: 100vh;
          height: 100vh;
          width: 100%;
     }

     .key-aspects-section {
          position: absolute;
          width: 100%;
          height: 100vh;
          background-color: v.$background-color-dark;
          will-change: transform;
     }
</style>