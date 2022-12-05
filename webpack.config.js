const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.jsx",
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve("dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      /*Choose only one of the following two: if you're using 
      plain CSS, use the first one, and if you're using a
      preprocessor, in this case SASS, use the second one*/
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.m?js$/,
        type: "javascript/auto",
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "index.html",
    }),
    new webpack.DefinePlugin({
      process: {env: {}}
    })
  ],
};
