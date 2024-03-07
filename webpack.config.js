const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: {
        index: "./src/index.tsx"
    },
    mode: "production",
    module: {
        rules: [
            {
              test: /\.tsx?$/,
               use: [
                 {
                  loader: "ts-loader",
                   options: {
                     compilerOptions: { noEmit: false },
                    }
                  }],
               exclude: /node_modules/,
            },
            {
              exclude: /node_modules/,
              test: /\.css$/i,
               use: [
                  "style-loader",
                  "css-loader"
               ]
            },
        ],
    },
    plugins: [
      new CopyPlugin({
          patterns: [
              { from: "./static/manifest.json", to: "./manifest.json" },
              { from: "./static/img", to: "./img" },
          ],
      }),
      new HTMLPlugin({
        template: "./static/index.html",
        filename: "index.html",
        chunks: ["index"],
      }),
      new HTMLPlugin({
          template: "./static/options.html",
          filename: "options.html",
          chunks: ["index"],
      }),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "js/[name].js",
    },
};
