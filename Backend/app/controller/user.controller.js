const { Users } = require("../models/index.model");
const fs = require("fs");
const uploadDir = "./uploads/images";
const path = require("path");

exports.create = async (req, res, next) => {
  let { userName, identification, phone, address, email, start, end, file } =
    req.body;
  console.log("Body:", req.body);
  end = end === "" ? null : end;
  start = start === "" ? null : start;
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
      const documents = await Users.create({
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
      res.send({ message: documents, status: "success" });
    });
  } catch (error) {
    res.send({ message: error, status: "fail" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Users.findAll({});
    res.send({ message: documents, status: "success" });
  } catch (error) {
    res.send({ message: error, status: "fail" });
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
