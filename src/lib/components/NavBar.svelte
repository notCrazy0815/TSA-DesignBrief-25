<script lang="ts">
    import orange from "$lib/assets/icons/orange.png";
    import LoadingScreen from "./LoadingScreen.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { shouldAnimate, firstLoad, isLoading } from "$lib/stores/navStore";
    import { page } from "$app/stores";
    import { gsap } from "gsap";
    import { basket, basketCount } from "$lib/stores/basketStore"; // Warenkorb-Store hinzugefügt
    
    type ActivePage = "approach" | "menu" | "news";
    export let active: ActivePage = "approach";
    export let bg: string = "base";

    let isMenuOpen = false;
    let isBagOpen = false;
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
    
    function toggleBag()   {
        isBagOpen = !isBagOpen;

        if (isBagOpen) {
            gsap.to(".content-box", {
                height: 300,
                duration: 0.5,
                ease: "power2.inOut"
            });
            
            setTimeout(() => {
                const bagLinks = document.querySelectorAll(".menu-content .menu-links a");
                if (bagLinks.length > 0) {
                    gsap.to(bagLinks, {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        stagger: 0.1,
                        ease: "power2.out"
                    });
                }
            }, 300);
        } else {
            const bagLinks = document.querySelectorAll(".menu-content .menu-links a");
            if (bagLinks.length > 0) {
                gsap.to(bagLinks, {
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

    function calculateTotal() {
    return $basket.reduce((total, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return total + (price * item.quantity);
    }, 0).toFixed(2);
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
        <div class="content-box" class:expanded={isMenuOpen || isBagOpen} class:dark={bg === "dark"} class:base={bg === "base"}></div>
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
        <button class="cart-btn" style:opacity={isMenuOpen ? 0 : 1} on:click={toggleBag}>
            <span class="nav-text">Bag</span>
            {#if $basketCount > 0}
                <span class="basket-count">{$basketCount}</span>
            {/if}
        </button>
        {#if isMenuOpen}
            <div class="menu-content">
                <div class="menu-links">
                    {#each links as link, i}
                        <a href={link.href} on:click|preventDefault={() => navigateAndAnimate(link.href)} class:active={link.active} style="animation-delay: {i * 0.2}s; --orange-bg: url('{orange}')">{link.text}</a>
                    {/each}
                </div>
            </div>
        {/if}
        {#if isBagOpen}
            <div class="bag-content">
                <h3 class="bag-title">Your Bag</h3>
                
                {#if $basket.length === 0}
                    <div class="empty-bag">
                        <p>Your bag is empty</p>
                        <button class="browse-menu-btn" on:click={() => {
                            isBagOpen = false;
                            navigateAndAnimate('/menu');
                        }}>Browse Menu</button>
                    </div>
                {:else}
                    <div class="bag-items">
                        {#each $basket as item (item.id)}
                            <div class="bag-item">
                                <div class="item-info">
                                    <h4>{item.name}</h4>
                                    <p class="item-price">{item.price}</p>
                                </div>
                                <div class="item-controls">
                                    <button class="quantity-control" on:click={() => {
                                        if (item.quantity > 1) {
                                            basket.updateItemQuantity(item.id, item.quantity - 1);
                                        } else {
                                            basket.removeFromBasket(item.id);
                                        }
                                    }}>−</button>
                                    <span class="quantity">{item.quantity}</span>
                                    <button class="quantity-control" on:click={() => basket.updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                                    <button class="remove-btn" on:click={() => basket.removeFromBasket(item.id)}>×</button>
                                </div>
                            </div>
                        {/each}
                    </div>
                    
                    <div class="bag-summary">
                        <div class="total">
                            <span>Total:</span>
                            <span>${calculateTotal()}</span>
                        </div>
                        <button class="checkout-btn" on:click={() => {
                            alert('Checkout functionality coming soon!');
                            isBagOpen = false;
                        }}>Checkout</button>
                    </div>
                {/if}
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
                            background-color .3s cubic-bezier(0.16, 1, 0.3, 1),
                            height .5s cubic-bezier(0.22, 1, 0.36, 1);
                transform-origin: center;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
                overflow: hidden;

                &.expanded {
                    border-radius: 20px;
                    height: auto;
                    min-height: 400px;
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

            .cart-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
                display: flex;
                align-items: center;
                gap: 5px;
                position: relative;
                transition: transform 0.2s ease;
                
                &:hover {
                    transform: translateY(-2px);
                }
                
                &:active {
                    transform: translateY(0);
                }
            }

            .basket-count {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background-color: v.$tertiary;
                color: white;
                font-size: 0.75rem;
                font-weight: 600;
                min-width: 20px;
                height: 20px;
                border-radius: 10px;
                padding: 0 4px;
                margin-left: 4px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transform: translateY(-4px);
                animation: pulse 1.5s infinite alternate ease-in-out;
            }
            
            @keyframes pulse {
                0% {
                    transform: translateY(-4px) scale(1);
                }
                100% {
                    transform: translateY(-4px) scale(1.1);
                }
            }

            .bag-content {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                padding: 1.5rem;
                z-index: 1;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                max-height: 300px; 
                overflow-y: auto;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                scrollbar-width: thin;
                scrollbar-color: v.$tertiary rgba(0, 0, 0, 0.05);
                
                &::-webkit-scrollbar {
                    width: 6px;
                }
                
                &::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                
                &::-webkit-scrollbar-thumb {
                    background-color: v.$tertiary;
                    border-radius: 10px;
                }
            }

            .bag-title {
                font-family: 'Inter 24pt Regular';
                font-size: 1.2rem;
                color: v.$tertiary;
                margin: 0;
                text-align: center;
            }

            .empty-bag {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                padding: 1rem 0;
                
                p {
                    font-family: 'Inter 24pt Regular';
                    color: #777;
                }
                
                .browse-menu-btn {
                    background-color: v.$tertiary;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 0.5rem 1rem;
                    font-family: 'Inter 24pt Regular';
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    
                    &:hover {
                        background-color: darken(v.$tertiary, 5%);
                    }
                }
            }

            .bag-items {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .bag-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem;
                background-color: rgba(0, 0, 0, 0.03);
                border-radius: 6px;
                
                .item-info {
                    flex: 1;
                    
                    h4 {
                        margin: 0;
                        font-family: 'Inter 24pt Regular';
                        font-size: 0.95rem;
                        color: #333;
                    }
                    
                    .item-price {
                        margin: 0;
                        font-family: 'Inter 24pt Regular';
                        font-size: 0.85rem;
                        color: v.$tertiary;
                        font-weight: 600;
                    }
                }
                
                .item-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    
                    .quantity-control {
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: white;
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        border-radius: 4px;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        
                        &:hover {
                            background-color: v.$tertiary;
                            color: white;
                        }
                    }
                    
                    .quantity {
                        font-family: 'Inter 24pt Regular';
                        font-size: 0.9rem;
                        min-width: 20px;
                        text-align: center;
                    }
                    
                    .remove-btn {
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: rgba(231, 76, 60, 0.1);
                        color: #e74c3c;
                        border: none;
                        border-radius: 4px;
                        font-size: 1.1rem;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        margin-left: 0.25rem;
                        
                        &:hover {
                            background-color: #e74c3c;
                            color: white;
                        }
                    }
                }
            }

            .bag-summary {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-top: 1rem;
                
                .total {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                    font-family: 'Inter 24pt Regular';
                    font-weight: 600;
                    color: #333;
                }
                
                .checkout-btn {
                    background-color: v.$tertiary;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 0.75rem;
                    font-family: 'Inter 24pt Regular';
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    
                    &:hover {
                        background-color: darken(v.$tertiary, 5%);
                    }
                }
            }
        }
    }
</style>