<script lang="ts">
    import branch1d from "$lib/assets/branches/branch_1d.png";
    import branch7d from "$lib/assets/branches/branch_7d.png";
    import branch8d from "$lib/assets/branches/branch_8d.png";
    import { onMount } from 'svelte';
    import gsap from 'gsap';

    onMount(() => {
        const smallPlants = document.querySelectorAll('.plant-small');
        const bigPlant = document.querySelector('.plant-big');

        gsap.set([smallPlants, bigPlant], {
            y: window.innerHeight,
            scale: 0.8
        });

        const tl = gsap.timeline({
            delay: 2.3
        });

        // Animate big plant
        tl.to(bigPlant, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.4,
            ease: "power2.out"
        });

        tl.to(smallPlants, {
            y: 0,
            scale: 1,
            opacity: 0.6,
            duration: 1.2,
            ease: "power2.out",
            stagger: 0.1
        }, "-=1");
    });
</script>

<div class="hero-plants">
    <div class="plant plant-small">
        <img src={branch1d} alt="branch 1d" />
    </div>
    <div class="plant plant-big">
        <img src={branch7d} alt="branch 7d" />
    </div>
    <div class="plant plant-small">
        <img src={branch8d} alt="branch 8d" />
    </div>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .hero-plants {
        display: flex;
        justify-content: center;
        align-items: end;
        opacity: 0.9;
        width: clamp(350px, 90%, 950px);
        height: 100%;
        overflow: hidden;

        .plant-small {
            width: 35%;
            opacity: 0;
        }

        .plant-big {
            width: 50%;
            opacity: 0;
        }

        .plant {
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                transform: translateY(5px);
            }

            &:nth-child(1) {
                margin-right: -20%;
                z-index: 1;
            }

            &:nth-child(2) {
                z-index: 2;
            }

            &:nth-child(3) {
                margin-left: -20%;
                z-index: 1;
            }
        }
    }
</style>