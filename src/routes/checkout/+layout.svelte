<script lang="ts">
    import NavBar from "$lib/components/NavBar.svelte";
</script>

<NavBar active="checkout" bg="base" />

<main>
    <slot />
</main>

<style lang="scss">
    main {
        padding-top: 100px;
        min-height: 100vh;
    }
</style> 