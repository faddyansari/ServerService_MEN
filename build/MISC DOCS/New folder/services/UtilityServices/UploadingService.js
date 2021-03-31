"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadingService = void 0;
// Angular Imports
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
//Xml2JS
var xml2js_1 = require("xml2js");
var Subject_1 = require("rxjs/Subject");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var ebml = require("ts-ebml");
var forkJoin_1 = require("rxjs/observable/forkJoin");
var UploadingService = /** @class */ (function () {
    function UploadingService(http, _authService, _socketService, httpClient) {
        var _this = this;
        this.http = http;
        this.httpClient = httpClient;
        this.final = [];
        this.fileLinks = [];
        this.fileUrls = [];
        this.uploading = false;
        this.fileValid = false;
        this.linkss = [];
        this.responses = [];
        this.uploadingUrl = '';
        this.removeFile = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.notification = new Subject_1.Subject();
        this.fileerror = '';
        this.url = '';
        this.offset = 0;
        this.defaultChunkSize = 64 * 1024;
        // thumbnailFetchUrl = "https://south/generateThumbnail?width=100&height=100&smartCropp";
        this.DateFormats = new BehaviorSubject_1.BehaviorSubject({
            fullPickerInput: { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' },
            datePickerInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
            timePickerInput: { hour: 'numeric', minute: 'numeric' },
            monthYearLabel: { year: 'numeric', month: 'short' },
            dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
            monthYearA11yLabel: { year: 'numeric', month: 'long' },
        });
        _authService.GetMediaServiceURI().subscribe(function (uri) {
            _this.uploadingUrl = uri;
        });
        _authService.getAgent().subscribe(function (agent) {
            _this.Agent = agent;
            // console.log(this.Agent);
        });
        _socketService.getSocket().subscribe(function (socket) {
            _this.socket = socket;
        });
    }
    UploadingService.prototype.ShowAttachmentError = function (error) {
        return new Observable_1.Observable(function (observer) {
            if (error.errors) {
                try {
                    var val_1;
                    if (error.errors && Object.keys(error.errors).length) {
                        Object.keys(error.errors).some(function (key) {
                            if (error.errors[key]) {
                                val_1 = key;
                                return (error.errors[key]);
                            }
                        });
                    }
                    else
                        val_1 = error.error;
                    var valueText = void 0;
                    switch (val_1) {
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
                            valueText = val_1;
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
    };
    UploadingService.prototype.ShowAttachmentError2 = function (error) {
        return new Observable_1.Observable(function (observer) {
            try {
                var val_2;
                if (error.errors && Object.keys(error.errors).length) {
                    Object.keys(error.errors).some(function (key) {
                        if (error.errors[key]) {
                            val_2 = key;
                            return (error.errors[key]);
                        }
                    });
                }
                else
                    val_2 = error.error;
                var valueText = void 0;
                switch (val_2) {
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
                        valueText = val_2;
                        break;
                }
                observer.next(valueText);
                observer.complete();
            }
            catch (_a) {
                observer.error('Error in uploading');
            }
        });
    };
    UploadingService.prototype.getRemovedFile = function () {
        return this.removeFile.asObservable();
    };
    UploadingService.prototype.GenerateLinksForTickets = function (files, index, finalArray) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.SignRequest(files[index], 'SendAttachMent').subscribe(function (response) {
                if (response) {
                    var params = JSON.parse(response.text());
                    params.file = files[index];
                    _this.uploadAttachment(params).subscribe(function (s3response) {
                        if (s3response.status == '201') {
                            _this.parseXML(s3response.text()).subscribe(function (json) {
                                finalArray.push({ filename: files[index].name, path: json.response.PostResponse.Location[0] });
                                if (files.length == (index + 1)) {
                                    observer.next(finalArray);
                                    observer.complete();
                                }
                                else {
                                    _this.GenerateLinksForTickets(files, (index += 1), finalArray).subscribe(function (data) {
                                        if (data)
                                            observer.next(finalArray);
                                    });
                                }
                            }, function (err) {
                                _this.uploading = false;
                            });
                        }
                        else {
                        }
                    }, function (err) {
                        _this.uploading = false;
                    });
                }
                else {
                    observer.error('Error!');
                    observer.complete();
                }
            }, function (err) {
                _this.uploading = false;
                files = [];
                finalArray = [];
                observer.error(err._body);
                observer.complete();
            });
        });
    };
    UploadingService.prototype.GenerateLinks = function (files, requestType) {
        var _this = this;
        try {
            this.fileLinks = [];
            Array.from(files).map(function (file) {
                _this.fileLinks.push(_this.GenerateLinksForFiles(file, requestType));
            });
            return forkJoin_1.forkJoin(this.fileLinks);
        }
        catch (err) {
            console.log("error in forkjoin", err);
        }
    };
    UploadingService.prototype.LazyUploadFilesWithProgress = function (params) {
        return this.UploadAttachmentWithProgress(params);
    };
    UploadingService.prototype.GenerateLinksForFilesNew = function (file, requestType) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (file.name) {
                _this.SignRequest(file, requestType).subscribe(function (response) {
                    if (response) {
                        var params = JSON.parse(response.text());
                        params.file = file;
                        observer.next({ params: params });
                        observer.complete();
                    }
                }, function (err) {
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
    };
    UploadingService.prototype.GenerateLinksForFiles = function (file, requestType) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (file.name) {
                _this.SignRequest(file, requestType).subscribe(function (response) {
                    if (response) {
                        var params = JSON.parse(response.text());
                        params.file = file;
                        _this.uploadAttachment(params).subscribe(function (s3response) {
                            if (s3response.status == '201') {
                                _this.parseXML(s3response.text()).subscribe(function (json) {
                                    observer.next({ filename: file.name, path: json.response.PostResponse.Location[0] });
                                    observer.complete();
                                }, function (err) {
                                    // console.log("error in parseXML", err);
                                    observer.next({ name: file.name, error: err._body });
                                    observer.complete();
                                });
                            }
                        }, function (err) {
                            // console.log("error in Upload Attachment Request", err);
                        });
                    }
                }, function (err) {
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
    };
    UploadingService.prototype.GenerateLinksForFilesPromise = function (file, requestType) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (file.name) {
                _this.SignRequest(file, requestType).subscribe(function (response) {
                    if (response) {
                        var params = JSON.parse(response.text());
                        params.file = file;
                        _this.uploadAttachment(params).subscribe(function (s3response) {
                            if (s3response.status == '201') {
                                _this.parseXML(s3response.text()).subscribe(function (json) {
                                    resolve({ filename: file.name, path: json.response.PostResponse.Location[0] });
                                }, function (err) {
                                    //console.log("error in parseXML", err);
                                });
                            }
                        }, function (err) {
                            //console.log("error in Upload Attachment Request", err);
                        });
                    }
                }, function (err) {
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
    };
    UploadingService.prototype.SignRequest = function (file, requestType, options) {
        // console.log('Sign Request', file, requestType, options );
        if (file.name) {
            var urlSearchParams_1 = new http_1.URLSearchParams('', new http_1.QueryEncoder());
            urlSearchParams_1.append('size', file.size.toString());
            urlSearchParams_1.append('type', file.type);
            urlSearchParams_1.append('name', encodeURIComponent(file.name));
            urlSearchParams_1.append('nsp', this.Agent.nsp);
            urlSearchParams_1.append('email', this.Agent.email);
            if (options && options.params) {
                Object.keys(options.params).map(function (key) {
                    urlSearchParams_1.append(key, options.params[key]);
                });
            }
            switch (requestType) {
                case 'SendAttachMent':
                    return this.http.post(this.uploadingUrl + '/upload/uploadCredintials/', urlSearchParams_1);
                case 'UploadProfilePicture':
                    return this.http.post(this.uploadingUrl + '/upload/uploadProfilePicture/', urlSearchParams_1);
                case 'knowledgebase':
                    return this.http.post(this.uploadingUrl + '/upload/knowledgebase/', urlSearchParams_1);
                case 'uploadBackgroundImage':
                    return this.http.post(this.uploadingUrl + '/upload/uploadBackgroundImage/', urlSearchParams_1);
            }
        }
    };
    UploadingService.prototype.CreateBlobUrl = function (file) {
        return new Observable_1.Observable(function (observer) {
            var blob = new Blob([file.buffer], { type: 'application/octet-stream' }); // pass a useful mime type here
            // var url = URL.createObjectURL(blob);
            // console.log("blob", blob);
            observer.next({ blob: blob, file: file });
            observer.complete();
        });
    };
    UploadingService.prototype.UploadAttachmentWithProgress = function (params) {
        //File Extension in capital Letter FIX.
        var temp = params['file'].name.substr(params['file'].name.lastIndexOf('.') + 1);
        // console.log(temp);
        var normalizedFileName = params['file'].name.replace(new RegExp(temp, 'gi'), temp.toLowerCase());
        // console.log(normalizedFileName);
        var blob = params['file'].slice(0, params['file'].size, params['file'].type);
        // console.log(blob);
        params['file'] = new File([blob], normalizedFileName, { type: params['file'].type, lastModified: params['file'].lastModified });
        // console.log(params['file']);
        var url = params.upload_url;
        // console.log(url);
        var formData = new FormData();
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
        var body = {
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
        };
        return this.httpClient.request('POST', url, { body: formData, observe: "events", reportProgress: true, withCredentials: true, responseType: 'text' });
    };
    UploadingService.prototype.uploadAttachment = function (params) {
        //File Extension in capital Letter FIX.
        var temp = params['file'].name.substr(params['file'].name.lastIndexOf('.') + 1);
        // console.log(temp);
        var normalizedFileName = params['file'].name.replace(new RegExp(temp, 'gi'), temp.toLowerCase());
        // console.log(normalizedFileName);
        var blob = params['file'].slice(0, params['file'].size, params['file'].type);
        // console.log(blob);
        params['file'] = new File([blob], normalizedFileName, { type: params['file'].type, lastModified: params['file'].lastModified });
        // console.log(params['file']);
        var url = params.upload_url;
        // console.log(url);
        var formData = new FormData();
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
    };
    UploadingService.prototype.isImage = function (filename) {
        switch (filename.split('.').pop()) {
            case 'png':
            case 'jpg':
            case 'jpeg':
                //console.log(filename.split('.').pop());
                return true;
            default:
                return false;
        }
    };
    UploadingService.prototype.parseXML = function (xml) {
        //console.log(xml);
        return Observable_1.Observable.create(function (observer) {
            xml2js_1.parseString(xml, function (err, success) {
                if (err) {
                    observer.error({ response: err });
                    observer.complete();
                }
                else {
                    observer.next({ response: success });
                    observer.complete();
                }
            });
        });
    };
    UploadingService.prototype.GetDateFormats = function () {
        return this.DateFormats.asObservable();
    };
    UploadingService.prototype.ChangeProfileImage = function (email, url) {
        var _this = this;
        this.socket.emit('changeProfileImage', {
            email: email,
            url: url
        }, function (response) {
            if (response.status == 'ok') {
                _this.notification.next('Profile Image Changed Successfully');
            }
            else {
                _this.notification.next('Unable to Update Profile Image');
            }
        });
    };
    UploadingService.prototype.getSeekableBlob = function (blob, callback) {
        var reader = new ebml.Reader();
        var decoder = new ebml.Decoder();
        var tools = ebml.tools;
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            var ebmlElms = decoder.decode(e.target.result);
            ebmlElms.forEach(function (element) {
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
    };
    UploadingService.prototype.ParseFile = function (file) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.ChunkReaderBlock(_this.offset, _this.defaultChunkSize, file).subscribe(function (data) {
                if (data) {
                    var obj = { url: _this.url, name: file.name };
                    observer.next(obj);
                    observer.complete();
                    _this.url = '';
                }
            });
        });
    };
    UploadingService.prototype.ChunkReaderBlock = function (_offset, length, file) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var r = new FileReader();
            var blob = file.slice(_offset, length + _offset);
            var done = false;
            r.addEventListener('load', function (event) {
                _this.ReadEventHandler(event, file, length).subscribe(function (data) {
                    if (data) {
                        done = true;
                        // console.log('if ReadEventHandler');
                        observer.next(true);
                        observer.complete();
                    }
                });
            });
            //r.readAsText(blob);
            r.readAsDataURL(file);
        });
    };
    UploadingService.prototype.ReadEventHandler = function (evt, file, chunkSize) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            if (evt.target.error == null) {
                _this.offset += evt.target.result.length;
                _this.url += evt.target.result;
                // callback for handling read chunk
            }
            else {
                //console.log("Read error: " + evt.target.error);
                return;
            }
            if (_this.offset >= file.size) {
                observer.next(true);
                observer.complete();
                return;
            }
            _this.ChunkReaderBlock(_this.offset, chunkSize, file).subscribe(function (data) {
                if (data) {
                    observer.next(true);
                    observer.complete();
                }
            });
        });
    };
    UploadingService.prototype.readURL = function (files) {
        var _this = this;
        try {
            this.fileUrls = [];
            Array.from(files).map(function (file) {
                _this.offset = 0;
                _this.fileUrls.push(_this.ParseFile(file));
            });
            return forkJoin_1.forkJoin(this.fileUrls);
        }
        catch (err) {
            console.log("error in forkjoin", err);
        }
    };
    UploadingService = __decorate([
        core_1.Injectable()
    ], UploadingService);
    return UploadingService;
}());
exports.UploadingService = UploadingService;
//# sourceMappingURL=UploadingService.js.map