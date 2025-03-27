export default {
    content: [
        './index.html',
        './src/**/*.{html,js,svelte,ts}',
        './src/styles.css',
    ],
    darkMode: 'selector',
    theme: {
        extend: {
            colors: {
                // Extended blues for gradients
                blue: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                // Matching indigo palette
                indigo: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
            },
            fontWeight: {
                thin: '100',
                extralight: '200',
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '800',
                black: '900',
            },
            borderRadius: {
                xl: '0.75rem',
                '2xl': '1rem',
            },
            transitionDuration: {
                250: '250ms',
                300: '300ms',
                400: '400ms',
            },
            boxShadow: {
                soft: '0 5px 15px 0 rgba(0, 0, 0, 0.05)',
                'soft-lg': '0 10px 25px 0 rgba(0, 0, 0, 0.1)',
            },
            typography: theme => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.700'),
                        a: {
                            color: theme('colors.blue.600'),
                            '&:hover': {
                                color: theme('colors.blue.700'),
                            },
                        },
                    },
                },
                dark: {
                    css: {
                        color: theme('colors.gray.200'),
                        a: {
                            color: theme('colors.blue.400'),
                            '&:hover': {
                                color: theme('colors.blue.300'),
                            },
                        },
                    },
                },
            }),
        },
    },
    plugins: [],
};
