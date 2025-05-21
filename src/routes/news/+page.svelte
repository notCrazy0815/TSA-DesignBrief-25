<script lang="ts">
    import NavBar from "$lib/components/NavBar.svelte";
    import NewDish from "$lib/components/NewDish.svelte";
    import Newsletter from "$lib/components/Newsletter.svelte";
    import { fly, scale, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { likeStore } from "$lib/stores/voteStore";
    import Footer from "$lib/components/Footer.svelte";
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    
    // Sample data for new dishes
    import leafImg from "$lib/assets/news/leaf.png";
    import orangeImg from "$lib/assets/news/orange.png";
    import lavenderImg from "$lib/assets/news/lavender.png";
    import flowerImg from "$lib/assets/news/leaf.png";
    import FooterTopBorder from "$lib/components/FooterTopBorder.svelte";
    import TsaIcon from "$lib/components/TSAIcon.svelte";

    import tomatoSoupImg from "$lib/assets/news/tomato-basil-soup.png";
    import beetTartareImg from "$lib/assets/news/roasted-beet-tartare.png";
    import watermelonSkewersImg from "$lib/assets/news/watermelon-mint-skewers.png";
    
    const newDishes = [
        {
            title: "Tomato Basil Soup",
            description: "Slow‑simmered tomato soup with fresh basil, served warm.",
            imageUrl: tomatoSoupImg,
            tags: ["seasonal", "vegan"]
        },
        {
            title: "Roasted Beet Tartare",
            description: "Finely diced roasted beets with feta, balsamic vinegar and spicy candied walnuts served on fresh arugula.",
            imageUrl: beetTartareImg,
            tags: ["vegan"]
        },
        {
            title: "Watermelon & Mint Skewers",
            description: "Refreshing watermelon cubes paired with vegan feta and fresh mint leaves, drizzled with balsamic reduction.",
            imageUrl: watermelonSkewersImg,
            tags: ["seasonal", "vegan"]
        }
    ];
    
    // News article data with full content
    const newsArticles = [
        {
            id: 1,
            id: 1,
            date: "June 15, 2023",
            title: "Summer Menu Launch Party",
            summary: "Join us this Friday for the launch of our summer menu featuring seasonal produce from local organic farms. Live music, complimentary appetizers, and special cocktails!",
            content: `
                <p>We're excited to announce our <strong>Summer Menu Launch Party</strong> happening this Friday at 7 PM. It's going to be an evening of celebration, featuring the freshest flavors of the season.</p>
                
                <h4>What to Expect:</h4>
                <ul>
                    <li>Tastings of our new summer dishes</li>
                    <li>Organic wine and craft cocktail pairings</li>
                    <li>Live acoustic music from local artist Emma Rivera</li>
                    <li>Meet & greet with our head chef and our local farm partners</li>
                </ul>
                
                <p>This season's menu highlights include watermelon gazpacho, grilled peach and arugula salad, jackfruit carnitas, and our new signature coconut lime cheesecake. Each dish showcases the best organic produce from within 50 miles of our restaurant.</p>
                
                <p>Reservations are recommended as space is limited. Call us at (555) 123-4567 or use our online booking system to secure your spot.</p>
                
                <p>We can't wait to share these exciting new flavors with our community!</p>
            `,
            initialLikes: 23
        },
        {
            id: 2,
            date: "May 30, 2023",
            title: "Chef Ana's Cooking Workshop",
            summary: "Our head chef will be hosting a plant-based cooking workshop next month, teaching you how to create delicious meals using sustainable ingredients. Limited spots available!",
            content: `
                <p>Mark your calendars for June 22nd! Our executive chef Ana Rodriguez will be hosting an exclusive plant-based cooking workshop.</p>
                
                <p>During this 3-hour hands-on experience, you'll learn how to create restaurant-quality vegan dishes in your own home kitchen. Chef Ana will share her techniques for building complex flavors using simple, wholesome ingredients.</p>
                
                <h4>Workshop Details:</h4>
                <ul>
                    <li>Date: June 22, 2023</li>
                    <li>Time: 2:00 PM - 5:00 PM</li>
                    <li>Location: Verdantia Kitchen Studio</li>
                    <li>Cost: $85 per person (includes all ingredients and a recipe booklet)</li>
                </ul>
                
                <h4>You'll Learn How To:</h4>
                <ul>
                    <li>Make creamy plant-based sauces without dairy</li>
                    <li>Create umami-rich vegetable stocks</li>
                    <li>Balance flavors in plant-based dishes</li>
                    <li>Prepare protein-rich meals that satisfy</li>
                </ul>
                
                <p>Each participant will take home detailed recipes and a signed copy of Chef Ana's cookbook "Verdant Table: Celebrating Plants & Planet."</p>
                
                <p>Only 12 spots available for this intimate workshop! Reserve yours today by calling us or visiting the restaurant.</p>
            `,
            initialLikes: 17
        },
        {
            id: 3,
            date: "May 15, 2023",
            title: "New Sustainable Packaging Initiative",
            summary: "We're proud to announce our transition to 100% compostable packaging for all takeaway orders, furthering our commitment to environmental sustainability.",
            content: `
                <p>At Verdantia, our commitment to the planet goes beyond our plant-based menu. Today, we're thrilled to announce that we've completed our transition to 100% compostable packaging for all takeaway orders.</p>
                
                <p>After months of research and testing, we've partnered with GreenEarth Packaging to source containers, utensils, and bags made from plant-based materials that fully decompose within 90 days in commercial composting facilities.</p>
                
                <h4>What's Changed:</h4>
                <ul>
                    <li>All plastic containers replaced with sugarcane fiber alternatives</li>
                    <li>Petroleum-based plastic bags replaced with corn-based bioplastic</li>
                    <li>Plastic utensils replaced with bamboo alternatives</li>
                    <li>Sauce cups now made from plant starches</li>
                </ul>
                
                <p>To make proper disposal easy, we've installed a dedicated composting bin outside our restaurant. Simply bring back your used containers on your next visit, and we'll ensure they're properly composted.</p>
                
                <p>This initiative aligns with our broader sustainability goals, which include reducing our carbon footprint by 50% by 2025 and achieving zero waste to landfill by 2027.</p>
                
                <p>Thank you for supporting our environmental efforts by choosing Verdantia.</p>
            `,
            initialLikes: 42
        }
    ];
    
    // Modal state
    let showModal = false;
    let selectedArticle = newsArticles[0];
    let isClosing = false;
    
    function openArticle(article: any) {
        selectedArticle = article;
        showModal = true;
    }

    function closeModal() {
        isClosing = true;
        setTimeout(() => {
            showModal = false;
            isClosing = false;
        }, 300);
    }

    // Initialize likes for all articles
    
    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Initialize like data for all articles with initial dummy values
        newsArticles.forEach(article => {
            likeStore.initArticleWithCount(
                article.id, 
                article.initialLikes
            );
        });
        
        // GSAP 
        gsap.fromTo(".mega-text", 
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.4,
                scrollTrigger: {
                    trigger: ".news-hero",
                    start: "top 20%",
                    end: "top 80%"
                }
            }
        );
        
        // Animate the dishes on scroll
        gsap.from(".dishes-grid .dish-card", {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".dishes-grid",
                start: "top 80%",
                end: "center center",
                toggleActions: "play none none none"
            }
        });
        
        // Animate news cards on scroll
        gsap.from(".news-card", {
            y: 50,
            opacity: 0,
            duration: 0.5,
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".recent-news",
                start: "top 70%",
                toggleActions: "play none none none"
            }
        });
    });

    // Function to handle likes
    function handleLike(articleId: number, event: MouseEvent) {
        // Stop the click from propagating to the news card
        // (which would open the modal)
        event.stopPropagation();
        likeStore.toggleLike(articleId);
    }
