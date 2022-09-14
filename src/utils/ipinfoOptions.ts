import { defaultIPSelector } from "ipinfo-express";

export const ipinfoOptions = {
  token: process.env.IP_INFO_BEARER_TOKEN,
  cache: null,
  timeout: 5000,
  ipSelector: defaultIPSelector,
};
