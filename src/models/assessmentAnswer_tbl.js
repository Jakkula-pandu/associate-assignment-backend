const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class AssessmentAnswer extends Model {
    static associate(models) {
      AssessmentAnswer.belongsTo(models.Submission, {
        foreignKey: "submission_id",
        as: "submission",
      });
      AssessmentAnswer.belongsTo(models.questions, {
        foreignKey: "question_id",
        as: "question",
      });
      AssessmentAnswer.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  AssessmentAnswer.init(
    {
      answer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      submission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "AssessmentSubmissions",
          key: "submission_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_tbl",
          key: "user_id",
        },
      },
      answer_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "AssessmentAnswer",
      tableName: "AssessmentAnswers",
      timestamps: false,
    }
  );

  return AssessmentAnswer;
};
