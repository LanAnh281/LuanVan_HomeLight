const { log } = require("console");
const {
  Rooms,
  Media,
  BorardingHouse,
  User_Room,
  Amenities,
  Amenitie_Room,
} = require("../models/index.model.js");
const fs = require("fs");
const uploadDir = "./static/images";
const path = require("path");
const QRCode = require("qrcode");

exports.create = async (req, res, next) => {
  const {
    name,
    price,
    wide,
    long,
    content,
    isDelete,
    boardingId,
    countFiles,
    status,
    amenitie,
  } = req.body;
  console.log(req.body);
  try {
    const document = await Rooms.create({
      name: name,
      price: price,
      wide: wide,
      long: long,
      content: content,
      status: status == "undefined" ? "" : status,
      isDelete: isDelete,
      boardingId: boardingId,
    });
    const amenityList = amenitie ? amenitie : [];
    console.log("A:", amenitie, amenitie.length);
    if (amenitie.length > 0) {
      if (amenitie.length == 36) {
        const documentAmenitie = await Amenitie_Room.create({
          RoomId: document._id,
          AmenityId: amenitie,
        });
      } else
        for (let i = 0; i < amenitie.length; i++) {
          console.log("ID:", amenitie[i]);
          const documentAmenitie = await Amenitie_Room.create({
            RoomId: document._id,
            AmenityId: amenitie[i],
          });
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
    const rooms = await Rooms.findAll({
      where: {
        isDelete: !true,
      },
      include: [
        {
          model: Media,
        },
        {
          model: BorardingHouse,
        },
      ],
    });
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
    const documentRoom = await Rooms.findOne({
      where: {
        _id: req.params.id,
      },
      include: [
        {
          model: Media,
        },
        {
          model: BorardingHouse,
        },
        {
          model: Amenities,
        },
      ],
    });
    let document = JSON.parse(JSON.stringify(documentRoom));
    const phoneNumber = document.BoardingHouse.phone; // Thay thế bằng số điện thoại thực tế

    QRCode.toDataURL(`tel:${phoneNumber}`, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }

      // Ở đây, bạn có thể gửi URL của mã QR về phía frontend hoặc lưu nó trong cơ sở dữ liệu để sử dụng sau này.
      console.log("URL::::", url);
      // res.json({ qrCodeUrl: url });
      document["qrCodeUrl"] = url;
      res.json({ message: document, status: "success" });
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.findAllRooms = async (req, res, next) => {
  try {
    const document = await Rooms.findAll({
      where: {
        boardingId: req.params.id,
      },
    });

    res.json({ message: document, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
exports.updated = async (req, res, next) => {
  const {
    name,
    price,
    wide,
    long,
    content,
    boardingId,
    countFiles,
    // amenitie,
    removeAmenitie,
  } = req.body;
  let amenitie = req.body.amenitie;
  const status = req.body.status == "false" ? false : true;
  let removeMedia = !req.body.removeMedia ? 0 : req.body.removeMedia;
  if (removeMedia.length > 0) removeMedia.pop();

  try {
    const document = await Rooms.update(
      {
        name: name,
        price: price,
        wide: wide,
        long: long,
        content: content,
        status: status,
        boardingId: boardingId,
      },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    // loại bỏ ame
    console.log(req.body);
    if (removeAmenitie) {
      // for (let i = 0; i < removeAmenitie.length; i++) {
      const documentRemove = await Amenitie_Room.destroy({
        where: {
          RoomId: req.params.id,
        },
      });

      // }
      console.log("remove:", documentRemove);
    }

    // danh sách thêm mới
    const amenityList = amenitie ? amenitie : [];
    console.log("---L", amenityList);
    amenitie.push("");
    if (amenityList.length > 0) {
      // if (amenitie.length == 36) {
      //   const documentAmenitie = await Amenitie_Room.create({
      //     RoomId: req.params.id,
      //     AmenityId: amenitie,
      //   });
      // } else
      for (let i = 0; i < amenitie.length - 1; i++) {
        const documentAmenitie = await Amenitie_Room.create({
          RoomId: req.params.id,
          AmenityId: amenitie[i],
        });
      }
    }
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
              roomId: req.params.id,
            });
          }
          return res.json({ message: document, status: "success" });
        } catch (error) {
          return res.json({ message: error, status: "fail1" });
        }
      });
    } else if (document) {
      return res.json({ message: document, status: "success" });
    } else {
      return res.json({ message: "fail", status: "faild2" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild3" });
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
    const document = await Rooms.update(
      {
        isDelete: true,
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
exports.deleteAll = async (req, res, next) => {
  try {
    const documents = await Rooms.destroy({});
    res.json({ message: documents, status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ message: error, status: "faild" });
  }
};
