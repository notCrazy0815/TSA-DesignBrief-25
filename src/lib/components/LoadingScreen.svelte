<script lang="ts">
    import flower from "$lib/assets/icons/flower.png";
    import { shouldAnimate, isFirstLoad } from "$lib/stores/navStore";
    import { page } from "$app/stores";
    export let isLoading: boolean = true;

    if ($isFirstLoad && $page.url.pathname === "/") {
        isLoading = false;
        setTimeout(() => {
            isFirstLoad.set(false);
        }, 500);
    } else {
        setTimeout(() => {
            isLoading = false;
            if ($isFirstLoad) {
                isFirstLoad.set(false);
            }
        }, 2000);
    }
</script>

{#if !($isFirstLoad && $page.url.pathname === "/")}
    <div class="loading-screen" class:active={isLoading} class:unactive={!isLoading} class:first-load={$isFirstLoad}>
        {#if isLoading}
            <div class="loading-screen-content" class:animate={$shouldAnimate}>
                <h1>Verdantia</h1>
                <img src={flower} alt="flower" />
            </div>
        {/if}
    </div>
{/if}

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g; 

    .loading-screen {
        background-color: v.$secondary;
        position: fixed;
        z-index: 10001;
        width: 100vw;
        transition: height 1s cubic-bezier(0.16, 1, 0.3, 1);
        height: 0;

        top: 0;
        left: 0;

        &.active {
            height: 100vh;
            opacity: 1;
        }

        &.unactive {
            height: 0;
            opacity: 1;
        }

        &.first-load {
            opacity: 0;
        }

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
                animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                animation-delay: 0.2s;
            }

            img {
                width: clamp(100px, 20vw, 200px);
                opacity: 0;
                animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards,
                    rotate 0.7s cubic-bezier(.3,.62,.18,1) forwards;
                animation-delay: 0.4s;
            }

            &:not(.animate) {
                h1, img {
                    opacity: 1;
                    animation: none;
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

            @keyframes rotate {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
        }
    }
</style>