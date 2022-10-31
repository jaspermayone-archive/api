import { GoogleSafeBrowsing } from "./apis/GoogleSafeBrowsing";
import { Phisherman } from "./apis/Phisherman";
import { SinkingYahts } from "./apis/SinkingYahts";
import { UrlScan } from "./apis/UrlScan";
import { VirusTotal } from "./apis/VirusTotal";
import { Walshy } from "./apis/Walshy";

/**
 *
 * @param link
 */
export const checkExternal = async (link: string) => {
  try {
    // try different APIs
    const PhishermanResponse = await Phisherman(`${link}`, true, false);
    if (PhishermanResponse) {
      return {
        scamDetected: true,
        source: "Phisherman",
      };
    }

    const WalshyResponse = await Walshy(`${link}`, true, false);
    if (WalshyResponse) {
      return {
        scamDetected: true,
        source: "Walshy",
      };
    }
    const SinkingYahtsResponse = await SinkingYahts(`${link}`, true, false);
    if (SinkingYahtsResponse) {
      return {
        scamDetected: true,
        source: "SinkingYahts",
      };
    }
    const GoogleSafeBrowsingResponse = await GoogleSafeBrowsing(
      `${link}`,
      true,
      false
    );
    if (GoogleSafeBrowsingResponse) {
      return {
        scamDetected: true,
        source: "GoogleSafeBrowsing",
      };
    }

    const UrlScanResponse = await UrlScan(`${link}`, true, false);
    if (UrlScanResponse) {
      return {
        scamDetected: true,
        source: "UrlScan",
      };
    }

    const VirusTotalResponse = await VirusTotal(`${link}`, true, false);
    if (VirusTotalResponse) {
      return {
        scamDetected: true,
        source: "VirusTotal",
      };
    }

    // if no API detects a scam, return false
    return {
      scamDetected: false,
      source: "",
    };
  } catch (err) {
    console.error(err);
  }
};
