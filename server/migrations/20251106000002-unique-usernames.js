'use strict';

// Posts and comments point at users by username, so it has to be unique
module.exports = {
  up: function (queryInterface) {
    return queryInterface.addConstraint('Users', {
      fields: ['username'],
      type: 'unique',
      name: 'users_username_unique'
    });
  },

  down: function (queryInterface) {
    return queryInterface.removeConstraint('Users', 'users_username_unique');
  }
};
