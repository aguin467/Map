// Modules
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');

// Webpack Plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

// Webpack Common Configuration
const common = require('./webpack.common');

// List of all '.html'files inside source to generate HtmlWebpackPlugin for each
const pages = fs
  .readdirSync(path.resolve(__dirname, 'source'))
  .filter(fileName => fileName.endsWith('.html'));

// Exporting Production configuration
module.exports = merge(common, {
  // Mode
  mode: 'production',

  // Output Config
  output: {
    filename: '[name]-[contentHash].bundle.js',
    path: path.resolve(__dirname, 'build'),
  },

  // Optimization
  optimization: {
    // Minimizer Plugins
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin(),
    ],
  },

  // Plugins
  plugins: [
    // Extract CSS and saves in file
    new MiniCssExtractPlugin({
      filename: '[name]-[contentHash].css',
    }),

    // Cleaning build directory each time when production script is executed
    new CleanWebpackPlugin(),

    // Looping through all '.html' pages and creating HtmlWebpackPlugin for each
    ...pages.map(
      page =>
        new HtmlWebpackPlugin({
          template: `./source/${page}`,
          filename: page,
          minify: {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
          },
        }),
    ),
    // Imports svg files as inline in HTML to prevent extra asset http calls to server
    new HtmlWebpackInlineSVGPlugin(),
  ],

  // Modules
  module: {
    // Rules
    rules: [
      // SCSS Configuration
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },

      // CSS Files Module configuration
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]-[hash].[ext]',
            outputPath: 'assets/css',
          },
        },
      },

      // Pre JavaScript module configuration. Validates the code with eslint config
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },

      // JavaScript Module configuration. Compiles the JS code to Vanialla JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },

      // Images Module Configuration
      {
        test: /\.(gif|png|jpg|jpeg|svg)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash].[ext]',
              outputPath: 'assets/img',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 85,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },

      // Fonts Module configuration
      {
        test: /\.(woff|woff2|eot|ttf)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1000,
            name: '/assets/fonts/[name]-[hash].[ext]',
          },
        },
      },

      // Video-file Modules Configuration
      {
        test: /\.mp4$/,
        use: [
          {
            loader: require.resolve('file-loader'),
            options: {
              name: 'assets/video/[name]-[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
});
