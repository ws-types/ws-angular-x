
module.exports = {
    evalJson: function (content) {
        try {
            content = JSON.stringify(eval("(" + content + ")"))
            return JSON.parse(content);
        } catch (err) {
            return null;
        }
    },
    requireSafe: function (path, tabLength) {
        tabLength = tabLength || 0;
        let tabs = [];
        for (i = 0; i < tabLength; i++) {
            tabs.push("\t");
        }
        const tab = tabs.join("");
        return `(function(){
    ${tab}try {
        ${tab}return require("${path}");
    ${tab}} catch (e) {
        ${tab}return null;
    ${tab}}
${tab}})()`;
    }
};