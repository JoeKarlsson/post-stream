'use strict';

// Who follows whom in the sample data, so the following feed has posts in it.
// Jane follows nobody, so the e2e tests can follow and unfollow from scratch.
const FOLLOWS = [
  ['johndoe131', 'janedoe343'],
  ['johndoe131', 'joejoebinks131'],
  ['joejoebinks131', 'johndoe131'],
  ['joejoebinks131', 'janedoe343']
];

module.exports = {
  up: async function (queryInterface) {
    const users = await queryInterface.sequelize.query('SELECT id, username FROM "Users"', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    });
    const idOf = Object.fromEntries(users.map((u) => [u.username, u.id]));
    const now = new Date();
    await queryInterface.bulkInsert(
      'Follows',
      FOLLOWS.map(([follower, following]) => ({
        followerId: idOf[follower],
        followingId: idOf[following],
        createdAt: now,
        updatedAt: now
      }))
    );
  },

  down: function (queryInterface) {
    return queryInterface.bulkDelete('Follows', null, {});
  }
};
