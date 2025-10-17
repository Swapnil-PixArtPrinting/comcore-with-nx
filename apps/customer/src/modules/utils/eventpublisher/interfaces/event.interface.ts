export interface IEvent {
  id: string;
  streamId: string;
  eventChainIds: Array<any>;
  customerGroup?: string;
  tenantId: string;
  eventType: string;
  issuedAt: string;
  caller: string;
  type: string;
  source: string;
  nature: string;
  version: string;
  emittedAt: IEmittedAt;
  payload: IPayload;
}

export interface IEmittedAt {
  timestamp: string;
  readable: string;
}

export interface IPayload {
  resource: JSON;
  metadata: JSON;
}

export interface IMessageAttribute {
  [key: string]: IMessageAttributeConfig;
}

export interface IMessageAttributeConfig {
  DataType: string;
  StringValue: string;
}
