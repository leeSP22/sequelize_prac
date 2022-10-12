'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
        postId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Users',
                key:'userId',
            }
        },
        title: {
            type: Sequelize.STRING
        },
        likes: {
            type: Sequelize.INTEGER
        },
        content: {
            type: Sequelize.STRING
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW')

        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW')
        }
});
},
async down(queryInterface, Sequelize) {
await queryInterface.dropTable('Posts');
}
};