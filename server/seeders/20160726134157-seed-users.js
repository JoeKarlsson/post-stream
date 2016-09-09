'use strict';

let date = new Date();
date.toISOString();

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
    // queryInterface.bulkInsert('Comments', [
    // {
    //   body: 'JohnDoe131 comment 1 post 1',
    //   commentCount: 2,
    //   PostId : 1,
    //   CommentId : null,
    //   UserId : 1,
    //   createdAt : date,
    //   updatedAt : date
    // },
    // {
    //   body: 'JohnDoe131 comment 1 on comment 1 on post 1',
    //   PostId : 1,
    //   commentCount: 0,
    //   CommentId : 1,
    //   UserId : 1,
    //   createdAt : date,
    //   updatedAt : date
    // },
    // {
    //   body: 'JohnDoe131 comment 2 on comment 1 on post 1',
    //   PostId : 1,
    //   commentCount: 0,
    //   CommentId : 1,
    //   UserId : 1,
    //   createdAt : date,
    //   updatedAt : date
    // },
    // {
    //   body: 'JohnDoe131 comment 1 post 2',
    //   PostId : 2,
    //   commentCount: 0,
    //   CommentId : null,
    //   UserId : 1,
    //   createdAt : date,
    //   updatedAt : date
    // },
    // {
    //   body: 'JohnDoe131 comment 1 post 3',
    //   PostId : 3,
    //   commentCount: 0,
    //   CommentId : null,
    //   UserId : 1,
    //   createdAt : date,
    //   updatedAt : date
    // },
    // {
    //   body: 'JaneDoe343 comment 2 post 1',
    //   PostId : 1,
    //   commentCount: 0,
    //   CommentId : 2,
    //   UserId : 2,
    //   createdAt : date,
    //   updatedAt : date
    // },
    // {
    //   body: 'JaneDoe343 comment 2 post 2',
    //   PostId : 2,
    //   commentCount: 0,
    //   CommentId : 2,
    //   UserId : 2,
    //   createdAt : date,
    //   updatedAt : date
    // },
    // {
    //   body: 'JaneDoe343 comment 2 post 3',
    //   PostId : 3,
    //   commentCount: 0,
    //   CommentId : null,
    //   UserId : 2,
    //   createdAt : date,
    //   updatedAt : date
    // },
    // {
    //   body: 'JaneDoe343 comment 3 post 3',
    //   PostId : 3,
    //   commentCount: 0,
    //   CommentId : null,
    //   UserId : 2,
    //   createdAt : date,
    //   updatedAt : date
    // },
    // {
    //   body: 'JoeJoeBinks131 comment 2 post 1',
    //   PostId : 1,
    //   commentCount: 0,
    //   CommentId : 3,
    //   UserId : 3,
    //   createdAt : date,
    //   updatedAt : date
    // },
    // {
    //   body: 'JoeJoeBinks131 comment 2 post 2',
    //   PostId : 2,
    //   commentCount: 0,
    //   CommentId : 2,
    //   UserId : 3,
    //   createdAt : date,
    //   updatedAt : date
    // },
    // {
    //   body: 'JoeJoeBinks131 comment 2 post 3',
    //   PostId : 3,
    //   commentCount: 0,
    //   CommentId : 3,
    //   UserId : 3,
    //   createdAt : date,
    //   updatedAt : date
    // }
    // ])
  // },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
