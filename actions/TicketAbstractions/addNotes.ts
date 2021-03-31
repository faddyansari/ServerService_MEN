//Created By Saad Ismail Shaikh 
//Dated : 10-9-2019



import { TicketSchema } from "../../schemas/ticketSchema";
import { Tickets } from "../../models/ticketsModel";
import { TicketLogSchema } from "../../schemas/ticketLogSchema";
import { FindAndModifyWriteOpResultObject, ObjectId } from "mongodb";

export async function AddNoteTicket(ticket: TicketSchema, note: string, by: string): Promise<FindAndModifyWriteOpResultObject<any> | undefined | any[]> {

  try {
    let ticketlog: TicketLogSchema = {
      status: ticket.state,
      updated_by: by,
      user_type: 'Agent',
      time_stamp: new Date().toISOString()
    }

    return await Tickets.UpdateTicketNote([(ticket as any)._id], note, ticket.nsp, ticketlog)


  } catch (error) {
    console.log(error);
    console.log('error in Add Note Abstraction');
    return undefined;
  }


}