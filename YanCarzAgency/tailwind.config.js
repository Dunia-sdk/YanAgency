/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#10b981',
                'primary-hover': '#059669',
                'primary-light': '#d1fae5',
                surface: '#ffffff',
                main: '#1f2937',
                muted: '#6b7280',
                border: '#e5e7eb',
                accent: '#f3f4f6',
                success: '#10b981',
                'status-pending': '#f59e0b',
                'status-confirmed': '#10b981',
                'status-cancelled': '#ef4444',
                'status-completed': '#6366f1',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
