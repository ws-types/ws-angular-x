const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const cssObjectLoader = path.resolve(__dirname, "./webpack/@ngtools/css-object-loader.js");

module.exports = {
    entry: {
        vendor: [
            "angular",
            "bootstrap",
            "jquery",
            "reflect-metadata",
            "uuid",
            "decamelize",
            "camelcase"
        ],
        index: "./src/web-test/index.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        publicPath: "",
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
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            chunks: ['index']
        }),
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
            "@angular": path.resolve(__dirname, "src/@angular"),
            "@src": path.resolve(__dirname, "src/web-test")
        },
    },
    devtool: "inline-source-map",
    performance: {},
    devServer: {
        contentBase: './dist'
    },
    node: {
        fs: "empty"
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
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    // 'style-loader',
                    cssObjectLoader,
                    // 'exports-loader?=module.exports.toString()',
                    'css-loader'
                ]
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    // 'style-loader',
                    // 'exports-loader?=module.exports.toString()',
                    cssObjectLoader,
                    // 'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                include: [path.resolve(__dirname, "index.html")],
                test: /\.html$/,
                use: [
                    "raw-loader"
                ]
            },
            {
                include: [path.resolve(__dirname, "src/web-test")],
                test: /\.html$/,
                use: [
                    "html-loader"
                ]
            }
        ]
    }
}