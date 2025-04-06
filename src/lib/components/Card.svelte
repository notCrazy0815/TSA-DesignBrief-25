<script lang="ts">
  export let card: { id: number; title: string; text: string };
  export let isActive: boolean;
  export let rotation: number;
  export let cardClass: string = "";
  export let onClick: () => void = () => {};
</script>

<button 
  class="card {cardClass}"
  data-id={card.id}
  on:click={onClick}
  aria-pressed={isActive}
  style={!isActive ? `transform: translate3d(-50%, -50%, 0) rotateZ(${rotation}deg)` : ''}
>
  <div class="title">
    <h3>{card.title}</h3>
  </div>
  <div class="text">
    <p>{card.text}</p>
  </div>
  <div class="card-pattern"></div>
</button>

<style lang="scss">
  .card {
    background-color: #fbf9f6;
    cursor: pointer;
    padding: 38px;
    box-sizing: border-box;
    border: none;
    box-shadow: 0 5px 20px rgba(106, 89, 72, 0.08);
    display: grid; 
    grid-template-columns: 40% 60%;
    grid-template-rows: 1fr auto;
    align-items: end;
    align-content: end;
    transform-origin: center center;
    transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1), border 0.3s ease;
    border: 1px solid rgba(160, 147, 125, 0.2);
    border-radius: 12px;
    width: 60vw;
    aspect-ratio: 3/2;
    position: absolute;
    text-align: left;
    overflow: hidden;
    // ...other card-related styles (hover effects, pseudo-elements, etc.)...
  }
</style>
