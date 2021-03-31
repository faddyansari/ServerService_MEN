const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = "secret secret secret secret haaa"
const iv = "bbbbbbbbbbbbbbbb"


// SECRET="secret secret secret secret haaa"
// IV="bbbbbbbbbbbbbbbb"
export class Encryption {

    constructor() {
        console.log("Encryption initialized");

    }




    public async decrypt(text): Promise<any> {

        return new Promise((res, rej) => {



            //let ivText = Buffer.from(iv, 'hex');
            let encryptedText = Buffer.from(text, 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            res(decrypted.toString());




        })
    }

}

export const Sleep = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}
