const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('education', {
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
      defaultValue:1,
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
    tableName: 'education',
    timestamps: false
  });
};
