const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Batch extends Model {
    static associate(models) {
      Batch.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      Batch.belongsTo(models.Assessment, {
        foreignKey: "assessment_id",
        as: "assessment",
      });
    }
  }

  Batch.init(
    {
      quns_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      question: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
         options: {
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
            is_true: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      assessment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "assessment_tbl",
          key: "assessment_id",
        },
      },

    },
    {
      sequelize,
      modelName: "questions",
      tableName: "questions_tbl",
      timestamps: false,
    }
  );

  return Batch;
};
