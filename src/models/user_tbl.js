const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      empid: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "roles_tbl",
          key: "role_id",
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "user_tbl",
      timestamps: false,
    }
  );

  return User;
};
