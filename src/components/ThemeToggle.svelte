<script lang="ts">
    // Import the store instance instead of the class/manager
    import { themeStore } from '@/lib/theme.svelte.ts';
</script>

<button
    onclick={() => themeStore.toggle()}
    class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 transform hover:scale-105 shadow-sm"
    aria-label="Toggle theme"
>
    {#if $themeStore === 'light'}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-indigo-600 dark:text-indigo-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <title>Switch to Dark Mode</title>
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
        </svg>
    {:else}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-yellow-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
            <title>Switch to Light Mode</title>
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
        </svg>
    {/if}
</button>
