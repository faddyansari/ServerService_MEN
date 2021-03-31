//Created By Saad Ismail Shaikh
//Date : 19-1-2018
require('source-map-support').install()

// Main Server Started in httpListener.ts ./server/httplistener 
import { httpListener } from "./globals/server/httplistener";

// socketListener Will Hook Http Server.
import { Server } from "http";


// Main Application Loop
class __biZZC_APP_Loop {

  //private httpListener!: HTTPListener;
  private httpListener!: Server

  constructor() {
    console.log('Application Loop Initialized');
  }
  public async Run() {
    try {
      //this.httpServer = await httpServer

      await httpListener.InitHTTPMiddleWare();
      this.httpListener = httpListener.StartHttpServer();
    } catch (error) {
      console.log(error);
      console.log('Error in Running Loop');
    }

  }

  public StartSocket() {
    // this.socketServer.listen(this.httpListener, { pingInterval: 30000, pingTimeout: 20000 });
  }
}

export const server = (new __biZZC_APP_Loop());
server.Run();
