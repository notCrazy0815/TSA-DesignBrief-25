<script lang="ts">
     // import Footer from "$lib/components/Footer.svelte";
     import NavBar from "$lib/components/NavBar.svelte";
     // import VerticalPlant from "$lib/components/VerticalPlant.svelte";
     import HeroTitle from "$lib/components/HeroTitle.svelte";
     import HeroPlants from "$lib/components/HeroPlants.svelte";
     import { onMount } from "svelte";

     // type PlantNumber = 1 | 2 | 5 | 6 | 7 | 8 | 11;

     onMount(() => {
          // should only be done on first load
          document.body.style.overflow = "hidden";
          setTimeout(() => {
               document.body.style.overflow = "auto";
          }, 3000);
     });
</script>

<NavBar />

<div class="content">
     <section class="hero-section">
          <!-- <div class="plants-container">
               {#each [1, 5, 8, 2, 7, 11, 1, 6] as plantNumber, i}
                    <VerticalPlant plantNumber={plantNumber as PlantNumber} animationDelay={i * 0.1} />
               {/each}
          </div>
          <div class="text-container">
               <h1>There</h1>
               <h1>is</h1>
               <h1>no</h1>
               <h1>reason</h1>
               <h1>not</h1>
               <h1>to</h1>
               <h1>do</h1>
               <h1>it</h1>
          </div> -->
          <HeroTitle />
     </section>
     <div class="hero-plants-container">
          <HeroPlants />
     </div>
</div>

<!-- <Footer /> -->

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

          .plants-container {
               display: flex;
               justify-content: center;
               align-items: center;

               animation: moveIn 1.2s ease-in-out forwards;
          }

          .text-container {
               display: flex;
               align-items: center;

               h1 {
                    font-family: "Inter 24pt Regular", sans-serif;
                    text-transform: uppercase;
                    width: clamp(100px, 10vw, 200px);
                    text-align: center;
                    transform: translateX(-10%);
               }
          }
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

     @keyframes moveIn {
          from {
               translate: 100% 0;
          }
          to {
               translate: 0 0;
          }
     }
</style>