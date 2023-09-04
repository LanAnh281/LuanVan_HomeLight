const { Media } = require("../models/index.model");
const fs = require("fs");
const uploadDir = "./uploads/images";
const path = require("path");

exports.create = async (req, res, next) => {
  let {} = req.body;
  console.log("Body:", req.body);

  try {
    // Access the 'uploads' directory directly and retrieve the name of the saved file.
    fs.readdir(uploadDir, async (err, files) => {
      if (err) {
        console.error("Error reading upload directory:", err);
        return;
      }
      let newestFiles = [];
      console.log("files[0]", files[0] == "");
      if (files[0] != "") {
        //sort the file list by time (using mtime)
        // sort in descending order-
        files.sort((file1, file2) => {
          const stat1 = fs.statSync(path.join(uploadDir, file1));
          const stat2 = fs.statSync(path.join(uploadDir, file2));
          return stat2.mtime - stat1.mtime;
        });

        // Retrieve the two most recent files.
        newestFiles = files.slice(0, 2);
      } else {
        newestFiles = [...file];
      }
      console.log("New:", newestFiles);
      const documents = await Media.create({
        userName: userName,
        identification: identification,
        imagePrevious: newestFiles[0],
        imageAfter: newestFiles[1],
        phone: phone,
        address: address,
        email: email,
        start: start,
        end: end,
      });
      res.json({ message: documents, status: "success" });
    });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const documents = await Media.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    console.log("userId:", req.userId);
    const document =
      req.userId != null
        ? await Media.findOne({
            where: { _id: req.userId },
          })
        : { userName: "Quản trị viên" };
    res.json({ message: document, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.getImg = async function (req, res) {
  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "/uploads/images",
    `${req.params.id}`
  );
  res.sendFile(imagePath);
};
exports.delete = async (req, res, next) => {
  try {
    const documents = await Media.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.deleteOne = async (req, res, next) => {
  try {
    const document = await Media.destroy({
      where: { _id: req.params.id },
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.update = async (req, res, next) => {
  let {
    userName,
    identification,
    phone,
    address,
    email,
    start,
    end,
    file,
    imagePrevious,
    imageAfter,
  } = req.body;
  end = end === "" ? null : end;
  start = start === "" ? null : start;
  try {
    const user = await Media.findOne({ where: { _id: req.params.id } });
    if (user.imagePrevious != imagePrevious) {
      fs.readdir(uploadDir, async (err, files) => {
        if (err) {
          console.error("Error reading upload directory:", err);
          return;
        }
        let newestFiles = [];
        //sort the file list by time (using mtime)
        // sort in descending order-
        files.sort((file1, file2) => {
          const stat1 = fs.statSync(path.join(uploadDir, file1));
          const stat2 = fs.statSync(path.join(uploadDir, file2));
          return stat2.mtime - stat1.mtime;
        });

        // Retrieve the two most recent files.
        newestFiles = files.slice(0, 2);
        imagePrevious = newestFiles[0];
        imageAfter = newestFiles[1];
        console.log("2", imageAfter, imagePrevious);

        const documents = await Media.update(
          {
            userName: userName,
            identification: identification,
            imagePrevious: imagePrevious,
            imageAfter: imageAfter,
            phone: phone,
            address: address,
            email: email,
            start: start,
            end: end,
          },
          { where: { _id: req.params.id } }
        );
        res.json({ message: documents, status: "success" });
      });
    } else {
      const documents = await Media.update(
        {
          userName: userName,
          identification: identification,
          imagePrevious: imagePrevious,
          imageAfter: imageAfter,
          phone: phone,
          address: address,
          email: email,
          start: start,
          end: end,
        },
        { where: { _id: req.params.id } }
      );
      res.json({ message: documents, status: "success" });
    }
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
