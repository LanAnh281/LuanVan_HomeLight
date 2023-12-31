const { DataTypes, Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../config/index");

const setPrimary = {
  type: DataTypes.STRING,
  defaultValue: () => uuidv4(), // create string unique
  primaryKey: true,
};

// Models
const Roles = sequelize.define("Roles", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên quyền  không được bỏ trống.",
      },
    },
  },
});

const Positions = sequelize.define("Positions", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên vị trí không được bỏ trống.",
      },
    },
  },
});
const Roles_Positions = sequelize.define("Roles_Positions", {});

const Accounts = sequelize.define("Accounts", {
  _id: setPrimary,
  userName: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Tên tài khoản  không được bỏ trống.",
      },
    },
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "mật khẩu tài khoản không được bỏ trống.",
      },
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
  refreshToken: {
    type: DataTypes.STRING,
  },
  refreshTokenExprityTime: {
    type: DataTypes.DATE,
  },
});
const Users = sequelize.define("Users", {
  _id: setPrimary,
  userName: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Họ tên người dùng không được bỏ trống.",
      },
    },
  },
  birthday: { type: DataTypes.DATE },
  sex: { type: DataTypes.BOOLEAN },
  identification: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.TEXT,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Email người dùng không được bỏ trống.",
      },
    },
  },
  phone: {
    type: DataTypes.STRING,
  },
  imagePrevious: {
    type: DataTypes.TEXT,
  },
  imageAfter: {
    type: DataTypes.TEXT,
  },
  numberPlate: { type: DataTypes.TEXT },
  securityDeposit: { type: DataTypes.STRING },
  isUser: { type: DataTypes.BOOLEAN }, // host or not host
});

