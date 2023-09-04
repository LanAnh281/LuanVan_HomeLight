const { Rooms, Media } = require("../models/index.model.js");
const fs = require("fs");
const uploadDir = "./uploads/images";
const path = require("path");

exports.create = async (req, res, next) => {
  const { name, price, area, boardingId, cycleId, countFiles } = req.body;
  let status = req.body.status;
  if (!req.body.status) status = false;
  else status = true;
  console.log(">>>>>Body:", req.body);
  try {
    const document = await Rooms.create({
      name: name,
      price: price,
      area: area,
      status: status,
      boardingId: boardingId,
      cycleId: null,
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
        console.log(">>>files:", newestFiles);
        try {
          for (let index in countFiles) {
            console.log(">>>index:", index);
            let media = await Media.create({
              name: newestFiles[index],
              roomId: document._id,
            });
          }
          console.log("scc");
          return res.json({ message: document, status: "success" });
        } catch (error) {
          return res.json({ message: error, status: "fail" });
        }
      });
    } else if (document) {
      console.log(">>>docccccc:", document);
      return res.json({ message: document, status: "faild" });
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
    const documents = await Rooms.findAll({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await Rooms.findAll({
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
  const { name, price, area, status, boardingId, cycleId } = req.body;
  console.log("Update Rooms", req.body);
  try {
    const document = await Rooms.update(
      {
        name: name,
        price: price,
        area: area,
        status: status,
        boardingId: boardingId,
        cycleId: cycleId,
      },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    res.json({ message: document, status: "success" });
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
