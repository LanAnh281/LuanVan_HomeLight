const { Users, Bill_User, Receipt } = require("../models/index.model");

exports.profitSuperAdmin = async (req, res, next) => {
  try {
    const documents = await Users.findAll({
      include: [
        {
          model: Bill_User,
          include: [
            {
              model: Receipt,
            },
          ],
        },
      ],
      where: {
        isUser: true,
      },
    });
    res.json({ message: documents, status: "success" });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
