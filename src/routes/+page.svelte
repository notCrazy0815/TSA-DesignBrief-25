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

          gsap.fromTo(".second-section-bg", {
               width: "40%",
               height: "10%",
               opacity: 0.8,
               borderRadius: "0 0 2000px 2000px",
               ease: "power2.out"
          }, {
               width: "100%",
               height: "100%",
               opacity: 1,
               borderRadius: "0 0 0 0",
               duration: 1,
               ease: "power1.in",
               scrollTrigger: {
                    trigger: ".second-section",
                    start: "-100% top top",
                    end: "-5% top top",
                    scrub: true,
                    onLeave: () => {
                         bg = "dark";
                    },
                    onEnterBack: () => {
                         bg = "base";
                    },
                    onEnter: () => {
                         bg = "base";
                    }
               },
          });

          gsap.fromTo(".second-section-content p span", {
               opacity: 0,
               y: 30,
          }, {
               opacity: 1,
               y: 0,
               duration: 0.6,
               ease: "power1.in",
               stagger: 0.15,
               scrollTrigger: {
                    trigger: ".second-section-content",
                    toggleActions: "play none none reverse"
               },
          });

          gsap.fromTo(".second-section-content h3", {
               opacity: 0,
               y: 30,
          }, {
               opacity: 1,
               y: 0,
               duration: 0.6,
               ease: "power1.in",
               scrollTrigger: {
                    trigger: ".second-section-content",
                    toggleActions: "play none none reverse"
               },
          });
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

     <section class="second-section">
          <div class="second-section-bg"></div>
          <div class="second-section-content">
               <h3>
                    Good food should be easy.
               </h3>
               <div class="second-section-content-text">
                    <p>
                         <span>We believe that everyone deserves meals that are not only delicious,</span>
                    </p>
                    <p>
                         <span>but also made with care. That's why we keep it simple—fresh, local ingredients,</span>
                    </p>
                    <p>
                         <span>prepared with love, and served with purpose.</span>
                    </p>
                    <p>
                         <span>Whether you're grabbing a quick bite or sitting down for something special,</span>
                    </p>
                    <p>
                         <span>our goal is the same: to make good food accessible to all.</span>
                    </p>
               </div>
          </div>
     </section>
</div>

<div class="footer-wrapper">
     <Footer />
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

     .second-section {
          min-height: 100vh;
          position: relative;
          margin-top: 20vh;
          background-color: transparent;

          display: flex;
          justify-content: center;
          align-items: center;

          padding: 0 2rem;

          .second-section-bg {
               position: absolute;
               top: 0;
               left: 50%;
               transform: translateX(-50%);
               background-color: v.$font-color-dark;
          }

          .second-section-content {
               position: relative;
               z-index: 2;
               color: v.$font-color-light;

               width: clamp(300px, 90%, 1000px);

               display: flex;
               flex-direction: column;
               gap: 1rem;

               h3 {
                    font-size: clamp(2rem, 5vw, 4rem);
               }

               .second-section-content-text {
                    font-size: clamp(1rem, 2.2vw, 1.6rem);
                    display: flex;
                    flex-direction: column;
                    gap: 1.2rem;

                    p {
                         line-height: 1.3;
                         overflow: hidden;

                         span {
                              display: inline-block;
                         }
                    }
               }
          }
     }

</style>