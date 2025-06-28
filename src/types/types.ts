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
