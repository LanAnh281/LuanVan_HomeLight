const { RegistrationInfo } = require("../models/index.model");
const fs = require("fs");
const uploadDir = "./uploads/";
const path = require("path");

exports.create = async (req, res, next) => {
  const { userName, identificationCard, phone, address, email, content } =
    req.body;
  console.log("Body:", req.body);
  try {
    // Access the 'uploads' directory directly and retrieve the name of the saved file.

    fs.readdir(uploadDir, async (err, files) => {
      if (err) {
        console.error("Error reading upload directory:", err);
        return;
      }
      //sort the file list by time (using mtime)
      // sort in descending order
      files.sort((file1, file2) => {
        const stat1 = fs.statSync(path.join(uploadDir, file1));
        const stat2 = fs.statSync(path.join(uploadDir, file2));
        return stat2.mtime - stat1.mtime;
      });

      // Retrieve the two most recent files.
      const newestFiles = files.slice(0, 2);

      const documents = await RegistrationInfo.create({
        userName: userName,
        identificationCard: identificationCard,
        imagePrevious: newestFiles[0],
        imageAfter: newestFiles[1],
        phone: phone,
        address: address,
        email: email,
        content: content,
      });
      res.send({ message: documents, status: "success" });
    });
  } catch (error) {
    res.send({ message: error, status: "fail" });
  }
};
