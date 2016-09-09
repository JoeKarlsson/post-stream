'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    body: {
      type : DataTypes.STRING,
      allowNull : false,
      required : true
    },
    commentCount: {
      type : DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
  }, {
    classMethods: {
      associate: function(models) {
        Comment.belongsTo(models.User);
        Comment.belongsTo(models.Post);
      }
    }
  });

  Comment.isHierarchy();

  return Comment;
};