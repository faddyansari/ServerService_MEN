"use strict";
//Created By Saad Ismail Shaikh
//Date : 19-1-2018
Object.defineProperty(exports, "__esModule", { value: true });
// Note : This Module Contains Global settings of Application
// The Settings which are Stated Here will remain constant througout the application
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var uuid = require("uuid");
exports.port = process.env.PORT || '8005';
exports.EmailTest = true;
exports.ticketEmail = (process.env.NODE_ENV == 'production') ? 'support@bizzchats.com' : 'tickets@app.beelinks.solutions';
exports.serverAddress = (process.env.NODE_ENV == 'production') ? 'https://app.beelinks.solutions' : (process.env.NODE_ENV == 'development') ? 'https://dev.beelinks.solutions' : 'http://localhost:8000';
exports.bucketName = (process.env.NODE_ENV == 'production') ? 'beelinksemail-notifications' : 'beelinks-notifification-local';
exports.WEBSITEURL = (process.env.NODE_ENV == 'production') ? 'https://beelinks.solutions' : (process.env.NODE_ENV == 'development') ? 'https://websiteqa.beelinks.solutions' : 'http://localhost:8006';
exports.SQSURL = (process.env.NODE_ENV == 'production') ? 'https://sqs.us-west-2.amazonaws.com/021594099427/Socket-Email-Queue-Production' : 'https://sqs.us-west-2.amazonaws.com/021594099427/Socket-Email-Queue';
exports.AnalytcisNewQueue = (process.env.NODE_ENV == 'production') ? 'https://sqs.us-west-2.amazonaws.com/021594099427/CHATENDQUEUE-Production' : 'https://sqs.us-west-2.amazonaws.com/021594099427/CHATENDQUEUE';
exports.ARCHIVINGQUEUE = (process.env.NODE_ENV == 'production') ? 'https://sqs.us-west-2.amazonaws.com/021594099427/Analytics-Old-Production' : 'https://sqs.us-west-2.amazonaws.com/021594099427/Analytics-Old';
exports.SQSSOLRURL = 'https://sqs.us-west-2.amazonaws.com/021594099427/TICKET-SOLR.fifo';
exports.SQSChatsSOLRURL = 'https://sqs.us-west-2.amazonaws.com/021594099427/Conversation-SOLR.fifo';
exports.REST_SOCKET_QUEUE = (process.env.NODE_ENV == 'production') ? 'https://sqs.us-west-2.amazonaws.com/021594099427/Rest-Socket-Production.fifo' : 'https://sqs.us-west-2.amazonaws.com/021594099427/Rest-Socket-Local.fifo';
exports.REDISURL = (process.env.NODE_ENV == 'production') ? 'redis://cch2.beelinks.solutions:6379' : 'redis://34.221.164.186:8000';
exports.REDISMQURL = (process.env.NODE_ENV == 'production') ? 'cch2.beelinks.solutions' : '34.221.164.186';
exports.REDISMQPORT = (process.env.NODE_ENV == 'production') ? 6379 : 8000;
exports.REDISQUEUENAME = (process.env.NODE_ENV == 'production') ? 'socket_event_bus' : (process.env.QUEUENAME) ? process.env.QUEUENAME : 'event_bus_local_murtaza';
exports.TIMEOUTKEYNAME = (process.env.NODE_ENV == 'production') ? 'timeoutKey_Prod' : (process.env.TIMEOUTKEYNAME) ? process.env.TIMEOUTKEYNAME : 'timeoutKey_murtaza';
exports.AGENTSOLRQUEUE = 'https://sqs.us-west-2.amazonaws.com/021594099427/Agent-SOLR.fifo';
exports.FixCount = false;
// export let ConcurrentChatLimit = 20;
exports.subscriptionURL = 'https://subscription-module.azurewebsites.net/Payment/GetPaymentURL/';
exports.subscriptionURLDirect = '	https://subscription-module.azurewebsites.net/Payment/TakeDirectPayemnt/';
exports.subscriptionSuccessPath = 'payment_complete';
exports.subscriptionThankYouPath = 'thank_you';
exports.packageCodesCard = {
    "agent": 'b595d220-b37b-4e24-acbe-05eebd009f0d',
    "honey-comb": '12ba199a-15d5-4360-8250-6220dea80ffd'
};
exports.packageCodesDirect = {
    "agent": '5d538d32-377f-43ad-a31e-6e32033e2a7e',
    "honey-comb": 'b3524d97-8599-478e-9da2-76afff8c5f77'
};
exports.Namespaces = {};
exports.Groups = { SBTPK: ['KE', 'PK'] };
exports.tokenSignature = {
    algorithm: 'aes-256-ctr',
    signature: '^%SBTPK12309#'
};
var assetsPath = path.resolve(__dirname + '../../../public/');
exports.Assets = JSON.parse(fs.readFileSync(assetsPath + '/manifest.json', 'utf-8'));
function encrypt(text) {
    var cipher = crypto.createCipher(exports.tokenSignature.algorithm, exports.tokenSignature.signature);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
exports.encrypt = encrypt;
function GenerateOrderID() {
    return uuid.v4();
}
exports.GenerateOrderID = GenerateOrderID;
function decrypt(text) {
    var decipher = crypto.createDecipher(exports.tokenSignature.algorithm, exports.tokenSignature.signature);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
exports.decrypt = decrypt;
// export const rand = ['#E18B6B', '#B38481', '#C5908E', '#FAAFBE', '#FAAFBA', '#C8A2C8', '#C38EC7', '#8467D7', '#7E587E', '#E38AAE', '#E7A1B0', '#EDC9AF', '#C48793', '#E18B6B', '#835C3B', '#AF9B60', '#FFCBA4', '#FFDB58', '#FFDB58', '#F3E5AB', '#FBF6D9', '#FFF380'];
exports.rand = ['#9BB4DD', '#6B9ED4', '#F58758', '#FACE63', '#55C4CC', '#F7C138', '#8580BC', '#7BB446', '#E24050', '#EC59AA', '#F2AEBB', '#01DD9F', '#7AEDDE', '#01D2E9', '#06A1E4', '#A7A9E2', '#A190D7', '#FF99CB', '#FF2D36', '#F19645', '#99CDFF', '#FB896E', '#33BFBE', '#1982C4', '#838DB0', '#50BF94', '#963FC1'];
exports.defaultSettings = {
    verified: true,
    customDispatcher: false,
    chatSettings: {
        assignments: {
            aEng: false,
            mEng: true,
            botEnabled: false,
            priorityAgent: '',
            ruleSets: []
        },
        inactivityTimeouts: {
            transferIn: 3,
            inactiveTimeout: 10,
            endSessionTimeout: 2,
        },
        allowFileSharing: {
            forVisitors: true,
            forAgents: true
        },
        permissions: {
            showRecentChats: true,
            forVisitors: true,
            forAgents: true,
            chatAsGuest: true,
            invitationChatInitiations: true
        },
        transcriptForwarding: {
            emails: []
        },
        transcriptLogo: '',
        tagList: [],
        greetingMessage: '',
        botGreetingMessage: ''
    },
    callSettings: {
        permissions: {
            a2a: false,
            a2v: false,
            v2a: false
        }
    },
    contactSettings: {
        permissions: {
            levelBased: false
        }
    },
    ticketSettings: {
        allowedAgentAvailable: true
    },
    widgetMarketingSettings: {
        permissions: {
            news: true,
            promotions: true,
            faqs: true
        }
    },
    engagementSettings: {
        greetings: {
            conditions: []
        },
        popupMessage: {
            enable: true
        }
    },
    displaySettings: {
        barEnabled: false,
        avatarColor: '#1F282EFF',
        settings: {
            chatbubble: {
                signals: {
                    enabled: false,
                    signalColor: '#F15C24FF',
                    opacity: 1
                },
                radius: {
                    topLeft: '50',
                    topRight: '50',
                    bottomLeft: '50',
                    bottomRight: '50'
                },
                bgColor: '#F15C24FF',
                logoColor: '#FFFFFFFF',
                position: 'bottom-right',
                absolutePosition: {
                    left: 'inherit',
                    bottom: '0',
                    right: '0',
                    top: 'inherit',
                }
            },
            chatbar: {
                bgColor: '#F15C24FF',
                logoColor: '#FFFFFFFF',
                title: 'Chat Now',
                position: 'bottom-right',
                borderRadius: '10px',
                absolutePosition: {
                    left: 'inherit',
                    bottom: '0',
                    right: '0',
                    top: 'inherit',
                },
                radius: {
                    topLeft: '0',
                    topRight: '0',
                    bottomLeft: '0',
                    bottomRight: '0'
                },
            },
            chatwindow: {
                registerationForm: {
                    heading: 'Chat Now',
                    content: 'Please fill in the form below or click on CHAT NOW',
                    btnChat: 'CHAT NOW',
                    btnRegister: 'REGISTER NOW',
                    btnTicket: 'SUBMIT TICKET',
                    isCompulsory: false,
                    customFields: [{
                            label: "Username",
                            name: "username",
                            type: "string",
                            isCollection: false,
                            required: false,
                            default: false,
                            elementType: "text",
                            placeholder: "",
                            value: "",
                            options: [],
                            customRegex: [],
                            mandatory: true,
                            visible: true
                        }, {
                            label: "Email",
                            name: "email",
                            type: "string",
                            isCollection: false,
                            required: false,
                            default: false,
                            elementType: "text",
                            placeholder: "",
                            value: "",
                            options: [],
                            customRegex: [],
                            mandatory: true,
                            visible: true
                        }]
                },
                messageWindow: {
                    heading: 'Hello from Beelinks',
                    sentBGColor: '#D2D6DE66',
                    sentForeColor: '#000000FF',
                    recieveBGColor: '#FF681F1A',
                    recieveForeColor: '#000000FF',
                    sentBGAvatarColor: '#1F282EFF',
                    sentForeAvatarColor: '#FFFFFFFF',
                    recieveBGAvatarColor: '#FF681FFF',
                    recieveForeAvatarColor: '#FFFFFFFF'
                },
                feedbackForm: {
                    query1: "Did this conversation solve your query?",
                    btn1Text: "YES",
                    btn2Text: "NO",
                    query2: "How would you rate this conversation?",
                    transcriptContent: "Email me a copy of the Chat Transcript?",
                    customFields: [
                        {
                            "label": "How would you rate this conversation?",
                            "name": "Q1",
                            "type": "boolean",
                            "isCollection": false,
                            "required": true,
                            "default": false,
                            "elementType": "radio",
                            "placeholder": "",
                            "value": "",
                            "options": [
                                {
                                    "name": "Good",
                                    "value": "Good"
                                },
                                {
                                    "name": "Average",
                                    "value": "Average"
                                },
                                {
                                    "name": "Bad",
                                    "value": "Bad"
                                }
                            ],
                            'mandatory': true
                        },
                        {
                            "label": "Did this conversation solve your query?",
                            "name": "Q2",
                            "type": "boolean",
                            "isCollection": false,
                            "required": true,
                            "default": false,
                            "elementType": "radio",
                            "value": false,
                            "placeholder": "",
                            "options": [
                                {
                                    "name": "Yes",
                                    "value": "true"
                                },
                                {
                                    "name": "No",
                                    "value": "false"
                                }
                            ],
                            'mandatory': true
                        }
                    ],
                    feedbackRequired: true
                },
                initiateChatWindow: {
                    heading: "Chat Now",
                    btnName: "CHAT NOW"
                },
                closeScreen: {
                    content: "Do you want to end this chat?",
                    btn1Text: "YES",
                    btn2Text: "NO"
                },
                ticketForm: {
                    content: "We are currently away. Please fill in the form below and we will get back to you when available.",
                    btnText: "SUBMIT TICKET"
                },
                ticketSubmitted: {
                    heading: "Your Ticket Has Been Submitted Successfully",
                    content: "Do you want to submit another Ticket?",
                    btn1Text: "YES",
                    btn2Text: "NO",
                },
                lostAgentDialogue: {
                    heading: "We are sorry!",
                    content1: "Your chat was disconnected.",
                    content2: "Please leave a message and we will get back to you.",
                    content3: "Submit a Ticket and one of our agents will contact you via email.",
                    btnText: "YES",
                },
                reinitiateDialogue: {
                    heading: "Your Chat Has Ended.",
                    content: "Do you wish to start another chat?",
                    btnText: "START OVER",
                    Reloadcontent: "Reconnecting"
                },
                ticketFormNoAgent: {
                    heading: "We are currently unavailable. ",
                    content: "Would you like to submit a Ticket?",
                    btn1Text: "YES",
                    btn2Text: "NO",
                },
                transcriptFormConfirm: {
                    heading: "Your Chat has Been Ended.",
                    content: "Do You Want To Start Another Chat?",
                    btn1Text: "YES",
                    btn2Text: "NO",
                    transcEmail: "Please provide the details below",
                    transcEmailbtn: "SUBMIT",
                    transcriptSuccess: "Chat Transcript sent successfully",
                    wantTransc: "Do you want Chat Transcript?"
                },
                infoForm: {
                    heading: "What are you looking for?...",
                    btnName: "Search"
                },
                actionsForm: {
                    btnChat: "START CHAT",
                    btnGoToChat: "GO TO CHAT",
                    btnTicket: "SUBMIT TICKET"
                },
                themeSettings: {
                    headerColor: '#F39B64FF',
                    headerSecondryColor: '#F15C24FF',
                    btnColor: '#F15C24FF',
                    btnTextcolor: '#FFFFFFFF',
                    secondryBtnTextColor: '#FFFFFFFF',
                    headerTextColor: '#FFFFFFFF',
                    contentColor: '#1F282EFF',
                    secondryBtnColor: '#368763FF',
                    bgColor: '#FFFFFFFF',
                    borderColor: '#AFB6C4FF',
                    bgImage: {},
                    windowSizeForMobile: '645',
                    windowSizeForDesktop: '730',
                    stickyWindow: true,
                },
                dialogSettings: {
                    dialogBgColor: '#FFFFFFFF',
                    dialogBtnColor: '#368763FF',
                    dialogSecondaryBtnColor: '#C9302CFF',
                    dialogTextColor: '#231f20FF',
                    dialogBtnTextColor: '#FFFFFFFF',
                    dialogSecondaryBtnTextColor: '#FFFFFFFF',
                    dialogLogoColor: '#F15C24FF'
                }
            }
        }
    },
    permissions: {
        'superadmin': {
            tickets: {
                enabled: true,
                canMerge: true,
                canCreate: true,
                canAddGroupAdmins: true,
                canViewLog: true,
                canGroup: true,
                allowCC: true,
                allowBCC: true,
                canView: 'all',
                canAssignAgent: true,
                canAssignGroup: true,
                canAddNote: true,
                canAddTag: true,
                canAddTask: true,
                canChangeState: true,
                canExport: true,
                canSetPriority: true,
                canSnooze: true,
                canSearchIconCustomer: true,
                canRegisterIconCustomer: true,
                canSeeRegisteredIconCustomer: true,
                canSeeRelatedCustomerInfo: true
            },
            agents: {
                enabled: true,
                canCreate: true,
                canEdit: true,
                canEditOthers: true,
                canChat: true,
                canCall: true,
                canAccessBotChats: false,
                canViewStats: true,
                canChangeOwnPassword: true,
                canChangeOthersPassword: true,
                allowedChangeConcurrentChat: true,
                chatSuperVision: false,
                chatSuperVisionIntrusion: false,
                canAddConversationTag: true,
                autoLogout: -1
            },
            chats: {
                enabled: true,
                allowEmoji: true,
                canView: 'all',
                canChat: true,
                allowAttachments: true,
                allowVoicenotes: true,
                allowCalling: true,
                allowAddAsFaq: true,
                allowChatTransfer: true,
                allowTypingStatus: false,
                canRegisterIconCustomer: true,
                canSearchIconCustomer: true,
                canSeeRegisteredIconCustomer: true,
                canSeeRelatedCustomerInfo: true
            },
            dashboard: {
                enabled: true
            },
            visitors: {
                enabled: true
            },
            analytics: {
                enabled: true,
                visitors: true,
                canView: 'all',
                chats: true,
                agents: true,
                tickets: true
            },
            crm: {
                enabled: true
            },
            chatbot: {
                enabled: true
            },
            settings: {
                enabled: true,
                automatedResponses: {
                    enabled: true
                },
                rolesAndPermissions: {
                    enabled: true,
                    canView: ['superadmin', 'admin', 'supervisor', 'agent'],
                    canAddRole: true,
                    canModifyOwn: false,
                    canModifyOther: true,
                    canDeleteRole: true
                },
                formDesigner: {
                    enabled: true
                },
                ticketManagement: {
                    enabled: true,
                    groupManagement: {
                        enabled: true,
                        canCreate: true,
                        canDelete: true,
                        canAddAgents: true,
                        canRemoveAgents: true,
                        canView: 'all',
                        groupViewList: [],
                    },
                    teamManagement: {
                        enabled: true,
                        canCreate: true,
                        canDelete: true,
                        canAddAgents: true,
                        canRemoveAgents: true,
                        canView: 'all',
                        teamViewList: [],
                    },
                    rulesetSettings: {
                        enabled: true,
                        canCreate: true,
                        canModify: true,
                        canDelete: true,
                        canToggle: true
                    },
                    rulesetScheduler: {
                        enabled: true
                    },
                    generalNotifications: {
                        enabled: true
                    },
                    ticketTemplateDesigner: {
                        enabled: true
                    },
                    permissionSettings: {
                        enabled: true
                    },
                    formDesigner: {
                        enabled: true
                    },
                    emailTemplateDesigner: {
                        enabled: true
                    },
                    incomingEmails: {
                        enabled: true
                    },
                    SLAPolicies: {
                        enabled: true
                    },
                    ticketScenarioAutomation: {
                        enabled: true
                    },
                    customFields: {
                        enabled: true,
                        canCreate: true,
                        canModify: true,
                        canDelete: true
                    },
                    customSatisfactionSurvey: {
                        enabled: true
                    }
                },
                chatTimeouts: {
                    enabled: true
                },
                callSettings: {
                    enabled: true
                },
                contactSettings: {
                    enabled: true
                },
                chatWindowSettings: {
                    enabled: true
                },
                chatAssistant: {
                    enabled: true
                },
                webhooks: {
                    enabled: true
                },
                integerations: {
                    enabled: true
                },
                knowledgeBase: {
                    enabled: true
                },
                widgetMarketing: {
                    enabled: true
                }
            },
            installation: {
                enabled: true
            }
        },
        'admin': {
            tickets: {
                enabled: true,
                canMerge: true,
                canCreate: true,
                canAddGroupAdmins: true,
                canViewLog: true,
                canGroup: true,
                allowCC: true,
                allowBCC: true,
                canView: 'all',
                canAssignAgent: true,
                canAssignGroup: true,
                canAddNote: true,
                canAddTag: true,
                canAddTask: true,
                canChangeState: true,
                canExport: true,
                canSetPriority: true,
                canSnooze: true,
                canSearchIconCustomer: true,
                canRegisterIconCustomer: true,
                canSeeRegisteredIconCustomer: true,
                canSeeRelatedCustomerInfo: true
            },
            agents: {
                enabled: true,
                canCreate: true,
                canEdit: true,
                canEditOthers: false,
                canChat: true,
                canAccessBotChats: false,
                canCall: true,
                canViewStats: true,
                canChangeOwnPassword: true,
                canChangeOthersPassword: true,
                allowedChangeConcurrentChat: true,
                chatSuperVision: false,
                chatSuperVisionIntrusion: false,
                canAddConversationTag: true,
                autoLogout: -1
            },
            chats: {
                enabled: true,
                allowEmoji: true,
                canView: 'all',
                canChat: true,
                allowAttachments: true,
                allowVoicenotes: true,
                allowCalling: true,
                allowAddAsFaq: true,
                allowChatTransfer: true,
                allowTypingStatus: true,
                canRegisterIconCustomer: true,
                canSearchIconCustomer: true,
                canSeeRegisteredIconCustomer: true,
                canSeeRelatedCustomerInfo: true
            },
            dashboard: {
                enabled: true
            },
            visitors: {
                enabled: true
            },
            analytics: {
                enabled: true,
                visitors: true,
                canView: 'all',
                chats: true,
                agents: true,
                tickets: true
            },
            crm: {
                enabled: true
            },
            chatbot: {
                enabled: true
            },
            settings: {
                enabled: true,
                automatedResponses: {
                    enabled: true
                },
                rolesAndPermissions: {
                    enabled: true,
                    canView: ['admin', 'supervisor', 'agent'],
                    canAddRole: true,
                    canModifyOwn: true,
                    canModifyOther: true,
                    canDeleteRole: true
                },
                formDesigner: {
                    enabled: true
                },
                ticketManagement: {
                    enabled: true,
                    groupManagement: {
                        enabled: true,
                        canCreate: true,
                        canDelete: true,
                        canAddAgents: true,
                        canRemoveAgents: true,
                        canView: 'all',
                        groupViewList: [],
                    },
                    teamManagement: {
                        enabled: true,
                        canCreate: true,
                        canDelete: true,
                        canAddAgents: true,
                        canRemoveAgents: true,
                        canView: 'all',
                        teamViewList: [],
                    },
                    rulesetSettings: {
                        enabled: true,
                        canCreate: true,
                        canModify: true,
                        canDelete: true,
                        canToggle: true
                    },
                    rulesetScheduler: {
                        enabled: true
                    },
                    generalNotifications: {
                        enabled: true
                    },
                    ticketTemplateDesigner: {
                        enabled: true
                    },
                    permissionSettings: {
                        enabled: true
                    },
                    formDesigner: {
                        enabled: true
                    },
                    emailTemplateDesigner: {
                        enabled: true
                    },
                    incomingEmails: {
                        enabled: true
                    },
                    SLAPolicies: {
                        enabled: true
                    },
                    ticketScenarioAutomation: {
                        enabled: true
                    },
                    customFields: {
                        enabled: true,
                        canCreate: true,
                        canModify: true,
                        canDelete: true
                    },
                    customSatisfactionSurvey: {
                        enabled: true
                    }
                },
                chatTimeouts: {
                    enabled: true
                },
                callSettings: {
                    enabled: true
                },
                contactSettings: {
                    enabled: true
                },
                chatWindowSettings: {
                    enabled: true
                },
                chatAssistant: {
                    enabled: true
                },
                webhooks: {
                    enabled: true
                },
                integerations: {
                    enabled: true
                },
                knowledgeBase: {
                    enabled: true
                },
                widgetMarketing: {
                    enabled: true
                }
            },
            installation: {
                enabled: true
            }
        },
        'supervisor': {
            tickets: {
                enabled: true,
                canMerge: true,
                canCreate: true,
                canAddGroupAdmins: true,
                canViewLog: true,
                canGroup: true,
                allowCC: true,
                allowBCC: true,
                canView: 'all',
                canAssignAgent: true,
                canAssignGroup: true,
                canAddNote: true,
                canAddTag: true,
                canAddTask: true,
                canChangeState: true,
                canExport: true,
                canSetPriority: true,
                canSnooze: true,
                canSearchIconCustomer: true,
                canRegisterIconCustomer: true,
                canSeeRegisteredIconCustomer: true,
                canSeeRelatedCustomerInfo: true
            },
            agents: {
                enabled: true,
                canCreate: true,
                canEdit: true,
                canEditOthers: false,
                canChat: true,
                canAccessBotChats: false,
                canCall: true,
                canViewStats: true,
                canChangeOwnPassword: true,
                canChangeOthersPassword: true,
                allowedChangeConcurrentChat: false,
                chatSuperVision: false,
                chatSuperVisionIntrusion: false,
                canAddConversationTag: false,
                autoLogout: -1
            },
            chats: {
                enabled: true,
                allowEmoji: true,
                canView: 'all',
                canChat: true,
                allowAttachments: true,
                allowVoicenotes: true,
                allowCalling: true,
                allowAddAsFaq: true,
                allowChatTransfer: true,
                allowTypingStatus: true,
                canRegisterIconCustomer: true,
                canSearchIconCustomer: true,
                canSeeRegisteredIconCustomer: true,
                canSeeRelatedCustomerInfo: true
            },
            dashboard: {
                enabled: true
            },
            visitors: {
                enabled: true
            },
            analytics: {
                enabled: true,
                visitors: true,
                canView: 'all',
                chats: true,
                agents: true,
                tickets: true
            },
            crm: {
                enabled: true
            },
            chatbot: {
                enabled: true
            },
            settings: {
                enabled: true,
                automatedResponses: {
                    enabled: true
                },
                rolesAndPermissions: {
                    enabled: true,
                    canView: ['supervisor', 'agent'],
                    canAddRole: true,
                    canModifyOwn: false,
                    canModifyOther: true,
                    canDeleteRole: true
                },
                formDesigner: {
                    enabled: true
                },
                ticketManagement: {
                    enabled: true,
                    groupManagement: {
                        enabled: true,
                        canCreate: true,
                        canDelete: true,
                        canAddAgents: true,
                        canRemoveAgents: true,
                        canView: 'all',
                        groupViewList: [],
                    },
                    teamManagement: {
                        enabled: true,
                        canCreate: true,
                        canDelete: true,
                        canAddAgents: true,
                        canRemoveAgents: true,
                        canView: 'all',
                        teamViewList: [],
                    },
                    rulesetSettings: {
                        enabled: true,
                        canCreate: true,
                        canModify: true,
                        canDelete: true,
                        canToggle: true
                    },
                    rulesetScheduler: {
                        enabled: true
                    },
                    generalNotifications: {
                        enabled: true
                    },
                    ticketTemplateDesigner: {
                        enabled: true
                    },
                    permissionSettings: {
                        enabled: true
                    },
                    formDesigner: {
                        enabled: true
                    },
                    emailTemplateDesigner: {
                        enabled: true
                    },
                    incomingEmails: {
                        enabled: true
                    },
                    SLAPolicies: {
                        enabled: true
                    },
                    ticketScenarioAutomation: {
                        enabled: true
                    },
                    customFields: {
                        enabled: true,
                        canCreate: true,
                        canModify: true,
                        canDelete: true
                    },
                    customSatisfactionSurvey: {
                        enabled: true
                    }
                },
                chatTimeouts: {
                    enabled: true
                },
                callSettings: {
                    enabled: true
                },
                contactSettings: {
                    enabled: true
                },
                chatWindowSettings: {
                    enabled: true
                },
                chatAssistant: {
                    enabled: true
                },
                webhooks: {
                    enabled: true
                },
                integerations: {
                    enabled: true
                },
                knowledgeBase: {
                    enabled: true
                },
                widgetMarketing: {
                    enabled: true
                }
            },
            installation: {
                enabled: false
            }
        },
        'agent': {
            tickets: {
                enabled: true,
                canMerge: true,
                canCreate: true,
                canAddGroupAdmins: true,
                canViewLog: true,
                canGroup: true,
                allowCC: true,
                allowBCC: true,
                canView: 'assignedOnly',
                canAssignAgent: true,
                canAssignGroup: true,
                canAddNote: true,
                canAddTag: true,
                canAddTask: true,
                canChangeState: true,
                canExport: true,
                canSetPriority: true,
                canSnooze: true,
                canSearchIconCustomer: true,
                canRegisterIconCustomer: true,
                canSeeRegisteredIconCustomer: true,
                canSeeRelatedCustomerInfo: true
            },
            agents: {
                enabled: true,
                canCreate: false,
                canEdit: false,
                canEditOthers: false,
                canChat: false,
                canAccessBotChats: false,
                canCall: false,
                canViewStats: false,
                canChangeOwnPassword: true,
                canChangeOthersPassword: true,
                allowedChangeConcurrentChat: false,
                chatSuperVision: false,
                chatSuperVisionIntrusion: false,
                canAddConversationTag: true,
                autoLogout: -1
            },
            chats: {
                enabled: true,
                allowEmoji: true,
                canView: 'self',
                canChat: true,
                allowAttachments: true,
                allowVoicenotes: true,
                allowCalling: true,
                allowAddAsFaq: true,
                allowChatTransfer: true,
                allowTypingStatus: true,
                canRegisterIconCustomer: true,
                canSearchIconCustomer: true,
                canSeeRegisteredIconCustomer: true,
                canSeeRelatedCustomerInfo: true
            },
            dashboard: {
                enabled: true
            },
            visitors: {
                enabled: false
            },
            analytics: {
                enabled: true,
                visitors: true,
                canView: 'all',
                chats: true,
                agents: true,
                tickets: true
            },
            crm: {
                enabled: false
            },
            chatbot: {
                enabled: false
            },
            settings: {
                enabled: true,
                automatedResponses: {
                    enabled: true
                },
                rolesAndPermissions: {
                    enabled: true,
                    canView: [],
                    canAddRole: true,
                    canModifyOwn: false,
                    canModifyOther: true,
                    canDeleteRole: true
                },
                formDesigner: {
                    enabled: false
                },
                ticketManagement: {
                    enabled: false,
                    groupManagement: {
                        enabled: true,
                        canCreate: true,
                        canDelete: true,
                        canAddAgents: true,
                        canRemoveAgents: true,
                        canView: 'all',
                        groupViewList: [],
                    },
                    teamManagement: {
                        enabled: true,
                        canCreate: true,
                        canDelete: true,
                        canAddAgents: true,
                        canRemoveAgents: true,
                        canView: 'all',
                        teamViewList: [],
                    },
                    rulesetSettings: {
                        enabled: true,
                        canCreate: true,
                        canModify: true,
                        canDelete: true,
                        canToggle: true
                    },
                    rulesetScheduler: {
                        enabled: true
                    },
                    generalNotifications: {
                        enabled: true
                    },
                    ticketTemplateDesigner: {
                        enabled: true
                    },
                    permissionSettings: {
                        enabled: true
                    },
                    formDesigner: {
                        enabled: true
                    },
                    emailTemplateDesigner: {
                        enabled: true
                    },
                    incomingEmails: {
                        enabled: true
                    },
                    SLAPolicies: {
                        enabled: true
                    },
                    ticketScenarioAutomation: {
                        enabled: true
                    },
                    customFields: {
                        enabled: true,
                        canCreate: true,
                        canModify: true,
                        canDelete: true
                    },
                    customSatisfactionSurvey: {
                        enabled: true
                    }
                },
                chatTimeouts: {
                    enabled: false
                },
                callSettings: {
                    enabled: false
                },
                contactSettings: {
                    enabled: false
                },
                chatWindowSettings: {
                    enabled: false
                },
                chatAssistant: {
                    enabled: false
                },
                webhooks: {
                    enabled: false
                },
                integerations: {
                    enabled: false
                },
                knowledgeBase: {
                    enabled: false
                },
                widgetMarketing: {
                    enabled: false
                }
            },
            installation: {
                enabled: true
            }
        }
    },
    authentication: {
        'superadmin': {
            enableSSO: false,
            TwoFA: false,
        },
        'admin': {
            enableSSO: false,
            TwoFA: false,
        },
        'supervisor': {
            enableSSO: false,
            TwoFA: false,
        },
        'agent': {
            enableSSO: false,
            TwoFA: false,
        },
        allowedIPs: [],
        suppressionList: [],
        forgotPasswordEnabled: true
    },
    emailNotifications: {
        tickets: {
            newTickCreate: true,
            assignToGroup: true,
            assignToAgent: true,
            repliesToTicket: true,
            userActEmail: true,
            unattendTickGroup: true,
            fSLAviolation: true,
            resSLAviolation: true,
            noteAddTick: true,
            fSLAreminder: true,
            resSLAreminder: true,
            agentInviteEmail: true
        }
    },
    windowNotifications: {
        newTicket: true,
        ticketMessage: true,
        ticketAssigned: true,
        ticketUpdated: true,
        agentConversation: true,
        agentMessage: true,
        visitorConversation: true,
        visitorMessage: true
    },
    customScript: {
        userFetching: ''
    },
    api: {
        firebase: { key: '' }
    },
    schemas: {
        ticket: {
            fields: [
                { label: 'Priority', name: 'priority', type: 'string', isCollection: true, required: false, default: true, elementType: 'dropdown', options: [{ name: "LOW", value: "LOW" }, { name: 'MEDIUM', value: 'MEDIUM' }, { name: 'HIGH', value: 'HIGH' }, { name: 'URGENT', value: 'URGENT' }] },
                { label: 'State', name: 'state', type: 'string', isCollection: true, required: true, default: true, elementType: 'dropdown', options: [{ name: 'OPEN', value: 'OPEN' }, { name: 'PENDING', value: 'PENDING' }, { name: 'SOLVED', value: 'SOLVED' }, { name: 'CLOSED', value: 'CLOSED' }] },
                { label: 'Agent', name: 'assigned_to', type: 'string', isCollection: false, required: false, default: true, elementType: 'textbox', options: [] },
                { label: 'Group', name: 'group', type: 'string', isCollection: true, required: false, default: true, elementType: 'dropdown', options: [] },
                { label: 'Source', name: 'source', type: 'string', isCollection: true, required: true, default: true, elementType: 'dropdown', options: [{ name: 'BEEDESK', value: 'BEEDESK' }, { name: 'LIVECHAT', value: 'LIVECHAT' }, { name: 'PANEL', value: 'PANEL' }] },
            ]
        },
        chats: {
            fields: []
        }
    },
    webhook: {
        facebook: {
            app_id: '2176188859137481'
        }
    }
};
exports.ActionsUrls = [];
exports.machineIP = (process.env.NODE_ENV == 'production') ? '172.31.18.205' : (process.env.NODE_ENV == 'development') ? '172.31.56.100' : '';
exports.Pricing = {
    agentPrice: 16,
    packages: [
        { name: 'honeyComb', price: 16 }
    ]
};
//# sourceMappingURL=constants.ts.BASE.js.map