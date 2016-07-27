'use strict';

let date = new Date();
date.toISOString();

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      username: 'JohnDoe131',
      first_name: 'John',
      last_name: 'Doe',
      bio: 'I am a new user to this site.',
      following: [2, 3],
      createdAt : date,
      updatedAt : date
    },
    {
      username: 'JaneDoe343',
      first_name: 'Jane',
      last_name: 'Doe',
      bio: 'I am a new user to this site.',
      following: [1, 3],
      createdAt : date,
      updatedAt : date
    },
    {
      username: 'JoeJoeBinks131',
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
      createdAt : date,
      updatedAt : date,
      UserId: 1
    },
    {
      body: 'JohnDoe131 post 2',
      createdAt : date,
      updatedAt : date,
      UserId: 1
    },
    {
      body: 'JohnDoe131 post 3',
      createdAt : date,
      updatedAt : date,
      UserId: 1
    },
    {
      body: 'JaneDoe343 post 1',
      createdAt : date,
      updatedAt : date,
      UserId: 2
    },
    {
      body: 'JaneDoe343 post 2',
      createdAt : date,
      updatedAt : date,
      UserId: 2
    },
    {
      body: 'JaneDoe343 post 3',
      createdAt : date,
      updatedAt : date,
      UserId: 2
    },
    {
      body: 'JoeJoeBinks131 post 1',
      createdAt : date,
      updatedAt : date,
      UserId: 3
    },
    {
      body: 'JoeJoeBinks131 post 2',
      createdAt : date,
      updatedAt : date,
      UserId: 3
    },
    {
      body: 'JoeJoeBinks131 post 3',
      createdAt : date,
      updatedAt : date,
      UserId: 3
    }
    ]),
    queryInterface.bulkInsert('Comments', [
    {
      body: 'JohnDoe131 post 1',
      PostId : 1,
      CommentId : 1,
      UserId : 1,
      createdAt : date,
      updatedAt : date
    },
    {
      body: 'JohnDoe131 post 2',
      PostId : 2,
      CommentId : 1,
      UserId : 1,
      createdAt : date,
      updatedAt : date
    },
    {
      body: 'JohnDoe131 post 3',
      PostId : 3,
      CommentId : 1,
      UserId : 1,
      createdAt : date,
      updatedAt : date
    },
    {
      body: 'JaneDoe343 post 1',
      PostId : 1,
      CommentId : 2,
      UserId : 2,
      createdAt : date,
      updatedAt : date
    },
    {
      body: 'JaneDoe343 post 2',
      PostId : 2,
      CommentId : 2,
      UserId : 2,
      createdAt : date,
      updatedAt : date
    },
    {
      body: 'JaneDoe343 post 3',
      PostId : 3,
      CommentId : 3,
      UserId : 2,
      createdAt : date,
      updatedAt : date
    },
    {
      body: 'JoeJoeBinks131 post 1',
      PostId : 1,
      CommentId : 1,
      UserId : 3,
      createdAt : date,
      updatedAt : date
    },
    {
      body: 'JoeJoeBinks131 post 2',
      PostId : 2,
      CommentId : 2,
      UserId : 3,
      createdAt : date,
      updatedAt : date
    },
    {
      body: 'JoeJoeBinks131 post 3',
      PostId : 3,
      CommentId : 3,
      UserId : 3,
      createdAt : date,
      updatedAt : date
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
