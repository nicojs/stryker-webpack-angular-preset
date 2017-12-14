import * as path from 'path';
import { ContextReplacementPlugin, Configuration } from 'webpack';

// Ignore webpack configuration, 
/* istanbul ignore next */
export default (projectRoot: string): Configuration => {
  const config = {
    entry: {
      polyfills: path.join(projectRoot, 'src', 'polyfills.ts'),
      vendor: path.join(projectRoot, '.stryker-tmp', 'stryker-webpack-angular-preset', 'vendor.ts'),
      app: path.join(projectRoot, 'src', 'polyfills'),
      test: path.join(projectRoot, '.stryker-tmp', 'stryker-webpack-angular-preset', 'karma-test-shim.js')
    },

    resolve: {
      extensions: ['.ts', '.js']
    },

    output: {
      path: path.join(projectRoot, 'out'),
      filename: '[name].bundle.js',
      chunkFilename: '[id].chunk.js'
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          loaders: [
            {
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: path.join(projectRoot, 'tsconfig.json')
              }
            }, 'angular2-template-loader'
          ]
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          loader: 'null-loader'
        },
        {
          test: /\.css$/,
          exclude: path.join(projectRoot, 'src', 'app'),
          loader: 'null-loader'
        },
        {
          test: /\.css$/,
          include: path.join(projectRoot, 'src', 'app'),
          loader: 'raw-loader'
        }
      ]
    },

    plugins: [
      new ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)@angular/,
        path.join(projectRoot, 'src'), // location of your src
        {} // a map of your routes
      )
    ]
  };

  return config as Configuration;
}