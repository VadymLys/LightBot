import fetch from "node-fetch";
import dotenv from "dotenv";
import type {
  IndicatorResponse,
  QueryParams,
  EsiosApi,
} from "../types/types.js";
import type { HeadersInit } from "node-fetch";
import { ApiError } from "../errors/ApiError.js";
import { stringifyQueryParams } from "../utils/stringifyQuery.js";
import { InputValidator } from "../utils/InputValidator.js";

dotenv.config();

const url = "https://api.esios.ree.es";

const createApi = (baseUrl: string) => {
  InputValidator.isUrl(baseUrl);

  return new Proxy(
    {},
    {
      get: (target, prop: string) => {
        return async (
          id: number,
          queryParams?: QueryParams,
          token?: string
        ): Promise<IndicatorResponse> => {
          let qs = queryParams
            ? `?${new URLSearchParams(
                stringifyQueryParams(queryParams)
              ).toString()}`
            : "";

          // Формуємо правильний ресурс, де prop буде частиною шляху
          const resourse = `${baseUrl}/${prop}/${id}/${qs}`;

          const headers: HeadersInit = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY || "",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          };

          const res = await fetch(resourse, {
            method: "GET",
            headers,
          });

          if (res.ok) {
            const data: IndicatorResponse = await res.json();
            return data;
          } else {
            const errorText = await res.text();
            throw new ApiError(
              `API error ${res.status}: ${errorText}, ${res.status}`
            );
          }
        };
      },
    }
  ) as EsiosApi;
};

export const esiosApi = createApi(url);
