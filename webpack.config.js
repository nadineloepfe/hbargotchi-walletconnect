const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv').config(); 

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      "fs": false,
      "net": false,
      "tls": false,
      "os": false,  
      "crypto": false
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_PINATA_API_KEY': JSON.stringify(process.env.REACT_APP_PINATA_API_KEY),
      'process.env.REACT_APP_PINATA_API_SECRET': JSON.stringify(process.env.REACT_APP_PINATA_API_SECRET)
    }),
  ],
};
