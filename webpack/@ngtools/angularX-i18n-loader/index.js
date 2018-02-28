var loaderUtils = require("loader-utils");

var providerLoad = require("./provider.util");

module.exports = function (source, sourcemap) {

    var options = loaderUtils.getOptions(this);
    const config = {
        ext: options.defaultExt || "json",
        root: options.defaultPath,
        support: options.support || ["en-US"],
        default: options.default || "en-US"
    };

    source = providerLoad.injectaable(source, config);
    source = providerLoad.pipe(source, config);
    return source;
};
