<script lang="ts">
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { onMount } from "svelte";

    let activeQuestionIndex: number | null = null;

    let questionHeaders: any = [];
    let questionDividers: any = [];

    const questions = [
        {
            "question": "Are all your dishes 100% vegetarian?",
            "answer": "Yes! Every single dish on our menu is completely vegetarian, which means no meat, no fish and no compromises. We believe in making plant-based food exciting, satisfying, and full of flavor."
        },
        {
            "question": "Do you offer vegan options as well?",
            "answer": "Absolutely. Many of our dishes are naturally vegan or can be made vegan upon request. You can filter our menu to see all vegan options available."
        },
        {
            "question": "Why did you choose to go vegetarian?",
            "answer": "Because we believe good food can do good. A vegetarian diet is kinder to the planet, promotes better health, and supports more sustainable farming practices. For us, it’s about creating delicious meals that feel just as good as they taste. But it's not just about being fully vegetarian, we want to give everyone the opportunity to eat meat-free from time to time."
        },
        {
            "question": "Where do your ingredients come from?",
            "answer": "We try to source as many of our ingredients locally as possible. We work with local farmers and suppliers to ensure that our products are fresh, seasonal, and sustainably grown. We believe in supporting our local farmers while reducing our carbon footprint."
        },
        {
            "question": "How do you reduce food waste and plastic use?",
            "answer": "Sustainability is at the heart of what we do. We plan our menus seasonally to avoid waste, compost our kitchen scraps, and use compostable or reusable packaging wherever possible."
        },
        {
            "question": "How do you handle food allergies?",
            "answer": "We take allergies seriously. Our team is trained to help you navigate the menu, and we offer detailed allergen information for every dish. Just let us know your needs when you order and we’ll do our best to accommodate safely."
        },
        {
            "question": "What are your opening hours?",
            "answer": "We’re open Monday to Saturday from 8:00 AM to 4:00 PM, closed on Sundays."
        },
        {
            "question": "Do you offer takeaway?",
            "answer": "Yes! You can order takeaway directly from our website."
        },
        {
            "question": "How can I stay updated on new dishes or events?",
            "answer": "Sign up for our newsletter! We share behind-the-scenes peeks, new menu items, and invites to exclusive events."
        },
        {
            "question": "Where can I park?",
            "answer": "There’s street parking nearby and a public lot just a 3-minute walk away."
        }
    ]

    function toggleQuestion(index: number) {
        if (activeQuestionIndex === index) {
            const currentAnswer = document.querySelector(`.answer-${activeQuestionIndex}`);
            gsap.to(currentAnswer, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                    activeQuestionIndex = null;
                }
            });

            gsap.to(questionHeaders[index], {
                x: 30,
                duration: 0.3,
                ease: "power2.out"
            });
            gsap.to(questionDividers[index], {
                x: 15,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            if (activeQuestionIndex !== null) {
                const currentAnswer = document.querySelector(`.answer-${activeQuestionIndex}`);
                gsap.to(currentAnswer, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
            
            activeQuestionIndex = index;
            const newAnswer = document.querySelector(`.answer-${index}`);
            gsap.fromTo(newAnswer, 
                { height: 0, opacity: 0 },
                { 
                    height: "auto", 
                    opacity: 1, 
                    duration: 0.4, 
                    ease: "power2.out" 
                }
            );

            gsap.to(questionHeaders[index], {
                x: 0,
                duration: 0.3,
                ease: "power2.out"
            });
            gsap.to(questionDividers[index], {
                x: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        questionDividers = document.querySelectorAll(".divider");
        questionHeaders = document.querySelectorAll(".question-header");

        gsap.set(".question-answer", { 
            height: 0, 
            opacity: 0,
            overflow: "hidden" 
        });

        gsap.set(".divider", {
            width: "0%",
        });

        const dividerTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".faq-section",
                start: "top 40%",
                end: "top +=20% top",
                toggleActions: "play none none reverse",
            }
        });

        dividerTimeline.to(".divider", {
            width: "100%",
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.1
        });

        document.querySelectorAll(".question-item").forEach((item, index) => {
            item.addEventListener("mouseenter", () => {
                if (!item.classList.contains("active")) {
                    gsap.to(questionHeaders[index], {
                        x: 30,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    gsap.to(questionDividers[index], {
                        x: 15,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            item.addEventListener("mouseleave", () => {
                gsap.to(questionHeaders[index], {
                    x: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
                gsap.to(questionDividers[index], {
                    x: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    });
</script>

<div class="faq-section">
    <div class="faq-content">
        <div class="left">
            <h1>Frequently asked<br>questions</h1>
            <p>Everything you might want to know before your first bite.</p>
        </div>
        <div class="right">
            <div class="question-list">
                {#each questions as question, index}
                    <div class="question-item" class:active={activeQuestionIndex === index}>
                        <div class="question-header" 
                            on:click={() => toggleQuestion(index)}
                            role="button"
                            tabindex="0"
                            on:keydown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    toggleQuestion(index);
                                }
                            }}
                        >
                            <h2>{question.question}</h2>
                        </div>
                        <div class="question-answer answer-{index}">
                            <p>{question.answer}</p>
                        </div>
                        <div class="divider"></div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g; 

    .faq-section {
        width: 100%;
        display: flex;
        justify-content: center;
        padding-top: 5rem;
        padding-bottom: 5rem;
        background-color: v.$tertiary-dark;

        .faq-content {
            width: 95%;
            max-width: 1200px;
            border-radius: 1rem;
            padding: 2rem;

            display: flex;
            gap: 4rem;

            @media screen and (max-width: 1050px) {
                flex-direction: column;
                gap: 2rem;
            }

            .left {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                color: #fbf9f6;

                h1 {
                    white-space: nowrap;
                    font-size: clamp(1.5rem, 3vw, 2.1rem);
                }

                p {
                    font-size: clamp(0.9rem, 2vw, 1.1rem);
                }
            }

            .right {
                flex: 1;
                display: flex;
                justify-content: end;

                @media screen and (max-width: 1050px) {
                    justify-content: center;
                }

                .question-list {
                    width: 100%;
                    max-width: 600px;
                    display: flex;
                    flex-direction: column;
                    color: #fbf9f6;
                    font-family: "Inter 24pt Regular", sans-serif;
                    margin-top: 3rem;

                    .question-item {
                        margin-bottom: 1rem;

                         .question-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            cursor: pointer;
                            padding: 1rem 0;
                            
                            h2 {
                                margin: 0;
                                font-size: clamp(1.1rem, 2vw, 1.3rem);
                            }
                        }

                        .question-answer {
                            overflow: hidden;
                            padding: 0 1rem 1rem 0;
                            
                            p {
                                margin: 0;
                            }
                        }

                        .divider {
                            width: 100%;
                            height: 1px;
                            background-color: #fbf9f6;
                            opacity: 0.5;
                        }
                    }
                }
            }
        }
    }
</style>