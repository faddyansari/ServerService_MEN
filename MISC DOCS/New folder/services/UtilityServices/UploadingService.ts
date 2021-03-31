// Angular Imports
import { Injectable } from "@angular/core";
import { Http, URLSearchParams, QueryEncoder } from '@angular/http';

//RxJs Imports
import { Observable } from 'rxjs/Observable';

//Xml2JS
import { parseString } from 'xml2js';
import { AuthService } from "../AuthenticationService";
import { SocketService } from "../SocketService";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import * as ebml from 'ts-ebml';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs/observable/forkJoin";



@Injectable()
export class UploadingService {

    private Agent;
    final = [];
    fileLinks = [];
    fileUrls = [];
    uploading = false;
    fileValid = false;
    linkss = [];
    responses = [];
    private uploadingUrl = '';
    private socket: SocketIOClient.Socket;
    public removeFile: BehaviorSubject<any> = new BehaviorSubject(undefined);
    private notification: Subject<string> = new Subject();
    fileerror = '';
    url: string = ''
    offset: number = 0
    defaultChunkSize: number = 64 * 1024
    // thumbnailFetchUrl = "https://south/generateThumbnail?width=100&height=100&smartCropp";

    private DateFormats: BehaviorSubject<any> = new BehaviorSubject({
        fullPickerInput: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' },
        datePickerInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
        timePickerInput: { hour: 'numeric', minute: 'numeric' },
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    });




    constructor(private http: Http, _authService: AuthService, _socketService: SocketService, private httpClient: HttpClient, ) {

        _authService.GetMediaServiceURI().subscribe(uri => {
            this.uploadingUrl = uri;
        });

        _authService.getAgent().subscribe(agent => {
            this.Agent = agent;
            // console.log(this.Agent);
        });

        _socketService.getSocket().subscribe(socket => {
            this.socket = socket;
        });
    }

    public ShowAttachmentError(error): Observable<any> {


        return new Observable(observer => {
            if (error.errors) {
                try {

                    let val: string | undefined;
                    if (error.errors && Object.keys(error.errors).length) {
                        Object.keys(error.errors).some((key) => {
                            if (error.errors[key]) {

                                val = key;
                                return (error.errors[key]);
                            }
                        });
                    }
                    else val = error.error
                    let valueText: string;
                    switch (val) {

                        case 'typeError':
                            valueText = "Invalid file type.";
                            break;

                        case 'sizeError':
                            valueText = "file size should be Less than 5MB";
                            break;

                        case 'nameError':
                            valueText = "Invalid file name.";
                            break;

                        case 'requestError':
                            valueText = "Invalid request";
                            break;

                        default:
                            valueText = val;
                            break;


                    }
                    observer.next(valueText);
                    observer.complete();
                }
                catch (error) {

                    observer.error({ error: error });
                }

            }
            else {
                console.log("error by media svc");
                observer.next("Error in uploading, Please Try again!");
                observer.complete();
            }
        });

    }


    public ShowAttachmentError2(error): Observable<any> {
        return new Observable(observer => {
            try {
                let val: string | undefined;
                if (error.errors && Object.keys(error.errors).length) {
                    Object.keys(error.errors).some((key) => {
                        if (error.errors[key]) {

                            val = key;
                            return (error.errors[key]);
                        }
                    });
                }
                else val = error.error
                let valueText: string;
                switch (val) {

                    case 'typeError':
                        valueText = "This file type not supported!";
                        break;

                    case 'sizeError':
                        valueText = "Your File Exceeds Maximum Size Limit";
                        break;

                    case 'nameError':
                        valueText = "Your file name is Invalid";
                        break;

                    case 'requestError':
                        valueText = "Error in uploading";
                        break;

                    default:
                        valueText = val;
                        break;
                }
                observer.next(valueText);
                observer.complete();
            }
            catch{
                observer.error('Error in uploading');
            }
        })

    }

    public getRemovedFile(): Observable<any> {

        return this.removeFile.asObservable();
    }


