<script lang="ts">
    import flower from "$lib/assets/icons/flower.png";
    import { shouldAnimate, isLoading } from "$lib/stores/navStore";
    import { gsap } from "gsap";

    let titleElement: HTMLElement;
    let imageElement: HTMLElement;
    let loadingScreen: HTMLElement;

    $: if ($isLoading && $shouldAnimate && titleElement && imageElement && loadingScreen) {
        gsap.fromTo(loadingScreen,
            { height: 0 },
            {
                height: "100vh",
                duration: 0.3,
                ease: "power1.in"
            }
        );

        gsap.fromTo(titleElement, 
            { opacity: 0 },
            { 
                opacity: 1,
                duration: 0.3,
                ease: "power2.out",
                delay: 0.3
            }
        );

        gsap.fromTo(imageElement,
            { 
                opacity: 0,
                rotation: 0
            },
            {
                opacity: 1,
                rotation: 360,
                duration: 0.7,
                ease: "power2.out",
                delay: 0.3
            }
        );
    }

    $: if (!$isLoading && loadingScreen) {
        gsap.to(loadingScreen, {
            height: 0,
            duration: 0.3,
            ease: "power1.out"
        });
    }

    $: if ($isLoading && !$shouldAnimate && loadingScreen) {
        loadingScreen.style.height = "100vh";
    }
</script>

<div class="loading-screen" bind:this={loadingScreen}>
    {#if $isLoading}
        <div class="loading-screen-content" class:animate={$shouldAnimate}>
            <h1 bind:this={titleElement}>Verdantia</h1>
            <img src={flower} alt="flower" bind:this={imageElement} />
        </div>
    {/if}
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .loading-screen {
        background-color: v.$secondary;
        position: fixed;
        z-index: 10001;
        width: 100vw;
        height: 0;
        top: 0;
        left: 0;
        overflow: hidden;

        .loading-screen-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
            gap: 2rem;

            h1 {
                font-size: clamp(2rem, 10vw, 4rem);
                font-family: 'DynaPuff Regular';
                color: v.$font-color-light;
                opacity: 0;
            }

            img {
                width: clamp(100px, 20vw, 200px);
                opacity: 0;
            }

            .plant-image {
                width: clamp(150px, 30vw, 300px);
            }

            &:not(.animate) {
                h1,
                img {
                    opacity: 1;
                }
            }
        }
    }
</style>