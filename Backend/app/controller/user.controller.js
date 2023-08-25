const { Users } = require("../models/index.model");
const fs = require("fs");
const uploadDir = "./uploads/images";
const path = require("path");

const { createUserAndAccount } = require("../models/transaction.service");

exports.createUserAndAccount = async (req, res) => {
  let {
    userName,
    identification,
    phone,
    address,
    email,
    start,
    end,
    file,
    password,
  } = req.body;

  try {
    const userData = {
      userName: userName,
      identification: identification,
      // imagePrevious: newestFiles[0],
      // imageAfter: newestFiles[1],
      phone: phone,
      address: address,
      email: email,
      start: start,
      end: end,
      password: password,
    };
    const result = await createUserAndAccount(userData);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user and order." });
  }
};
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
      res.json({ message: documents, status: "success" });
    });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await Users.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Users.findAll({
      where: { _id: req.params.id },
    });
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
    const documents = await Users.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
exports.deleteOne = async (req, res, next) => {
  try {
    const document = await Users.destroy({
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
  console.log("Body:", req.body);
  end = end === "" ? null : end;
  start = start === "" ? null : start;
  try {
    const user = await Users.findOne({ where: { _id: req.params.id } });
    if (user.imagePrevious != imagePrevious) {
      console.log("1");
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

        const documents = await Users.update(
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
      console.log("3", imageAfter, imagePrevious);
      const documents = await Users.update(
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
