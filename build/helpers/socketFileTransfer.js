"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketFileTransfer = void 0;
var SocketFileTransfer = /** @class */ (function () {
    function SocketFileTransfer() {
    }
    // Returns a file buffer from the communication done
    SocketFileTransfer.recieveFile = function (socket, origin, filePiece) {
        if (!this.fileToRecieve[filePiece.name]) {
            this.fileToRecieve[filePiece.name] = {
                size: filePiece.size,
                type: filePiece.type,
                slice: 0,
                data: []
            };
        }
        filePiece.data = new Buffer(new Uint8Array(filePiece.data));
        this.fileToRecieve[filePiece.name].data.push(filePiece.data);
        this.fileToRecieve[filePiece.name].slice++;
        if (this.fileToRecieve[filePiece.name].slice * this.filePieceSize >= this.fileToRecieve[filePiece.name].size) {
            // do something with the data 
            var fileBuffer = Buffer.concat(this.fileToRecieve[filePiece.name].data);
            delete this.fileToRecieve[filePiece.name];
            return fileBuffer;
        }
        else {
            origin.emit(filePiece.uploadFileSliceToServer, this.fileToRecieve[filePiece.name].slice);
        }
    };
    SocketFileTransfer.sendFile = function (socket, origin, fileToSend, repeatSendEvent, finalSendEvent) {
        for (var arrayLen = fileToSend.length, i = 0; this.arrayPiece * i < arrayLen; i++) {
            var beginIndex = this.arrayPiece * i;
            var endIndex = this.arrayPiece * i + (this.arrayPiece - 1);
            // send last piece
            if (beginIndex <= (arrayLen - 1) && (endIndex >= (arrayLen - 1))) {
                origin.emit(finalSendEvent, fileToSend.slice(beginIndex));
                // console.log("slice sent")
                // console.log(fileToSend.slice(beginIndex))
                return true;
            }
            // send intermediate piece
            else {
                origin.emit(repeatSendEvent, fileToSend.slice(beginIndex, endIndex + 1));
                // console.log("slice sent")
                // console.log(fileToSend.slice(beginIndex, endIndex + 1))
            }
        }
    };
    SocketFileTransfer.fileToRecieve = {};
    SocketFileTransfer.filePieceSize = 100000;
    SocketFileTransfer.arrayPiece = 10;
    return SocketFileTransfer;
}());
exports.SocketFileTransfer = SocketFileTransfer;
//# sourceMappingURL=socketFileTransfer.js.map