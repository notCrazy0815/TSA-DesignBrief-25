<script lang="ts">
    import { onMount } from "svelte";

    type PlantNumber = 1 | 2 | 5 | 6 | 7 | 8 | 11;
    export let plantNumber: PlantNumber = 1;
    let imageSrc: string = "";

    export let animationDelay: number = 0;
    let animationIsOver = false;

    onMount(async () => {
        const images = import.meta.glob("/src/lib/assets/branches/*.png", { eager: true });
        imageSrc = (images[`/src/lib/assets/branches/branch_${plantNumber}d.png`] as { default: string }).default;
    
        setTimeout(() => {
            animationIsOver = true;
            console.log("animation is over");
        }, 500 + animationDelay * 1000);
    });
</script>

<div class="vertical-plant">
    {#if imageSrc}
        <img src={imageSrc} alt="Plant branch {plantNumber}" style="animation-delay: {animationDelay}s;" />
    {/if}
</div>

<style lang="scss">
    .vertical-plant {
        width: clamp(100px, 10vw, 200px);

        img {
            width: 150%;
            height: auto;
            translate: -25% 0;
            transition: translate 0.15s ease-in-out, scale 0.15s ease-in-out;
            opacity: 0;
            animation: fadeIn 0.5s ease-in-out forwards;

            &:hover {
                translate: -25% -30px !important;
                scale: 1.1;
            }
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(300px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>