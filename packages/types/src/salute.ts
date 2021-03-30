/* eslint-disable no-use-before-define */
import { AppState, Message, NLPRequest } from './request';
import { NLPResponse, ErrorCommand, EmotionType } from './response';

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

export interface SaluteRequest<V = SaluteRequestVariable, S = AppState, A = { payload: unknown; type: string }> {
    readonly message: Message;
    readonly serverAction?: A;
    readonly voiceAction: boolean;
    readonly intent: string;
    readonly inference?: Inference;
    readonly request: NLPRequest;
    readonly state?: S;
    readonly variables: V;
    setInference: (value: Inference) => void;
    setVariable: (name: string, value: unknown) => void;
    currentState?: {
        path: string[];
        state: ScenarioSchema['string'];
    };
}

export interface SaluteResponse {
    appendBubble: (bubble: string) => void;
    appendCommand: <T extends SaluteCommand>(command: T) => void;
    /** @deprecated */
    appendItem: (command: any) => void;
    appendError: (error: ErrorCommand['smart_app_error']) => void;
    appendSuggestions: (suggestions: string[]) => void;
    setIntent: (text: string) => void;
    setPronounceText: (text: string) => void;
    setEmotion: (emotion: EmotionType) => void;
    readonly message: NLPResponse;
}

export type SaluteHandler<
    Rq extends SaluteRequest = SaluteRequest,
    S extends Record<string, unknown> = Record<string, unknown>,
    Rs extends SaluteResponse = SaluteResponse,
    H extends Record<string, unknown> = Record<string, unknown>
> = (options: { req: Rq; res: Rs; session: S; history: H }, dispatch?: (path: string[]) => void) => void;

export interface SaluteIntentVariable {
    required?: boolean;
    questions?: string[];
}

export interface TextIntent {
    matchers: string[];
}

export interface ServerActionIntent {
    action: string;
}

export type SaluteIntent = (
    | (Required<TextIntent> & Partial<ServerActionIntent>)
    | (Required<ServerActionIntent> & Partial<TextIntent>)
) & {
    variables?: Record<string, SaluteIntentVariable>;
};

export type IntentsDict = Record<string, SaluteIntent>;

export interface SaluteSession {
    path: string[];
    slotFilling: boolean;
    variables: {
        [key: string]: unknown;
    };
    currentIntent?: string;
    state: Record<string, unknown>;
}

export interface Recognizer {
    inference: (options: { req: SaluteRequest; res: SaluteResponse; session: SaluteSession }) => void;
}

export type ScenarioSchema = Record<
    string,
    {
        match: (req: SaluteRequest) => boolean;
        schema: string;
        handle: SaluteHandler;
        children?: ScenarioSchema;
    }
>;
