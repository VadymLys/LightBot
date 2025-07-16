import { Context } from "grammy";

export type QueryParams = Record<string, string | number>;

export interface IndicatorValue {
  geo_id: number;
  datetime: string;
  value: number;
}

export interface IndicatorResponse {
  indicator?: {
    values: IndicatorValue[];
  };
}

export interface EsiosApi {
  indicators: (
    id: number,
    queryParams?: QueryParams
  ) => Promise<IndicatorResponse>;
}

export interface EsiosApiPostOptions {
  endpoint: string;
  body: any;
  customHeaders?: HeadersInit;
}

export interface TelegramUser {
  id: number;
  telegram_id: number;
  username: string | null;
  auth_token: string | null;
  token_expires_at: string | null;
}

export interface MyContext extends Context {
  user?: TelegramUser;
}
