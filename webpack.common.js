/* jshint esversion: 6 */
// Plugins
// Exporting common webpack configuration
module.exports = {
  // Entry points
  entry: './source/index.js',

  // Dev tools Configuration
  devtool: 'source-maps',

  // Modules
  module: {
    // Rules
    rules: [
      // Html Module Configuration
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href', 'source:src'],
              interpolate: true,
            },
          },
        ],
      },

      // JOSN Module Configuration. Copies json files to build folder
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/json',
          },
        },
      },

      // Handles requests to '.ico' and '.webmanifest' files inside HTML
      {
        test: /\.(ico|webmanifest)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '.',
          },
        },
      },
    ],
  },
};
