<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        const cardSection = document.querySelector(".card-section");
        gsap.set(cardSection, { opacity: 0 });
        
        gsap.to(cardSection, {
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
                trigger: cardSection,
                start: "top 90%",
                end: "top 70%", 
                scrub: 0.5
            }
        });

        const cardsContainer = document.querySelectorAll(".card-container");
        const cards = document.querySelectorAll(".card");

        cardsContainer.forEach((container: any, i: any) => {
            const card = cards[i];
            let scale = 1,
                rotation = 0;
            if (i !== cards.length - 1) {
                scale = 0.9 + 0.025 * i;
                rotation = -10;
            }
            gsap.to(card, {
                scale: scale,
                rotationX: rotation,
                transformOrigin: "top center",
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top " + (20 + 3 * i) + "%",
                    end: "bottom 70%",
                    endTrigger: ".card-section",
                    scrub: true,
                    pin: container,
                    pinSpacing: false,
                    id: i + 1
                }
            });
        });
    });
</script>

<div class="card-section">
    <div class="title">
        <h1>Our concept can be described by 4 key aspects</h1>
    </div>
    <div class="cards">
        <div class="card-container">
            <div class="card local">Local</div>
        </div>
        <div class="card-container">
            <div class="card seasonal">Seasonal</div>
        </div>
        <div class="card-container">
            <div class="card plant-based">Plant-based</div>
        </div>
        <div class="card-container">
            <div class="card tasty">Tasty</div>
        </div>
    </div>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .card-section {
        width: 100%;
        min-height: 100vh;
        padding-top: 3rem;
        padding-bottom: 50px;
        display: flex;
        flex-direction: column;
        background-color: v.$tertiary-light-low-opacity;
        padding-bottom: 35vh;
        border-top: 2px solid v.$tertiary-light;
        border-bottom: 2px solid v.$tertiary-light;

        .title {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 50px;

            h1 {
                font-size: clamp(1.3rem, 3vw, 3rem);
                font-family: "Inter 24pt Regular";
                color: v.$font-color-dark;
                text-align: center;
                line-height: 1.2;
                max-width: 800px;
                text-transform: uppercase;
            }
        }

        .cards {
            width: 100%;
            margin: 0 auto;
            padding: 0 50px;
            display: flex;
            flex-direction: column;
            align-items: center;

            .card-container {
                width: 100%;
                display: flex;
                justify-content: center;
                perspective: 500px;
                margin-bottom: 3rem;

                &:last-child {
                    margin-bottom: 0;
                }

                .card {
                    width: 95%;
                    max-width: 1100px;
                    height: 400px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 30px;
                    border-radius: 10px;
                    color: v.$font-color-dark;

                    background-color: #fbf9f6;
                    border-radius: 1rem;
                    border: 2px solid rgba(160, 147, 125, 0.5);
                    box-shadow: 0 8px 16px rgba(105, 89, 72, 0.06);

                    font-family: "Inter 24pt Regular";

                    &.local {
                        background-color: #fff;
                    }

                    &.seasonal {
                        background-color: v.$secondary-lighter;
                        color: #fff;
                        border: 2px solid v.$secondary;
                    }

                    &.plant-based {
                        background-color: v.$tertiary-lighter;
                        color: #fff;
                        border: 2px solid v.$tertiary;
                    }

                    &.tasty {
                        background-color: v.$primary-lighter;
                        color: #fff;
                    }
                }
            }
        }
    }
</style>