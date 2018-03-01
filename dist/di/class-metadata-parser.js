"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClassMetadataParser = /** @class */ (function () {
    function ClassMetadataParser() {
    }
    ClassMetadataParser.GetES5CtorParamsName = function (fn) {
        var code = fn.toString()
            .replace(ClassMetadataParser.COMMENTS, "")
            .replace(ClassMetadataParser.FAT_ARROWS, "")
            .replace(ClassMetadataParser.DEFAULT_PARAMS, "");
        var result = code.slice(code.indexOf("(") + 1, code.indexOf(")"))
            .match(/([^\s,]+)/g);
        return result === null ? [] : result;
    };
    ClassMetadataParser.GetES6CtorParamsName = function (c) {
        var code = c.toString();
        if (!ClassMetadataParser.CLASS_HEAD.test(code) || !ClassMetadataParser.CTOR_HEAD.test(code)) {
            return null;
        }
        code.replace(ClassMetadataParser.COMMENTS, "")
            .replace(ClassMetadataParser.FAT_ARROWS, "")
            .replace(ClassMetadataParser.DEFAULT_PARAMS, "")
            .replace(ClassMetadataParser.CLASS_HEAD, "");
        var result = code.slice(code.indexOf("(") + 1, code.indexOf(")"))
            .match(/([^\s,]+)/g);
        return result === null ? null : result;
    };
    ClassMetadataParser.COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    ClassMetadataParser.DEFAULT_PARAMS = /=[^,]+/mg;
    ClassMetadataParser.FAT_ARROWS = /=>.*$/mg;
    ClassMetadataParser.CLASS_HEAD = /class.+{/;
    ClassMetadataParser.CTOR_HEAD = /constructor.+{/;
    return ClassMetadataParser;
}());
exports.ClassMetadataParser = ClassMetadataParser;
//# sourceMappingURL=class-metadata-parser.js.map