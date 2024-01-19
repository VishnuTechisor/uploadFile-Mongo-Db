require("dotenv").config();
const upload = require("./routes/upload");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const connection = require("./db");
const express = require("express");
const cors = require("cors")
const app = express();

let gfs;
connection();

const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("file");
});

app.use(cors())

app.use("/file", upload);

app.get("/file/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });

        if (!file) {
            return res.status(404).send("File not found");
        }

        const readStream = gfs.createReadStream(file.filename);
        res.setHeader("Content-Type", file.contentType)
        readStream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/allFiles", async (req, res) => {
    try {
        const files = await gfs.files.find().toArray();
res.json(files);
    } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
}
  });

app.delete("/file/:filename", async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured.");
    }
});

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
