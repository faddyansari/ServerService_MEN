
import { TicketSchema } from "../../schemas/ticketSchema";
import { Tickets } from "../../models/ticketsModel";
import { SLAPolicyModel } from "../../models/SLAPolicyModel";

export async function SLAPolicyExecutor(ticket: TicketSchema, applyPolicy = true): Promise<TicketSchema> {

    try {
        let result;
        let passArr = [];
        let policies = await SLAPolicyModel.getActivatedPolicies();
        if (policies && policies.length) {
            console.log('policies' + policies.length );
            
            policies.map(policy => {
                result = Tickets.CheckPrerequisites(policy, ticket);
                if (result && result.length) {
                    // passArr = passArr.concat(result)
                    //take sla target priority acc to ticket and pass to PolicyDispatcher.
                  
                }
                else{
                    //  ticket.slaPolicyEnabled = false;
                }
            })
            // if(passArr && passArr.length && applyPolicy){
            //     passArr.map(data=>{
            //         ticket = PolicyDispatcher(data, ticket);
            //     })
            // }
        }
        return ticket

    } catch (error) {
        console.log(error);
        console.log('error in SLA Policy Executor');
        return ticket;
    }


}