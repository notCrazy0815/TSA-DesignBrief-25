<div class="navbar">
    <div class="heading">
        <h1 class="heading-title">
             VERDANTIA
        </h1>
   </div>
   <div class="links">
        <div class="link">
            <a href="/">Home</a>
            <div class="active-icon active"></div>
        </div>
        <div class="link">
            <a href="/menu">Menu</a>
            <div class="active-icon"></div>
        </div>
        <div class="link">
            <a href="/news">News</a>
            <div class="active-icon"></div>
        </div>
   </div>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .navbar {
        width: 100%;
        display: flex;
        flex-direction: column;
        
        .heading {
            display: flex;
            justify-content: center;
            width: 100%;

            .heading-title {
                font-size: clamp(2rem, 130px, 9rem);
                color: v.$secondary;
            }
        }

        .links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            width: 100%;

            .link {
                text-transform: uppercase;
                display: flex;
                gap: 1px;
                align-items: center;

                .active-icon {
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    background-color: transparent;
                }

                .active {
                    background-color: v.$primary;
                }
            }
        }
    }
</style>