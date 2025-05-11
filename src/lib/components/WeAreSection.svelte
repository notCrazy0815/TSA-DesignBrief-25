<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        const paragraphs = document.querySelectorAll(".we-are-text p");

        paragraphs.forEach((p) => {
            gsap.fromTo(p,
                {
                    opacity: 0.2,
                },
                {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: p,
                        start: "top 75%",
                        end: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        gsap.fromTo(".we-are-section-content", {
            scale: 0.8,
        },
        {
            scale: 1,
            ease: "power1.out",
            scrollTrigger: {
                trigger: ".we-are-section-content",
                start: "top 90%",
                end: "top 70%",
                toggleActions: "play none none reverse"
            }
        });
    });
</script>

<section class="we-are-section">
    <div class="we-are-section-content">
        <div class="we-are-logo">
            <p>
                ( Verdantia )
            </p>
        </div>
        <div class="we-are-text">
            <p>
                We are a
            </p>
            <p class="special-text">
                plant-powered
            </p>
            <p>
               culinary 
            </p>
            <p>
                destination
            </p>
            <p>
                fueled by
            </p>
            <p>
                creativity
            </p>
            <p>
                & sustainability
            </p>
        </div>
    </div>
</section>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .we-are-section {
        width: 100%;
        height: fit-content;
        padding: 15rem 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 1;

        .we-are-section-content {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .we-are-logo {
                p {
                    font-size: clamp(0.9rem, 2vw, 1rem);
                    color: v.$font-color-dark;
                    font-family: "DynaPuff Regular";
                }
            }

            .we-are-text {
                display: flex;
                flex-direction: column;
                justify-content: center;

                p {
                    font-size: clamp(1.4rem, 10vw, 5rem);
                    font-weight: 600;
                    color: v.$font-color-dark;
                    text-transform: uppercase;
                    text-align: center;
                    line-height: 1.1;
                    opacity: 0.2;

                    &.special-text {
                        font-family: "DynaPuff Regular";
                        text-transform: none;
                        color: v.$primary;
                        text-shadow: 0 0 clamp(60px, 8vw, 100px) v.$primary;
                    }
                }
            }
        }
    }
</style>