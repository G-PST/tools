const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {},
  },

  plugins: [require('tw-elements/dist/plugin')],
}

module.exports = config
