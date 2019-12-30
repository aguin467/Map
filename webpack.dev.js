// Modules
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Webpack Common Configuration
const common = require('./webpack.common');

// List of all '.html'files inside source to generate HtmlWebpackPlugin for each
const pages = fs
  .readdirSync(path.resolve(__dirname, 'source'))
  .filter(fileName => fileName.endsWith('.html'));

// Exporting Development configuration
module.exports = merge(common, {
  // Mode
  mode: 'development',

  // Dev Server Config
  devServer: {
    contentBase: path.join(__dirname, 'build'),
  },

  // Output config
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
  },

  // Plugins
  plugins: [
    // Looping through all '.html' pages and creating HtmlWebpackPlugin for each
    ...pages.map(
      page =>
        new HtmlWebpackPlugin({
          template: `./source/${page}`,
          filename: page,
        }),
    ),
  ],

  // Modules
  module: {
    // Rules
    rules: [
      // SCSS Module Configuration
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },

      // CSS Files Module configuration
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/css',
          },
        },
      },

      // Images Module Configuration
      {
        test: /\.(svg|png|gif|jpg|jpeg)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/img',
          },
        },
      },

      // Fonts Module Configuration
      {
        test: /\.(woff|woff2|eot|ttf)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'assets/fonts/[name].[ext]',
          },
        },
      },

      // Videoes Module Configuration
      {
        test: /\.mp4$/,
        use: [
          {
            loader: require.resolve('file-loader'),
            options: {
              name: 'assets/video/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
});
