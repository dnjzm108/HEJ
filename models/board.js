const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('board', {
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    userid: {
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
    board_image: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    hit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'board',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idx" },
        ]
      },
    ]
  });
};
