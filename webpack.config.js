const path = require('path');
const webpack = require('webpack');
const devMode = process.env.NODE_ENV !== 'production';
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: devMode ? 'development' : 'production',
  stats: 'minimal',
  entry: {
    main: path.resolve(__dirname, 'src/js/app.js'),
    gallery: path.resolve(__dirname, 'src/components/gallery/index'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'nick.[name].js',
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parallel: true,
          cache: true,
          ecma: 6,
          output: {
            comments: false,
          },
          warnings: false,
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },

  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: 'app-[contenthash:8].css' }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: './dist',
      files: [
        {
          match: ['**/*.html', 'src/**/*.js', 'src/**/*.{sass, scss}'],
        },
      ],
      injectCss: true,
      notify: false,
    }),
    new HtmlWebpackPlugin({
      publicPath: '/',
      hash: true,
      title: 'testenv',
      template: 'src/index.html',
    }),
  ],
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [require('autoprefixer')];
              },
            },
          },
          {
            loader: 'sass-loader',
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                'src/scss/global/_normalize.scss',
                'src/scss/global/_variables.scss',
                'src/scss/global/_mixins.scss',
                'src/scss/global/_typography.scss',
                'src/scss/global/_elements.scss',
                'src/scss/global/_grid.scss',
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[path][name].[ext]',
            publicPath: '../',
            emitFile: false,
          },
        },
      },
    ],
  },
};
