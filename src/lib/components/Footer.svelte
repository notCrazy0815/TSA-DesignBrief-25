<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { shouldAnimate, isLoading } from "$lib/stores/navStore";
    import { goto } from "$app/navigation";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    let resizeObserver: ResizeObserver;
    let footerAnimation: ScrollTrigger;

    function updateFooterSpacing() {
        const footer = document.querySelector('.footer');
        const footerExtraSpace = document.querySelector('.footer-extra-space');
        
        if (footer && footerExtraSpace) {
            const footerHeight = footer.getBoundingClientRect().height;
            footerExtraSpace.setAttribute('style', `height: ${footerHeight}px`);
        }
    }

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        updateFooterSpacing();

        resizeObserver = new ResizeObserver(() => {
            updateFooterSpacing();
        });

        const footer = document.querySelector('.footer');
        if (footer) {
            resizeObserver.observe(footer);
        }

        const footerLetters = gsap.utils.toArray('.bottom h1');
        const sortedFooterLetters = centerOutReorder(footerLetters);

        const footerAnimation = gsap.timeline({
            scrollTrigger: {
                trigger: ".footer-extra-space",
                start: "top+=20% bottom",
                end: "bottom top",
                toggleActions: "play none none reverse"
            },
        });

        footerLetters.forEach((letter: any, index: number) => {
            gsap.set(letter, {
                opacity: 0,
                y: "120%",
            });

            const colors = ["#0a3161", "white", "#0a3161", "#b31942", "white", "#b31942", "white", "#b31942", "white", "#b31942"];

            console.log(colors[index], letter.innerText);

            letter.addEventListener("mouseenter", () => {
                gsap.to(letter, {
                    scale: 1.1,
                    y: "0%",
                    duration: 0.3,
                    color: colors[index],
                    ease: "power3.out",
                });
            });

            letter.addEventListener("mouseleave", () => {
                gsap.to(letter, {
                    scale: 1,
                    y: "30%",
                    duration: 0.3,
                    ease: "power3.out",
                });
            });
        });

        sortedFooterLetters.forEach((letter: any, index: number) => {
            footerAnimation.to(letter, {
                opacity: 1,
                y: "30%",
                duration: 0.3,
                ease: "power3.out",
            }, index * 0.05);
        });
    });

    onDestroy(() => {
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
    });

    function centerOutReorder(arr: any[]) {
        const result = [];
        const mid = Math.floor(arr.length / 2);
        result.push(arr[mid]);

        for (let i = 1; i <= mid; i++) {
            if (mid - i >= 0) result.push(arr[mid - i]);
            if (mid + i < arr.length) result.push(arr[mid + i]);
        }

        return result;
    }

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

    .footer-extra-space {
        width: 100%;
    }

    .footer {
        width: 100%;
        overflow: hidden;
        z-index: 0;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: v.$secondary-lighter;

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
                }
            }
        }
    }
</style>