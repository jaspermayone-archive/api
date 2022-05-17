/* eslint-disable jsdoc/require-jsdoc */

import axios from "axios";
import "dotenv/config";

const env = process.env.NODE_ENV;
const errorUrl = process.env.ERROR_WEBHOOK_URL;
const avatarUrl = process.env.AVATAR_URL;

// set username based on environment
const username =
  env === "production"
    ? "Heptagram API Error Logger"
    : "Heptagram API Development Logger";

// create function to handle error
const errorLogger = (error, errorID) => {
  // remove error: from error message
  const errorMessage = error.message.replace("Error: ", "");

  axios.request({
    url: errorUrl,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      username: username,
      avatar_url: avatarUrl,
      embeds: [
        {
          title: "An Error has occurred...",
          description: ` \`Error:\` \`${errorMessage}\` \n\n \`ErrorID:\` **\`${errorID}\`**`,
          color: 15158332,
        },
      ],
    },
  });
};

export default errorLogger;
