const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admin', {
    adminid: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    adminpw: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    authority_level: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName:'admin',
    timestamps: false
  });
};