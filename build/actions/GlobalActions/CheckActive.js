"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeActive = void 0;
var sessionsManager_1 = require("../../globals/server/sessionsManager");
function MakeActive(session, data) {
    return __awaiter(this, void 0, void 0, function () {
        var activeSession, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, sessionsManager_1.SessionManager.MarkReActivate((session.id || session._id), data)];
                case 1:
                    activeSession = _a.sent();
                    if (activeSession && activeSession.value)
                        return [2 /*return*/, activeSession.value];
                    else
                        return [2 /*return*/, undefined];
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    console.log('Error in Check Active');
                    return [2 /*return*/, undefined];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.MakeActive = MakeActive;
// export async function MakeActive(session: VisitorSessionSchema, data?: any): Promise<VisitorSessionSchema | undefined> {
//     try {
//         console.log('Make Active');
//         let activeSession = await SessionManager.UpdateLastTouchedTime((session.id || session._id) as string, data);
//         if (activeSession) return activeSession.value as VisitorSessionSchema;
//         else return undefined;
//     } catch (error) {
//         console.log(error);
//         console.log('Error in Check Active');
//         return undefined;
//         // console.log(session.state);
//     }
// }
//#region Old_Code
// export async function MakeActive(session: VisitorSessionSchema) {
//     try {
//         console.log('Make Active');
//         let visitor: any;
//         let allAgents: any;
//         let activeSession = await SessionManager.UpdateLastTouchedTime((session.id || session._id) as string);
//         if (activeSession && activeSession.value) {
//             let origin = await Company.getSettings(activeSession.value.nsp);
//             switch (activeSession.value.state) {
//                 case 1:
//                 case 5:
//                     /**
//                      * @Procedure :
//                      * 1. If Inactive then Change to Active
//                      */
//                     break;
//                 case 2:
//                     /**
//                      * @Procedure :
//                      * 1. If Inactive then Change to Active
//                      * 2. Check if Agent is Available. 
//                      * 3. If Agent is available then Connect to Agent
//                      * 4. Else Do Nothing
//                      */
//                     allAgents = await SessionManager.GetAllActiveAgentsChatting(activeSession.value);
//                     if (allAgents) {
//                         await AssignChatToVisitorAuto(activeSession.value);
//                     }
//                     //Else Send No Agent
//                     break;
//                 case 3:
//                     /**
//                      * @Procedure :
//                      * 1. If Inactive then Change to Active
//                      * 2. Check if Old Agent is Available. 
//                      * 3. If Old Agent is available then Connect to Agent
//                      * 4. Find Best Agent.
//                      * 5. If Best Agent Found then Assign to it.
//                      * 6. eles move to Unassigned Chat.
//                      */
//                     /**
//                     * @Cases
//                     * 1. If Visitor Previous he/she was talking to not available
//                     * 2. If Priority Agent Is set && Available.
//                     * 3. If Priority rule Matched Assign to Priority Agent
//                     * 4. If No rule Mathed Then Assign to New Random Agent
//                     * 5. If No Agent Found Then Move To unAssigned.
//                     */
//                     allAgents = await SessionManager.GetAllActiveAgentsChatting(activeSession.value);
//                     if (!allAgents) {
//                         /**
//                          * @Case 5
//                          */
//                         let pendingVisitor = await SessionManager.UnseAgentFromVisitor(activeSession.value.id || activeSession.value._id);
//                         if (pendingVisitor) {
//                             let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: activeSession.value.agent.name })
//                             let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (activeSession.value._id) ? activeSession.value._id : activeSession.value.id);
//                             // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                             let promises = await Promise.all([
//                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'V', broadcast: false, eventName: 'noAgent', nsp: activeSession.value.nsp, roomName: [(activeSession.value.id || activeSession.value._id)], data: { state: 2, agent: pendingVisitor.agent } }),
//                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: activeSession.value.nsp, roomName: [Agents.NotifyAll()], data: { id: pendingVisitor.id, session: pendingVisitor } })
//                             ])
//                             let updatedConversation = await Conversations.UpdateConversationState(pendingVisitor.conversationID, 1, false);
//                             if (updatedConversation) {
//                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: activeSession.value.nsp, roomName: [Agents.NotifyOne(activeSession.value)], data: { conversation: updatedConversation.value } });
//                             }
//                         }
//                     } else {
//                         /**
//                         * @Cases
//                         * 1. If Visitor Previous he/she was talking to not available
//                         * 2. If Priority Agent Is set && Available.
//                         * 3. If Priority rule Matched Assign to Priority Agent
//                         * 4. If No rule Mathed Then Assign to New Random Agent
//                         */
//                         let agent = await SessionManager.GetAgentByID(activeSession.value.agent.id);
//                         let assignedAgent: any = undefined;
//                         if (agent && agent.acceptingChats && !assignedAgent) assignedAgent = await AssignChatFromInactive(activeSession.value, agent.email)
//                         else if (origin && origin.length && origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim() && !assignedAgent)
//                             assignedAgent = await AssignChatFromInactive(activeSession.value, origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim());
//                         else if (!assignedAgent) { assignedAgent = await AssignChatFromInactive(activeSession.value); }
//                         if (!assignedAgent) {
//                             let pendingVisitor = await SessionManager.UnseAgentFromVisitor(activeSession.value.id || activeSession.value._id);
//                             if (pendingVisitor) {
//                                 let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: activeSession.value.agent.name })
//                                 let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (activeSession.value._id) ? activeSession.value._id : activeSession.value.id);
//                                 // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                 let promises = await Promise.all([
//                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: activeSession.value.nsp, roomName: [(activeSession.value.id || activeSession.value._id)], data: { state: 2, agent: pendingVisitor.agent } }),
//                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: activeSession.value.nsp, roomName: [Agents.NotifyAll()], data: { id: pendingVisitor.id, session: pendingVisitor } })
//                                 ]);
//                                 let updatedConversation = await Conversations.UpdateConversationState(pendingVisitor.conversationID, 1, false);
//                                 if (updatedConversation) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'removeConversation', nsp: activeSession.value.nsp, roomName: [Agents.NotifyOne(activeSession.value)], data: { conversation: updatedConversation.value } });
//                             }
//                         }
//                     }
//                     break;
//                 case 4:
//                     /**
//                      * @Cases
//                      * 1. If Agent Who Invited is available Resume to Same Agent.
//                      * 2. Else Close Conversation and move to Browsing
//                      */
//                     allAgents = await SessionManager.GetAllActiveAgentsChatting(activeSession.value);
//                     if (!allAgents) {
//                         /**
//                          * @Case 5
//                          */
//                         let pendingVisitor = await SessionManager.UnseAgentFromVisitor(activeSession.value.id || activeSession.value._id);
//                         if (pendingVisitor) {
//                             let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: activeSession.value.agent.name })
//                             let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (activeSession.value._id) ? activeSession.value._id : activeSession.value.id);
//                             // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                             let promises = await Promise.all([
//                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: activeSession.value.nsp, roomName: [(activeSession.value.id || activeSession.value._id)], data: { state: 2, agent: pendingVisitor.agent } }),
//                                 await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: activeSession.value.nsp, roomName: [Agents.NotifyAll()], data: { id: pendingVisitor.id, session: pendingVisitor } })
//                             ]);
//                             let updatedConversation = await Conversations.UpdateConversationState(pendingVisitor.conversationID, 1, false);
//                             if (updatedConversation) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeConversation', nsp: activeSession.value.nsp, roomName: [Agents.NotifyOne(activeSession.value)], data: { conversation: updatedConversation.value } });
//                         }
//                     } else {
//                         /**
//                         * @Cases
//                         * 1. If Visitor Previous he/she was talking to not available
//                         * 2. If Priority Agent Is set && Available.
//                         * 3. If Priority rule Matched Assign to Priority Agent
//                         * 4. If No rule Mathed Then Assign to New Random Agent
//                         */
//                         let agent = await SessionManager.GetAgentByID(activeSession.value.agent.id);
//                         let assignedAgent: any = undefined;
//                         if (agent && agent.acceptingChats && !assignedAgent) {
//                             assignedAgent = await AssignChatFromInactive(activeSession.value, agent.email, activeSession.value.state);
//                         }
//                         else if (origin && origin.length && origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim()) {
//                             assignedAgent = await AssignChatFromInactive(activeSession.value, origin[0]['settings']['chatSettings']['assignments'].priorityAgent.trim(), activeSession.value.state);
//                         }
//                         else {
//                             assignedAgent = await AssignChatFromInactive(activeSession.value, '', activeSession.value.state);
//                         }
//                         if (!assignedAgent) {
//                             let pendingVisitor = await SessionManager.UnseAgentFromVisitor(activeSession.value.id || activeSession.value._id);
//                             if (pendingVisitor) {
//                                 let queEvent = ComposedENUM(DynamicEventLogs.VISITOR_UNASSIGNED, { newEmail: '', oldEmail: activeSession.value.agent.name })
//                                 let logEvent = await __biZZC_SQS.SendEventLog(queEvent, (activeSession.value._id) ? activeSession.value._id : activeSession.value.id);
//                                 // if (logEvent) SocketServer.of(session.nsp).to(Agents.NotifyAll()).emit('visitorEventLog', logEvent);
//                                 let promises = await Promise.all([
//                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: false, eventName: 'noAgent', nsp: activeSession.value.nsp, roomName: [(activeSession.value.id || activeSession.value._id)], data: { state: 2, agent: pendingVisitor.agent } }),
//                                     await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'updateUser', nsp: activeSession.value.nsp, roomName: [Agents.NotifyAll()], data: { id: pendingVisitor.id, session: pendingVisitor } })
//                                 ]);
//                                 let updatedConversation = await Conversations.UpdateConversationState(pendingVisitor.conversationID, 1, false);
//                                 if (updatedConversation) await __BIZZ_REST_REDIS_PUB.SendMessage({ action: 'emit', to: 'A', broadcast: true, eventName: 'removeConversation', nsp: activeSession.value.nsp, roomName: [Agents.NotifyOne(activeSession.value)], data: { conversation: updatedConversation.value } });
//                             }
//                         }
//                     }
//                     break;
//                 default:
//                     break;
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         console.log('Error in Check Active');
//         // console.log(session.state);
//     }
// }
//#endregion
//# sourceMappingURL=CheckActive.js.map