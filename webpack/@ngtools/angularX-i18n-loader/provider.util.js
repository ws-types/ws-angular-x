const utils = require("./utils");

const injectRegexMuti = /@Injectable\s*\(\s*({[^\)]+})\s*\)/gm;
const injectRegexLine = /@Injectable\s*\(((.+))\)/gm;

const componentMuti = /@Component\s*\(\s*({[\s\S]*(i18n\s*:\s*(true|false|{[\s\S]+})[\s\S]+)[\s\S]*})\s*\)\s*(export)?\s*class/gm;
const directiveMuti = /@Directive\s*\(\s*({[\s\S]*(i18n\s*:\s*(true|false|{[\s\S]+})[\s\S]+)[\s\S]*})\s*\)\s*(export)?\s*class/gm;

function injectableI18n(source, config, regexp) {
    return source.replace(regexp, function (match, content) {
        let json = utils.evalJson(content);
        if (!json || json.i18n === false || !json.i18n) {
            return match;
        }
        return `
@Injectable({
    name:${json.name ? `"${json.name}"` : null},
    i18n: ${ i18nGenerate(config, json.i18n)}
})`;
    });
}

function componentI18n(source, config, regexp) {
    return source.replace(regexp, function (match, p1, p2, p3, p4, offset, origin) {
        let json = utils.evalJson(p3);
        if (!json || json === false) {
            return match;
        }
        return match.replace(p2, p2.replace(p3, i18nGenerate(config, json)));
    });
};

function i18nGenerate(config, json) {
    if (json === true) {
        json = {
            ext: config.ext || null,
            root: config.root || null,
            files: {}
        };
    }
    const ext = json.ext || config.ext || "json";
    const root = json.root || config.root || "./i18n";
    const alias = json.alias || config.alias || "i18n";
    const files = json.files || {};
    const filePaths = Object.keys(files).map(key => `"${key}": ${utils.requireSafe(`${root}/${files[key]}.${ext}`, 3)}`);
    (config.support || []).forEach(type => {
        if (!files[type]) {
            filePaths.push(`"${type}": ${utils.requireSafe(`${root}/${type}.${ext}`, 3)}`);
        }
    });
    return `{
        ext: "${ext}",
        root: "${root}",
        alias: "${alias}",
        files: {
            ${filePaths.join(",\n\t\t\t")}
        }
    }`;
}

module.exports = {
    injectaable: function (source, config) {
        source = injectableI18n(source, config, injectRegexLine);
        source = injectableI18n(source, config, injectRegexMuti);
        return source;
    },
    component: function (source, config) {
        source = componentI18n(source, config, componentMuti);
        source = componentI18n(source, config, directiveMuti);
        return source;
    }
};