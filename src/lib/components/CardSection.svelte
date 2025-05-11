<script lang="ts">
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { onMount } from "svelte";

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        const headerParagraphs = gsap.utils.toArray(".card-header p");
        
        headerParagraphs.forEach((paragraph: any) => {
            gsap.fromTo(
                paragraph,
                {
                    translateY: 25,
                    opacity: 0
                },
                {
                    translateY: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: paragraph,
                        start: "top 70%",
                        end: "top 60%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    });
</script>

<div class="card-section">
    <div class="card-section-content">
        <div class="card card-local">
            <div class="card-top-part"></div>
            <div class="card-content">
                <div class="card-header">
                    <p>We believe the best ingredients are <span class="locally">locally</span> sourced.</p>
                </div>
                <div class="card-body">
                    <p>
                        Whenever possible, we source directly from nearby farms and small producers who share our commitment to quality and sustainability. Our menu changes with the seasons to reflect what’s fresh and available — not only to bring out the best flavors, but to support local agriculture and reduce our environmental impact.
                    </p>
                </div>
            </div>
        </div>
        <div class="card card-fresh">
            <div class="card-top-part"></div>
            <div class="card-content">
                <div class="card-header">
                    <p>We believe in the power of <span class="fresh">freshness</span>.</p>
                </div>
                <div class="card-body">
                    <p>
                        We believe that food should be as fresh as possible. That’s why we make everything from scratch, using only the freshest ingredients. Our chefs work tirelessly to create dishes that are not only delicious, but also visually stunning.
                    </p>
                </div>
            </div>
        </div>
        <div class="card card-plant">
            <div class="card-top-part"></div>
            <div class="card-content">
                <div class="card-header">
                    <p>We believe in the beauty of <span class="plant">plants</span>.</p>
                </div>
                <div class="card-body">
                    <p>
                        We believe that plants are not only beautiful, but also incredibly versatile. Our chefs are constantly experimenting with new techniques and flavor combinations to create dishes that are both delicious and visually stunning. We want to show the world that plant-based food can be just as exciting and satisfying as any other cuisine.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .card-section {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 5rem 2rem;

        .card-section-content {
            .card {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;

                background-color: #fbf9f6;
                border-radius: 1rem;
                border: 1px solid rgba(160, 147, 125, 0.2);
                box-shadow: 0 8px 16px rgba(106, 89, 72, 0.06);

                width: clamp(300px, 80vw, 600px);
                margin-bottom: 2rem;

                .card-top-part {
                    width: 100%;
                    height: 6px;
                    background: linear-gradient(to right, #a0937d, #8c7b6b);
                    opacity: 0.8;
                    transition: height 0.3s ease;
                    border-radius: 8px 8px 0 0;
                }

                .card-content {
                    width: 100%;
                    padding: 2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    gap: 2rem;

                    .card-header {
                        width: 100%;
                        height: fit-content;

                        p {
                            font-size: clamp(1.2rem, 2vw, 4rem);
                            line-height: 1.2;

                            .locally {
                                color: v.$tertiary-dark;
                                font-family: "DynaPuff Regular";
                                text-shadow: 0 0 clamp(10px, 3vw, 30px) v.$tertiary-light;
                            }

                            .fresh {
                                color: v.$tertiary-dark;
                                font-family: "DynaPuff Regular";
                                text-shadow: 0 0 clamp(10px, 3vw, 30px) v.$tertiary-light;
                            }

                            .plant {
                                color: v.$tertiary-dark;
                                font-family: "DynaPuff Regular";
                                text-shadow: 0 0 clamp(10px, 3vw, 30px) v.$tertiary-light;
                            }
                        }
                    }
                }
            }
        }
    }
</style>