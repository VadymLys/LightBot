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

export const esiosApi: EsiosApi = {
  indicators: async (id, queryParams, token) => {
    const qs = queryParams
      ? `?${new URLSearchParams(stringifyQueryParams(queryParams)).toString()}`
      : "";

    const resource = `${url}/indicators/${id}${qs}`;

    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY || "",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(resource, { method: "GET", headers });

    if (!res.ok) {
      const errorText = await res.text();
      throw new ApiError(
        `API error ${res.status}: ${errorText}, ${res.status}`
      );
    }

    const data: IndicatorResponse = await res.json();
    return data;
  },
};