    public GenerateLinksForTickets(files: any, index, finalArray): Observable<any> {

        return new Observable(observer => {
            this.SignRequest(files[index], 'SendAttachMent').subscribe(response => {
                if (response) {
                    let params = JSON.parse(response.text());
                    params.file = files[index];

                    this.uploadAttachment(params).subscribe(s3response => {
                        if (s3response.status == '201') {
                            this.parseXML(s3response.text()).subscribe(json => {
                                finalArray.push({ filename: files[index].name, path: json.response.PostResponse.Location[0] })

                                if (files.length == (index + 1)) {
                                    observer.next(finalArray);
                                    observer.complete();
                                }
                                else {
                                    this.GenerateLinksForTickets(files, (index += 1), finalArray).subscribe(data => {
                                        if (data) observer.next(finalArray)
                                    });
                                }

                            }, err => {
                                this.uploading = false;
                            });
                        }
                        else {

                        }
                    }, err => {
                        this.uploading = false;
                    });
                } else {
                    observer.error('Error!')
                    observer.complete();
                }
            }, err => {
                this.uploading = false;
                files = [];
                finalArray = [];
                observer.error(err._body);
                observer.complete();
            });
        }
        )
    }

    public GenerateLinks(files: any, requestType: string): Observable<any[]> {
        try {
            this.fileLinks = []
            Array.from(files).map((file: any) => {
                this.fileLinks.push(this.GenerateLinksForFiles(file, requestType));
            });
            return forkJoin(this.fileLinks)
        }
        catch (err) {
            console.log("error in forkjoin", err);
        }
    }


    LazyUploadFilesWithProgress(params) {
        return this.UploadAttachmentWithProgress(params);
    }


    GenerateLinksForFilesNew(file, requestType): Observable<any> {
        return new Observable(observer => {
            if (file.name) {

                this.SignRequest(file, requestType).subscribe(response => {
                    if (response) {
                        let params = JSON.parse(response.text());
                        params.file = file;
                        observer.next({ params: params });
                        observer.complete();
                    }
                }, err => {
                    // console.log("error in Sign Request", err);
                    if (typeof (err._body) == 'object') {
                        observer.next({ name: file.name, error: err._body });
                        observer.complete();
                    }
                    else {
                        // observer.next({ name: file.name, error: (err._body) });
                        observer.next({ name: file.name, error: err });
                        observer.complete();
                    }
                });
            }
        });
    }

    GenerateLinksForFiles(file, requestType): Observable<any> {
        return new Observable(observer => {
            if (file.name) {

                this.SignRequest(file, requestType).subscribe(response => {
                    if (response) {
                        let params = JSON.parse(response.text());
                        params.file = file;
                        this.uploadAttachment(params).subscribe(s3response => {
                            if (s3response.status == '201') {
                                this.parseXML(s3response.text()).subscribe(json => {

                                    observer.next({ filename: file.name, path: json.response.PostResponse.Location[0] });
                                    observer.complete();
                                }, err => {
                                    // console.log("error in parseXML", err);
                                    observer.next({ name: file.name, error: err._body });
                                    observer.complete();
                                });
                            }
                        }, err => {
                            // console.log("error in Upload Attachment Request", err);
                        });
                    }
                }, err => {
                    // console.log("error in Sign Request", err);
                    if (typeof (err._body) == 'object') {
                        observer.next({ name: file.name, error: err._body });
                        observer.complete();
                    }
                    else {
                        // observer.next({ name: file.name, error: (err._body) });
                        observer.next({ name: file.name, error: JSON.parse(err._body) });
                        observer.complete();
                    }
                });
            }
        });
    }
    GenerateLinksForFilesPromise(file, requestType): Promise<any> {
        return new Promise((resolve, reject) => {
            if (file.name) {

                this.SignRequest(file, requestType).subscribe(response => {
                    if (response) {
                        let params = JSON.parse(response.text());
                        params.file = file;
                        this.uploadAttachment(params).subscribe(s3response => {
                            if (s3response.status == '201') {
                                this.parseXML(s3response.text()).subscribe(json => {

                                    resolve({ filename: file.name, path: json.response.PostResponse.Location[0] });
                                }, err => {
                                    //console.log("error in parseXML", err);
                                });
                            }
                        }, err => {
                            //console.log("error in Upload Attachment Request", err);
                        });
                    }
                }, err => {
                    //console.log("error in Sign Request", err);
                    if (typeof (err._body) == 'object') {
                        resolve({ name: file.name, error: err._body });
                    }
                    else {
                        // observer.next({ name: file.name, error: (err._body) });
                        resolve({ name: file.name, error: JSON.parse(err._body) });
                    }
                });
            }
        });
    }

