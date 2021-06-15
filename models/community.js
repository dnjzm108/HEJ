const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('community', {
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    writer: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    write_date: {
      type:Sequelize.DATE,
      allowNull:false,
      defaultValue:Sequelize.NOW,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    community_image: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    hit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'community',
    timestamps: false,
  });
};
