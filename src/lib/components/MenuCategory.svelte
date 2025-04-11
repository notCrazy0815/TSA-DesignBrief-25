<script lang="ts">
  import type { MenuItem as MenuItemType } from '$lib/data/menu/types';
  import MenuItemComponent from './MenuItem.svelte';

  export let title: string;
  export let items: MenuItemType[] = [];
</script>

<section class="menu-category">
  <div class="category-header">
    <h2 class="category-title">{title}</h2>
    <div class="title-decoration">
      <span class="dot"></span>
      <span class="line"></span>
      <span class="dot"></span>
    </div>
  </div>

  <div class="menu-items-container">
    {#if items.length === 0}
      <div class="empty-state">
        <p>No items match your selected filters.</p>
      </div>
    {:else}
      {#each items as item, i (item.id)}
        <MenuItemComponent {item} />
      {/each}
    {/if}
  </div>
</section>

<style lang="scss">
  @use "../../lib/styles/variables" as v;

  .menu-category {
    background-color: white;
    border-radius: 8px;
    padding: 40px 30px;
    margin-bottom: 40px;
    box-shadow: 0 4px 16px rgba(106, 89, 72, 0.08);
    
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: 992px) {
      margin-top: 0;
      padding: 30px 25px;
    }
  }

  .category-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .category-title {
    font-family: "DynaPuff Regular", cursive;
    font-size: 2.4rem;
    color: #333;
    margin: 0;
    margin-bottom: 15px;
    letter-spacing: 0.5px;
  }

  .title-decoration {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .line {
      height: 2px;
      width: 60px;
      background-color: v.$tertiary;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: v.$tertiary;
    }
  }

  .menu-items-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;

    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      gap: 10px; // Reduced gap for more compact mobile layout
    }
  }

  .empty-state {
    text-align: center;
    padding: 35px 25px;
    background-color: #fbf9f6;
    border-radius: 8px;
    border: 1px dashed rgba(160, 147, 125, 0.3);
    grid-column: 1 / -1;

    p {
      font-family: "Inter 24pt Regular", sans-serif;
      color: #776a60;
      font-style: italic;
      font-size: 1.1rem;
    }
  }
</style>
