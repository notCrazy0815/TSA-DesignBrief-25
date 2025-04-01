<script lang="ts">
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }
</script>

<div class="navbar">
    <div class="content">
        <div class="content-box" class:expanded={isMenuOpen}></div>
        {#if !isMenuOpen}
            <button class="nav-btn" on:click={toggleMenu} on:keydown={(e) => e.key === 'Enter' && toggleMenu()}>
                <p class="nav-text">MENU</p>
            </button>
        {:else}
            <button class="nav-btn close-btn" on:click={toggleMenu} on:keydown={(e) => e.key === 'Enter' && toggleMenu()}>
                <p class="nav-text">Close</p>
            </button>
        {/if}
        <div class="heading">
            <a href="/">VERDANTIA</a>
        </div>
        <div class="cart-btn" style:opacity={isMenuOpen ? 0 : 1}>
            <p class="nav-text">BAG</p>
        </div>
        {#if isMenuOpen}
            <div class="menu-content">
                <div class="menu-links">
                    <a href="/" style="animation-delay: 0.1s;">Approach</a>
                    <a href="/menu" style="animation-delay: 0.3s;">Our seasonal menu</a>
                    <a href="/news" style="animation-delay: 0.5s;">News</a>
                </div>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .navbar {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 2rem 0;

        .content {
            width: clamp(100px, 90%, 500px);
            padding: 0.8rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 1000;

            .nav-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;   
            }

            .nav-text {
                font-size: clamp(0.8rem, 1.6vh, 1rem);
                font-family: 'Inter 24pt Regular';
                color: v.$font-color-dark;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;

                &::selection {
                    background-color: v.$background-color-dark;
                    color: v.$font-color-light;
                }
            }

            .heading {
                a {
                    font-size: clamp(1.1rem, 3vh, 2.2rem);
                    font-family: 'DynaPuff Regular';
                    color: v.$tertiary-dark;
                    cursor: pointer;
                }
            }

            .content-box {
                width: 100%;
                height: 100%;
                background-color: #fff;
                position: absolute;
                top: 0;
                left: 0;
                border-radius: 20px;
                z-index: -1;
                transition: transform .3s cubic-bezier(0.16, 1, 0.3, 1),
                            height 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                            box-shadow .3s cubic-bezier(0.16, 1, 0.3, 1);
                transform-origin: center;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

                &.expanded {
                    height: 300px;
                    border-radius: 20px;
                }
            }

            &:hover {
                .content-box {
                    transform: scale(1.05);
                    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
                }
            }

            .menu-content {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                padding: 2rem;
                z-index: 1;

                .menu-links {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    justify-content: center;
                    align-items: center;
                    
                    a {
                        color: v.$font-color-dark;
                        text-decoration: none;
                        font-size: clamp(1.2rem, 2.2vh, 1.6rem);
                        font-family: 'Inter 24pt Regular';
                        opacity: 0;
                        transition: opacity .3s ease;
                        animation: fadeIn 0.5s ease forwards;

                        &:hover {
                            opacity: 0.8 !important;
                        }
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                }
            }
        }
    }
</style>