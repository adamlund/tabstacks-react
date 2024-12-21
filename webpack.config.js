const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")
const webpack = require("webpack");
const fs = require("fs");

// Read manifest.json
const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "static/manifest.json"), "utf8")
);

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
      new webpack.DefinePlugin({
          'process.env.MANIFEST_VERSION': JSON.stringify(manifest.version)
      }),
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
