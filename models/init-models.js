var DataTypes = require("sequelize").DataTypes;
var _community = require("./community");
var _information = require("./information");
var _qanda = require("./qanda");
var _user = require("./user");
var _comment =require("./comment");
var _admin = require("./admin");
var _popup = require("./popup");
var _hired = require("./hired");
var _education = require("./education");

function initModels(sequelize) {
  var community = _community(sequelize, DataTypes);
  var information = _information(sequelize, DataTypes);
  var qanda = _qanda(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var comment = _comment(sequelize, DataTypes);

  var admin = _admin(sequelize, DataTypes);
  var popup = _popup(sequelize,DataTypes);
  var hired = _hired(sequelize,DataTypes);
  var education = _education(sequelize,DataTypes);

  return {
    community,
    information,
    qanda,
    user,
    comment,
    admin,
    popup,
    hired,
    education,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
