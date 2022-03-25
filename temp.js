/*
 THIS IS A TEMPORARY FILE!
 All code here MUST be implemented somewhere else!
  */

// Reverse mapping of stripe to API key. Model this in your preferred database.
const customers = {
  // stripeCustomerId : data
  stripeCustomerId: {
    apiKey: "123xyz",
    active: false,
    itemId: "stripeSubscriptionItemId",
  },
};
const apiKeys = {
  // apiKey : customerdata
  "123xyz": "stripeCustomerId",
};
