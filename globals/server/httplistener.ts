//Created By Saad Ismail Shaikh
//Date : 19-1-2018


// Starting HTTP server on Some Port Http Node Library is required.
/*  -- The HTTP interfaces in Node.js are designed to support many features of the protocol which have been traditionally difficult to use. 
    -- In particular, large, possibly chunk-encoded, messages. 
    -- The interface is careful to never buffer entire requests or responses--the user is able to stream data.
    -- https://nodejs.org/api/http.html
*/
import * as http from "http";

//Our Main Application Object Configured.
//Request Handler is the Root to Initialize Express application.
//Ths Layer Sits on top of controllers/routes Extend Security Model.
import { __biZZC_Core } from "../__biZZCMiddleWare";

//Application Global Constants
import * as Constants from "../config/constants"


class HTTPListener {

  private server!: http.Server;
  private application!: Express.Application;
  constructor() {
  }

  public async InitHTTPMiddleWare(): Promise<http.Server> {
    try { 
      await __biZZC_Core.InitApplication();
      return this.server;
    } catch (error) {
      console.log(error);
      console.log('Error in Creating HTTP SERVER... Retrying');
      setTimeout(async () => {
        await __biZZC_Core.InitApplication(); 
      }, 0);
      return this.server;
      // this.server.close();
      // throw new Error(error);
    }
  }

  public async InitSocketMiddleWare() {
    try {
      await __biZZC_Core.RegisterSocketMiddleWare();
    } catch (error) {
      console.log('error in INitializing Socket MIddleWare RequestHandler');
    }
  }

  public StartHttpServer(): http.Server {
    return __biZZC_Core.Application.listen(Constants.port, () => {
      console.log(`Running on localhost:${Constants.port}`)
    });

  }


}
export const httpListener = new HTTPListener();