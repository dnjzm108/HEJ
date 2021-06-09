const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('education', {
    type:{
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ed_image: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    writer:{
      type: DataTypes.STRING(100),
      allowNull: false,
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
