const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  entry: {},
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'scripts/[name].js',
    publicPath: '/',
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: 'dist',
    historyApiFallback: {
      index: '/',
    },
    port: 8081,
    compress: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.pug$/i,
        loader: 'pug-loader',
        options: {
          root: path.resolve(__dirname, 'src'), // to make alias work
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
              esModules: false,
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg)$/i,
        include: path.resolve(__dirname, 'src/fonts'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new LodashModuleReplacementPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
  resolve: {
    alias: {
      _: path.resolve(__dirname, 'src/'),
    },
  },
};

const pages = [];

fs.readdirSync(path.resolve(__dirname, 'src', 'pages'))
  .filter((file) => {
    return file.indexOf('base') !== 0;
  })
  .forEach((file) => {
    pages.push(file.split('/', 2));
  });

pages.forEach((fileName) => {
  let fileChunks = [];

  ['js', 'scss'].forEach((type) => {
    let entryFile = `./src/pages/${fileName}/${fileName}.${type}`;
    if (fs.existsSync(entryFile)) {
      fileChunks.push(entryFile);
    }
  });

  if (fileChunks.length) {
    config.entry[fileName] = fileChunks;
  }

  config.plugins.push(
    new HtmlWebpackPlugin({
      filename: `${fileName}.html`,
      template: `src/pages/${fileName}/${fileName}.pug`,
      chunks: fileName,
    }),
  );
});

module.exports = config;
