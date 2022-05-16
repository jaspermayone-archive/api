/* eslint-disable jsdoc/require-jsdoc */

import axios from "axios";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";

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

  try {
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
  } catch (error) {
    console.error(error);
  }
};

export default errorLogger;
