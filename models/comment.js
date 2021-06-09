const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comment', {
    userid: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    idx: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'comment',
    timestamps: false,

  });
};