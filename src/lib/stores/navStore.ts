import { writable } from 'svelte/store';

export const shouldAnimate = writable(true);
export const isFirstLoad = writable(true);