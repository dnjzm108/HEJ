const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hired', {
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
    thumbnail:{
      type: DataTypes.TEXT,
      allowNull: true
    },
    creator:{
      type:DataTypes.STRING(50),
      allowNull: true,
    },
    hit:{
      type:DataTypes.INTEGER,
      allowNull:false,
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
    tableName: 'hired',
    timestamps: false
  });
};
