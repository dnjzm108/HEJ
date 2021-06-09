const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('popup', {
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
    tableName: 'popup',
    timestamps: false
  });
};