</script>

<TsaIcon />

<div class="news-page-wrapper">
    <div class="news-page">
        <NavBar active="news" />
        
        <div class="news-hero">
            <div class="news-hero-content">
                <h1 class="mega-text">News & Updates</h1>
                <p class="subtitle">Learn about newly released items on our menu and other latest news!</p>
            </div>
        </div>
        
        <section class="featured-dishes">
            <h2>New on our Menu</h2>
            <p class="section-intro">
                Discover our latest plant-based creations, crafted with seasonal ingredients from local farms.
            </p>
            
            <div class="dishes-grid">
                {#each newDishes as dish}
                    <NewDish {dish} />
                {/each}
            </div>
        </section>
        
        <section class="recent-news">
            <h2>Latest News</h2>
            
            {#each newsArticles as article, i}
                {@const likeData = $likeStore[article.id] || { likes: 0, userLiked: false }}
                <div role="article"
                    class="news-card" 
                    on:click={() => openArticle(article)}
                >
                    <div class="like-control">
                        <button 
                            class="like-btn" 
                            class:active={likeData.userLiked} 
                            on:click={(e) => handleLike(article.id, e)}
                            aria-label="Like"
                        >
                            <span class="heart-icon">♥</span>
                            {#if likeData.likes > 0}
                                <span class="like-count">{likeData.likes}</span>
                            {/if}
                        </button>
                    </div>
                    
                    <div class="news-content">
                        <div class="news-date">{article.date}</div>
                        <h3>{article.title}</h3>
                        <p>{article.summary}</p>
                        <span class="read-more">Read more</span>
                    </div>
                </div>
            {/each}
        </section>
        
        <div class="newsletter-container">
            <Newsletter />
        </div>
    </div>

    <FooterTopBorder />
</div>

<Footer />

{#if showModal}
    <div 
        class="modal-overlay" 
        on:click={closeModal}
        transition:fade={{ duration: 250 }}
    >
        <button 
            class="close-button" 
            on:click={closeModal} 
            aria-label="Close"
            in:scale={{delay: 200, duration: 200, start: 0.8}}
            out:scale={{duration: 150}}
        >
            ×
        </button>
        
        <div 
            class="modal-content"
            class:closing={isClosing}
            on:click|stopPropagation={() => {}}
            in:fly={{ y: 30, duration: 350, easing: quintOut }}
            out:fly={{ y: 20, duration: 250 }}
        >
            <div class="modal-header">
                <h2>{selectedArticle.title}</h2>
                <div class="article-date">{selectedArticle.date}</div>
            </div>
            
            {#if $likeStore[selectedArticle.id]}
                <div class="modal-like-control">
                    <button 
                        class="like-btn" 
                        class:active={$likeStore[selectedArticle.id].userLiked} 
                        on:click={() => likeStore.toggleLike(selectedArticle.id)}
                    >
                        <span class="heart-icon">♥</span>
                        {#if $likeStore[selectedArticle.id].likes > 0}
                            <span class="like-count">{$likeStore[selectedArticle.id].likes}</span>
                        {/if}
                    </button>
                    <span class="like-label">Did you find this helpful?</span>
                </div>
            {/if}
            
            <div class="article-content">
                {@html selectedArticle.content}
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    @use "../../lib/styles/variables" as v;

    * {
        font-family: sans-serif;
    }

    .news-page-wrapper {
        width: 100%;
        position: relative;
        overflow: hidden;
        background-color: v.$background-color-light;
        z-index: 3;
    }

    .news-page {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        z-index: 3;
        background-color: v.$background-color-light;
    }

    .news-hero {
        width: 100%;
        padding: 10rem 0rem;
        border-bottom: 2px solid rgba(5, 113, 95, 0.1);
        
        .news-hero-content {
            width: 100%;

            .mega-text {
                font-family: "DynaPuff Regular";
                font-size: clamp(2.5rem, 5vw, 6rem);
                color: v.$tertiary;
                margin: 0;
                text-align: center;
                line-height: 1.2;
                overflow: hidden;
            }

            .subtitle {
                font-family: "Inter 24pt Regular";
                font-size: clamp(0.9rem, 2vw, 1.2rem);
                color: v.$tertiary-dark;
                margin-top: 1rem;
                text-align: center;
            }
        }
    }

    h2 {
        font-family: "DynaPuff Regular";
        color: v.$tertiary;
        font-size: 2.5rem;
        margin: 2rem 0 1rem;
        text-align: center;
    }

    .section-intro {
        text-align: center;
        margin-bottom: 2rem;
        font-size: 1.2rem;
        color: v.$tertiary-dark;
    }

    .featured-dishes {
        margin: 3rem 0;
        padding: 0 1rem 4rem;

        .dishes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
    }

    .recent-news {
        margin: 4rem 0;
        padding: 0 1rem 4rem;

        .news-card {
            padding: 1.5rem;
            margin-bottom: 2rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            display: flex;
            gap: 1.5rem;

            background-color: #fbf9f6;
            border-radius: 1rem;
            border: 2px solid rgba(160, 147, 125, 0.5);
            box-shadow: 0 8px 100px rgba(105, 89, 72, 0.15);

            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            }

            .news-content {
                flex: 1;
            }

            .news-date {
                color: v.$tertiary-light;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            h3 {
                color: v.$tertiary-dark;
                font-family: "DynaPuff Regular";
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }

            p {
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }

            .read-more {
                display: inline-block;
                color: v.$primary;
                font-weight: bold;
                text-decoration: none;
                transition: color 0.3s;
                position: relative;
                padding-right: 1.5rem;

                &::after {
                    content: '→';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    transition: transform 0.3s ease;
                }

                &:hover {
                    color: darken(v.$primary, 10%);
                    
                    &::after {
                        transform: translate(5px, -50%);
                    }
                }
            }
        }
    }

    .like-control {
        display: flex;
        padding: 0.5rem;
        justify-content: center;
    }

    .modal-like-control {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 2rem;
        padding: 1rem;
        background-color: rgba(5, 113, 95, 0.05);
        border-radius: 8px;

        .like-label {
            margin-left: auto;
            font-size: 0.9rem;
            color: v.$tertiary-light;
        }
    }

    .like-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: none;
        border: none;
        padding: 0.5rem 0.75rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #888;
        font-family: "Inter 24pt Regular";
        
        .heart-icon {
            font-size: 1.2rem;
            transition: all 0.3s ease;
            transform-origin: center;
        }
        
        .like-count {
            font-size: 0.95rem;
        }

        &:hover {
            background-color: rgba(252, 98, 52, 0.1);
            .heart-icon {
                color: v.$primary;
            }
        }

        &.active {
            .heart-icon {
                color: v.$primary;
                transform: scale(1.2);
                animation: heart-pulse 0.4s;
            }
            .like-count {
                color: v.$tertiary-dark;
                font-weight: bold;
            }
        }
    }

    @keyframes heart-pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.3);
        }
        100% {
            transform: scale(1.2);
        }
    }
    
    @media (max-width: 768px) {
        .news-card {
            flex-direction: column;
            gap: 1rem;
            
            .like-control {
                align-self: flex-end;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                width: 100%;
                justify-content: flex-end;
            }
        }
    }

    /* Modal Styles */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 20px;
        backdrop-filter: blur(3px);
    }

    .modal-content {
        background-color: white;
        width: 100%;
        max-width: 800px;
        max-height: 90vh;
        border-radius: 8px;
        padding: 30px;
        position: relative;
        overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transform-origin: center;
        transition: transform 0.3s ease, opacity 0.3s ease;

        &.closing {
            transform: scale(0.98);
            opacity: 0.8;
        }

        @media (max-width: 768px) {
            padding: 20px;
            max-height: 80vh;
        }
    }

    .close-button {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        border: none;
        font-size: 22px;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: v.$tertiary;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 20;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        font-weight: 300;

        &:hover {
            background-color: v.$tertiary;
            color: white;
            transform: rotate(90deg) scale(1.1);
        }

        &:active {
            transform: rotate(90deg) scale(0.95);
        }
    }

    .modal-header {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(5, 113, 95, 0.1);
        padding-bottom: 15px;
        
        h2 {
            font-family: "Inter 24pt Regular", sans-serif;
            font-size: 2rem;
            font-weight: 600;
            color: v.$tertiary;
            margin: 0 0 5px 0;
            text-align: left;
        }
        
        .article-date {
            color: v.$tertiary-light;
            font-size: 0.9rem;
        }
    }

    .article-content {
        :global(p) {
            margin-bottom: 1.5rem;
            line-height: 1.7;
        }

        :global(h4) {
            color: v.$tertiary-dark;
            font-family: "DynaPuff Regular";
            font-size: 1.3rem;
            margin: 1.5rem 0 0.8rem;
        }

        :global(ul) {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;

            :global(li) {
                margin-bottom: 0.5rem;
                line-height: 1.5;
            }
        }

        :global(strong) {
            color: v.$tertiary;
        }
    }

    .newsletter-container {
        width: 100%;
        display: flex;
        justify-content: center;
    }
</style>