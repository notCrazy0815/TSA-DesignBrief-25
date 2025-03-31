<script lang="ts">
    import Footer from "$lib/components/Footer.svelte";
import NavBar from "$lib/components/NavBar.svelte";


</script>

<NavBar />

<div class="content">
     <section class="hero-section">
          <h1>Wir machen lecker essen</h1>
     </section>
</div>

<Footer />

<style lang="scss">
     .hero-section {
          height: 65vh;
          display: flex;
          justify-content: center;
          align-items: center;

          h1 {
               font-size: 4rem;
               font-family: 'DynaPuff Regular';
               text-align: center;
          }
     }
</style>