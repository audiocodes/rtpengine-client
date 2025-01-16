import { EventEmitter } from 'events';
import { Socket as UdpSocket } from 'dgram';
import { Socket as TcpSocket } from 'net';
import { WebSocket } from 'ws';

interface BaseClientOptions {
  timeout?: number;
}

export interface ClientOptions extends BaseClientOptions {
  type?: 'udp';
  localAddress?: string;
  localPort?: number;
  rejectOnError?: boolean;
}

export interface WsClientOptions extends BaseClientOptions {
  type?: 'websocket';
  url: string;
}

export interface TcpClientOptions extends BaseClientOptions {
  type?: 'tcp';
  hostport: string;
}

export interface InternalMessage {
  id: string;
  data: {
    command: string;
  };
}

declare class CommandHandler extends EventEmitter {
  answer(opts?: Record<string, unknown>): Promise<any>;
  delete(opts?: Record<string, unknown>): Promise<any>;
  list(opts?: Record<string, unknown>): Promise<any>;
  offer(opts?: Record<string, unknown>): Promise<any>;
  ping(opts?: Record<string, unknown>): Promise<any>;
  query(opts?: Record<string, unknown>): Promise<any>;
  startRecording(opts?: Record<string, unknown>): Promise<any>;
  stopRecording(opts?: Record<string, unknown>): Promise<any>;
  blockDTMF(opts?: Record<string, unknown>): Promise<any>;
  unblockDTMF(opts?: Record<string, unknown>): Promise<any>;
  playDTMF(opts?: Record<string, unknown>): Promise<any>;
  blockMedia(opts?: Record<string, unknown>): Promise<any>;
  unblockMedia(opts?: Record<string, unknown>): Promise<any>;
  silenceMedia(opts?: Record<string, unknown>): Promise<any>;
  unsilenceMedia(opts?: Record<string, unknown>): Promise<any>;
  startForwarding(opts?: Record<string, unknown>): Promise<any>;
  stopForwarding(opts?: Record<string, unknown>): Promise<any>;
  playMedia(opts?: Record<string, unknown>): Promise<any>;
  stopMedia(opts?: Record<string, unknown>): Promise<any>;
  statistics(opts?: Record<string, unknown>): Promise<any>;
  publish(opts?: Record<string, unknown>): Promise<any>;
  subscribeRequest(opts?: Record<string, unknown>): Promise<any>;
  subscribeAnswer(opts?: Record<string, unknown>): Promise<any>;
  unsubscribe(opts?: Record<string, unknown>): Promise<any>;
}

declare class BaseClient extends CommandHandler {
  messages: Map<string, (err?: any) => void>;

  constructor(options: BaseClientOptions);
  get connectionBased(): boolean;
  close(): void;
  static decodeMessage(message: string): InternalMessage;
  static encodeMessage(id: string, data: any): string;
}

export class Client extends BaseClient {
  constructor(options: ClientOptions);
  constructor(port?: number, host?: string);
  declare socket: UdpSocket;
}

export class WsClient extends BaseClient {
  constructor(options: WsClientOptions);
  constructor(url: string);
  declare socket: WebSocket;
}

export class TcpClient extends BaseClient {
  constructor(options: TcpClientOptions);
  constructor(hostport: string);
  declare socket: TcpSocket;
}

export class RtpEngineError extends Error {
  constructor(message: string);
}
