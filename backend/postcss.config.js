// The backend uses Tailwind 4 via the official Vite plugin (configured in
// vite.config.js). PostCSS must NOT apply the Tailwind 3 plugin that's
// inherited from the project root's postcss.config.js, so we override it
// with an empty plugin list here.
export default {
    plugins: {},
};
