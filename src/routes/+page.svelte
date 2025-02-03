<script lang="ts">
     import { onMount } from "svelte";

     let styles = {
          'x1': '0rem',
          'y1': '0rem',
          'x2': '0rem',
          'y2': '0rem',
          'x4': '0rem',
          'y4': '0rem',
          'x5': '0rem',
          'y5': '0rem',
          'opacity': '1',
          'titleY': '0',
          'titleOpacity': '1',
          'navOpacity': '0'
     };

     let centerTitle: HTMLHeadingElement;
     let navTitle: HTMLHeadingElement;

     let active = false;
     let showHero = true;
     let windowY = 0;

     onMount(() => {
          window.scrollTo(0, 0);
          showHero = true;

          styles = {
               'x1': '0rem',
               'y1': '0rem',
               'x2': '0rem',
               'y2': '0rem',
               'x4': '0rem',
               'y4': '0rem',
               'x5': '0rem',
               'y5': '0rem',
               'opacity': '1',
               'titleY': '0',
               'titleOpacity': '1',
               'navOpacity': '0'
          };

          setTimeout(() => {
               active = true;
          }, 1500);
     });

     function handleMouseMove(e: MouseEvent) {
          if (!active) return;

          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;

          let xFactor = (clientX - innerWidth / 2) / innerWidth;
          let yFactor = (clientY - innerHeight / 2) / innerHeight;

          styles['x1'] = `${xFactor * 5}rem`;
          styles['y1'] = `${yFactor * 5}rem`;
          styles['x2'] = `${xFactor * 2.5}rem`;
          styles['y2'] = `${yFactor * 2.5}rem`;
          styles['x4'] = `${xFactor * 2.5}rem`;
          styles['y4'] = `${yFactor * 2.5}rem`;
          styles['x5'] = `${xFactor * 5}rem`;
          styles['y5'] = `${yFactor * 5}rem`;
     }

     function handleScroll() {
          if (!showHero) return;

          const { innerHeight } = window;
          
          let fadeStart = 0.1 * innerHeight;
          let fadeEnd = 0.4 * innerHeight;

          styles['titleY'] = `${Math.max(0, windowY * 0.65)}px`;
          
          let fadeFactor = Math.max(0, Math.min(1, (windowY - fadeStart) / (fadeEnd - fadeStart)));

          styles['opacity'] = `${1 - fadeFactor}`;

          if (centerTitle.getBoundingClientRect().top >= navTitle.getBoundingClientRect().top) {
               styles['navOpacity'] = '1';
               styles['titleOpacity'] = '0';
          } else {
               styles['titleOpacity'] = '1';
               styles['navOpacity'] = '0';
          }

          if (navTitle.getBoundingClientRect().top <= 0) {
               showHero = false;
          }
     }


     $: cssVarStyles = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(';');
</script>

<svelte:window on:scroll={handleScroll} bind:scrollY={windowY} />

