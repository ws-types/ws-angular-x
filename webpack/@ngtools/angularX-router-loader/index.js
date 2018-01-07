let loaderUtils = require('loader-utils');
let path = require('path');
let utils = require('./utils');

module.exports = function (source, sourcemap) {
    this.cacheable && this.cacheable();

    // regex for loadChildren string
    let loadChildrenRegex = /loadChildren: ['|"](.*?)['|"]/gm;

    // parse query params
    let query = loaderUtils.parseQuery(this.query);

    // get query options
    let delimiter = query.delimiter || '#';
    let loader = query.loader || 'require';
    let genDir = query.genDir || '';
    let inline = query.inline || true;
    let debug = query.debug || false;

    // get the filename path
    let resourcePath = this.resourcePath;
    let filename = utils.getFilename(resourcePath);

    let replacedSource = source.replace(loadChildrenRegex, function (match, loadString) {
        // check for query string in loadString
        let queryIndex = loadString.lastIndexOf('?');
        let hasQuery = queryIndex !== -1;
        let loadStringQuery = hasQuery ? loaderUtils.parseQuery(loadString.substr(queryIndex)) : {};
        let sync = !!loadStringQuery.sync;

        // get the module path string
        let pathString = hasQuery ? loadString.substr(0, queryIndex) : loadString;

        // split the string on the delimiter
        let parts = pathString.split(delimiter);

        // get the file path and module name
        let filePath = parts[0];
        let moduleName = (parts[1] || 'default');

        filePath = utils.normalizeFilePath(filePath);

        let replacement = match;

        if (sync) {
            replacement = utils.getSyncLoader(filePath, moduleName, inline);
        } else if (loader === 'system') {
            replacement = utils.getSystemLoader(filePath, moduleName, inline);
        } else {
            replacement = utils.getRequireLoader(filePath, moduleName, inline);
        }

        if (debug) {
            console.log('[angularjs-router-loader]: --DEBUG--');
            console.log('[angularjs-router-loader]: File: ' + resourcePath);
            console.log('[angularjs-router-loader]: Original: ' + match);
            console.log('[angularjs-router-loader]: Replacement: ' + replacement);
        }

        return replacement;
    });

    if (this.callback) {
        this.callback(null, replacedSource, sourcemap);
    } else {
        return replacedSource;
    }
}