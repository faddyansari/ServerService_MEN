//Created By Saad Ismail Shaikh 
//Dated : 10-9-2019



import { TicketSchema } from "../../schemas/ticketSchema";
import { Tickets } from "../../models/ticketsModel";
import { TicketDispatcher } from "./TicketDispatcher";
import { TicketGroupsModel } from "../../models/TicketgroupModel";

export async function RuleSetDescriptor(ticket: TicketSchema, applyRulesets = true): Promise<TicketSchema> {

	try {

		let ruleSets = await Tickets.GetRulesets(ticket);

		let result = await Tickets.ApplyRuleSets(ruleSets, ticket);
		
		if (result && applyRulesets) ticket = TicketDispatcher(result.actions, ticket);
		
		// console.log(ticket);

		if (!ticket.assigned_to && ticket.group) {
			let autoAssignSettings = await TicketGroupsModel.GetAutoAssign(ticket.nsp, ticket.group);
			// console.log(autoAssignSettings);
			if (autoAssignSettings && autoAssignSettings.length && autoAssignSettings[0].auto_assign.enabled) {
				let previousTickets : any = [];
				if(ticket.visitor && ticket.visitor.email && ticket.nsp == '/sbtjapaninquiries.com'){
					// ticket.sbtVisitor = ticket.visitor.email;
					let lastHours = 36;
					let datetime = new Date(addHours(lastHours)).toISOString();
		
					// let previousTickets : any = [];
					// console.log(ticket.group);
					// console.log(ticket.assigned_to);
					previousTickets = await Tickets.getTicketBySBTVisitor(ticket.nsp, datetime, ticket.visitor.email);

					if (ticket.group && (ticket.group.match(/INB/gmi) || ticket.group.match(/UK/gmi))) {
						previousTickets = await Tickets.getTicketBySBTVisitorSpecialCase(ticket.nsp, datetime, ticket.visitor.email, ticket.group);
					}
				}
				if(!previousTickets.length){
					switch (autoAssignSettings[0].auto_assign.type) {
						case 'roundrobin_turn':
							console.log('Round Robin!');
							let assignedTicket_R = await Tickets.GetAgentInRoundRobin(ticket.group, ticket)
							if (assignedTicket_R) ticket = assignedTicket_R;
							break;
						case 'availableagents':
							// console.log('Available Agents!');
							let assignedTicket_A = await Tickets.FindBestAvailableAgentTicketInGroup(ticket.group, ticket)
							if (assignedTicket_A) ticket = assignedTicket_A;
							break;
						case 'roundrobin':
							// console.log('Best Fit')
							let assignedTicket_B = await Tickets.FindBestAgentTicketInGroup(ticket.group, ticket)
							if (assignedTicket_B) ticket = assignedTicket_B;
							break;
						default:
							break;
					}
				}
			}
		}else if(ticket.assigned_to && ticket.group){
			//get group details
			let groupDetails = await TicketGroupsModel.GetAutoAssign(ticket.nsp, ticket.group);
			//check if agent exists in new group
			if(groupDetails && groupDetails.length && !groupDetails[0].agent_list.filter(a => a.email == ticket.assigned_to).length){
				//run assignment
				ticket.assigned_to = '';
				if (groupDetails && groupDetails.length && groupDetails[0].auto_assign.enabled) {
					let previousTickets : any = [];
					if(ticket.visitor && ticket.visitor.email && ticket.nsp == '/sbtjapaninquiries.com'){
						// ticket.sbtVisitor = ticket.visitor.email;
						let lastHours = 36;
						let datetime = new Date(addHours(lastHours)).toISOString();
			
						// let previousTickets : any = [];
						// console.log(ticket.group);
						// console.log(ticket.assigned_to);
						previousTickets = await Tickets.getTicketBySBTVisitor(ticket.nsp, datetime, ticket.visitor.email);
	
						if (ticket.group && (ticket.group.match(/INB/gmi) || ticket.group.match(/UK/gmi))) {
							previousTickets = await Tickets.getTicketBySBTVisitorSpecialCase(ticket.nsp, datetime, ticket.visitor.email, ticket.group);
						}
					}
					if(!previousTickets.length){
						switch (groupDetails[0].auto_assign.type) {
							case 'roundrobin_turn':
								console.log('Round Robin!');
								let assignedTicket_R = await Tickets.GetAgentInRoundRobin(ticket.group, ticket)
								if (assignedTicket_R) ticket = assignedTicket_R;
								break;
							case 'availableagents':
								// console.log('Available Agents!');
								let assignedTicket_A = await Tickets.FindBestAvailableAgentTicketInGroup(ticket.group, ticket)
								if (assignedTicket_A) ticket = assignedTicket_A;
								break;
							case 'roundrobin':
								// console.log('Best Fit')
								let assignedTicket_B = await Tickets.FindBestAgentTicketInGroup(ticket.group, ticket)
								if (assignedTicket_B) ticket = assignedTicket_B;
								break;
							default:
								break;
						}
					}
				}
			}else{
				//do nothing
			}
		}

		return ticket

	} catch (error) {
		console.log(error);
		console.log('error in Ruleset Descriptor');
		return ticket;
	}

	
}

function addHours(hours) {
	return new Date().setTime(new Date().getTime() - (hours * 60 * 60 * 1000));
}