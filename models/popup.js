const Sequelize = require('sequelize');
const moment = require('moment');
const { INTEGER } = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('popup', {
    writer:{
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    title:{
      type:DataTypes.STRING(100),
      allowNull:false,
    },
    popup_start_date:{
      type:DataTypes.DATE,
      allowNull:false,
    },
    popup_end_date:{
      type:DataTypes.DATE,
      allowNull:false,
    },
    visibility:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    scroll:{
      type: DataTypes.INTEGER,
      allowNull:true,
    },
    pop_width:{
      type: DataTypes.MEDIUMINT,
      allowNull:false,
    },
    pop_height:{
      type: DataTypes.MEDIUMINT,
      allowNull:false,
    },
    pop_locationX:{
      type: DataTypes.MEDIUMINT,
      allowNull:false,
    },
    pop_locationY:{
      type: DataTypes.MEDIUMINT,
      allowNull:false,
    },
    hyperlink:{
      type:DataTypes.TEXT,
      allowNull:true,
    },
    content:{
      type: DataTypes.TEXT('long'),
      allowNull:false,
    },
    type:{
      type:DataTypes.INTEGER,
      allowNull:false
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
