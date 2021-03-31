"use strict";
// //Created By Saad Ismail Shaikh 
// // 01-08-2018
// import { SessionManager } from "../../globals/server/sessionsManager";
// import { Agents } from "../../models/agentModel";
// import { Company } from "../../models/companyModel";
// import { EmailService } from "../../services/emailService";
// import { TicketGroupsModel } from "../../models/TicketgroupModel";
// export class AgentSettingsEvents {
//     public static BindAgentSettingsEvents(socket, origin: SocketIO.Namespace) {
//         AgentSettingsEvents.AddAutomatedRespones(socket, origin);
//         AgentSettingsEvents.EditAutomatedResponses(socket, origin);
//         AgentSettingsEvents.DeleteAutomatedResponses(socket, origin);
//         AgentSettingsEvents.SavePermissions(socket,origin);
//         AgentSettingsEvents.getPermissions(socket,origin);
//         AgentSettingsEvents.EditAgentProperties(socket, origin);
//         AgentSettingsEvents.ChangeProfilePic(socket, origin);
//         AgentSettingsEvents.AddRole(socket, origin);
//         AgentSettingsEvents.DeleteRole(socket, origin);
//         AgentSettingsEvents.getDefaultPermissions(socket, origin);
//         AgentSettingsEvents.GetAuthPermissions(socket, origin);
//         AgentSettingsEvents.ToggleAuthPermissions(socket, origin);
//         AgentSettingsEvents.AddAuthIP(socket, origin);
//         AgentSettingsEvents.RemoveAuthIP(socket, origin);
//         AgentSettingsEvents.SetSuppressionList(socket, origin);
//         AgentSettingsEvents.RemoveAgentFromSuppressionList(socket, origin);
//         AgentSettingsEvents.ValidatePassword(socket, origin);
//         AgentSettingsEvents.ChangePassword(socket, origin);
//         AgentSettingsEvents.GetGroupsAgainstAgent(socket, origin);
//         AgentSettingsEvents.Webhook_Facebook(socket, origin);
//     }
//     private static AddAutomatedRespones(socket, origin: SocketIO.Namespace) {
//         socket.on('addAutomatedResponse', async (data, callback) => {
//             try {
//                 let session = socket.handshake.session;
//                 await Agents.InserAutomatedMessage(data.hashTag, data.responseText, session.email);
//                 callback({ status: 'ok' });
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in Add Automated Response');
//             }
//         });
//     }
//     private static EditAutomatedResponses(socket, origin: SocketIO.Namespace) {
//         socket.on('editAutomatedResponse', async (data, callback) => {
//             try {
//                 let session = socket.handshake.session;
//                 await Agents.EditAutomatedMessage(data.hashTag, data.responseText, session.email);
//                 callback({ status: 'ok', hashTag: data.hashTag });
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in Add Automated Response');
//             }
//         });
//     }
//     private static DeleteAutomatedResponses(socket, origin: SocketIO.Namespace) {
//         socket.on('deleteAutomatedResponse', async (data, callback) => {
//             try {
//                 let session = socket.handshake.session;
//                 await Agents.DeleteAutomatedMessage(data.hashTag, session.email);
//                 callback({ status: 'ok', hashTag: data.hashTag });
//             } catch (error) {
//                 console.log(error);
//                 console.log('Error in Add Automated Response');
//             }
//         });
//     }
//     private static EditAgentProperties(socket, origin: SocketIO.Namespace) {
//         socket.on('editAgentProperties', async (data, callback) => {
//             //console.log(data.properties);
//             try {
//                 let updatedAgent = await Agents.EditAgentProperTies(data.properties, data.email);
//                 if (updatedAgent && updatedAgent.value) {
//                     callback({ status: 'ok' });
//                 } else {
//                     callback({ status: 'error' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Editing Agent Properties');
//                 callback({ status: 'error' })
//             }
//         });
//     }
//     private static GetGroupsAgainstAgent(socket, origin: SocketIO.Namespace) {
//         socket.on('getGroupsAgainstAgent', async (data, callback) => {
//             //console.log(data.properties);
//             try {
//                 let groups = await TicketGroupsModel.GetGroupsAgainstAgent(socket.handshake.session.nsp, data.email);
//                 callback({ status: 'ok', groups: groups });
//             } catch (error) {
//                 console.log(error);
//                 console.log('error in Editing Agent Properties');
//                 callback({ status: 'error' })
//             }
//         });
//     }
//     private static ChangeProfilePic(socket, origin: SocketIO.Namespace) {
//         socket.on('changeProfileImage', async (data, callback) => {
//             try {
//                 let updatedAgent = await Agents.EditProfilePic(data.email, data.url);
//                 origin.to(Agents.NotifyAll()).emit('ppChanged', { email: socket.handshake.session.email, url: data.url })
//                 if (updatedAgent && updatedAgent.value) {
//                     callback({ status: 'ok' });
//                 } else {
//                     callback({ status: 'error' });
//                 }
//             } catch (error) {
//                 console.log('error in Uploading Image');
//                 console.log(error);
//                 callback({ status: 'error' });
//             }
//         });
//     }
//     private static SavePermissions(socket, origin: SocketIO.Namespace) {
//         socket.on('savePermissions', async (data, callback) => {
//             try {
//                 console.log('savePermissions');
//                 console.log(data);
//                 let permissions = await Company.updateNSPPermissions(socket.handshake.session.nsp,socket.handshake.session.role, data.permissions,data.role);   
//                 if (permissions && permissions.value) {
//                     let canView = permissions.value.settings.permissions[socket.handshake.session.role]['settings'].rolesAndPermissions.canView;
//                     await SessionManager.UpdateSessionPermissions(socket.handshake.session.nsp,data.role, permissions.value.settings.permissions[data.role])
//                     origin.to(Agents.NotifyAll()).emit('permissionsChanged', { permissions: permissions.value.settings.permissions});
//                     permissions.value.settings.permissions = this.removeObjects(permissions.value.settings.permissions, canView);    
//                     callback({ status: 'ok', permissions: permissions.value.settings.permissions });
//                 } else {
//                     callback({ status: 'error', msg: 'Error saving permissions' });
//                 }
//             } catch (error) {
//                 console.log('error in Uploading Image');
//                 console.log(error);
//                 callback({ status: 'error', msg: 'Error saving permissions' });
//             }
//         });
//     }
//     private static AddRole(socket, origin: SocketIO.Namespace) {
//         socket.on('addRole', async (data, callback) => {
//             try {
//                 let permissions = socket.handshake.session.permissions.settings.rolesAndPermissions;
//                 if(permissions.canAddRole){
//                     let roles = await Company.GetRoles(socket.handshake.session.nsp);
//                     if(roles && roles.length){
//                         if(!roles.includes(data.role)){
//                             let permissions = await Company.updateNSPPermissions(socket.handshake.session.nsp,socket.handshake.session.role, data.permissions,data.role, true);   
//                             if (permissions && permissions.value) {
//                                 let canView = permissions.value.settings.permissions[socket.handshake.session.role]['settings'].rolesAndPermissions.canView;
//                                 await SessionManager.UpdateSessionPermissions(socket.handshake.session.nsp,data.role, permissions.value.settings.permissions[data.role])
//                                 origin.to(Agents.NotifyAll()).emit('permissionsChanged', { permissions: permissions.value.settings.permissions});
//                                 permissions.value.settings.permissions = this.removeObjects(permissions.value.settings.permissions, canView);    
//                                 origin.to(Agents.NotifyAll()).emit('authPermissionsChanged', { permission: permissions.value.settings.authentication});  
//                                 origin['settings']['authentication'] = permissions.value.settings.authentication;
//                                 //console.log(origin['settings']['authentication']);
//                                 callback({ status: 'ok', permissions: permissions.value.settings.permissions });
//                             } else {
//                                 callback({ status: 'error', msg: 'Error adding role' });
//                             }
//                         }else{
//                             callback({ status: 'error', msg: 'Role already exists' });
//                         }
//                     }
//                 }else{
//                     callback({status: 'error', msg: 'Permissions revoked!'})
//                 }
//             } catch (error) {
//                 console.log('error in Uploading Image');
//                 console.log(error);
//                 callback({ status: 'error' });
//             }
//         });
//     }
//     private static DeleteRole(socket, origin: SocketIO.Namespace) {
//         socket.on('deleteRole', async (data, callback) => {
//             try {   
//                 let permissions = socket.handshake.session.permissions.settings.rolesAndPermissions;
//                 if(permissions.canDeleteRole){
//                     let company = await Company.deleteNSPPermissions(socket.handshake.session.nsp, data.permissions,data.role);   
//                     if (company && company.value) {
//                         let canView = company.value.settings.permissions[socket.handshake.session.role]['settings'].rolesAndPermissions.canView;
//                         await SessionManager.UpdateSessionPermissions(socket.handshake.session.nsp,data.role, company.value.settings.permissions[data.role])
//                         origin.to(Agents.NotifyAll()).emit('permissionsChanged', { permissions: company.value.settings.permissions});
//                         company.value.settings.permissions = this.removeObjects(company.value.settings.permissions, canView);    
//                         origin.to(Agents.NotifyAll()).emit('authPermissionsChanged', { permission: company.value.settings.authentication});  
//                         origin['settings']['authentication'] = company.value.settings.authentication;
//                         //console.log(origin['settings']['authentication']);
//                         callback({ status: 'ok', permissions: company.value.settings.permissions });
//                     } else {
//                         callback({ status: 'error', msg: 'Error deleting role' });
//                     }
//                 }else{
//                     callback({status: 'error', msg: 'Permissions revoked!'});
//                 }        
//             } catch (error) {
//                 console.log('error in Uploading Image');
//                 console.log(error);
//                 callback({ status: 'error',msg: 'Error deleting role' });
//             }
//         });
//     }
//     private static ToggleAuthPermissions(socket, origin: SocketIO.Namespace) {
//         socket.on('toggleAuthPermission', async (data, callback) => {
//             try {           
//                 let company = await Company.toggleAuthPermissions(socket.handshake.session.nsp,data.role, data.value);   
//                 if (company && company.value) {
//                     origin.to(Agents.NotifyAll()).emit('authPermissionsChanged', { permission: company.value.settings.authentication});  
//                     origin['settings']['authentication'] = company.value.settings.authentication;
//                     // console.log(origin['settings']['authentication']);
//                     callback({ status: 'ok', permission: company.value.settings.authentication });
//                 } else {
//                     callback({ status: 'error', msg: 'Error toggling auth permission' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 callback({ status: 'error',msg: 'Error toggling auth permission' });
//             }
//         });
//     }
//     private static AddAuthIP(socket, origin: SocketIO.Namespace) {
//         socket.on('addAuthIP', async (data, callback) => {
//             try {           
//                 let company = await Company.addIP(socket.handshake.session.nsp, data.ip);   
//                 if (company && company.value) {
//                     origin.to(Agents.NotifyAll()).emit('authPermissionsChanged', { permission: company.value.settings.authentication});  
//                     origin['settings']['authentication'] = company.value.settings.authentication;
//                     callback({ status: 'ok', permission: company.value.settings.authentication });
//                 } else {
//                     callback({ status: 'error', msg: 'Error adding auth permission' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 callback({ status: 'error',msg: 'Error adding auth permission' });
//             }
//         });
//     }
//     private static SetSuppressionList(socket, origin: SocketIO.Namespace) {
//         socket.on('setSuppressionList', async (data, callback) => {
//             try {           
//                 let company = await Company.setSuppressionList(socket.handshake.session.nsp, data.emails);   
//                 if (company && company.value) {
//                     origin.to(Agents.NotifyAll()).emit('authPermissionsChanged', { permission: company.value.settings.authentication});  
//                     origin['settings']['authentication'] = company.value.settings.authentication;
//                     callback({ status: 'ok', permission: company.value.settings.authentication });
//                 } else {
//                     callback({ status: 'error', msg: 'Error adding auth permission' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 callback({ status: 'error',msg: 'Error adding auth permission' });
//             }
//         });
//     }
//     private static RemoveAgentFromSuppressionList(socket, origin: SocketIO.Namespace) {
//         socket.on('removeAgentFromSuppressionList', async (data, callback) => {
//             try {           
//                 let company = await Company.removeAgentFromSuppressionList(socket.handshake.session.nsp, data.email);   
//                 if (company && company.value) {
//                     origin.to(Agents.NotifyAll()).emit('authPermissionsChanged', { permission: company.value.settings.authentication});  
//                     origin['settings']['authentication'] = company.value.settings.authentication;
//                     callback({ status: 'ok', permission: company.value.settings.authentication });
//                 } else {
//                     callback({ status: 'error', msg: 'Error removing auth permission' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 callback({ status: 'error',msg: 'Error removing auth permission' });
//             }
//         });
//     }
//     private static RemoveAuthIP(socket, origin: SocketIO.Namespace) {
//         socket.on('removeAuthIP', async (data, callback) => {
//             try {           
//                 let company = await Company.removeIP(socket.handshake.session.nsp, data.ip);   
//                 if (company && company.value) {
//                     origin.to(Agents.NotifyAll()).emit('authPermissionsChanged', { permission: company.value.settings.authentication});  
//                     origin['settings']['authentication'] = company.value.settings.authentication;
//                     callback({ status: 'ok', permission: company.value.settings.authentication });
//                 } else {
//                     callback({ status: 'error', msg: 'Error removing auth permission' });
//                 }
//             } catch (error) {
//                 console.log(error);
//                 callback({ status: 'error',msg: 'Error removing auth permission' });
//             }
//         });
//     }
//     private static getDefaultPermissions(socket, origin: SocketIO.Namespace){
//         socket.on('getDefaultPermissions', async (data, callback) => {
//             let permissions = await Company.getDefaultPermissions();
//             if(permissions && permissions.length){
//                 callback({status: 'ok', permissions: permissions[0]})
//             }
//         })
//     }
//     private static ValidatePassword(socket, origin: SocketIO.Namespace){
//         socket.on('validatePassword', async (data, callback) => {
//             // console.log(data.password);
//             let agent = await Agents.validatePassword(data.email, data.password);
//             if(agent && agent.length){
//                 callback({status: true})
//             }else{
//                 callback({status: false})
//             }
//         })
//     }
//     private static ChangePassword(socket, origin: SocketIO.Namespace){
//         socket.on('changePassword', async (data, callback) => {
//             // console.log(data.password);
//             let agent = await Agents.ChangePassword(data.password, data.email);
//             if(agent && agent.value){
//                 if(socket.handshake.session.email != data.email && process.env.NODE_ENV == 'production'){
//                     let obj = {
//                         action: 'sendNoReplyEmail',
//                         to: [data.email],
//                         subject: 'Your Password has been changed!',
//                         message: 'Your password has been changed by the admin, your new password is : '+ data.password,
//                         html: 'Your password has been changed by the admin, your new password is : '+ data.password,
//                         type: 'none'
//                     }
//                     EmailService.SendNoReplyEmail(obj, false);
//                 }
//                 callback({status: true});
//             }else{
//                 callback({status: false})
//             }
//         })
//     }
//     private static GetAuthPermissions(socket, origin: SocketIO.Namespace){
//         socket.on('getAuthPermissions', async (data, callback) => {
//             let authPermissions = await Company.getAuthPermissions(socket.handshake.session.nsp);
//             if(authPermissions){
//                 callback({status: 'ok', authPermissions:authPermissions })
//             }
//         })
//     }
//     private static getPermissions(socket, origin: SocketIO.Namespace) {
//         socket.on('getNSPPermissions', async (data, callback) => {
//             try {
//                 let permissions = await Company.getNSPPermission(socket.handshake.session.nsp);   
//                 //discard all permissions which isnt allowed for this user.
//                 //get user settings permissions and get all roles which this user can view.    
//                 if (permissions && permissions.length) {    
//                     let canView = permissions[0].settings.permissions[socket.handshake.session.role]['settings'].rolesAndPermissions.canView;
//                     permissions[0].settings.permissions = this.removeObjects(permissions[0].settings.permissions, canView);           
//                     callback({ status: 'ok', permissions: permissions[0].settings.permissions });
//                 } else {
//                     callback({ status: 'error', msg: 'Error getting permissions' });
//                 }
//             } catch (error) {
//                 console.log('error in Uploading Image');
//                 console.log(error);
//                 callback({ status: 'error', msg: 'Error getting permissions' });
//             }
//         });
//     }
//     private static Webhook_Facebook(socket, origin: SocketIO.Namespace) {
//         socket.on('getFacebookAppId', async (data, callback) => {
//             try {
//                 let company = await Company.getCompany(socket.handshake.session.nsp);
//                 if(company && company.length){
//                     callback({status: 'ok', app_id: company[0].settings.webhook.facebook.app_id});
//                 }else{
//                     callback({status: 'error'});
//                 }
//             } catch (error) {
//                 console.log('error in Uploading Image');
//                 console.log(error);
//                 callback({ status: 'error', msg: 'Error getting permissions' });
//             }
//         });
//         socket.on('updateFacebookAppId', async (data, callback) => {
//             try {
//                 let company = await Company.updateFacebookAppId(socket.handshake.session.nsp, data.app_id);
//                 if(company && company.ok){
//                     callback({status: 'ok', app_id: company.value.settings.webhook.facebook.app_id});
//                 }else{
//                     callback({status: 'error'});
//                 }
//             } catch (error) {
//                 console.log('error in Uploading Image');
//                 console.log(error);
//                 callback({ status: 'error', msg: 'Error getting permissions' });
//             }
//         });
//     }
//     private static removeObjects(objectRef, keyArr : Array<string>){
//         let obj = objectRef;
//         Object.keys(obj).map(key => {
//             if(!keyArr.includes(key)){
//                 delete obj[key]
//             }
//         });
//         return obj;
//     }
// }
//# sourceMappingURL=agentSettingsEvents.js.map