'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    body: {
      type : DataTypes.STRING,
      allowNull : false
    },
    CommentId: {
      type : DataTypes.INTEGER,
      defaultValue: null
    }
  }, {
    classMethods: {
      associate: function(models) {
        Comment.belongsTo(models.User);
        Comment.belongsTo(models.Post);
      }
    }
  });
  return Comment;
};