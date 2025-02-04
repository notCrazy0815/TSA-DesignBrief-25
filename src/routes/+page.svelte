<script lang="ts">
     import { onMount } from "svelte";
     import branch from "$lib/assets/home/branch-geklaut.png";

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
          'navOpacity': '0',
          'translateHorizontalScroll': '0px',
          'scrollDownHintOpacity': '0'
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
               'navOpacity': '0',
               'translateHorizontalScroll': '0px',
               'scrollDownHintOpacity': '0'
          };

          setTimeout(() => {
               active = true;

               styles['scrollDownHintOpacity'] = '1';
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

     function handleScroll(e: Event) {
          if (!showHero) return;

          const { innerHeight } = window;
          
          let fadeStart = 0.1 * innerHeight;
          let fadeEnd = 0.4 * innerHeight;

          styles['titleY'] = `${Math.max(0, windowY * 0.65)}px`;
          
          let fadeFactor = Math.max(0, Math.min(1, (windowY - fadeStart) / (fadeEnd - fadeStart)));

          styles['opacity'] = `${1 - fadeFactor}`;
          let scrollDownHintOpacity = 1 - fadeFactor;
          if (scrollDownHintOpacity < 1) scrollDownHintOpacity = 0;
          styles['scrollDownHintOpacity'] = `${scrollDownHintOpacity}`;

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

     let allowScroll = true;
     function handleMouseWheel(e: WheelEvent) {
          if (showHero) return;
          if (!allowScroll) return;
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

          let translateBefore: number = parseInt(styles['translateHorizontalScroll'].split('px')[0]);
          if (e.deltaY > 0) {
               translateBefore -= 500;
          } else {
               translateBefore += 500;
          }
          styles['translateHorizontalScroll'] = `${translateBefore}px`;

          allowScroll = false;
          setTimeout(() => {
               allowScroll = true;
          }, 1100);
     }


     $: cssVarStyles = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(';');
</script>

<svelte:window on:scroll={handleScroll} bind:scrollY={windowY} on:wheel={handleMouseWheel} />

<div class="content" style={cssVarStyles}>
     {#if showHero}
          <section class="hero-section" on:mousemove={e => handleMouseMove(e)} role="presentation">
               <div class="fruits-stack">
                    <div class="orange-1 orange fruit"></div>
                    <div class="orange-2 orange fruit"></div>
                    <div class="tomate-1 tomate fruit"></div>
                    <div class="onion-1 onion fruit"></div>
               </div>
               <div class="branches-stack">
                    <div class="branch-1 branch">
                         <img src={branch} alt="Branch 1" />
                    </div>
                    <div class="branch-2 branch">
                         <img src={branch} alt="Branch 2" />
                    </div>
                    <div class="branch-3 branch">
                         <img src={branch} alt="Branch 3" />
                    </div>
               </div>
               <div class="title-stack">
                    <h1>VERDANTIA</h1>
                    <h1>VERDANTIA</h1>
                    <h1 bind:this={centerTitle}>VERDANTIA</h1>
                    <h1>VERDANTIA</h1>
                    <h1>VERDANTIA</h1>
               </div>
               <div class="scroll-down-hint">
                    <p>Scroll down</p>
               </div>
          </section>
     {/if}
     <section class="horizontal-section">
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
          <div class="horizontal-content">
               <div class="boxes">
                    {#each Array(10) as _, i}
                         <div class="box"></div>
                    {/each}
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

               .branches-stack {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 100;

                    .branch {
                         position: absolute;
                         animation: branch-start 1.5s forwards;
                         transform: translateY(-50vw);

                         width: clamp(250px, 35vw, 500px);

                         img {
                              width: 100%;
                              height: 100%;
                              object-fit: cover;
                         }
                    }

                    .branch-1 {
                         rotate: 270deg;
                         top: -10%;
                         left: 0%;
                         animation-delay: 0;
                    }

                    .branch-2 {
                         rotate: 90deg;
                         top: 15%;
                         right: 0%;
                         animation-delay: 0.3s;
                    }

                    .branch-3 {
                         rotate: 270deg;
                         top: 30%;
                         left: 0%;
                         animation-delay: 0.4s;
                    }

                    @keyframes branch-start {
                         0% {
                              transform: translateY(-50vw);
                         }
                         100% {
                              transform: translateY(0%);
                         }
                    }
               }

               .scroll-down-hint {
                    position: absolute;
                    bottom: 5%;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: clamp(0.9rem, 2vw, 1.2rem);
                    text-transform: uppercase;
                    opacity: var(--scrollDownHintOpacity);
                    transition: all 0.5s;
                    animation: scroll-down-hint-color 2s infinite;
               }

               @keyframes scroll-down-hint-color {
                    0% {
                         color: v.$tertiary-dark;
                    }
                    50% {
                         color: v.$tertiary-light;
                    }
                    100% {
                         color: v.$tertiary-dark;
                    }
               }

               .fruits-stack {
                    position: absolute;
                    width: 100%;
                    height: 100%;

                    .fruit {
                         position: absolute;
                         aspect-ratio: 1/1;
                         border-radius: 50%;
                         transform: translate(-50%, -50%);
                         animation: fruit-start 1.5s forwards;
                    }

                    .onion {
                         background-color: v.$secondary;
                    }

                    .onion-1 {
                         top: calc(90% - 150px);
                         left: 10%;
                    }

                    .tomate {
                         background-color: v.$quinary;
                    }

                    .tomate-1 {
                         top: 25%;
                         left: calc(90% - 100px);
                    }
                    
                    .orange {
                         background-color: v.$primary;
                    }

                    .orange-1 {
                         top: 15%;
                         left: 20%;
                    }

                    .orange-2 {
                         top: calc(95% - 100px);
                         left: 80%;
                    }

                    @keyframes fruit-start {
                         0% {
                              width: 0;
                              height: 0;
                         }
                         100% {
                              // width: clamp(100px, 10vw, 200px);
                              // height: clamp(100px, 10vw, 200px);
                         }
                    }
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
                         10% {
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
                         10% {
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
                         10% {
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
                         10% {
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

          .horizontal-section {
               display: flex;
               flex-direction: column;
               width: 100%;
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

               .horizontal-content {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                    height: 100%;

                    .boxes {
                         display: flex;
                         gap: 2rem;
                         transform: translateX(var(--translateHorizontalScroll));
                         transition: all 1s;

                         .box {
                              width: 300px;
                              height: 300px;
                              background-color: v.$tertiary;

                              &:nth-child(1) {
                                   margin-left: calc(50vw - 150px);
                              }

                              &:nth-child(2n) {
                                   background-color: v.$tertiary-light;
                              }
                         }
                    }
               }
          }
     }
</style>