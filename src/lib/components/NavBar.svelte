<script lang="ts">
    import orange from "$lib/assets/icons/orange.png";
    import LoadingScreen from "./LoadingScreen.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { shouldAnimate, firstLoad, isLoading } from "$lib/stores/navStore";
    import { page } from "$app/stores";
    import { gsap } from "gsap";
    import { basket, basketCount } from "$lib/stores/basketStore";
    
    type ActivePage = "approach" | "menu" | "news";
    export let active: ActivePage = "approach";
    export let bg: string = "base";

    let isMenuOpen = false;
    let isBasketOpen = false;
    let isFirstLoad = true;
    let contentElement: HTMLDivElement;
    let isScrolled = false;
    
    // Add handleScroll function that was missing
    function handleScroll() {
        isScrolled = window.scrollY > 50;
    }

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
        if (isMenuOpen) isBasketOpen = false;
    }
    
    function toggleBasket() {
        isBasketOpen = !isBasketOpen;
        if (isBasketOpen) isMenuOpen = false;
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
    
    function removeItem(itemId: number) {
        basket.removeItem(itemId);
    }
    
    function updateItemQuantity(itemId: number, newQuantity: number) {
        if (newQuantity <= 0) {
            removeItem(itemId);
            return;
        }
        
        basket.updateItemQuantity(itemId, newQuantity);
    }
    
    function calculateTotal() {
        return $basket.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    }
    
    function checkout() {
        alert('Checkout feature coming soon!');
        isBasketOpen = false;
    }
</script>

<svelte:window on:scroll={handleScroll} />

<LoadingScreen />

<div class="navbar">
    <div class="content" bind:this={contentElement}>
        <div class="content-box" class:expanded={isMenuOpen || isBasketOpen}></div>
        {#if !isMenuOpen && !isBasketOpen}
            <button class="nav-btn" on:click={toggleMenu} on:keydown={(e) => e.key === 'Enter' && toggleMenu()}>
                <p class="nav-text">MENU</p>
            </button>
        {:else if isMenuOpen}
            <button class="nav-btn close-btn" on:click={toggleMenu} on:keydown={(e) => e.key === 'Enter' && toggleMenu()}>
                <p class="nav-text">CLOSE</p>
            </button>
        {:else if isBasketOpen}
            <button class="nav-btn close-btn" on:click={toggleBasket} on:keydown={(e) => e.key === 'Enter' && toggleBasket()}>
                <p class="nav-text">CLOSE</p>
            </button>
        {/if}
        <div class="heading">
            <a href="/" on:click|preventDefault={() => navigateAndAnimate("/")}>VERDANTIA</a>
        </div>
        <button class="cart-btn" style:opacity={isMenuOpen ? 0 : 1} on:click={toggleBasket}>
            <p class="nav-text">BAG {$basketCount > 0 ? `(${$basketCount})` : ''}</p>
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
        
        {#if isBasketOpen}
            <div class="basket-content">
                <h3 class="basket-title">Your Basket</h3>
                
                {#if $basket.length === 0}
                    <div class="empty-basket">
                        <p>Your basket is empty</p>
                        <button class="browse-menu-btn" on:click={() => {
                            isBasketOpen = false;
                            if (window.location.pathname !== '/menu') {
                                navigateAndAnimate('/menu');
                            }
                        }}>Browse Menu</button>
                    </div>
                {:else}
                    <div class="basket-items">
                        {#each $basket as item (item.id)}
                            <div class="basket-item">
                                <div class="item-info">
                                    <h4>{item.name}</h4>
                                    <p class="item-price">{item.price}</p>
                                </div>
                                <div class="item-controls">
                                    <button class="quantity-btn" on:click={() => updateItemQuantity(item.id, item.quantity - 1)}>−</button>
                                    <span class="quantity">{item.quantity}</span>
                                    <button class="quantity-btn" on:click={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                                    <button class="remove-btn" on:click={() => removeItem(item.id)}>×</button>
                                </div>
                            </div>
                        {/each}
                    </div>
                    
                    <div class="basket-summary">
                        <div class="total">
                            <span>Total:</span>
                            <span>${calculateTotal()}</span>
                        </div>
                        <button class="checkout-btn" on:click={checkout}>Checkout</button>
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
                            background-color .3s cubic-bezier(0.16, 1, 0.3, 1);
                transform-origin: center;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

                &.expanded {
                    height: 430px; /* Increased height to accommodate basket */
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
            
            .basket-content {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                padding: 1.5rem;
                z-index: 1;
                display: flex;
                flex-direction: column;
                height: 330px;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                animation: fadeIn 0.3s ease forwards;
                
                .basket-title {
                    font-family: 'DynaPuff Regular';
                    font-size: 1.5rem;
                    color: v.$tertiary-dark;
                    margin-bottom: 15px;
                    text-align: center;
                }
                
                .empty-basket {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    
                    p {
                        font-family: 'Inter 24pt Regular';
                        font-size: 1rem;
                        color: #777;
                        font-style: italic;
                    }
                    
                    .browse-menu-btn {
                        background-color: v.$tertiary;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 20px;
                        font-family: 'Inter 24pt Regular';
                        cursor: pointer;
                        transition: background-color 0.2s;
                        
                        &:hover {
                            background-color: v.$tertiary-dark;
                        }
                    }
                }
                
                .basket-items {
                    flex: 1;
                    overflow-y: auto;
                    margin-bottom: 15px;
                    
                    &::-webkit-scrollbar {
                        width: 5px;
                    }
                    
                    &::-webkit-scrollbar-track {
                        background: rgba(0,0,0,0.05);
                        border-radius: 10px;
                    }
                    
                    &::-webkit-scrollbar-thumb {
                        background: rgba(0,0,0,0.2);
                        border-radius: 10px;
                    }
                    
                    .basket-item {
                        display: flex;
                        justify-content: space-between;
                        padding: 10px 0;
                        border-bottom: 1px solid rgba(0,0,0,0.05);
                        
                        &:last-child {
                            border-bottom: none;
                        }
                        
                        .item-info {
                            h4 {
                                font-family: 'Inter 24pt Regular';
                                font-size: 0.95rem;
                                font-weight: 500;
                                color: #333;
                                margin: 0 0 4px;
                            }
                            
                            .item-price {
                                font-family: 'Inter 24pt Regular';
                                font-size: 0.9rem;
                                color: v.$tertiary;
                                margin: 0;
                            }
                        }
                        
                        .item-controls {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            
                            .quantity-btn {
                                background: none;
                                border: 1px solid rgba(0,0,0,0.1);
                                width: 24px;
                                height: 24px;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 1rem;
                                cursor: pointer;
                                padding: 0;
                                color: #555;
                                
                                &:hover {
                                    background-color: rgba(0,0,0,0.05);
                                }
                            }
                            
                            .quantity {
                                font-family: 'Inter 24pt Regular';
                                font-size: 0.9rem;
                                min-width: 22px;
                                text-align: center;
                            }
                            
                            .remove-btn {
                                background: none;
                                border: none;
                                color: #c00;
                                font-size: 1.1rem;
                                cursor: pointer;
                                padding: 0 0 0 5px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                
                                &:hover {
                                    color: darken(#c00, 10%);
                                }
                            }
                        }
                    }
                }
                
                .basket-summary {
                    padding-top: 10px;
                    border-top: 1px solid rgba(0,0,0,0.1);
                    
                    .total {
                        display: flex;
                        justify-content: space-between;
                        font-family: 'Inter 24pt Regular';
                        font-size: 1.1rem;
                        font-weight: 500;
                        margin-bottom: 15px;
                    }
                    
                    .checkout-btn {
                        width: 100%;
                        background-color: v.$tertiary;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 25px;
                        font-family: 'Inter 24pt Regular';
                        font-size: 1rem;
                        cursor: pointer;
                        transition: background-color 0.2s;
                        
                        &:hover {
                            background-color: v.$tertiary-dark;
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
                position: relative;
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
</style>