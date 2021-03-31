import { Agents } from './../../models/agentModel';
import { TicketGroupsModel } from './../../models/TicketgroupModel';
import { MessageSchema, MessageBodyAtachment } from "../../schemas/messageSchema";
import * as path from "path";
import { Tickets } from "../../models/ticketsModel";
import { TicketLogSchema } from '../../schemas/ticketLogSchema';
import { SessionManager } from '../../globals/server/sessionsManager';

export class Utils {

    private static GetAgentTicketMessage(message: MessageSchema, timeZone) {
        try {
            let body = '';
            if (message.attachment) {
                (message.body as Array<MessageBodyAtachment>).map(item => {
                    switch (Utils.GetMimeType(item.path)) {
                        case 'image':
                            body += `<img src='${item.path}' width='100%'><br>`;
                            break;
                        case 'audio':
                            body += `<audio controls><source src="${item.path}" type="audio/mp3">${item.filename}</audio><br>`;
                            break;
                        case 'video':
                            body += `<video width="320" height="240" controls><source src="${item.path}" type="video/mp4">${item.filename}</video><br>`;
                            break;
                        // case 'document':
                        //     body += `<a href="${item.path}" target="_blank">${item.filename}</a><br>`;
                        default:
                            body += `<a href="${item.path}" target="_blank">${item.filename}</a><br>`;
                            // body += item.path + '<br>';
                            break;
                    }
                });
            } else {
                body += (message.body as string);
            }
            let result = `
            <tr>
                <td>
                    <div style="width:100%;color:#000;margin-bottom:10px;display:block;position:relative;">
                    <div style="float:right;display:grid;width:fit-content;padding:10px 20px;margin-bottom:5px;border-radius:20px;background-color:rgba(210, 214, 222, 0.4);text-align:left;">
                        <p style="margin:0 !important;white-space:pre-line !important;">${body}</p>
                    </div>
                    <div style="clear:both;"></div>
                    <small style="opacity:0.5;text-transform:uppercase;text-align:left;font-size:10px;font-weight:bold;float:right;padding-left: 10px;">`+ new Date(message.date).toLocaleString('en-US', { timeZone: timeZone }) + `</small>
                    <div style="clear:both;"></div>
                </div>
                </td>
            </tr>`
            return result;
        } catch (error) {
            console.log(error);
            console.log('error in GetVisitor Ticket MEssage')
        }


    }

    private static GetVisitorTicketMessage(message: MessageSchema, timeZone, color?) {
        let body = '';
        if (message.attachment) {
            (message.body as Array<MessageBodyAtachment>).map(item => {
                switch (Utils.GetMimeType(item.path)) {
                    case 'image':
                        body += `<img src='${item.path}' width='100%'><br>`;
                        break;
                    case 'audio':
                        body += `<audio controls><source src="${item.path}" type="audio/mp3">${item.filename}</audio><br>`;
                        break;
                    case 'video':
                        body += `<video width="320" height="240" controls><source src="${item.path}" type="video/mp4">${item.filename}</video><br>`;
                        break;
                    // case 'document':
                    //     // body += `<a href="${item.path}" target="_blank">${item.filename}</a><br>`;
                    //     break;
                    default:
                        body += `<a href="${item.path}" target="_blank">${item.filename}</a><br>`;
                        // body += item.path + '<br>';
                        break;
                }
            });
        } else {
            body += (message.body as string);
        }
        return `
        <tr>
            <td>
                <div style="width:100%;color:#000;margin-bottom:10px;display:block;position:relative;">
                    <div style="float:left;display:grid;width:fit-content;padding:10px 20px;margin-bottom:5px;border-radius:20px;background-color:rgba(255, 97, 0, 0.3);text-align:left;">
                        <p style="margin:0 !important;white-space:pre-line !important;">${body}</p>
                    </div>
                    <div style="clear:both;"></div>
                    <small style="opacity:0.5;text-transform:uppercase;text-align:left;font-size:10px;font-weight:bold;float:left;padding-left: 10px;">`+ new Date(message.date).toLocaleString('en-US', { timeZone: timeZone }) + `</small>
                    <div style="clear:both;"></div>
                </div>
            </td>
      </tr>`
    }

