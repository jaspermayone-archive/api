import axios from "axios";

export const SinkingYahts = async (
  link: string,
  check: boolean,
  report: boolean
) => {
  if (check) {
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
      return true;
    } else {
      return false;
    }
  }
  if ((!check && !report) || (check && report)) {
    throw new Error("Invalid type provided");
  }
};
