<script lang="ts">
     import NavBar from "$lib/components/NavBar.svelte";
     import HeroTitle from "$lib/components/HeroTitle.svelte";
     import HeroPlants from "$lib/components/HeroPlants.svelte";
     import { onMount } from "svelte";
     import { page } from "$app/stores";
     import HeroCta from "$lib/components/HeroCta.svelte";

     let plantsOnCard = false;
     let card: HTMLElement;
     let cardBg: HTMLElement;
     let heroPlantsWrapper: HTMLElement;
     let isFixed = false;
     let lastScrollY = 0;
     let lockedOffset = 0;

     onMount(() => {
          window.scrollTo(0, 0);
          if ($page.url.pathname === "/") {
               document.body.style.overflow = "hidden";
               setTimeout(() => {
                    document.body.style.overflow = "auto";
               }, 3000);
          }

          sizeElements();
     });

     const handleScroll = () => {
          if (!card) return;

          const rect = card.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const centerY = viewportHeight / 2 - card.clientHeight / 2;
          const currentScrollY = window.scrollY;
          const scrollingDown = currentScrollY > lastScrollY;

          if (scrollingDown && rect.top <= centerY) {
               isFixed = true;
               lockedOffset = window.scrollY + rect.top;
          } else if (!scrollingDown && isFixed) {
               isFixed = false;
               window.scrollTo({ top: lockedOffset - rect.top, behavior: "instant" });
          }

          lastScrollY = currentScrollY;
          plantsOnCard = rect.bottom <= window.innerHeight;
     };

     const handleResize = () => {
          sizeElements();
     };

     const sizeElements = () => {
          cardBg.style.width = `${heroPlantsWrapper.clientWidth}px`;
          cardBg.style.height = `${heroPlantsWrapper.clientHeight}px`;
          card.style.width = `${heroPlantsWrapper.clientWidth}px`;
          card.style.height = `${heroPlantsWrapper.clientHeight}px`;
     };
</script>

<svelte:window on:scroll={handleScroll} on:resize={handleResize} />

<NavBar />

<div class="content">
     <section class="hero-section">
          <HeroTitle />
     </section>
     <div class="hero-plants-container" class:plants-on-card={plantsOnCard}>
          <div class="hero-plants-wrapper" bind:this={heroPlantsWrapper}>
               <HeroPlants />
          </div>
     </div>
     <div class="hero-cta-container">
          <HeroCta />
     </div>
     
     <section class="scrollable">
          <div class="scrollable-content">
               <div class="card-container">
                    <div class="card" bind:this={card} class:fixed={isFixed}>
                         <div class="card-content" class:plants-on-card={plantsOnCard}>
                              <HeroPlants />
                         </div>
                    </div>
                    <div class="card-bg" bind:this={cardBg} class:fixed={isFixed}></div>
               </div>
          </div>
     </section>
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
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 1;

          .hero-plants-wrapper {
               width: clamp(350px, 90%, 950px);
               height: fit-content;
               position: fixed;
               bottom: 0;
               left: 50%;
               transform: translateX(-45%);
          }

          &.plants-on-card {
               opacity: 0;
          }
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
          z-index: 3;
     }

     @keyframes moveIn {
          from {
               translate: 100% 0;
          }
          to {
               translate: 0 0;
          }
     }

     .scrollable {
          position: absolute;
          top: 100%;
          width: 100%;
          height: 100vh;

          .scrollable-content {
               width: 100%;
               height: fit-content;
               display: flex;
               justify-content: center;
               align-items: center;

               .card-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
               }

               .card,
               .card-bg {
                    width: clamp(350px, 90%, 900px);
                    aspect-ratio: 3/2;
                    border-radius: 1rem;
                    border: 5px solid #fff;
                    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
                    z-index: 2;
                    transition: position 0.2s, top 0.2s;
               }

               .card.fixed {
                    position: fixed;
                    top: 50%;
                    transform: translateY(-50%);
               }

               .card-bg {
                    position: absolute;
                    left: 50%;
                    transform: translate(-50%, 0);
                    background-color: v.$quaternary;
                    border: 5px solid v.$quaternary;
                    border-radius: 1rem;
                    z-index: -1;
               }

               .card-bg.fixed {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: v.$quaternary;
                    border: 5px solid v.$quaternary;
                    border-radius: 1rem;
                    z-index: -1;
               }

               .card .card-content {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: end;
                    opacity: 0;

                    &.plants-on-card {
                         opacity: 1;
                    }
               }
          }
     }
</style>