    private static GetEventsTicketMessage(message: MessageSchema, timeZone, color?) {


        return `
        <tr>
            <td>
                <table border="0" cellpadding="0" cellspacing="0">
                    <tbody>
                        <tr>
                            <td style="width:200px">
                                <div style="height:1px;background-color:#e8e8e8;width:100%;"></div>
                            </td>
                            <td style="max-width:400px;">
                                <div style="width:100%;color:#000;margin-bottom:10px;display:block;position:relative;">
                                    <div style="width:max-content;display:flex;align-items:center;flex-direction:column;justify-content:center;padding:10px 20px;margin:0 auto;border-radius:20px;background-color:#fbfbfb;text-align:left;">
                                        <p style="margin:0 !important;white-space:pre-line;text-align:center;font-size:12px;">
                                            <span>${message.body}</span>
                                            <span style="color:#56a6ff;white-space:nowrap;line-height:20px;">`+ new Date(message.date).toLocaleString('en-US', { timeZone: timeZone }) + `</span>
                                        </p>
                                    </div>
                                    <div style="clear:both;"></div>
                                </div>
                            </td>
                            <td style="width:200px">
                                <div style="height:1px;background-color:#e8e8e8;width:100%;"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
      </tr>`
    }


    private static GenerateTicketString(messages: string, visitorName: string, visitorEmail: string, chatID) {

        return `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                    <title>Document</title>
                    <link
                    href="https://fonts.googleapis.com/css?family=Montserrat&display=swap"
                    rel="stylesheet"
                    />
                    <!-- <link
                    rel="stylesheet"
                    href="https://d24urpuqgp4by2.cloudfront.net/v1.0/css/uikit.bundle.min.css"
                    /> -->
                    <style>
                    * {
                        margin: 0;
                        padding: 0;
                        border: 0;
                        border-collapse: collapse;
                        outline: none;
                        list-style: none;
                        background: none;
                        text-decoration: none;
                        border-spacing: 0;
                        box-sizing: border-box;
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
                    </style>
                </head>
                <body style="background-color: #f2f3f3;padding: 10px">
                    <table style="width: 600px;margin:auto;background-color: white">
                    <tr>
                        <td>
                        <table style="font-family: 'Montserrat', sans-serif;width: 100%;">
                            <tr>
                                <th>
                                    <h2 style="text-align:center;margin-bottom:0;margin-top:20px;padding-bottom:0;">Ticket From Chat</h2>
                                </th>
                            </tr>
                            <tr>
                                <td style="text-align:center;margin-bottom:0;margin-top:20px;padding-bottom:0;">
                                    <p style="display:flex;align-items:center;flex-direction:column;padding: 4px;font-size: 12px;margin-bottom: 10px!important;font-weight: 600">${(visitorName) ? 'Name: ' + visitorName + '<br>' : ''}${'Email: ' + visitorEmail}<br>${'Chat id: <span style="color:#ff681f;">' + chatID + '</span>'}</p>
                                </td>
                            </tr>
                        </table>

                        <table style="width: 100%;">
                            <tr>
                            <td style="padding: 10px;">
                                <table class="message-box" style="width:100%">
                                <tr>
                                    <td>
                                        <table style="width:100%;margin-bottom: 20px;">${messages}</table>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </table>
                </body>
            </html>
            `;
    }

    public static GetStateKey(state: number) {

        switch (state.toString()) {
            case '1': return 'Browsing';
            case '2': return 'Queued';
            case '3': return 'Chatting';
            case '4': return 'Invited'
            default: return '';
        }

    }

