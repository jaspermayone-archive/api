import axios from "axios";

export const UrlScan = async (
  link: string,
  check: boolean,
  report: boolean
) => {
  if (check) {
    const checkSerch = await axios.get(
      `https://urlscan.io/api/v1/search/?q=domain:${link}`
    );

    // check if the link is not already scanned
    if (checkSerch.data.results.length === 0) {
      const scan = await axios.post(`https://urlscan.io/api/v1/scan/`, {
        url: link,
        public: "on",
        visibility: "public",
      });

      // wait 15 seconds for the scan to finish
      setTimeout(async () => {
        const scanResult = await axios.get(
          `https://urlscan.io/api/v1/result/${scan.data.uuid}/`
        );

        if (scanResult.data.verdicts.malicious) {
          return true;
        } else {
          return false;
        }
      }, 15000);
    }

    // if the link is already scanned, check the result
    else {
      const scanResult = await axios.get(
        `https://urlscan.io/api/v1/result/${checkSerch.data.results[0].task.uuid}/`
      );
      if (scanResult.data.verdicts.malicious) {
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
