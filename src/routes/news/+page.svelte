<script lang="ts">
    import NavBar from "$lib/components/NavBar.svelte";
    import NewDish from "$lib/components/NewDish.svelte";
    import Newsletter from "$lib/components/Newsletter.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { fly, scale } from 'svelte/transition';
    import { elasticOut } from 'svelte/easing';
    import { voteStore } from "$lib/stores/voteStore";
    
    // Sample data for new dishes
    const newDishes = [
        {
            title: "Artisanal Mushroom Risotto",
            description: "Creamy arborio rice with locally foraged wild mushrooms and truffle oil",
            imageUrl: "mushroom-risotto.jpg", 
            tags: ["new", "seasonal", "gluten-free"]
        },
        {
            title: "Rainbow Buddha Bowl",
            description: "Nutrient-packed bowl with quinoa, roasted vegetables, avocado and tahini dressing",
            imageUrl: "buddha-bowl.jpg",
            tags: ["popular", "protein-rich"]
        },
        {
            title: "Jackfruit Tacos",
            description: "Spicy pulled jackfruit with homemade corn tortillas and lime-cilantro slaw",
            imageUrl: "jackfruit-tacos.jpg",
            tags: ["new", "spicy"]
        }
    ];
    
    // News article data with full content
    const newsArticles = [
        {
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
            initialVotes: { upvotes: 23, downvotes: 2 }
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
            initialVotes: { upvotes: 17, downvotes: 0 }
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
            initialVotes: { upvotes: 42, downvotes: 3 }
        }
    ];
    
    // Modal state
    let showModal = false;
    let selectedArticle = newsArticles[0];
    
    function openArticle(article: any) {
        selectedArticle = article;
        showModal = true;
    }

    // Initialize votes for all articles
    import { onMount } from 'svelte';
    
    onMount(() => {
        // Initialize vote data for all articles with initial dummy values
        newsArticles.forEach(article => {
            voteStore.initArticleWithCounts(
                article.id, 
                article.initialVotes.upvotes, 
                article.initialVotes.downvotes
            );
        });
    });

    // Function to handle votes
    function handleVote(articleId: number, voteType: 'up' | 'down', event: MouseEvent) {
        // Stop the click from propagating to the news card
        // (which would open the modal)
        event.stopPropagation();
        
        if (voteType === 'up') {
            voteStore.upvote(articleId);
        } else {
            voteStore.downvote(articleId);
        }
    }
</script>

<div class="news-page">
    <NavBar active="news" />
    
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
            {@const votes = $voteStore[article.id] || { upvotes: 0, downvotes: 0, userVote: null }}
            <div 
                class="news-card" 
                on:click={() => openArticle(article)}
                in:fly={{ y: 50, delay: i * 100, duration: 500 }}
            >
                <div class="vote-controls">
                    <button 
                        class="vote-btn upvote" 
                        class:active={votes.userVote === 'up'} 
                        on:click={(e) => handleVote(article.id, 'up', e)}
                        aria-label="Upvote"
                    >
                        <span class="vote-icon">▲</span>
                        {#if votes.upvotes > 0}
                            <span class="vote-count">{votes.upvotes}</span>
                        {/if}
                    </button>
                    <button 
                        class="vote-btn downvote" 
                        class:active={votes.userVote === 'down'} 
                        on:click={(e) => handleVote(article.id, 'down', e)}
                        aria-label="Downvote"
                    >
                        <span class="vote-icon">▼</span>
                        {#if votes.downvotes > 0}
                            <span class="vote-count">{votes.downvotes}</span>
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
    
    <Newsletter />
    
    <Modal bind:showModal title={selectedArticle.title}>
        <div class="modal-article">
            <div class="article-date">{selectedArticle.date}</div>
            
            {#if $voteStore[selectedArticle.id]}
                <div class="modal-vote-controls">
                    <button 
                        class="vote-btn upvote" 
                        class:active={$voteStore[selectedArticle.id].userVote === 'up'} 
                        on:click={() => voteStore.upvote(selectedArticle.id)}
                    >
                        <span class="vote-icon">▲</span>
                        {#if $voteStore[selectedArticle.id].upvotes > 0}
                            <span class="vote-count">{$voteStore[selectedArticle.id].upvotes}</span>
                        {/if}
                    </button>
                    <button 
                        class="vote-btn downvote" 
                        class:active={$voteStore[selectedArticle.id].userVote === 'down'} 
                        on:click={() => voteStore.downvote(selectedArticle.id)}
                    >
                        <span class="vote-icon">▼</span>
                        {#if $voteStore[selectedArticle.id].downvotes > 0}
                            <span class="vote-count">{$voteStore[selectedArticle.id].downvotes}</span>
                        {/if}
                    </button>
                    <span class="vote-label">Was this helpful?</span>
                </div>
            {/if}
            
            <div class="article-content">
                {@html selectedArticle.content}
            </div>
        </div>
    </Modal>
</div>

<style lang="scss">
    @use "../../lib/styles/variables" as v;

    * {
        font-family: sans-serif;
    }

    .news-page {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem 4rem;
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

        .dishes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
    }

    .recent-news {
        margin: 4rem 0;

        .news-card {
            background-color: white;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            display: flex;
            gap: 1.5rem;

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

    .vote-controls {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
    }

    .modal-vote-controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 2rem;
        padding: 1rem;
        background-color: rgba(5, 113, 95, 0.05);
        border-radius: 8px;

        .vote-label {
            margin-left: auto;
            font-size: 0.9rem;
            color: v.$tertiary-light;
        }
    }

    .vote-btn {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        background: none;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        color: #666;
        font-family: "Inter 24pt Regular";

        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        &.active {
            font-weight: bold;
            
            &.upvote {
                color: v.$tertiary;
                .vote-icon {
                    color: v.$tertiary;
                }
            }
            
            &.downvote {
                color: v.$primary;
                .vote-icon {
                    color: v.$primary;
                }
            }
        }

        .vote-icon {
            font-size: 0.8rem;
            line-height: 1;
        }
        
        .vote-count {
            font-size: 0.9rem;
        }
    }

    .modal-article {
        .article-date {
            color: v.$tertiary-light;
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
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
    }
    
    @media (max-width: 768px) {
        .news-card {
            flex-direction: column;
            gap: 1rem;
            
            .vote-controls {
                flex-direction: row;
                justify-content: flex-end;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                padding-bottom: 1rem;
            }
        }
    }
</style>