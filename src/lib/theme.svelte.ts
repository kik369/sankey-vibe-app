import { writable, type Writable } from 'svelte/store';

type Theme = 'light' | 'dark';

// Function to create the theme store
function createThemeStore(): Writable<Theme> & { toggle: () => void } {
    // Default value, will be overwritten client-side
    const initialValue: Theme = 'light';
    const { subscribe, set, update } = writable<Theme>(initialValue);

    // --- Client-side only logic ---
    if (typeof window !== 'undefined') {
        // 1. Determine initial theme client-side
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const clientInitialTheme = storedTheme ?? (userPrefersDark ? 'dark' : 'light');

        // 2. Set the store's value client-side
        set(clientInitialTheme);

        // 3. Subscribe to store changes to update DOM and localStorage
        subscribe((theme) => {
            const root = document.documentElement;
            if (theme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }

            // Force a repaint to ensure theme changes apply everywhere
            document.body.style.display = 'none';
            setTimeout(() => {
                document.body.style.display = '';
            }, 5);

            try {
                localStorage.setItem('theme', theme);
            } catch (error) {
                console.error('Failed to save theme to localStorage:', error);
            }
        });

        // 4. Listen for OS theme changes (optional, but good UX)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only update if no theme is explicitly stored by the user
            if (!localStorage.getItem('theme')) {
                set(e.matches ? 'dark' : 'light');
            }
        });
    }
    // --- End Client-side only logic ---

    // Return the store interface, adding a toggle method
    return {
        subscribe,
        set,
        update,
        // Custom method to toggle
        toggle: () => {
            update((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
        },
    };
}

// Export a singleton instance of the store
export const themeStore = createThemeStore();

// Re-export the type for convenience
export type { Theme };
