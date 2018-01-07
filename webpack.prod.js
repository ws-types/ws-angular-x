const common = require("./webpack.common.js");
const merge = require("webpack-merge");
const path = require("path");

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const allReserved = require("./webpack/@ngtools/uglify-reserved");

module.exports = merge(common, {
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[id].[hash].js",
        publicPath: "",
        chunkFilename: "[id].[chunkhash].js"
    },
    plugins: [
        new UglifyJsPlugin({
            uglifyOptions: {
                mangle: {
                    reserved: allReserved.all(allReserved)
                }
            }
        })
    ]
});