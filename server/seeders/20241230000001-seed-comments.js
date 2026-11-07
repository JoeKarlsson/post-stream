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
                kind: 'agree_because',
                body: 'agree, because the architecture looks solid',
                commentCount: 0,
                userID: 'janedoe343',
                PostId: posts[0].id,
                createdAt: date,
                updatedAt: date
            },
            {
                kind: 'agree',
                body: 'agree',
                commentCount: 0,
                userID: 'joejoebinks131',
                PostId: posts[0].id,
                createdAt: date,
                updatedAt: date
            },
            {
                kind: 'brilliant',
                body: 'brilliant',
                commentCount: 0,
                userID: 'janedoe343',
                PostId: posts[1].id,
                createdAt: date,
                updatedAt: date
            },
            {
                kind: 'thanks',
                body: 'thank you for sharing',
                commentCount: 0,
                userID: 'johndoe131',
                PostId: posts[3].id,
                createdAt: date,
                updatedAt: date
            },
            {
                kind: 'agree_because',
                body: 'agree, because the user flow is so intuitive now',
                commentCount: 0,
                userID: 'joejoebinks131',
                PostId: posts[3].id,
                createdAt: date,
                updatedAt: date
            },
            {
                kind: 'brilliant',
                body: 'brilliant',
                commentCount: 0,
                userID: 'johndoe131',
                PostId: posts[3].id,
                createdAt: date,
                updatedAt: date
            },
            {
                kind: 'tell_me_more',
                body: 'tell me more about which CSS technique you mean',
                commentCount: 0,
                userID: 'johndoe131',
                PostId: posts[4].id,
                createdAt: date,
                updatedAt: date
            },
            {
                kind: 'brilliant',
                body: 'brilliant',
                commentCount: 0,
                userID: 'janedoe343',
                PostId: posts[6].id,
                createdAt: date,
                updatedAt: date
            },
            {
                kind: 'agree_because',
                body: 'agree, because the API response times are much better',
                commentCount: 0,
                userID: 'johndoe131',
                PostId: posts[6].id,
                createdAt: date,
                updatedAt: date
            },
            {
                kind: 'thanks',
                body: 'thank you for sharing',
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
