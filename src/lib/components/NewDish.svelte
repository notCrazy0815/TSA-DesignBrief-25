<script lang="ts">
  export let dish: {
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
  };
</script>

<div class="dish-card">
  <div class="image-placeholder">
    {#if dish.imageUrl}
    <img src={dish.imageUrl} alt={dish.title} />
    {:else}
    <div class="dish-image">{dish.title[0]}</div>
    {/if}
  </div>

  <div class="dish-content">
    <h3>{dish.title}</h3>
    <p>{dish.description}</p>

    <div class="tags">
      {#each dish.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  @use "../styles/variables.scss" as v;

  .dish-card {
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
  }

  .image-placeholder {
    background-color: v.$quaternary;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .dish-image {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      color: white;
      font-family: "DynaPuff Regular";
      width: 100%;
      height: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .dish-content {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;

    h3 {
      color: v.$tertiary-dark;
      font-family: "DynaPuff Regular";
      margin-bottom: 0.75rem;
      font-size: 1.4rem;
    }

    p {
      color: v.$font-color-dark;
      line-height: 1.5;
      margin-bottom: 1rem;
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;

    .tag {
      background-color: v.$tertiary-light-low-opacity;
      color: v.$tertiary-dark;
      font-size: 0.8rem;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      text-transform: uppercase;

      &:first-child {
        background-color: v.$primary;
        color: white;
      }
    }
  }
</style>
