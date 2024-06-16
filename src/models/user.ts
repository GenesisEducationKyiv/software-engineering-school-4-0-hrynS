import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/dbConfig';

interface UserAttributes {
  id: number;
  email: string;
  subscribedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'subscribedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public subscribedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    subscribedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  },
);

User.beforeCreate((user) => {
  if (!user.subscribedAt) {
    user.subscribedAt = new Date();
  }
});

export default User;
