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

export interface HostAndPort {
  host: string;
  port: number;
}

// Basic common types that are reused across messages
type NgBoolean = 'yes' | 'no' | 'on' | 'off';
type StringList = string | string[];

type MediaFlags = 'initialized' |
  'asymmetric' |
  'send' |
  'recv' |
  'rtcp-mux' |
  'DTLS-SRTP' |
  'DTLS role active' |
  'DTLS role passive' |
  'SDES' |
  'passthrough' |
  'ICE' |
  'trickle ICE' |
  'ICE controlling' |
  'ICE-lite peer' |
  'ICE-lite self' |
  'unidirectional' |
  'loop check' |
  'generator/sink' |
  'ptime-override' |
  'RTCP feedback' |
  'RTCP generator' |
  'echo' |
  'blackhole' |
  'SDES reordered' |
  'audio player' |
  'legacy OSRTP' |
  'reverse legacy OSRTP' |
  'transcoding' |
  'block egress';

interface PingResult {
  result: 'pong'
}

interface BaseArgs {
  flags?: StringList;
}

export interface OfferArgs extends BaseArgs {
  sdp: string;
  'call-id': string;
  'from-tag': string;
  all?: 'none' | 'all' | 'offer-answer' | 'except-offer-answer' | 'flows';
  'address family'?: 'IP4' | 'IP6';
  'audio player'?: 'default' | 'transcoding' | 'off' | 'always';
  'delay-buffer'?: number;
  'direction'?: StringList;
  digit?: 'string';
  'drop-traffic'?: 'start' | 'stop';
  DTLS?: 'off' | 'no' | 'disable' | 'passive' | 'active';
  'DTLS-reverse'?: 'passive' | 'active';
  'DTLS-fingerprint'?: 'SHA-1' | 'SHA-224' | 'SHA-256' | 'SHA-384' | 'SHA-512';
  'DTMF-security'?: 'drop' | 'silence' | 'tone' | 'random' | 'zero' | 'off';
  'DTMF-security-trigger'?: string;
  'DTMF-security-trigger-end'?: string;
  'DTMF-delay'?: number;
  'DTMF-log-dest'?: string;
  'endpoint-learning'?: 'off' | 'immediate' | 'delayed' | 'heuristic';
  'from-interface'?: string;
  'frequencies'?: number | number[];
  'frequency'?: number | number[];
  'from-tags'?: StringList;
  'generate RTCP'?: 'on' | 'off';
  'ICE'?: 'remove' | 'force' | 'default' | 'force-relay' | 'optional';
  'ICE-lite'?: 'forward' | 'backward' | 'both' | 'off';
  'interface'?: string;
  'label'?: string;
  'from-label'?: string;
  'media address'?: string;
  'media echo'?: 'blackhole' | 'sinkhole' | 'forward' | 'backwards' | 'both';
  'media-echo'?: 'blackhole' | 'sinkhole' | 'forward' | 'backwards' | 'both';
  'metadata'?: string;
  'OSRTP'?: 'offer' | 'offer-RFC' | 'offer-legacy' | 'accept-RFC' | 'accept-legacy' | 'accept';
  'output-destination'?: string;
  'ptime'?: number;
  'ptime-reverse'?: number;
  'received from'?: ['IP4' | 'IP6', string];
  'record call'?: 'yes' | 'no' | 'on' | 'off';
  'rtcp-mux'?: ('offer' | 'require' | 'demux' | 'accept' | 'reject')[];
  'SIP message type'?: 'SIP request' | 'SIP response';
  'SIP code'?: number;
  'template'?: string;
  'via-branch'?: string;
  'set-label'?: string;
  'SDES'?: StringList;
  'supports'?: StringList;
  'to-interface'?: string;
  'to-label'?: string;
  'TOS'?: number;
  'transport protocol'?: 'RTP/AVP' | 'RTP/AVPF' | 'RTP/SAVP' | 'RTP/SAVPF' | 'accept';
  'trigger'?: string;
  'trigger-end'?: string;
  'end trigger'?: string;
  'trigger-end-time'?: number;
  'trigger-end-digits'?: number;
  'T.38'?: ('decode' | 'force' | 'stop' | 'no-ECM' | 'no-V.17' | 'no-V.27ter' | 'no-V.29' | 'no-V.34' | 'no-IAF' | 'FEC')[];
  volume?: number;
  'xmlrpc-callback'?: string;
  replace?: ('force-increment-sdp-ver' | 'origin' | 'origin-full' | 'session-name' | 'SDP-version' | 'username' | 'zero-address')[];
  codec?: Record<string, unknown>;
  'sdp-attr'?: Record<string, unknown>;
  'sdp-media-remove'?: StringList;
}

