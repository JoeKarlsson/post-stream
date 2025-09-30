'use strict';

const date = new Date().toISOString();

module.exports = {
    up: async function (queryInterface) {
        // Get existing posts to reference
        const posts = await queryInterface.sequelize.query(
            'SELECT id FROM "Posts" ORDER BY id',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (posts.length === 0) {
            console.log('No posts found. Please run the main seeder first.');
            return;
        }

        // Check if comments already exist
        const existingComments = await queryInterface.sequelize.query(
            'SELECT COUNT(*) as count FROM "Comments"',
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (existingComments[0].count > 0) {
            console.log('Comments already exist. Skipping comment seeding.');
            return;
        }

        // Create comments
        await queryInterface.bulkInsert('Comments', [
            {
                body: 'Great work! The architecture looks solid.',
                commentCount: 0,
                userID: 'janedoe343',
                PostId: posts[0].id,
                createdAt: date,
                updatedAt: date
            },
            {
                body: 'I agree! This will make the codebase much more maintainable.',
                commentCount: 0,
                userID: 'joejoebinks131',
                PostId: posts[0].id,
                createdAt: date,
                updatedAt: date
            },
            {
                body: 'The new design system looks fantastic!',
                commentCount: 0,
                userID: 'janedoe343',
                PostId: posts[1].id,
                createdAt: date,
                updatedAt: date
            },
            {
                body: 'I love the new mobile interface design!',
                commentCount: 0,
                userID: 'johndoe131',
                PostId: posts[3].id,
                createdAt: date,
                updatedAt: date
            },
            {
                body: 'The user flow is so intuitive now.',
                commentCount: 0,
                userID: 'joejoebinks131',
                PostId: posts[3].id,
                createdAt: date,
                updatedAt: date
            },
            {
                body: 'This will definitely improve user engagement.',
                commentCount: 0,
                userID: 'johndoe131',
                PostId: posts[3].id,
                createdAt: date,
                updatedAt: date
            },
            {
                body: 'Which CSS technique are you referring to?',
                commentCount: 0,
                userID: 'johndoe131',
                PostId: posts[4].id,
                createdAt: date,
                updatedAt: date
            },
            {
                body: 'Amazing performance improvements!',
                commentCount: 0,
                userID: 'janedoe343',
                PostId: posts[6].id,
                createdAt: date,
                updatedAt: date
            },
            {
                body: 'The API response times are much better now.',
                commentCount: 0,
                userID: 'johndoe131',
                PostId: posts[6].id,
                createdAt: date,
                updatedAt: date
            },
            {
                body: '60% improvement is incredible!',
                commentCount: 0,
                userID: 'janedoe343',
                PostId: posts[7].id,
                createdAt: date,
                updatedAt: date
            }
        ]);
    },

    down: function (queryInterface) {
        return queryInterface.bulkDelete('Comments', null, {});
    }
};
