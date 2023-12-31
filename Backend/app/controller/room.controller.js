const { Rooms, Media } = require("../models/index.model.js");
const fs = require("fs");
const uploadDir = "./static/images";
const path = require("path");

exports.create = async (req, res, next) => {
  const { name, price, wide, long, boardingId, countFiles, status } = req.body;
  try {
    const document = await Rooms.create({
      name: name,
      price: price,
      wide: wide,
      long: long,
      status: status,
      boardingId: boardingId,
    });
    if (document && countFiles > 0) {
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
            console.log(">>>index:", index);
            let media = await Media.create({
              name: newestFiles[index],
              roomId: document._id,
            });
          }
          return res.json({ message: document, status: "success" });
        } catch (error) {
          return res.json({ message: error, status: "fail" });
        }
      });
    } else if (document) {
      return res.json({ message: document, status: "success" });
    } else {
      return res.json({ message: "fail", status: "faild" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const rooms = await Rooms.findAll({});
    let documents = JSON.parse(JSON.stringify(rooms));
    documents = documents.sort((a, b) => a.name - b.name);
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Rooms.findOne({
      where: {
        _id: req.params.id,
      },
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.updated = async (req, res, next) => {
  const { name, price, wide, long, boardingId, status, countFiles } = req.body;

  let removeMedia = !req.body.removeMedia ? 0 : req.body.removeMedia;
  if (removeMedia.length > 0) removeMedia.pop();
  try {
    const document = await Rooms.update(
      {
        name: name,
        price: price,
        wide: wide,
        long: long,
        status: status,
        boardingId: boardingId,
      },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    if (document && removeMedia.length > 0) {
      for (let media of removeMedia) {
        let filePath = `${uploadDir}/${media}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); //delete file
          let destroyMedia = await Media.destroy({
            where: {
              name: media,
            },
          });
          console.log(">>>Destroy:", destroyMedia);
        }
      }
    }
    if (document && countFiles > 0) {
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
            let media = await Media.create({
              name: newestFiles[index],
              roomId: req.params.id,
            });
          }
          return res.json({ message: document, status: "success" });
        } catch (error) {
          return res.json({ message: error, status: "fail" });
        }
      });
    } else if (document) {
      return res.json({ message: document, status: "success" });
    } else {
      return res.json({ message: "fail", status: "faild" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};

exports.updatedStatusRoom = async (req, res, next) => {
  const { name, price, wide, long, boardingId, status } = req.body;

  try {
    const document = await Rooms.update(
      {
        name: name,
        price: price,
        wide: wide,
        long: long,
        status: status,
        boardingId: boardingId,
      },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    document
      ? res.json({ message: document, status: "success" })
      : res.json({ message: document, status: "fail" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.delete = async (req, res, next) => {
  try {
    const document = await Rooms.destroy({
      where: {
        _id: req.params.id,
      },
    });
    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const documents = await Rooms.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