    public static GetMimeType(url) {
        switch (path.extname(url).toLowerCase()) {
            case 'png':
            case 'jpeg':
            case 'jpg':
            case 'bmp':
            case 'svg':
            case 'gif':
                return 'image';
            case 'mp3':
                return 'audio';
            case 'mp4':
            case 'm4a':
            case 'm4v':
            case 'f4v':
            case 'm4b':
            case 'f4b':
            case 'mov':
                return 'video';
            case 'pdf':
            case 'xlsx':
            case 'docx':
            case 'doc':
            case 'txt':
            case 'csv':
                return 'document';
            default:
                return 'data';
        }
    }

    public static async GroupAutoAssign() {
        let currentTime = new Date();
        let lockDay = new Date().toString().split(' ')[0];
        let currentDateTime = new Date().toISOString();
        let datetime = new Date(this.addHours(48)).toISOString();
        console.log('Greater than: ' + datetime);
        let dateStr = new Date().toISOString().split('T');
        dateStr[1] = '19:00:00:000Z';
        let lessthanDatetime = dateStr[0] + 'T' + dateStr[1];
        console.log('Less Than: ', lessthanDatetime);
        if (lockDay != 'Sun') {
            let previousTickets = await Tickets.getPreviousTicketsByNSP('/localhost.com', datetime, lessthanDatetime);
            if (previousTickets && previousTickets.length) {
                previousTickets.map(async ticket => {
                    ticket.entertained = false;
                    ticket.iterationcount = 0;
                    /**CONDITIONS TO PICK TICKET */
                    if (!ticket.entertained && (ticket.sbtVisitor || ticket.sbtVisitorPhone || ticket.source == 'livechat' || ticket.source == 'email' || ticket.visitor.phone)
                        && (!ticket.CustomerInfo || ticket.CustomerInfo && ticket.CustomerInfo.salesPersonName == 'FREE')) {
                        if (ticket.group) {
                            let generalsettingsdata = await TicketGroupsModel.getGeneralSettings('/localhost.com', ticket.group);
                            if (generalsettingsdata.enabled) {
                                let unEntertainedTickets = await Tickets.getMessagesByTicketId([ticket._id]);
                                if (unEntertainedTickets && unEntertainedTickets.length) {
                                    ticket.entertained = true;
                                }
                                else ticket.entertained = false;
                                
                                Array(generalsettingsdata.assignmentLimit).fill(0).map(async limit => {
                                    ticket.iterationcount = ticket.iterationcount + 1;
                                    if (!ticket.entertained && (!ticket.checkingTime || currentDateTime > ticket.checkingTime)) {
                                        ticket.checkingTime = new Date(currentTime.setMinutes(currentTime.getMinutes() + generalsettingsdata.unEntertainedTime)).toISOString();
                                        ticket = this.getBestFittedAgentInShiftTimes(ticket.group, ticket);
                                        if (ticket.assigned_to != '') {
                                            let logSchema: TicketLogSchema = {
                                                title: 'Ticket Assigned to Shift Time Agent',
                                                status: ticket.assigned_to,
                                                updated_by: 'Group Auto Assignment',
                                                user_type: 'Group Auto Assignment',
                                                time_stamp: new Date().toISOString()
                                            }
                                            ticket.ticketlog.push(logSchema);
                                        } else {
                                            ticket.assigned_to = generalsettingsdata.fallbackNoShift;
                                            let logSchema: TicketLogSchema = {
                                                title: 'Ticket Assigned to Fallback Agent (no-one in shift)',
                                                status: ticket.assigned_to,
                                                updated_by: 'Group Auto Assignment',
                                                user_type: 'Group Auto Assignment',
                                                time_stamp: new Date().toISOString()
                                            }
                                            ticket.ticketlog.push(logSchema);

                                        }

                                        ticket.iterationcount = ticket.iterationcount + 1;
                                        // await Tickets.UpdateTicketObj(ticket);
                                    }
                                })
                                if(ticket.iterationcount >= generalsettingsdata.assignmentLimit + 1){
                                    ticket.assigned_to = generalsettingsdata.fallbackLimitExceed
                                    let logSchema: TicketLogSchema = {
                                        title: 'Ticket Assigned to Fallback Agent (re-assignment limit exceeded)',
                                        status: ticket.assigned_to,
                                        updated_by: 'Group Auto Assignment',
                                        user_type: 'Group Auto Assignment',
                                        time_stamp: new Date().toISOString()
                                    }
                                    ticket.ticketlog.push(logSchema);
                                }
                            }
                        }
                    }
                    await Tickets.UpdateTicketObj(ticket);
                })
            }
        }
    }

