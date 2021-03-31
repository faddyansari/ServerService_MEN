import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from './SocketService';
import { AuthService } from './AuthenticationService';
import { Observable } from 'rxjs/Observable';
import { PostmessageService } from './post-message.service';
var platform = require('platform');
declare var window;
import * as Fingerprint2 from 'fingerprintjs2'

@Injectable()
export class HelpWindowService {

  windowHelpOpened: BehaviorSubject<boolean> = new BehaviorSubject(true);
  sessionResponse: BehaviorSubject<any> = new BehaviorSubject({});
  subscriptions: Subscription[] = [];
  HelpWindow: Window;
  Agent: BehaviorSubject<any> = new BehaviorSubject({});
  socket: SocketIOClient.Socket;
  license: string = '';
  serverAddress = '';
  windowRef: any;
  sid: string = '';
  Session: BehaviorSubject<any> = new BehaviorSubject({});
  deviceID: string
  returningVisitor: string;
  private req: XMLHttpRequest;
  // HelpFrame : BehaviorSubject<HTMLIFrameElement> = new BehaviorSubject(undefined);
  HelpFrame: HTMLIFrameElement;
  HelpWindowURL: string;
  domain: string;
  ifReadyFrame: boolean = false;
  helpStart: boolean = false;


  constructor(private _socket: SocketService, private _authService: AuthService, private _postMessageService: PostmessageService) {
    this.subscriptions.push(_authService.getAgent().subscribe(data => {
      this.Agent.next(data);
    }));

    this.subscriptions.push(_socket.getSocket().subscribe(data => {
      if (data) {
        this.socket = data;
      }

    }));

    this.subscriptions.push(this._authService.getServer().subscribe(serverAddress => {
      this.serverAddress = serverAddress;
    }));

    this.subscriptions.push(this._postMessageService.HelpReadyToGiveSession.subscribe(data => {
      this.ifReadyFrame = true;

      if (data) {
        this.VerifyCompany().subscribe(data => {
          if (this.ifReadyFrame) this.FrameReady();
          //this.FrameReady();
        })
      }
    }));

    this.subscriptions.push(this._postMessageService.NegotiateReadyEvent.subscribe(helpWindow => {
      if (helpWindow) this.LoadSession();


    }));

    this.subscriptions.push(this._postMessageService.startSupportChat.subscribe(data => {
      //if (data) this.StartChat();
    }));

    //for dev
    this.license = 'b1c3c8fbd308a7f6682ae224dd48c958b2bd32ab';

    this.subscriptions.push(this._authService.helpWindowURL.subscribe(url => {
      this.HelpWindowURL = url;

    }));

    this.subscriptions.push(this._authService.loadscriptDomain.subscribe(url => {
      this.domain = url;

    }));



    //for live
    //this.license = 'eef84f7f450c8fb0cde8cdf767c9cbea5e678671';
  }

  OpenHelpWindow(iframe: ElementRef) {

    this.HelpFrame = iframe.nativeElement;
    if (window.document.domain == 'app.beelinks.solutions' || window.document.domain == 'localhost') {
      this.GiveSession();

    }
  }

  GiveSession() {

    if (this.HelpFrame && this.HelpFrame.contentWindow) {
      this.HelpFrame.contentWindow.postMessage({
        msg: 'getHelpSession',
        cdnAddress: this.HelpWindowURL,
      }, this.HelpFrame.src);
    }
  }

  FrameReady() {

    if (this.HelpFrame && this.HelpFrame.contentWindow) {
      this.HelpFrame.contentWindow.postMessage({
        msg: 'HelpFrameReady'
      }, this.HelpFrame.src);
    }
  }


