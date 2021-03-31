"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
var CustomError = /** @class */ (function () {
    function CustomError(name, id, message) {
        var e = new Error(message);
        e['id'] = id;
        e['name'] = name;
        return e;
    }
    return CustomError;
}());
exports.CustomError = CustomError;
//# sourceMappingURL=customError.js.map