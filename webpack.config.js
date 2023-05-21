const Path = require("path");

module.exports = {
    mode: "development",
    entry: "./source/index.ts",
    output: {
        path: Path.resolve("public/scripts"),
        filename: "index.js"
    },
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "babel-loader",
                options: {
                    presets: [
                        "@babel/env",
                        "@babel/preset-typescript"
                    ],
                    compact: true
                }
            }
        ]
    },
    cache: {
        type: "filesystem"
    }
};