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
      'process.env.REACT_APP_TREASURY_ID': JSON.stringify(process.env.REACT_APP_TREASURY_ID),
      'process.env.REACT_APP_TREASURY_PRIVATE_KEY': JSON.stringify(process.env.REACT_APP_TREASURY_PRIVATE_KEY),
      'process.env.REACT_APP_WALLETCONNECT_ID': JSON.stringify(process.env.REACT_APP_WALLETCONNECT_ID),
      'process.env.REACT_APP_TOPIC_ID': JSON.stringify(process.env.REACT_APP_TREASURY_TOPIC_ID),
      'process.env.REACT_APP_FOOD_TOKEN_ID': JSON.stringify(process.env.REACT_APP_FOOD_TOKEN_ID),
      'process.env.REACT_APP_FOOD_TOKEN_SUPPLY_KEY': JSON.stringify(process.env.REACT_APP_FOOD_TOKEN_SUPPLY_KEY),
      'process.env.REACT_APP_FIREBASE_API_KEY': JSON.stringify(process.env.REACT_APP_FIREBASE_API_KEY),
      'process.env.REACT_APP_FIREBASE_MEASURMENT_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_MEASURMENT_ID),
      'process.env.REACT_APP_FIREBASE_APP_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_APP_ID),
      'process.env.REACT_APP_FIREBASE_SENDER_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_SENDER_ID)
    }),
  ],
};
