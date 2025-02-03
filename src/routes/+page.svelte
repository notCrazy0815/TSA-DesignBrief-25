<div class="content">
     <section class="hero-section">
          <div class="heading">
               <h1 class="heading-title">
                    VERDANTIA
               </h1>
          </div>
          <div class="image-content">
               <div class="bowls">
                   <div class="bowl1 bowl"></div>
                   <div class="bowl2 bowl"></div>
                   <div class="bowl3 bowl"></div> 
               </div>
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
               background-color: v.$secondary;
               display: flex;
               align-items: center;
               flex-direction: column;

               .heading {
                    .heading-title {
                         font-size: clamp(2rem, 130px, 9rem);
                         color: v.$font-color-light;
                    }
               }
          }
     }
</style>