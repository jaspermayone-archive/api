import axios from "axios";

export const Walshy = async (link: string, check: boolean, report: boolean) => {
  if (check) {
    const checkWalshyAPI = await axios.post<{
      badDomain: boolean;
      detection: "discord" | "community";
    }>("https://bad-domains.walshy.dev/check", {
      domain: link,
    });

    if (checkWalshyAPI.data.badDomain) {
      return true;
    } else {
      return false;
    }
  }

  if (report) {
    const reportWalshyAPI = await axios.post<{
      message: string;
    }>("https://bad-domains.walshy.dev/report", {
      domain: link,
    });

    return reportWalshyAPI.data.message;
  }

  if ((!check && !report) || (check && report)) {
    throw new Error("Invalid type provided");
  }
};
