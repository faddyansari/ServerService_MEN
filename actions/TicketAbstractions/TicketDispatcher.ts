import { SessionManager } from './../../globals/server/sessionsManager';
//Created By Saad Ismail Shaikh
//Dated : 10-9-2019



import { TicketSchema } from "../../schemas/ticketSchema";
import * as cheerio from 'cheerio';
import { Tickets } from "../../models/ticketsModel";
import { Agents } from "../../models/agentModel";
import { Company } from "../../models/companyModel";
import { TicketGroupsModel } from "../../models/TicketgroupModel";
import { RuleSetDescriptor } from "./RuleSetExecutor";
import { TicketLogSchema } from "../../schemas/ticketLogSchema";
import * as request from 'request-promise';

export function TicketDispatcher(actions: Array<any>, ticket: TicketSchema): TicketSchema {

	try {


		actions.map(action => {
			switch (action.name) {
				case 'note':
					// console.log('Adding Note!');

					if (!ticket.ticketNotes) ticket.ticketNotes = [];
					ticket.ticketNotes.push({
						ticketNote: action.value,
						added_by: 'Rule Dispatcher',
						added_at : new Date().toISOString()
					});
					ticket.ticketlog.push({
						title: 'Note Added',
						status: action.value,
						updated_by: 'Rule Dispatcher',
						user_type: 'Agent',
						time_stamp: new Date().toISOString()
					})
					break;
				case 'priority':
					ticket.priority = (action.value as string).toUpperCase();
					ticket.ticketlog.push({
						title: 'Set Priority',
						status: ticket.priority,
						updated_by: 'Rule Dispatcher',
						user_type: 'Agent',
						time_stamp: new Date().toISOString()
					})
					break;
				case 'group':
					ticket.group = (action.value as string).trim();
					ticket.ticketlog.push({
						title: 'Assigned To Group',
						status: ticket.group,
						updated_by: 'Rule Dispatcher',
						user_type: 'Agent',
						time_stamp: new Date().toISOString()
					})
					break;
				case 'agent':
          ticket.assigned_to = (action.value as string).trim();
          ticket.first_assigned_time = new Date().toISOString();
					ticket.ticketlog.push({
						title: 'Assigned To Agent',
						status: ticket.assigned_to,
						updated_by: 'Rule Dispatcher',
						user_type: 'Agent',
						time_stamp: new Date().toISOString()
					})
					break;
			}
		})
		return ticket;


	} catch (error) {
		console.log(error);
		console.log('error in Add Note Abstraction');
		return ticket;
	}


}

