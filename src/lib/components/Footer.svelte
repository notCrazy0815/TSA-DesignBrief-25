<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { shouldAnimate, isLoading } from "$lib/stores/navStore";
    import { goto } from "$app/navigation";

    let resizeObserver: ResizeObserver;

    function updateFooterSpacing() {
        const footer = document.querySelector('.footer');
        const footerExtraSpace = document.querySelector('.footer-extra-space');
        
        if (footer && footerExtraSpace) {
            const footerHeight = footer.getBoundingClientRect().height;
            footerExtraSpace.setAttribute('style', `margin-bottom: ${footerHeight}px`);
        }
    }

    onMount(() => {
        updateFooterSpacing();

        resizeObserver = new ResizeObserver(() => {
            updateFooterSpacing();
        });

        const footer = document.querySelector('.footer');
        if (footer) {
            resizeObserver.observe(footer);
        }
    });

    onDestroy(() => {
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
    });

    function navigateAndAnimate(href: string) {
        if (window.location.pathname === href) {
            return;
        }

        setTimeout(() => {
            shouldAnimate.set(true);
            isLoading.set(true);
        }, 0);

        setTimeout(() => {
            shouldAnimate.set(false);
            goto(href);
        }, 950);
    }
</script>

<svelte:window on:resize={updateFooterSpacing}/>

<div class="footer">
    <div class="footer-content">
        <div class="top">
            <div class="left">
                <div class="slogan">
                    <h4>Good food for <span>everyone</span></h4>
                </div>
            </div>
            <div class="right">
                <div class="links">
                    <div class="link">
                        <a href="/">Our approach</a>
                    </div>
                    <div class="link">
                        <a href="/menu">Our seasonal menu</a>
                    </div>
                    <div class="link">
                        <a href="/news">News</a>
                    </div>
                </div>
                <div class="contact-and-location">
                    <div class="location">
                        <p>Location</p>
                        <div class="info">
                            <p>1234 Streetname</p>
                            <p>Nashville, TN, 37XXX</p>
                        </div>
                    </div>
                    <div class="contant">
                        <p>Contact</p>
                        <div class="info">
                            <p>+1 (123) 456-7890</p>
                            <p>info@verdantia.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <h1>V</h1>
            <h1>e</h1>
            <h1>r</h1>
            <h1>d</h1>
            <h1>a</h1>
            <h1>n</h1>
            <h1>t</h1>
            <h1>i</h1>
            <h1>a</h1>
        </div>
    </div>
</div>
<div class="footer-extra-space"></div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .footer {
        width: 100%;
        overflow: hidden;
        z-index: 0;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: v.$secondary-lighter;
        border-top: 2px solid v.$secondary;

        .footer-content {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .top {
                display: flex;
                width: 90%;
                padding: 3rem 2rem;

                .left {
                    width: 50%;

                    .slogan {
                        h4 {
                            font-family: "Inter 24pt Regular";
                            font-size: clamp(1.2rem, 2vw, 1.6rem);
                            color: v.$font-color-light;
                            
                            span {
                                font-family: "DynaPuff Regular";
                            }
                        }
                    }
                }
            }

            .bottom {
                display: flex;
                flex-wrap: no-wrap;
                justify-content: center;
                align-items: center;
                padding: 1rem 2rem;

                h1 {
                    color: v.$font-color-light;
                    font-size: clamp(30px, 17vw, 620px);
                    line-height: 1;
                    padding: 0;
                    margin: 0;
                    overflow: hidden;
                    display: inline-block;
                    cursor: pointer;
                    transition: transform 0.2s ease-in-out;
                    transform: translateY(clamp(15px, 8vw, 90px));
                    
                    &:hover {
                        transform: translateY(clamp(5px, 2vw, 30px));
                    }
                }
            }
        }
    }
</style>