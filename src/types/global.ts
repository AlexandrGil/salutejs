import { NLPResponseATU } from './response';

export enum AppType {
    DIALOG = 'DIALOG',
    WEB_APP = 'WEB_APP',
    APK = 'APK',
    CHAT_APP = 'CHAT_APP',
}

/** Описание функциональности устройства */
export interface Features {
    /** Типы смартапов, которые поддерживает устройство */
    appTypes: AppType[];
}

/** Описание возможностей устройства пользователя */
export interface Capabilities {
    /** Описание экрана устройства */
    screen?: {
        /** Признак наличия экрана */
        available: boolean;
    };
    /** Описание микрофона устройства */
    mic?: {
        /** Признак наличия микрофона */
        available: boolean;
    };
    /** Описание динамиков устройства */
    speak?: {
        /** Признак наличия динамико */
        available: boolean;
    };
}

/** Операционная система устройства */
export enum OS {
    ANDROID = 'android',
    IOS = 'ios',
    WEB = 'web',
    WEBDBG = 'WEBDBG',
}

/**
 * Поверхность, от которой приходит вызов ассистента.
 * Например, приложение СберБанк Онлайн или SberBox.
 */
export enum Surface {
    /** Устройство SberBox */
    SBERBOX = 'SBERBOX',
    /** Приложение Сбер Салют */
    COMPANION = 'COMPANION',
    /** Устройство SberPortal */
    STARGATE = 'STARGATE',
}

/** Информация об устройстве пользователя */
export interface Device {
    /** Идентификатор устройства */
    deviceId: string;
    platformType: OS;
    /** Версия операционной системы */
    platformVersion: string;
    surface: Surface;
    /** Версия поверхности */
    surfaceVersion: string;
    features: Features;
    capabilities: Capabilities;
    /** Дополнительная информация об объекте или устройстве. В настоящий момент не используется */
    additionalInfo: unknown;
}

/** Составной идентификатор пользователя */
export interface UUID {
    /** Идентификатор канала коммуникации */
    userChannel: string;
    /**
     * Постоянный идентификатор пользователя созданный на основе SberID.
     * Может отсутствовать, если пользователь не аутентифицирован.
     * Может использовать для хранения контекста диалога пользователя.
     * Контекст диалога можно обновлять по значению поля new_session.
     */
    sub: string;
    /**
     * Идентификатор, который используется для определения не аутентифицированных пользователей.
     * Идентификатор может изменяться при сбросе настроек или переустановке смартапа.
     */
    userId: string;
}

/** Идентификатор персонажа, которого выбрал пользователь */
export enum CharacterId {
    /** Персонаж мужского пола по имени Сбер. Обращается на "вы". */
    sber = 'sber',
    /** Персонаж женского пола по имени Афина. Обращается на "вы". */
    athena = 'athena',
    /** Персонаж женского пола по имени Джой.  Обращается на "ты". */
    joy = 'joy',
}

/** Имя персонажа */
export enum CharacterName {
    /** Персонаж мужского пола по имени Сбер. Обращается на "вы". */
    sber = 'Сбер',
    /** Персонаж женского пола по имени Афина. Обращается на "вы". */
    athena = 'Афина',
    /** Персонаж женского пола по имени Джой.  Обращается на "ты". */
    joy = 'Джой',
}

/** Информация о текущем персонаже ассистента, который установлен у пользователя */
export interface Character {
    id: CharacterId;
    name: CharacterName;
    /** Пол персонажа. Учитывайте пол персонажа при проектировании ответов. */
    gender: 'female' | 'male';
    /** Форма обращения персонажа. Учитывайте форму обращения персонажа при проектировании ответов. */
    appeal: 'official' | 'no_official';
}

/** Информация о смартапе */
export interface AppInfo {
    /** Идентификатор проекта в SmartApp Studio */
    projectId: string;
    /** Идентификатор смартапа */
    applicationId: string;
    /** Идентификатор опубликованной версии смартапа */
    appversionId: string;
    /** Ссылка на веб-приложение. Поле актуально для Canvas Apps */
    frontendEndpoint: string;
    /**
     * Тип смартапа.
     * Обратите внимание, что ассистент перехватывает навигационные команды "вверх", "вниз", "влево" и "вправо"
     * только в Canvas App (тип приложения WEB_APP). В этом случае команды обрабатываются на уровне
     * фронтенда приложения. В остальных случаях, команды передаются в бекэнд активного приложения.
     * */
    frontendType: AppType;
    /** Более читаемый аналог поля projectId. Не актуален для внешних приложений */
    systemName?: string;
    /** Объединённое значение полей projectId, applicationId и appversionId */
    frontendStateId?: string;
}

/** Информация о запускаемом смартапе и параметрах его запуска. Формируется бэкендом приложения. */
export interface ServerAction {
    /**
     * Любые параметры, которые требуются для запуска смартапа.
     * Параметры должны быть представлены в виде валидного JSON-объекта.
     */
    payload: unknown;
    /** Действие, которое обрабатывает бэкенд смартапа. Значение по умолчанию: run_app. */
    type: string;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace jest {
        interface Matchers<R> {
            toBeEqualResponse(expected: NLPResponseATU);
        }
    }
}
