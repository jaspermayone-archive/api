import axios from "axios";
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
    return {
      scamDetected: false,
      source: "",
    };
  } catch (err) {
    console.error(err);
  }
};
