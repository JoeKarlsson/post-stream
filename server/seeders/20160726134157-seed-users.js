'use strict';

let date = new Date().toISOString();

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Posts', [
    {
      body: 'JohnDoe131 post 1',
      commentCount: 3,
      createdAt : date,
      updatedAt : date,
      userID: "twitter|3155105136"
    },
    {
      body: 'JohnDoe131 post 2',
      commentCount: 3,
      createdAt : date,
      updatedAt : date,
      userID: "twitter|3155105136"
    },
    {
      body: 'JohnDoe131 post 3',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      userID: "twitter|3155105136"
    },
    {
      body: 'JaneDoe343 post 1',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      userID: "twitter|3155105136"
    },
    {
      body: 'JaneDoe343 post 2',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      userID: "twitter|3155105136"
    },
    {
      body: 'JaneDoe343 post 3',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      userID: "twitter|3155105136"
    },
    {
      body: 'JoeJoeBinks131 post 1',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      userID: "twitter|3155105136"
    },
    {
      body: 'JoeJoeBinks131 post 2',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      userID: "twitter|3155105136"
    },
    {
      body: 'JoeJoeBinks131 post 3',
      commentCount: 0,
      createdAt : date,
      updatedAt : date,
      userID: "twitter|3155105136"
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