import express from "express";
import bodyParser from "body-parser";
import chalk from "chalk";
import 'dotenv/config';

import checkoutRoutes from "./routes/checkout.js";
import webhookRoutes from "./routes/webhook.js";
import usageRoutes from "./routes/usage.js";
import qoutesRoutes from "./routes/quotes.js";

import { handle404, logErrors, handleErrors } from "./handleErrors.js";

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.redirect('/api');
});

app.use ('/checkout', checkoutRoutes);
app.use ('/webhook', webhookRoutes);
app.use ('/usage', usageRoutes);
app.use ('/api/quotes', qoutesRoutes);

app.use(handle404);
app.use(logErrors);
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(chalk.green(`Server started on http://localhost:${PORT}`));
});