    public static async getBestFittedAgentInShiftTimes(group, ticket) {
        try {
            let response: any = [];
            let checkIfExists = false;
            let filteredAgents: any = [];
            let currentDateTime = new Date().toISOString();

            //assign agent
            let count = 0;
            let bestAgent = '';
            let groups = await TicketGroupsModel.getGroupByName(ticket.nsp, ticket.group);
            if (groups && groups.length) {
                let onlineAgents = await SessionManager.getAllLiveAgentsByEmails(ticket.nsp, groups[0].agent_list.map(a => a.email));
                onlineAgents = [{ email: 'mufahad9213@sbtjapan.com' }]
                if (onlineAgents && onlineAgents.length) {
                    onlineAgents.map(agent => {
                        filteredAgents.push({
                            email: agent.email,
                            count: groups[0].agent_list.filter(a => a.email == agent.email)[0].count,
                            isAdmin: groups[0].agent_list.filter(a => a.email == agent.email)[0].isAdmin,
                            excluded: groups[0].agent_list.filter(a => a.email == agent.email)[0].excluded
                        })
                    });
                    groups[0].agent_list = filteredAgents;
                } else {
                    groups[0].agent_list = [];
                }
                groups[0].agent_list.filter(a => !a.excluded).map((agent, index) => {
                    if (index == 0) {
                        count = agent.count;
                        bestAgent = agent.email;
                        return;
                    }
                    else {
                        if (agent.count < count) {
                            bestAgent = agent.email;
                            count = agent.count;
                        }
                    }
                })
            }

            if (bestAgent) {
                response = await Agents.getAgentByShiftTime(bestAgent, ticket.nsp);

                if (response) {
                    let shiftOut = new Date(new Date().toLocaleDateString() + ' ' + response.ShiftEnd.split(':')[0] + ':' + ' ' + response.ShiftEnd.split(':')[1]);
                    let shiftend = shiftOut.toISOString();
                    checkIfExists = currentDateTime < shiftend;
                }

                if (checkIfExists) {
                    ticket.assigned_to = bestAgent;
                    TicketGroupsModel.IncrementCountOfAgent(ticket.nsp, ticket.group, bestAgent)
                } else {
                    ticket.assigned_to = '';
                }
            }
            else ticket.assigned_to = '';
            return ticket;
        } catch (err) {
            console.log(err);
            console.log('Error in Finding Best AGent Ticket');
            return undefined;
        }
    }

    public static addHours(hours) {
        return new Date().setTime(new Date().getTime() - (hours * 60 * 60 * 1000));
    }

    public static GenerateTicketTemplate(messages: Array<MessageSchema>, visitorName, visitorEmail, chatID, viewcolor, timeZone) {

        try {

            let messageString = '';
            if (!timeZone) timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            messages.map(message => {

                if (message.type == 'Visitors') {
                    messageString += this.GetVisitorTicketMessage(message, timeZone, viewcolor);
                    // console.log(messageString);
                }
                else if (message.type == 'Agents') {
                    messageString += this.GetAgentTicketMessage(message, timeZone);
                    // console.log(messageString);

                }
                else if (message.type == 'Events') {
                    messageString += this.GetEventsTicketMessage(message, timeZone);
                    // console.log(messageString);

                }
            })

            return this.GenerateTicketString(messageString, visitorName, visitorEmail, chatID);


        } catch (error) {
            console.log(error);
            console.log('error in Generating Ticket Template');
            return '';
        }

    }

}