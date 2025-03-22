<script lang="ts">
     import { onMount } from "svelte";
     import branch1 from "$lib/assets/branches/branch_1.png";
     import branch1d from "$lib/assets/branches/branch_1d.png";
     import branch2 from "$lib/assets/branches/branch_2.png";
     import branch2d from "$lib/assets/branches/branch_2d.png";
     import branch3 from "$lib/assets/branches/branch_3.png";
     import branch4 from "$lib/assets/branches/branch_4.png";
     import branch5 from "$lib/assets/branches/branch_5.png";
     import branch5d from "$lib/assets/branches/branch_5d.png";
     import branch6 from "$lib/assets/branches/branch_6.png";
     import branch6d from "$lib/assets/branches/branch_6d.png";
     import branch7 from "$lib/assets/branches/branch_7.png";
     import branch7d from "$lib/assets/branches/branch_7d.png";
     import branch8 from "$lib/assets/branches/branch_8.png";
     import branch8d from "$lib/assets/branches/branch_8d.png";
     import branch9 from "$lib/assets/branches/branch_9.png";
     import branch10 from "$lib/assets/branches/branch_10.png";
     import branch11 from "$lib/assets/branches/branch_11.png";
     import branch11d from "$lib/assets/branches/branch_11d.png";
     import branch12 from "$lib/assets/branches/branch_12.png";
     import branch13 from "$lib/assets/branches/branch_13.png";
     import branch14 from "$lib/assets/branches/branch_14.png";
     import branch15 from "$lib/assets/branches/branch_15.png";
     import orange from "$lib/assets/icons/orange.png";
     import lavender from "$lib/assets/icons/lavender.png";
     import leaf from "$lib/assets/icons/leaf.png";
     import flower from "$lib/assets/icons/flower.png";

     let branches = [branch1, branch2, branch3, branch4, branch5, branch6, branch7, branch8, branch9, branch10, branch11, branch12, branch13, branch14, branch15];

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
          'windowHeight': '70%',
          'windowBorderRadius': '1000px',
          'horizontalOpacity': '1'
     };

     let plantsFirstBox = [
          { plant: branch11d, word: 'THERE', plantOpacity: '0', plantTransform: 'translateY(50px)' },
          { plant: branch1d, word: 'IS', plantOpacity: '0', plantTransform: 'translateY(50px)' },
          { plant: branch5d, word: 'NO', plantOpacity: '0', plantTransform: 'translateY(50px)' },
          { plant: branch6d, word: 'REASON', plantOpacity: '0', plantTransform: 'translateY(50px)' },
          { plant: branch11d, word: 'NOT', plantOpacity: '0', plantTransform: 'translateY(50px)' },
          { plant: branch8d, word: 'TO', plantOpacity: '0', plantTransform: 'translateY(50px)' },
          { plant: branch2d, word: 'DO', plantOpacity: '0', plantTransform: 'translateY(50px)' },
          { plant: branch7d, word: 'IT', plantOpacity: '0', plantTransform: 'translateY(50px)' }
     ];

     let centerTitle: HTMLHeadingElement;
     let navTitle: HTMLHeadingElement;

     let active = false;
     let showHero = false;
     let showHorizontal = true;
     let showWindow = true; // for testing "false", should be true
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
               if (visibleSection === 3) {
                    zoomInWindow();
                    return;
               }
               translateBefore -= innerWidth * 0.95;
               visibleSection++;
          } else {
               if (visibleSection === 1) return;
               translateBefore += innerWidth * 0.95;
               visibleSection--;
          }

          if (visibleSection === 3) {
               styles['windowHeight'] = '100%';
          } else if (visibleSection === 2) {
               styles['windowHeight'] = '70%';
          }
          
          if (visibleSection === 1 && e.deltaY > 0) {               
               setTimeout(() => {
                    for (let i = 0; i < plantsFirstBox.length; i++) {
                         setTimeout(() => {
                              plantsFirstBox[i].plantOpacity = '1';
                              plantsFirstBox[i].plantTransform = 'translateY(0)';
                         }, i * (100 - i));
                    }
               }, 200);
          } else if (visibleSection === 2 && e.deltaY > 0) {
               for (let i = 0; i < plantsFirstBox.length; i++) {
                    setTimeout(() => {
                         plantsFirstBox[i].plantOpacity = '0';
                         plantsFirstBox[i].plantTransform = 'translateY(50px)';
                    }, i * (50 - i));
               }
          } else if (visibleSection === 1 && e.deltaY < 0) {
               for (let i = plantsFirstBox.length; i >= 0; i--) {
                    setTimeout(() => {
                         plantsFirstBox[i].plantOpacity = '1';
                         plantsFirstBox[i].plantTransform = 'translateY(0)';
                    }, 500 - i * 50);
               }
          }

          styles['progress'] = `${visibleSection * 33.3334}%`;
          styles['translateHorizontalScroll'] = `${translateBefore}px`;

          allowScroll = false;
          setTimeout(() => {
               allowScroll = true;
          }, 1100);
     }

     function zoomInWindow() {
          styles['windowHeight'] = '500%';
          styles['windowBorderRadius'] = '0';
          styles['horizontalOpacity'] = '0';

          allowScroll = false;

          setTimeout(() => {
               showHorizontal = false;
               showWindow = false;
               window.scrollTo(0, 0);
          }, 1000);
     }

     $: cssVarStyles = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(';');
