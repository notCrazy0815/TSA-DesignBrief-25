import { writable, derived } from 'svelte/store';
import type { MenuItem } from '$lib/data/menu/types';

export interface BasketItem extends MenuItem {
  quantity: number;
}

// Helper function to safely parse localStorage data
const getBasketFromLocalStorage = (): BasketItem[] => {
  if (typeof window === 'undefined') return []; // Handle SSR
  
  const storedBasket = localStorage.getItem('verdantia-basket');
  
  if (storedBasket) {
    try {
      return JSON.parse(storedBasket);
    } catch (e) {
      console.error('Error parsing basket from localStorage:', e);
      return [];
    }
  }
  
  return [];
};

// Helper function to save basket to localStorage
const saveBasketToLocalStorage = (basket: BasketItem[]): void => {
  if (typeof window === 'undefined') return; // Handle SSR
  
  try {
    localStorage.setItem('verdantia-basket', JSON.stringify(basket));
  } catch (e) {
    console.error('Error saving basket to localStorage:', e);
  }
};

function createBasketStore() {
  // Initialize with data from localStorage
  const { subscribe, set, update } = writable<BasketItem[]>(getBasketFromLocalStorage());

  return {
    subscribe,
    addToBasket: (item: MenuItem) => {
      update(items => {
        // Check if item already exists in basket
        const existingItem = items.find(i => i.id === item.id);
        
        let updatedItems;
        if (existingItem) {
          // If exists, increment quantity
          updatedItems = items.map(i => 
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          // If not, add new item with quantity 1
          updatedItems = [...items, { ...item, quantity: 1 }];
        }
        
        // Save to localStorage
        saveBasketToLocalStorage(updatedItems);
        return updatedItems;
      });
    },
    removeFromBasket: (itemId: number) => {
      update(items => {
        // Find the item
        const existingItem = items.find(i => i.id === itemId);
        
        if (!existingItem) {
          // Item not in basket, return unchanged
          return items;
        }
        
        let updatedItems;
        if (existingItem.quantity > 1) {
          // If quantity > 1, decrement it
          updatedItems = items.map(i => 
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          );
        } else {
          // If quantity is 1, remove the item completely
          updatedItems = items.filter(i => i.id !== itemId);
        }
        
        // Save to localStorage
        saveBasketToLocalStorage(updatedItems);
        return updatedItems;
      });
    },
    clearBasket: () => {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('verdantia-basket');
      }
      set([]);
    },
    
    // Get item quantity in basket
    getItemQuantity: (itemId: number) => {
      let quantity = 0;
      
      update(items => {
        const item = items.find(i => i.id === itemId);
        quantity = item ? item.quantity : 0;
        return items;
      });
      
      return quantity;
    },
    
    // Update item quantity
    updateItemQuantity: (itemId: number, newQuantity: number) => {
      update(items => {
        let updatedItems;
        if (newQuantity <= 0) {
          updatedItems = items.filter(i => i.id !== itemId);
        } else {
          updatedItems = items.map(i => 
            i.id === itemId ? { ...i, quantity: newQuantity } : i
          );
        }
        
        // Save to localStorage
        saveBasketToLocalStorage(updatedItems);
        return updatedItems;
      });
    },
    
    // Remove item completely
    removeItem: (itemId: number) => {
      update(items => {
        const updatedItems = items.filter(i => i.id !== itemId);
        // Save to localStorage
        saveBasketToLocalStorage(updatedItems);
        return updatedItems;
      });
    }
  };
}

export const basket = createBasketStore();

// Derived store for basket count
export const basketCount = derived(basket, $basket => 
  $basket.reduce((total, item) => total + item.quantity, 0)
);

// Derived store for subtotal
export const basketSubtotal = derived(basket, $basket =>
  $basket.reduce((total, item) => total + (item.price * item.quantity), 0)
);