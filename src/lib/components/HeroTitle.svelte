<script lang="ts">
    import { onMount } from 'svelte';
    import gsap from 'gsap';

    export let title: string = "It's simple:\nGood food for everyone.";

    let heroTitleElement: HTMLHeadingElement;

    function getRandomDelay() {
        return Math.random() * 1;
    }
    
    $: letters = title.split("").map(char => ({
        char,
        isSpace: char === " ",
        isNewline: char === "\n",
        delay: getRandomDelay()
    }));

    onMount(() => {
        const tl = gsap.timeline();

        tl.from(heroTitleElement, {
            y: 500,
            duration: 0.7,
            ease: "power2.out",
            opacity: 0
        });

        tl.from('.letter', {
            opacity: 0,
            duration: 0.5,
            stagger: {
                each: 0.02,
                from: "random"
            },
            ease: "power2.out"
        }, "<");

        tl.to(heroTitleElement, {
            y: -150,
            duration: 0.9,
            ease: "power2.inOut"
        }, "+=0.1");

        gsap.fromTo(".hero-title-container p", {
            opacity: 0,
            y: -150
        }, {
            opacity: 1,
            y: -150,
            duration: 0.2,
            ease: "power2.out",
            delay: 2.5
        })
    });
</script>

<div class="hero-title-container">
    <h1 bind:this={heroTitleElement}>
        {#each letters as letter, i}
            {#if letter.isNewline}
                <br />
            {:else if letter.isSpace}
                <span class="space">&nbsp;</span>
            {:else}
                <span class="letter">{letter.char}</span>
            {/if}
        {/each}
    </h1>
    <p>Scroll down</p>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    h1 {
        display: flex;
        flex-wrap: wrap;
        font-size: clamp(1.1rem, 6vw, 3rem);
        line-height: 1;
        gap: 0.1em;
        justify-content: center;
        text-align: center;
        width: 100%;
        padding: 0 10px;
    }

    .letter {
        display: inline-block;
    }

    .space {
        display: inline-block;
        width: 0.3em;
    }

    br {
        width: 100%;
        content: "";
        display: block;
    }

    p {
        font-size: clamp(0.8rem, 1.2vw, 1rem);
        color: v.$font-color-dark;
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        text-align: center;
    }
</style>
