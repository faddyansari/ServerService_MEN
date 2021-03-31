import { VisitorSessionSchema } from "../../schemas/VisitorSessionSchema";
import { SessionManager } from "../../globals/server/sessionsManager";
import { __biZZC_SQS } from "../aws/aws-sqs";
import { __BIZZ_REST_REDIS_PUB } from "../../globals/__biZZCMiddleWare";


export async function MakeActive(session: VisitorSessionSchema, data?): Promise<VisitorSessionSchema | undefined> {

    try {

        // console.log('Make Active');


        let activeSession = await SessionManager.MarkReActivate((session.id || session._id) as string, data);
        if (activeSession && activeSession.value) return activeSession.value as VisitorSessionSchema;
        else return undefined;

    } catch (error) {
        console.log(error);
        console.log('Error in Check Active');
        return undefined;
        // console.log(session.state);

    }


}

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