</script>

<svelte:window on:scroll={handleScroll} bind:scrollY={windowY} on:wheel={handleMouseWheel} />

<div class="content" style={cssVarStyles}>
     <!--{#if false}-->
     {#if showHero}
          <section class="hero-section" on:mousemove={e => handleMouseMove(e)} role="presentation">
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
     {#if showWindow}
          <section class="horizontal-section">
               {#if showHorizontal}
                    <div class="nav">
                         <h1 bind:this={navTitle}>VERDANTIA</h1>
                         <div class="links">
                              <div class="link">
                              <a href="/">Home</a>
                              {#if showHero}
                                   <div class="active-icon"></div>
                              {:else}
                                   <div class="active-icon active">
                                             <img src={orange} alt="Active" />
                                   </div>
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
               {/if}
               <div class="horizontal-content">
                    <div class="boxes">
                         <div class="box">
                              <div class="first-content">
                                   {#each plantsFirstBox as plant, i}
                                        <div class="word-container">
                                             <div class="plant" style="animation-delay: {i * 0.05}s; opacity: {plant.plantOpacity}; transform: {plant.plantTransform};">
                                                  <img src={plant.plant} alt="Plant" />
                                             </div>
                                             <div class="word">
                                                  <p>{plant.word}</p>
                                             </div>
                                        </div>
                                   {/each}
                              </div>
                         </div>
                         <div class="box"></div>
                         <div class="box">
                              <div class="window"></div>
                         </div>
                    </div>
                    {#if showHorizontal}
                         <div class="navigator">
                              <div class="navigator-content">
                                   <div class="progress-bar">
                                        <div class="progress"></div>
                                   </div>
                              </div>
                         </div>
                    {/if}
               </div>
          </section>
     {/if}
     {#if !showWindow}
          <section class="blue-section">
               <div class="blue-content">
                    <div class="heading">
                         <h1>Still not convinced?</h1>
                    </div>
                    <div class="clouds"></div>
               </div>
               <div class="white-content">
                    <div class="further-links">
                         <h3>Now that you know who we are, find out what food we serve</h3>
                         <a href="/menu">View our menu</a>
                    </div>
               </div>
          </section>
     {/if}
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
               gap: 1.5rem;

               .nav {
                    width: 100%;
                    height: fit-content;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    opacity: var(--horizontalOpacity);
                    transition: all 0.3s;

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
                                   animation: active-icon-start 0.5s forwards;
                                   display: flex;

                                   img {
                                        width: 100%;
                                        height: 100%;
                                   }
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
                    align-items: start;
                    height: 100vh;
                    gap: 2rem;
                    position: relative;

                    .navigator {
                         width: 100%;
                         display: flex;
                         justify-content: center;
                         opacity: var(--horizontalOpacity);
                         transition: all 0.2s;

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
                         z-index: -2;

                         .box {
                              width: 90vw;
                              height: 100%;

                              &:nth-child(1) {
                                   margin-left: calc(100vw);

                                   display: flex;
                                   justify-content: center;
                                   align-items: center;

                                   .first-content {
                                        display: grid;
                                        grid-template-columns: repeat(8, 1fr);

                                        .word-container {
                                             margin-top: -105px;
                                             display: flex;
                                             flex-direction: column;
                                             align-items: center;
                                             justify-content: center;
                                             width: clamp(100px, 10vw, 200px);
                                             gap: 1rem;

                                             .plant {
                                                  width: 100%;
                                                  display: flex;
                                                  justify-content: center;
                                                  transition: all 0.2s;

                                                  img {
                                                       width: 180%;
                                                  }
                                             }

                                             .word {
                                                  width: 100%;
                                                  display: flex;
                                                  justify-content: center;

                                                  p {
                                                       color: black;
                                                       font-size: clamp(1rem, 2.3vw, 1.7rem);
                                                  }
                                             }
                                        }
                                   }
                              }

                              &:nth-child(3) {
                                   display: flex;
                                   justify-content: center;
                                   align-items: center;

                                   .window {
                                        height: var(--windowHeight);
                                        aspect-ratio: 2/3;
                                        z-index: 100;
                                        position: relative;
                                        background-color: v.$quaternary;
                                        border-top-left-radius: var(--windowBorderRadius);
                                        border-top-right-radius: var(--windowBorderRadius);
                                        transition: border-radius 0.5s,
                                             height 1s;
                                   }
                              }
                         }
                    }
               }
          }

          .blue-section {
               width: 100%;
               min-height: 100vh;

               display: flex;
               flex-direction: column;
               justify-content: center;
               background-color: v.$quaternary;

               .blue-content {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    opacity: 0;
                    animation: fadeIn 1s forwards;

                    @keyframes fadeIn {
                         0% {
                              opacity: 0;
                         }
                         100% {
                              opacity: 1;
                         }
                    }

                    .heading {
                         background-color: v.$quaternary;
                         height: 90%;
                         min-height: 90vh;
                         width: 100%;
                         display: flex;
                         justify-content: center;
                         align-items: center;

                         h1 {
                              font-size: clamp(4rem, 10vw, 6rem);
                              font-weight: bold;
                              color: v.$font-color-light;
                         }
                    }

                    .clouds {
                         background-image: linear-gradient(180deg, v.$quaternary, v.$font-color-light);
                         height: 10%;
                         min-height: 200px;
                         width: 100%;
                    }
               }

               .white-content {
                    width: 100%;
                    height: 100vh;
                    background-color: v.$background-color-light;
                    padding: 0 3rem;
                    display: flex;
                    align-items: end;

                    .further-links {
                         padding: 4rem 2rem;
                         background-color: v.$tertiary-light;
                         display: flex;
                         flex-direction: column;
                         align-items: center;
                         border-radius: 2rem;
                         width: 100%;
                         margin-bottom: 2rem;
                         gap: 2rem;

                         h3 {
                              font-size: clamp(1.5rem, 3vw, 2rem);
                              color: v.$font-color-light;
                              text-align: center;
                              padding: 1rem;
                         }

                         a {
                              background-color: rgba(v.$primary, 0.85);
                              color: v.$font-color-light;
                              padding: 10px 16px;
                              border-radius: 30px;
                              font-size: 0.95rem;
                              font-weight: 500;
                              letter-spacing: 0.5px;
                              cursor: pointer;
                              transition: all 0.3s ease;

                              &::after {
                                   content: "→";
                                   margin-left: 8px;
                                   font-size: 1.1em;
                              }
                         }
                    }
               }
          }
     }
</style>