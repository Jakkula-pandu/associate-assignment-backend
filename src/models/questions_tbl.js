const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Questions extends Model {
    static associate(models) {

      Questions.belongsTo(models.Assessment, {
        foreignKey: "assessment_id",
        as: "assessment",
      });
    }
  }

  Questions.init(
    {
      quns_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      no_of_questions:{
         type: DataTypes.INTEGER,
        allowNull: true,
      },
      question_text: {
        type: DataTypes.STRING(270),
        allowNull: true,
      },
    question_type: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
         options: {
        type: DataTypes.JSONB,
      
      },
      correct_answers:{
       type: DataTypes.JSONB,
        allowNull: true,
      },
      userAnswer:{
        type:DataTypes.BOOLEAN,
        allowNull:true
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

  return Questions;
};
