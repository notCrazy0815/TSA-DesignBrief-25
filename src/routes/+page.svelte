<script lang="ts">
     import NavBar from "$lib/components/NavBar.svelte";
     import HeroTitle from "$lib/components/HeroTitle.svelte";
     import HeroPlants from "$lib/components/HeroPlants.svelte";
     import { onMount } from "svelte";
     import { page } from "$app/stores";
     import HeroCta from "$lib/components/HeroCta.svelte";
     import Footer from "$lib/components/Footer.svelte";
     import { gsap } from "gsap";
     import { ScrollTrigger } from "gsap/ScrollTrigger";
     import WeAreSection from "$lib/components/WeAreSection.svelte";

     let bg = "base";

     onMount(() => {
          gsap.registerPlugin(ScrollTrigger);

          window.scrollTo(0, 0);
          if ($page.url.pathname === "/") {
               document.body.style.overflow = "hidden";
               setTimeout(() => {
                    document.body.style.overflow = "auto";
               }, 2600);
          }

          // gsap.fromTo(".second-section-bg", {
          //      width: "100%",
          //      height: "20%",
          //      opacity: 0.8,
          //      borderRadius: "0",
          //      ease: "power2.out"
          // }, {
          //      width: "100%",
          //      height: "100%",
          //      opacity: 1,
          //      borderRadius: "0 0 0 0",
          //      duration: 1,
          //      ease: "power1.in",
          //      scrollTrigger: {
          //           trigger: ".second-section",
          //           start: "-95% top top",
          //           end: "-10% top top",
          //           scrub: true,
          //           onLeave: () => {
          //                bg = "dark";
          //           },
          //           onEnterBack: () => {
          //                bg = "base";
          //           },
          //           onEnter: () => {
          //                bg = "base";
          //           }
          //      },
          // });
     });
</script>

<NavBar {bg} />

<div class="content">
     <section class="hero-section">
          <HeroTitle />
     </section>
     <div class="hero-plants-container">
          <div class="hero-plants-wrapper">
               <HeroPlants />
          </div>
     </div>
     <div class="hero-cta-container">
          <HeroCta />
     </div>

     <div class="we-are-section-wrapper">
          <WeAreSection />
     </div>
</div>

<div class="footer-wrapper">
     <Footer />
</div>

<style lang="scss">
     @use "../lib/styles/variables" as v;
     /* Removed import of global.scss to avoid unused selectors */

     .hero-section {
          min-height: 75vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 145vh;
     }

     .hero-plants-container {
          position: absolute;
          width: 100%;
          height: 100vh;
          top: 0;
          left: 0;
          z-index: 1;
          overflow: hidden;

          .hero-plants-wrapper {
               height: fit-content;
               position: absolute;
               bottom: 0;
               left: 50%;
               transform: translateX(-50%);
          }
     }

     .hero-cta-container {
          position: absolute;
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

     .we-are-section-wrapper {
          position: absolute;
          width: 100%;
          top: 100vh;
          z-index: 4;
     }

</style>