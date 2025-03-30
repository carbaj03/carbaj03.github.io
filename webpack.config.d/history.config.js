const path = require("path");

// The Kotlin plugin generates a base "config" object for Webpack.
// We can modify it here:
if (config.devServer) {
    // Enable history API fallback
    config.devServer.historyApiFallback = true;

    // (Optional) set or override other dev server settings:
    config.devServer.port = 8080;    // or your preferred port
    config.devServer.open = true;   // don't auto-open browser, if desired

    // If you need to set a custom directory for static content:
    // config.devServer.static = {
    //     directory: path.resolve(__dirname, "../../processedResources/js/main"),
    // };
}