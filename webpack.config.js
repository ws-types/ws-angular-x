const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        vendor: ["angular", "bootstrap", "jquery"],
        index: "./src/index.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        publicPath: "/assets/",
        // library: "ws-angular-x",
        // libraryTarget: "umd",
        pathinfo: true,
        chunkFilename: "[name].chunk.js",
        sourceMapFilename: "[file].map",
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: "./index.html"
        })
    ],
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
        extensions: [".js", ".json", ".ts"],
        alias: {
            "@angular": path.resolve(__dirname, "src/@angular"),
            "@src": path.resolve(__dirname, "src/web-test")
        },
    },
    devtool: "inline-source-map",
    performance: {},
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src/web-test")
                ],
                loader: "babel-loader",
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
}