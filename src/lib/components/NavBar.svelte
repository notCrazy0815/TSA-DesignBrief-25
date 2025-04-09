<script lang="ts">
    import orange from "$lib/assets/icons/orange.png";
    import LoadingScreen from "./LoadingScreen.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { shouldAnimate, firstLoad, isLoading } from "$lib/stores/navStore";
    import { page } from "$app/stores";
    import { gsap } from "gsap";
    
    type ActivePage = "approach" | "menu" | "news";
    export let active: ActivePage = "approach";
    export let bg: string = "base";

    let isMenuOpen = false;
    let isFirstLoad = true;
    let contentElement: HTMLDivElement;

    onMount(() => {
        isFirstLoad = $firstLoad;
        firstLoad.set(false);

        if (!isFirstLoad) {
            isLoading.set(true);

            setTimeout(() => {
                isLoading.set(false);
            }, 1000);
        }

        const delay = $page.url.pathname !== "/" ? 0.4 : 1.6;
        gsap.from(contentElement, {
            y: -200,
            opacity: 0,
            duration: 0.75,
            ease: "power2.out",
            delay: delay
        });
    });

    let links = [
        {
            text: "APPROACH",
            href: "/",
            active: active === "approach"
        },
        {
            text: "OUR SEASONAL MENU",
            href: "/menu",
            active: active === "menu"
        },
        {
            text: "NEWS",
            href: "/news",
            active: active === "news"
        }
    ];

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            gsap.to(".content-box", {
                height: 300,
                duration: 0.5,
                ease: "power2.inOut"
            });
            
            setTimeout(() => {
                const menuLinks = document.querySelectorAll(".menu-content .menu-links a");
                if (menuLinks.length > 0) {
                    gsap.to(menuLinks, {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        stagger: 0.1,
                        ease: "power2.out"
                    });
                }
            }, 300);
        } else {
            const menuLinks = document.querySelectorAll(".menu-content .menu-links a");
            if (menuLinks.length > 0) {
                gsap.to(menuLinks, {
                    opacity: 0,
                    y: 20,
                    duration: 0.2,
                    stagger: 0.1,
                    ease: "power2.in"
                });
            }
            gsap.to(".content-box", {
                height: "100%",
                duration: 0.5,
                ease: "power2.inOut"
            });
        }
    }

    function navigateAndAnimate(href: string) {
        if (window.location.pathname === href) {
            return;
        }

        isMenuOpen = false;
        
        setTimeout(() => {
            shouldAnimate.set(true);
            isLoading.set(true);
        }, 200);

        setTimeout(() => {
            shouldAnimate.set(false);
            goto(href);
        }, 1150);
    }

    let lastScrollY = 0;
    let goingDown = false;
    let directionChange = false;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (goingDown) {
            if (currentScrollY < lastScrollY) {
                goingDown = false;
                directionChange = true;

                // navbar should show
                gsap.to(contentElement, {
                    y: 0,
                    opacity: 1,
                    duration: 0.75,
                    ease: "power2.out"
                });
            }
        } else {
            if (currentScrollY > lastScrollY) {
                goingDown = true;
                directionChange = true;

                // navbar should hide
                gsap.to(contentElement, {
                    y: -200,
                    opacity: 0,
                    duration: 0.75,
                    ease: "power2.out"
                });
            }
        }

        lastScrollY = currentScrollY;
        directionChange = false;
    }
</script>

<svelte:window on:scroll={handleScroll} />

<LoadingScreen />

<div class="navbar">
    <div class="content" bind:this={contentElement}>
        <div class="content-box" class:expanded={isMenuOpen} class:dark={bg === "dark"} class:base={bg === "base"}></div>
        {#if !isMenuOpen}
            <button class="nav-btn" on:click={toggleMenu} on:keydown={(e) => e.key === 'Enter' && toggleMenu()}>
                <p class="nav-text">MENU</p>
            </button>
        {:else}
            <button class="nav-btn close-btn" on:click={toggleMenu} on:keydown={(e) => e.key === 'Enter' && toggleMenu()}>
                <p class="nav-text">CLOSE</p>
            </button>
        {/if}
        <div class="heading">
            <a href="/" on:click|preventDefault={() => navigateAndAnimate("/")}>VERDANTIA</a>
        </div>
        <div class="cart-btn" style:opacity={isMenuOpen ? 0 : 1}>
            <p class="nav-text">BAG</p>
        </div>
        {#if isMenuOpen}
            <div class="menu-content">
                <div class="menu-links">
                    {#each links as link, i}
                        <a href={link.href} on:click|preventDefault={() => navigateAndAnimate(link.href)} class:active={link.active} style="animation-delay: {i * 0.2}s; --orange-bg: url('{orange}')">{link.text}</a>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .navbar {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 2rem 0;
        position: relative;
        z-index: 100;

        .content {
            width: clamp(100px, 90vw, 550px);
            padding: 0.8rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            z-index: 1000;
            transform: translateY(0);
            opacity: 1;

            .nav-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;   
            }

            .nav-text {
                font-size: clamp(0.8rem, 1.6vh, 1rem);
                font-family: 'Inter 24pt Regular';
                color: v.$font-color-dark;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;

                &::selection {
                    background-color: v.$background-color-dark;
                    color: v.$font-color-light;
                }
            }

            .heading {
                a {
                    font-size: clamp(1.1rem, 3vh, 2.2rem);
                    font-family: 'DynaPuff Regular';
                    color: v.$tertiary-dark;
                    cursor: pointer;
                }
            }

            .content-box {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background-color: #fff;
                border-radius: 20px;
                z-index: -1;
                transition: transform .3s cubic-bezier(0.16, 1, 0.3, 1),
                            box-shadow .3s cubic-bezier(0.16, 1, 0.3, 1),
                            background-color .3s cubic-bezier(0.16, 1, 0.3, 1);
                transform-origin: center;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

                &.expanded {
                    border-radius: 20px;
                }

                &.dark {
                    background-color: v.$font-color-light;
                }

                &.base {
                    background-color: #fff;
                }
            }

            &:hover {
                .content-box {
                    transform: scale(1.05);
                    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
                }
            }

            .menu-content {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                padding: 2rem;
                z-index: 1;
                display: grid;
                place-items: center;
                height: 200px;
                border-top: 1px solid rgba(0, 0, 0, 0.1);

                .menu-links {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    
                    a {
                        color: v.$font-color-dark;
                        text-decoration: none;
                        font-size: clamp(1rem, 2vh, 1.4rem);
                        font-family: 'Inter 24pt Regular';
                        opacity: 0;
                        transform: translateY(20px);
                        position: relative;

                        &:hover {
                            opacity: 0;
                        }

                        &.active {
                            &::before {
                                content: '';
                                position: absolute;
                                top: 50%;
                                left: 100%;
                                transform: translateY(-50%) translateX(5px);
                                width: 0.5em;
                                height: 0.5em;
                                background-image: var(--orange-bg);
                                background-size: contain;
                                background-repeat: no-repeat;
                                background-position: center;
                            }
                        }
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                }
            }
        }
    }
</style>