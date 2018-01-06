const common = require("./webpack.common.js");
const merge = require("webpack-merge");
const path = require("path");

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = merge(common, {
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        publicPath: "",
        pathinfo: true,
        chunkFilename: "[name].chunk.js",
        sourceMapFilename: "[file].map",
    },
    devtool: "source-map",
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
    ]
});