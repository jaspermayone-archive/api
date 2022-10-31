import { Phisherman } from "./apis/Phisherman";
import { VirusTotal } from "./apis/VirusTotal";
import { Walshy } from "./apis/Walshy";
/**
 *
 * @param link
 */
export const reportExternal = async (link: string) => {
  try {
    const PhishermanResponse = await Phisherman(link, false, true);
    const WalshyResponse = await Walshy(link, false, true);
    const VirusTotalResponse = await VirusTotal(link, false, true);

    const externalReportResponses = {
      Phisherman: PhishermanResponse,
      Walshy: WalshyResponse,
      VirusTotal: VirusTotalResponse,
    };

    return externalReportResponses;
  } catch (error) {
    console.log(error);
  }
};
