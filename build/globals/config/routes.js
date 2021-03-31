"use strict";
//Created By Saad Ismail Shaikh
//Date : 19-1-2018
Object.defineProperty(exports, "__esModule", { value: true });
//Register All static or Dynamic Routes Here as export Object
//Static Routes Object "Global Routes"
var staticRoutes_1 = require("./staticRoutes");
Object.defineProperty(exports, "StaticRoutes", { enumerable: true, get: function () { return staticRoutes_1.StaticRoutes; } });
var visitor_1 = require("../../controllers/visitor");
Object.defineProperty(exports, "visitorRoutes", { enumerable: true, get: function () { return visitor_1.visitorRoutes; } });
var orders_1 = require("../../controllers/orders");
Object.defineProperty(exports, "ordersRoutes", { enumerable: true, get: function () { return orders_1.ordersRoutes; } });
var agents_1 = require("../../controllers/agents");
Object.defineProperty(exports, "agentRoutes", { enumerable: true, get: function () { return agents_1.agentRoutes; } });
var chats_1 = require("../../controllers/chats");
Object.defineProperty(exports, "chatRoutes", { enumerable: true, get: function () { return chats_1.chatRoutes; } });
var contact_1 = require("../../controllers/contact");
Object.defineProperty(exports, "contactRoutes", { enumerable: true, get: function () { return contact_1.contactRoutes; } });
var ticket_1 = require("../../controllers/ticket");
Object.defineProperty(exports, "ticketRoutes", { enumerable: true, get: function () { return ticket_1.ticketRoutes; } });
var bulkManagement_1 = require("../../controllers/bulkManagement");
Object.defineProperty(exports, "bulkManagementRoutes", { enumerable: true, get: function () { return bulkManagement_1.bulkManagementRoutes; } });
var iconIntegration_1 = require("../../controllers/iconIntegration");
Object.defineProperty(exports, "iconIntegrationRoutes", { enumerable: true, get: function () { return iconIntegration_1.iconIntegrationRoutes; } });
var register_1 = require("../../controllers/register");
Object.defineProperty(exports, "registerRoutes", { enumerable: true, get: function () { return register_1.registerRoutes; } });
var emails_1 = require("../../controllers/emails");
Object.defineProperty(exports, "emailRoutes", { enumerable: true, get: function () { return emails_1.emailRoutes; } });
var facebook_1 = require("../../controllers/facebook");
Object.defineProperty(exports, "FBRoutes", { enumerable: true, get: function () { return facebook_1.FBRoutes; } });
var webhooks_1 = require("../../controllers/webhooks");
Object.defineProperty(exports, "webhookRoutes", { enumerable: true, get: function () { return webhooks_1.webhookRoutes; } });
var knowledgeBase_1 = require("../../controllers/knowledgeBase");
Object.defineProperty(exports, "KnowledgeBase", { enumerable: true, get: function () { return knowledgeBase_1.KnowledgeBase; } });
var admin_1 = require("../../controllers/admin");
Object.defineProperty(exports, "adminRoutes", { enumerable: true, get: function () { return admin_1.adminRoutes; } });
var reseller_1 = require("../../controllers/reseller");
Object.defineProperty(exports, "resellerRoutes", { enumerable: true, get: function () { return reseller_1.resellerRoutes; } });
var chatBot_1 = require("../../controllers/chatBot");
Object.defineProperty(exports, "chatBotRoutes", { enumerable: true, get: function () { return chatBot_1.chatBotRoutes; } });
var formActions_1 = require("../../controllers/formActions");
Object.defineProperty(exports, "formActionRoutes", { enumerable: true, get: function () { return formActions_1.formActionRoutes; } });
var crm_1 = require("../../controllers/crm");
Object.defineProperty(exports, "crmRoutes", { enumerable: true, get: function () { return crm_1.crmRoutes; } });
//# sourceMappingURL=routes.js.map