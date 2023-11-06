const {
  BorardingHouse,
  Media,
  Amenities,
} = require("../models/index.model.js");
const { deleteBoardingAndRooms } = require("../models/transaction.service");
const fs = require("fs");
const uploadDir = "./static/images";
const path = require("path");
exports.create = async (req, res, next) => {
  try {
    const { name, address, phone, countFiles } = req.body;
    const document = await BorardingHouse.create({
      name: name,
      address: address,
      phone: phone,
      userId: req.user.userId,
      isDelete: false,
    });
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

      for (let index = 0; index < countFiles; index++) {
        let media = await Media.create({
          name: newestFiles[index],
          boardingId: document._id,
        });
      }
      res.json({ message: document, status: "success" });
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAll = async (req, res, next) => {
  try {
    const documents = await BorardingHouse.findAll({
      include: [
        {
          model: Media,
        },
      ],
    });
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAllUser = async (req, res, next) => {
  try {
    const boardings = await BorardingHouse.findAll({
      where: { userId: req.user.userId, isDelete: false },
    });
    let documents = JSON.parse(JSON.stringify(boardings));
    documents = documents.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const document = await BorardingHouse.findOne({
      where: {
        _id: req.params.id,
      },
      include: [{ model: Media }],
    });
    return res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    return res.json({ message: error, status: "faild" });
  }
};
exports.updated = async (req, res, next) => {
  const { name, address, phone, isDelete, countFiles } = req.body;
  let removeMedia = !req.body.removeMedia ? 0 : req.body.removeMedia;
  if (removeMedia.length > 0) removeMedia.pop();
  try {
    const document = await BorardingHouse.update(
      {
        name: name,
        address: address,
        phone: phone,
        userId: req.user.userId,
        isDelete: isDelete,
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
              boardingId: req.params.id,
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
    // res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.delete = async (req, res, next) => {
  try {
    const document = await BorardingHouse.destroy({
      where: {
        _id: req.params.id,
      },
    });
    // const data = {
    //   _id: req.params.id,
    // };
    // const document = await deleteBoardingAndRooms(data);
    return res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const documents = await BorardingHouse.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
