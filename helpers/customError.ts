export class CustomError {
    constructor(name: string, id: number, message: string) {
        let e = new Error(message);
        e['id'] = id;
        e['name'] = name;
        
        return e;
    }    
}