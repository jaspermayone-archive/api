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
      checkVirusTotalAPI.data.data.attributes.last_analysis_stats.malicious +
        checkVirusTotalAPI.data.data.attributes.last_analysis_stats
          .suspicious >=
      2
    ) {
      return true;
    } else {
      return false;
    }
  }

  if (report) {
    const addVirusTotalComment = await axios.post(
      `https://www.virustotal.com/api/v3/domains/${link}/comments`,
      {
        headers: {
          "x-apikey": process.env.VIRUS_TOTAL_API_KEY,
        },
        data: {
          data: {
            attributes: {
              message:
                "This domain has been flagged as a phishing link by the Heptagram API team. If you believe this is a mistake, please contact us at phishing-team@heptagrambotproject.com",
            },
          },
        },
      }
    );

    const addVirusTotalVote = await axios.post(
      `https://www.virustotal.com/api/v3/domains/${link}/votes`,
      {
        headers: {
          "x-apikey": process.env.VIRUS_TOTAL_API_KEY,
        },
        data: {
          data: {
            attributes: {
              verdict: "malicious",
            },
          },
        },
      }
    );

    return {
      comment: addVirusTotalComment.data.data.attributes.message,
      vote: addVirusTotalVote.data.data.attributes.verdict,
    };
  }

  if ((!check && !report) || (check && report)) {
    throw new Error("Invalid type provided");
  }
};
