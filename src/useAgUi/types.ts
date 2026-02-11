/**
 * AG-UI Protocol event types and interfaces.
 *
 * These are self-contained type definitions for the AG-UI protocol,
 * so consumers don't need to install @ag-ui/core separately.
 * See: https://docs.ag-ui.com
 */

export enum AgUiEventType {
  // Lifecycle
  RUN_STARTED = 'RUN_STARTED',
  RUN_FINISHED = 'RUN_FINISHED',
  RUN_ERROR = 'RUN_ERROR',
  STEP_STARTED = 'STEP_STARTED',
  STEP_FINISHED = 'STEP_FINISHED',

  // Text messages
  TEXT_MESSAGE_START = 'TEXT_MESSAGE_START',
  TEXT_MESSAGE_CONTENT = 'TEXT_MESSAGE_CONTENT',
  TEXT_MESSAGE_END = 'TEXT_MESSAGE_END',
  TEXT_MESSAGE_CHUNK = 'TEXT_MESSAGE_CHUNK',

  // Tool calls
  TOOL_CALL_START = 'TOOL_CALL_START',
  TOOL_CALL_ARGS = 'TOOL_CALL_ARGS',
  TOOL_CALL_END = 'TOOL_CALL_END',
  TOOL_CALL_RESULT = 'TOOL_CALL_RESULT',
  TOOL_CALL_CHUNK = 'TOOL_CALL_CHUNK',

  // State
  STATE_SNAPSHOT = 'STATE_SNAPSHOT',
  STATE_DELTA = 'STATE_DELTA',
  MESSAGES_SNAPSHOT = 'MESSAGES_SNAPSHOT',

  // Special
  RAW = 'RAW',
  CUSTOM = 'CUSTOM'
}

export interface AgUiBaseEvent {
  type: AgUiEventType;
  timestamp?: number;
  rawEvent?: unknown;
}

// Lifecycle events
export interface AgUiRunStartedEvent extends AgUiBaseEvent {
  type: AgUiEventType.RUN_STARTED;
  threadId: string;
  runId: string;
}

export interface AgUiRunFinishedEvent extends AgUiBaseEvent {
  type: AgUiEventType.RUN_FINISHED;
  threadId: string;
  runId: string;
}

export interface AgUiRunErrorEvent extends AgUiBaseEvent {
  type: AgUiEventType.RUN_ERROR;
  message: string;
  code?: string;
}

export interface AgUiStepStartedEvent extends AgUiBaseEvent {
  type: AgUiEventType.STEP_STARTED;
  stepName: string;
}

export interface AgUiStepFinishedEvent extends AgUiBaseEvent {
  type: AgUiEventType.STEP_FINISHED;
  stepName: string;
}

// Text message events
export interface AgUiTextMessageStartEvent extends AgUiBaseEvent {
  type: AgUiEventType.TEXT_MESSAGE_START;
  messageId: string;
  role?: AgUiRole;
}

export interface AgUiTextMessageContentEvent extends AgUiBaseEvent {
  type: AgUiEventType.TEXT_MESSAGE_CONTENT;
  messageId: string;
  delta: string;
}

export interface AgUiTextMessageEndEvent extends AgUiBaseEvent {
  type: AgUiEventType.TEXT_MESSAGE_END;
  messageId: string;
}

export interface AgUiTextMessageChunkEvent extends AgUiBaseEvent {
  type: AgUiEventType.TEXT_MESSAGE_CHUNK;
  messageId?: string;
  role?: AgUiRole;
  delta?: string;
}

// Tool call events
export interface AgUiToolCallStartEvent extends AgUiBaseEvent {
  type: AgUiEventType.TOOL_CALL_START;
  toolCallId: string;
  toolCallName: string;
  parentMessageId?: string;
}

export interface AgUiToolCallArgsEvent extends AgUiBaseEvent {
  type: AgUiEventType.TOOL_CALL_ARGS;
  toolCallId: string;
  delta: string;
}

export interface AgUiToolCallEndEvent extends AgUiBaseEvent {
  type: AgUiEventType.TOOL_CALL_END;
  toolCallId: string;
}

export interface AgUiToolCallResultEvent extends AgUiBaseEvent {
  type: AgUiEventType.TOOL_CALL_RESULT;
  toolCallId: string;
  content: string;
}

export interface AgUiToolCallChunkEvent extends AgUiBaseEvent {
  type: AgUiEventType.TOOL_CALL_CHUNK;
  toolCallId?: string;
  toolCallName?: string;
  parentMessageId?: string;
  delta?: string;
}

// State events
export interface AgUiStateSnapshotEvent extends AgUiBaseEvent {
  type: AgUiEventType.STATE_SNAPSHOT;
  snapshot: unknown;
}

export interface AgUiStateDeltaEvent extends AgUiBaseEvent {
  type: AgUiEventType.STATE_DELTA;
  delta: unknown[];
}

export interface AgUiMessagesSnapshotEvent extends AgUiBaseEvent {
  type: AgUiEventType.MESSAGES_SNAPSHOT;
  messages: AgUiMessage[];
}

// Special events
export interface AgUiRawEvent extends AgUiBaseEvent {
  type: AgUiEventType.RAW;
  event: unknown;
  source?: string;
}

export interface AgUiCustomEvent extends AgUiBaseEvent {
  type: AgUiEventType.CUSTOM;
  name: string;
  value: unknown;
}

export type AgUiEvent =
  | AgUiRunStartedEvent
  | AgUiRunFinishedEvent
  | AgUiRunErrorEvent
  | AgUiStepStartedEvent
  | AgUiStepFinishedEvent
  | AgUiTextMessageStartEvent
  | AgUiTextMessageContentEvent
  | AgUiTextMessageEndEvent
  | AgUiTextMessageChunkEvent
  | AgUiToolCallStartEvent
  | AgUiToolCallArgsEvent
  | AgUiToolCallEndEvent
  | AgUiToolCallResultEvent
  | AgUiToolCallChunkEvent
  | AgUiStateSnapshotEvent
  | AgUiStateDeltaEvent
  | AgUiMessagesSnapshotEvent
  | AgUiRawEvent
  | AgUiCustomEvent;

// AG-UI message types (used in RunAgentInput)
export type AgUiRole = 'developer' | 'system' | 'assistant' | 'user' | 'tool';

export interface AgUiMessage {
  id: string;
  role: AgUiRole;
  content?: string;
  name?: string;
  toolCallId?: string;
}

export interface AgUiTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface AgUiContext {
  description: string;
  value: string;
}

export interface AgUiRunAgentInput {
  threadId: string;
  runId: string;
  messages: AgUiMessage[];
  tools: AgUiTool[];
  context: AgUiContext[];
  state: unknown;
  forwardedProps: Record<string, unknown>;
}

export interface AgUiToolCallInfo {
  toolCallId: string;
  toolCallName: string;
  args: string;
}
