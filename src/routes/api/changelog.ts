import axios from "axios";
import express from "express";

const router = express.Router();

interface Release {
  body: string;
  tag_name: string;
  prerelease: boolean;
  draft: boolean;
}

/**
 * @swagger
 * /v4/changelog:
 *    get:
 *      tags:
 *        - /v4
 *      summary: Get the recent changelog from Github
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: object
 *            properties:
 *              change_log:
 *                type: string
 *                example: "Added a new feature"
 *              version:
 *                type: string
 *                example: "v1.0.0"
 * 
 *        401:
 *          description: Unauthorized (No token provided)
 * 
 *        500:
 *          description: Internal Server Error
 */

router.get("/", (req, res) => {
  const repoOwner = 'Heptagram-Project';
  const repoName = 'discord-bot';
  const apiEndpoint = `https://api.github.com/repos/${repoOwner}/${repoName}/releases`

  // Max amount of pages to check for a non draft or pre-release before stopping
  const maxAttempts = 3;

  const formatRelease = (releaseBody: string) => {
    // Remove markdown from the changelog
    const changelog = releaseBody
      .replace(/(\*\*|\*|`)/gm, "")
      .replace(/^#{1,6}/gm , "");

    // Remove commits made by renovate
    const filteredChangelog = changelog
      .split("\n")
      .filter((line) => !line.includes("@renovate"))
      .join("\n");

    // Remove redundant line breaks and links and @ symbols
    return filteredChangelog
      .replace(/in https?:\/\/.*/g, "")
      .replace(/(\r)/gm, "")
      .replace(/(@)/gm, "")
      .trim();
  }

  const getLatestNonDraftRelease = (releases: Release[]) => (
    releases.find((release) => (
      !release.draft && !release.prerelease
    ))
  );

  (async () => {
    let foundRelease = false;

    for (let index = 0; index < maxAttempts; index++) {
      await axios.get(`${apiEndpoint}?page=${index + 1}`).then((response) => {
        const latestRelease = getLatestNonDraftRelease(response.data);

        if (latestRelease) {
          foundRelease = true;

          res.status(200).send({
            change_log: formatRelease(latestRelease.body),
            version: latestRelease.tag_name,
          });
        }
      });

      if (foundRelease) {
        break;
      }

      if (index === maxAttempts - 1) {
        throw new Error("No recent non draft or pre-release was found");
      }
    }
  })().catch((error: Error) => {
    throw new Error(error.message);
  });
});

export default router;