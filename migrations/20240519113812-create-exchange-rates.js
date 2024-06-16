'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('exchange_rates', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      rateBid: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      rateAsk: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      fetchedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      baseCurrencyCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'currencies',
          key: 'code',
        },
      },
      targetCurrencyCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'currencies',
          key: 'code',
        },
      },
    });

    await queryInterface.addConstraint('exchange_rates', {
      fields: ['baseCurrencyCode', 'targetCurrencyCode', 'fetchedAt'],
      type: 'unique',
      name: 'exchange_rate_unique_constraint'
    });
  },
};
