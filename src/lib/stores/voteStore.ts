import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Define the structure for our votes
type ArticleVotes = {
    [articleId: number]: {
        upvotes: number;
        downvotes: number;
        userVote: 'up' | 'down' | null;
    }
};

// Initialize store with data from localStorage if available
const storedVotes = browser ? localStorage.getItem('articleVotes') : null;
const initialVotes: ArticleVotes = storedVotes ? JSON.parse(storedVotes) : {};

const createVoteStore = () => {
    const { subscribe, update } = writable<ArticleVotes>(initialVotes);

    return {
        subscribe,
        
        // Handle upvotes
        upvote: (articleId: number) => {
            update(votes => {
                // Initialize article if it doesn't exist
                if (!votes[articleId]) {
                    votes[articleId] = { upvotes: 0, downvotes: 0, userVote: null };
                }
                
                // Update vote counts based on previous user action
                if (votes[articleId].userVote === 'up') {
                    // User is removing their upvote
                    votes[articleId].upvotes = Math.max(0, votes[articleId].upvotes - 1);
                    votes[articleId].userVote = null;
                } else {
                    // User is adding an upvote
                    votes[articleId].upvotes += 1;
                    
                    // If they previously downvoted, remove that downvote
                    if (votes[articleId].userVote === 'down') {
                        votes[articleId].downvotes = Math.max(0, votes[articleId].downvotes - 1);
                    }
                    
                    votes[articleId].userVote = 'up';
                }
                
                // Save to localStorage
                if (browser) {
                    localStorage.setItem('articleVotes', JSON.stringify(votes));
                }
                
                return votes;
            });
        },
        
        // Handle downvotes
        downvote: (articleId: number) => {
            update(votes => {
                // Initialize article if it doesn't exist
                if (!votes[articleId]) {
                    votes[articleId] = { upvotes: 0, downvotes: 0, userVote: null };
                }
                
                // Update vote counts based on previous user action
                if (votes[articleId].userVote === 'down') {
                    // User is removing their downvote
                    votes[articleId].downvotes = Math.max(0, votes[articleId].downvotes - 1);
                    votes[articleId].userVote = null;
                } else {
                    // User is adding a downvote
                    votes[articleId].downvotes += 1;
                    
                    // If they previously upvoted, remove that upvote
                    if (votes[articleId].userVote === 'up') {
                        votes[articleId].upvotes = Math.max(0, votes[articleId].upvotes - 1);
                    }
                    
                    votes[articleId].userVote = 'down';
                }
                
                // Save to localStorage
                if (browser) {
                    localStorage.setItem('articleVotes', JSON.stringify(votes));
                }
                
                return votes;
            });
        },
        
        // Initialize an article with no votes if it doesn't exist yet
        initArticle: (articleId: number) => {
            update(votes => {
                if (!votes[articleId]) {
                    votes[articleId] = { upvotes: 0, downvotes: 0, userVote: null };
                    
                    if (browser) {
                        localStorage.setItem('articleVotes', JSON.stringify(votes));
                    }
                }
                return votes;
            });
        },
        
        // Initialize an article with specific vote counts if it doesn't exist yet
        initArticleWithCounts: (articleId: number, upvotes: number = 0, downvotes: number = 0) => {
            update(votes => {
                // Only initialize with these counts if the article doesn't exist in localStorage yet
                if (!votes[articleId]) {
                    votes[articleId] = { 
                        upvotes: upvotes, 
                        downvotes: downvotes, 
                        userVote: null 
                    };
                    
                    if (browser) {
                        localStorage.setItem('articleVotes', JSON.stringify(votes));
                    }
                }
                return votes;
            });
        }
    };
};

export const voteStore = createVoteStore();