export async function CustomDispatcher(ticket: any, msg): Promise<any> {
	// console.log(ticket);
	try{
		let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let company = await Company.getCompany(ticket.nsp);
		let returnOb = {
			primaryTicket : undefined,
			secondaryTicket : ticket
		}
		if (company && company[0].settings.customDispatcher) {
			//Variables
			let lastHours = 36;
			//Parse ticket body
			// console.log(msg);

			let $ = cheerio.load(msg);
			// console.log($);

			// return $;

			let visitorEmail = '';
			let salesPerson = '';
			let blockquote = $('blockquote').find('span h3');
			let p = $('h3');
			// console.log(p);

			if (blockquote.length) {
				visitorEmail = ($(blockquote[1]) as any).html().toLowerCase().split(':')[1].trim();
				if ($(blockquote[5]) && ($(blockquote[5]) as any).html()) {
					let temp = ($(blockquote[5]) as any).html().toLowerCase().split(':');
					if (temp.length > 1) salesPerson = temp[1].trim()
					else salesPerson = 'n/a';
				}
				// salesPerson = (($(blockquote[5]) as any) && ($(blockquote[5]) as any).html()) ? ($(blockquote[5]) as any).html().toLowerCase().split(':')[1].trim() : 'n/a';

			} else if (p.length) {

				visitorEmail = ($(p[1]).html() as any).toLowerCase().split(':')[1].trim();
				if (($(p[5]).html() as any) && ($(p[5]).html() as any)) {
					let temp = ($(p[5]).html() as any).toLowerCase().split(':');
					if (temp.length > 1) salesPerson = temp[1].trim()
					else salesPerson = 'n/a';
				}
				// salesPerson = (($(p[5]).html() as any) && ($(p[5]).html() as any)) ? ($(p[5]).html() as any).toLowerCase().split(':')[1].trim() : 'n/a';
			} else {
				console.log('nothing found!');
				return returnOb;
			}
			if (!emailPattern.test(visitorEmail)) visitorEmail = '';

			if (visitorEmail || salesPerson) {
				// console.log(visitorEmail);
				// console.log(salesPerson);
				let datetime = new Date(addHours(lastHours)).toISOString();
				// console.log('Greater than: ' + datetime);
				let previousTickets = await Tickets.getTicketBySBTVisitor(ticket.nsp, datetime, visitorEmail);
				// console.log(previousTickets.length);

				// salesPerson = 'murtazafakhruddin52@gmail.com';
				// console.log(previousTickets);
				if (salesPerson == 'n/a' || salesPerson == 'possible free') {
					if (previousTickets && previousTickets.length) {
						//Merge and close this ticket
						let primaryTicket = previousTickets[previousTickets.length - 1];
						console.log('Primary Ticket: ');
						// console.log(primaryTicket);
						// let insertedTemp = await Tickets.CreateTicket(ticket);
						let primaryTicketLog = {
							title: "Merged Tickets",
							status: ticket._id,
							updated_by: 'RuleSet Dispatcher',
							user_type: 'System',
							time_stamp: new Date().toISOString()
						}
						let secondaryTicketLog = {
							title: "Merged into ",
							status: primaryTicket._id,
							updated_by: 'RuleSet Dispatcher',
							user_type: 'System',
							time_stamp: new Date().toISOString()
						}
						console.log('Merging!');
						let obj = await Tickets.MergeTickets(ticket.nsp, [ticket._id, primaryTicket._id], { primaryTicketLog: primaryTicketLog, secondaryTicketLog: secondaryTicketLog }, [ticket], primaryTicket._id);
						if (obj) {
							returnOb.primaryTicket = obj.primaryTicket;
							returnOb.secondaryTicket = obj.secondaryTicket[0];
							// ticket = obj.secondaryTicket[0];
							returnOb.secondaryTicket.sbtVisitor = visitorEmail;
							// console.log('Secondary Ticket:');
							// console.log(ticket);
							return returnOb;
						} else return undefined;

					} else {
						ticket.sbtVisitor = visitorEmail;
						returnOb.secondaryTicket = ticket;
						return returnOb;
					}
				} else {
					let agent = await Agents.getAgentsByUsername(ticket.nsp, salesPerson.split('@')[0]);
					if (agent && agent.length) {
						// console.log(agent[0].email);
						ticket.assigned_to = agent[0].email;
					}
					ticket.sbtVisitor = visitorEmail;
					returnOb.secondaryTicket = ticket;
					return returnOb;
				}
			} else {
				return returnOb;
			}
		} else {
			return returnOb;
		}
	}catch(err){
		console.log(err);
	}

}

export async function CustomBeechatDispatcher(ticket: any) : Promise<any>{
	try{
		let subject = ticket.subject;
		let data = ticket.subject.split('/').map(t => t.trim());
		// console.log(data);
		let selectedAgentByDispatcher = '';
		//index 1 = group
		if(data[1]){
			ticket.subject = data[1];
			ticket = await RuleSetDescriptor(ticket);
			selectedAgentByDispatcher = ticket.assigned_to;
			ticket.subject = subject;
		}
		//index 3 = agent
		if(data[3]){
			let agent = await Agents.getAgentsByUsername(ticket.nsp, data[3].toLowerCase());
			if (agent && agent.length) {
				// console.log(agent[0].email);
				ticket.assigned_to = agent[0].email;
			}else{
				ticket.assigned_to = selectedAgentByDispatcher
			}
		}
		return ticket;

	}catch(err){
		console.log('Error in Beechat Dispatcher');
		console.log(err);
		// return ticket;
	}
}

