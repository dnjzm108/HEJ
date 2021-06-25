const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('information', {
    type:{
      type: DataTypes.STRING(100),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    writer:{
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    visibility:{
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:0,
    },
    date:{
      type:Sequelize.DATE,
      allowfull:true,
      defaultValue:Sequelize.NOW,
      get: function(){
          return moment(this.getDataValue('date')).format('YYYY-MM-DD')
      }
    }
  }, {
    sequelize,
    tableName: 'information',
    timestamps: false
  });
};
