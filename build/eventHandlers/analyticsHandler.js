"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var analyticsEvents_1 = require("./AnalyticsEvents/analyticsEvents");
var AnalyticsHandler = /** @class */ (function () {
    function AnalyticsHandler() {
    }
    AnalyticsHandler.BindAnalyticsHandler = function (socket, origin) {
        analyticsEvents_1.AnalyticsEvents.BindAnalyticsEvents(socket, origin);
    };
    return AnalyticsHandler;
}());
exports.AnalyticsHandler = AnalyticsHandler;
//# sourceMappingURL=analyticsHandler.js.map