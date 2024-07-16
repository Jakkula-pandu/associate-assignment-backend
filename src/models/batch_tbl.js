
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
      // assessment_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: "assessment",
      //     key: "assessment_id",
      //   },
      // },
      // user_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: "User",
      //     key: "user_id",
      //   },
      // },
      username: {
        type: DataTypes.JSON,
        allowNull: true,
      },
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
