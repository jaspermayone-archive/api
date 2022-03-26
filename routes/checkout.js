import express from "express";
import Stripe from 'stripe';

const stipe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.get("/", async (req, res) => {
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

export default router;
