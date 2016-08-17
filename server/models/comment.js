'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    body: {
      type : DataTypes.STRING,
      allowNull : false,
      required : true
    },
    commentId: {
      type : DataTypes.INTEGER,
      allowNull : false,
      required : true
    },
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