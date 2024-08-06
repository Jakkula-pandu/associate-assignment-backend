const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Submission extends Model {
    static associate(models) {
      Submission.belongsTo(models.Batch, {
        foreignKey: "batch_id",
        as: "batch",
      });
      Submission.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    //   Submission.hasMany(models.AssessmentAnswer, {
    //     foreignKey: "submission_id",
    //     as: "answers",
    //   });
    }
  }

  Submission.init(
    {
      submission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      assessment_name: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      is_attempted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "user_tbl",  // Adjusted table name here
          key: "user_id",
        },
      },
      input_answers: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      submission_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      batch_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "batch_tbl",
          key: "batch_id",
        },
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
      modelName: "Submission",
      tableName: "AssessmentSubmissions",
      timestamps: false,
    }
  );

  return Submission;
};
