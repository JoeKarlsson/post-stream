'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    bio: DataTypes.TEXT,
    following: {
      type : DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue : []
    }
  }, {
    classMethods: {
      associate : function(models) {
        User.hasMany(models.Post, {
          onDelete : 'cascade'
        })
      }
    }
  });
  return User;
};