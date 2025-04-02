<script lang="ts">
     import NavBar from "$lib/components/NavBar.svelte";
     import HeroTitle from "$lib/components/HeroTitle.svelte";
     import HeroPlants from "$lib/components/HeroPlants.svelte";
     import { onMount } from "svelte";

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
          <HeroTitle />
     </section>
     <div class="hero-plants-container">
          <HeroPlants />
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

     @keyframes moveIn {
          from {
               translate: 100% 0;
          }
          to {
               translate: 0 0;
          }
     }
</style>