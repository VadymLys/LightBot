import fetch from "node-fetch";
import type { HeadersInit } from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

interface EsiosApiPostOptions {
  endpoint: string;
  body: any;
  customHeaders?: HeadersInit;
}

export const esiosApiPost = async <T = any>({
  endpoint,
  body,
  customHeaders = {},
}: EsiosApiPostOptions): Promise<T> => {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY || "",
    ...customHeaders,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`POST error ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
};
