'use strict';
module.exports = function (sequelize, DataTypes) {
  const Comment = sequelize.define('Comment', {
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [1, 255], msg: 'Posts must be 1 to 255 characters' }
      }
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
  });

  Comment.associate = function (models) {
    Comment.belongsTo(models.Post);
  };

  return Comment;
};