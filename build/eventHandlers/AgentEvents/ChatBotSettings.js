"use strict";
//Created By Saad Ismail Shaikh 
// 29-10-2018
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
var caseModel_1 = require("../../models/ChatBot/caseModel");
var stateMachineModel_1 = require("../../models/ChatBot/stateMachineModel");
var workflowModel_1 = require("../../models/ChatBot/workflowModel");
var ChatBotSettings = /** @class */ (function () {
    function ChatBotSettings() {
    }
    ChatBotSettings.BindChatBotSettings = function (socket, origin) {
        //#region Case Events
        this.AddMatchingCase(socket, origin);
        this.GetAllCases(socket, origin);
        this.DeleteCase(socket, origin);
        this.EditCase(socket, origin);
        //#endregion
        //#region StateMachine Events
        this.AddStateMachine(socket, origin);
        this.GetAllMachines(socket, origin);
        this.AddState(socket, origin);
        this.DeleteState(socket, origin);
        this.AddHandler(socket, origin);
        this.DeleteHandler(socket, origin);
        this.StartMachine(socket, origin);
        this.AddWorkFlows(socket, origin);
        this.GetWorkFlows(socket, origin);
        this.SubmitWorkFlow(socket, origin);
        this.MakePrimaryWorkFlow(socket, origin);
        //#endregion
    };
    //#region Cases Event
    ChatBotSettings.AddMatchingCase = function (socket, origin) {
        var _this = this;
        socket.on('addCase', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exists, insertedCase, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        data.nsp = socket.handshake.session.nsp;
                        return [4 /*yield*/, caseModel_1.CaseModel.GetCaseByTagName(socket.handshake.session.nsp, data.tagName)];
                    case 1:
                        exists = _a.sent();
                        if (exists.length) {
                            callback({ status: 'exists', case: exists[0] });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, caseModel_1.CaseModel.AddCase(data)];
                    case 2:
                        insertedCase = _a.sent();
                        if (insertedCase && insertedCase.insertedCount > 0) {
                            callback({ status: 'ok', id: insertedCase.insertedId });
                        }
                        else {
                            callback({ status: 'error', message: "Can't Insert Case" });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log('error in Adding Case');
                        console.log(error_1);
                        callback({ status: 'error', message: "Can't Insert Case" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotSettings.GetAllCases = function (socket, origin) {
        var _this = this;
        socket.on('getCases', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var cases, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(socket.handshake.session.role != 'admin')) return [3 /*break*/, 1];
                        throw new Error('Agent Role Must Be Admin to Edit These Settings');
                    case 1: return [4 /*yield*/, caseModel_1.CaseModel.GetCases(socket.handshake.session.nsp, (data.id) ? data.id : undefined)];
                    case 2:
                        cases = _a.sent();
                        callback({ status: 'ok', cases: cases });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.log('error in Get Cases');
                        console.log(error_2);
                        callback({ status: 'error', message: "Can't Get Cases" });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotSettings.DeleteCase = function (socket, origin) {
        var _this = this;
        socket.on('deleteCase', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var Case, deleted, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, caseModel_1.CaseModel.FindOne(data.id, socket.handshake.session.nsp)];
                    case 1:
                        Case = _a.sent();
                        if (!(Case && Case.length)) return [3 /*break*/, 5];
                        if (!(Case[0].assignedTo.length > 0)) return [3 /*break*/, 2];
                        //Can't Delete Assigned Case
                        callback({ status: 'assigned' });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, caseModel_1.CaseModel.Delete(data.id, socket.handshake.session.nsp)];
                    case 3:
                        deleted = _a.sent();
                        if (deleted && deleted.deletedCount) {
                            callback({ status: 'ok' });
                        }
                        else {
                            throw new Error("Can't Delete Case");
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        //Already Deleted By Someone Else 
                        callback({ status: 'ok' });
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_3 = _a.sent();
                        console.log('error in Delete Case');
                        console.log(error_3);
                        callback({ status: 'error', msg: error_3 });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotSettings.EditCase = function (socket, origin) {
        var _this = this;
        socket.on('editCase', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var editedCase, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, caseModel_1.CaseModel.Edit(data._id, data, socket.handshake.session.nsp)];
                    case 1:
                        editedCase = _a.sent();
                        //console.log(editedCase)
                        if (editedCase && editedCase.value) {
                            callback({ status: 'ok', case: editedCase.value });
                        }
                        else {
                            throw new Error("Can't Edit Case");
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.log('error in Edit Case');
                        console.log(error_4);
                        callback({ status: 'error', message: "Can't Edit Case" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    //#endregion 
    //#region StatMAchineEvents
    ChatBotSettings.AddStateMachine = function (socket, origin) {
        var _this = this;
        socket.on('addMachine', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exists, insertedMachine, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!data.name) {
                            throw new Error('Invalid Input');
                        }
                        data.nsp = socket.handshake.session.nsp;
                        return [4 /*yield*/, stateMachineModel_1.StateMachineModel.FindByName(socket.handshake.session.nsp, data.name)];
                    case 1:
                        exists = _a.sent();
                        if (!(exists && exists.length)) return [3 /*break*/, 2];
                        callback({ status: 'exists', machine: exists[0] });
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, stateMachineModel_1.StateMachineModel.AddMachine(data)];
                    case 3:
                        insertedMachine = _a.sent();
                        if (insertedMachine && insertedMachine.insertedCount > 0) {
                            callback({ status: 'ok', id: insertedMachine.insertedId });
                            return [2 /*return*/];
                        }
                        throw new Error("Can't Insert Machine");
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_5 = _a.sent();
                        console.log('error in Adding State Machine');
                        console.log(error_5);
                        callback({ status: 'error', msg: error_5 });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotSettings.GetAllMachines = function (socket, origin) {
        var _this = this;
        socket.on('getMachines', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var machines, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!(socket.handshake.session.role != 'admin')) return [3 /*break*/, 1];
                        throw new Error('Agent Role Must Be Admin to Get These Settings');
                    case 1: return [4 /*yield*/, stateMachineModel_1.StateMachineModel.GetMachines(socket.handshake.session.nsp, (data.id) ? data.id : undefined)];
                    case 2:
                        machines = _a.sent();
                        //console.log(machines)
                        callback({ status: 'ok', machines: machines });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_6 = _a.sent();
                        console.log('error in Getting Machines');
                        console.log(error_6);
                        callback({ status: 'error', msg: error_6 });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotSettings.DeleteMachine = function (socket, origin) {
        var _this = this;
        socket.on('deleteMachine', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var Machine, deleted, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, stateMachineModel_1.StateMachineModel.FindOne(data.id, socket.handshake.session.nsp)];
                    case 1:
                        Machine = _a.sent();
                        if (!(Machine && Machine.length)) return [3 /*break*/, 5];
                        if (!(Machine[0].assignedTo.length > 0)) return [3 /*break*/, 2];
                        //Can't Delete Assigned Case
                        callback({ status: 'assigned' });
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, stateMachineModel_1.StateMachineModel.Delete(data.id, socket.handshake.session.nsp)];
                    case 3:
                        deleted = _a.sent();
                        if (deleted && deleted.deletedCount) {
                            callback({ status: 'ok' });
                        }
                        else {
                            throw new Error("Can't Delete Machine");
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        //Already Deleted By Someone Else 
                        callback({ status: 'ok' });
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_7 = _a.sent();
                        console.log('error in Delete Machine');
                        console.log(error_7);
                        callback({ status: 'error', msg: error_7 });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    };
    //#endregion
    //#region State Event
    ChatBotSettings.AddState = function (socket, origin) {
        var _this = this;
        socket.on('addState', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var exist, newState, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, stateMachineModel_1.StateMachineModel.MatchState(data.machineId, data.state.name)];
                    case 1:
                        exist = _a.sent();
                        if (exist && exist.length) {
                            callback({ status: 'assigned' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, stateMachineModel_1.StateMachineModel.AddState(data.machineId, data.state)];
                    case 2:
                        newState = _a.sent();
                        if (newState && newState.modifiedCount) {
                            callback({ status: 'ok' });
                            return [2 /*return*/];
                        }
                        else {
                            throw new Error('error in Adding State');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        console.log('error in Adding State');
                        console.log(error_8);
                        callback({ status: 'error' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotSettings.DeleteState = function (socket, origin) {
        var _this = this;
        socket.on('deleteState', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var stateMachine, handlers, index, UpdateMachine, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        //console.log('Deleting State');
                        if (!data.machineId || !data.stateName || !data.stateIndex.toString())
                            throw new Error('Invalid Input');
                        return [4 /*yield*/, stateMachineModel_1.StateMachineModel.FindOneById(data.machineId, socket.handshake.session.nsp)];
                    case 1:
                        stateMachine = _a.sent();
                        if (!(stateMachine && stateMachine.length)) return [3 /*break*/, 7];
                        handlers = stateMachine[0].states;
                        index = 0;
                        _a.label = 2;
                    case 2:
                        if (!(index < handlers.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, caseModel_1.CaseModel.DeReferenceCase(handlers[index].caseId, data.machineId, socket.handshake.session.nsp)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        index++;
                        return [3 /*break*/, 2];
                    case 5:
                        stateMachine[0].states.splice(data.stateIndex, 1);
                        return [4 /*yield*/, stateMachineModel_1.StateMachineModel.UpdateMachine(data.machineId, socket.handshake.session.nsp, 'states', stateMachine[0])];
                    case 6:
                        UpdateMachine = _a.sent();
                        if (UpdateMachine && UpdateMachine.ok && UpdateMachine.value) {
                            callback({ status: 'ok' });
                            return [2 /*return*/];
                        }
                        throw new Error('Unable To Delete State');
                    case 7: throw new Error('Unable To Find State Machine');
                    case 8:
                        error_9 = _a.sent();
                        console.log('error in Deleting State');
                        console.log(error_9);
                        callback({ status: 'error' });
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotSettings.StartMachine = function (socket, origin) {
        var _this = this;
        socket.on('StartMachine', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var Machine, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, stateMachineModel_1.StateMachineModel.CreateMachine(data.machineId, socket.handshake.session.nsp)];
                    case 1:
                        Machine = _a.sent();
                        if (Machine) {
                            if (!origin[Machine.name]) {
                                origin[Machine.name] = {};
                            }
                            origin[Machine.name] = Machine.stateMachine;
                        }
                        else {
                            throw new Error("Can't Crate Machine");
                        }
                        callback({ status: 'ok' });
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.log(error_10);
                        callback({ status: 'error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotSettings.AddHandler = function (socket, origin) {
        var _this = this;
        socket.on('addHandler', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var Case, insertedHandler, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!data.machineId)
                            throw new Error('Machine ID Required');
                        if (socket.handshake.session.role != 'admin')
                            throw new Error('Request Not Permitted');
                        if (!data.stateName)
                            throw new Error('State Name Required');
                        if (!data.handler)
                            throw new Error('Handler Required');
                        return [4 /*yield*/, caseModel_1.CaseModel.ReferenceCase(data.handler.caseId, data.machineId, socket.handshake.session.nsp)];
                    case 1:
                        Case = _a.sent();
                        return [4 /*yield*/, stateMachineModel_1.StateMachineModel.AddHandler(data.machineId, data.stateName, data.handler)];
                    case 2:
                        insertedHandler = _a.sent();
                        if (insertedHandler && insertedHandler.value && Case && Case.value)
                            callback({ status: 'ok' });
                        else
                            throw new Error("Can't Add Handler");
                        return [3 /*break*/, 4];
                    case 3:
                        error_11 = _a.sent();
                        console.log(error_11);
                        console.log('error in Adding Handler');
                        callback({ status: 'error' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotSettings.DeleteHandler = function (socket, origin) {
        var _this = this;
        socket.on('deleteHandler', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var updatedCase, deletedHandlerCase, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!data.machineId || !data.caseId || !data.index.toString())
                            throw new Error('Invalid Request In Delete Handler');
                        return [4 /*yield*/, caseModel_1.CaseModel.DeReferenceCase(data.caseId, data.machineId, socket.handshake.session.nsp)];
                    case 1:
                        updatedCase = _a.sent();
                        if (!(updatedCase && updatedCase.value && updatedCase.ok)) return [3 /*break*/, 3];
                        return [4 /*yield*/, stateMachineModel_1.StateMachineModel.DeleteHandler(data.machineId, data.caseId, data.index, data.stateName, socket.handshake.session.nsp)];
                    case 2:
                        deletedHandlerCase = _a.sent();
                        if (deletedHandlerCase && deletedHandlerCase.ok && deletedHandlerCase.value) {
                            callback({ status: 'ok' });
                            return [2 /*return*/];
                        }
                        throw new Error("Unable To Delete Handler");
                    case 3: throw new Error("Unable To Dereference Case");
                    case 4:
                        error_12 = _a.sent();
                        console.log(error_12);
                        callback({ status: 'error' });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    //#endregion
    //#region WorkFlows
    ChatBotSettings.AddWorkFlows = function (socket, origin) {
        var _this = this;
        socket.on('addWorkflow', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var WorkFlow, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (socket.handshake.session.role != 'admin')
                            throw new Error('Request Not Permitted');
                        if (!data.name)
                            throw new Error('WorkFlow Name Required');
                        data.nsp = socket.handshake.session.nsp;
                        return [4 /*yield*/, workflowModel_1.WorkFlowsModel.AddWorkFlow(data)];
                    case 1:
                        WorkFlow = _a.sent();
                        if (WorkFlow && WorkFlow.insertedCount)
                            callback({ status: 'ok', id: WorkFlow.insertedId });
                        else
                            throw new Error("Can't Add Workflow");
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        console.log(error_13);
                        console.log('error in Adding WorkFlow');
                        callback({ status: 'error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotSettings.GetWorkFlows = function (socket, origin) {
        var _this = this;
        socket.on('getWorkFlows', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var workflows, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (socket.handshake.session.role != 'admin')
                            throw new Error('Request Not Permitted');
                        return [4 /*yield*/, workflowModel_1.WorkFlowsModel.GetWorkFlows(socket.handshake.session.nsp, (data.id) ? data.id : '')];
                    case 1:
                        workflows = _a.sent();
                        callback({ status: 'ok', workFlows: workflows });
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        console.log(error_14);
                        callback({ status: error_14 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotSettings.SubmitWorkFlow = function (socket, origin) {
        var _this = this;
        socket.on('submitWorkFlow', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var formHTML, workflow, i, element, _a, udatedWorkflow, error_15;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        if (socket.handshake.session.role != 'admin')
                            throw new Error('Request Not Permitted');
                        if (!data._id || !data.form)
                            throw new Error('Invalid Parameters');
                        formHTML = '';
                        return [4 /*yield*/, workflowModel_1.WorkFlowsModel.GetWorkFlowById(socket.handshake.session.nsp, data._id)];
                    case 1:
                        workflow = _b.sent();
                        if (!workflow) return [3 /*break*/, 6];
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < data.form.length)) return [3 /*break*/, 5];
                        element = data.form[i];
                        switch (element.type) {
                            case 'checkBox':
                                formHTML += '<div class="full-width"><div class="pretty p-default clearfix"><input id="workflow-' + workflow[0].name + i + '" type="checkbox"' + ' value="' + element.value + '" name="workflow-checkbox"><div class="state"><label>' + element.label + '</label></div></div></div>';
                                break;
                            case 'radioBtn':
                                formHTML += '<div class="full-width"><div class="pretty p-default p-round"><input id="workflow-' + workflow[0].name + i + '" " type="radio"' + ' value="' + element.value + '" name="workflow-radioBtn"><div class="state"><label>' + element.label + '</label></div></div></div>';
                                break;
                        }
                        _a = element;
                        return [4 /*yield*/, stateMachineModel_1.StateMachineModel.CreateMachine(element.stateMachine, socket.handshake.session.nsp)];
                    case 3:
                        _a.stateMachine = _b.sent();
                        _b.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        formHTML += '<div class="full-width"><input type="submit" id="workflow-submit" value="Submit"></div>';
                        _b.label = 6;
                    case 6: return [4 /*yield*/, workflowModel_1.WorkFlowsModel.SubmitWorkFlow(socket.handshake.session.nsp, data.form, data._id, formHTML)];
                    case 7:
                        udatedWorkflow = _b.sent();
                        if (udatedWorkflow) {
                            callback({ status: 'ok', workflow: udatedWorkflow.value });
                            return [2 /*return*/];
                        }
                        throw new Error("Can't Submit WorkFlow");
                    case 8:
                        error_15 = _b.sent();
                        console.log(error_15);
                        callback({ status: 'error' });
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
    };
    ChatBotSettings.MakePrimaryWorkFlow = function (socket, origin) {
        var _this = this;
        socket.on('makePrimary', function (data, callback) { return __awaiter(_this, void 0, void 0, function () {
            var unsetPrimary, setPrimary, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, workflowModel_1.WorkFlowsModel.UnSetPrimaryWorkFlow(socket.handshake.session.nsp)];
                    case 1:
                        unsetPrimary = _a.sent();
                        if (!(unsetPrimary && unsetPrimary.ok)) return [3 /*break*/, 3];
                        return [4 /*yield*/, workflowModel_1.WorkFlowsModel.SetPrimaryWorkFlow(socket.handshake.session.nsp, data._id)];
                    case 2:
                        setPrimary = _a.sent();
                        if (setPrimary && setPrimary.value) {
                            if (!origin['workflow'])
                                origin['workflow'] = {};
                            origin['workflow'] = setPrimary.value;
                        }
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_16 = _a.sent();
                        console.log(error_16);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    return ChatBotSettings;
}());
exports.ChatBotSettings = ChatBotSettings;
//# sourceMappingURL=ChatBotSettings.js.map