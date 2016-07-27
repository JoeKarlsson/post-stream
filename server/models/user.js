'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    first_name: {
      type : DataTypes.STRING,
      notEmpty: true
    },
    last_name: {
      type : DataTypes.STRING,
      notEmpty: true
    },
    bio: {
      type : DataTypes.STRING,
      notEmpty: true
    },
    following: {
      type : DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue : [],
      isArray: true
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