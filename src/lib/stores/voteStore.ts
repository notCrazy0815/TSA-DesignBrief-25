import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Define the structure for our likes
type ArticleLikes = {
    [articleId: number]: {
        likes: number;
        userLiked: boolean;
    }
};

// Initialize store with data from localStorage if available
const storedLikes = browser ? localStorage.getItem('articleLikes') : null;
const initialLikes: ArticleLikes = storedLikes ? JSON.parse(storedLikes) : {};

const createLikeStore = () => {
    const { subscribe, update } = writable<ArticleLikes>(initialLikes);

    return {
        subscribe,
        
        // Toggle like for an article
        toggleLike: (articleId: number) => {
            update(likes => {
                // Initialize article if it doesn't exist
                if (!likes[articleId]) {
                    likes[articleId] = { likes: 0, userLiked: false };
                }
                
                // Toggle the like status
                if (likes[articleId].userLiked) {
                    // User is unliking
                    likes[articleId].likes = Math.max(0, likes[articleId].likes - 1);
                    likes[articleId].userLiked = false;
                } else {
                    // User is liking
                    likes[articleId].likes += 1;
                    likes[articleId].userLiked = true;
                }
                
                // Save to localStorage
                if (browser) {
                    localStorage.setItem('articleLikes', JSON.stringify(likes));
                }
                
                return likes;
            });
        },
        
        // Initialize an article with no likes if it doesn't exist yet
        initArticle: (articleId: number) => {
            update(likes => {
                if (!likes[articleId]) {
                    likes[articleId] = { likes: 0, userLiked: false };
                    
                    if (browser) {
                        localStorage.setItem('articleLikes', JSON.stringify(likes));
                    }
                }
                return likes;
            });
        },
        
        // Initialize an article with specified like count if it doesn't exist yet
        initArticleWithCount: (articleId: number, likeCount: number = 0) => {
            update(likes => {
                // Only initialize with these counts if the article doesn't exist in localStorage yet
                if (!likes[articleId]) {
                    likes[articleId] = { 
                        likes: likeCount, 
                        userLiked: false 
                    };
                    
                    if (browser) {
                        localStorage.setItem('articleLikes', JSON.stringify(likes));
                    }
                }
                return likes;
            });
        }
    };
};

export const likeStore = createLikeStore();
