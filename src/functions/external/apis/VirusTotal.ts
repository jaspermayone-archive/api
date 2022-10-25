import axios from "axios";

export const VirusTotal = async (
  link: string,
  check: boolean,
  report: boolean
) => {
  if (check) {
    const checkVirusTotalAPI = await axios.get<{
      data: {
        attributes: {
          last_analysis_stats: {
            malicious: number;
            suspicious: number;
            timeout: number;
            undetected: number;
          };
        };
      };
    }>(`https://www.virustotal.com/api/v3/domains/${link}`, {
      headers: {
        "x-apikey": process.env.VIRUS_TOTAL_API_KEY,
      },
    });

    if (
      checkVirusTotalAPI.data.data.attributes.last_analysis_stats.malicious >= 2
    ) {
      return true;
    } else {
      return false;
    }
  }

  if ((!check && !report) || (check && report)) {
    throw new Error("Invalid type provided");
  }
};
