import axios from "axios";

// function that returns scamDetected as a boolean
export const Phisherman = async (
  link: string,
  check: boolean,
  report: boolean
) => {
  if (check) {
    const checkPhishermanAPI = await axios.get(
      `https://api.phisherman.gg/v2/domains/check/${link}`,
      {
        headers: {
          Authorization: "Bearer " + process.env.PHISHERMAN_API_KEY,
        },
      }
    );

    if (checkPhishermanAPI.data.verifiedPhish) {
      return true;
    } else {
      return false;
    }
  }

  if (report) {
    const reportPhishermanAPI = await axios.put(
      `https://api.phisherman.gg/v2/domains/report`,
      {
        headers: {
          Authorization: "Bearer " + process.env.PHISHERMAN_API_KEY,
        },
        data: {
          url: link,
        },
      }
    );

    return reportPhishermanAPI.data.message;
  }

  if ((!check && !report) || (check && report)) {
    throw new Error("Invalid type provided");
  }
};
