import { writable, derived } from 'svelte/store';
import type { MenuItem } from '$lib/data/menu/types';

export interface BasketItem extends MenuItem {
  quantity: number;
}

function createBasketStore() {
  const { subscribe, set, update } = writable<BasketItem[]>([]);

  return {
    subscribe,
    addToBasket: (item: MenuItem) => {
      update(items => {
        // Check if item already exists in basket
        const existingItem = items.find(i => i.id === item.id);
        
        if (existingItem) {
          // If exists, increment quantity
          return items.map(i => 
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          // If not, add new item with quantity 1
          return [...items, { ...item, quantity: 1 }];
        }
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
        
        if (existingItem.quantity > 1) {
          // If quantity > 1, decrement it
          return items.map(i => 
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          );
        } else {
          // If quantity is 1, remove the item completely
          return items.filter(i => i.id !== itemId);
        }
      });
    },
    clearBasket: () => {
      set([]);
    },
    
    // New helper to get item quantity in basket
    getItemQuantity: (itemId: number) => {
      let quantity = 0;
      
      update(items => {
        const item = items.find(i => i.id === itemId);
        quantity = item ? item.quantity : 0;
        return items;
      });
      
      return quantity;
    },
    // Add updateItemQuantity method
    updateItemQuantity: (itemId: number, newQuantity: number) => {
      update(items => {
        if (newQuantity <= 0) {
          return items.filter(i => i.id !== itemId);
        }
        return items.map(i => 
          i.id === itemId ? { ...i, quantity: newQuantity } : i
        );
      });
    },
    // Add removeItem method
    removeItem: (itemId: number) => {
      update(items => items.filter(i => i.id !== itemId));
    }
  };
}

export const basket = createBasketStore();

// Add derived store for basket count
export const basketCount = derived(basket, $basket => 
  $basket.reduce((total, item) => total + item.quantity, 0)
);