var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './index.js',

    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].[chunkhash].js',
        chunkFilename: '[chunkhash].js'
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['manifest']
        }),

        new HtmlWebpackPlugin({
            excludeChunks: ['manifest']
        })
    ]
};