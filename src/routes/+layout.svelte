<script lang="ts">
    // import NavBar from "$lib/components/NavBar.svelte";
</script>

<main>
    <!--<NavBar />-->
    <section>
        <slot></slot>
    </section>
    <!--
    <footer>
        <p>Footer</p>
    </footer>
    -->
</main>

<style lang="scss">
    @use "../lib/styles/variables" as v;
    @use "../lib/styles/global" as g;
</style>