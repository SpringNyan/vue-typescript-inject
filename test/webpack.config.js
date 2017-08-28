module.exports = {
    entry: [
        "./test/test.ts"
    ],
    output: {
        path: __dirname,
        filename: "test.build.js"
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            }
        ]
    },
    devtool: "inline-source-map"
};
