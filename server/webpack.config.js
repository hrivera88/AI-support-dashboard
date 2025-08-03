const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/lambda.ts',
  target: 'node',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lambda.js',
    libraryTarget: 'commonjs2',
  },
  
  externals: [
    nodeExternals({
      // Include these packages in the bundle
      allowlist: [
        '@vendia/serverless-express',
      ]
    })
  ],
  
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
  },
  
  performance: {
    hints: false,
  },
}