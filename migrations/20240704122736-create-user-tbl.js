'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_tbl', { force: true });
    await queryInterface.createTable('user_tbl', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(70),
        allowNull: true,
      },
      empid: {
        type: Sequelize.STRING(70),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
      },
      created_by: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      created_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'roles_tbl',
          key: 'role_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_tbl');
  }
};
