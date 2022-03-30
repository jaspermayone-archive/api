import express from "express";

const router = express.Router();

router.get("/:customer", async (req, res) => {
  const customerId = req.params.customer;
  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: customerId,
  });

  res.status(200).send(invoice);
});

export default router;
