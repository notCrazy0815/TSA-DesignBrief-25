<script lang="ts">
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import orange from "$lib/assets/icons/orange.png";
    import leaf from "$lib/assets/icons/leaf.png";
    import lavender from "$lib/assets/icons/lavender.png";
    import flower from "$lib/assets/icons/flower.png";

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        const orangeElements = document.querySelectorAll(".animate-orange");
        
        gsap.set(orangeElements, {
            opacity: 0,
            scale: 0
        });

        ScrollTrigger.create({
            trigger: ".testimonials-overall",
            start: "top 80%",
            onEnter: () => {
                gsap.to(orangeElements, {
                    opacity: 1,
                    scale: 1,
                    stagger: 0.25,
                    duration: 1,
                    ease: "bounce"
                });
            }
        });

        const testimonialItems = document.querySelectorAll(".testimonial-item");
        
        gsap.set(testimonialItems, {
            opacity: 0,
            y: 30,
            scale: 0.9
        });

        ScrollTrigger.create({
            trigger: ".testimonials-list",
            start: "top 85%",
            onEnter: () => {
                gsap.to(testimonialItems, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    stagger: 0.1,
                    duration: 0.7,
                    ease: "back.out(1.5)"
                });
            }
        });
    });
</script>

<div class="testimonials-section">
    <div class="testimonials-content">
        <h1>What our guests say</h1>
        <div class="testimonials-details">
            <div class="testimonials-overall">
                <h3>4.8<span>/5</span></h3>
                <div class="oranges">
                    {#each Array(4).fill(null) as _, i}
                        <img src={orange} alt="orange" class="animate-orange" />
                    {/each}
                    <div class="last-orange-container animate-orange">
                        <img src={orange} alt="orange" />
                        <div class="last-orange-filter"></div>
                    </div>
                </div>
                <p>overall online rating</p>
            </div>
            <div class="testimonials-list">
                <div class="testimonial-item">
                    <div class="testimonial-text">
                        <p>
                            "The best experience ever! The staff was so friendly and the atmosphere was amazing. Highly recommend!"
                        </p>
                    </div>
                    <div class="testimonial-footer">
                        <p>Alek V.</p>
                        <div class="testimonial-icon">
                            <img src={leaf} alt="Leaf" />
                        </div>
                    </div>
                </div>
                <div class="testimonial-item">
                    <div class="testimonial-text">
                        <p>
                            "My favorite place to eat in Nashville! I really love the variety of dishes, it's not only great for vegetarians but for everyone!"
                        </p>
                    </div>
                    <div class="testimonial-footer">
                        <p>Phillip L.</p>
                        <div class="testimonial-icon">
                            <img src={lavender} alt="Lavender" style="transform: rotate(-90deg)" />
                        </div>
                    </div>
                </div>
                <div class="testimonial-item">
                    <div class="testimonial-text">
                        <p>
                            "I'm not a vegetarian, but I regurarly eat at this restaurant. The food is sooo delicious!!!"
                        </p>
                    </div>
                    <div class="testimonial-footer">
                        <p>Sofia B.</p>
                        <div class="testimonial-icon">
                            <img src={flower} alt="Flower" />
                        </div>
                    </div>
                </div>
                <div class="testimonial-item">
                    <div class="testimonial-text">
                        <p>
                            "I love the beverages! So unique and special, never seen anything like it before. You have to try it out if you are in Nashville!"
                        </p>
                    </div>
                    <div class="testimonial-footer">
                        <p>Erik A.</p>
                        <div class="testimonial-icon">
                            <img src={lavender} alt="Lavender" style="transform: rotate(-90deg)" />
                        </div>
                    </div>
                </div>
                <div class="testimonial-item">
                    <div class="testimonial-text">
                        <p>
                            "I had the best time at this restaurant! It was cozy, delicious and not too expensive. I will definitely come back!"
                        </p>
                    </div>
                    <div class="testimonial-footer">
                        <p>Charlotte M.</p>
                        <div class="testimonial-icon">
                            <img src={orange} alt="Orange" />
                        </div>
                    </div>
                </div>
                <div class="testimonial-item">
                    <div class="testimonial-text">
                        <p>
                            "You can feel the passion and the love in every dish! Also, the staff is friendly and welcoming. Great atmosphere!"
                        </p>
                    </div>
                    <div class="testimonial-footer">
                        <p>Peter N.</p>
                        <div class="testimonial-icon">
                            <img src={lavender} alt="Lavender" style="transform: rotate(-90deg)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .testimonials-section {
        width: 100%;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        padding: 12rem 0;

        .testimonials-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3rem;

            h1 {
                font-size: clamp(2rem, 5vw, 3rem);
                color: v.$font-color-dark;
                text-align: center;
            }

            .testimonials-details {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 1rem;

                .testimonials-overall {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.9rem;
                    padding: 2rem 3.5rem;

                    background-color: #fbf9f6;
                    border-radius: 2rem;
                    border: 2px solid rgba(160, 147, 125, 0.5);
                    box-shadow: 0 8px 100px rgba(105, 89, 72, 0.15);

                    h3 {
                        font-size: clamp(2rem, 5vw, 3rem);
                        color: v.$font-color-dark;

                        span {
                            font-size: clamp(1.5rem, 4vw, 2rem);
                        }
                    }

                    .oranges {
                        display: flex;
                        gap: 0.5rem;

                        img {
                            width: 2rem;
                            height: 2rem;
                        }

                        .last-orange-container {
                            position: relative;
                            width: 2rem;
                            height: 2rem;

                            img {
                                width: 100%;
                                height: 100%;
                            }

                            .last-orange-filter {
                                position: absolute;
                                top: 0;
                                right: 0;
                                width: 20%;
                                height: 100%;
                                background-color: rgba(255, 255, 255, 0.8);
                                border-radius: 50%;
                            }
                        }
                    }

                    p {
                        font-size: clamp(0.85rem, 1vw, 0.9rem);
                        color: v.$font-color-dark;
                    }
                }

                .testimonials-list {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(250px, 1fr));
                    gap: 1rem;

                    @media screen and (max-width: 1350px) {
                        grid-template-columns: repeat(2, minmax(250px, 1fr));
                    }

                    @media screen and (max-width: 800px) {
                        grid-template-columns: repeat(1, minmax(250px, 1fr));
                    }

                    .testimonial-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 1rem;
                        padding: 2rem 3.5rem;

                        width: clamp(250px, 90vw, 400px);

                        background-color: #fbf9f6;
                        border-radius: 2rem;
                        border: 2px solid rgba(160, 147, 125, 0.5);
                        box-shadow: 0 8px 100px rgba(105, 89, 72, 0.15);

                        .testimonial-text {
                            p {
                                font-size: clamp(1rem, 2vw, 1.2rem);
                                color: v.$font-color-dark;
                                text-align: center;
                            }
                        }

                        .testimonial-footer {
                            display: flex;
                            align-items: center;
                            gap: 1rem;

                            p {
                                font-size: clamp(0.85rem, 1vw, 0.9rem);
                                color: v.$font-color-dark;
                            }

                            .testimonial-icon {
                                width: 2rem;
                                height: 2rem;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                background-color: #c7b6ad;
                                border-radius: 50%;
                                border: 2px solid rgba(207, 196, 177, 0.5);
                                box-shadow: 0 8px 100px rgba(105, 89, 72, 0.15);
                                overflow: hidden;

                                img {
                                    width: 90%;
                                    height: 90%;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>