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
     import Footer from "$lib/components/Footer.svelte";

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
          'horizontalOpacity': '1',
          'itemsOpacity': '0',
          'itemsScale': '0'
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

     let firstBoxScrolled = false;
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
          if (!showWindow) {
               handleScrollBlueSection();
               return;
          }

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

          if (visibleSection !== 1) {
               firstBoxScrolled = false;
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

               setTimeout(() => {
                    firstBoxScrolled = true;
               }, 800);
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

               setTimeout(() => {
                    firstBoxScrolled = true;
               }, 500);
          }

          if (visibleSection === 2) {
               styles['itemsOpacity'] = '0.6';
               styles['itemsScale'] = '1';
          } else {
               styles['itemsOpacity'] = '0';
               styles['itemsScale'] = '0';
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

     let fourAspects = [
          { 
               title: 'Transparency',
               description: 'No shortcuts. No artificial substitutes. No pretending. Just honest ingredients, prepared with care, for food that tastes as good as it should. Because real food doesn’t need to be anything else. On our menu page, you have the ability to explore every dish, see exactly what’s inside, and learn where each ingredient comes from.',
               opacity: '1',
               transform: 'translateY(30rem) rotate(1.2deg);'
          },
          { 
               title: 'Fresh ingredients',
               description: 'Freshness isn’t a luxury; it’s our standard. Every ingredient we use is fresh, never highly processed, because real food should nourish you. That’s also why our menu changes with the seasons—when an ingredient isn’t at its best, we won’t serve it. Eating fresh just feels better, and at Verdantia, that’s exactly what you get.',
               opacity: '1',
               transform: 'translateY(22.5rem) rotate(-2deg);'
          },
          { 
               title: 'Vegetarian',
               description: 'We believe vegetarian and vegan food should be exciting, satisfying, and accessible to everyone. No compromises, no bland salads—just bold flavors and hearty dishes that happen to be meat-free. We’re here to prove that going vegetarian doesn’t mean giving anything up. Even meat lovers will find something to love.',
               opacity: '1',
               transform: 'translateY(15rem) rotate(2deg);'
          },
          { 
               title: 'Local ingredients',
               description: 'Most of our ingredients come from U.S. farmers, supporting both sustainability and the local economy. Knowing where your food comes from isn’t just reassuring—it’s the way it should be. That’s why we value transparency. On our menu page, you can explore every dish, see exactly what’s inside, and learn where each ingredient comes from. We have nothing to hide—just real food, grown close to home.',
               opacity: '1',
               transform: 'translateY(7.5rem) rotate(-2deg);'
          }
     ];

     let aspectCard1 = null;
     let aspectCard2 = null;
     let aspectCard3 = null;
     let aspectCard4 = null;
     let aspectCards: any[] = [aspectCard1, aspectCard2, aspectCard3, aspectCard4];

     function getCardOffset(card: HTMLElement): number {
          const rect = card.getBoundingClientRect();
          const cardMid = rect.top + rect.height / 2;
          const screenMid = window.innerHeight / 2;
          return screenMid - cardMid;
     }

     function handleScrollBlueSection() {
          const offsets = aspectCards.map(card => getCardOffset(card));

          offsets.map((offset, i) => {
               if (offset < 100) {
                    fourAspects[i].opacity = '1';
               } else {
                    fourAspects[i].opacity = '0';
               }
          });
     }

     $: cssVarStyles = Object.entries(styles).map(([key, value]) => `--${key}:${value}`).join(';');
</script>

<svelte:window on:scroll={handleScroll} bind:scrollY={windowY} on:wheel={handleMouseWheel} />

<div class="menu-link">
     <a href="/menu">Skip to menu</a>
</div>
<div class="content" style={cssVarStyles}>
     <!-- {#if false} -->
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
                                        <div class="word-container"
                                             on:mouseenter={() => {
                                                  if (firstBoxScrolled) {
                                                       plantsFirstBox[i].plantTransform = 'translateY(-2rem)';
                                                  }
                                             }}
                                             on:mouseleave={() => {
                                                  plantsFirstBox[i].plantTransform = 'translateY(0)';
                                             }}
                                             role="button"
                                             tabindex={i}
                                        >
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
                         <div class="box">
                              <div class="second-bg">
                                   <img src={lavender} alt="Lavender" />
                                   <img src={leaf} alt="Leaf" />
                                   <img src={flower} alt="Flower" />
                                   <img src={orange} alt="Orange" />
                              </div>
                              <p class="second-content">
                                   <span>Verdantia</span> was born from a simple idea:<br>
                                   to serve fresh, local ingredients that truly taste better.<br>
                                   We believe in real food, with no shortcuts or substitutes,<br>
                                   sourced with care and served with purpose.<br>
                                   Always vegetarian.
                              </p>
                         </div>
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
                         <h1>Let's dive deeper</h1>
                    </div>
               </div>
               <div class="white-content">
                    <div class="main-aspects">
                         <div class="intro">
                              <p>Verdantia is created by bringing together 4 key aspects.</p>
                         </div>
                    </div>
                    <div class="aspects">
                         {#each fourAspects as aspect, i}
                              <div 
                                   class="aspect-card"
                                   style="opacity: {aspect.opacity}; transform: {aspect.transform}"
                                   bind:this={aspectCards[i]}
                                   >
                                   <h3>{aspect.title}</h3>
                                   <p>{@html aspect.description}</p>

                                   {#if i == 1}
                                        <div class="card-bg card-bg-1">
                                             <img src={branch7} alt="branch">
                                        </div>
                                   {:else if i == 2}
                                        <div class="card-bg card-bg-2">
                                             <img src={leaf} alt="leaf">
                                             <img src={leaf} alt="leaf">
                                             <img src={leaf} alt="leaf">
                                        </div>
                                   {/if}
                              </div>
                         {/each}
                    </div>
                    <div class="links">
                         <div class="link">
                              <h3>Find out what we serve</h3>
                              <a href="/menu">View menu</a>
                         </div>
                         <div class="link">
                              <h3>Or read the latest news</h3>
                              <a href="/news">Read news</a>
                         </div>
                    </div>
               </div>

               <Footer />
          </section>
     {/if}
</div>

<style lang="scss">
     @use "../lib/styles/variables" as v;
     @use "../lib/styles/global" as g;

     .menu-link {
          position: fixed;
          bottom: 30px;
          right: 25px;
          z-index: 1000;
          cursor: pointer !important;
          animation: menuLinkFadeIn 0.5s forwards;
          animation-delay: 2s;
          transform: translateY(100px);
          opacity: 0.2;

          a {
               font-size: clamp(0.9rem, 2vw, 0.95rem);
               background-color: v.$primary;
               padding: 0.5rem 1.5rem;
               border-radius: 1000px;
               color: v.$font-color-light;
               cursor: pointer;
               box-shadow: 0 3px 10px rgba(252, 98, 52, 0.3);
               transition: all 0.3s ease;

               &:hover {
                    box-shadow: 0 3px 10px rgba(252, 98, 52, 0.8);
               }

               &::after {
                    content: "→";
                    margin-left: 8px;
                    font-size: 1.1em;
               }
          }
     }

     @keyframes menuLinkFadeIn {
          0% {
               opacity: 0.2;
               transform: translateX(300px);
          }
          100% {
               opacity: 1;
               transform: translateX(0);
          }
     }

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
                    z-index: 102;

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
                                                       font-size: clamp(1rem, 2vw, 1.7rem);
                                                  }
                                             }
                                        }
                                   }
                              }

                              &:nth-child(2) {
                                   display: flex;
                                   justify-content: center;
                                   align-items: center;
                                   position: relative;

                                   .second-content {
                                        text-align: center;
                                        font-size: clamp(1.1rem, 3.2vw, 2.6rem);

                                        span {
                                             font-family: "DynaPuff Regular";
                                             color: v.$tertiary;
                                        }
                                   }

                                   .second-bg {
                                        position: absolute;
                                        width: 100%;
                                        height: 100%;

                                        img {
                                             aspect-ratio: 1/1;
                                             width: clamp(55px, 10vw, 200px);
                                             height: auto;
                                             position: absolute;
                                             opacity: var(--itemsOpacity);
                                             transition: all 2s,
                                                  transform 1s cubic-bezier(0.6, 0, 0.735, 0.045);

                                             &:nth-child(1) {
                                                  transform: translateX(100px) translateY(8vh) rotate(45deg);
                                             }

                                             &:nth-child(2) {
                                                  transform: translateX(30vw) translateY(55vh) rotate(-30deg);
                                             }

                                             &:nth-child(3) {
                                                  transform: translateX(70vw) translateY(40vh) rotate(30deg);
                                             }

                                             &:nth-child(4) {
                                                  transform: translateX(65vw) translateY(3vh) rotate(0deg) scale(var(--itemsScale));
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

                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
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
                    height: 100%;
                    min-height: 100vh;
                    opacity: 0;
                    animation: fadeIn 1s forwards;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-image: linear-gradient(v.$quaternary 0 60%, v.$background-color-light);

                    @keyframes fadeIn {
                         0% {
                              opacity: 0;
                         }
                         100% {
                              opacity: 1;
                         }
                    }

                    .heading {
                         width: 100%;
                         height: 100%;
                         display: flex;
                         justify-content: center;
                         align-items: center;
                         flex: 1;

                         h1 {
                              font-size: clamp(4rem, 10vw, 6rem);
                              font-weight: bold;
                              color: v.$font-color-light;
                              animation: h1-fadein 1.3s forwards;
                              text-align: center;
                         }

                         @keyframes h1-fadein {
                              0% {
                                   opacity: 0;
                                   transform: translateY(100px);
                              }
                              20% {
                                   opacity: 0;
                                   transform: translateY(100px);
                              }
                              100% {
                                   opacity: 1;
                                   transform: translateY(0);
                              }
                         }
                    }
               }

               .white-content {
                    width: 100%;
                    background-color: v.$background-color-light;
                    padding: 0 3rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .main-aspects {
                         width: 100%;
                         display: flex;
                         flex-direction: column;
                         align-items: center;
                         gap: 2rem;
                         padding-top: 5rem;

                         .intro {
                              width: 100%;
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              gap: 1rem;

                              p {
                                   color: v.$font-color-dark;
                                   font-size: clamp(1.2rem, 2.5vw, 1.6rem);
                                   text-align: center;
                                   text-transform: uppercase;
                              }
                         }
                    }

                    .aspects {
                         position: relative;
                         display: flex;
                         align-items: center;
                         min-height: 80vh;
                         justify-content: center;
                         margin-bottom: 40rem;

                         .aspect-card {
                              position: absolute;

                              padding: 2rem;
                              background-color: #fff;

                              width: clamp(400px, 80vw, 800px);
                              aspect-ratio: 3/2;
                              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                              border-radius: 6px;

                              display: flex;
                              flex-direction: column;
                              gap: 1rem;

                              transition: all 0.5s;

                              h3 {
                                   font-size: clamp(1.5rem, 3vw, 2rem);
                                   color: v.$font-color-dark;
                                   text-transform: uppercase;
                              }

                              p {
                                   width: 80%;
                              }

                              .card-bg {
                                   position: absolute;
                                   width: 100%;
                                   height: 100%;
                                   opacity: 0.7;
                                   z-index: -1;
                                   transform: translateX(-2rem) translateY(-2rem);
                                   overflow: hidden;
                              }

                              .card-bg-1 {
                                   display: flex;
                                   justify-content: right;
                                   align-items: end;

                                   img {
                                        width: clamp(100px, 50vw, 500px);
                                        aspect-ratio: 3840/2160;
                                        transform: rotate(210deg);
                                        margin-right: -10%;
                                        margin-bottom: -5%;
                                   }
                              }

                              .card-bg-2 {
                                   img {
                                        width: clamp(20px, 20vw, 100px);
                                        aspect-ratio: 1/1;
                                        position: absolute;

                                        &:nth-child(1) {
                                             bottom: 10%;
                                             right: 15%;
                                             transform: rotate(100deg);
                                        }

                                        &:nth-child(2) {
                                             bottom: 15%;
                                             right: 5%;
                                             transform: rotate(70deg);
                                        }

                                        &:nth-child(3) {
                                             bottom: 5%;
                                             right: 7%;
                                             transform: rotate(140deg);
                                        }
                                   }
                              }
                         }
                    }

                    .links {
                         margin-bottom: 2rem;
                         width: 100%;

                         display: grid;
                         grid-template-columns: repeat(2, 1fr);
                         gap: 2rem;

                         @media screen and (max-width: 900px) {
                              grid-template-columns: 1fr;
                         }

                         .link {
                              width: 100%;
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              gap: 1rem;

                              background-color: #fff;
                              padding: 4rem 2rem;
                              border-radius: 1rem;
                              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

                              h3 {
                                   font-size: clamp(1.1rem, 3vw, 2rem);
                                   color: v.$font-color-dark;
                                   text-transform: uppercase;
                              }

                              a {
                                   font-size: clamp(0.9rem, 2vw, 0.95rem);
                                   background-color: v.$primary;
                                   padding: 0.5rem 1.5rem;
                                   border-radius: 1000px;
                                   color: v.$font-color-light;
                                   cursor: pointer;
                                   box-shadow: 0 3px 10px rgba(252, 98, 52, 0.3);
                                   transition: all 0.3s ease;

                                   &:hover {
                                        box-shadow: 0 3px 10px rgba(252, 98, 52, 0.8);
                                   }

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
     }
</style>