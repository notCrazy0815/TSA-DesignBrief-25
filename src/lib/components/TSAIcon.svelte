<script lang="ts">
    import { goto } from '$app/navigation';
    import TSALogo from '$lib/assets/icons/TSA_logo.png';
    import gsap from 'gsap';
    import { onMount } from 'svelte';

    onMount(() => {
        const icon = document.querySelector(".img-wrapper");

        gsap.fromTo(icon, {
                duration: 0.5,
                x: 100,
                ease: "back.out(1.7)",
            }, {
                x: 0,
                ease: "back.out(1.7)",
                delay: 1
            }
        );

        icon?.addEventListener("mouseenter", () => {
            gsap.to(icon, {
                scale: 1.1,
                duration: 0.3,
                ease: "back.out(1.7)",
            });
        });

        icon?.addEventListener("mouseleave", () => {
            gsap.to(icon, {
                scale: 1,
                duration: 0.3,
                ease: "back.out(1.7)",
            });
        });
    });
</script>

<a href="references" class="img-wrapper" on:click={() => goto("/references")} role="button" tabindex="0" on:keydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
        goto("/references");
    }
}}>
    <img src={TSALogo} alt="TSA Logo" />
</a>

<style lang="scss">
    .img-wrapper {
        position: fixed;
        bottom: 2rem;
        right: 2rem;

        width: clamp(50px, 6.5vh, 90px);
        aspect-ratio: 1/1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid rgba(160, 147, 125, 0.5);
        box-shadow: 0 8px 100px rgba(105, 89, 72, 0.15);
        cursor: pointer;
        z-index: 10;

        img {
            width: 75%;
            height: auto;
            object-fit: contain;
        }
    }
</style>