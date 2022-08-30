export const validateEnv = (): { valid: boolean; message: string } => {
  try {
    if (!process.env.NODE_ENV) {
      return { valid: false, message: "Missing Node Env" };
    }

    if (!process.env.PORT) {
      return { valid: false, message: "Missing Port" };
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      return { valid: false, message: "Missing Access Token Secret" };
    }

    if (!process.env.MONGODB_URI) {
      return { valid: false, message: "Missing MongoDB URI" };
    }

    if (!process.env.ERROR_WEBHOOK_URL) {
      return { valid: false, message: "Missing Error Webhook URL" };
    }

    if (!process.env.AVATAR_URL) {
      return { valid: false, message: "Missing Avatar URL" };
    }

    if (!process.env.GOOGLE_SAFE_BROWSING_API_KEY) {
      return { valid: false, message: "Missing Google Safe Browsing API Key" };
    }

    return { valid: true, message: "Environment variables validated!" };
  } catch (err) {
    console.error(err);
    return {
      valid: false,
      message: "Unknown error when validating environment",
    };
  }
};