<div class="content" style={cssVarStyles}>
     {#if showHero}
          <section class="hero-section" on:mousemove={e => handleMouseMove(e)} role="presentation">
               <div class="title-stack">
                    <h1>VERDANTIA</h1>
                    <h1>VERDANTIA</h1>
                    <h1 bind:this={centerTitle}>VERDANTIA</h1>
                    <h1>VERDANTIA</h1>
                    <h1>VERDANTIA</h1>
               </div>
          </section>
     {/if}
     <section class="sideways-section">
          <div class="nav">
               <h1 bind:this={navTitle}>VERDANTIA</h1>
               <div class="links">
                    <div class="link">
                        <a href="/">Home</a>
                        <div class="active-icon active"></div>
                    </div>
                    <div class="link">
                        <a href="/menu">Menu</a>
                        <div class="active-icon"></div>
                    </div>
                    <div class="link">
                        <a href="/news">News</a>
                        <div class="active-icon"></div>
                    </div>
               </div>
          </div>
          <div class="sideways-content">
               <div class="journey-start">
                    <p>The journey goes on.<br>Learn more about us.</p>
                    <div class="orange"></div>
               </div>
               <div class="who-we-are">
                    <p>Since 2022, we at <span>Verdantia</span> serve the best food in town. And we're not stopping anytime soon.</p>
               </div>
          </div>
     </section>
</div>

<style lang="scss">
     @use "../lib/styles/variables" as v;
     @use "../lib/styles/global" as g;

     .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;

          .hero-section {
               width: 100%;
               height: 100vh;
               display: flex;
               justify-content: center;
               align-items: center ;

               .title-stack {
                    position: relative;
                    text-align: center;
                    transform: translateY(var(--titleY));
               }

               h1 {
                    font-size: 5rem;
                    font-weight: bold;
                    cursor: default;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    transition: all 0.1s;
                    opacity: var(--opacity);

                    &:nth-child(1) {
                         color: v.$tertiary-light;
                         animation: h1-1-start 1.5s forwards;
                         transform: translate(calc(-50% - var(--x1)), calc(-50% - var(--y1)));
                    }
                    &:nth-child(2) {
                         color: v.$tertiary;
                         animation: h1-2-start 1.5s forwards;
                         transform: translate(calc(-50% - var(--x2)), calc(-50% - var(--y2)));
                    }
                    &:nth-child(3) {
                         color: v.$tertiary-dark;
                         opacity: var(--titleOpacity);
                         transition: all 0s;
                    }
                    &:nth-child(4) {
                         color: v.$tertiary;
                         animation: h1-4-start 1.5s forwards;
                         transform: translate(calc(-50% + var(--x4)), calc(-50% + var(--y4)));
                    }
                    &:nth-child(5) {
                         color: v.$tertiary-light;
                         animation: h1-5-start 1.5s forwards;
                         transform: translate(calc(-50% + var(--x5)), calc(-50% + var(--y5)));
                    }

                    @keyframes h1-1-start {
                         0% {
                              top: 50%;
                              left: 50%;
                         }
                         100% {
                              top: calc(50% - 10rem);
                              left: calc(50% - 5rem);
                         }
                    }

                    @keyframes h1-2-start {
                         0% {
                              top: 50%;
                              left: 50%;
                         }
                         100% {
                              top: calc(50% - 5rem);
                              left: calc(50% - 2.5rem);
                         }
                    }

                    @keyframes h1-4-start {
                         0% {
                              top: 50%;
                              left: 50%;
                         }
                         100% {
                              top: calc(50% + 5rem);
                              left: calc(50% + 2.5rem);
                         }
                    }

                    @keyframes h1-5-start {
                         0% {
                              top: 50%;
                              left: 50%;
                         }
                         100% {
                              top: calc(50% + 10rem);
                              left: calc(50% + 5rem);
                         }
                    }
               }
          }

          .sideways-section {
               display: flex;
               flex-direction: column;
               min-width: 100%;
               height: 100vh;

               .nav {
                    width: 100%;
                    height: fit-content;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    h1 {
                         font-size: 5rem;
                         font-weight: bold;
                         cursor: default;
                         color: v.$tertiary-dark;
                         opacity: var(--navOpacity);
                    }

                    .links {
                         display: flex;
                         justify-content: center;
                         gap: 2rem;
                         width: 100%;

                         .link {
                              text-transform: uppercase;
                              display: flex;
                              gap: 1px;
                              align-items: center;

                              .active-icon {
                                   height: 10px;
                                   width: 10px;
                                   border-radius: 50%;
                                   background-color: transparent;
                              }

                              .active {
                                   background-color: v.$primary;
                              }
                         }
                    }
               }

               .sideways-content {
                    height: 100%;
                    display: flex;
                    gap: 2rem;
                    align-items: center;

                    .journey-start {
                         margin-left: 2rem;
                         height: 80%;
                         width: 80vw;
                         display: flex;
                         align-items: center;
                         justify-content: space-between;
                         background-color: v.$secondary;
                         color: v.$font-color-light;
                         text-transform: uppercase;
                         font-size: clamp(1.5rem, 2vw, 2.5rem);
                         padding: 3rem;
                         border-radius: 1rem;

                         .orange {
                              width: clamp(8rem, 30vw, 18rem);
                              aspect-ratio: 1;
                              background-color: v.$primary;
                              margin-right: 2rem;
                              border-radius: 50%;
                         }
                    }

                    .who-we-are {
                         // width: 80vw;
                         padding: 3rem;
                    }
               }
          }
     }
</style>