const fs = require("fs");
const uploadDir = "./uploads/images";
const path = require("path");

exports.wel = (req, res, next) => {
  console.log("we");
};
exports.create = async (req, res, next) => {
  try {
    fs.readdir(uploadDir, async (err, files) => {
      if (err) {
        console.error("Error reading upload directory:", err);
        return;
      }
      let newestFiles = "";
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
        newestFiles = files.slice(0, 1);
      } else {
        newestFiles = [...file];
      }
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "/uploads/images",
        `${newestFiles}`
      );
      res.sendFile(imagePath);
    });
    // res.json({ message: req.files, status: "success" });
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
