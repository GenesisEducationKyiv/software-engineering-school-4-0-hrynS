import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/dbConfig';
import Currency from './currency';

interface ExchangeRateAttributes {
  id: number;
  rateBid: number;
  rateAsk: number;
  fetchedAt: Date;
  baseCurrencyCode: number;
  targetCurrencyCode: number;
}

interface ExchangeRateCreationAttributes extends Optional<ExchangeRateAttributes, 'id'> {}

class ExchangeRate
  extends Model<ExchangeRateAttributes, ExchangeRateCreationAttributes>
  implements ExchangeRateAttributes
{
  public id!: number;
  public rateBid!: number;
  public rateAsk!: number;
  public fetchedAt!: Date;
  public baseCurrencyCode!: number;
  public targetCurrencyCode!: number;
}

ExchangeRate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rateBid: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    rateAsk: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    fetchedAt: {
      type: DataTypes.DATE,
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
    tableName: 'exchange_rates',
    indexes: [
      {
        unique: true,
        fields: ['baseCurrencyCode', 'targetCurrencyCode', 'fetchedAt'],
      },
    ],
    modelName: 'ExchangeRate',
  },
);

export default ExchangeRate;
