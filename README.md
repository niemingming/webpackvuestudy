# webpackvuestudy
基于webpack搭建vue项目

# 注意事项
目前的前端开发，已经逐步发展成为独立于后端的技术，成为一个单独的开发分支。个人理解，需要理解node.js；webpack；vue分别扮演的角色。

## nodejs
个人理解node.js类似于部分maven功能，用来管理依赖库，并加载他们；初始化命令为
```
npm init
```
一般对应于项目的package.json,这个文件如果和maven对比的话，更像是一个pom文件的作用，指定了本项目的依赖库，一般我们可以本地依赖
npm install name -D表示是开发依赖还是-S正式部署依赖。例如：
```
{
  "name": "element-starter",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "dev": "webpack-dev-server --inline --hot"
  },
  "keywords": [],
  "author": "nmm",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.4.4",
    "autoprefixer": "^9.5.1",
    "babel-loader": "^8.0.5",
    "babel-preset-env": "^1.7.0",
    "babel-preset-es2015": "^6.24.1",
    "clean-webpack-plugin": "^2.0.1",
    "css-loader": "^2.1.1",
    "file-loader": "^3.0.1",
    "html-webpack-plugin": "^3.2.0",
    "lodash": "^4.17.11",
    "postcss-import": "^12.0.1",
    "postcss-loader": "^3.0.0",
    "postcss-preset-env": "^6.6.0",
    "style-loader": "^0.23.1",
    "url-loader": "^1.1.2",
    "vue-template-compiler": "^2.6.10",
    "webpack": "^4.30.0",
    "webpack-cli": "^3.3.1",
    "webpack-dev-server": "^3.3.1"
  },
  "dependencies": {
    "axios": "^0.18.0",
    "element-ui": "^2.8.2",
    "js-md5": "^0.7.3",
    "vue": "^2.6.10",
    "vue-i18n": "^8.11.1",
    "vue-loader": "^15.7.0",
    "vue-router": "^3.0.6"
  }
}

```
这里要着重说明的是dependencies和devDependencies分别是项目的全局依赖和开发环境依赖。我们在开发时可能会用到很多调试工具，但是在正式部署时并不需要他们，
就可以通过这种形式区分开来。我们执行npm install的时候，就会自动加载依赖并初始化。
这里的scripts，对应的是node脚本，以key-value的形式告诉node.js执行什么。例如这里定义的：我们输入npm run dev表示的就是执行
webpack-dev-server --inline--hot命令，当然我们也可以直接在命令行里面输入这段命令，但是这样每次输入一大堆命令太麻烦了。

## webpack
个人理解webpack是一个集成 管理工具，是前端的一个集成工具，有CI的功能，也有部分管理的功能，它通过webpack.config.js配置了前端运行时的依赖和加载解析，
比如配置文件加载器，可以简化js/css/等文件的加载和依赖写法，使他们在形式上更统一。比如配置插件，可以在打包时清理缓存等。操作，下面看一个例子：
```
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
```
这里配置了入口源文件，配置了打包编译输出地址，配置了各类文件的加载器和加载规则，配置了开发时的代理服务器，配置了插件等项目。
如果没有webpack，我们在加载文件时，可能就要还原到原始的方式，使用link、script等标签，与nodejs结合会不太方便。
我们打包也会更加复杂一些，需要自己去选择插件，手动逐文件压缩打包。

## vue
vue个人理解，他就是一套前端组件库或者叫前端开发框架，与react、angular是一样的，他们既可以在nodejs、webpack的集成环境下使用，也可以单独
引入使用。他们在nodejs表现的更像是node的一个插件或者是库。
