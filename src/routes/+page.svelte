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
     import CardSection from "$lib/components/CardSection.svelte";
     import TestimonialsSection from "$lib/components/TestimonialsSection.svelte";
    import FooterTopBorder from "$lib/components/FooterTopBorder.svelte";

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
          
          gsap.to(".hero-plants-wrapper", {
               scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
               },
               scale: 1.2,
               filter: "blur(100px)",
               ease: "power1.out",
          });
          
          const plantsTimeline = gsap.timeline({
               scrollTrigger: {
                    trigger: ".hero-section",
                    start: "bottom top",
                    end: "bottom+=40% top",
                    scrub: true
               }
          });
          
          plantsTimeline
               .to(".hero-plants-wrapper", {
                    opacity: 0,
                    ease: "power2.in",
               })
               .set(".hero-plants-wrapper", { display: "none" });
          
          const ctaTimeline = gsap.timeline({
               scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top+=2% top",
                    end: "top+=8% top",
                    scrub: 1
               }
          });
          
          ctaTimeline.to(".hero-cta-container", {
               opacity: 0,
               duration: 0.2,
               ease: "power1.inOut",
          }).set(".hero-cta-container", { visibility: "hidden" });
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
     <div class="we-are-section-container">
          <WeAreSection />
     </div>
     <div class="card-section-container">
          <CardSection />
     </div>
     <div class="testimonials-section-container">
          <TestimonialsSection />
     </div>
     <div class="transparency-section-container"></div>
     <FooterTopBorder />
</div>

<Footer />

<style lang="scss">
     @use "../lib/styles/variables" as v;
     @use "../lib/styles/global" as g;

     :global(body) {
          overflow-x: hidden;
     }

     .content {
          background-color: v.$background-color-light;
          position: relative;
          z-index: 1;
     }

     .hero-section {
          min-height: 75vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 1rem;
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
               position: fixed;
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
     }

     .card-section-container, .we-are-section-container, .testimonials-section-container {
          z-index: 2;
          width: 100%;
          display: flex;
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