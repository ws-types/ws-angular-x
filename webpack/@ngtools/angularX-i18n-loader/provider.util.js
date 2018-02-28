const utils = require("./utils");

const injectRegexMuti = /@Injectable\s*\(\s*({[^\)]+})\s*\)/gm;
const injectRegexLine = /@Injectable\s*\(((.+))\)/gm;
const pipeRegexMuti = /@Pipe\s*\(\s*({[^\)]+})\s*\)/gm;
const pipeRegexLine = /@Pipe\s*\(((.+))\)/gm;

function injectableI18n(source, config, ispipe) {
    ispipe = !!ispipe;
    return source.replace(config.regexp, function (match, content) {
        let json = utils.evalJson(content);
        if (!json || json.i18n === false || !json.i18n) {
            return match;
        }
        if (json.i18n === true) {
            json.i18n = {
                ext: config.ext || null,
                root: config.root || null,
                files: {}
            };
        }
        const ext = json.i18n.ext || config.ext || "json";
        const root = json.i18n.root || config.root || "./i18n";
        const files = json.i18n.files || {};
        const filePaths = Object.keys(files).map(key => `"${key}": ${utils.requireSafe(`${root}/${files[key]}.${ext}`)}`);
        (config.support || []).forEach(type => {
            if (!files[type]) {
                filePaths.push(`"${type}": ${utils.requireSafe(`${root}/${type}.${ext}`)}`);
            }
        });
        const res = `
@${ispipe ? "Pipe" : "Injectable"}({
    name:${json.name ? `"${json.name}"` : null},
    i18n: {
        ext: "${ext}",
        root: "${root}",
        files: {
            ${filePaths.join(",\n")}
        }
    }
})`;
        return res;
    });
}

module.exports = {
    injectaable: function (source, config) {

        if (injectRegexLine.test(source)) {
            config.regexp = injectRegexLine;
            source = injectableI18n(source, config, false);
        } else if (injectRegexMuti.test(source)) {
            config.regexp = injectRegexMuti;
            source = injectableI18n(source, config, false);
        }

        return source;
    },
    pipe: function (source, config) {

        if (pipeRegexLine.test(source)) {
            config.regexp = pipeRegexLine;
            source = injectableI18n(source, config, true);
        } else if (pipeRegexMuti.test(source)) {
            config.regexp = pipeRegexMuti;
            source = injectableI18n(source, config, true);
        }

        return source;
    },
};