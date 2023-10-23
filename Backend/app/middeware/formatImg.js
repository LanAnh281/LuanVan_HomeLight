const sharp = require("sharp");
const fs = require("fs");
const uploadDir = "./static/images";
const path = require("path");
exports.format = async (req, res, next) => {
  const { countFiles } = req.body;
  console.log("FormatIMg:", req.body, countFiles > 0);
  try {
    if (countFiles > 0) {
      fs.readdir(uploadDir, async (error, files) => {
        if (error) {
          console.error("Error reading upload directory:", error);
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

        newestFiles = files.slice(0, countFiles);
        try {
          for (let index = 0; index < countFiles; index++) {
            const inputPath = `${uploadDir}/${newestFiles[index]}`;

            // Đường dẫn đến thư mục đích cho ảnh đã định dạng lại
            const outputPath = `${uploadDir}/F${newestFiles[index]}`;
            sharp(inputPath)
              .resize({ width: 800, height: 800 })
              .toFile(outputPath, (err, info) => {
                if (err) {
                  console.error("Lỗi trong quá trình định dạng lại ảnh:", err);
                } else {
                  console.log(
                    "Ảnh đã được định dạng lại và lưu tại:",
                    outputPath
                  );
                  fs.unlinkSync(inputPath);
                }
              });
          }
          // return res.json({ message: document, status: "success" });
          next();
        } catch (error) {
          return res.json({ message: error, status: "fail" });
        }
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: error, status: "faild" });
  }
};
//    name: newestFiles[index],
// roomId: document._id,
