import axios from "axios";
/**
 *
 * @param link
 */
export const checkExternal = async (link: string) => {
  try {
    const checkPhishermanAPI = await axios.get(
      `https://api.phisherman.gg/v2/domains/check/${link}`,
      {
        headers: {
          Authorization: "Bearer " + process.env.PHISHERMAN_API_KEY,
        },
      }
    );

    if (checkPhishermanAPI.data.verifiedPhish) {
      return {
        scamDetected: true,
        source: "PhishermanAPI",
      };
    }

    const checkIpQualityScoreAPI = await axios.get(
      `https://ipqualityscore.com/api/json/url/${process.env.IP_QUALITY_SCORE_API_KEY}/${link}`
    );

    if (checkIpQualityScoreAPI.data.unsafe) {
      return {
        scamDetected: true,
        source: "IpQualityScoreAPI",
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

    const checkUrlScan = await axios.post<{
      status: "queued" | "completed";
      result: "malicious" | "clean";
    }>("https://urlscan.io/api/v1/scan/", {
      url: link,
      public: "on",
    });

    if (checkUrlScan.data.status === "completed") {
      if (checkUrlScan.data.result === "malicious") {
        return {
          scamDetected: true,
          source: "UrlScan",
        };
      }
    }

    const GOOGLE_SAFE_BROWSING_API_KEY =
      process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    const checkGoogleSafeBrowsing = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SAFE_BROWSING_API_KEY}`,
      {
        client: {
          clientId: "Heptagram Bot Project",
          clientVersion: "TESTING",
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM", "ALL_PLATFORMS"],
          threatEntryTypes: ["URL"],
          threatEntries: [
            {
              url: link,
            },
          ],
        },
      }
    );

    if (Object.keys(checkGoogleSafeBrowsing.data).length > 0) {
      return {
        scamDetected: true,
        source: "GoogleSafeBrowsing",
      };
    }

    return {
      scamDetected: false,
      source: "",
    };
  } catch (err) {
    console.error(err);
  }
};
