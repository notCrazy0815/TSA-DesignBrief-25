<script lang="ts">
     // import Footer from "$lib/components/Footer.svelte";
     import NavBar from "$lib/components/NavBar.svelte";
     import VerticalPlant from "$lib/components/VerticalPlant.svelte";

     type PlantNumber = 1 | 2 | 5 | 6 | 7 | 8 | 11;
</script>

<NavBar />

<div class="content">
     <section class="hero-section">
          <div class="plant-container">
               {#each [1, 5, 8, 2, 7, 11, 1, 6] as plantNumber, i}
                    <VerticalPlant plantNumber={plantNumber as PlantNumber} animationDelay={i * 0.1} />
               {/each}
          </div>
     </section>
</div>

<!-- <Footer /> -->

<style lang="scss">
     .hero-section {
          min-height: 60vh;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: moveIn 1.2s ease-in-out forwards;

          .plant-container {
               display: flex;
               justify-content: center;
               align-items: center;
          }
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