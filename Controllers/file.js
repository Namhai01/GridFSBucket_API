const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const conn = mongoose.createConnection(process.env.MONGODB, (error) => {
  if (error) {
    res.status(500).json(error);
    return;
  }
});
let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
    chunkSizeBytes: 1024 * 1024,
  });
});
//ok
const upload = async (req, res) => {
  // const test = await gfs.drop({});
  if (req.file === undefined) {
    res.json({ status: "erroe", message: "Chưa chọn file" });
  } else {
    res.json({ status: "success", message: "Đã lưu thành công" });
  }
};
//ok
const getfile = async (req, res) => {
  try {
    const fileName = String(req.params.filename);
    const file = await gfs
      .find(
        {
          filename: fileName,
        },
        { batchSize: 1 }
      )
      .toArray();
    if (file.length > 0) {
      if (file.contentType === "image/png" || "image/jpg") {
        // file.forEach((doc) => console.log(doc));
        gfs.openDownloadStreamByName(fileName).pipe(res);
      } else {
        res.json({ status: "error", message: "không đúng định dạng file" });
      }
    } else {
      res.json({ status: "error", message: "File không tồn tại" });
    }
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
};
//ok
const getVideoFile = async (req, res) => {
  try {
    const fileName = req.params.filename;
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
    }
    const getVideo = await gfs.find({ filename: fileName }).toArray();
    if (getVideo) {
      const videoSize = getVideo[0].length;
      const start = Number(range.replace(/\D/g, ""));
      const end = videoSize - 1;
      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };
      await res.writeHead(206, headers);
      const streamVideo = await gfs.openDownloadStreamByName(fileName, {
        start: start,
        end: videoSize,
      });
      streamVideo.pipe(res);
    }
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
};
//ok
const delFile = async (req, res) => {
  try {
    const fileName = String(req.params.filename);
    const file = await gfs
      .find({
        filename: fileName,
      })
      .toArray();
    // console.log(file[0]._id);
    if (file.length > 0) {
      gfs.delete(new mongoose.Types.ObjectId(file[0]._id));
      res.json({ status: "success", message: "Xoá thành công" });
    } else {
      res.json({ status: "error", message: "Không tìm thấy file" });
    }
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
};

module.exports = { upload, getfile, delFile, getVideoFile };
