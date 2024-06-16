import { DataTypes, Model, Optional } from 'sequelize';
import User from './user';
import sequelize from '../config/dbConfig';
import Currency from './currency';

interface SubscriptionAttributes {
  id: number;
  userId: number;
  baseCurrencyCode: number;
  targetCurrencyCode: number;
}

interface SubscriptionCreationAttributes extends Optional<SubscriptionAttributes, 'id'> {}

class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes
{
  public id!: number;
  public userId!: number;
  public baseCurrencyCode!: number;
  public targetCurrencyCode!: number;
}

Subscription.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id',
      },
      allowNull: false,
    },
    baseCurrencyCode: {
      type: DataTypes.INTEGER,
      references: {
        model: Currency,
        key: 'code',
      },
      allowNull: false,
    },
    targetCurrencyCode: {
      type: DataTypes.INTEGER,
      references: {
        model: Currency,
        key: 'code',
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'subscriptions',
    modelName: 'Subscription',
  },
);

export default Subscription;
