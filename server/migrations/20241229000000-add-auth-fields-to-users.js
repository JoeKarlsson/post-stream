'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }).then(() => {
      return queryInterface.addColumn('Users', 'password', {
        type: Sequelize.STRING,
        allowNull: false
      });
    }).then(() => {
      return queryInterface.addColumn('Users', 'isActive', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      });
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'email')
      .then(() => {
        return queryInterface.removeColumn('Users', 'password');
      })
      .then(() => {
        return queryInterface.removeColumn('Users', 'isActive');
      });
  }
};
