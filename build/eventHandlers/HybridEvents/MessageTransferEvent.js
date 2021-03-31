"use strict";
//Created By Saad Ismail Shaikh 
//Date : 01-08-2018
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
//Updated By Saad Ismail shaikh
//Date :  12-12-2018 After Multple Agent Locations
var conversationModel_1 = require("../../models/conversationModel");
var sessionsManager_1 = require("../../globals/server/sessionsManager");
var visitorModel_1 = require("../../models/visitorModel");
var agentModel_1 = require("../../models/agentModel");
var mongodb_1 = require("mongodb");
var CheckActive_1 = require("../../actions/GlobalActions/CheckActive");
var FormDesignerModel_1 = require("../../models/FormDesignerModel");
var CreateMessage_1 = require("../../actions/GlobalActions/CreateMessage");
var AssignChat_1 = require("../../actions/ChatActions/AssignChat");
var PushNotificationFirebase_1 = require("../../actions/agentActions/PushNotificationFirebase");
var aws_sqs_1 = require("../../actions/aws/aws-sqs");
var enums_1 = require("../../globals/config/enums");
var MessageTransferEvent = /** @class */ (function () {
    function MessageTransferEvent() {
    }
    MessageTransferEvent.BindMessageEvents = function (socket, origin) {
        //Updated After Multiple Agent Locations
        MessageTransferEvent.MessageEvent(socket, origin);
        //Updated After Multiple Agent Locations
        MessageTransferEvent.BotMessageEvent(socket, origin);
        MessageTransferEvent.WorkFlowMessage(socket, origin);
        MessageTransferEvent.PrivateMessageRecieved(socket, origin);
        MessageTransferEvent.DisconnectEventFromClient(socket, origin);
    };
    MessageTransferEvent.DisconnectEventFromClient = function (socket, origin) {
        var _this = this;
        socket.on('disconnectEventFromClient', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var visitor_1, insertedMessage_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getVisitor(socket.handshake.session)];
                    case 1:
                        visitor_1 = (_a.sent());
                        if (!(visitor_1 && data)) return [3 /*break*/, 3];
                        return [4 /*yield*/, CreateMessage_1.CreateLogMessage({
                                from: visitor_1.agent.name,
                                to: (visitor_1.username) ? visitor_1.agent.name || visitor_1.agent.nickname : '',
                                body: data,
                                type: 'Events',
                                cid: (visitor_1.conversationID) ? visitor_1.conversationID : '',
                                attachment: false,
                                date: new Date().toISOString(),
                                delivered: true,
                                sent: true
                            })];
                    case 2:
                        insertedMessage_1 = _a.sent();
                        if (insertedMessage_1) {
                            setTimeout(function () {
                                origin.to(agentModel_1.Agents.NotifyOne(visitor_1)).emit('privateMessage', insertedMessage_1);
                            }, 0);
                            callback({ status: 'ok', msg: insertedMessage_1 });
                        }
                        else
                            callback({ status: 'error' });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        callback({ status: 'error' });
                        console.log('Error in Inserting Disconnecting Message');
                        console.log(error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    MessageTransferEvent.MessageEvent = function (socket, origin) {
        var _this = this;
        socket.on('privateMessage', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var sender, date, messageinsertedID_1, lastMessage, _a, updatedMessage, conversation_1, bestAgent, actualAgent, conversation, supervisorIntrusion, result, promises, updatedMessage, form, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 33, , 34]);
                        console.log('privateMessage');
                        sender = undefined;
                        date = new Date();
                        lastMessage = data;
                        _a = socket.handshake.session.type;
                        switch (_a) {
                            case 'Events': return [3 /*break*/, 1];
                            case 'Visitors': return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 15];
                    case 1: return [4 /*yield*/, CheckActive_1.MakeActive(sender)];
                    case 2:
                        //TODO : Re-Active if Session was Inactive 
                        sender = _b.sent();
                        if (!(sender && sender._id)) return [3 /*break*/, 14];
                        if (sender.state <= 1) {
                            callback({ status: 'error' });
                            return [2 /*return*/];
                        }
                        ;
                        date = new Date();
                        data.date = date.toISOString();
                        return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(data)];
                    case 3:
                        //data.type = socket.handshake.session.type;
                        // data.delivered = true
                        // data.sent = false
                        messageinsertedID_1 = _b.sent();
                        if (!data.cid) return [3 /*break*/, 5];
                        return [4 /*yield*/, conversationModel_1.Conversations.updateMessageReadCount(data.cid)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        if (!(messageinsertedID_1.insertedCount > 0)) return [3 /*break*/, 13];
                        return [4 /*yield*/, conversationModel_1.Conversations.updateDeliveryStatus(messageinsertedID_1.ops[0]._id)];
                    case 6:
                        updatedMessage = _b.sent();
                        if (updatedMessage) {
                            messageinsertedID_1.ops[0].delivered = true;
                        }
                        if (!(data.type == 'Visitors')) return [3 /*break*/, 8];
                        return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(lastMessage.cid, data)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        if (sender.inactive) {
                            if (messageinsertedID_1.ops[0].chatFormData && messageinsertedID_1.ops[0].chatFormData.toLowerCase() == 'post chat survey') {
                                origin.to(agentModel_1.Agents.NotifyOne(sender)).emit('privateMessage', messageinsertedID_1.ops[0]);
                                PushNotificationFirebase_1.SendNotification(origin['settings']['api']['firebase']['key'], 'agent-' + agentModel_1.Agents.NotifyOne(sender), messageinsertedID_1.ops[0].from, (messageinsertedID_1.ops[0].attachment.length) ? 'Media Attachment' : messageinsertedID_1.ops[0].body, {
                                    chatType: 'Visitor',
                                    message: messageinsertedID_1.ops[0]
                                }, true);
                            }
                        }
                        else {
                            console.log('session type: ' + sender.type);
                            console.log('Sending Message to Agent: ' + sender.agent.id);
                            origin.to(agentModel_1.Agents.NotifyOne(sender)).emit('privateMessage', messageinsertedID_1.ops[0]);
                            PushNotificationFirebase_1.SendNotification(origin['settings']['api']['firebase']['key'], 'agent-' + agentModel_1.Agents.NotifyOne(sender), messageinsertedID_1.ops[0].from, (messageinsertedID_1.ops[0].attachment.length) ? 'Media Attachment' : messageinsertedID_1.ops[0].body, {
                                chatType: 'Visitor',
                                message: messageinsertedID_1.ops[0]
                            }, true);
                        }
                        return [4 /*yield*/, conversationModel_1.Conversations.GetConversationById(data.cid)];
                    case 9:
                        conversation_1 = _b.sent();
                        if (conversation_1 && conversation_1.length && conversation_1[0].superviserAgents && conversation_1[0].superviserAgents.length) {
                            conversation_1[0].superviserAgents.forEach(function (agentID) {
                                console.log(socket.handshake.session._id);
                                console.log(agentID);
                                //each id should be string ,it is Object ID now
                                socket.to(agentID.toHexString()).emit('privateMessage', messageinsertedID_1.ops[0]);
                            });
                        }
                        //TODO CLIENT WINDOWS UPDATE ON MULTIPLE TABS
                        //WRITE CLIENT LOGIC
                        socket.to(visitorModel_1.Visitor.NotifyOne(sender)).emit('privateMessage', messageinsertedID_1.ops[0]);
                        //for supervision(not correct)
                        //socket.to(Agents.NotifyAllAdmins()).emit('privateMessage', messageinsertedID.ops[0]);
                        PushNotificationFirebase_1.SendNotification(origin['settings']['api']['firebase']['key'], 'visitor-' + visitorModel_1.Visitor.NotifyOne(sender), messageinsertedID_1.ops[0].from, (messageinsertedID_1.ops[0].attachment.length) ? 'Media Attachment' : messageinsertedID_1.ops[0].body, {
                            chatType: 'Visitor',
                            message: messageinsertedID_1.ops[0]
                        }, true);
                        callback({ status: 'ok', date: data.date, _id: messageinsertedID_1.ops[0]._id, delivered: messageinsertedID_1.ops[0].delivered });
                        if (!(sender && sender.state == 2 && !sender.inactive && origin['settings']['chatSettings']['assignments'].aEng)) return [3 /*break*/, 12];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetBestAgent(sender.nsp)];
                    case 10:
                        bestAgent = _b.sent();
                        if (!bestAgent) return [3 /*break*/, 12];
                        return [4 /*yield*/, AssignChat_1.AssignQueuedChatToManual(bestAgent, sender.id || sender._id)];
                    case 11:
                        _b.sent();
                        return [2 /*return*/];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        callback({ status: 'error' });
                        console.log('Error in Sending Message Message Not Inserted');
                        _b.label = 14;
                    case 14: return [2 /*return*/];
                    case 15:
                        actualAgent = void 0;
                        return [4 /*yield*/, conversationModel_1.Conversations.GetConversationById(lastMessage.message.cid)];
                    case 16:
                        conversation = _b.sent();
                        supervisorIntrusion = false;
                        if (!(conversation && conversation.length && conversation[0].agentEmail && conversation[0].agentEmail != socket.handshake.session.email && socket.handshake.session.permissions.agents.chatSuperVision && socket.handshake.session.permissions.agents.chatSuperVisionIntrusion)) return [3 /*break*/, 18];
                        conversation[0].superviserAgents.includes(socket.handshake.session._id);
                        supervisorIntrusion = true;
                        return [4 /*yield*/, sessionsManager_1.SessionManager.getAgentByEmail(socket.handshake.session.nsp, conversation[0].agentEmail)];
                    case 17:
                        actualAgent = _b.sent();
                        return [3 /*break*/, 19];
                    case 18:
                        if (conversation && conversation.length && conversation[0].agentEmail && conversation[0].agentEmail != socket.handshake.session.email) {
                            callback({ status: 'error-not-permitted', msg: "This Conversation Belongs to " + conversation[0].agentEmail });
                            return [2 /*return*/];
                        }
                        _b.label = 19;
                    case 19:
                        date = new Date();
                        data.message.date = date.toISOString();
                        data.message.type = 'Agents';
                        return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(data.message)];
                    case 20:
                        messageinsertedID_1 = _b.sent();
                        return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(lastMessage.message.cid, data.message, (supervisorIntrusion) ? false : {
                                insertMessageID: true,
                                email: socket.handshake.session.email,
                                MessageId: messageinsertedID_1.insertedId
                            })];
                    case 21:
                        result = _b.sent();
                        if (!(result && (result.value))) return [3 /*break*/, 23];
                        if (!result.value.assigned_to) return [3 /*break*/, 23];
                        promises = result.value.assigned_to.map(function (value) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(value.email == socket.handshake.session.email && !value.firstResponseTime)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, conversationModel_1.Conversations.AddFirstResponseTime(data.message, socket.handshake.session.email)];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 22:
                        _b.sent();
                        _b.label = 23;
                    case 23:
                        if (!(messageinsertedID_1.insertedCount > 0)) return [3 /*break*/, 30];
                        return [4 /*yield*/, conversationModel_1.Conversations.updateDeliveryStatus(messageinsertedID_1.ops[0]._id)];
                    case 24:
                        updatedMessage = _b.sent();
                        if (updatedMessage) {
                            //console.log(updatedMessage);
                            messageinsertedID_1.ops[0].delivered = true;
                        }
                        callback({ status: 'ok', date: date, cid: data.message.cid, delivered: messageinsertedID_1.ops[0].delivered });
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetAgentByID(socket.handshake.session.id || socket.handshake.session._id)];
                    case 25:
                        sender = _b.sent();
                        if (!sender) return [3 /*break*/, 28];
                        if (!(data.message.form && data.message.form.length)) return [3 /*break*/, 27];
                        return [4 /*yield*/, FormDesignerModel_1.FormDesignerModel.GetFormsByName(data.message.form[0].formName.slice(2))];
                    case 26:
                        form = _b.sent();
                        if (form && form.length)
                            socket.to(data.sessionId).emit('cannedformReceived', { _id: (data.sessionId) ? data.sessionId : '', form: form });
                        _b.label = 27;
                    case 27:
                        data.message._id = messageinsertedID_1.ops[0]._id;
                        if (conversation && conversation.length && conversation[0].superviserAgents && conversation[0].superviserAgents.length) {
                            conversation[0].superviserAgents.forEach(function (agentID) {
                                if (agentID.toHexString() != socket.handshake.session._id) {
                                    console.log('in array condition match');
                                    socket.to(agentID.toHexString()).emit('privateMessage', data.message);
                                }
                            });
                        }
                        //for visitor
                        origin.to(data.sessionId).emit('privateMessage', data.message);
                        //for agent all tabs 
                        socket.to(agentModel_1.Agents.NotifyOne(sender)).emit('privateMessage', data.message);
                        //for actual agent on conversation if superviser sends the message
                        if (supervisorIntrusion) {
                            if (actualAgent) {
                                console.log(actualAgent);
                                origin.to(actualAgent._id).emit('privateMessage', data.message);
                            }
                        }
                        return [3 /*break*/, 29];
                    case 28:
                        callback({ status: 'error' });
                        _b.label = 29;
                    case 29: return [3 /*break*/, 31];
                    case 30:
                        callback({ status: 'error' });
                        console.log('Error in Sending Message Message Not Inserted');
                        _b.label = 31;
                    case 31: return [2 /*return*/];
                    case 32: return [3 /*break*/, 34];
                    case 33:
                        error_2 = _b.sent();
                        callback({ status: 'error' });
                        console.log('Error in Inserting Message');
                        console.log(error_2);
                        return [3 /*break*/, 34];
                    case 34: return [2 /*return*/];
                }
            });
        }); });
    };
    MessageTransferEvent.BotMessageEvent = function (socket, origin) {
        var _this = this;
        socket.on('privateBotMessage', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var date, sess, stateMachine_1, currentState_1, _loop_1, i, state_1, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        date = new Date();
                        date = date.toISOString();
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(socket.handshake.session.id)];
                    case 1:
                        sess = _a.sent();
                        stateMachine_1 = sess.stateMachine;
                        currentState_1 = sess.currentState;
                        _loop_1 = function (i) {
                            var UpdatedSession, session, allAgents, allocatedAgent, cid, greetingMessage, UpdatedSessions, conversation, logEvent, payload, lastMessage, messageinsertedID, UpdatedSessions, conversation, payload, lastMessage, logEvent, messageinsertedID, data_1, session;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(new RegExp(stateMachine_1[currentState_1].handlers[i].expression, 'mi').test(data.body))) return [3 /*break*/, 32];
                                        if (!(stateMachine_1[currentState_1].handlers[i].action == 'tr')) return [3 /*break*/, 2];
                                        socket.handshake.session.currentState = stateMachine_1[currentState_1].handlers[i].transition;
                                        //console.log("sending private message");
                                        setTimeout(function () {
                                            socket.emit('privateMessage', {
                                                from: 'Chat Assistant',
                                                to: socket.handshake.session._id,
                                                body: stateMachine_1[currentState_1].handlers[i].responseText,
                                                cid: undefined,
                                                date: new Date().toISOString(),
                                                type: 'Agents',
                                                attachment: false,
                                                filename: undefined
                                            });
                                        }, 1000);
                                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(socket.handshake.session._id || socket.handshake.session.id, socket.handshake.session)];
                                    case 1:
                                        UpdatedSession = _a.sent();
                                        if (UpdatedSession) {
                                            callback({ status: 'ok', date: date });
                                        }
                                        else {
                                            callback({ status: 'error' });
                                        }
                                        return [2 /*return*/, { value: void 0 }];
                                    case 2:
                                        if (!(stateMachine_1[currentState_1].handlers[i].action == 'ca')) return [3 /*break*/, 28];
                                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(socket.handshake.session.id)];
                                    case 3:
                                        session = _a.sent();
                                        session.username = (session.username) ? session.username : ('Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0]);
                                        session.email = (session.email) ? session.email : 'Unregistered';
                                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetAllActiveAgentsChatting(session)];
                                    case 4:
                                        allAgents = _a.sent();
                                        if (!!allAgents) return [3 /*break*/, 5];
                                        //console.log("no agent state 5")
                                        socket.emit('noAgentWithBot', { status: 'noAgentWithBot', state: 5 });
                                        session.state = 5;
                                        sessionsManager_1.SessionManager.UpdateState(session, 5);
                                        return [2 /*return*/, { value: void 0 }];
                                    case 5:
                                        allocatedAgent = void 0;
                                        cid = new mongodb_1.ObjectID();
                                        greetingMessage = origin['settings']['chatSettings']['greetingMessage'];
                                        socket.to(visitorModel_1.Visitor.NotifyOne(session)).emit('privateMessage', {
                                            from: 'Chat Assistant',
                                            to: socket.handshake.session._id,
                                            body: 'Connecting To Agent',
                                            cid: undefined,
                                            date: new Date().toISOString(),
                                            type: 'Agents',
                                            attachment: false,
                                            filename: undefined
                                        });
                                        if (!origin['settings']['chatSettings']['assignments'].priorityAgent.trim()) return [3 /*break*/, 17];
                                        return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgentPriority(session, origin['settings']['chatSettings']['assignments'].priorityAgent.trim(), cid)];
                                    case 6:
                                        UpdatedSessions = _a.sent();
                                        session = UpdatedSessions.visitor;
                                        //console.log("priority agent");
                                        allocatedAgent = UpdatedSessions.agent;
                                        if (!allocatedAgent) return [3 /*break*/, 15];
                                        return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, allocatedAgent.email, session.username, 2, session.deviceID)];
                                    case 7:
                                        conversation = _a.sent();
                                        if (!(conversation && conversation.insertedCount > 0)) return [3 /*break*/, 14];
                                        if (!(session.url && session.url.length)) return [3 /*break*/, 9];
                                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)];
                                    case 8:
                                        _a.sent();
                                        _a.label = 9;
                                    case 9: return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
                                    case 10:
                                        logEvent = _a.sent();
                                        if (logEvent)
                                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                                        payload = { id: session.id, session: session };
                                        if (allocatedAgent.greetingMessage)
                                            greetingMessage = allocatedAgent.greetingMessage;
                                        if (!(conversation && greetingMessage)) return [3 /*break*/, 13];
                                        if (!greetingMessage) return [3 /*break*/, 13];
                                        lastMessage = {
                                            from: socket.handshake.session.nsp,
                                            to: session.username,
                                            body: greetingMessage,
                                            cid: conversation.insertedId.toHexString(),
                                            date: (new Date()).toISOString(),
                                            type: 'Agents',
                                            attachment: false
                                        };
                                        return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(lastMessage)];
                                    case 11:
                                        messageinsertedID = _a.sent();
                                        conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                                        return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
                                    case 12:
                                        _a.sent();
                                        _a.label = 13;
                                    case 13:
                                        //Notify Allocated Agent That A New Conversation has been autoAssigned. 
                                        //Check if Allocated Agent is Still Active. Just a precautionary Case. 
                                        if (allocatedAgent) {
                                            origin.to(allocatedAgent.id).emit('newConversation', conversation.ops[0]);
                                            origin.to(visitorModel_1.Visitor.NotifyOne(session)).emit('gotAgent', {
                                                agent: (allocatedAgent) ? session.agent : undefined,
                                                cid: session.conversationID,
                                                state: session.state,
                                                username: session.username,
                                                email: session.email
                                            });
                                        }
                                        //Broadcast To All Agents That User Information and State Has Been Updated.
                                        origin.in(agentModel_1.Agents.NotifyAll()).emit('updateUser', payload);
                                        _a.label = 14;
                                    case 14:
                                        callback({ status: 'ok', date: date });
                                        return [3 /*break*/, 16];
                                    case 15:
                                        //console.log('No Agent')
                                        callback({ status: 'noAgent' });
                                        _a.label = 16;
                                    case 16: return [3 /*break*/, 26];
                                    case 17: return [4 /*yield*/, sessionsManager_1.SessionManager.AllocateAgent(session, cid)];
                                    case 18:
                                        UpdatedSessions = _a.sent();
                                        allocatedAgent = UpdatedSessions.agent;
                                        session = UpdatedSessions.visitor;
                                        return [4 /*yield*/, conversationModel_1.Conversations.createConversation(cid, session.email, session.id, session.nsp, session.viewColor, (allocatedAgent) ? allocatedAgent.email : '', session.username, (allocatedAgent) ? 2 : 1, session.deviceID)];
                                    case 19:
                                        conversation = _a.sent();
                                        payload = { id: session.id, session: session };
                                        if (allocatedAgent && allocatedAgent.greetingMessage)
                                            greetingMessage = allocatedAgent.greetingMessage;
                                        lastMessage = void 0;
                                        if (!(conversation && greetingMessage)) return [3 /*break*/, 25];
                                        if (!(session.url && session.url.length)) return [3 /*break*/, 21];
                                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateChatInitiatedDetails(session._id || session.id, session.url[session.url.length - 1], 'Visitor', ((session.state == 4) || (session.state == 5)) ? true : false)];
                                    case 20:
                                        _a.sent();
                                        _a.label = 21;
                                    case 21: return [4 /*yield*/, aws_sqs_1.__biZZC_SQS.SendEventLog(enums_1.EventLogMessages.CHAT_INITIATED, (session._id) ? session._id : session.id)];
                                    case 22:
                                        logEvent = _a.sent();
                                        if (logEvent)
                                            origin.to(agentModel_1.Agents.NotifyAll()).emit('visitorEventLog', logEvent);
                                        if (!greetingMessage) return [3 /*break*/, 25];
                                        lastMessage = {
                                            from: socket.handshake.session.nsp,
                                            to: session.username,
                                            body: greetingMessage,
                                            cid: conversation.insertedId.toHexString(),
                                            date: (new Date()).toISOString(),
                                            type: 'Agents',
                                            attachment: false
                                        };
                                        return [4 /*yield*/, conversationModel_1.Conversations.insertMessage(lastMessage)];
                                    case 23:
                                        messageinsertedID = _a.sent();
                                        conversation.ops[0].messages.push(messageinsertedID.ops[0]);
                                        return [4 /*yield*/, conversationModel_1.Conversations.UpdateLastMessage(conversation.insertedId.toHexString(), lastMessage)];
                                    case 24:
                                        _a.sent();
                                        _a.label = 25;
                                    case 25:
                                        //Update User Status Back to Visitor Window
                                        //Check if Allocated Agent is Still Active. Just a precautionary Case. 
                                        if (allocatedAgent && conversation) {
                                            origin.to(allocatedAgent.id).emit('newConversation', conversation.ops[0]);
                                        }
                                        //Broadcast To All Agents That User Information and State Has Been Updated.
                                        origin.in(agentModel_1.Agents.NotifyAll()).emit('updateUser', payload);
                                        data_1 = {
                                            agent: (allocatedAgent) ? session.agent : undefined,
                                            cid: session.conversationID,
                                            state: session.state,
                                            username: session.username,
                                            email: session.email,
                                        };
                                        //console.log("Sending Got Agent to Visitor");
                                        socket.emit('gotAgent', data_1);
                                        //console.log(session);
                                        // socket.to(Visitor.NotifyOne(session)).emit('gotAgent',
                                        //     {
                                        //         agent: (allocatedAgent) ? session.agent : undefined,
                                        //         cid: session.conversationID,
                                        //         state: session.state,
                                        //         username: session.username,
                                        //         email: session.email
                                        //     });
                                        callback({ status: 'ok', date: date });
                                        _a.label = 26;
                                    case 26: return [2 /*return*/, { value: void 0 }];
                                    case 27: return [3 /*break*/, 31];
                                    case 28:
                                        if (!(stateMachine_1[currentState_1].handlers[i].action == 'gt')) return [3 /*break*/, 31];
                                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(socket.handshake.session.id)];
                                    case 29:
                                        session = _a.sent();
                                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session.id || session._id, session)];
                                    case 30:
                                        _a.sent();
                                        //console.log("gt updating state");
                                        setTimeout(function () {
                                            socket.emit('privateMessage', {
                                                from: 'Chat Assistant',
                                                to: socket.handshake.session._id,
                                                body: 'Generate Ticket',
                                                cid: undefined,
                                                date: new Date().toISOString(),
                                                type: 'Agents',
                                                attachment: false,
                                                filename: undefined
                                            });
                                        }, 1000);
                                        callback({ status: 'ok', date: date });
                                        return [2 /*return*/, "break"];
                                    case 31: return [3 /*break*/, 33];
                                    case 32:
                                        callback({ status: 'Unconfigured', data: data });
                                        return [2 /*return*/, "break"];
                                    case 33: return [2 /*return*/];
                                }
                            });
                        };
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < stateMachine_1[currentState_1].handlers.length)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1(i)];
                    case 3:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        if (state_1 === "break")
                            return [3 /*break*/, 5];
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_3 = _a.sent();
                        console.log('Error in Private BoT Messsage');
                        console.log(error_3);
                        callback({ status: 'error', error: error_3 });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    MessageTransferEvent.WorkFlowMessage = function (socket, origin) {
        var _this = this;
        socket.on('workFlowInput', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var session_1, index, stateMachineStates, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(socket.handshake.session.id)];
                    case 1:
                        session_1 = _a.sent();
                        index = 0;
                        _a.label = 2;
                    case 2:
                        if (!(index < origin['workflow'].form.length)) return [3 /*break*/, 5];
                        if (!(origin['workflow'].form[index].value.toLowerCase() == data.value.toLowerCase())) return [3 /*break*/, 4];
                        //console.log('Here');
                        //console.log(origin['workflow']);
                        session_1.stateMachine = origin['workflow'].form[index].stateMachine.stateMachine;
                        stateMachineStates = Object.keys(origin['workflow'].form[index].stateMachine.stateMachine);
                        session_1.currentState = stateMachineStates[0];
                        session_1.state = 7;
                        session_1.newUser = false;
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session_1.id || session_1._id, session_1)];
                    case 3:
                        _a.sent();
                        //console.log(session);
                        setTimeout(function () { socket.emit("syncsession", session_1); }, 0);
                        return [3 /*break*/, 5];
                    case 4:
                        index++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session_1._id, session_1)];
                    case 6:
                        _a.sent();
                        //EMIT TO ALL SESSIONS THAT ABOUT WORKFLOW INPUT
                        //FOR CROSS TAB COMMUNICATION
                        callback({ status: 'ok', state: 7 });
                        return [3 /*break*/, 8];
                    case 7:
                        error_4 = _a.sent();
                        console.log('Error in Woflow Input Submit');
                        console.log(error_4);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    MessageTransferEvent.WorkFlowMessageExtend = function (socket, origin) {
        var _this = this;
        socket.on('workFlowInputExtended', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var session_2, index, stateMachineStates, stateMachineStates, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(socket.handshake.session.id)];
                    case 1:
                        session_2 = _a.sent();
                        index = 0;
                        _a.label = 2;
                    case 2:
                        if (!(index < origin['workflow'].form.length)) return [3 /*break*/, 8];
                        if (!(origin['workflow'].form[index].type == 'radioBtn')) return [3 /*break*/, 5];
                        if (!(origin['workflow'].form[index].value.toLowerCase() == data.value.radioSelected.toLowerCase())) return [3 /*break*/, 4];
                        //console.log('Radio Button');
                        //console.log(origin['workflow']);
                        session_2.stateMachine = origin['workflow'].form[index].stateMachine.stateMachine;
                        stateMachineStates = Object.keys(origin['workflow'].form[index].stateMachine.stateMachine);
                        session_2.currentState = stateMachineStates[0];
                        session_2.state = 7;
                        session_2.newUser = false;
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session_2.id || session_2._id, session_2)];
                    case 3:
                        _a.sent();
                        //console.log(session);
                        setTimeout(function () { socket.emit("syncsession", session_2); }, 0);
                        return [3 /*break*/, 8];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        if (!(origin['workflow'].form[index].type == 'checkBox')) return [3 /*break*/, 7];
                        if (!(origin['workflow'].form[index].value.toLowerCase() == data.value.checkboxSelected.toLowerCase())) return [3 /*break*/, 7];
                        //console.log('Check Box');
                        //console.log(origin['workflow']);
                        session_2.stateMachine = origin['workflow'].form[index].stateMachine.stateMachine;
                        stateMachineStates = Object.keys(origin['workflow'].form[index].stateMachine.stateMachine);
                        session_2.currentState = stateMachineStates[0];
                        session_2.state = 7;
                        session_2.newUser = false;
                        return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session_2.id || session_2._id, session_2)];
                    case 6:
                        _a.sent();
                        //console.log(session);
                        setTimeout(function () { socket.emit("syncsession", session_2); }, 0);
                        return [3 /*break*/, 8];
                    case 7:
                        index++;
                        return [3 /*break*/, 2];
                    case 8: return [4 /*yield*/, sessionsManager_1.SessionManager.UpdateSession(session_2._id, session_2)];
                    case 9:
                        _a.sent();
                        //EMIT TO ALL SESSIONS THAT ABOUT WORKFLOW INPUT
                        //FOR CROSS TAB COMMUNICATION
                        callback({ status: 'ok', state: 7 });
                        return [3 /*break*/, 11];
                    case 10:
                        error_5 = _a.sent();
                        console.log('Error in Woflow Input Submit');
                        console.log(error_5);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        }); });
    };
    MessageTransferEvent.PrivateMessageRecieved = function (socket, origin) {
        var _this = this;
        socket.on('privateMessageRecieved', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var session, conversation, updatedList, error_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!(data && data.cid && data.sessionid)) return [3 /*break*/, 5];
                        return [4 /*yield*/, sessionsManager_1.SessionManager.GetVisitorByID(data.sessionid)];
                    case 1:
                        session = _a.sent();
                        return [4 /*yield*/, conversationModel_1.Conversations.getMessagesByCid(data.cid)];
                    case 2:
                        conversation = _a.sent();
                        if (!(conversation && conversation.length)) return [3 /*break*/, 4];
                        updatedList = conversation.map(function (msg, index) { return __awaiter(_this, void 0, void 0, function () {
                            var updatedMessage;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(msg.type == data.type && !msg.sent)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, conversationModel_1.Conversations.updateSentStatus(msg._id)];
                                    case 1:
                                        updatedMessage = _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(updatedList)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (session && data.type == 'Visitors')
                            socket.to(visitorModel_1.Visitor.NotifyOne(session)).emit('privateMessageSent', data);
                        else if (session && session.agent)
                            origin.to(agentModel_1.Agents.NotifyOne(session)).emit('privateMessageSent', data);
                        callback({ status: 'ok' });
                        return [3 /*break*/, 6];
                    case 5:
                        callback({ error: 'error' });
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_6 = _a.sent();
                        console.log('Error in Sending Message Sent Status');
                        console.log(error_6);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    return MessageTransferEvent;
}());
exports.MessageTransferEvent = MessageTransferEvent;
//# sourceMappingURL=MessageTransferEvent.js.map