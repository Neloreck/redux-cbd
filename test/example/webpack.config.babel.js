import path from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';

const mode = process.env.NODE_ENV;
const projectRoot = path.resolve(__dirname, './');

// For development purposes only.
// Use proper config for production builds.
export class WebpackConfig {

  mode = 'development';

  resolve = {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  };

  entry = [
    path.resolve(projectRoot, 'src/main.ts')
  ];

  output = {
    path: path.resolve(projectRoot, 'target/'),
    filename: 'js/[name].bundle.js',
    sourceMapFilename: 'js/map/[name].bundle.map'
  };

  devtool = 'source-map';

  // Add the loader for .ts files.
  module = {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'awesome-typescript-loader',
        query: {
          configFileName: path.resolve(projectRoot, './tsconfig.json')
        }
      }
    ]
  };

  plugins = [
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'index.html',
      template: path.resolve(projectRoot, 'src/index.html'),
    })
  ];

  devServer = {
    contentBase: 'target/',
    historyApiFallback: true,
    compress: true,
    port: 3000,
    host: '0.0.0.0'
  }

}

export default new WebpackConfig();