// Answer specific parameters
export interface AnswerArgs extends Omit<OfferArgs, 'direction'> {
  'to-tag'?: string;
}

interface BaseResponse {
  result: 'ok' | 'error' | 'load limit';
}

export interface OfferResponse extends BaseResponse {
  sdp: string;
  recordings?: string[];
}

// Delete parameters (as you provided)
export interface DeleteArgs extends BaseArgs {
  'call-id': string;
  'from-tag': string;
  'to-tag'?: string;
  'via-branch'?: string;
  fatal?: boolean;
  'delete-delay'?: number;
}

// Query parameters
export interface QueryArgs extends BaseArgs {
  'call-id': string;
  'from-tag'?: string;
  'to-tag'?: string;
}

interface StreamEndpoint {
  family: 'IPv4' | 'IPv6';
  address: string;
  port: number;
}

type StreamFlag = 'RTP' |
  'RTCP' |
  'fallback RTCP' |
  'filled' |
  'confirmed' |
  'kernelized' |
  'no kernel support' |
  'DTLS fingerprint verified' |
  'strict source address' |
  'media handover' |
  'ICE';

interface CallStats {
  created: number;
  tag: string;
  label: string;
  'in dialogue with': string;
  medias: {
    index: number;
    type: string;
    protocol?: string;
    flags: MediaFlags[];
    streams: {
      'local port'?: number;
      'local address'?: string;
      family?: string;
      endpoint?: StreamEndpoint;
      'advertised endpoint'?: StreamEndpoint;
      'crypto suite'?: 'string';
      'last packet': number;
      'last kernel packet': number;
      'last user packet': number;
      flags: StreamFlag[];
      stats: {
        bytes: number;
        packets: number;
        errors: number;
      }
    }[]
  }[]
}

export interface QueryResponse extends BaseResponse {
  created: number;
  'last signal': number;
  tags: Record<string, CallStats>;
}

// List parameters
export interface ListArgs {
  limit?: number;
  'call-id'?: string;
}

export interface ListResponse extends BaseResponse {
  calls: string[];
}

export interface StopRecordingArgs extends BaseArgs {
  'call-id': string;
  'from-tag'?: string;
  'to-tag'?: string;
  'via-branch'?: string;
  metadata?: string;
}

// Start recording parameters
export interface StartRecordingArgs extends StopRecordingArgs {
  'recording-file'?: string;
  'recording-dir'?: string;
  'recording-pattern'?: string;
}

export interface MediaOpArgs extends BaseArgs {
  'call-id': string;
  'from-tag'?: string;
  address?: string;
  label?: string;
}

// Play Media parameters
export interface PlayMediaArgs extends MediaOpArgs {
  file?: string;
  blob?: string;
  'db-id'?: number;
  'repeat-times'?: number;
  'repeat-duration'?: number;
  'start-pos'?: number;
}

export interface PlayMediaResponse extends BaseResponse {
  duration?: number;
}

// Stop Media parameters
export interface StopMediaResponse extends BaseResponse {
  'last-frame-pos': number;
}

type DTMFDigit = number | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' |
  '*' | '#' | 'A' | 'B' | 'C' | 'D';

export interface PlayDTMFArgs extends MediaOpArgs {
  code?: DTMFDigit;
  digit?: DTMFDigit;
  duration?: number;
  volume?: number;
  pause?: number;
}

