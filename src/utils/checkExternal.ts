import axios from "axios";
import { body } from "express-validator";
/**
 *
 * @param link
 */
export const checkExternal = async (link: string) => {
  try {
    const checkSinkingYahts = await axios.get<boolean>(
      `https://phish.sinking.yachts/v2/check/${link}`,
      {
        headers: {
          accept: "application/json",
          "X-Identity": "Heptagram API",
        },
      }
    );

    if (checkSinkingYahts.data) {
      return {
        scamDetected: true,
        source: "SinkingYahts",
      };
    }

    const checkWalshyAPI = await axios.post<{
      badDomain: boolean;
      detection: "discord" | "community";
    }>("https://bad-domains.walshy.dev/check", {
      domain: link,
    });

    if (checkWalshyAPI.data.badDomain) {
      return {
        scamDetected: true,
        source: "WalshyAPI",
      };
    }

    /* TODO: Check against Google Safe Browsing API (https://developers.google.com/safe-browsing/v4/lookup)
     For implementation, Heptagram already as a key to the api. I am having trouble getting it to work, so am looking for some help.
     See Lines 46-77 for the implementation I have so far.
    */

    /*
    const GOOGLE_SAFE_BROWSING_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    const checkGoogleSafeBrowsing = await axios.post(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SAFE_BROWSING_API_KEY}`,
      {
        headers: {
          Accept: "application/json",
          ContentType: "application/json",
        },
        body: {
          "client": {
            "clientId": "yourcompanyname",
            "clientVersion": "1.5.2"
          },
          "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
            "platformTypes": ["WINDOWS"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [
              { "url": "http://www.urltocheck1.org/" },
              { "url": "http://www.urltocheck2.org/" },
              { "url": "http://www.urltocheck3.com/" }
            ]
          }
        }
      }
    );

    if (checkGoogleSafeBrowsing.data.matches.length > 0) {
      return {
        scamDetected: true,
        source: "GoogleSafeBrowsing",
      };
    }
    */

    return {
      scamDetected: false,
      source: "",
    };
  } catch (err) {
    console.error(err);
  }
};
