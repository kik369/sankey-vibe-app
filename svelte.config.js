import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        // SvelteKit specific options
    },
    preprocess: vitePreprocess(),
    compilerOptions: {
        // Enable Svelte 5 features
        runes: true,
    },
};

export default config;
