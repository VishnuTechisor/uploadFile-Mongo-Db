const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        console.log(req.file.mimetype)
        if (req.file === undefined) return res.send("you must select a file.");
        const imgUrl = `http://localhost:8080/file/${req.file.filename}`;
        return res.status(200).json(imgUrl)
    } catch (error) {
        console.log(error)
        res.send(error)
    }

});


module.exports = router;
