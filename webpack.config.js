const path = require("path");
const webpack = require("webpack");

module.exports = (env = {}) => {

    const {mode = "production"} = env;
    let config;

    config = {
        mode: mode,
        output: {
            filename: mode === "development" ? "crud.js" : "crud.min.js"
        },
        externals: {
            "jquery": "jQuery",
            "lodash": "_"
        }
    }

    return config;

}