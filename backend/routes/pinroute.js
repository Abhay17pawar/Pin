const express = require("express");
const { createPin, getAllPin } = require("../controllers/pincontroller");
const router = express.Router();

router.post('/', createPin);
router.get('/', getAllPin);

module.exports = router;
