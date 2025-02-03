<div class="content">
     <section class="hero-section"></section>
     <section class="message-section">
          <div class="message-text">
               <p>
                    It's not about the destination, it's about the journey. That's why we decided to go vegan. Because vegan means saving the planet, saving the animals. And at the end, that means saving ourselves.
               </p>
          </div>
     </section>
</div>

<style lang="scss">
     @use "../lib/styles/variables" as v;
     @use "../lib/styles/global" as g;

     .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;

          .hero-section {
               width: 100%;
               height: 100vh;
          }

          .message-section {
               background-color: v.$secondary;
               width: 100%;
               padding: 10rem 5rem;
               display: flex;

               .message-text {
                    width: 60%;

                    p {
                         font-size: 2.5rem;
                         color: v.$font-color-light;
                         text-transform: uppercase;
                    }
               }
          }
     }
</style>