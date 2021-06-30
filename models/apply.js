const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('apply', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    age: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    number: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    replied:{
      type:DataTypes.INTEGER,
      allowNull:true,
      defaultValue:0,
    },
    userdt:{
        type:Sequelize.DATE,
        allowNull:true,
        defaultValue:Sequelize.NOW,
      }
  }, {
    sequelize,
    tableName:'apply',
    timestamps: false
  });
};