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
          if (card.getBoundingClientRect().bottom <= window.innerHeight) {
               plantsOnCard = true;
          } else {
               plantsOnCard = false;
          }
     };

     const handleResize = () => {
          sizeElements();
     };

     const sizeElements = () => {
          cardBg.style.width = `${heroPlantsWrapper.clientWidth}px`;
          cardBg.style.height = `${heroPlantsWrapper.clientHeight}px`;
          card.style.width = `${heroPlantsWrapper.clientWidth}px`;
          card.style.height = `${heroPlantsWrapper.clientHeight}px`;
     }
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
               <div class="card" bind:this={card}>
                    <div class="card-content" class:plants-on-card={plantsOnCard}>
                         <HeroPlants />
                    </div>
               </div>
               <div class="card-bg" bind:this={cardBg}></div>
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
               width: clamp(350px, 90%, 1100px);
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

               .card {
                    width: clamp(350px, 90%, 900px);
                    aspect-ratio: 3/2;
                    border-radius: 1rem;
                    border: 5px solid #fff;
                    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
                    z-index: 2;

                    .card-content {
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

               .card-bg {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: v.$quaternary;
                    border: 5px solid v.$quaternary;
                    border-radius: 1rem;
                    z-index: -1;
               }
          }
     }
</style>