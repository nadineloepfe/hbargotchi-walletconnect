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
      'process.env.REACT_APP_PINATA_API_SECRET': JSON.stringify(process.env.REACT_APP_PINATA_API_SECRET),
      'process.env.MY_ACCOUNT_ID': JSON.stringify(process.env.TREASURY_ID),
      'process.env.MY_PRIVATE_KEY': JSON.stringify(process.env.TREASURY_PRIVATE_KEY),
      // 'process.env.WALLETCONNECT_ID': JSON.stringify(process.env.WALLETCONNECT_ID),
      // 'process.env.REACT_APP_FOOD_TOKEN_ID': JSON.stringify(process.env.REACT_APP_FOOD_TOKEN_ID),
      // 'process.env.REACT_APP_FOOD_TOKEN_SUPPLY_KEY': JSON.stringify(process.env.REACT_APP_FOOD_TOKEN_SUPPLY_KEY),
      // 'process.env.REACT_APP_CAT_METADATA': JSON.stringify(process.env.REACT_APP_CAT_METADATA),
      // 'process.env.REACT_APP_FOX_METADATA': JSON.stringify(process.env.REACT_APP_FOX_METADATA),
      // 'process.env.REACT_APP_FROG_METADATA': JSON.stringify(process.env.REACT_APP_FROG_METADATA),
      // 'process.env.REACT_APP_SQUIRREL_METADATA': JSON.stringify(process.env.REACT_APP_SQUIRREL_METADATA),
      // 'process.env.REACT_APP_PENGUIN_METADATA': JSON.stringify(process.env.REACT_APP_PENGUIN_METADATA),
    }),
  ],
};
