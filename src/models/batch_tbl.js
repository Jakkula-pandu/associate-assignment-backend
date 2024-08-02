const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Batch extends Model {
    static associate(models) {
         Batch.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

    }
  }

  Batch.init(
    {
      batch_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      batch_name: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      users: {
        type: DataTypes.JSONB, 
        allowNull: true,
      },
      //  user_ids: {
      //   type: DataTypes.JSONB, // Store user IDs as a JSON array
      //   allowNull: true,
      // },
    },
    {
      sequelize,
      modelName: "Batch",
      tableName: "batch_tbl",
      timestamps: false,
    }
  );

  return Batch;
};
