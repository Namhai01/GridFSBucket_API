const express = require("express");
const router = express.Router();
const multer = require("multer");
const { upload, getfile, delFile } = require("../Controllers/file");
const storage = require("../storage");
const uploadFile = multer({ storage });

router.post("/upload", uploadFile.single("file"), upload);
router.get("/:filename", getfile);
// router.delete("/delete", delFile);

module.exports = router;
