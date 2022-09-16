import { defaultIPSelector } from "ipinfo-express";

export const ipinfoOptions = {
  token: process.env.IP_INFO_BEARER_TOKEN,
  cache: null, // TOOD: Set caching mechanism
  timeout: 5000,
  //ipSelector: defaultIPSelector,
  ipSelector: (req) => "157.45.126.75",
};
