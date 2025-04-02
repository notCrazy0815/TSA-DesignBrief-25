<script>
  import { onMount } from "svelte";
  import NavBar from "$lib/components/NavBar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  // Menü-Karten als einfaches Array
  const cards = [
    { id: 1, title: "Appetizers", text: "Kick off your culinary journey with our delightful plant-based appetizers, featuring fresh, innovative bites that tease your taste buds with vibrant flavors and sustainable ingredients." },
    { id: 2, title: "Main", text: "Enjoy exquisite vegan and vegetarian main courses crafted with passion and precision. Our mains blend traditional flavors with modern twists, using farm-fresh produce to create memorable plant-based dishes." },
    { id: 3, title: "Drinks", text: "Refresh yourself with our curated selection of organic, plant-based beverages and handcrafted cocktails. From fruit-infused creations to botanical blends, each sip complements your sustainable dining experience." },
    { id: 4, title: "Desserts", text: "End your dining experience on a sweet note with our decadent vegan desserts. Classic indulgence meets modern creativity with plant-based ingredients that prove sustainable eating never compromises on taste." }
  ];

  // Menü-Elemente nach Kategorie
  const menuItems = {
    1: [ // Appetizers
      { id: 101, name: "Crispy Cauliflower Bites", price: 9.95, description: "Lightly battered cauliflower with sweet chili glaze", allergens: ["Gluten", "Soy"], tags: ["Vegan", "Spicy"], hasDetails: true },
      { id: 102, name: "Avocado & Mango Spring Rolls", price: 10.50, description: "Fresh avocado and mango wrapped in rice paper", allergens: ["Nuts"], tags: ["Vegan", "Gluten-Free"], hasDetails: true },
      { id: 103, name: "Wild Mushroom Bruschetta", price: 11.25, description: "Toasted artisan bread topped with seasonal mushrooms", allergens: ["Gluten"], tags: ["Vegetarian"], hasDetails: true },
      { id: 104, name: "Seasonal Soup", price: 7.95, description: "Farm-fresh vegetables in a rich broth", allergens: [], tags: ["Vegan", "Gluten-Free", "Seasonal"], hasDetails: false },
      { id: 105, name: "Roasted Beet Carpaccio", price: 12.50, description: "Thinly sliced beets with cashew cream", allergens: ["Nuts"], tags: ["Vegan", "Gluten-Free"], hasDetails: true }
    ],
    2: [ // Main
      { id: 201, name: "Plant-Based Burger", price: 15.95, description: "House-made patty with all the fixings", allergens: ["Gluten", "Soy"], tags: ["Vegan"], hasDetails: true },
      { id: 202, name: "Wild Mushroom Risotto", price: 17.50, description: "Creamy arborio rice with seasonal mushrooms", allergens: ["Dairy"], tags: ["Vegetarian", "Gluten-Free"], hasDetails: true },
      { id: 203, name: "Roasted Vegetable Tart", price: 16.25, description: "Seasonal vegetables in a flaky pastry shell", allergens: ["Gluten"], tags: ["Vegetarian"], hasDetails: true },
      { id: 204, name: "Jackfruit Tacos", price: 14.95, description: "Pulled jackfruit with avocado cream", allergens: ["Gluten"], tags: ["Vegan"], hasDetails: false },
      { id: 205, name: "Eggplant Parmesan", price: 18.50, description: "Layers of eggplant with cashew mozzarella", allergens: ["Nuts", "Gluten"], tags: ["Vegan"], hasDetails: true }
    ],
    3: [ // Drinks
      { id: 301, name: "Berry Kombucha Spritz", price: 7.95, description: "House-fermented kombucha with seasonal berries", allergens: [], tags: ["Non-Alcoholic", "Probiotic"], hasDetails: true },
      { id: 302, name: "Cucumber Mint Refresher", price: 6.50, description: "Fresh cucumber, mint and lime juice", allergens: [], tags: ["Non-Alcoholic"], hasDetails: false },
      { id: 303, name: "Botanical Gin & Tonic", price: 12.25, description: "Local gin with house-made tonic", allergens: [], tags: ["Contains Alcohol"], hasDetails: true },
      { id: 304, name: "Sustainable Wine Selection", price: 10.95, description: "Glass of organic, biodynamic wine", allergens: ["Sulfites"], tags: ["Contains Alcohol"], hasDetails: true },
      { id: 305, name: "Golden Turmeric Latte", price: 5.50, description: "Plant milk with turmeric, ginger, and cinnamon", allergens: ["Nuts"], tags: ["Non-Alcoholic"], hasDetails: false }
    ],
    4: [ // Desserts
      { id: 401, name: "Seasonal Fruit Crumble", price: 8.95, description: "Warm seasonal fruit with oat and pecan topping", allergens: ["Nuts", "Gluten"], tags: ["Vegan"], hasDetails: true },
      { id: 402, name: "Dark Chocolate Avocado Mousse", price: 9.50, description: "Silky chocolate mousse with avocado base", allergens: [], tags: ["Vegan", "Gluten-Free"], hasDetails: true },
      { id: 403, name: "Plant-Based Cheesecake", price: 10.25, description: "Cashew-based cheesecake with berry compote", allergens: ["Nuts"], tags: ["Vegan", "Gluten-Free"], hasDetails: true },
      { id: 404, name: "Chai-Spiced Rice Pudding", price: 7.95, description: "Coconut milk rice pudding with chai spices", allergens: [], tags: ["Vegan", "Gluten-Free"], hasDetails: false },
      { id: 405, name: "Assorted Cookie Plate", price: 6.50, description: "Selection of house-made cookies", allergens: ["Gluten", "Nuts"], tags: ["Vegan"], hasDetails: true }
    ]
  };
  
  // Grundlegende Rotation für die Karten
  const cardRotations = [-5, 4, 10, -6];
  
  // Aktiver Zustand
  let activeCardId = null;
  let cardsContainer;
  let activeMenuItem = null;
  let showModal = false;
  
  // Karte öffnen
  function openCard(cardId) {
    activeCardId = activeCardId === cardId ? null : cardId;
    
    // Container-Höhe anpassen, wenn eine Karte geöffnet ist
    if (activeCardId !== null) {
      setTimeout(() => {
    const activeCardElement = document.querySelector('.card.active');
        if (activeCardElement && cardsContainer) {
          const cardHeight = activeCardElement.offsetHeight;
          cardsContainer.style.height = `${cardHeight + 40}px`;
          
          // Zum aktiven Element scrollen
          const rect = cardsContainer.getBoundingClientRect();
          const topPos = window.scrollY + rect.top;
      window.scrollTo({ 
            top: topPos,
        behavior: 'smooth' 
      });
    }
      }, 50);
      } else {
      // Container-Höhe zurücksetzen, wenn keine Karte geöffnet ist
      resetContainerHeight();
      // Modal schließen, wenn Karte geschlossen wird
      showModal = false;
      activeMenuItem = null;
    }
  }
  
  // Container-Höhe zurücksetzen
  function resetContainerHeight() {
    if (cardsContainer) {
    if (window.innerWidth < 768) {
        const mobileHeight = cards.length * 200; // Approximation für mobile Höhe
        cardsContainer.style.height = `${mobileHeight}px`;
    } else {
        cardsContainer.style.height = '80vw';
      }
    }
  }
  
  // Gibt die Rotation für eine Karte zurück
  function getRotation(index) {
    return cardRotations[index % cardRotations.length];
  }
  
  // Gibt CSS-Klassen für eine Karte zurück
  function getCardClasses(cardId) {
    return activeCardId === null ? '' : 
           activeCardId === cardId ? 'active' : 
           'fly-out';
  }
  
  // Menüelement-Detail Modal öffnen
  function openMenuItemModal(item) {
    activeMenuItem = item;
    showModal = true;
  }
  
  // Modal schließen
  function closeModal() {
    showModal = false;
      setTimeout(() => {
      activeMenuItem = null;
    }, 300); // Warten auf Fade-Out-Animation
  }
  
  // Initialisieren der Kartenansicht
  onMount(() => {
    cardsContainer = document.querySelector('.menu-category-cards');
    resetContainerHeight();
    
    // Event-Listener für Bildschirmgrößenänderungen
    window.addEventListener('resize', resetContainerHeight);
    
    return () => {
      window.removeEventListener('resize', resetContainerHeight);
    };
  });
