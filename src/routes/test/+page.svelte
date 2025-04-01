<script lang="ts">
    import { writable } from "svelte/store";
  
    let scrollY = writable(0);
  
    // Function to update scroll position
    function handleScroll(event: Event) {
        const target = event.target as Document;
        scrollY.set(target.documentElement.scrollTop);
    }
</script>
  
<!-- Track scrolling using svelte:window -->
<svelte:window bind:scrollY={$scrollY} on:scroll={handleScroll} />