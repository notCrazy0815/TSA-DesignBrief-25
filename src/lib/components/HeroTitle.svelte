<script lang="ts">
    export let title: string = "It's simple:\nGood food for everyone.";

    function getRandomDelay() {
        return Math.random() * 1;
    }
    
    $: letters = title.split("").map(char => ({
        char,
        isSpace: char === " ",
        isNewline: char === "\n",
        delay: getRandomDelay()
    }));
</script>

<h1>
    {#each letters as letter, i}
        {#if letter.isNewline}
            <br style="animation-delay: {letter.delay}s" />
        {:else if letter.isSpace}
            <span class="space" style="animation-delay: {letter.delay}s">&nbsp;</span>
        {:else}
            <span class="letter" style="animation-delay: {letter.delay}s">{letter.char}</span>
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
        animation: moveUp 1s cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards,
                   moveFurtherUp 2s cubic-bezier(0.25, 1, 0.3, 1) forwards 2.2s;
        padding: 0 10px;
    }

    .letter {
        display: inline-block;
        opacity: 0;
        animation: fadeIn 1s cubic-bezier(0.23, 1, 0.320, 1) forwards;
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

    @keyframes moveUp {
        from {
            transform: translateY(500px);
        }
        to {
            transform: translateY(0);
        }
    }

    @keyframes moveFurtherUp {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(-190px);
        }
    }
    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
</style>
