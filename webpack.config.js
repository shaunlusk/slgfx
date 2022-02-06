const path = require('path');

module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  entry: {
    index: './src/index.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'bundle'),
    library: 'slgfx',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
};