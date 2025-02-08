<script lang="ts">
     import { onMount } from "svelte";
     import branch1 from "$lib/assets/branches/branch_1.png";
     import branch2 from "$lib/assets/branches/branch_2.png";
     import branch3 from "$lib/assets/branches/branch_3.png";
     import branch4 from "$lib/assets/branches/branch_4.png";

     let branches = [branch1, branch2, branch3, branch4];

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
          'scrollDownHintOpacity': '0',
          'progress': '0%',
          'windowScale': '0',
     };

     let centerTitle: HTMLHeadingElement;
     let navTitle: HTMLHeadingElement;

     let active = false;
     let showHero = true;
     let windowY = 0;

     onMount(() => {
          window.scrollTo(0, 0);
          showHero = true;

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
     let visibleSection = 0;
     function handleMouseWheel(e: WheelEvent) {
          if (showHero) return;
          if (!allowScroll) return;
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

          let innerWidth = window.innerWidth;

          let translateBefore: number = parseInt(styles['translateHorizontalScroll'].split('px')[0]);

          if (e.deltaY > 0) {
               if (visibleSection === 4) return;
               translateBefore -= innerWidth * 0.95;         
               visibleSection++;
          } else {
               if (visibleSection === 1) return;
               translateBefore += innerWidth * 0.95;
               visibleSection--;
          }

          if (visibleSection === 1 && styles['windowScale'] === '0') {
               styles['windowScale'] = '1';
          }
          if (visibleSection === 2 && styles['windowScale'] === '1' && e.deltaY > 0) {
               styles['windowScale'] = '0';
          }

          styles['progress'] = `${visibleSection * 25}%`;
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
                    <div class="left">
                         {#each Array(10) as _, i}
                              <div class="branch" style="top: {i * 10 - 15}%; left: {-Math.random() * 10}%; animation-delay: {i * 0.1}s;">
                                   <img src={branches[i % branches.length]} alt="Branch" />
                              </div>
                         {/each}
                    </div>
                    <div class="right">
                         {#each Array(10) as _, i}
                              <div class="branch" style="top: {i * 10 - 15}%; right: {-Math.random() * 10}%; animation-delay: {(10 - i) * 0.1}s;">
                                   <img src={branches[i % branches.length]} alt="Branch" />
                              </div>
                         {/each}
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
                        {#if showHero}
                             <div class="active-icon"></div>
                        {:else}
                             <div class="active-icon active"></div>
                         {/if}
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
                    <div class="box first">
                         <p>
                              At <span class="logo">Verdantia</span>, we believe that great food starts with great ingredients. That’s why we source locally, working with sustainable farms to bring you the freshest, most flavorful plant-based meals.
                         </p>
                         <div class="window-container">
                              <div class="window"></div>
                         </div>
                    </div>
                    <div class="box second">
                         <div class="second-content">
                              <!--
                              <div class="window"></div>
                              <div class="window"></div>
                              <div class="window"></div>
                              -->
                         </div>
                    </div>
                    {#each Array(2) as _, i}
                         <div class="box"></div>
                    {/each}
               </div>
               <div class="navigator">
                    <div class="navigator-content">
                         <div class="progress-bar">
                              <div class="progress"></div>
                         </div>
                    </div>
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
                         animation: branch-start 1s forwards;
                         transform: translateX(-100%);

                         width: clamp(250px, 35vw, 650px);

                         img {
                              width: 100%;
                              height: 100%;
                              object-fit: cover;
                         }
                    }

                    .right {
                         .branch {
                              rotate: 180deg;
                         }
                    }

                    @keyframes branch-start {
                         0% {
                              transform: translateX(-50vw);
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
                                   animation: active-icon-start 0.5s forwards;
                              }

                              @keyframes active-icon-start {
                                   0% {
                                        transform: scale(0);
                                   }
                                   100% {
                                        transform: scale(1);
                                   }
                              }
                         }
                    }
               }

               .horizontal-content {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    align-items: start;
                    height: 100vh;

                    .navigator {
                         width: 100%;
                         display: flex;
                         justify-content: center;

                         .navigator-content {
                              display: flex;
                              gap: 1rem;
                              width: 90%;

                              .progress-bar {
                                   width: 25%;
                                   min-width: 150px;
                                   height: 0.3rem;
                                   background-color: v.$tertiary-light-low-opacity;
                                   border-radius: 5px;
                                   position: relative;

                                   .progress {
                                        height: 100%;
                                        width: var(--progress);
                                        background-color: v.$tertiary;
                                        border-radius: 5px;
                                        transition: all 1s;
                                   }
                              }
                         }
                    }

                    .boxes {
                         display: flex;
                         gap: 5vw;
                         transform: translateX(var(--translateHorizontalScroll));
                         transition: all 1s;
                         height: 90%;

                         .box {
                              width: 90vw;
                              height: 100%;

                              &:nth-child(1) {
                                   margin-left: calc(100vw);
                              }

                              p {
                                   .logo {
                                        color: v.$tertiary;
                                        font-family: "DynaPuff Regular";
                                   }
                              }
                         }

                         .first {
                              padding: 2rem 0;
                              display: flex;
                              align-items: center;
                              justify-content: space-between;

                              p {
                                   width: 50%;
                                   font-size: 2rem;
                                   text-transform: uppercase;
                              }

                              .window-container {
                                   width: 50%;
                                   display: flex;
                                   justify-content: center;
                                   align-items: center;
                              }

                              .window {
                                   width: 18rem;
                                   aspect-ratio: 2/3;
                                   background-color: v.$quaternary;
                                   border-top-left-radius: 9rem;
                                   border-top-right-radius: 9rem;
                                   scale: var(--windowScale);
                                   transition: scale 1s;
                              }
                         }

                         .second {
                              padding: 2rem 0;
                              display: flex;
                              align-items: center;
                              justify-content: center;

                              .second-content {
                                   display: flex;
                                   gap: 2.5rem;

                                   .window {
                                        width: 18rem;
                                        aspect-ratio: 2/3;
                                        background-color: v.$quaternary;
                                        border-top-left-radius: 9rem;
                                        border-top-right-radius: 9rem;
                                        scale: var(--windowScale);
                                        transition: scale 1s;
                                   }
                              }
                         }
                    }
               }
          }
     }
</style>