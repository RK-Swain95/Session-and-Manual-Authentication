const router = require("express").Router();

const { get, check, profile } = require("../controllers/auth");
router.post("/get", get);
router.post("/check", check);
router.get("/profile", profile);

module.exports = router;
