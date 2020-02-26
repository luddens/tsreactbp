const StylelintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require("webpack");
const DIST = path.resolve(__dirname, "dist");
const SRC = path.resolve(__dirname, "frontend");

const curEnv = process.env.NODE_ENV;
if (!curEnv || (curEnv!=undefined && curEnv!=null && (curEnv != "development" && curEnv != "production"))) {
  throw `Environment not properly defined. Environment defined as ${curEnv}`;
} else if (curEnv == 'development'){
} else if (curEnv === 'production'){
}

module.exports = {
    mode: curEnv,
    entry: SRC + "/index.tsx",
    devtool: "source-map",
    output: {
      path: DIST,
      filename: "[name].bundle.js",
      // publicPath: DIST,
      devtoolLineToLine: {
        test: /\.jsx$/
      },
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    module: {
      rules: [
        {
            test: /\.s[ac]ss$/i,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
            ],
        },
        {
          test: /\.js$/,
          enforce: 'pre',
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            emitError: true,
            emitWarning: true,
            failOnError: true,
            failOnWarning: false,
            quiet: false,
          },
        },
        {
            test: /\.jsx?$/,
            loader: "babel-loader",
            /*use: [{loader: "loader-loader", options:{
                      
              workerParallelJobs: 50,
              workerNodeArgs: ['--max-old-space-size=1024'],
            }}, "babel-loader"], */
            include: [
              SRC
            ],
            exclude: /(node_modules|bower_components)/,
            enforce: "pre",
            options: {
              cacheDirectory: true,
              presets: ["@babel/preset-react", "@babel/preset-env", "@babel/preset-typescript"],
              plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                ["@babel/plugin-proposal-class-properties", { "loose": true }]
              ]
            },
          },
          {
            test: /\.ts(x?)$/,
            exclude:[/node_modules/, /tests/, /dists/],
            use: [
              {
                loader: 'ts-loader',
                options: {
                   transpileOnly: true,
                   happyPackMode: true,
                //experimentalWatchApi: true,
                },
              },
            ],
          },
          {
            test: /\.js$/,
            use: [
              'source-map-loader'
            ], //use if having difficulty with ts
            enforce: "pre",
            // noParse: files that should not be parsed.
          },
          {
            test: /\.(png|jpe?g|gif)$/i,
            use: [
              {
                loader: 'file-loader',
              },
            ],
          },
      ],
    },
    devServer: {    
      host: 'localhost',
      port: 3000, 
      proxy: {
        '!/': { //don't proxy root
          target: 'http://localhost:8080/',
          ws: false,
          secure: false
        },
        '/**': { //proxy everything else
          target: 'http://localhost:8080/',
          ws: false,
          secure: false,
          changeOrigin: true
        }
      },
      overlay: {
        warnings: true,
        errors: true
      },
      // headers {
      //   "Access-Control-Allow-Origin", "*"
      // }
      // progress: true,
      inline: true,
      contentBase: DIST, // boolean | string | array, static file location
      clientLogLevel: 'none', 
      watchOptions: { 
        ignored: [/node_modules/, /backend/, /tests/]
      },
      historyApiFallback: true, // true for index.html upon 404, object for multiple paths
      hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
      liveReload: false, //is off when hot reload is on, as it causes page reloads
      https: false, // true for self-signed, object for cert authority
      index: DIST + '/index.html',
      quiet: false,
      noInfo: false,
      stats: {
          assets: false,
          children: false,
          chunks: false,
          chunkModules: false,
          colors: true,
          entrypoints: false,
          hash: false,
          modules: false,
          timings: false,
          version: false,
          builtAt: false,
          errors: false,
          errorDetails: false,
          errorStack: false,
          logging: false,
          // loggingDetails: true,
      }
    },
    optimization:{
      // splitChunks:{ //only really need this for production
        
      // }
      runtimeChunk:{
        name: 'manifest'
      },
    },
    // externals: { //only use if including script in index.ejs or index.html and not bundling from node_modules into entry file
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // },
    plugins: [
      new HtmlWebpackPlugin({
        filename: __dirname  + "/dist/index.html",
        template: __dirname  + "/frontend/index.ejs",
        inject: 'body',
        manifest: DIST + "/manifest.bundle.js",
        title:require("./package.json").name
      }),
      new webpack.DefinePlugin({
        // VERSION: JSON.stringify("some string"),
        env: JSON.stringify(process.env.NODE_ENV), //these are frontend globals
      }),
      new StylelintPlugin({
        configFile: __dirname + '/.stylelintrc.json',
        emitWarning: true,
        emitError: true,
        failOnError: false,
        failOnWarning: false,
        quiet: false
      })
    ]
}