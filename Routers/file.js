const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  upload,
  getfile,
  delFile,
  getVideoFile,
} = require("../Controllers/file");
const storage = require("../storage");
const uploadFile = multer({ storage });

router.post("/upload", uploadFile.single("file"), upload);
router.get("/getimage/:filename", getfile);
router.get("/getvideo/:filename", getVideoFile);
router.post("/delete/:filename", delFile);
router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

module.exports = router;
