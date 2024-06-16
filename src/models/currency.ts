import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/dbConfig';

interface CurrencyAttributes {
  name: string;
  code: number;
}

interface CurrencyCreationAttributes extends Optional<CurrencyAttributes, 'name'> {}

class Currency
  extends Model<CurrencyAttributes, CurrencyCreationAttributes>
  implements CurrencyAttributes
{
  public name!: string;
  public code!: number;
}

Currency.init(
  {
    code: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'currencies',
    modelName: 'Currency',
  },
);

export default Currency;
