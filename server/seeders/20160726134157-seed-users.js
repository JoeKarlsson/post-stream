'use strict';

let date = new Date().toISOString();

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      username: 'JohnDoe131',
      password: 'p455word',
      first_name: 'John',
      last_name: 'Doe',
      bio: 'I am a new user to this site.',
      following: [2, 3],
      createdAt : date,
      updatedAt : date
    },
    {
      username: 'JaneDoe343',
      password: 'p455word',
      first_name: 'Jane',
      last_name: 'Doe',
      bio: 'I am a new user to this site.',
      following: [1, 3],
      createdAt : date,
      updatedAt : date
    },
    {
      username: 'JoeJoeBinks131',
      password: 'p455word',
      first_name: 'Joe',
      last_name: 'Carlson',
      bio: 'I am a new user to this site.',
      following: [1, 2],
      createdAt : date,
      updatedAt : date
    }
    ]),
    queryInterface.bulkInsert('Posts', [
    {
      body: 'JohnDoe131 post 1',
      commentCount: 3,
      createdAt : date,
      updatedAt : date,
      UserId: 1
    },
    {
      body: 'JohnDoe131 post 2',
      commentCount: 3,
      createdAt : date,
      updatedAt : date,
      UserId: 1
    },
    {
      body: 'JohnDoe131 post 3',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      UserId: 1
    },
    {
      body: 'JaneDoe343 post 1',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      UserId: 2
    },
    {
      body: 'JaneDoe343 post 2',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      UserId: 2
    },
    {
      body: 'JaneDoe343 post 3',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      UserId: 2
    },
    {
      body: 'JoeJoeBinks131 post 1',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      UserId: 3
    },
    {
      body: 'JoeJoeBinks131 post 2',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      UserId: 3
    },
    {
      body: 'JoeJoeBinks131 post 3',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      UserId: 3
    }
    ])
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
