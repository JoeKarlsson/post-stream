'use strict';

const bcrypt = require('bcrypt');

const date = new Date().toISOString();

module.exports = {
  up: async function (queryInterface) {
    // First, create users
    await queryInterface.bulkInsert('Users', [
      {
        username: 'johndoe131',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        first_name: 'John',
        last_name: 'Doe',
        bio: 'Software developer and tech enthusiast',
        isActive: true,
        createdAt: date,
        updatedAt: date
      },
      {
        username: 'janedoe343',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
        first_name: 'Jane',
        last_name: 'Doe',
        bio: 'Designer and creative thinker',
        isActive: true,
        createdAt: date,
        updatedAt: date
      },
      {
        username: 'joejoebinks131',
        email: 'joe@example.com',
        password: await bcrypt.hash('password123', 10),
        first_name: 'Joe',
        last_name: 'Binks',
        bio: 'Full-stack developer and coffee lover',
        isActive: true,
        createdAt: date,
        updatedAt: date
      }
    ], { returning: true });

    // Then create posts
    await queryInterface.bulkInsert('Posts', [
      {
        body: 'Just finished building an amazing new feature! The code is clean and the tests are passing. #coding #success',
        commentCount: 2,
        userID: 'johndoe131',
        createdAt: date,
        updatedAt: date
      },
      {
        body: 'Working on some UI improvements today. The new design system is really coming together nicely.',
        commentCount: 1,
        userID: 'johndoe131',
        createdAt: date,
        updatedAt: date
      },
      {
        body: 'Coffee break time! ☕ Sometimes the best solutions come when you step away from the keyboard.',
        commentCount: 0,
        userID: 'johndoe131',
        createdAt: date,
        updatedAt: date
      },
      {
        body: 'Designing a new user interface for our mobile app. The user experience is going to be incredible!',
        commentCount: 3,
        userID: 'janedoe343',
        createdAt: date,
        updatedAt: date
      },
      {
        body: 'Just learned a new CSS technique that will make our animations much smoother. Always learning!',
        commentCount: 1,
        userID: 'janedoe343',
        createdAt: date,
        updatedAt: date
      },
      {
        body: 'Collaboration with developers is key to creating great products. Communication is everything!',
        commentCount: 0,
        userID: 'janedoe343',
        createdAt: date,
        updatedAt: date
      },
      {
        body: 'Deployed a new version of our API today. The performance improvements are significant!',
        commentCount: 2,
        userID: 'joejoebinks131',
        createdAt: date,
        updatedAt: date
      },
      {
        body: 'Database optimization complete. Query times reduced by 60%! The team is going to love this.',
        commentCount: 1,
        userID: 'joejoebinks131',
        createdAt: date,
        updatedAt: date
      },
      {
        body: 'Code review session was productive today. Great feedback from the team on best practices.',
        commentCount: 0,
        userID: 'joejoebinks131',
        createdAt: date,
        updatedAt: date
      }
    ], { returning: true });

    // Comments will be seeded separately
  },

  down: function (queryInterface) {
    return queryInterface.bulkDelete('Posts', null, {})
      .then(() => {
        return queryInterface.bulkDelete('Users', null, {});
      });
  }
};