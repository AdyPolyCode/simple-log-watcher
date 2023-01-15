const { resolve, dirname } = require('path');

require('dotenv').config({ path: resolve(dirname(__dirname), '.env') });

module.exports = {
    mode: 'development',
    entry: {
        bundle: resolve(__dirname, 'src/index.js'),
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/dist/',
        clean: true,
    },
    devServer: {
        static: {
            directory: resolve(__dirname, 'public'),
        },
        port: process.env.CLIENT_PORT,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
};
