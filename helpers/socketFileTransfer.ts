import { timingSafeEqual } from "crypto";

export class SocketFileTransfer {
    private static fileToRecieve = {};
    private static filePieceSize = 100000;

    private static arrayPiece = 10;

    // Returns a file buffer from the communication done
    public static recieveFile(socket, origin, filePiece) {
        if(!this.fileToRecieve[filePiece.name]) {
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

        if (this.fileToRecieve[filePiece.name].slice * this.filePieceSize >=  this.fileToRecieve[filePiece.name].size) { 
            // do something with the data 
            let fileBuffer = Buffer.concat(this.fileToRecieve[filePiece.name].data);
            delete this.fileToRecieve[filePiece.name];

            return fileBuffer;
        } 
        else {
            origin.emit(filePiece.uploadFileSliceToServer, this.fileToRecieve[filePiece.name].slice); 
        }
    }

    public static sendFile(socket, origin, fileToSend, repeatSendEvent, finalSendEvent) {
        for(let arrayLen = fileToSend.length, i = 0; this.arrayPiece * i < arrayLen; i++) {
            let beginIndex = this.arrayPiece * i;
            let endIndex = this.arrayPiece * i + (this.arrayPiece - 1);
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
    }
}