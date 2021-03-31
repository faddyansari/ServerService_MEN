"use strict";
//Created By Saad Ismail Shaikh 
// 01-08-2018
Object.defineProperty(exports, "__esModule", { value: true });
var MessageTransferEvent_1 = require("./HybridEvents/MessageTransferEvent");
var TypingEvents_1 = require("./HybridEvents/TypingEvents");
var HybridHandlers = /** @class */ (function () {
    function HybridHandlers() {
    }
    HybridHandlers.BindHybridEvents = function (socket, origin) {
        MessageTransferEvent_1.MessageTransferEvent.BindMessageEvents(socket, origin);
        TypingEvents_1.TypingStateEvents.BindTypingStateEvents(socket, origin);
        // CallingEvents.BindCallingEvents(socket, origin);
    };
    return HybridHandlers;
}());
exports.HybridHandlers = HybridHandlers;
//# sourceMappingURL=hybridHandlers.js.map