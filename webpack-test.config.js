const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const cssObjectLoader = path.resolve(__dirname, "./webpack/@ngtools/css-object-loader.js");

module.exports = {
    entry: {
        vendor: [
            "angular",
            "bootstrap",
            "jquery",
            "angular-animate",
            "@uirouter/angularjs",
            "reflect-metadata",
            "rxjs",
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
        }),
        new ForkTsCheckerWebpackPlugin()
    ],
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
        extensions: [".js", ".json", ".ts"],
        alias: {
            "@src": path.resolve(__dirname, "src/web-test")
        },
    },
    devtool: "source-map",
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
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['stage-0'],
                }
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true
                }
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