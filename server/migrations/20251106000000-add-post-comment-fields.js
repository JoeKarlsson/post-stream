'use strict';

// Brings Posts and Comments in line with server/models/post.js and comment.js.
module.exports = {
  up: async function (queryInterface, Sequelize) {
    for (const table of ['Posts', 'Comments']) {
      await queryInterface.addColumn(table, 'commentCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      });
      await queryInterface.addColumn(table, 'userID', {
        type: Sequelize.STRING,
        allowNull: false
      });
    }
    await queryInterface.addColumn('Comments', 'PostId', {
      type: Sequelize.INTEGER,
      references: { model: 'Posts', key: 'id' },
      onDelete: 'CASCADE'
    });
  },

  down: async function (queryInterface) {
    await queryInterface.removeColumn('Comments', 'PostId');
    for (const table of ['Posts', 'Comments']) {
      await queryInterface.removeColumn(table, 'userID');
      await queryInterface.removeColumn(table, 'commentCount');
    }
  }
};
