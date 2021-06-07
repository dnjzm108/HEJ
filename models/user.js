const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    userid: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    userpw: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    user_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    user_email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    user_address: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    user_number: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    userimage:{
      type:Sequelize.STRING(100),
      allowNull:true,
    },
    user_birth: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    userdt:{
      type:Sequelize.DATE,
      allowNull:false,
      defaultValue:Sequelize.NOW,
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false
  });
};
