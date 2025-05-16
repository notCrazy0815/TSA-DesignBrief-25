<script lang="ts">
    import { goto } from "$app/navigation";
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
</script>

<div class="hero-cta" bind:this={heroCtaElement} on:click={() => goto("/menu")} role="button" tabindex="0" on:keydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
        goto("/menu");
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
        z-index: 2;

        .hero-cta-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #fbf9f6;
            border: 1px solid rgba(160, 147, 125, 0.5);
            box-shadow: 0 8px 100px rgba(105, 89, 72, 0.15);
            border-radius: 15px;
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 2;
        }

        &:hover {
            .hero-cta-bg {
                transform: scale(1.1);
                box-shadow: 0 8px 100px rgba(105, 89, 72, 0.25);
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
            z-index: 3;
        }
    }
</style>