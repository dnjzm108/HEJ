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
      defaultValue:0,
    },
    edName:{
      type:DataTypes.STRING(100),
      allowNull: true,
    },
    ed_start_period:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    ed_end_period:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    time:{
      type: DataTypes.STRING(100),
      allowNull:true,
    },
    fee:{
      type:DataTypes.STRING(100),
      allowNull: true,
    },
    hashtag:{
      type: DataTypes.STRING(100),
      allowNull: true,
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
