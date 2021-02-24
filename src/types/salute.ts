import { Scenario } from '../lib/createScenario';
import { SaluteSession } from '../lib/session';

import { ServerAction } from './global';
import { AppState, Message, NLPRequest } from './request';
import { NLPResponse } from './response';

interface IntentSlot {
    name: string; // имя сущности
    entity: string; // тип сущности
    required: boolean; // наличие сущности обязательно
    prompts: string[]; // ???
    array: boolean;
}

interface FoundSlot {
    name: string;
    value: string;
    array: boolean;
}

export interface Intent {
    id: number;
    path: string;
    answer?: string;
    customData?: string;
    slots: IntentSlot[]; // сущности в фразе
}

export interface Variant {
    intent: Intent;
    confidence: number; // вероятностная оценка соответствия интента
    slots: FoundSlot[]; // распознанные сущности
}

export interface Inference {
    variants: Variant[];
}

export interface SaluteCommand {
    type: string;
    payload: { [key: string]: unknown };
}

export type SaluteRequestVariable = Record<string, unknown>;

export interface SaluteRequest<V = SaluteRequestVariable> {
    readonly message: Message;
    readonly serverAction?: ServerAction;
    readonly intent: string;
    readonly inference?: Inference;
    readonly request: NLPRequest;
    readonly state?: AppState;
    readonly variant?: Variant;
    readonly variables: V;
    setInference: (value: Inference) => void;
    setVariant: (value: Variant) => void;
    setVariable: (name: string, value: unknown) => void;
}

export interface SaluteResponse {
    appendBubble: (bubble: string) => void;
    appendCommand: <T extends SaluteCommand>(command: T) => void;
    appendSuggestions: (suggestions: string[]) => void;
    setIntent: (text: string) => void;
    setPronounceText: (text: string) => void;
    readonly message: NLPResponse;
}

export type SaluteHandler = (options: { req: SaluteRequest; res: SaluteResponse; session: SaluteSession }) => void;

export interface SaluteIntentVariable {
    required?: boolean;
    questions?: string[];
}

export type SaluteIntentVariables = string[] | { [key: string]: SaluteIntentVariable };

export interface TextIntent {
    matchers: string[];
    variables?: SaluteIntentVariables;
}

export interface ServerActionIntent {
    actionId: string;
    variables?: SaluteIntentVariables;
}

export type SaluteIntent = ServerActionIntent | TextIntent;

export interface DefaultScenario {
    default: SaluteHandler;
    run_app: SaluteHandler;
    close_app?: SaluteHandler;
}

export type IntentsDict = Record<string, TextIntent | ServerActionIntent>;

export type SaluteMiddleware = (options: {
    req: SaluteRequest;
    res: SaluteResponse;
    session: SaluteSession;
}) => Promise<void>;
export type SaluteMiddlewareCreator = (options: { scenario: Scenario }) => SaluteMiddleware;
