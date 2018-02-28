
module.exports = {
    evalJson: function (content) {
        try {
            content = JSON.stringify(eval("(" + content + ")"))
            return JSON.parse(content);
        } catch (err) {
            return null;
        }
    },
    requireSafe: function (path) {
        return `
(function(){
    try {
        return require("${path}");
    } catch (e) {
        return null;
    }
})()`;
    }
};