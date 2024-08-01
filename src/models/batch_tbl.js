
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Batch extends Model {
    static associate(models) {
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
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      user_name: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      trainings:{
         type: DataTypes.STRING(70),
        allowNull: true,
      }
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
