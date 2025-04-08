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

     const buzzwords = ["easy", "fresh", "sustainable", "local", "fun", "colorful", "honest", "delicious"];
     let currentIndex = 0;
     let wordHeight = 0;
     let baseY = 0;

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
               width: "100%",
               height: "10%",
               opacity: 0.8,
               borderRadius: "0 0 10vw 10vw",
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

          const buzzwordEls = gsap.utils.toArray<HTMLElement>(".buzzword");

               if (buzzwordEls.length > 0) {
                    wordHeight = buzzwordEls[0].offsetHeight;

                    const wrapper = document.querySelector(".buzzword-wrapper") as HTMLElement;
                    wrapper.style.height = `${wordHeight}px`;

                    const firstRect = buzzwordEls[0].getBoundingClientRect();
                    const stackRect = buzzwordEls[0].parentElement!.getBoundingClientRect();
                    baseY = firstRect.top - stackRect.top;
               }
          
          const setPositions = () => {
               buzzwordEls.forEach((el, i) => {
                    const offset = i - currentIndex;
                    const y = baseY + offset * wordHeight;
                    el.style.transform = `translateY(${y}px)`;
                    el.style.opacity = Math.abs(offset) > 2 ? "0" : `${1 - Math.abs(offset) * 0.4}`;
               });
          };

          setPositions();

          ScrollTrigger.create({
               trigger: ".second-section",
               start: "-20% top top",
               end: "10% top top",
               scrub: true,
               onUpdate: (self) => {
                    const newIndex = Math.floor(self.progress * (buzzwordEls.length - 1) + 0.5);
                    if (newIndex !== currentIndex) {
                         currentIndex = newIndex;
                         setPositions();
                    }
               }
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
               <h3 class="buzzwords-title">
                    Good food should be 
                    <span class="buzzword-wrapper">
                         <span class="buzzword-stack">
                             {#each buzzwords as word, index}
                                 <span class="buzzword" data-index={index}>{word}</span>
                             {/each}
                         </span>
                    </span>
               </h3>
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
                    display: flex;
                    flex-direction: column;
                    flex-wrap: nowrap;
                    align-items: center;
                    justify-content: center;
                    gap: 0.25em;
                    width: 100%;
                    text-align: center;
                    gap: clamp(4.5rem, 12vw, 7rem);

                    .buzzword-wrapper {
                         position: relative;
                         display: inline-block;
                         height: 100%;
                         width: 100%;
                         vertical-align: baseline;

                         .buzzword-stack {
                              display: flex;
                              flex-direction: column;
                              justify-content: center;
                              align-items: center;
                              position: relative;
                              height: 100%;
                         }

                         .buzzword {
                              position: absolute;
                              top: 0;
                              white-space: nowrap;
                              line-height: 60px;
                              text-align: center;
                              margin: 0;
                              padding: 0;
                              transition: transform 0.4s ease, opacity 0.4s ease;
                              will-change: transform, opacity;
                         }
                    }
               }
          }
     }

</style>