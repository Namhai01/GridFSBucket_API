const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const conn = mongoose.createConnection(process.env.MONGODB);
let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "images" });
});

const upload = async (req, res) => {
  res.json({ status: "success", message: "Đã lưu thành công" });
};

const getfile = async (req, res) => {
  try {
    const fileName = String(req.params.filename);
    const file = await gfs.find({
      filename: fileName,
    });
    if (file) {
      // file.forEach((doc) => console.log(doc));
      gfs.openDownloadStreamByName(fileName).pipe(res);
    }

    // await gfs.openDownloadStreamByName(file.filename).pipe(res);
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
};

const delFile = async (req, res) => {
  try {
    // const _id = new mongoose.Types.ObjectId("6420411d5342d3f4ed069c06");
    // const id = _id;
    // console.log(id);
    const delFile = await gfs.remove({ _id: "64204aef9ddac4ebef3c72ae" });
    if (delFile) {
      res.json({ status: "success", message: "da xoa anh" });
    }
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
};

module.exports = { upload, getfile, delFile };
