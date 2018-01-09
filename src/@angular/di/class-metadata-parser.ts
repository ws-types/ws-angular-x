
export class ClassMetadataParser {

    static COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    static DEFAULT_PARAMS = /=[^,]+/mg;
    static FAT_ARROWS = /=>.*$/mg;
    static CLASS_HEAD = /class.+{/;
    static CTOR_HEAD = /constructor.+{/;

    static GetES5CtorParamsName(fn): string[] {
        const code = fn.toString()
            .replace(ClassMetadataParser.COMMENTS, "")
            .replace(ClassMetadataParser.FAT_ARROWS, "")
            .replace(ClassMetadataParser.DEFAULT_PARAMS, "");

        const result = code.slice(code.indexOf("(") + 1, code.indexOf(")"))
            .match(/([^\s,]+)/g);

        return result === null ? [] : result;
    }

    static GetES6CtorParamsName(c) {
        const code = c.toString();
        if (!ClassMetadataParser.CLASS_HEAD.test(code) || !ClassMetadataParser.CTOR_HEAD.test(code)) {
            return null;
        }
        code.replace(ClassMetadataParser.COMMENTS, "")
            .replace(ClassMetadataParser.FAT_ARROWS, "")
            .replace(ClassMetadataParser.DEFAULT_PARAMS, "")
            .replace(ClassMetadataParser.CLASS_HEAD, "");
        const result = code.slice(code.indexOf("(") + 1, code.indexOf(")"))
            .match(/([^\s,]+)/g);
        return result === null ? null : result;
    }

}