</script>

<svelte:window on:resize={() => activeCardId === null && resetContainerHeight()}/>

<NavBar active="menu" />

<main>
  <section id="menu-categories">
    <div class="section-header">
      <h2 class="title-font">Our Seasonal Menu</h2>
      <p class="subtitle">Featuring locally-sourced produce and sustainable ingredients</p>
      <div class="decorative-element">
        <span class="line"></span>
        <span class="icon">✧</span>
        <span class="line"></span>
      </div>
    </div>
    
    <div class="menu-category-cards {activeCardId !== null ? 'with-active-card' : ''}" bind:this={cardsContainer}>
      {#each cards as card, i (card.id)}
        <button 
          class="card {getCardClasses(card.id)}"
          data-id={card.id}
          on:click={() => openCard(card.id)}
          aria-pressed={activeCardId === card.id}
          style={activeCardId === null ? `transform: translate3d(-50%, -50%, 0) rotateZ(${getRotation(i)}deg)` : ''}
        >
          <div class="title">
            <h3>{card.title}</h3>
          </div>
          <div class="text">
            <p>{card.text}</p>
          </div>
          <div class="click-me">View menu</div>
        </button>
      {/each}
    </div>
    
    {#if activeCardId !== null}
      <div class="scroll-down-elegant">
        <span class="arrow-elegant"></span>
        <span class="hint-elegant">View Selections</span>
      </div>
      
      <div class="menu-items-container">
        <div class="menu-items-header">
          <h3>{cards.find(c => c.id === activeCardId)?.title || ''}</h3>
          <p class="menu-items-description">All dishes are prepared with sustainable, locally-sourced ingredients</p>
        </div>
        
        <div class="menu-items-list">
          {#if menuItems[activeCardId]}
            {#each menuItems[activeCardId] as item}
              <div 
                class="menu-item {item.hasDetails ? 'has-details' : ''}"
                on:click={() => item.hasDetails && openMenuItemModal(item)}
                role={item.hasDetails ? "button" : ""}
                tabindex={item.hasDetails ? "0" : ""}
                on:keydown={(e) => item.hasDetails && e.key === 'Enter' && openMenuItemModal(item)}
                aria-label={item.hasDetails ? `View details for ${item.name}` : ""}
              >
                <div class="menu-item-header">
                  <h4 class="menu-item-name">{item.name}</h4>
                  <span class="menu-item-price">${item.price.toFixed(2)}</span>
                </div>
                
                <p class="menu-item-description">{item.description}</p>
                
                <div class="menu-item-footer">
                  <div class="menu-item-tags">
                    {#each item.tags as tag}
                      <span class="tag {tag.toLowerCase().replace(' ', '-')}">{tag}</span>
                    {/each}
                    
                    {#if item.allergens.length > 0}
                      <div class="allergen-info">
                        <span class="allergen-label">Contains:</span>
                        {#each item.allergens as allergen, i}
                          <span class="allergen">{allergen}{i < item.allergens.length - 1 ? ', ' : ''}</span>
                        {/each}
                      </div>
                    {/if}
                  </div>
                  
                  {#if item.hasDetails}
                    <div class="view-details-hint">
                      <span class="details-text">Details</span>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
            
            <div class="menu-legend">
              <span class="legend-item" data-symbol="V">Vegan</span>
              <span class="legend-item" data-symbol="VG">Vegetarian</span>
              <span class="legend-item" data-symbol="GF">Gluten-Free</span>
              <span class="legend-item" data-symbol="A">Contains Alcohol</span>
              <span class="legend-item" data-symbol="*">Item has additional details available</span>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </section>
</main>

<!-- Modal für Menüelement-Details -->
{#if showModal}
  <div class="menu-modal-backdrop" on:click|self={closeModal} aria-hidden={!showModal}>
    <div class="menu-modal" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <button class="close-modal-button" on:click={closeModal} aria-label="Close modal">×</button>
      
      <div class="modal-header">
        <h3 id="modal-title">{activeMenuItem?.name || ''}</h3>
        <span class="modal-price">${activeMenuItem?.price.toFixed(2) || ''}</span>
      </div>
        
      <div class="modal-content">
        <!-- Hier kommt später der eigentliche Modal-Inhalt -->
        <p>Modal-Inhalt wird später hinzugefügt.</p>
      </div>
    </div>
  </div>
{/if}

<Footer />

<style lang="scss">
  @use "../../lib/styles/variables" as v;
  
  main {
    width: 100%;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 60px;
    
    h2 {
      font-size: 3rem;
      font-weight: 500;
      color: #4a3c31;
      margin-bottom: 10px;
      letter-spacing: 1px;
      font-family: "DynaPuff Regular", cursive;
    }
  }
  
  .title-font {
    font-family: "DynaPuff Regular", cursive;
    text-transform: none;
    position: relative;
    display: inline-block;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #695a4e;
    font-weight: 300;
    margin-top: 0.5rem;
    font-style: italic;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .decorative-element {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto;
    max-width: 300px;
    
    .line {
      height: 1px;
      background-color: #a0937d;
      flex-grow: 1;
      opacity: 0.6;
    }
    
    .icon {
      font-size: 1rem;
      color: #a0937d;
      margin: 0 15px;
    }
  }

  section#menu-categories {
    padding: 80px 0;
    background-color: v.$background-color-light;
    position: relative;
    overflow: clip;
    z-index: 1;
  }

  .menu-category-cards {
    position: relative;
    height: 80vw;
    transition: height 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    margin-bottom: 0;
    overflow: visible;
    min-height: 0;
    will-change: height;
    box-sizing: border-box !important;
  }
  
  .card {
    background-color: #fbf9f6;
    cursor: pointer;
    padding: 38px;
    box-sizing: border-box;
    border: none;
    box-shadow: 0 5px 20px rgba(106, 89, 72, 0.08);
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    transform-origin: center center;
    transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    border: 1px solid rgba(160, 147, 125, 0.2);
    border-radius: 0;
    width: 60vw;
    height: calc(60vw * 2/3);
    position: absolute;
    text-align: left;
    
    &:hover, &:focus {
      box-shadow: 0 10px 25px rgba(106, 89, 72, 0.15);
      transform: translate3d(-50%, -55%, 0) rotateZ(0.5deg) !important;
      transition: all 0.3s ease;
      outline: none;
      
      .click-me {
        background-color: #8c7b6b;
        transform: scale(1.05);
      }
    }
    
    .title {
      width: 40%;
      
      h3 {
        font-size: clamp(2.5rem, 5vw, 4rem);
        letter-spacing: 0.5px;
        font-family: "DynaPuff Regular", cursive;
        color: #4a3c31;
      }
    }
    
    .text {
      width: 55%;
      
      p {
        font-weight: 300;
        font-size: clamp(1rem, 1.2vw, 1.25rem);
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        transition: all 650ms ease;
        color: transparent;
        backdrop-filter: blur(4px);
        line-height: 1.7;
        font-family: "Inter 24pt Regular", sans-serif;
      }
    }
    
    &.active .text p {
      text-shadow: none;
      color: #4a3c31;
      backdrop-filter: none;
    }

    &.fly-out {
      opacity: 0;
      pointer-events: none;
      transform: translateX(100vw) !important;
    }

    &.active {
      z-index: 10;
      left: 50% !important;
      top: 50% !important;
      transform: translate3d(-50%, -50%, 0) rotateZ(0deg) !important;
      width: 60vw;
      min-height: 40vw;
      max-width: 1200px;
    }
  }
  
  .click-me {
    position: absolute;
    top: 28px;
    right: 28px;
    background-color: #a0937d;
    color: white;
    padding: 10px 16px;
    border-radius: 0;
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: "Inter 24pt Regular", sans-serif;
    
    &::after {
      content: "→";
      margin-left: 8px;
      font-size: 1.1em;
    }
  }

  /* Desktop-Positionierung */
  .menu-category-cards .card:nth-child(1) {
    left: 33%;
    top: 25vw;
    z-index: 4;
  }
  
  .menu-category-cards .card:nth-child(2) {
    left: 67%;
    top: 35vw;
    z-index: 3;
  }
  
  .menu-category-cards .card:nth-child(3) {
    left: 33%;
    top: 45vw;
    z-index: 2;
  }
  
  .menu-category-cards .card:nth-child(4) {
    left: 67%;
    top: 55vw;
    z-index: 1;
  }

  .scroll-down-elegant {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 1;
    margin-top: 30px;
    transition: all 0.3s ease-out;
    
    .arrow-elegant {
      display: block;
      width: 20px;
      height: 20px;
      border-left: 2px solid v.$tertiary;
      border-bottom: 2px solid v.$tertiary;
      transform: rotate(-45deg);
      animation: bounce 2s infinite;
      margin-bottom: 12px;
      filter: drop-shadow(0 2px 3px rgba(2, 92, 72, 0.1));
    }
    
    .hint-elegant {
      font-size: 0.9rem;
      color: v.$tertiary-dark;
      font-weight: 500;
      letter-spacing: 0.5px;
      font-style: italic;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  /* Menu Items Container */
  .menu-items-container {
    max-width: 1000px;
    margin: 60px auto 0;
    padding: 40px;
    background-color: #fbf9f6;
    border: 1px solid #d3c7b6;
    box-shadow: 0 5px 20px rgba(106, 89, 72, 0.08);
    position: relative;
    
    &::before {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      border: 1px solid rgba(160, 147, 125, 0.2);
      pointer-events: none;
    }
    
    .menu-items-header {
      text-align: center;
      margin-bottom: 40px;
      position: relative;
      
      &::after {
        content: "";
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 1px;
        background-color: #a0937d;
      }
      
      h3 {
        font-family: "DynaPuff Regular", cursive;
        font-size: 2.2rem;
        color: #4a3c31;
        margin-bottom: 10px;
      }
      
      .menu-items-description {
        font-size: 1rem;
        color: #695a4e;
        font-style: italic;
        font-family: "Inter 24pt Regular", sans-serif;
      }
    }
    
    .menu-items-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 30px;
    }
    
    .menu-item {
      padding: 0 0 25px;
      transition: all 0.3s ease;
      position: relative;
      border-bottom: 1px dashed rgba(160, 147, 125, 0.3);
      
      &:hover {
        background-color: rgba(160, 147, 125, 0.05);
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(106, 89, 72, 0.08);
        padding-left: 10px;
        padding-right: 10px;
      }
      
      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
      
      &.has-details {
        position: relative;
        cursor: pointer;
        
        .menu-item-name::after {
          content: "*";
          color: #a0937d;
          margin-left: 5px;
          font-size: 1.2em;
        }
      }
      
      .menu-item-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 10px;
        
        .menu-item-name {
          font-family: "DynaPuff Regular", cursive;
          font-size: 1.3rem;
          color: #4a3c31;
          margin: 0;
        }
        
        .menu-item-price {
          font-family: "Inter 24pt Regular", sans-serif;
          font-weight: 600;
          font-size: 1.2rem;
          color: #695a4e;
          white-space: nowrap;
          margin-left: 15px;
        }
      }
      
      .menu-item-description {
        color: #695a4e;
        font-size: 0.95rem;
        line-height: 1.5;
        margin-bottom: 15px;
        font-family: "Inter 24pt Regular", sans-serif;
        font-style: italic;
      }

      .menu-item-footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        
        .menu-item-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          
          .tag {
            display: inline-block;
            padding: 0;
            font-size: 0.75rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            font-family: "Inter 24pt Regular", sans-serif;
            color: #8c7b6b;
            
            &.vegan::before {
              content: "V";
              display: inline-block;
              margin-right: 3px;
              font-weight: bold;
            }
            
            &.vegetarian::before {
              content: "VG";
              display: inline-block;
              margin-right: 3px;
              font-weight: bold;
            }
            
            &.gluten-free::before {
              content: "GF";
              display: inline-block;
              margin-right: 3px;
              font-weight: bold;
            }
            
            &.contains-alcohol::before {
              content: "A";
              display: inline-block;
              margin-right: 3px;
              font-weight: bold;
            }
          }
        }
        
        .allergen-info {
          margin-top: 6px;
          font-size: 0.75rem;
          color: #8c7b6b;
          font-family: "Inter 24pt Regular", sans-serif;
          
          .allergen-label {
            font-weight: 600;
            margin-right: 4px;
          }
          
          .allergen {
            font-style: italic;
          }
        }
        
        .view-details-hint {
          background-color: transparent;
          border: 1px solid #a0937d;
          color: #8c7b6b;
          border-radius: 0;
          padding: 5px 10px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
          font-family: "Inter 24pt Regular", sans-serif;
          
          .details-text {
            font-weight: 500;
          }
          
          &::after {
            content: "→";
            margin-left: 6px;
            font-size: 1.1em;
          }
        }
      }
      
      &.has-details:hover .view-details-hint {
        background-color: #a0937d;
        color: white;
      }
    }
    
    /* Legende am Ende der Speisekarte */
    .menu-legend {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(160, 147, 125, 0.3);
      font-size: 0.75rem;
      color: #8c7b6b;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      justify-content: center;
      
      .legend-item {
        display: flex;
        align-items: center;
        
        &::before {
          content: attr(data-symbol);
          margin-right: 5px;
          font-weight: bold;
        }
      }
    }
  }
  
  /* Modal Styles */
  .menu-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(5px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .menu-modal {
    background-color: #fbf9f6;
    border-radius: 0;
    width: 100%;
    max-width: 600px;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: modal-appear 0.3s ease-out;
    border: 1px solid #d3c7b6;
    
    @keyframes modal-appear {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .close-modal-button {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 30px;
      height: 30px;
      background-color: transparent;
      border: 1px solid #a0937d;
      border-radius: 0;
      font-size: 1.5rem;
      line-height: 1;
      color: #8c7b6b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      z-index: 10;
        
      &:hover {
        background-color: #a0937d;
        color: white;
      }
    }
    
    .modal-header {
      padding: 25px 25px 15px;
      border-bottom: 1px solid rgba(160, 147, 125, 0.3);
      position: relative;
      
      h3 {
        font-family: "DynaPuff Regular", cursive;
        font-size: 1.8rem;
        color: #4a3c31;
        margin: 0 0 10px;
        padding-right: 40px;
      }
      
      .modal-price {
        position: absolute;
        top: 25px;
        right: 25px;
        background-color: #a0937d;
        color: white;
        padding: 5px 12px;
        border-radius: 0;
        font-weight: 600;
        font-family: "Inter 24pt Regular", sans-serif;
      }
    }
    
    .modal-content {
      padding: 25px;
      color: #695a4e;
      font-family: "Inter 24pt Regular", sans-serif;
      
      p {
        line-height: 1.6;
      }
    }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: rotate(-45deg) translateY(0);
    }
    40% {
      transform: rotate(-45deg) translateY(-10px);
    }
    60% {
      transform: rotate(-45deg) translateY(-5px);
    }
  }
  
  /* Responsive Styles */
  @media screen and (max-width: 1200px) {
    .card .title h3 {
      font-size: clamp(2rem, 4vw, 3.5rem);
    }
    
    .card .text p {
      font-size: clamp(0.9rem, 1vw, 1.1rem);
    }
    
    .menu-items-container {
      max-width: 90%;
    }
  }
  
  @media screen and (max-width: 900px) {
    .card {
      padding: 30px;
    }
    
    .click-me {
      top: 20px;
      right: 20px;
      padding: 8px 14px;
      font-size: 0.9rem;
    }
  }

  /* Mobile Ansicht */
  @media screen and (max-width: 767px) {
    .menu-category-cards {
      min-height: 300px;
      transition: height 0.3s ease;
    }
    
    .card {
      width: 90vw !important;
      height: calc(90vw * 2/3) !important;
      flex-direction: column !important;
      align-items: flex-start;
      position: absolute;
      left: 50% !important;
      pointer-events: auto;
    }
    
    .card .title {
      width: 100% !important;
      margin-bottom: 15px;
      
      h3 {
        font-size: 2rem !important;
      }
    }
    
    .card .text {
      width: 100% !important;
      
      p {
        font-size: 3vw !important;
      }
    }
    
    /* Mobile-Positionierung */
    .menu-category-cards .card:nth-child(1) {
      left: 50% !important;
      top: 20vw;
      z-index: 4;
    }
    
    .menu-category-cards .card:nth-child(2) {
      top: calc(20vw + 30vw + 30px);
      left: 50% !important;
      z-index: 3;
    }
    
    .menu-category-cards .card:nth-child(3) {
      top: calc(20vw + 60vw + 60px);
      left: 50% !important;
      z-index: 2;
    }
    
    .menu-category-cards .card:nth-child(4) {
      top: calc(20vw + 90vw + 90px);
      left: 50% !important;
      z-index: 1;
    }
    
    .card.active {
      height: auto !important;
      min-height: 60vw !important;
      top: 0 !important;
      transform: translate3d(-50%, 0, 0) rotateZ(0deg) !important;
      position: relative !important;
    }
    
    .menu-item .menu-item-footer {
      flex-direction: column;
      gap: 15px;
      align-items: flex-start;
    }
    
    .menu-modal {
      max-height: 90vh;
    }
    
    .menu-items-container {
      padding: 20px;
    }
  }

  /* Kleinere Mobile Ansicht */
  @media screen and (max-width: 600px) {
    .section-header h2 {
        font-size: 2rem;
    }
    
    .subtitle {
      font-size: 1rem;
    }
    
    .menu-items-container .menu-items-header h3 {
      font-size: 1.8rem;
    }
    
    .menu-item .menu-item-header {
      flex-direction: column;
      
      .menu-item-price {
        margin-top: 5px;
        margin-left: 0;
      }
    }
    
    .menu-legend {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
</style>