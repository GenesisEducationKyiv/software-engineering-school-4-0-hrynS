import sequelize from '../config/dbConfig';
import { User, Currency, ExchangeRate, Subscription } from './';

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await User.sync({ alter: true });
    await Currency.sync({ alter: true });
    await ExchangeRate.sync({ alter: true });
    await Subscription.sync({ alter: true });

    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default syncDatabase;