  VerifyCompany(): Observable<any> {
    return new Observable(observer => {
      this.sid = this.GetSessionID();


      let url = this.serverAddress + '/loadscript/' + this.license + '/' + this.domain + '/' + ((this.sid) ? this.sid : '');
      this.req = new XMLHttpRequest();
      this.req.open('GET', url);
      this.req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      this.req.responseType = 'json';
      this.req.onreadystatechange = async (e: Event) => {
        if (this.req.status == 200 && this.req.readyState == XMLHttpRequest.DONE) {

          let token: any = this.GetDeviceID();
          if (token && token != undefined && token != "undefined" && token.indexOf('undefined') == -1) {

            this.deviceID = token.toString();
            this.returningVisitor = "true";

          }
          else {

            this.GetFingerPrint().subscribe(deviceID => {
              this.deviceID = deviceID;
              this.returningVisitor = "false";

            });

          }

          this.sessionResponse.next(this.req.response);
          (window as any).nsp = this.req.response.nsp;
          (window as any).fshare = this.req.response.fileShare;
          (window as any).allowedCall = this.req.response.allowedCall;
          (window as any).settings = this.req.response.settings;
          (window as any).barEnabled = this.req.response.barEnabled;
          (window as any).avatarColor = this.req.response.avatarColor;
          (window as any).cwSettings = this.req.response.cwSettings;
          (window as any).script = this.req.response.userScript;
          (window as any).__permissions = {
            news: this.req.response.allowedNews,
            promotions: this.req.response.allowedPromotions,
            faqs: this.req.response.allowedFaqs,
            allowedAgentAvailable: this.req.response.allowedAgentAvailable
          }
          //window.script = '';


          if (!this.req.response.exists) {


            try {

              let requestHeaders: any[] = [];
              requestHeaders.push({ name: "Content-type", value: "application/x-www-form-urlencoded" })
              //this.req.headers.append()
              this.GetUserInformation().subscribe(userinformation => {

                let product = (platform.product) ? encodeURIComponent(platform.product) : undefined;
                let manufacturer = (platform.manufacturer) ? encodeURIComponent(platform.manufacturer) : undefined;
                let deviceID = this.deviceID;
                let returningVisitor = this.returningVisitor;
                let referrer = (window.document.referrer) ? encodeURIComponent(window.document.referrer) : undefined;
                let url = this.serverAddress + '/createSession'
                  + this.req.response.nsp
                  + '/' + userinformation.countryCode
                  + '/' + userinformation.country
                  + '/' + userinformation.query
                  + '/' + encodeURIComponent(window.location.href)
                  + '/' + 'Unregistered'
                  + '/' + 'Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0]
                  + '/' + encodeURIComponent(platform.os.family)      //Operating System Name (windows , Mac , Android etc)
                  + '/' + encodeURIComponent(platform.name)        //Browser Name
                  + '/' + encodeURIComponent(platform.version)        //Browser Version Name
                  + '/' + product        //Gets value if Mobile
                  + '/' + manufacturer   //Mobile Manufacturer if Mobile/Tablet or Other than Desktop
                  + '/' + referrer
                  + '/' + deviceID
                  + '/' + returningVisitor

                this.GetSession(url, 'GET', {}, requestHeaders, 'json').subscribe(session => {


                  this.Session.next(session);
                  this.SetSessionID(session.csid);
                  this.SetDeviceID(session.deviceID);
                  observer.next(session)
                  observer.complete();
                });


              });

            } catch (error) {
              observer.next('Error in Getting User Information')

            }


          } else {


            this.Session.next(this.req.response.session);
            this.sessionResponse.next(this.req.response)
            observer.next(this.req.response.session);

          }
        } else {
          //Do Nothing For Error
        }
      }
      this.req.send();

    });
  }

  SetSessionID(sid) {
    localStorage.setItem('__helpSid', sid);
  }
  SetDeviceID(token) {
    localStorage.setItem('__helpdeviceToken', token);
  }

  GetSessionID(): string {
    return localStorage.getItem('__helpSid') || ''
  }
  GetDeviceID(): string {
    return localStorage.getItem('__helpdeviceToken') || undefined;
  }

  GetUserInformation(): Observable<any> {
    return new Observable(observer => {
      let req = new XMLHttpRequest();
      req.open('GET', 'https://extreme-ip-lookup.com/json/', true);
      req.onreadystatechange = (e) => {
        try {
          if (req.status == 200 && req.readyState == 4) {
            observer.next(JSON.parse(req.response));
            observer.complete();
          }
        } catch (error) {
          observer.error({ error: 'Unable To Get User Information' });
        }
      }
      req.send();

    })
  }

  GetSession(url: string, type: string, data: FormData | any, headers?: Array<any>, responseType?: any): Observable<any> {
    return new Observable(observer => {
      let req = new XMLHttpRequest();
      if (responseType) req.responseType = responseType;
      req.open(type, url, true);
      if (headers && headers.length) {
        headers.map(header => {
          req.setRequestHeader(header.name, header.value);
        });
      }
      //req.setRequestHeader()
      req.send(data);
      req.onreadystatechange = (e) => {
        try {
          if (req.readyState == 4) {
            if (req.status >= 200 && req.status < 400) {
              observer.next(req.response);
              observer.complete();
            }
            else observer.error(req.response);
          }
        } catch (error) {
          observer.error(req.response);
        }
      }

    });
  }

  public LoadSession(window?: Window) {
   // console.log(this.Session.getValue());
    this.helpStart = true;
    if (this.Agent.getValue().username) this.Session.getValue().username = this.Agent.getValue().username;
    if (this.Agent.getValue().email) this.Session.getValue().email = this.Agent.getValue().email;
    let payload = {
      serverAddress: this.serverAddress,
      fshare: this.sessionResponse.getValue().fileShare,
      settings: this.sessionResponse.getValue().cwSettings,
      showLoader: this.sessionResponse.getValue().script && (this.sessionResponse.getValue().script.trim()) ? true : false,
      session: this.Session.getValue(),
      helpWindow: true,
    }

    if (this.HelpFrame && this.HelpFrame.contentWindow) {
      this.HelpFrame.contentWindow.postMessage({
        msg: 'HelpWindowReady',
        payload: payload

      }, this.HelpFrame.src);
    }

  }


  GetFingerPrint(): Observable<any> {

    return new Observable(observer => {
      var options = {
        excludeDoNotTrack: true,
        userDefinedFonts: true,
        fonts:
        {
          extendedJsFonts: true
        },
        excludes:
        {
          deviceToolbar: true,
          enumerateDevices: true
        }
      };
      var hash: string = '';
      try {

        Fingerprint2.get(options, function (result: any) {
          var a = '';
          Object.keys(result).map(key => {
            a += result[key].value;
          });
          hash = HelpWindowService.vstr2hash(a).toString();
          observer.next(hash);
          observer.complete();

        });
      }
      catch{
        observer.error("Cannot find Device ID");
      }
    });
  }

  public static vstr2hash(s: string) {
    var nHash = 0;
    if (!s.length) return nHash;
    for (var i = 0, imax = s.length, n; i < imax; ++i) {
      n = s.charCodeAt(i);
      nHash = ((nHash << 5) - nHash) + n;
      nHash = nHash & nHash;
    }
    return Math.abs(nHash);
  }

}
