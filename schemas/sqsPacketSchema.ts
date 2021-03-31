export interface SQSPacket {

    action: string;
    [key: string]: Object | any;
}