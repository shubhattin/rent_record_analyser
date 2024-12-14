import { writable } from 'svelte/store';

export let pwa_install_event_fired = writable(false);
export let pwa_event_triggerer = writable<any | null>(null);