    public SignRequest(file: any, requestType: string, options?: any): Observable<any> {
        // console.log('Sign Request', file, requestType, options );

        if (file.name) {
            let urlSearchParams = new URLSearchParams('', new QueryEncoder());
            urlSearchParams.append('size', file.size.toString());
            urlSearchParams.append('type', file.type)
            urlSearchParams.append('name', encodeURIComponent(file.name));
            urlSearchParams.append('nsp', this.Agent.nsp);
            urlSearchParams.append('email', this.Agent.email);
            if (options && options.params) {
                Object.keys(options.params).map(key => {
                    urlSearchParams.append(key, options.params[key]);
                });
            }
            switch (requestType) {
                case 'SendAttachMent':
                    return this.http.post(this.uploadingUrl + '/upload/uploadCredintials/', urlSearchParams)
                case 'UploadProfilePicture':
                    return this.http.post(this.uploadingUrl + '/upload/uploadProfilePicture/', urlSearchParams)
                case 'knowledgebase':
                    return this.http.post(this.uploadingUrl + '/upload/knowledgebase/', urlSearchParams)
                case 'uploadBackgroundImage':
                    return this.http.post(this.uploadingUrl + '/upload/uploadBackgroundImage/', urlSearchParams)

            }
        }

    }
    CreateBlobUrl(file): Observable<any> {
        return new Observable((observer) => {
            var blob = new Blob([file.buffer], { type: 'application/octet-stream' }); // pass a useful mime type here
            // var url = URL.createObjectURL(blob);
            // console.log("blob", blob);
            observer.next({ blob: blob, file: file });
            observer.complete();
        });
    }

    public UploadAttachmentWithProgress(params): Observable<any> {
        //File Extension in capital Letter FIX.
        let temp = params['file'].name.substr(params['file'].name.lastIndexOf('.') + 1);
        // console.log(temp);

        let normalizedFileName = params['file'].name.replace(new RegExp(temp, 'gi'), temp.toLowerCase());
        // console.log(normalizedFileName);


        let blob = params['file'].slice(0, params['file'].size, params['file'].type);
        // console.log(blob);

        params['file'] = new File([blob], normalizedFileName, { type: params['file'].type, lastModified: params['file'].lastModified });
        // console.log(params['file']);

        let url = params.upload_url;
        // console.log(url);

        let formData = new FormData();
        formData.append('key', params['key']);
        formData.append('acl', params['acl']);
        formData.append('success_action_status', params['success_action_status']);
        formData.append('Content-Type', params['file'].type);
        formData.append('cache-control', 'public, max-age=31536000');
        formData.append('content-disposition', ((this.isImage(params['file'].name)) ? 'inline; ' : 'attachment; ') + 'filename="' + params['uName'] + '"');
        formData.append('policy', params['policy']);
        formData.append('x-amz-algorithm', params['x-amz-algorithm']);
        formData.append('X-Amz-Credential', params['x-amz-credential']);
        formData.append('x-amz-date', params['x-amz-date']);
        formData.append('x-amz-signature', params['x-amz-signature']);
        formData.append('file', params['file']);

        delete params.upload_url;
        delete params['uName'];

        let body = {
            key: params['key'],
            acl: params['acl'],
            success_action_status: params['success_action_status'],
            'Content-Type': params['file'].type,
            'cache-control': 'public, max-age=31536000',
            'content-disposition': ((this.isImage(params['file'].name)) ? 'inline; ' : 'attachment; ') + 'filename="' + params['uName'] + '"',
            policy: params['policy'],
            'x-amz-algorithm': params['x-amz-algorithm'],
            'X-Amz-Credential': params['x-amz-credential'],
            'x-amz-date': params['x-amz-date'],
            'x-amz-signature': params['x-amz-signature'],
            'file': params['file']
        }

        return this.httpClient.request('POST', url, { body: formData, observe: "events", reportProgress: true, withCredentials: true, responseType: 'text' });
    }

