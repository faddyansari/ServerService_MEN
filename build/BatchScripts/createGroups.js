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
var groupName = 'SBT UAE';
var nsp = '/hrm.sbtjapan.com';
var createdBY = 'saadisheikh9705@sbtjapan.com';
var members = [
    ,
    'fahhmed9813@sbtjapan.com',
    'talahmed9877@sbtjapan.com',
    'umsaeed9391@sbtjapan.com',
    'waleedasif9800@sbtjapan.com',
    'waqrasul9591@sbtjapan.com',
    'wsaleem9253@sbtjapan.com',
    'yousuf9333@sbtjapan.com'
];
var groupAdminName = [
    'saleem9204@sbtjapann.com',
    'kzafar9320@sbtjapann.com',
];
if (!groupName) {
    throw new Error('Group Name Error : Not Set');
    process.exit(1);
}
if (!nsp) {
    throw new Error("Namespace Error : Not set");
    process.exit(1);
}
if (!createdBY) {
    throw new Error("Creator Error : Not defined");
    process.exit(1);
}
var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var failedAgents = [];
var temp = {
    type: 'group',
    group_name: groupName,
    members: [],
    createdBy: createdBY,
    createdOn: new Date().toISOString(),
    LastUpdated: new Date().toISOString(),
    nsp: nsp,
    messages: [],
    LastSeen: []
};
var rand = ['#9BB4DD', '#6B9ED4', '#F58758', '#FACE63', '#55C4CC', '#F7C138', '#8580BC', '#7BB446', '#E24050', '#EC59AA', '#F2AEBB', '#01DD9F', '#7AEDDE', '#01D2E9', '#06A1E4', '#A7A9E2', '#A190D7', '#FF99CB', '#FF2D36', '#F19645', '#99CDFF', '#FB896E', '#33BFBE', '#1982C4', '#838DB0', '#50BF94', '#963FC1'];
function createGroup() {
    return __awaiter(this, void 0, void 0, function () {
        var result, insertedConversation, promises;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    members = members.map(function (agent) {
                        var replaced = agent;
                        if (agent.indexOf('@globalintltd.com') != -1)
                            replaced = replaced.replace('@globalintltd.com', '@globalintltdd.com');
                        if (agent.indexOf('@blauda.com') != -1)
                            replaced = replaced.replace('@blauda.com', '@blaudaa.com');
                        if (agent.indexOf('@sbtjapan.com') != -1)
                            replaced = replaced.replace('@sbtjapan.com', '@sbtjapann.com');
                        return replaced;
                    });
                    groupAdminName.map(function (admin) {
                        if (!members.includes(admin)) {
                            members.push(admin);
                        }
                    });
                    members.map(function (agent) {
                        var valid = emailPattern.test(agent);
                        var randomColor = rand[Math.floor(Math.random() * rand.length)];
                        if (!valid) {
                            print("Invalid Email : " + agent);
                            failedAgents.push({ email: agent, reason: 'Invalid Email' });
                            return;
                        }
                        else {
                            // print(agent);
                            var member = {
                                email: agent,
                                isAdmin: ((groupAdminName.includes(agent)) ? true : false),
                                viewColor: randomColor,
                            };
                            temp.members.push(member);
                        }
                    });
                    return [4 /*yield*/, db.agentConversations.insertOne(temp)];
                case 1:
                    result = _a.sent();
                    if (!(result && result.acknowledged && result.insertedId)) return [3 /*break*/, 5];
                    print('Inserted Conversation now Inserting Members : ', result.insertedId);
                    return [4 /*yield*/, db.agentConversations.find({ _id: result.insertedId }).limit(1).toArray()];
                case 2:
                    insertedConversation = _a.sent();
                    if (!(insertedConversation && insertedConversation.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, Promise.all(insertedConversation[0].members.forEach(function (member) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        print('Email : ', member.email);
                                        temp.members.forEach(function (member) {
                                            temp.LastSeen.push({
                                                email: member.email,
                                                messageReadCount: 0,
                                                DateTime: new Date().toISOString()
                                            });
                                        });
                                        return [4 /*yield*/, db.agentConversations.findOneAndUpdate({ _id: result.insertedId }, {
                                                $push: {
                                                    "LastSeen": {
                                                        email: member.email,
                                                        messageReadCount: 0,
                                                        DateTime: new Date().toISOString()
                                                    }
                                                }
                                            })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, createConversation(result.insertedId, member.email)];
                                }
                            });
                        }); }))];
                case 3:
                    promises = _a.sent();
                    return [4 /*yield*/, promises];
                case 4:
                    _a.sent();
                    print('Successfully Inserted : ' + temp.group_name);
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function createConversation(cid, email) {
    return __awaiter(this, void 0, void 0, function () {
        var obj;
        return __generator(this, function (_a) {
            try {
                obj = {
                    cid: cid,
                    email: email,
                    deleted: false,
                    exited: false,
                    removed: false
                };
                db.agentConversationsStatus.insertOne(obj);
            }
            catch (error) {
                console.log('Error in Create Agent Conversation');
                console.log(error);
            }
            return [2 /*return*/];
        });
    });
}
createGroup().then(function (data) {
    print('Insertion Finished');
    print('Duplicate Agents : ', failedAgents.length);
    if (failedAgents.length) {
        print('----     Failed Agents List and Reasons     ----');
        failedAgents.map(function (temp) { print(" Email : " + temp.email + ", Reason : " + temp.reason + " "); });
    }
}).catch(function (err) { print(err); print('error in inserting Agent'); });
//# sourceMappingURL=createGroups.js.map