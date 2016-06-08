module.exports = [
    {
        test: /\.ts(x?)$/,
        loader: 'ts-loader'
    },
    {
        test: /\.scss$/,
        loader: 'style!css!sass'
    },
    {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'raw'
    }
];