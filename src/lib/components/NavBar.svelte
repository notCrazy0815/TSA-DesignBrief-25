<script context="module" lang="ts">
    export type ActivePage = "approach" | "menu" | "news" | "checkout";
</script>

<script lang="ts">
    import orange from "$lib/assets/icons/orange.png";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { shouldAnimate, firstLoad, isLoading } from "$lib/stores/navStore";
    import { page } from "$app/stores";
    import { gsap } from "gsap";
    import { basket, basketSubtotal, type BasketItem } from "$lib/stores/basketStore";
    
    export let active: ActivePage = "approach";
    export let bg: string = "base";

    let isMenuOpen = false;
    let isBagOpen = false;
    let contentElement: HTMLDivElement;
    let basketItems: BasketItem[] = [];
    let currentSubtotal = 0;

    const unsubscribeBasket = basket.subscribe(items => {
        basketItems = items;
    });

    const unsubscribeSubtotal = basketSubtotal.subscribe(value => {
        currentSubtotal = value;
    });

    onMount(() => {
        if ($firstLoad) {
            firstLoad.set(false);
        }

        const delay = $page.url.pathname !== "/" ? 0.4 : 1.6;
        gsap.from(contentElement, {
            y: -200,
            opacity: 0,
            duration: 0.75,
            ease: "power2.out",
            delay: $firstLoad ? delay : 0
        });

        return () => {
            unsubscribeBasket();
            unsubscribeSubtotal();
        };
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

    function toggleNavbar(type: "menu" | "bag" | "close") {
        if (type === "menu") {
            isMenuOpen = !isMenuOpen;
        } else if (type === "bag") {
            goto("/checkout");
            return;
        } else if (type === "close") {
            isMenuOpen = false;
            isBagOpen = false;
        }
            
        if (isMenuOpen) {
            gsap.to(".content-box", {
                height: 300,
                duration: 0.5,
                ease: "power2.inOut"
            });
        } else {
            gsap.to(".content-box", {
                height: "100%",
                duration: 0.5,
                ease: "power2.inOut"
            });
        }
         
        if (isMenuOpen) {
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
        } else if (!isMenuOpen) {
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
        }
    }

    let lastScrollY = 0;
    let goingDown = false;
    let directionChange = false;

    function handleScroll() {
        if (isMenuOpen) toggleNavbar("close");

        const currentScrollY = window.scrollY;

        if (goingDown) {
            if (currentScrollY < lastScrollY) {
                goingDown = false;
                directionChange = true;

                gsap.to(contentElement, {
                    y: 0,
                    opacity: 1,
                    duration: 0.25,
                    ease: "power2.out"
                });
            }
        } else {
            if (currentScrollY > lastScrollY) {
                goingDown = true;
                directionChange = true;

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

<div class="navbar">
    <div class="content" bind:this={contentElement}>
        <div class="content-box" class:expanded={isMenuOpen} class:dark={bg === "dark"} class:base={bg === "base"}></div>
        <button
            class="nav-btn" 
            style:opacity={1}
            on:click={() => toggleNavbar(isMenuOpen ? "close" : "menu")} 
            on:keydown={(e) => e.key === 'Enter' && toggleNavbar(isMenuOpen ? "close" : "menu")}
        >
            <p class="nav-text">
                {#if !isMenuOpen}
                    MENU&nbsp;
                {:else}
                    CLOSE
                {/if}
            </p>
        </button>
        <div class="heading">
            <a href="/" on:click|preventDefault={() => goto("/")}>VERDANTIA</a>
        </div>
        <button
            class="cart-btn"
            on:click={() => toggleNavbar("bag")}
            on:keydown={(e) => e.key === 'Enter' && toggleNavbar("bag")}
            class:has-items={basketItems.length > 0}
            >
            <p class="nav-text">BAG</p>
            {#if basketItems.length > 0}
                <span class="item-count-badge">{basketItems.length}</span>
            {/if}
        </button>
        {#if isMenuOpen}
            <div class="menu-content">
                <div class="menu-links">
                    {#each links as link, i}
                        <a 
                            href={link.href} 
                            on:click|preventDefault={() => goto(link.href)}
                            class:active={link.active} 
                            style="animation-delay: {i * 0.2}s; --orange-bg: url('{orange}')">
                            {link.text}
                        </a>
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

            .nav-btn, .cart-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 4px;
                transition: background-color 0.2s ease-in-out;
                position: relative;
                display: flex;
                align-items: center;

                &:hover {
                    background-color: rgba(v.$font-color-dark, 0.05);
                }
            }

            .cart-btn {
                &.has-items {
                    // background-color: rgba(v.$primary, 0.05);
                }
                .nav-text {
                    margin-right: 0.3em;
                }
            }
            
            .item-count-badge {
                background-color: v.$primary;
                color: v.$font-color-light;
                border-radius: 50%;
                padding: 0.15em 0.5em;
                font-size: 0.75rem;
                font-weight: 600;
                line-height: 1;
                position: absolute;
                top: -2px;
                right: -2px;
                min-width: 1.5em;
                text-align: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
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
                background-color: #fbf9f6;
                border: 1px solid rgba(160, 147, 125, 0.5);
                box-shadow: 0 8px 100px rgba(105, 89, 72, 0.15);
                border-radius: 20px;
                z-index: -1;
                transition: transform .3s cubic-bezier(0.16, 1, 0.3, 1),
                            box-shadow .3s cubic-bezier(0.16, 1, 0.3, 1),
                            background-color .3s cubic-bezier(0.16, 1, 0.3, 1);
                transform-origin: center;

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
                }
            }

            .menu-content, .bag-content {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                padding: 2rem;
                z-index: 1;
                display: grid;
                place-items: center;
                height: 200px;
                border-top: 1px solid rgba(160, 147, 125, 0.5);
            }

            .menu-content {
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

            .bag-content {
                opacity: 0;
                
                .bag-preview {
                    width: 100%;
                    
                    h3 {
                        font-family: 'DynaPuff Regular';
                        color: v.$tertiary-dark;
                        margin-bottom: 1rem;
                        text-align: center;
                    }
                    
                    .empty-bag-notice {
                        text-align: center;
                        padding: 1rem 0;
                        
                        p {
                            font-size: 0.9rem;
                            color: #666;
                        }
                    }
                    
                    .bag-items {
                        max-height: 100px;
                        overflow-y: auto;
                        margin-bottom: 1rem;
                        
                        .bag-item {
                            display: flex;
                            justify-content: space-between;
                            padding: 0.5rem 0;
                            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                            
                            .item-name {
                                font-size: 0.9rem;
                            }
                            
                            .item-price {
                                font-weight: bold;
                            }
                        }
                    }
                    
                    .bag-total {
                        display: flex;
                        justify-content: space-between;
                        font-weight: bold;
                        margin: 1rem 0;
                        padding-top: 0.5rem;
                        border-top: 1px solid rgba(0, 0, 0, 0.1);
                    }
                    
                    .checkout-btn {
                        width: 100%;
                        padding: 0.8rem;
                        background-color: v.$tertiary-dark;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 0.9rem;
                        cursor: pointer;
                        transition: background-color 0.3s;
                        
                        &:hover {
                            background-color: darken(v.$tertiary-dark, 10%);
                        }
                    }
                }
            }
        }
    }
</style>