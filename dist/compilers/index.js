"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./generators"));
__export(require("./decoretors"));
__export(require("./features/emit"));
var reflect_1 = require("./features/reflect");
exports.$Inject = reflect_1.Inject;
exports.$Injects = reflect_1.Injects;
//# sourceMappingURL=index.js.map