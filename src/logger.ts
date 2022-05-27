import axios from "axios";
import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";

const jwt = jsonwebtoken;

const env = process.env.NODE_ENV;
const errorUrl = process.env.ERROR_WEBHOOK_URL;
const avatarUrl = process.env.AVATAR_URL;

// set username based on environment
const username =
  env === "production"
    ? "Heptagram API Error Logger"
    : "Heptagram API Development Logger";

// create function to handle error
const errorLogger = async (error, errorID, req) => {
  // remove error: from error message
  const errorMessage = error.message.replace("Error: ", "");

  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader === "undefined") {
    return;
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  const decoded = await jwt.verify(
    bearerToken,
    process.env.ACCESS_TOKEN_SECRET
  );

  axios.request({
    url: errorUrl,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      username: username,
      avatar_url: avatarUrl,
      content: "Yo <@722121621610954773>...",
      embeds: [
        {
          title: "An Error has occurred...",
          color: 15158332,
          fields: [
            {
              name: "Error:",
              value: `\`${errorMessage}\``,
              inline: true,
            },
            {
              name: "Error ID:",
              value: `\`${errorID}\``,
              inline: true,
            },
            {
              name: "Requested Endpoint:",
              value: `\`${req.originalUrl}\``,
              inline: true,
            },
            {
              name: "Request Id:",
              value: `\`${req.correlationId()}\``,
              inline: true,
            },
            {
              name: "Request Method:",
              value: `\`${req.method}\``,
              inline: true,
            },
            {
              name: "User ID:",
              value: `\`${decoded.userId}\``,
              inline: true,
            },
          ],
          timestamp: new Date(),
          footer: {
            text: "Heptagram API Error Logger",
          },
        },
      ],
    },
  });
  console.log(error);
};

export default errorLogger;
