<script lang="ts">
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Confetti from "svelte-confetti"

    let formSubmitted = false;

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        const newsLetterTimeLine = gsap.timeline({
            scrollTrigger: {
                trigger: ".newsletter",
                start: "top 50%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
        });

        gsap.set(".newsletter-top", { opacity: 0, y: 50 });

        newsLetterTimeLine
            .to(".newsletter-top", {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
            });
        
        
    });
</script>

<div class="newsletter">
    <div class="newsletter-top">
        <h2 class="newsletter-title">Join our newsletter</h2>
        <p class="newsletter-description">
            Subscribe to our newsletter and get the latest news, updates, and special offers delivered directly to your inbox.
        </p>
    </div>
    {#if !formSubmitted}
        <form class="newsletter-form" on:submit|preventDefault={() => formSubmitted = true}>
            <input type="email" placeholder="Enter your email" class="newsletter-input" required />
            <button type="submit" class="newsletter-button">Subscribe</button>
        </form>
    {:else}
        <p class="newsletter-success">Thank you for subscribing!</p>
        <div class="confetti-container">
            <Confetti />
        </div>
    {/if}
    <p class="newsletter-privacy">
        We respect your privacy. Unsubscribe at any time.
    </p>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .newsletter {
        width: 95%;
        max-width: 1200px;
        margin-bottom: 2rem;
        padding: 2rem;
        background-color: #fbf9f6;
        border-radius: 1rem;
        border: 2px solid rgba(160, 147, 125, 0.5);
        box-shadow: 0 8px 100px rgba(105, 89, 72, 0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3rem;
        align-self: center;

        .newsletter-top {
            text-align: center;

            .newsletter-title {
                font-size: clamp(1.4rem, 4vw, 1.9rem);
                font-family: "DynaPuff Regular", sans-serif;
                color: v.$tertiary-dark;
            }

            .newsletter-description {
                font-size: clamp(0.9rem, 2vw, 1.05rem);
                color: v.$font-color-dark;
            }
        }

        .newsletter-form {
            display: flex;
            gap: 0.5rem;

            input {
                padding: 1rem;
                border: 2px solid rgba(160, 147, 125, 0.5);
                border-radius: 0.5rem;
                font-size: clamp(0.9rem, 2vw, 1.05rem);
                width: 100%;
                max-width: 400px;
            }

            button {
                padding: 1rem 2rem;
                background-color: v.$tertiary-dark;
                color: #fff;
                border: none;
                border-radius: 0.5rem;
                font-size: clamp(0.9rem, 2vw, 1.05rem);
                cursor: pointer;
                transition: background-color 0.1s ease-in-out;

                &:hover {
                    background-color: v.$tertiary;
                }
            }
        }

        .confetti-container {
            position: fixed;
            top: 50vh;
            left: 50vw;
            transform: translate(-50%, -50%);
            z-index: 10;
        }

        .newsletter-privacy {
            font-size: clamp(0.8rem, 2vw, 0.9rem);
            color: v.$font-color-dark;
            text-align: center;
            margin-top: 1rem;
        }
    }
</style>