const BorardingHouse = sequelize.define("BoardingHouse", {
  _id: setPrimary,
  name: {
    type: DataTypes.TEXT,
  },
  address: {
    type: DataTypes.TEXT,
  },
});
const Rule = sequelize.define("Rule", {
  _id: setPrimary,
  rules: {
    type: DataTypes.TEXT,
  },
});
const Rooms = sequelize.define("Rooms", {
  _id: setPrimary,
  name: {
    type: DataTypes.STRING,
  },
  price: { type: DataTypes.STRING },
  wide: { type: DataTypes.INTEGER },
  long: { type: DataTypes.INTEGER },
  status: { type: DataTypes.BOOLEAN },
});
const Spending = sequelize.define("Spending", {
  _id: setPrimary,
  date: { type: DataTypes.DATE },
  reason: { type: DataTypes.TEXT },
  price: { type: DataTypes.STRING },
  isProfit: { type: DataTypes.BOOLEAN },
});
const Bill = sequelize.define("Bill", {
  _id: setPrimary,
  start: { type: DataTypes.DATE },
  end: { type: DataTypes.DATE },
  debt: { type: DataTypes.STRING },
  total: { type: DataTypes.STRING },
});
const Receipt = sequelize.define("Receipt", {
  _id: setPrimary,
  receive: { type: DataTypes.STRING },
  debt: { type: DataTypes.STRING },
});
const UtilityReadings = sequelize.define("UtilityReadings", {
  _id: setPrimary,
  previousElectric: { type: DataTypes.INTEGER },
  currentElectric: { type: DataTypes.INTEGER },
  previousWater: { type: DataTypes.INTEGER },
  currentWater: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATE },
});
const Media = sequelize.define("Media", {
  _id: setPrimary,
  name: { type: DataTypes.STRING },
});
const Equipment = sequelize.define("Equipment", {
  _id: setPrimary,
  name: { type: DataTypes.STRING },
});
const Services = sequelize.define("Service", {
  _id: setPrimary,
  name: { type: DataTypes.TEXT },
  price: { type: DataTypes.STRING },
  unit: { type: DataTypes.STRING },
});
const Note = sequelize.define("Note", {
  _id: setPrimary,
  content: { type: DataTypes.TEXT },
});
const Notification = sequelize.define("Notification", {
  _id: setPrimary,
  date: { type: DataTypes.DATE },
  content: { type: DataTypes.TEXT },
});
const ResetPassword = sequelize.define("ResetPassword", {
  _id: setPrimary,
  email: { type: DataTypes.TEXT },
  resetPasswordExprityTime: {
    type: DataTypes.DATE,
  },
});
// checked
//many-to-many relationship
Roles.belongsToMany(Positions, {
  through: Roles_Positions,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Positions.belongsToMany(Roles, {
  through: Roles_Positions,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// one-to-many relationship
Positions.hasMany(Accounts, {
  foreignKey: "positionId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Accounts.belongsTo(Positions, {
  foreignKey: "positionId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
//one-to-one relationship
Users.hasOne(Accounts, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Accounts.belongsTo(Users, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Users.hasMany(BorardingHouse, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

BorardingHouse.belongsTo(Users, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
BorardingHouse.hasMany(Rooms, {
  foreignKey: "boardingId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Rooms.belongsTo(BorardingHouse, {
  foreignKey: "boardingId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Users.hasMany(Services, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Services.belongsTo(Users, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
BorardingHouse.hasMany(Spending, {
  foreignKey: "boardingId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Spending.belongsTo(BorardingHouse, {
  foreignKey: "boardingId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Rooms.hasMany(Bill, {
  foreignKey: "roomId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Bill.belongsTo(Rooms, {
  foreignKey: "roomId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
const User_Room = sequelize.define("User_Room", {
  _id: setPrimary,
  start: { type: DataTypes.DATE },
  end: { type: DataTypes.DATE },
});
Rooms.belongsToMany(Users, {
  through: User_Room,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Users.belongsToMany(Rooms, {
  through: User_Room,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Bill.hasMany(Receipt, {
  foreignKey: "billId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Receipt.belongsTo(Bill, {
  foreignKey: "billId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Rooms.hasMany(UtilityReadings, {
  foreignKey: "roomId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
UtilityReadings.belongsTo(Rooms, {
  foreignKey: "roomId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Rooms.hasMany(Media, {
  foreignKey: "roomId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Media.belongsTo(Rooms, {
  foreignKey: "roomId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
const Count = sequelize.define("Count", {
  count: { type: DataTypes.INTEGER },
});
Equipment.belongsToMany(Rooms, {
  through: Count,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Rooms.belongsToMany(Equipment, {
  through: Count,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
const Service_Room = sequelize.define("Service_Room", {
  start: { type: DataTypes.DATE },
  end: { type: DataTypes.DATE },
  count: { type: DataTypes.INTEGER },
});
Services.belongsToMany(Rooms, {
  through: Service_Room,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Rooms.belongsToMany(Services, {
  through: Service_Room,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Accounts.hasMany(Notification, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
}),
  Notification.belongsTo(Accounts, {
    foreignKey: "accountId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
const Account_Notification = sequelize.define("Account_Notification", {
  isdelete: { type: DataTypes.BOOLEAN },
});
Accounts.belongsToMany(Notification, {
  through: Account_Notification,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Notification.belongsToMany(Accounts, {
  through: Account_Notification,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// Sync the model with the database
Roles.sync();
Positions.sync();
Roles_Positions.sync();
Accounts.sync();
Users.sync();

BorardingHouse.sync();
Rooms.sync();
Spending.sync();
Bill.sync();
User_Room.sync();
Receipt.sync();

Media.sync();
Equipment.sync();
Count.sync();
Services.sync();
Service_Room.sync();
Note.sync();
Notification.sync();
Account_Notification.sync();
ResetPassword.sync();

Rule.sync();
UtilityReadings.sync();
module.exports = {
  Roles,
  Positions,
  Roles_Positions,
  Accounts,
  Users,
  BorardingHouse,
  Rooms,
  Spending,
  Bill,
  User_Room,
  Receipt,

  Media,
  Equipment,
  Count,
  Services,
  Service_Room,
  Note,
  Notification,
  Account_Notification,
  ResetPassword,
  Rule,
  UtilityReadings,
};
