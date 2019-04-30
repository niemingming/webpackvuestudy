const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:{
        vendor:'./src/vendor.js',
        index:'./src/main.js'
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename:'[name].js',
        publicPath: ""
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                use:['vue-loader']
            },
            {
                test:/\.js$/,
                use:[
                    'babel-loader'
                ]
            },{
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }]
            }
        ]
    },
    devtool: "eval-source-map",
    devServer: {
        port:8010,
        proxy: {
            '/api/': {
                target: 'http://faq.haier.net',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
    },
    plugins:[
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            "template":"./src/index.html"
        })
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src')
        },
        extensions: ['.js', '.vue', '.json', '.css']
    },
}