<script lang="ts" context="module">
    export let title = "DESIGNBRIEF 25";
</script>

<main>
    <header>
        <h1>{title}</h1>
    </header>
    <section>
        <slot></slot>
    </section>
    <footer>
        <p>Footer</p>
    </footer>
</main>