export interface StatisticsResponse extends BaseResponse {
  statistics: Record<string, unknown>;
}

type MediaMode = 'sendrecv' | 'sendonly' | 'recvonly' | 'inactive';

interface TagLabel {
  tag: string;
  index: number;
  type: string;
  label?: string;
  mode: MediaMode;
}

interface SubscribeRequest {
  sdp: string;
  'from-tag'?: string;
  'to-tag': string;
  'from-tags'?: string[];
  'tag-medias'?: Record<string, unknown>[];
  'tag-labels'?: Record<string, TagLabel>;
}

export type SubscribeRequestResponse = SubscribeRequest & BaseResponse;
export type SubscribeAnswerArgs = SubscribeRequest & BaseArgs;

export interface UnsubscribeArgs extends BaseArgs {
  'call-id': string;
  'to-tag': string;
}

// Generic base class with a fixed optional `opts` argument
declare class CommandHandler<Args extends unknown[]> extends EventEmitter {
  answer(...args: [...Args, opts: AnswerArgs]): Promise<OfferResponse>;
  delete(...args: [...Args, opts: DeleteArgs]): Promise<QueryResponse>;
  list(...args: [...Args, opts?: ListArgs]): Promise<ListResponse>;
  offer(...args: [...Args, opts: OfferArgs]): Promise<OfferResponse>;
  ping(...args: [...Args]): Promise<PingResult>;
  query(...args: [...Args, opts: QueryArgs]): Promise<QueryResponse>;
  startRecording(...args: [...Args, opts: StartRecordingArgs]): Promise<BaseResponse>;
  stopRecording(...args: [...Args, opts: StopRecordingArgs]): Promise<BaseResponse>;
  pauseRecording(...args: [...Args, opts: StopRecordingArgs]): Promise<BaseResponse>;
  blockDTMF(...args: [...Args, opts: MediaOpArgs]): Promise<BaseResponse>;
  unblockDTMF(...args: [...Args, opts: MediaOpArgs]): Promise<BaseResponse>;
  blockMedia(...args: [...Args, opts: MediaOpArgs]): Promise<BaseResponse>;
  unblockMedia(...args: [...Args, opts: MediaOpArgs]): Promise<BaseResponse>;
  silenceMedia(...args: [...Args, opts: MediaOpArgs]): Promise<BaseResponse>;
  unsilenceMedia(...args: [...Args, opts: MediaOpArgs]): Promise<BaseResponse>;
  startForwarding(...args: [...Args, opts: MediaOpArgs]): Promise<BaseResponse>;
  stopForwarding(...args: [...Args, opts: MediaOpArgs]): Promise<BaseResponse>;
  playMedia(...args: [...Args, opts: PlayMediaArgs]): Promise<PlayMediaResponse>;
  stopMedia(...args: [...Args, opts: MediaOpArgs]): Promise<StopMediaResponse>;
  playDTMF(...args: [...Args, opts: PlayDTMFArgs]): Promise<BaseResponse>;
  statistics(...args: [...Args]): Promise<StatisticsResponse>;
  publish(...args: [...Args, opts: OfferArgs]): Promise<OfferResponse>;
  subscribeRequest(...args: [...Args, opts: MediaOpArgs]): Promise<SubscribeRequestResponse>;
  subscribeAnswer(...args: [...Args, opts: SubscribeAnswerArgs]): Promise<BaseResponse>;
  unsubscribe(...args: [...Args, opts: UnsubscribeArgs]): Promise<BaseResponse>;
}

declare class BaseClient<Args extends unknown[] = []> extends CommandHandler<Args> {
  messages: Map<string, (err?: any) => void>;

  constructor(options: BaseClientOptions);
  get connectionBased(): boolean;
  close(): void;
  static decodeMessage(message: string): InternalMessage;
  static encodeMessage(id: string, data: any): string;
}

export class Client extends BaseClient<[remote: HostAndPort] | [port: number, host: string]> {
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
