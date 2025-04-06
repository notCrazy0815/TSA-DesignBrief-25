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
            duration: 1,
            ease: "power2.out",
            opacity: 0
        });

        tl.from('.letter', {
            opacity: 0,
            duration: 0.6,
            stagger: {
                each: 0.05,
                from: "random"
            },
            ease: "power2.out"
        }, "<");

        tl.to(heroTitleElement, {
            y: -150,
            duration: 1,
            ease: "power2.inOut"
        }, "+=0.1");
    });
</script>

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
</style>
