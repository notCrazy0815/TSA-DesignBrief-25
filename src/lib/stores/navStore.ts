import { writable } from 'svelte/store';

export const shouldAnimate = writable(true);
export const firstLoad = writable(true);