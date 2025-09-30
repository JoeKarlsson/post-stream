'use strict';
module.exports = function (sequelize, DataTypes) {
  const Comment = sequelize.define('Comment', {
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true
    },
    commentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    userID: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true
    },
  }, {
    associate: function (models) {
      Comment.belongsTo(models.Post);
    }
  });

  return Comment;
};