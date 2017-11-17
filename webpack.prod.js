var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require("clean-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var merge = require('webpack-merge');
var common = require('./webpack.common.js');

module.exports = merge(common, {
    output: {
        publicPath: './'
    },
    plugins: [
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }, {
            copyUnmodified: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            warnings: true,
            output: {
                comments: false,
                beautify: true
            },
            compress: {
                warnings: false,
                drop_console: true,
                booleans: false,
                loops: false
            }

        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
});