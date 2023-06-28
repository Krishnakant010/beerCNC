const express = require("express");
const router = express.Router();
const {
  plaecesAdd,
  register,
  login,
  logout,
  getProfile,
  upload,
  getPlaces,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", getProfile);
router.post("/places", plaecesAdd);
router.get("/places", getPlaces);
// router.post("/upload-by-link", uploader);
// router.post("/upload", upload);
module.exports = router;
