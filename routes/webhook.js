import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
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

export default router;