function addHours(hours) {
	return new Date().setTime(new Date().getTime() - (hours * 60 * 60 * 1000));
}

export async function CustomDispatcherForPanel(ticket: any): Promise<any> {
	// console.log(ticket);
	try {
		let returnOb = {
			primaryTicket: undefined,
			secondaryTicket: ticket
		}
		let data = ticket.subject.split('/').map(t => t.trim());
		let selectedAgentByDispatcher = ticket.assigned_to;
		// console.log(ticket.visitor);
		// let lastHours = 36;
		// let datetime = new Date(addHours(lastHours)).toISOString();
		// let previousTickets = await Tickets.getTicketBySBTVisitor(ticket.nsp, datetime, ticket.visitor.email);
		ticket.dynamicFields = {
			'Inquire Source': 'LIVE CHAT'
		}
		let DynamiclogSchema: TicketLogSchema = {
			title: "Dynamic field 'Inquire Source' updated to",
			status: 'LIVE CHAT',
			updated_by: 'Custom Dispatcher',
			user_type: 'Custom Dispatcher',
			time_stamp: new Date().toISOString()
		}
		ticket.ticketlog.push(DynamiclogSchema);

		if (data[3]) {
			// console.log('AGENT: ' + data[3]);
			let agent = await Agents.getAgentsByUsername(ticket.nsp, data[3].toLowerCase());
			if (agent && agent.length) {
				// console.log(agent[0].email);
        ticket.assigned_to = agent[0].email;
        ticket.first_assigned_time = new Date().toISOString();
				let logSchema: TicketLogSchema = {
					title: 'assigned to',
					status: ticket.assigned_to,
					updated_by: 'Custom Dispatcher',
					user_type: 'Custom Dispatcher',
					time_stamp: new Date().toISOString()
				}
				ticket.ticketlog.push(logSchema);
			} else {
				ticket.assigned_to = selectedAgentByDispatcher;
			}
		}

		if(ticket.assigned_to){
			Object.assign(ticket.dynamicFields, { 'Customer Tagging': 'Tagged' });
			ticket.ticketlog.push(
				{
					title: "Dynamic field 'Customer Tagging' updated to",
					status: 'Tagged',
					updated_by: 'Custom Dispatcher',
					user_type: 'Custom Dispatcher',
					time_stamp: new Date().toISOString()
				}
			);
		}else{
			Object.assign(ticket.dynamicFields, { 'Customer Tagging': 'Free' });
			ticket.ticketlog.push(
				{
					title: "Dynamic field 'Customer Tagging' updated to",
					status: 'Free',
					updated_by: 'Custom Dispatcher',
					user_type: 'Custom Dispatcher',
					time_stamp: new Date().toISOString()
				}
			);
		}


		if (data[2] && /^\d+$/.test(data[2])) {
			Object.assign(ticket.dynamicFields, { 'CM ID': data[2].toString().trim() });
			let CMIDlogSchema: TicketLogSchema = {
				title: "Dynamic field 'CM ID' updated to",
				status: data[2].toString(),
				updated_by: 'Custom Dispatcher',
				user_type: 'Custom Dispatcher',
				time_stamp: new Date().toISOString()
			}
			ticket.ticketlog.push(CMIDlogSchema);
			Object.assign(ticket.dynamicFields, { 'Customer': 'Register' });
			ticket.ticketlog.push(
				{
					title: "Dynamic field 'Customer' updated to",
					status: 'Register',
					updated_by: 'Custom Dispatcher',
					user_type: 'Custom Dispatcher',
					time_stamp: new Date().toISOString()
				}
			);
		} else {
			Object.assign(ticket.dynamicFields, { 'Customer': 'New' });
			ticket.ticketlog.push(
				{
					title: "Dynamic field 'Customer' updated to",
					status: 'New',
					updated_by: 'Custom Dispatcher',
					user_type: 'Custom Dispatcher',
					time_stamp: new Date().toISOString()
				}
			);
		}

		if (ticket.visitor && ticket.visitor.email && ticket.visitor.phone) {
			Object.assign(ticket.dynamicFields, { 'Customer Details': 'Complete' });
			ticket.ticketlog.push(
				{
					title: "Dynamic field 'Customer Details' updated to",
					status: 'Complete',
					updated_by: 'Custom Dispatcher',
					user_type: 'Custom Dispatcher',
					time_stamp: new Date().toISOString()
				}
			);
		} else {
			Object.assign(ticket.dynamicFields, { 'Customer Details': 'In-Complete' });
			ticket.ticketlog.push(
				{
					title: "Dynamic field 'Customer Details' updated to",
					status: 'In-Complete',
					updated_by: 'Custom Dispatcher',
					user_type: 'Custom Dispatcher',
					time_stamp: new Date().toISOString()
				}
			);
		}

		if (ticket.visitor && ticket.visitor.email) {
			// ticket.sbtVisitor = ticket.visitor.email;
			let lastHours = 36;
			let datetime = new Date(addHours(lastHours)).toISOString();

			let previousTickets: any = [];
			// console.log(ticket.group);
			// console.log(ticket.assigned_to);
			// if(!ticket.group.match(/INB/gmi)){
			previousTickets = await Tickets.getTicketBySBTVisitor(ticket.nsp, datetime, ticket.visitor.email);
			// }
			if (ticket.group && (ticket.group.match(/INB/gmi) || ticket.group.match(/UK/gmi))) {
				previousTickets = await Tickets.getTicketBySBTVisitorSpecialCase(ticket.nsp, datetime, ticket.visitor.email, ticket.group);
			}

			if (previousTickets && previousTickets.length) {
				//Merge and close this ticket
				let primaryTicket = previousTickets[previousTickets.length - 1];
				// console.log('Primary Ticket: ');
				// console.log(primaryTicket);
				// let insertedTemp = await Tickets.CreateTicket(ticket);
				let primaryTicketLog = {
					title: "Merged Tickets",
					status: ticket._id,
					updated_by: 'RuleSet Dispatcher',
					user_type: 'System',
					time_stamp: new Date().toISOString()
				}
				let secondaryTicketLog = {
					title: "Merged into ",
					status: primaryTicket._id,
					updated_by: 'RuleSet Dispatcher',
					user_type: 'System',
					time_stamp: new Date().toISOString()
				}
				// console.log('Merging!');
				let obj = await Tickets.MergeTickets(ticket.nsp, [ticket._id, primaryTicket._id], { primaryTicketLog: primaryTicketLog, secondaryTicketLog: secondaryTicketLog }, [ticket], primaryTicket._id);
				if (obj) {
					returnOb.primaryTicket = obj.primaryTicket;
					if (obj.primaryTicket.assigned_to) {
						obj.secondaryTicket[0].assigned_to = obj.primaryTicket.assigned_to;
					}
					returnOb.secondaryTicket = obj.secondaryTicket[0];
					// ticket = obj.secondaryTicket[0];
					returnOb.secondaryTicket.dynamicFields = ticket.dynamicFields;
					returnOb.secondaryTicket.sbtVisitor = ticket.visitor.email;
					// console.log('Secondary Ticket:');
					// console.log(ticket);
					return returnOb;
				} else return undefined;

			} else {
				// if (!ticket.dynamicFields) ticket.dynamicFields = {};
				// Object.assign(ticket.dynamicFields, { 'Customer Tagging': 'Free' });
				// ticket.ticketlog.push(
				// 	{
				// 		title: "Dynamic field 'Customer Tagging' updated to",
				// 		status: 'Free',
				// 		updated_by: 'Custom Dispatcher',
				// 		user_type: 'Custom Dispatcher',
				// 		time_stamp: new Date().toISOString()
				// 	}
				// );
				ticket.sbtVisitor = ticket.visitor.email;
				returnOb.secondaryTicket = ticket;
				return returnOb;
			}
		}

		returnOb.secondaryTicket = ticket;
		return returnOb;
	} catch (err) {
		console.log(err);
	}


}

