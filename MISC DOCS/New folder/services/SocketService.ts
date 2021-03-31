import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//RxJs Imports
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
//End RxJs Imports

import * as io from 'socket.io-client';

//Services
import { AuthService } from './AuthenticationService';
import { CallingService } from './CallingService';



@Injectable()

export class SocketService {
  agent: any;
  visitorList: any;
  status: BehaviorSubject<string> = new BehaviorSubject('');
  public socket: BehaviorSubject<SocketIOClient.Socket> = new BehaviorSubject(null);

  //For Development Environment
  private serverAddress: string;
  private script: BehaviorSubject<string> = new BehaviorSubject('');

  private RedirectURI: string = '';

  // private apidummy: string = 'http://192.168.20.118:8000/getCookie/'
  constructor(private http: HttpClient, private _authService: AuthService) {
    console.log('Socket Service!');


    this._authService.getSocketServer().subscribe(serverAddress => {
      this.serverAddress = serverAddress;
    });

    _authService.getAgent().subscribe((data) => {
      if (Object.keys(data).length > 0) {
        this.agent = data;
        //console.log('Got Agent');
      }
    });

    _authService.GetRedirectionURI().subscribe(uri => {
      this.RedirectURI = uri;
    });

    _authService.getSettings().subscribe(settings => {

      if (!this.socket.getValue() && Object.keys(settings).length) {
        let roomNames = (Array.isArray(this.agent.group)) ? this.resolveRoomNames(this.agent.group) : this.agent.group;
        this.socket.next(io(this.serverAddress + this.agent.nsp, {
          // transports: ["polling", "websocket"],
          transports: ["websocket"],
          secure: true,
          reconnection: true,
          reconnectionDelay: 2500,
          randomizationFactor: 0.6,
          query: 'type=Agents&location=' + roomNames
            + '&nickname=' + this.agent.username
            + '&email=' + this.agent.email
            + '&csid=' + this.agent.csid
            + '&acceptingChats=' + settings.applicationSettings.acceptingChatMode
        }));
      }


      this.socket.subscribe(data => {
        if (data) {
          data.on('connect', () => {
            // console.log('Socket Connected!');
            this.UpdateStatus('Connected');

            //Preventing Reconnection Flood
            // console.log('Buffer', (data as any).sendBuffer);
            //if ((data as any) && (data as any).sendBuffer && (data as any).sendBuffer.length) (data as any).sendBuffer = [];
          });


          this.socket.getValue().on('getSession', (data) => {
            //console.log(data.sessionId);
            _authService.RenewSession(data.sessionId);
          });

          this.socket.getValue().on('disconnect', (data) => {
            // console.log('Socket Disconnected!');
            this.UpdateStatus('Disconnected');
          });

          this.socket.getValue().on('reconnect_attempt', () => {
            let roomNames = (Array.isArray(this.agent.group)) ? this.resolveRoomNames(this.agent.group) : this.agent.group;

            data.io.opts.query = 'type=Agents&location=' + roomNames
              + '&nickname=' + this.agent.username
              + '&email=' + this.agent.email
              + '&csid=' + this.agent.csid
          });


          this.socket.getValue().on('displayScript', (data) => {
            (data.script.length > 0) ? this.script.next(data.script[0].script.trim()) : this.script.next('');
          });
        }
      });
    });
    // console.log('Socket Service Initialized');
    // console.log(this.socket);
  }


  public UpdateStatus(status: string) {
    this.status.next(status);
  }
  public GetStatus() {
    return this.status.asObservable()
  }

  public getScript(): Observable<string> {
    return this.script.asObservable();
  }

  public setScript(value: string) {
    this.script.next(value);
  }

  public getSocket(): Observable<SocketIOClient.Socket> {
    return this.socket.asObservable();
  }

  public Disconnect() {
    this.socket.getValue().emit('logout', { sid: this.agent.csid }, (response) => {
      if (response.status == 'ok' || response.status == 'error') {
        this.socket.next(this.socket.getValue().disconnect());
        if (this.RedirectURI) window.location.href = this.RedirectURI;
        else window.location.reload(true);
      }
    });
  }

  public TestingDisconnect(){
    this.socket.getValue().disconnect();
  }

  public TestingReconnect(){
    this.socket.getValue().connect();
  }

  private resolveRoomNames(roomArray: Array<string>): string {
    return roomArray.join(",").replace(/,/g, '|');
  }


}
