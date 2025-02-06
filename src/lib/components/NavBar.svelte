<script lang="ts">
    export let active: "home" | "menu" | "news" = "home";
</script>

<div class="navbar">
    <div class="heading">
        <h1 class="heading-title">
             VERDANTIA
        </h1>
   </div>
   <div class="links">
        <div class="link">
            <a href="/">Home</a>
            {#if active === "home"}
                <div class="active-icon active"></div>
            {:else}
                <div class="active-icon"></div>
            {/if}
        </div>
        <div class="link">
            <a href="/menu">Menu</a>
            {#if active === "menu"}
                <div class="active-icon active"></div>
            {:else}
                <div class="active-icon"></div>
            {/if}
        </div>
        <div class="link">
            <a href="/news">News</a>
            {#if active === "news"}
                <div class="active-icon active"></div>
            {:else}
                <div class="active-icon"></div>
            {/if}
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
                font-size: 5rem;
                color: v.$tertiary-dark;
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
                    animation: active-icon-start 0.5s;
                }

                .active {
                    background-color: v.$primary;
                }

                @keyframes active-icon-start {
                    0% {
                        transform: scale(0);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            }
        }
    }
</style>