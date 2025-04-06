<script lang="ts">
    import { goto } from "$app/navigation";
    import { shouldAnimate, isLoading } from "$lib/stores/navStore";
    import { gsap } from "gsap";
    import { onMount } from "svelte";

    let heroCtaElement: HTMLDivElement;

    onMount(() => {
        gsap.set(heroCtaElement, { y: "300%" });
        gsap.to(heroCtaElement, {
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            delay: 1.3
        });
    });

    function navigateAndAnimate(href: string) {
        if (window.location.pathname === href) {
            return;
        }

        setTimeout(() => {
            shouldAnimate.set(true);
            isLoading.set(true);
        }, 0);

        setTimeout(() => {
            shouldAnimate.set(false);
            goto(href);
        }, 950);
    }
</script>

<div class="hero-cta" bind:this={heroCtaElement} on:click={() => navigateAndAnimate("/menu")} role="button" tabindex="0" on:keydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
        navigateAndAnimate("/menu");
    }
}}>
    <div class="hero-cta-bg"></div>
    <button class="cta-button">Direct to our menu</button>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .hero-cta {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .hero-cta-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #fff;
            border-radius: 15px;
            cursor: pointer;
            z-index: -1;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);
        }

        &:hover {
            .hero-cta-bg {
                transform: scale(1.1);
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
            }
        }

        .cta-button {
            color: v.$font-color-dark;
            padding: 1.2rem 2.5rem;
            font-size: clamp(0.9rem, 1.2vw, 1.1rem);
            cursor: pointer;
            border: none;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            white-space: nowrap;
            background-color: transparent;
        }
    }
</style>