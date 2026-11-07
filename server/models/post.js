'use strict';

module.exports = function (sequelize, DataTypes) {
  const Post = sequelize.define('Post', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: { args: [1, 2048], msg: 'Posts must be 1 to 2048 characters' }
      }
    },
    // Set only when the author edits the post (shown as "(edited)")
    editedAt: {
      type: DataTypes.DATE,
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

  Post.associate = function (models) {
    Post.hasMany(models.Comment, {
      onDelete: 'cascade'
    });
  };

  return Post;
};