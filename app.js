const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { handle404, logErrors, handleErrors } = require("./handleErrors");

const app = express();

app.use(function (req, res, next) {
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  }),

  cors()
})

app.get("/", (req, res) => {
  res.redirect('/api');
});

app.use(routes);
app.use(handle404);
app.use(logErrors);
app.use(handleErrors);

module.exports = app;