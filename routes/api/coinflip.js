import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  function isEven(value) {
    if (value % 2 == 0) return true;
    else return false;
  }

  let resault;
  const rndInt = Math.floor(Math.random() * 1000) + 1;

  if (isEven(rndInt)) {
    resault = "Heads";
  }
  if (!isEven(rndInt)) {
    resault = "Tails";
  }

  res.status(200).send(resault);
});

export default router;
