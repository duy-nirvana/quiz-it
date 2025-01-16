/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    corePlugins: {
        preflight: true,
    },
    theme: {
        extend: {
            colors: {
                'lime-6': 'var(--checkbox-color)',
            },
        },
    },
    plugins: [],
};