    public uploadAttachment(params): Observable<any> {
        //File Extension in capital Letter FIX.
        let temp = params['file'].name.substr(params['file'].name.lastIndexOf('.') + 1);
        // console.log(temp);

        let normalizedFileName = params['file'].name.replace(new RegExp(temp, 'gi'), temp.toLowerCase());
        // console.log(normalizedFileName);


        let blob = params['file'].slice(0, params['file'].size, params['file'].type);
        // console.log(blob);

        params['file'] = new File([blob], normalizedFileName, { type: params['file'].type, lastModified: params['file'].lastModified });
        // console.log(params['file']);

        let url = params.upload_url;
        // console.log(url);

        let formData = new FormData();
        formData.append('key', params['key']);
        formData.append('acl', params['acl']);
        formData.append('success_action_status', params['success_action_status']);
        formData.append('Content-Type', params['file'].type);
        formData.append('cache-control', 'public, max-age=31536000');
        formData.append('content-disposition', ((this.isImage(params['file'].name)) ? 'inline; ' : 'attachment; ') + 'filename="' + params['uName'] + '"');
        formData.append('policy', params['policy']);
        formData.append('x-amz-algorithm', params['x-amz-algorithm']);
        formData.append('X-Amz-Credential', params['x-amz-credential']);
        formData.append('x-amz-date', params['x-amz-date']);
        formData.append('x-amz-signature', params['x-amz-signature']);
        formData.append('file', params['file']);

        delete params.upload_url;
        delete params['uName'];
        return this.http.post(url, formData);
    }

    public isImage(filename: string) {
        switch (filename.split('.').pop()) {
            case 'png':
            case 'jpg':
            case 'jpeg':
                //console.log(filename.split('.').pop());
                return true;

            default:
                return false;
        }
    }

    public parseXML(xml: string): Observable<any> {
        //console.log(xml);
        return Observable.create((observer) => {
            parseString(xml, (err, success) => {
                if (err) {
                    observer.error({ response: err });
                    observer.complete();
                } else {
                    observer.next({ response: success });
                    observer.complete();
                }
            })
        });
    }

    public GetDateFormats(): Observable<any> {
        return this.DateFormats.asObservable();
    }


    public ChangeProfileImage(email: string, url: string) {
        this.socket.emit('changeProfileImage', {
            email: email,
            url: url
        }, (response) => {
            if (response.status == 'ok') {
                this.notification.next('Profile Image Changed Successfully');
            } else {
                this.notification.next('Unable to Update Profile Image');
            }
        });
    }

    public getSeekableBlob(blob, callback) {
        var reader = new ebml.Reader();
        var decoder = new ebml.Decoder();
        var tools = ebml.tools;

        var fileReader = new FileReader();
        fileReader.onload = (e: any) => {
            var ebmlElms = decoder.decode(e.target.result);
            ebmlElms.forEach((element) => {
                reader.read(element);
            });
            reader.stop();
            // console.log(reader);
            var refinedMetadataBuf = tools.makeMetadataSeekable(reader.metadatas, reader.duration, reader.cues);
            var body = e.target.result.slice(reader.metadataSize);
            var newBlob = new Blob([refinedMetadataBuf, body], {
                type: 'audio/webm'
            });

            callback(newBlob);
        };
        fileReader.readAsArrayBuffer(blob);
    }

    ParseFile(file: File): Observable<any> {
        return new Observable(observer => {

            this.ChunkReaderBlock(this.offset, this.defaultChunkSize, file).subscribe(data => {
                if (data) {

                    let obj = { url: this.url, name: file.name };
                    observer.next(obj)
                    observer.complete()
                    this.url = ''
                }
            });

        })
    }

    ChunkReaderBlock(_offset, length, file: File): Observable<any> {
        return new Observable(observer => {
            let r = new FileReader();
            let blob = file.slice(_offset, length + _offset);
            let done = false
            r.addEventListener('load', event => {
                this.ReadEventHandler(event, file, length).subscribe(data => {
                    if (data) {
                        done = true
                        // console.log('if ReadEventHandler');
                        observer.next(true)
                        observer.complete()
                    }
                });

            })

            //r.readAsText(blob);
            r.readAsDataURL(file);
        })
    }


    ReadEventHandler(evt: any, file, chunkSize): Observable<any> {
        return new Observable(observer => {

            if (evt.target.error == null) {
                this.offset += evt.target.result.length;
                this.url += evt.target.result
                // callback for handling read chunk
            } else {
                //console.log("Read error: " + evt.target.error);
                return;
            }
            if (this.offset >= file.size) {
                observer.next(true);
                observer.complete()
                return;
            }

            this.ChunkReaderBlock(this.offset, chunkSize, file).subscribe(data => {
                if (data) {
                    observer.next(true)
                    observer.complete()
                }
            });
        })
    }


    public readURL(files: any): Observable<any[]> {
        try {
            this.fileUrls = []
            Array.from(files).map((file: any) => {
                this.offset = 0
                this.fileUrls.push(this.ParseFile(file));
            });
            return forkJoin(this.fileUrls)
        }
        catch (err) {
            console.log("error in forkjoin", err);
        }
    }
}