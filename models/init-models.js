var DataTypes = require("sequelize").DataTypes;
var _board = require("./board");
var _information = require("./information");
var _qanda = require("./qanda");
var _user = require("./user");
var _admin = require("./admin")

function initModels(sequelize) {
  var board = _board(sequelize, DataTypes);
  var information = _information(sequelize, DataTypes);
  var qanda = _qanda(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var admin = _admin(sequelize, DataTypes)


  return {
    board,
    information,
    qanda,
    user,
    admin,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
