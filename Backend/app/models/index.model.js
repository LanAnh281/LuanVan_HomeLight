const { DataTypes, Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../config/index");

const setPrimary = {
  type: DataTypes.STRING,
  defaultValue: () => uuidv4(), // create string unique
  primaryKey: true,
};

// Models

const Account = sequelize.define("Account", {
  _id: setPrimary,
  userName: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên tài khoản khách hàng không được bỏ trống.",
      },
    },
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "mật khẩu khách hàng không được bỏ trống.",
      },
    },
  },
  role: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "mật khẩu khách hàng không được bỏ trống.",
      },
    },
  },
});
const Customer = sequelize.define("Customer", {
  _id: setPrimary,
  userName: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên tài khoản khách hàng không được bỏ trống.",
      },
    },
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "mật khẩu khách hàng không được bỏ trống.",
      },
    },
  },
  role: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "mật khẩu khách hàng không được bỏ trống.",
      },
    },
  },
});
const RegistrationInfo = sequelize.define("RegistrationInfo", {
  _id: setPrimary,
  userName: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên khách hàng không được bỏ trống.",
      },
    },
  },
  identificationCard: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Số CCCD của khách hàng không được bỏ trống.",
      },
    },
  },
  imagePrevious: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Ảnh trước CCCD khách hàng không được bỏ trống.",
      },
    },
  },
  imageAfter: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Ảnh sau CCCD khách hàng không được bỏ trống.",
      },
    },
  },
  phone: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "SĐT khách hàng không được bỏ trống.",
      },
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Địa chỉ khách hàng không được bỏ trống.",
      },
    },
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "email khách hàng không được bỏ trống.",
      },
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "nội dung yêu câu khách hàng không được bỏ trống.",
      },
    },
  },
});
// Sync the model with the database
Account.sync();
Customer.sync();
RegistrationInfo.sync();
module.exports = {
  Account,
  Customer,
  RegistrationInfo,
};
