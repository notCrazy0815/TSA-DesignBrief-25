<script lang="ts">
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/all";
    import { onMount } from "svelte";

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        const text = document.querySelectorAll(".footer h1 span");

        gsap.from(text, {
            y: "100%",
            opacity: 0,
            duration: 0.8,
            ease: "power4.out",
            stagger: 0.08,
            scrollTrigger: {
                trigger: ".bottom",
                start: "top 90%",
                toggleActions: "play none none none"
            }
        });
    });
</script>

<div class="footer">
    <div class="footer-content">
        <div class="top">
            <div class="references-and-links">
                <div class="references link-list">
                    <p>References</p>
                    <div class="list">
                        <p>Worklog</p>
                        <p>Copyright Checklist</p>
                        <p>Sources</p>
                    </div>
                </div>
                <div class="links link-list">
                    <p>Links</p>
                    <div class="list">
                        <a href="/">Approach</a>
                        <a href="/menu">Menu</a>
                        <a href="/news">News</a>
                    </div>
                </div>
            </div>
            <div class="divider"></div>
            <div class="copyright">
                <div class="copyright-info">
                    <p>Copyright &copy; 2024-2025 Verdantia</p>
                </div>
                <div class="rights">
                    <p>All rights reserved.</p>
                </div>
            </div>
        </div>
        <div class="bottom">
            <h1>
                <span>V</span>
                <span>e</span>
                <span>r</span>
                <span>d</span>
                <span>a</span>
                <span>n</span>
                <span>t</span>
                <span>i</span>
                <span>a</span>
            </h1>
        </div>
    </div>
</div>

<style lang="scss">
    @use "../styles/variables" as v;
    @use "../styles/global" as g;

    .footer {
        width: 100vw;
        overflow: hidden;

        .footer-content {
            width: 100%;
            display: flex;
            flex-direction: column;

            .top {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                padding: 1rem 2rem;

                .references-and-links {
                    display: flex;
                    justify-content: end;
                    gap: 2.6rem;
                    margin-right: 1.5rem;
                    
                    .link-list {
                        display: flex;
                        flex-direction: column;
                        gap: 0.4rem;

                        p {
                            font-size: clamp(0.8rem, 3vw, 0.95rem);
                        }

                        .list {
                            display: flex;
                            flex-direction: column;
                            gap: 0.2rem;

                            p, a {
                                font-size: clamp(0.7rem, 3vw, 0.85rem);
                                cursor: pointer;

                                &:hover {
                                    text-shadow: 0 0 20px rgba(v.$secondary, 1);
                                }
                            }
                        }
                    }
                }

                .divider {
                    width: 100%;
                    height: 2px;
                    background-color: rgba(v.$font-color-dark, 0.15);
                }

                .copyright {
                    width: 100%;
                    font-size: clamp(0.8rem, 3vw, 0.95rem);
                    color: v.$font-color-dark;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0rem;
                }
            }

            .bottom {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1rem 2rem;
                background-color: v.$secondary;
                gap: 1rem;
                box-shadow: 0 0 15px 0 rgba(v.$secondary, 0.7);

                h1 {
                    display: flex;
                    justify-content: center;
                    color: v.$font-color-light;
                    font-size: clamp(20px, 12vw, 600px);
                    line-height: 1;
                    overflow: hidden;

                    span {
                        display: inline-block;
                    }
                }
            }
        }
    }
</style>