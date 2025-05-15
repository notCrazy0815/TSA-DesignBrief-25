<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import usa from "$lib/assets/svg/usa.svg";
    import leaf from "$lib/assets/svg/leaf.svg";
    import branch2d from "$lib/assets/branches/branch_2d_s.png";

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

        const title = document.querySelector(".title h1 span");
        gsap.set(title, { opacity: 0 });

        gsap.to(title, {
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
                end: "top 60%",
                scrub: 0.5
            }
        });

        const subtitle = document.querySelector(".title p");
        gsap.set(subtitle, { opacity: 0, y: 20 });

        gsap.to(subtitle, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: subtitle,
                start: "top 80%",
                end: "top 60%",
                scrub: 0.5
            }
        });

        const usaImage = document.querySelector(".card.local .card-graphic img");
        gsap.set(usaImage, { 
            scale: 0,
            opacity: 0
        });

        gsap.to(usaImage, {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".card.local",
                start: "top 60%",
                end: "top 40%",
                scrub: false,
                toggleActions: "play none none reverse"
            }
        });

        const seasonalImage = document.querySelector(".card.seasonal .card-graphic img");
        gsap.set(seasonalImage, { 
            scale: 0,
            y: 60
        });

        gsap.to(seasonalImage, {
            scale: 1,
            duration: 1,
            y: 0,
            ease: "elastic.out",
            scrollTrigger: {
                trigger: ".card.seasonal",
                start: "top 60%",
                end: "top 40%",
                scrub: false,
                toggleActions: "play none none reverse"
            }
        });

        const plantBasedImage = document.querySelector(".card.plant-based .card-graphic img");
        gsap.set(plantBasedImage, { 
            scale: 0,
            y: 60
        });

        gsap.to(plantBasedImage, {
            scale: 1,
            duration: 1,
            y: 0,
            ease: "bounce",
            scrollTrigger: {
                trigger: ".card.plant-based",
                start: "top 60%",
                end: "top 40%",
                scrub: false,
                toggleActions: "play none none reverse"
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
                    start: "top " + (5 + 3 * i) + "%",
                    end: "bottom bottom",
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
        <h1>What makes <span>Verdantia</span> different</h1>
        <p>Learn about the 4 principles behind every plate we serve.</p>
    </div>
    <div class="cards">
        <div class="card-container">
            <div class="card local">
                <div class="card-text">
                    <div class="card-title card-title-local">
                        <h3>Locally Sourced</h3>
                    </div>
                    <div class="card-description">
                        <p>We work directly with nearby farms and suppliers to bring you ingredients grown close to home. This not only supports our local economy but also ensures fresher, better-tasting food.</p>
                    </div>
                </div>
                <div class="card-graphic">
                    <img src={usa} alt="USA" />
                </div>
            </div>
        </div>
        <div class="card-container">
            <div class="card seasonal">
                <div class="card-text">
                    <div class="card-title card-title-seasonal">
                        <h3>Seasonal Menus</h3>
                    </div>
                    <div class="card-description">
                        <p>Our dishes follow the rhythm of nature — changing with the seasons to feature what’s at its peak. This keeps things exciting and minimizes waste.</p>
                    </div>
                </div>
                <div class="card-graphic">
                    <img src={branch2d} alt="Branch" />
                </div>
            </div>
        </div>
        <div class="card-container">
            <div class="card plant-based">
                <div class="card-text">
                    <div class="card-title card-title-plant-based">
                        <h3>Plant-based</h3>
                    </div>
                    <div class="card-description">
                        <p>While not strictly vegan, our menu is rooted in plants. We highlight vegetables, grains, and legumes — making plants the star of every dish.</p>
                    </div>
                </div>
                <div class="card-graphic">
                    <img src={leaf} alt="Leaf" />
                </div>
            </div>
        </div>
        <div class="card-container">
            <div class="card tasty">
                <div class="card-text">
                    <div class="card-title card-title-tasty">
                        <h3>Flavor Comes First</h3>
                    </div>
                    <div class="card-description">
                        <p>Our food isn’t just good for you and the planet — it’s seriously delicious. We focus on bold flavors, rich textures, and surprising combinations that satisfy every time.</p>
                    </div>
                </div>
                <div class="card-graphic"></div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .card-section {
        z-index: 2;
        width: 100%;
        min-height: 100vh;
        padding-top: 3rem;
        display: flex;
        flex-direction: column;
        background-color: v.$tertiary-light-low-opacity;
        padding-bottom: 60vh;
        border-top: 2px solid v.$tertiary-light;
        border-bottom: 2px solid v.$tertiary-light;

        .title {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-bottom: 50px;
            padding: 0 2rem;

            h1 {
                font-size: clamp(1.3rem, 3vw, 3rem);
                font-family: "Inter 24pt Regular";
                color: v.$font-color-dark;
                text-align: center;
                line-height: 1.2;
                max-width: 800px;
                text-transform: uppercase;
                line-height: 1.2;
                overflow: hidden;

                span {
                    color: v.$tertiary-dark;
                    font-family: "DynaPuff Regular"
                }
            }

            p {
                font-size: clamp(0.8rem, 2vw, 1.05rem);
                font-family: "Inter 24pt Regular";
                color: v.$font-color-dark;
                text-align: center;
                max-width: 800px;
                line-height: 1.2;
                overflow: hidden !important;
            }
        }

        .cards {
            width: 100%;
            margin: 0 auto;
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
                    width: 92%;
                    max-width: 600px;
                    height: clamp(400px, 70vh, 700px);
                    font-size: 30px;
                    border-radius: 10px;
                    color: v.$font-color-dark;
                    display: flex;
                    flex-direction: column;
                    padding: 4rem 3rem;

                    background-color: #fbf9f6;
                    border-radius: 3rem;
                    border: 2px solid rgba(160, 147, 125, 0.5);
                    box-shadow: 0 8px 100px rgba(105, 89, 72, 0.15);

                    font-family: "Inter 24pt Regular";

                    .card-text {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;

                        .card-title {
                            h3 {
                                font-size: clamp(1.1rem, 2vw, 1.2rem);
                                font-family: "Inter 24pt Regular";
                            }

                            padding: 0 0 1rem 0;

                            &.card-title-local {
                                border-bottom: 2px solid rgba(160, 147, 125, 0.5);
                            }

                            &.card-title-seasonal {
                                border-bottom: 2px solid v.$secondary;
                            }

                            &.card-title-plant-based {
                                border-bottom: 2px solid v.$tertiary;
                            }

                            &.card-title-tasty {
                                border-bottom: 2px solid v.$primary-dark;
                            }
                        }

                        .card-description {
                            p {
                                font-size: clamp(1rem, 1.4vw, 1.6rem);
                                font-family: "Inter 24pt Regular";
                                line-height: 1.5;
                            }
                        }
                    }

                    &.local {
                        background-color: #fff;
                        gap: 1rem;

                        .card-graphic {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            img {
                                width: 80%;
                                height: 90%;
                                object-fit: contain;
                                filter: brightness(0) saturate(100%) invert(18%) sepia(37%) saturate(1155%) hue-rotate(120deg) brightness(101%) contrast(102%);
                            }
                        }
                    }

                    &.seasonal {
                        background-color: v.$secondary-lighter;
                        color: #fff;
                        border: 2px solid v.$secondary;
                        overflow: hidden;

                        .card-graphic {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: end;

                            img {
                                height: 90%;
                                object-fit: contain;
                            }
                        }
                    }

                    &.plant-based {
                        background-color: v.$tertiary-lighter;
                        color: #fff;
                        border: 2px solid v.$tertiary;

                        .card-graphic {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;

                            img {
                                width: 80%;
                                height: 90%;
                                object-fit: contain;
                            }
                        }
                    }

                    &.tasty {
                        background-color: v.$primary;
                        color: #fff;
                        border: 2px solid v.$primary-dark;
                    }
                }
            }
        }
    }
</style>