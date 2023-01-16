const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");

const browserConfig = {
    entry: "./src/App.js",
    output: {
        path: __dirname,
        filename: "./bundle.js"
    },
    devtool: "cheap-module-source-map",
    module: {
        rules: [
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'public/media/fonts'
                        }
                    }
                ]
            },
            {
                test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: "file-loader",
                options: {
                    name: "public/media/[name].[ext]",
                    publicPath: url => url.replace(/public/, "")
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: { importLoaders: 1 }
                        },
                        {
                            loader: "postcss-loader",
                            options: { plugins: [autoprefixer()] }
                        }
                    ]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /js$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                query: { presets: ["react-app"] }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "public/css/[name].css"
        })
    ]
};

module.exports = [browserConfig];