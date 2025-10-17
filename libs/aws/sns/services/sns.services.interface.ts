export const SNS_SERVICE = "SNS_SERVICE";

export interface ISnsServiceInterface {
    publish(messageData: string, messageSubject: string, messageAttributes: any);
}