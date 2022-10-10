import axios from "axios";

export const IpQualityScore = async (
  link: string,
  check: boolean,
  report: boolean
) => {
  if (check) {
    const checkIpQualityScoreAPI = await axios.get(
      `https://ipqualityscore.com/api/json/url/${process.env.IP_QUALITY_SCORE_API_KEY}/${link}`
    );

    if (checkIpQualityScoreAPI.data.success) {
      if (checkIpQualityScoreAPI.data.threat_type === "phishing") {
        return true;
      } else {
        return false;
      }
    }
  }

  if ((!check && !report) || (check && report)) {
    throw new Error("Invalid type provided");
  }
};
