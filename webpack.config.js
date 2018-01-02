const path = require('path');
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/@angular/index.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "angular-x.js",
        publicPath: "",
        library: "angularX",
        libraryTarget: "umd",
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: 'jquery',
            "window.jQuery": "jquery"
        })
    ],
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
        extensions: [".js", ".json", ".ts"],
        alias: {
            "@angular": path.resolve(__dirname, "src/@angular")
        },
    },
    devtool: "inline-source-map",
    performance: {},
    node: {
        fs: "empty"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
        ]
    }
}