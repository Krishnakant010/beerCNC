const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const imageDownloader = require("image-downloader");
const routes = require("./routes/user");
var cookieParser = require("cookie-parser");
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "/uploads/")));

app.use("/", routes);

const dbConnect = require("./config/database");
dbConnect();

app.listen(4000);

app.post("/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;
    const newName = Date.now() + ".jpg";
    const destin = path.join(__dirname, "/uploads/");
    console.log(destin);
    await imageDownloader
      .image({
        url: link,
        dest: destin + newName,
      })
      .then(() => {
        console.log("Success!");
      });

    res.json(newName);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
});
const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];

  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    let newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }

  res.json(uploadedFiles);
});
