'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    // Posts can run to 2048 characters; the stream shows the first 256
    await queryInterface.changeColumn('Posts', 'body', { type: Sequelize.TEXT, allowNull: false });
    // Set when the author edits a post, so it can be marked "(edited)".
    // updatedAt can't do this: it also changes when a reply bumps commentCount.
    await queryInterface.addColumn('Posts', 'editedAt', { type: Sequelize.DATE, allowNull: true });
    // Which contextual response a reply is (null for older free-form replies)
    await queryInterface.addColumn('Comments', 'kind', { type: Sequelize.STRING, allowNull: true });
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Comments', 'kind');
    await queryInterface.removeColumn('Posts', 'editedAt');
    await queryInterface.changeColumn('Posts', 'body', { type: Sequelize.STRING, allowNull: false });
  }
};
