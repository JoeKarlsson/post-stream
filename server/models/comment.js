'use strict';
module.exports = function (sequelize, DataTypes) {
  const Comment = sequelize.define('Comment', {
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [1, 255], msg: 'Replies must be 1 to 255 characters' }
      }
    },
    // Which contextual response this is (shared/contextualResponses.mjs);
    // null for older free-form replies
    kind: {
      type: DataTypes.STRING,
      allowNull: true
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