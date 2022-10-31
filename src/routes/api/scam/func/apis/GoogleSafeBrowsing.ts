import axios from "axios";

export const GoogleSafeBrowsing = async (
  link: string,
  check: boolean,
  report: boolean
) => {
  if (check) {
    const GOOGLE_SAFE_BROWSING_API_KEY =
      process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    const checkGoogleSafeBrowsing = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SAFE_BROWSING_API_KEY}`,
      {
        client: {
          clientId: "Heptagram Bot Project",
          clientVersion: process.env.npm_package_version,
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
      return true;
    } else {
      return false;
    }
  }

  if ((!check && !report) || (check && report)) {
    throw new Error("Invalid type provided");
  }
};
