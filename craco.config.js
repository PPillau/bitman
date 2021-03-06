const reactHotReloadPlugin = require("craco-plugin-react-hot-reload");

module.exports = {
  plugins: [
    {
      plugin: reactHotReloadPlugin,
    },
  ],
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