export async function IconnDispatcher(ticket: any): Promise<any> {
	try {
		console.log("Iconn dispatcher");
		let assigned_to = '';
		let customerData = {};
		let splitted = ticket.subject.split('/');
		customerData = {
			"MailAddress": (ticket.sbtVisitor ? ticket.sbtVisitor : ticket.visitor.email).toLowerCase(),
			"PhoneNumber": ticket.sbtVisitorPhone ? ticket.sbtVisitorPhone : '',
			"StockId": '',
			"CustomerId": ticket.dynamicFields && Object.keys(ticket.dynamicFields).length && ticket.dynamicFields['CM ID'] ? ticket.dynamicFields['CM ID'] : splitted && splitted.length && splitted[2] ? splitted[2] : '' ,
		}
		// console.log(customerData);

		let response = await request.post({
            uri: "https://iconnapifunc01-beelinks.iconn-asestaging01.p.azurewebsites.net/api/GetCustomerDetail?code=DTrIaDFTaKSCXoHBXQyA1wVOCKpULKaaOPmxgcxq7lx16XR0GM9G2Q==",
			body: customerData,
			json: true,
			timeout: 50000
		});
		console.log("response code",response.ResultInformation[0].ResultCode);

		if (response && response.ResultInformation && response.ResultInformation.length && response.ResultInformation[0].ResultCode == "0") {
			let emailCheck = ''
			response.CustomerData[0].ContactMailAddressList.map(res=>{
				if(res.Default == "1"){
					emailCheck = res.MailAddress;
				}
			})
			if (!ticket.sbtVisitor && (ticket.visitor.email == 'support@bizzchats.com' || ticket.visitor.email == 'no-reply@sbtjapan.com' || ticket.visitor.email == 'noreply@sbtjapan.com' || ticket.visitor.email.includes('@tickets.livechatinc.com'))) {
				ticket.sbtVisitor = emailCheck;
			}
			// if ((ticket.sbtVisitor ? ticket.sbtVisitor : ticket.visitor.email).toLowerCase() == emailCheck.toLowerCase()) {

				if (!ticket.dynamicFields) ticket.dynamicFields = {};
				ticket.dynamicFields['CM ID'] = response.CustomerData[0].BasicData[0].CustomerId;
				let DynamiclogSchema: TicketLogSchema = {
					title: "Dynamic field 'CM ID' updated to",
					status: response.CustomerData[0].BasicData[0].CustomerId,
					updated_by: 'Iconn Dispatcher',
					user_type: 'Iconn Dispatcher',
					time_stamp: new Date().toISOString()
				}
				ticket.ticketlog.push(DynamiclogSchema);

				if (response.CustomerData[0].SalesPersonData[0].UserName != 'FREE') {
					let masterDataProductionURL = "https://iconnapifunc00-common.iconn-asestaging01.p.azurewebsites.net/api/GetMasterData?code=Bg5TFyJnSpRJ7s5ecl0Rfv8Y/HK7yIYuKLmdMQOUCum0ygEywNHK1Q==";

					let masterData = {
						"MasterDataTypeId": 19
					}
					let res = await request.post({
						uri: masterDataProductionURL,
						body: masterData,
						json: true,
						timeout: 50000
					});

					if (res) {
						let SalesEmpList = res.MasterData;

						let promises = SalesEmpList.map(async val => {
							if (val.EmployeeName == response.CustomerData[0].SalesPersonData[0].UserName) {
								assigned_to = val.EmailAddress;
								let agentCheck = await SessionManager.getAgentByEmail(ticket.nsp,assigned_to);

								if(agentCheck){

									ticket.assigned_to = assigned_to;
									let logSchema: TicketLogSchema = {
										title: 'Ticket assigned to',
										status: ticket.assigned_to,
										updated_by: 'Iconn Dispatcher',
										user_type: 'Iconn Dispatcher',
										time_stamp: new Date().toISOString()
									}
									ticket.ticketlog.push(logSchema);
								}
							}
						});
						await Promise.all(promises);
					}
				}
			// }
			return ticket;
		}else{
			return ticket;
		}
	} catch (err) {
		console.log("In catch block");
		console.log(err)
		return ticket;
	}
}


