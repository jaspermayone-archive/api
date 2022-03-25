const { Router } = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const listQuotes = require("./controllers/quotes/listQuotes");
// const getQuoteById = require("./controllers/quotes/getQuoteById");
// const randomQuote = require("./controllers/quotes/randomQuote");

const router = Router();

router.get("/checkout", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: `${process.env.STRIPE_ITEM_PRICE}`,
      },
    ],
    success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.STRIPE_CANCEL_URL}`,
  });

  res.send(session);
});

router.get("/webhook", async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  const webhookSecret = `${process.env.STRIPE_WEBHOOK_SECRET}`;

  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req["rawBody"],
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object = require( the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly = require( the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  switch (eventType) {
    case "checkout.session.completed":
      console.log(data);
      // Data included in the event object:
      const customerId = data.object.customer;
      const subscriptionId = data.object.subscription;

      console.log(
        `💰 Customer ${customerId} subscribed to plan ${subscriptionId}`
      );

      // Get the subscription. The first item is the plan the user subscribed to.
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const itemId = subscription.items.data[0].id;

      // Generate API key
      const { apiKey, hashedAPIKey } = generateAPIKey();
      console.log(`User's API Key: ${apiKey}`);
      console.log(`Hashed API Key: ${hashedAPIKey}`);

      // Store the API key in your database.
      customers[customerId] = { apikey: hashedAPIKey, itemId, active: true };
      apiKeys[hashedAPIKey] = customerId;

      break;
    case "invoice.paid":
      break;
    case "invoice.payment_failed":
      break;
    default:
    // Unhandled event type
  }

  res.sendStatus(200);
});

// GET http://localhost:8080/api?apiKey=API_KEY
// Make a call to the API
router.get("/api", async (req, res) => {
  const { apiKey } = req.query;

  if (!apiKey) {
    res.sendStatus(400); // bad request
  }

  const hashedAPIKey = hashAPIKey(apiKey);

  const customerId = apiKeys[hashedAPIKey];
  const customer = customers[customerId];

  if (!customer || !customer.active) {
    res.sendStatus(403); // not authorized
  } else {
    // Record usage with Stripe Billing
    const record = await stripe.subscriptionItems.createUsageRecord(
      customer.itemId,
      {
        quantity: 1,
        timestamp: "now",
        action: "increment",
      }
    );
    res.send({ data: "🔥🔥🔥🔥🔥🔥🔥🔥", usage: record });
  }
});

router.get("/usage/:customer", async (req, res) => {
  const customerId = req.params.customer;
  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: customerId,
  });

  res.send(invoice);
});

/*
router.get("/api/quotes", listQuotes);
router.get("/api/quotes/:id", getQuoteById);
router.get("/api/quotes/random", randomQuote); */

module.exports = router;
