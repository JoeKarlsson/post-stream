'use strict';

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    body: {
      type : DataTypes.STRING,
      allowNull : false
    }
  }, {
    classMethods: {
      associate : function(models) {
        Post.belongsTo(models.User);
      }
    }
  });
  return Post;
};